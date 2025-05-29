import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {messageAPI} from '../services/api';
import {useAuth} from '../context/AuthContext';
import {Conversation, RootStackParamList} from '../types';

type MessagesScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const MessagesScreen: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const {user} = useAuth();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async (): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await messageAPI.getConversations(user.id);
      if (response.success) {
        setConversations(response.conversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleConversationPress = (conversation: Conversation): void => {
    navigation.navigate('Chat', {
      user: {
        id: conversation.otherUser.id,
        name: conversation.otherUser.name,
        email: '', // Not needed for chat
        age: 0, // Not needed for chat
        profilePicture: conversation.otherUser.profilePicture,
      },
    });
  };

  const renderConversationItem = ({item}: {item: Conversation}) => {
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}>
        <Image
          source={{
            uri:
              item.otherUser.profilePicture ||
              'https://via.placeholder.com/50x50?text=?',
          }}
          style={styles.avatar}
        />
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{item.otherUser.name}</Text>
            <Text style={styles.timestamp}>
              {formatTime(item.lastMessage.timestamp)}
            </Text>
          </View>
          <View style={styles.messagePreview}>
            <Text
              style={[
                styles.lastMessage,
                !item.lastMessage.isRead && styles.unreadMessage,
              ]}
              numberOfLines={1}>
              {item.lastMessage.content}
            </Text>
            {!item.lastMessage.isRead && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <Icon name="chat-bubble-outline" size={80} color="#E0E0E0" />
        <Text style={styles.emptyStateTitle}>No messages yet</Text>
        <Text style={styles.emptyStateSubtitle}>
          Start swiping to connect with people and begin conversations!
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Loading conversations...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id.toString()}
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshing={loading}
        onRefresh={loadConversations}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#333',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginLeft: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default MessagesScreen;
