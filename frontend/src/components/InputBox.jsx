import { useState, useEffect } from 'react';

/**
 * InputBox Component
 * Text input field with send button and character counter.
 */
export const InputBox = ({ onSendMessage, loading }) => {
  const [message, setMessage] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(0);
  const MAX_LENGTH = 2000;
  const charCount = message.length;
  const isNearLimit = charCount > MAX_LENGTH * 0.8;

  // Show a live "waiting Xs..." counter while loading so user knows AI is working
  useEffect(() => {
    if (!loading) {
      setWaitSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setWaitSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = () => {
    if (message.trim() && !loading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setMessage(value);
    }
  };

  return (
    <div className="input-box">
      {loading && (
        <div className="loading-notice">
          ⏳ AI is thinking... ({waitSeconds}s) — please wait, this may take up to a minute.
        </div>
      )}
      <div className="input-container">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={loading}
          rows="3"
          className="message-input"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || loading}
          className="send-button"
        >
          {loading ? `Waiting... (${waitSeconds}s)` : 'Send'}
        </button>
      </div>
      {isNearLimit && (
        <div className="char-counter">
          {charCount} / {MAX_LENGTH}
        </div>
      )}
    </div>
  );
};
