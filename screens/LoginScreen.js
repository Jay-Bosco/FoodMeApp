import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ProfileContext } from '../context/ProfileContext'; // Use only ProfileContext

const Colors = {
  PRIMARY: '#FF6F00', // Orange
  SECONDARY: '#27ae60', // Green
  BACKGROUND: '#FFFFFF', // White
  WHITE: '#FFFFFF',
  TEXT: '#2d3436',
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setProfileData } = useContext(ProfileContext); // use ProfileContext
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = () => {
    if (usernameInput && password) {
      // Save username to ProfileContext
      setProfileData(prev => ({
        ...prev,
        username: usernameInput,
        isAuthenticated: true,
      }));

      setMessage('Login successful!');
      navigation.navigate('MainTabs'); // Navigate to the MainTabs navigator
    } else {
      setMessage('Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo  */}
      <Image
        source={require('../assets/logo.png')} // Replace with your actual logo path
        style={styles.logo}
        resizeMode="contain" // Or 'cover', 'stretch', etc. as needed
      />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={usernameInput}
        onChangeText={setUsernameInput}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.linkContainer}>
        <Text style={styles.linkText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200, // Adjust as needed
    height: 100, // Adjust as needed
    marginBottom: 20, // Add some space below the logo
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: Colors.TEXT,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 10,
    color: Colors.PRIMARY,
    fontSize: 14,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: Colors.TEXT,
  },
  signUpText: {
    fontSize: 14,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
