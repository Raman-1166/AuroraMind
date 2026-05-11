/**
 * Sidebar Component
 * Displays chat history and new chat button.
 */
export const Sidebar = ({ onNewChat, conversationId }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Offline ChatGPT</h1>
      </div>

      <button onClick={onNewChat} className="new-chat-button">
        + New Chat
      </button>

      <div className="chat-history">
        <h3>Chat History</h3>
        <div className="conversation-item active">
          <p>Current Conversation</p>
          <small>{conversationId.substring(0, 12)}...</small>
        </div>
      </div>

      <div className="sidebar-footer">
        <p className="info-text">
          Powered by Ollama + gemma:2b
        </p>
        <p className="info-text small">
          Optimized for low-RAM systems
        </p>
      </div>
    </div>
  );
};
