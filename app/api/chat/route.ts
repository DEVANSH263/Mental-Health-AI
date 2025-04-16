import { NextResponse } from 'next/server';
import { getDatabase } from '@/src/utils/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Mock AI response function
function generateAIResponse(message: string, context?: any): string {
  // This is a mock implementation
  // In a real application, you would use a proper AI model
  const responses = {
    greeting: [
      "Hello! How are you feeling today?",
      "Hi there! I'm here to listen. What's on your mind?",
      "Welcome! How can I support you today?"
    ],
    stress: [
      "I understand you're feeling stressed. Would you like to talk about what's causing this?",
      "Stress can be overwhelming. Let's explore some coping strategies together.",
      "It's okay to feel stressed. Would you like to try some breathing exercises?"
    ],
    anxiety: [
      "Anxiety can be challenging. Let's work through this together.",
      "I hear you're feeling anxious. Would you like to try some grounding techniques?",
      "It's okay to feel anxious. Let's explore what's triggering this feeling."
    ],
    default: [
      "I'm here to listen. Can you tell me more about how you're feeling?",
      "That sounds difficult. Would you like to explore this further?",
      "I understand. How can I support you right now?"
    ]
  };

  // Simple keyword matching for response selection
  const messageLower = message.toLowerCase();
  let category = 'default';
  
  if (messageLower.includes('hello') || messageLower.includes('hi')) {
    category = 'greeting';
  } else if (messageLower.includes('stress') || messageLower.includes('overwhelm')) {
    category = 'stress';
  } else if (messageLower.includes('anxious') || messageLower.includes('anxiety')) {
    category = 'anxiety';
  }

  const possibleResponses = responses[category as keyof typeof responses];
  return possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
}

// Validation schema for chat messages
const chatMessageSchema = z.object({
  userId: z.string(),
  message: z.string().min(1),
  context: z.object({
    previousMood: z.number().optional(),
    recentJournalEntry: z.string().optional(),
    timeOfDay: z.string().optional(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = chatMessageSchema.parse(body);
    
    const db = await getDatabase();
    const aiResponse = generateAIResponse(validatedData.message, validatedData.context);
    
    // Save the chat message
    const result = await db.collection('chat_messages').insertOne({
      userId: new ObjectId(validatedData.userId),
      message: validatedData.message,
      response: aiResponse,
      timestamp: new Date(),
      context: validatedData.context,
      sentiment: 0, // Placeholder for sentiment analysis
    });

    return NextResponse.json({
      success: true,
      messageId: result.insertedId,
      response: aiResponse
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error processing chat message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 