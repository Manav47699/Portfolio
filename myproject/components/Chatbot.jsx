"use client";

import { useState, useEffect, useRef } from "react";

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I’m Lucky, Manav’s portfolio assistant. I can provide quick insights into his background, technical skills, and hobbies."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // -----------------------------
  // SEND TEXT MESSAGE
  // -----------------------------
  async function sendMessage(text) {
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      const botMessage = { role: "assistant", content: data.answer || "Sorry, I cannot generate an answer." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="font-sans">
      {/* Floating AI Button */}
{!chatOpen && (
  <button
    className="fixed bottom-5 right-5 w-16 h-16 rounded-full overflow-hidden shadow-2xl animate-bounce-slow z-50"
    style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)" }}
    onClick={() => setChatOpen(true)}
  >
    <img
      src="/images/mascot.jpeg"
      alt="Chatbot"
      className="w-full h-full object-cover"
    />
  </button>
)}


      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 md:bottom-20 md:right-5 md:inset-auto md:w-96 md:h-auto w-full h-full bg-white md:rounded-3xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-zoom z-50">
          {/* Header */}
          <div
            className="px-4 py-3 font-bold text-lg flex justify-between items-center md:rounded-t-3xl shadow-inner"
            style={{ background: "linear-gradient(90deg, #4F46E5, #6366F1)", color: "#fff" }}
          >
            <span>Lucky, the assistant bot</span>
            <button
              className="text-white font-bold text-xl hover:text-gray-200 transition w-8 h-8 flex items-center justify-center"
              onClick={() => setChatOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 flex-1 md:h-72 overflow-y-auto flex flex-col space-y-2 bg-gray-50 text-black">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-[75%] transition-all duration-500 ${
                  msg.role === "user"
                    ? "bg-blue-200 self-end"
                    : "bg-gray-100 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="text-gray-500 text-sm animate-pulse self-start">Thinking…</div>
            )}

            <div ref={messagesEndRef}></div>
          </div>

          {/* Input & Voice */}
          <div className="flex p-2 border-t border-gray-200 bg-gray-50 md:rounded-b-3xl gap-1 text-black">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l-2xl px-3 py-2 focus:outline-none focus:ring focus:ring-purple-300 text-black"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (sendMessage(input), setInput(""))}
            />
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-r-2xl hover:bg-blue-700"
              onClick={() => {
                sendMessage(input);
                setInput("");
              }}
            >
              Send
            </button>

            
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes zoom {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoom {
          animation: zoom 0.4s ease-out;
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </div>
  );
}