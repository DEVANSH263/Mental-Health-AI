import { NextResponse } from 'next/server';
import { getDatabase } from '@/src/utils/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Validation schema for journal entries
const journalEntrySchema = z.object({
  userId: z.string().nullable(),
  content: z.string().min(1),
  mood: z.number().min(1).max(5),
  tags: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
});

// GET /api/journal - Get user's journal entries
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const db = await getDatabase();
    const query = userId ? { userId: new ObjectId(userId) } : {};
    const entries = await db.collection('journal_entries')
      .find(query)
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/journal - Create a new journal entry
export async function POST(request: Request) {
  try {
    console.log('=== Starting journal entry processing ===');
    const body = await request.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    
    const validatedData = journalEntrySchema.parse(body);
    console.log('Validated data:', JSON.stringify(validatedData, null, 2));
    
    const db = await getDatabase();
    
    // Prepare entry data
    const entryData = {
      ...validatedData,
      userId: validatedData.userId ? new ObjectId(validatedData.userId) : null,
      timestamp: new Date(),
      sentiment: 0, // Placeholder for sentiment analysis
    };
    
    console.log('Preparing to save entry:', JSON.stringify(entryData, null, 2));
    
    const result = await db.collection('journal_entries').insertOne(entryData);
    console.log('Successfully saved entry. Insert result:', JSON.stringify(result, null, 2));

    return NextResponse.json({ 
      success: true, 
      entryId: result.insertedId 
    });
  } catch (error) {
    console.error('=== Error in journal entry processing ===');
    console.error('Full error details:', error);
    if (error instanceof z.ZodError) {
      console.error('Validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating journal entry:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 