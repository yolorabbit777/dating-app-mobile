export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#45B7D1',
  background: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    100: '#F8F8F8',
    200: '#E0E0E0',
    300: '#C0C0C0',
    400: '#999999',
    500: '#666666',
    600: '#333333',
  },
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
  },
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 50,
};

export const SHADOW = {
  light: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const API_ENDPOINTS = {
  BASE_URL: 'http://10.0.2.2:8080/api',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users',
    DISCOVER: '/users/discover',
    UPDATE: '/users',
  },
  MESSAGES: {
    SEND: '/messages/send',
    CONVERSATIONS: '/messages/conversations',
    CONVERSATION: '/messages/conversation',
    MARK_READ: '/messages/read',
  },
};

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  AGE_MIN: 18,
  AGE_MAX: 100,
  BIO_MAX_LENGTH: 500,
};

export const STORAGE_KEYS = {
  USER: 'user',
  AUTH_TOKEN: 'auth_token',
  PREFERENCES: 'preferences',
};
