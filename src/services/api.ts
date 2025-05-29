import axios, {AxiosResponse} from 'axios';
import {
  User,
  Message,
  ApiResponse,
  DiscoverUsersResponse,
  ConversationResponse,
  ConversationsResponse,
  SignupData,
} from '../types';

// Update this to your actual backend URL
const BASE_URL = 'http://192.168.12.95:8080/api'; // Android emulator
// const BASE_URL = 'http://localhost:8080/api'; // iOS simulator
// const BASE_URL = 'http://YOUR_IP:8080/api'; // Physical device

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  error => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (
    email: string,
    password: string,
  ): Promise<ApiResponse<User>> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.post(
        '/auth/login',
        {
          email,
          password,
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  signup: async (userData: SignupData): Promise<ApiResponse<User>> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.post(
        '/auth/signup',
        userData,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};

export const userAPI = {
  getProfile: async (userId: number): Promise<ApiResponse<User>> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.get(
        `/users/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (
    userId: number,
    userData: Partial<User>,
  ): Promise<ApiResponse<User>> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.put(
        `/users/${userId}`,
        userData,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  discoverUsers: async (userId: number): Promise<DiscoverUsersResponse> => {
    try {
      const response: AxiosResponse<DiscoverUsersResponse> = await api.get(
        `/users/discover/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};

export const messageAPI = {
  sendMessage: async (
    senderId: number,
    receiverId: number,
    content: string,
  ): Promise<ApiResponse<Message>> => {
    try {
      const response: AxiosResponse<ApiResponse<Message>> = await api.post(
        `/messages/send/${senderId}`,
        {
          receiverId,
          content,
        },
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getConversation: async (
    userId1: number,
    userId2: number,
  ): Promise<ConversationResponse> => {
    try {
      const response: AxiosResponse<ConversationResponse> = await api.get(
        `/messages/conversation/${userId1}/${userId2}`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getConversations: async (userId: number): Promise<ConversationsResponse> => {
    try {
      const response: AxiosResponse<ConversationsResponse> = await api.get(
        `/messages/conversations/${userId}`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  markAsRead: async (messageId: number): Promise<ApiResponse> => {
    try {
      const response: AxiosResponse<ApiResponse> = await api.put(
        `/messages/${messageId}/read`,
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getUnreadCount: async (
    userId: number,
  ): Promise<ApiResponse<{count: number}>> => {
    try {
      const response: AxiosResponse<ApiResponse<{count: number}>> =
        await api.get(`/messages/unread/${userId}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },
};
