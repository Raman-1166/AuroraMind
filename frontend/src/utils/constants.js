// API Configuration
export const API_BASE_URL = 'http://localhost:7070';
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
};

// UI Constants
export const MAX_MESSAGE_LENGTH = 2000;
export const MESSAGE_WARNING_THRESHOLD = 1800;
export const TYPING_ANIMATION_SPEED = 500; // ms

// Message Types
export const MESSAGE_TYPES = {
  USER: 'user',
  AI: 'ai',
  ERROR: 'error',
};

// Error Messages
export const ERROR_MESSAGES = {
  EMPTY_MESSAGE: 'Message cannot be empty',
  MESSAGE_TOO_LONG: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};
