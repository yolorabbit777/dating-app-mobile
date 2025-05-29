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

const BASE_URL = 'http://10.0.2.2:8080/api'; // Android emulator
// const BASE_URL = 'http://localhost:8080/api'; // iOS simulator
// const BASE_URL = 'http://YOUR_IP:8080/api'; // Physical device

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      // Mock data for demo
      const mockUsers: User[] = [
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          age: 25,
          bio: 'Photographer and traveler',
          profilePicture:
            'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop',
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          age: 30,
          bio: 'Fitness enthusiast',
          profilePicture:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        },
        {
          id: 4,
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          age: 27,
          bio: 'Book lover and chef',
          profilePicture:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop',
        },
      ];
      return {success: true, users: mockUsers};
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
      // Mock conversation data
      const mockMessages: Message[] = [
        {
          id: 1,
          senderId: userId2,
          receiverId: userId1,
          content: 'Hey! How are you?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
        },
        {
          id: 2,
          senderId: userId1,
          receiverId: userId2,
          content: 'Hi! I am doing great, thanks for asking!',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          isRead: true,
        },
        {
          id: 3,
          senderId: userId2,
          receiverId: userId1,
          content: 'Would you like to grab coffee sometime?',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          isRead: false,
        },
      ];
      return {success: true, messages: mockMessages};
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  getConversations: async (userId: number): Promise<ConversationsResponse> => {
    try {
      // Mock conversations list
      const mockConversations = [
        {
          id: 1,
          otherUser: {
            id: 2,
            name: 'Jane Smith',
            profilePicture:
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
          },
          lastMessage: {
            content: 'Would you like to grab coffee sometime?',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            isRead: false,
          },
        },
        {
          id: 2,
          otherUser: {
            id: 3,
            name: 'Mike Johnson',
            profilePicture:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
          },
          lastMessage: {
            content: 'Thanks for the great conversation!',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            isRead: true,
          },
        },
      ];
      return {success: true, conversations: mockConversations};
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
};
