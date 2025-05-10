// ProfileScreen.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProfileContext } from '../context/ProfileContext';
import Colors from '../constants/colors';

const ProfileScreen = ({ navigation }) => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const [selectedImage, setSelectedImage] = useState(profileData?.profileImage || null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
      setProfileData({ ...profileData, profileImage: result.uri });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Profile</Text>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              selectedImage
                ? { uri: selectedImage }
                : require('../assets/placeholder.png')
            }
            style={styles.profileImage}
          />
          <Text style={styles.changePicText}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.infoText}>Username: <Text style={styles.infoValue}>{profileData.username}</Text></Text>
        <Text style={styles.infoText}>Weight: <Text style={styles.infoValue}>{profileData.weight} kg</Text></Text>
        <Text style={styles.infoText}>Age: <Text style={styles.infoValue}>{profileData.age}</Text></Text>
        <Text style={styles.infoText}>Health Issues: <Text style={styles.infoValue}>{profileData.healthIssues}</Text></Text>
      </View>

      <View style={styles.healthGoalSection}>
        <Text style={styles.healthGoalTitle}>Health Goals</Text>
        <Text style={styles.infoText}>Current Weight: <Text style={styles.infoValue}>{profileData.currentWeight} kg</Text></Text>
        <Text style={styles.infoText}>Goal Weight: <Text style={styles.infoValue}>{profileData.goalWeight} kg</Text></Text>
        <Text style={styles.infoText}>
          Target Date:{" "}
          <Text style={styles.infoValue}>
            {profileData.targetDate
              ? new Date(profileData.targetDate).toLocaleDateString()
              : 'Not set'}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* New Button: Navigate to Your Diet */}
      <TouchableOpacity
        style={[styles.editButton, { marginTop: 10, backgroundColor: Colors.PRIMARY }]} // Added marginTop for spacing and changed color
        onPress={() => navigation.navigate('YourDiet')}
      >
        <Text style={styles.editButtonText}>View Your Diet</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    margin: 10,
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GRAY,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 5,
  },
  changePicText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  userInfo: {
    padding: 20,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  infoValue: {
    fontWeight: 'bold',
  },
  healthGoalSection: {
    padding: 20,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  healthGoalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: Colors.BUTTON_COLOR,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;