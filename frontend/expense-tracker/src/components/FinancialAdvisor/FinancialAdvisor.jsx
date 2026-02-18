import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageCircle, FiRefreshCw } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import "./FinancialAdvisor.css";

// Simple markdown → HTML
const renderMarkdown = (text) => {
  let html = text;
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/### (.*?)\n/g, "<h5>$1</h5>");
  html = html.replace(/## (.*?)\n/g, "<h4>$1</h4>");
  html = html.replace(/# (.*?)\n/g, "<h3>$1</h3>");
  html = html.replace(/\n/g, "<br/>");
  return html;
};

const MarkdownMessage = ({ content }) => (
  <div className="markdown-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
);

const FinancialAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi! 👋 I'm your advanced finance advisor.\n\nI can answer data questions (totals, categories, periods) and give advice based on your finances.\n\nIf a question needs data, I'll use it. If it's general, I'll give timeless tips.\n\nTry asking:\n• How much did I save last year in percent?\n• Most expensive month?\n• How can I save more?`,
      sender: "bot",
      isMarkdown: true,
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text = inputValue.trim()) => {
    if (!text) return;

    const userMessage = { id: Date.now(), text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const { data } = await axiosInstance.post(API_PATHS.ADVISOR.GET_ADVICE, {
        question: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: data.advice || "No response generated.",
          sender: "bot",
          isMarkdown: true,
        },
      ]);
    } catch (err) {
      let msg = "Sorry, something went wrong.";
      if (err.response?.status === 429) msg = "⏳ Too many requests — please wait.";
      if (err.response?.data?.message?.includes("quota")) msg = "🚫 API quota reached.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: msg, sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Chat cleared. How can I help you today?",
        sender: "bot",
        isMarkdown: true,
      },
    ]);
  };

  const showSuggestions = messages.length <= 3;
  const suggestions = [
    "How much did I save last year in percent?",
    "Most expensive month?",
    "Expenses in 2025",
    "How can I save more?",
    "What is my average monthly savings?",
  ];

  return (
    <div className="financial-advisor-container">
      <button
        className={`advisor-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Financial Advisor"
      >
        <FiMessageCircle size={26} />
      </button>

      {isOpen && (
        <div className="advisor-chat-window">
          <div className="advisor-header">
            <h3>💰 Finance Advisor</h3>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <button
                className="advisor-clear-btn"
                onClick={clearChat}
                title="Clear chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                }}
              >
                <FiRefreshCw size={18} />
              </button>
              <button className="advisor-close-btn" onClick={() => setIsOpen(false)}>
                <FiX size={22} />
              </button>
            </div>
          </div>

          <div className="advisor-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.sender === "user" ? "user-message" : "bot-message"}`}
              >
                <div className="message-content">
                  {msg.isMarkdown ? <MarkdownMessage content={msg.text} /> : msg.text}
                </div>
                <span className="message-time">
                  {new Date(msg.id).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="message bot-message">
                <div className="loading">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showSuggestions && (
            <div className="suggested-questions">
              {suggestions.map((q, i) => (
                <button key={i} className="suggestion-btn" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="advisor-input-area">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              placeholder="Ask about data or advice..."
              disabled={isLoading}
              className="advisor-input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputValue.trim()}
              className="advisor-send-btn"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialAdvisor;