import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * ChatWindow Component
 * Displays all messages and auto-scrolls to the latest message.
 */
export const ChatWindow = ({ messages, loading, error, onClearError }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <h2>Welcome to Offline ChatGPT</h2>
            <p>Start a conversation with the AI assistant</p>
            <p className="info">Powered by Ollama + gemma:2b</p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {loading && <LoadingSpinner />}

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={onClearError} className="error-dismiss">
              Dismiss
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
