import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image 
        source={require('../assets/logo.png')}  // Adjust if your image path is different
        style={styles.logo}
      />

      {/* App Title */}
      <Text style={styles.title}>Welcome to FoodMe</Text>

      {/* Motivational Quote */}
      <Text style={styles.quote}>“Your journey to healthier eating starts here!”</Text>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('Authentication')}  // ✅ Corrected screen name
      >
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#000',
    textAlign: 'center',
    marginBottom: 40,
  },
  getStartedButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#27ae60', // Green
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  getStartedText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
