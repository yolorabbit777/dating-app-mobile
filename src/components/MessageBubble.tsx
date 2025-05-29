import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Message} from '../types';

interface MessageBubbleProps {
  message: Message;
  isMyMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMyMessage,
}) => {
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}>
      <View
        style={[
          styles.bubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}>
        <Text
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}>
          {message.content}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 4,
  },
  myMessageBubble: {
    backgroundColor: '#FF6B6B',
    borderBottomRightRadius: 5,
  },
  otherMessageBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 16,
  },
});

export default MessageBubble;
