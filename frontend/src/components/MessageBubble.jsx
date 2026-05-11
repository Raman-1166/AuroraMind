/**
 * MessageBubble Component
 * Displays individual messages with different styling for user vs AI.
 */
export const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'USER';

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="message-content">
        <p>{message.content}</p>
      </div>
      <div className="message-timestamp">
        {message.timestamp}
      </div>
    </div>
  );
};
