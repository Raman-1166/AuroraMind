/**
 * LoadingSpinner Component
 * Shows a typing animation while waiting for AI response.
 */
export const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>AI is thinking...</p>
    </div>
  );
};
