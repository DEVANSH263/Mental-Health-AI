import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateAIResponse(message: string, context?: any): Promise<string> {
  try {
    console.log('Starting Gemini response generation...');
    
    // Get the generative model with the correct model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    // Construct context string if available
    let contextString = '';
    if (context) {
      if (context.previousMood) {
        contextString += `User's previous mood rating: ${context.previousMood}/10. `;
      }
      if (context.recentJournalEntry) {
        contextString += `Recent journal entry: ${context.recentJournalEntry}. `;
      }
      if (context.timeOfDay) {
        contextString += `Time of day: ${context.timeOfDay}. `;
      }
    }

    // Generate response
    const systemPrompt = "You are a supportive mental health companion. Provide empathetic, understanding responses that encourage open dialogue. Focus on active listening and validation. Never give medical advice or diagnoses. If someone expresses thoughts of self-harm or suicide, direct them to professional help and emergency services.";
    
    const userMessage = contextString ? `${contextString}\n${message}` : message;
    
    console.log('Sending request to Gemini with message:', userMessage);
    
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userMessage }
    ]);

    const response = result.response.text();
    
    if (!response) {
      console.warn('No response content from Gemini');
      return "I'm here to listen and support you. Could you tell me more about how you're feeling?";
    }
    
    console.log('Successfully generated Gemini response');
    return response;

  } catch (error) {
    console.error('Error generating Gemini response:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return "I apologize, but there seems to be an issue with the API configuration. Please try again later.";
      }
      if (error.message.includes('rate limit')) {
        return "I'm currently handling too many requests. Please try again in a moment.";
      }
    }
    
    return "I'm here to listen and support you. Could you tell me more about how you're feeling?";
  }
} 