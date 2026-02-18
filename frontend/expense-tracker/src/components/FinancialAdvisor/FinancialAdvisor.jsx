import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiMessageCircle } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import "./FinancialAdvisor.css";

// Simple markdown → HTML converter
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
      text: `Hi! 👋 I'm your advanced finance advisor.

I can handle data fetches like totals/categories or general advice.

Try asking:
• Total expenses all time
• How much did I spend in January 2025?
• Expenses between Feb and April
• Why am I overspending?
• How to budget better?
• Where should I invest? (general tips only)`,
      sender: "bot",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "Total expenses all time",
    "Expenses in March 2025",
    "How much spent last year?",
    "Why overspending this month?",
    "General tips to save money",
  ];

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
      if (err.response?.status === 429) {
        msg = "Too many requests — please wait a bit.";
      }
      if (err.response?.data?.message?.includes("quota")) {
        msg = "API quota limit reached. Try again later.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: msg, sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h3>💰 Advanced Finance Advisor</h3>
            <button className="advisor-close-btn" onClick={() => setIsOpen(false)}>
              <FiX size={22} />
            </button>
          </div>

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
                  {new Date(msg.id).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="message bot-message">
                <div className="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="suggested-questions">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => sendMessage(q)}
                >
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  sendMessage();
                }
              }}
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