import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

// Water goal in cups
const DAILY_GOAL_CUPS = 8;

const WaterIntakeScreen = () => {
  const [cupsDrunk, setCupsDrunk] = useState(0);
  const waterLevel = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('cupsDrunk');
      const count = saved ? parseInt(saved) : 0;
      setCupsDrunk(count);
      animateWater(count);
    };
    loadData();
  }, []);

  const animateWater = (cups) => {
    Animated.timing(waterLevel, {
      toValue: (cups / DAILY_GOAL_CUPS) * 100,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const saveCups = async (cups) => {
    await AsyncStorage.setItem('cupsDrunk', cups.toString());
  };

  const drinkWater = () => {
    if (cupsDrunk < DAILY_GOAL_CUPS) {
      const newCount = cupsDrunk + 1;
      setCupsDrunk(newCount);
      saveCups(newCount);
      animateWater(newCount);
      showMotivation(newCount);
    } else {
      Alert.alert("🎉 Goal Reached!", "You've met your daily goal! 🏆 Stay Hydrated!");
    }
  };

  const reset = async () => {
    setCupsDrunk(0);
    await AsyncStorage.setItem('cupsDrunk', '0');
    animateWater(0);
  };

  const showMotivation = (cups) => {
    let message;
    switch (cups) {
      case 6:
        message = "👏 Almost there! Just 2 more cups left!";
        break;
      case 7:
        message = "🔥 One more cup to go! Finish strong! 💦";
        break;
      case 8:
        message = "🎉 You did it! Daily goal reached! 🏆";
        break;
      default:
        message = "💧 Stay hydrated! Keep going!";
    }
    Alert.alert("Motivation", message);
  };

  // Setup recurring notifications
  useEffect(() => {
    const scheduleReminder = async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "💦 Hydration Reminder",
          body: "Time to drink water and stay healthy! 🚰",
        },
        trigger: { seconds: 7200, repeats: true }, // every 2 hours
      });
    };
    scheduleReminder();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Water Intake Tracker 💦</Text>

      <View style={styles.glassContainer}>
        <View style={styles.glassOutline}>
          <Animated.View style={[styles.waterFill, {
            height: waterLevel.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            })
          }]} />
        </View>
        <Text style={styles.progressText}>{cupsDrunk} / {DAILY_GOAL_CUPS} cups</Text>
      </View>

      <ProgressBar progress={cupsDrunk / DAILY_GOAL_CUPS} color="#00AEEF" style={styles.progressBar} />

      <Text style={styles.motivation}>
        {cupsDrunk === DAILY_GOAL_CUPS ? "🎉 Goal Achieved!" :
          cupsDrunk >= 6 ? "🔥 Almost there!" :
          "Keep going! Every sip helps!"}
      </Text>

      <TouchableOpacity style={styles.drinkButton} onPress={drinkWater}>
        <Text style={styles.buttonText}>💧 Drink Water</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.resetButtonText}>🔄 Reset</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7FF',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0077B6',
  },
  glassContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  glassOutline: {
    width: 100,
    height: 150,
    borderWidth: 3,
    borderColor: '#0077B6',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#E6F7FF',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  waterFill: {
    backgroundColor: '#00AEEF',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#0077B6',
  },
  progressBar: {
    width: '80%',
    height: 12,
    marginVertical: 15,
    borderRadius: 8,
  },
  motivation: {
    fontSize: 16,
    color: '#005073',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  drinkButton: {
    backgroundColor: '#00AEEF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF4500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WaterIntakeScreen;
