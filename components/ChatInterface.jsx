
import React, { useState, useRef, useEffect } from 'react';
import { getAIResponse } from '../services/geminiService.js';

const ChatInterface = ({ documents }) => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello! I'm your SmartSupport assistant. I've been trained on your company's documents to help you quickly. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const responseText = await getAiResponse(currentInput, messages, documents);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: 'err',
        role: 'assistant',
        text: "I encountered an error connecting to my knowledge base. Please try again later.",
        timestamp: 'Error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="chat-container flex-grow-1 p-3 p-md-4" ref={scrollRef}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {messages.map(msg => (
            <div key={msg.id} className={`d-flex flex-column mb-3 ${msg.role === 'user' ? 'align-items-end' : 'align-items-start'}`}>
              <div className={`message-bubble ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                <div className={`timestamp ${msg.role === 'user' ? 'text-white-50 text-end' : 'text-muted'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="ai-message message-bubble text-muted d-flex align-items-center">
              <div className="spinner-grow spinner-grow-sm me-2 text-primary" role="status"></div>
              <span>Analyzing knowledge base...</span>
            </div>
          )}
        </div>
      </div>

      <div className="sticky-input">
        <div className="container" style={{ maxWidth: '900px' }}>
          <form onSubmit={handleSend} className="input-group shadow-lg rounded-pill overflow-hidden border">
            <input
              type="text"
              className="form-control border-0 bg-white p-3 ps-4"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ boxShadow: 'none' }}
            />
            <button className="btn btn-primary px-4 border-0" type="submit" disabled={!input.trim() || loading}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
          <div className="text-center text-muted mt-2" style={{ fontSize: '0.7rem' }}>
            SmartSupport AI uses verified documentation to provide accurate answers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
