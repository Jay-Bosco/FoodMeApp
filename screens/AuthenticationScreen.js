import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Colors = {
  PRIMARY: '#FF6F00', // Orange
  SECONDARY: '#27ae60', // Green
  BACKGROUND: '#FFFFFF', // White
  WHITE: '#FFFFFF',
  TEXT: '#2d3436',
};

const AuthenticationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        source={require('../assets/logo.png')}  // Make sure this path matches your structure
        style={styles.logo}
      />

      {/* App Title */}
      <Text style={styles.title}>FoodMe</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>“Your journey to healthier eating starts here!”</Text>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.PRIMARY }]} // Changed order
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: Colors.SECONDARY }]} // Changed order
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.TEXT,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthenticationScreen;