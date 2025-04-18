import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/src/utils/mongodb';

// Validation schema for chat messages
const chatMessageSchema = z.object({
  userId: z.string().nullable().optional(),
  message: z.string().min(1),
});

// Pre-written responses for different situations
const responses = {
  stress: [
    "I understand you're feeling stressed. Would you like to talk about what's causing it?",
    "When you're feeling stressed, it can help to take a few deep breaths. Would you like to try that together?",
    "Stress can feel overwhelming. Let's break down what's bothering you - what's the main thing on your mind?",
    "I hear that you're stressed. Sometimes making a list of what's causing stress can help. Would you like to share yours?",
    "It's normal to feel stressed sometimes. What usually helps you feel more relaxed?",
    "When did you start feeling this stress? Sometimes understanding the trigger can help."
  ],
  sadness: [
    "I'm here to listen. Would you like to share what's making you feel sad?",
    "It's okay to feel sad. You don't have to go through this alone.",
    "Your feelings are valid. What do you think triggered this sadness?",
    "Sometimes sadness can feel heavy. Would you like to talk about what's weighing on you?",
    "I'm here to support you through this. Have you talked to anyone else about how you're feeling?",
    "When you're feeling sad, what usually helps lift your spirits?"
  ],
  anxiety: [
    "Anxiety can be really tough. What specific worries are on your mind?",
    "Let's take this one step at a time. What's your biggest concern right now?",
    "Sometimes anxiety makes our thoughts race. Would it help to talk through them?",
    "I understand anxiety can feel overwhelming. Have you tried any breathing exercises?",
    "It's okay to feel anxious. Would you like to explore what might be triggering these feelings?",
    "When you feel anxious, what usually helps you feel more grounded?"
  ],
  loneliness: [
    "Feeling lonely can be really hard. Would you like to talk about it?",
    "I'm here to listen and keep you company. How long have you been feeling this way?",
    "It's okay to feel lonely sometimes. What kind of connection are you missing?",
    "Even though you feel alone, you're not alone in this. I'm here to talk.",
    "Loneliness can be difficult to deal with. What activities usually help you feel more connected?"
  ],
  default: [
    "I'm here to listen and support you. How are you feeling today?",
    "Would you like to talk about what's on your mind?",
    "I'm here for you. What would you like to discuss?",
    "Your feelings matter. What's been going on lately?",
    "Sometimes talking things through can help. What's been happening?",
    "I'm listening. What's been on your mind?"
  ]
};

// Helper function to get a random response
function getRandomResponse(category: keyof typeof responses): string {
  const categoryResponses = responses[category];
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
}

// Helper function to detect the category of the message
function detectCategory(message: string): keyof typeof responses {
  const lowerMessage = message.toLowerCase();
  
  // Check for multiple keywords to better understand context
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm') || lowerMessage.includes('pressure')) 
    return 'stress';
  
  if (lowerMessage.includes('sad') || lowerMessage.includes('depress') || lowerMessage.includes('down') || lowerMessage.includes('unhappy')) 
    return 'sadness';
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worry') || lowerMessage.includes('nervous') || lowerMessage.includes('fear')) 
    return 'anxiety';
  
  if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) 
    return 'loneliness';
  
  return 'default';
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const API_TIMEOUT = 15000; // 15 seconds

// Available free models
const MODELS = {
  DEEPSEEK: "deepseek/deepseek-r1:free",
  MISTRAL: "mistralai/mistral-7b-instruct:free",
  HERMES: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free",
  PHI: "microsoft/phi-2:free"
} as const;

// Current model to use
const CURRENT_MODEL = MODELS.MISTRAL; // Mistral is often faster than DeepSeek

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export async function GET() {
  try {
    console.log('Fetching chat messages...');
    const db = await getDatabase();
    
    // Get all messages, sorted by timestamp
    const messages = await db.collection('chat_messages')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)  // Limit to last 50 messages
      .toArray();

    console.log(`Found ${messages.length} messages`);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch messages',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Mental Health AI'
      },
      body: JSON.stringify({
        model: CURRENT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a compassionate mental health counselor. Keep responses concise and focused. Be empathetic but direct. Maximum 2-3 sentences per response."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from AI');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        response: data.choices[0].message.content,
        model: CURRENT_MODEL // Send back which model was used
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error 
        ? error.message.includes('timeout') 
          ? 'The AI service is taking longer than expected to respond. Please try again in a moment.'
          : 'Failed to connect to the AI service. Please try again later.'
        : 'An unexpected error occurred'
    }, { status: 500 });
  }
} 