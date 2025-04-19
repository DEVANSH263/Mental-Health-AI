"use client"

import { useState } from 'react';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add loading message
      setMessages(prev => [...prev, { text: "Thinking...", isUser: false }]);

      // Set timeout for the API call
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 30000);
      });

      // Send to API with retry logic
      let attempts = 0;
      const maxAttempts = 3;
      let lastError: Error | null = null;

      while (attempts < maxAttempts) {
        try {
          const responsePromise = fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input })
          });

          const response = await Promise.race([responsePromise, timeoutPromise]) as Response;
          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || 'Failed to get response');
          }

          // Remove loading message and add bot response
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages.pop(); // Remove loading message
            return [...newMessages, { 
              text: data.data.response, 
              isUser: false
            }];
          });
          return; // Success, exit the loop
        } catch (error) {
          lastError = error as Error;
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }

      // If we get here, all attempts failed
      throw lastError || new Error('Failed to get response after multiple attempts');
    } catch (error) {
      console.error('Error:', error);
      // Remove loading message and add error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove loading message
        return [...newMessages, { 
          text: error instanceof Error && error.message === 'Request timed out'
            ? "The response is taking longer than usual. Please try again in a moment."
            : "I'm having trouble connecting right now. Please try again in a moment.", 
          isUser: false 
        }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B1D]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-purple-400 text-xl">⚡</span>
            </div>
            <h1 className="text-white text-3xl">Chat Support</h1>
          </div>
        </div>
        <p className="text-gray-400 mb-8">A safe space to share your thoughts and feelings.</p>
        
        <div className="bg-[#13133D] rounded-3xl p-6 shadow-xl">
          <div className="h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent mb-6">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div 
                  className={`px-5 py-3 max-w-[80%] ${
                    msg.isUser 
                      ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm' 
                      : msg.text === "Thinking..." 
                        ? 'bg-[#1D1D4D] text-gray-400 rounded-2xl rounded-tl-sm animate-pulse'
                        : 'bg-[#1D1D4D] text-gray-200 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-[#1D1D4D] text-gray-200 border-none outline-none placeholder:text-gray-500 py-4 px-5 rounded-2xl"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className={`px-8 rounded-2xl ${
                isLoading 
                  ? 'bg-purple-800 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white transition-colors font-medium`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.2);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(147, 51, 234, 0.3);
        }
      `}</style>
    </div>
  );
}

