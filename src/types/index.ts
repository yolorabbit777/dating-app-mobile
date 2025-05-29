export interface User {
  id: number;
  email: string;
  name: string;
  age: number;
  bio?: string;
  profilePicture?: string;
  createdAt?: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  otherUser: {
    id: number;
    name: string;
    profilePicture?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    isRead: boolean;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (userData: SignupData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
  loading: boolean;
}

export interface AuthResult {
  success: boolean;
  message?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  age: number;
  bio?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DiscoverUsersResponse {
  success: boolean;
  users: User[];
}

export interface ConversationResponse {
  success: boolean;
  messages: Message[];
}

export interface ConversationsResponse {
  success: boolean;
  conversations: Conversation[];
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  Chat: {user: User};
  EditProfile: undefined;
};

export type TabParamList = {
  Discover: undefined;
  Messages: undefined;
  Profile: undefined;
};
