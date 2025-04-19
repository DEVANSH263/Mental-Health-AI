"use client"

import { useState } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      
      // Add bot response
      if (data.success) {
        setMessages(prev => [...prev, { text: data.data.response, isUser: false }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble responding right now.", 
        isUser: false 
      }]);
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
            />
            <button
              onClick={sendMessage}
              className="px-8 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition-colors font-medium"
            >
              Send
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

