// screens/HomeScreen.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileContext } from '../context/ProfileContext'; 
import Colors from '../constants/colors'; 

const HomeScreen = ({ navigation }) => {
  const { profileData, setProfileData } = useContext(ProfileContext);  
  const username = profileData?.username || 'User';  
  const profileImage = profileData?.profileImage || require('../assets/placeholder.png');  
  const [progress, setProgress] = useState(0);

  const loadProgress = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem('selectedMeals');
      const storedEatenMeals = await AsyncStorage.getItem('eatenMeals');

      if (storedMeals && storedEatenMeals) {
        const selectedMeals = JSON.parse(storedMeals);
        const eatenMeals = JSON.parse(storedEatenMeals);
        const totalMeals = selectedMeals.length * 7 * 3; // 7 days, 3 meals per day
        const eatenCount = Object.keys(eatenMeals).length;
        
        const percentage = totalMeals > 0 ? (eatenCount / totalMeals) * 100 : 0;
        setProgress(Math.round(percentage));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadProgress();
    });
    
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();  
            setProfileData({ isAuthenticated: false });  
            navigation.reset({
              index: 0,
              routes: [{ name: "Welcome" }],
            });
          } catch (error) {
            console.error("Logout Error:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {username}! 👋</Text> 
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileImageContainer}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <Text style={styles.encouragement}>
        "Your health is an investment, not an expense. Eat wisely!"
      </Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Meal Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}% completed</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MealSuggestions')}>
          <Image source={require('../assets/meals.png')} style={styles.icon} />
          <Text style={styles.actionText}>Meal Suggestions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('WaterIntake')}>
          <Image source={require('../assets/water.png')} style={styles.icon} />
          <Text style={styles.actionText}>Water Tracking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Health Goals')}>
          <Image source={require('../assets/health-goals.png')} style={styles.icon} />
          <Text style={styles.actionText}>Health Goals</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.motivationCard}>
        <Text style={styles.motivationText}>
          🌟 "Every meal is a chance to nourish your body and fuel your day!"
        </Text>
      </View>

      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.bottomButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.bottomButton, { backgroundColor: 'red' }]} onPress={handleLogout}>
          <Text style={styles.bottomButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.TEXT,
  },
  encouragement: {
    fontSize: 16,
    color: Colors.TEXT,
    textAlign: 'center',
    marginBottom: 15,
  },
  profileImageContainer: {
    marginRight: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.GRAY,
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 15,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.PRIMARY,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  motivationCard: {
    backgroundColor: Colors.SECONDARY,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  motivationText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.BLACK,
    textAlign: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  bottomButton: {
    backgroundColor: Colors.BUTTON_COLOR,
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
});

export default HomeScreen;