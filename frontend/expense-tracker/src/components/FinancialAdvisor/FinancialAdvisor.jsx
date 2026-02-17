import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageCircle } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import "./FinancialAdvisor.css";

// Simple markdown to HTML converter
const renderMarkdown = (text) => {
  let html = text;

  // Headers
  html = html.replace(/### (.*?)\n/g, '<h5>$1</h5>');
  html = html.replace(/## (.*?)\n/g, '<h4>$1</h4>');
  html = html.replace(/# (.*?)\n/g, '<h3>$1</h3>');

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Code blocks (single backtick)
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');

  // Line breaks
  html = html.replace(/\n/g, '<br/>');

  return html;
};

// Markdown message component
const MarkdownMessage = ({ content }) => {
  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
};

const FinancialAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm your Financial Advisor AI.\n\nTry asking:\n• Where do I overspend?\n• How can I save more?\n• Show my summary\n• How much did I spend this month?\n• How much did I spend last 3 months?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    "Where do I overspend?",
    "How can I save more?",
    "Show my summary this month",
    "How much did I spend last 30 days?"
  ];

  const handleSendMessage = async (text = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.ADVISOR.GET_ADVICE, {
        question: text,
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.advice || "I couldn't generate advice at this moment. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        isMarkdown: true
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting advice:", error);

      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="financial-advisor-container">
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`advisor-toggle-btn ${isOpen ? "open" : ""}`}
        title="Financial Advisor"
      >
        <FiMessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="advisor-chat-window">
          {/* Header */}
          <div className="advisor-header">
            <h3>💰 Financial Advisor AI</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="advisor-close-btn"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="advisor-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-content">
                  {msg.isMarkdown ? (
                    <MarkdownMessage content={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="message bot-message">
                <div className="message-content loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="suggested-questions">
              <p className="suggestion-label">Try asking:</p>
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  onClick={() => handleSendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="advisor-input-area">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && handleSendMessage()
              }
              placeholder="Ask me anything about your finances..."
              disabled={isLoading}
              className="advisor-input"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="advisor-send-btn"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAdvisor;
