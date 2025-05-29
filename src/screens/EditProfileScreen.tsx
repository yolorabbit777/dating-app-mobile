import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {useAuth} from '../context/AuthContext';
import {RootStackParamList, User} from '../types';

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

interface Props {
  navigation: EditProfileScreenNavigationProp;
}

const EditProfileScreen: React.FC<Props> = ({navigation}) => {
  const {user, updateUser} = useAuth();
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    age: user?.age || 0,
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (
    field: keyof User,
    value: string | number,
  ): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagePicker = (): void => {
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        if (imageUri) {
          setFormData(prev => ({
            ...prev,
            profilePicture: imageUri,
          }));
        }
      }
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      Alert.alert('Error', 'Name is required');
      return false;
    }

    if (!formData.age || formData.age < 18 || formData.age > 100) {
      Alert.alert('Error', 'Please enter a valid age (18-100)');
      return false;
    }

    return true;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      const updatedUser: User = {
        ...user,
        ...formData,
        name: formData.name!,
        age: formData.age!,
      };

      await updateUser(updatedUser);
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture */}
        <View style={styles.photoSection}>
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={handleImagePicker}>
            <Image
              source={{
                uri:
                  formData.profilePicture ||
                  'https://via.placeholder.com/120x120?text=?',
              }}
              style={styles.profilePhoto}
            />
            <View style={styles.photoOverlay}>
              <Icon name="camera-alt" size={24} color="white" />
              <Text style={styles.photoOverlayText}>Change Photo</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
              placeholder="Enter your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.textInput}
              value={formData.age ? formData.age.toString() : ''}
              onChangeText={value =>
                handleInputChange('age', parseInt(value) || 0)
              }
              placeholder="Enter your age"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.textInput, styles.bioInput]}
              value={formData.bio}
              onChangeText={value => handleInputChange('bio', value)}
              placeholder="Tell us about yourself..."
              multiline
              numberOfLines={4}
              maxLength={500}
              placeholderTextColor="#999"
            />
            <Text style={styles.characterCount}>
              {formData.bio?.length || 0}/500
            </Text>
          </View>
        </View>

        {/* Additional Sections */}
        <View style={styles.additionalSection}>
          <Text style={styles.sectionTitle}>Additional Info</Text>

          <TouchableOpacity style={styles.additionalItem}>
            <Icon name="work" size={24} color="#666" />
            <View style={styles.additionalItemContent}>
              <Text style={styles.additionalItemTitle}>Job Title</Text>
              <Text style={styles.additionalItemSubtitle}>
                Add your profession
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalItem}>
            <Icon name="school" size={24} color="#666" />
            <View style={styles.additionalItemContent}>
              <Text style={styles.additionalItemTitle}>Education</Text>
              <Text style={styles.additionalItemSubtitle}>
                Add your education
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.additionalItem}>
            <Icon name="location-on" size={24} color="#666" />
            <View style={styles.additionalItemContent}>
              <Text style={styles.additionalItemTitle}>Location</Text>
              <Text style={styles.additionalItemSubtitle}>
                Add your location
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoOverlayText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
    color: '#333',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  additionalSection: {
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  additionalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  additionalItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  additionalItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  additionalItemSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});

export default EditProfileScreen;
