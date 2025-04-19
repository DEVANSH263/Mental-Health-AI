import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDatabase } from '@/src/utils/mongodb';
import { generateAIResponse } from '@/src/utils/gemini';

// Validation schema for chat messages
const chatMessageSchema = z.object({
  userId: z.string().nullable().optional(),
  message: z.string().min(1),
});

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
  console.log('Starting chat message processing...');
  
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    // Validate request data
    const validatedData = chatMessageSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Connect to database
    const db = await getDatabase();
    console.log('Database connection successful');

    // Generate AI response
    console.log('Generating AI response...');
    const aiResponse = await generateAIResponse(validatedData.message);
    console.log('AI response generated:', aiResponse);

    // Save message to database
    const result = await db.collection('chat_messages').insertOne({
      userId: validatedData.userId || 'anonymous',
      message: validatedData.message,
      response: aiResponse,
      timestamp: new Date(),
      sentiment: 'neutral' // You can add sentiment analysis here if needed
    });

    console.log('Message saved to database with ID:', result.insertedId);

    // Verify the message was saved
    const savedMessage = await db.collection('chat_messages').findOne({ _id: result.insertedId });
    console.log('Saved message retrieved:', savedMessage);

    return NextResponse.json({
      success: true,
      message: 'Chat message processed successfully',
      data: {
        messageId: result.insertedId,
        response: aiResponse
      }
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    
    // Determine if it's a validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      }, { status: 400 });
    }

    // Handle other types of errors
    return NextResponse.json({
      success: false,
      message: 'Error processing chat message',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 