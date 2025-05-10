import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ProfileContext } from '../context/ProfileContext';
import Colors from '../constants/colors';

const EditProfileScreen = ({ navigation }) => {
  const { profileData, setProfileData } = useContext(ProfileContext);

  const [username, setUsername] = useState(profileData.username || '');
  const [weight, setWeight] = useState(profileData.weight || '');
  const [age, setAge] = useState(profileData.age || '');
  const [healthIssues, setHealthIssues] = useState(profileData.healthIssues || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    const updatedData = {
      ...profileData,
      username,
      weight,
      age,
      healthIssues,
    };

    setProfileData(updatedData);
    setLoading(false);

    Alert.alert('Profile Updated', 'Your changes have been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.BUTTON_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Health Issues"
        value={healthIssues}
        onChangeText={setHealthIssues}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND_COLOR,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.LIGHT_GRAY,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.BUTTON_COLOR,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
});

export default EditProfileScreen;
