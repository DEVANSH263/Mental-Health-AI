import { ObjectId } from 'mongodb';
import { getDatabase } from '../utils/mongodb';

export interface JournalEntry {
  _id?: ObjectId;
  userId: ObjectId;
  content: string;
  timestamp: Date;
  mood: number;
  tags?: string[];
  location?: string;
  activities?: string[];
  sentiment?: number;
  keywords?: string[];
  insights?: string[];
}

export async function createJournalEntry(
  entry: Omit<JournalEntry, '_id'>
): Promise<JournalEntry> {
  const db = await getDatabase();
  const result = await db.collection<JournalEntry>('journal_entries').insertOne({
    ...entry,
    timestamp: new Date(),
  });
  return { ...entry, _id: result.insertedId };
}

export async function getJournalEntries(
  userId: string,
  filters: {
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
  } = {}
): Promise<JournalEntry[]> {
  const db = await getDatabase();
  const query: any = { userId: new ObjectId(userId) };

  if (filters.startDate || filters.endDate) {
    query.timestamp = {};
    if (filters.startDate) query.timestamp.$gte = filters.startDate;
    if (filters.endDate) query.timestamp.$lte = filters.endDate;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  return db
    .collection<JournalEntry>('journal_entries')
    .find(query)
    .sort({ timestamp: -1 })
    .toArray();
}

export async function analyzeJournalPatterns(
  userId: string
): Promise<{
  moodTrends: { date: Date; mood: number }[];
  commonTopics: string[];
}> {
  const db = await getDatabase();
  const entries = await db
    .collection<JournalEntry>('journal_entries')
    .find({ userId: new ObjectId(userId) })
    .sort({ timestamp: 1 })
    .toArray();

  const moodTrends = entries.map((entry) => ({
    date: entry.timestamp,
    mood: entry.mood,
  }));

  // Simple topic analysis based on tags
  const tagCounts: { [key: string]: number } = {};
  entries.forEach((entry) => {
    entry.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const commonTopics = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  return { moodTrends, commonTopics };
} 