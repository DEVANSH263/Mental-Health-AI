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
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Add loading message
      setMessages(prev => [...prev, { text: "Thinking...", isUser: false }]);

      // Set timeout for the fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // Increased timeout to 20s

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server error');
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
    } catch (error) {
      console.error('Error:', error);
      // Remove loading message and add error message
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove loading message
        let errorMessage = "I'm having trouble connecting right now. Please try again in a moment.";
        
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            errorMessage = "The response is taking too long. Please try again.";
          } else if (error.message.includes('Rate limit')) {
            errorMessage = "We're receiving too many requests. Please wait a moment and try again.";
          } else if (error.message.includes('configuration')) {
            errorMessage = "There's a technical issue with the service. Please try again later.";
          } else if (error.message.includes('unavailable')) {
            errorMessage = "The AI service is temporarily unavailable. Please try again in a few minutes.";
          } else {
            errorMessage = error.message || "There was a problem with the server. Please try again.";
          }
        }
        
        return [...newMessages, { 
          text: errorMessage,
          isUser: false 
        }];
      });

      // Add delay for rate limit and server errors
      if (error instanceof Error && 
          (error.message.includes('Rate limit') || error.message.includes('Server error'))) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B1D]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-purple-400 text-xl">⚡</span>
            </div>
            <h1 className="text-white text-3xl">Chat Support</h1>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm transition-colors"
            >
              Clear Chat
            </button>
          )}
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
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
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

