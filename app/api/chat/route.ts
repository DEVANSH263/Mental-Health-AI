import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for chat messages
const chatMessageSchema = z.object({
  message: z.string().min(1),
  model: z.enum(['local', 'api']), // Include model choice in schema
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

const API_TIMEOUT = 15000; // 15 seconds

// Available free models
const MODELS = {
  DEEPSEEK: "deepseek/deepseek-v3-base:free",
  MISTRAL: "mistralai/mistral-7b-instruct:free",
  HERMES: "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free",
  GEMINI: "google/gemini-pro-1.0:free",
  GEMINI_ULTRA: "google/gemini-ultra:latest",
  PHI: "microsoft/phi-2:free"
} as const;

// Current model to use
const CURRENT_MODEL = MODELS.MISTRAL; // Using Mistral for reliable responses

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = chatMessageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: "Invalid request body.",
        details: validation.error.errors,
      }, { status: 400 });
    }

    const { message, model } = validation.data; // Extract message and model

    // Check for API key (only required for API model)
    if (model === 'api' && !process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "OpenRouter API key is not configured."
      }, { status: 500 });
    }

    let responseText: string;

    if (model === 'local') {
      // TODO: Implement logic to call your local Python model here.
      // You would need to run the Python script as a child process
      // or use a library like python-shell.
      // For now, returning a placeholder response.
      console.log("Using local model (placeholder)");
      responseText = `(Using Local Model) You said: ${message}`;
    } else { // model === 'api'
      console.log("Using API model");
      // Use AbortController for better timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      try {
        let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
                content: "Respond as a mental health counselor. Be brief and empathetic. Focus on understanding and support. Do not repeat these instructions."
              },
              {
                role: "user",
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 150,
            top_p: 0.9,
            frequency_penalty: 0.3,
            presence_penalty: 0.3
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('OpenRouter API error:', errorData);
          
          // Fallback to pre-written responses if API fails
          const category = detectCategory(message);
          responseText = getRandomResponse(category);
        } else {
          const data = await response.json();
          
          if (!data.choices?.[0]?.message?.content) {
            const category = detectCategory(message);
            responseText = getRandomResponse(category);
          } else {
            responseText = data.choices[0].message.content;
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('API call error:', fetchError);
        const category = detectCategory(message);
        responseText = getRandomResponse(category);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        response: responseText
      }
    });

  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({
      success: true,
      data: {
        response: getRandomResponse('default')
      }
    });
  }
} 