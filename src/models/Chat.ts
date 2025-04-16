import { ObjectId } from 'mongodb';
import { getDatabase } from '../utils/mongodb';

export interface ChatMessage {
  _id?: ObjectId;
  userId: ObjectId;
  message: string;
  response: string;
  timestamp: Date;
  context?: {
    previousMood?: number;
    recentJournalEntry?: string;
    timeOfDay?: string;
  };
  sentiment?: number;
  category?: string;
  followUp?: {
    action?: string;
    resources?: string[];
    nextSteps?: string[];
  };
}

export async function saveChatMessage(
  message: Omit<ChatMessage, '_id'>
): Promise<ChatMessage> {
  const db = await getDatabase();
  const result = await db.collection<ChatMessage>('chat_messages').insertOne({
    ...message,
    timestamp: new Date(),
  });
  return { ...message, _id: result.insertedId };
}

export async function getChatHistory(
  userId: string,
  limit: number = 50
): Promise<ChatMessage[]> {
  const db = await getDatabase();
  return db
    .collection<ChatMessage>('chat_messages')
    .find({ userId: new ObjectId(userId) })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();
}

export async function generateChatInsights(
  userId: string
): Promise<{
  commonConcerns: string[];
  sentimentTrend: number[];
  suggestedResources: string[];
}> {
  const db = await getDatabase();
  const messages = await db
    .collection<ChatMessage>('chat_messages')
    .find({ userId: new ObjectId(userId) })
    .sort({ timestamp: 1 })
    .toArray();

  // Extract sentiment values
  const sentimentTrend = messages
    .filter((msg) => msg.sentiment !== undefined)
    .map((msg) => msg.sentiment as number);

  // Extract categories as common concerns
  const categoryCounts: { [key: string]: number } = {};
  messages.forEach((msg) => {
    if (msg.category) {
      categoryCounts[msg.category] = (categoryCounts[msg.category] || 0) + 1;
    }
  });

  const commonConcerns = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category]) => category);

  // Collect suggested resources
  const suggestedResources = Array.from(
    new Set(
      messages
        .flatMap((msg) => msg.followUp?.resources || [])
        .filter(Boolean)
    )
  );

  return {
    commonConcerns,
    sentimentTrend,
    suggestedResources,
  };
} 