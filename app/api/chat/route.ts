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
  userId: z.string().nullable(),
  message: z.string().min(1),
  context: z.object({
    previousMood: z.number().optional(),
    recentJournalEntry: z.string().optional(),
    timeOfDay: z.string().optional(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    console.log('=== Starting chat message processing ===');
    console.log('Request URL:', request.url);
    console.log('Request method:', request.method);
    
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    const validatedData = chatMessageSchema.parse(body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));
    
    console.log('Attempting database connection...');
    const db = await getDatabase();
    console.log('Successfully connected to database');
    
    // Check if collection exists
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    const aiResponse = generateAIResponse(validatedData.message, validatedData.context);
    console.log('Generated AI response:', aiResponse);
    
    // Save the chat message
    const messageData = {
      userId: validatedData.userId ? new ObjectId(validatedData.userId) : null,
      message: validatedData.message,
      response: aiResponse,
      timestamp: new Date(),
      context: validatedData.context,
      sentiment: 0, // Placeholder for sentiment analysis
    };
    console.log('Preparing to save message:', JSON.stringify(messageData, null, 2));

    let result;
    try {
      console.log('Attempting to insert into chat_messages collection...');
      result = await db.collection('chat_messages').insertOne(messageData);
      console.log('Successfully saved message. Insert result:', JSON.stringify(result, null, 2));
      
      // Verify the document was inserted
      const insertedDoc = await db.collection('chat_messages').findOne({ _id: result.insertedId });
      console.log('Verified inserted document:', JSON.stringify(insertedDoc, null, 2));
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      messageId: result.insertedId,
      response: aiResponse
    });
  } catch (error) {
    console.error('=== Error in chat processing ===');
    console.error('Full error details:', error);
    if (error instanceof z.ZodError) {
      console.error('Validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error processing chat message:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 