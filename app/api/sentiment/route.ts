import { NextResponse } from 'next/server';
import { z } from 'zod';

// Mock sentiment analysis function
function analyzeSentiment(text: string): number {
  // This is a mock implementation
  // In a real application, you would use a proper sentiment analysis model
  const positiveWords = ['happy', 'good', 'great', 'love', 'joy', 'peace'];
  const negativeWords = ['sad', 'bad', 'terrible', 'hate', 'angry', 'anxious'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  // Normalize score to -1 to 1 range
  return Math.max(-1, Math.min(1, score / 10));
}

// Validation schema for sentiment analysis request
const sentimentRequestSchema = z.object({
  text: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = sentimentRequestSchema.parse(body);
    
    const sentiment = analyzeSentiment(text);
    
    return NextResponse.json({
      sentiment,
      analysis: {
        score: sentiment,
        magnitude: Math.abs(sentiment),
        label: sentiment > 0 ? 'positive' : sentiment < 0 ? 'negative' : 'neutral'
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error analyzing sentiment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 