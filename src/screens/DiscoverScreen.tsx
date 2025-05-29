import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {userAPI} from '../services/api';
import {useAuth} from '../context/AuthContext';
import {User} from '../types';

const {width, height} = Dimensions.get('window');

const DiscoverScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cardIndex, setCardIndex] = useState<number>(0);
  const swiperRef = useRef<Swiper<User>>(null);
  const {user} = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await userAPI.discoverUsers(user.id);
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const onSwiped = (type: string, index: number): void => {
    console.log(`${type} swiped for card index ${index}`);
    setCardIndex(index + 1);
  };

  const onSwipedAll = (): void => {
    Alert.alert('No more profiles', 'You have seen all available profiles!', [
      {
        text: 'Reload',
        onPress: () => {
          setCardIndex(0);
          loadUsers();
        },
      },
    ]);
  };

  const renderCard = (person: User) => {
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri:
              person.profilePicture ||
              'https://via.placeholder.com/300x400?text=No+Photo',
          }}
          style={styles.cardImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>
              {person.name}, {person.age}
            </Text>
            {person.bio && <Text style={styles.cardBio}>{person.bio}</Text>}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderNoMoreCards = () => {
    return (
      <View style={styles.noMoreCards}>
        <Icon name="favorite-border" size={80} color="#FF6B6B" />
        <Text style={styles.noMoreCardsText}>No more profiles</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={loadUsers}>
          <Text style={styles.reloadButtonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Finding amazing people...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="tune" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        {users.length > 0 ? (
          <Swiper
            ref={swiperRef}
            cards={users}
            renderCard={renderCard}
            onSwiped={cardIndex => onSwiped('swiped', cardIndex)}
            onSwipedLeft={cardIndex => onSwiped('left', cardIndex)}
            onSwipedRight={cardIndex => onSwiped('right', cardIndex)}
            onSwipedAll={onSwipedAll}
            cardIndex={cardIndex}
            backgroundColor="transparent"
            stackSize={3}
            stackSeparation={15}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
            overlayLabels={{
              left: {
                title: 'NOPE',
                style: {
                  label: {
                    backgroundColor: 'red',
                    borderColor: 'red',
                    color: 'white',
                    borderWidth: 1,
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: 'LIKE',
                style: {
                  label: {
                    backgroundColor: '#4ECDC4',
                    borderColor: '#4ECDC4',
                    color: 'white',
                    borderWidth: 1,
                    fontSize: 24,
                  },
                  wrapper: {
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
            }}
          />
        ) : (
          renderNoMoreCards()
        )}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.passButton]}
          onPress={() => swiperRef.current?.swipeLeft()}>
          <Icon name="close" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.superLikeButton]}
          onPress={() => Alert.alert('Super Like', 'Feature coming soon!')}>
          <Icon name="star" size={25} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => swiperRef.current?.swipeRight()}>
          <Icon name="favorite" size={30} color="white" />
        </TouchableOpacity>
      </View>
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
  filterButton: {
    padding: 8,
  },
  swiperContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    height: height * 0.65,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  cardInfo: {
    marginBottom: 20,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  cardBio: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMoreCardsText: {
    fontSize: 22,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  reloadButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  reloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#FF6B6B',
  },
  superLikeButton: {
    backgroundColor: '#4FC3F7',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  likeButton: {
    backgroundColor: '#4ECDC4',
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

export default DiscoverScreen;
