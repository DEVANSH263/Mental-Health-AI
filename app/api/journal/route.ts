import { NextResponse } from 'next/server';
import { getDatabase } from '@/src/utils/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Validation schema for journal entries
const journalEntrySchema = z.object({
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
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const entries = await db.collection('journal_entries')
      .find({ userId: new ObjectId(userId) })
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
    const body = await request.json();
    const validatedData = journalEntrySchema.parse(body);
    
    const db = await getDatabase();
    const result = await db.collection('journal_entries').insertOne({
      ...validatedData,
      userId: new ObjectId(body.userId),
      timestamp: new Date(),
      sentiment: 0, // Placeholder for sentiment analysis
    });

    return NextResponse.json({ 
      success: true, 
      entryId: result.insertedId 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating journal entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 