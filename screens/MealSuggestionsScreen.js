import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Checkbox } from 'react-native-paper';
import { ProfileContext } from '../context/ProfileContext';

const MealSuggestionsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const { profile } = useContext(ProfileContext);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'meals'));
        const mealList = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          isSwallow: ['Amala', 'Eba', 'Semo'].includes(doc.data().name) 
        }));
        setMeals(mealList);

        const storedMeals = await AsyncStorage.getItem('selectedMeals');
        if (storedMeals) {
          setSelectedMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error("Error fetching meals:", error);
        Alert.alert("Error", "Failed to load meals");
      }
    };
    fetchMeals();
  }, []);

  const toggleMealSelection = (meal) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.some((item) => item.id === meal.id)
        ? prevSelected.filter((item) => item.id !== meal.id)
        : [...prevSelected, meal]
    );
  };

  const handleSaveMeals = async () => {
    try {
      if (selectedMeals.length === 0) {
        Alert.alert("No Meals Selected", "Please select at least one meal.");
        return;
      }

      await AsyncStorage.setItem('selectedMeals', JSON.stringify(selectedMeals));
      Alert.alert("Success", "Meals saved successfully!", [
        { text: "OK", onPress: () => navigation.navigate("YourDiet") }
      ]);
    } catch (error) {
      console.error("Error saving meals:", error);
      Alert.alert("Error", "Failed to save meals.");
    }
  };

  const clearSelectedMeals = async () => {
    try {
      await AsyncStorage.removeItem('selectedMeals');
      setSelectedMeals([]);
      Alert.alert("Cleared", "All selected meals have been removed.");
    } catch (error) {
      console.error("Error clearing meals:", error);
      Alert.alert("Error", "Failed to clear selected meals.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi {profile?.name || 'there'}, choose your meals:</Text>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealCard}>
            <TouchableOpacity
              onPress={() => navigation.navigate("MealDetail", { mealId: item.id })}
              style={styles.imageContainer}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.mealImage} />
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.mealName}>{item.name}</Text>
              <Text style={styles.mealDescription}>{item.description}</Text>
              {item.isSwallow && <Text style={styles.swallowText}>* Requires soup selection</Text>}
            </View>

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={selectedMeals.some((m) => m.id === item.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleMealSelection(item)}
                color="#27ae60"
              />
              <Text>Select</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.buttonContainer}>
        {selectedMeals.length > 0 && (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMeals}>
              <Text style={styles.buttonText}>Save Selected Meals ({selectedMeals.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={clearSelectedMeals}>
              <Text style={styles.buttonText}>Clear Selection</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  greeting: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
  mealCard: { 
    backgroundColor: '#f8f8f8', 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: { width: 80, height: 80 },
  mealImage: { width: '100%', height: '100%', borderRadius: 10 },
  textContainer: { flex: 1, marginLeft: 15 },
  mealName: { fontSize: 18, fontWeight: 'bold' },
  mealDescription: { fontSize: 14, color: '#666' },
  swallowText: { fontSize: 12, color: '#e67e22', fontStyle: 'italic' },
  checkboxContainer: { marginLeft: 10 },
  buttonContainer: { marginTop: 20 },
  saveButton: { 
    backgroundColor: '#27ae60', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  clearButton: { 
    backgroundColor: '#d9534f', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default MealSuggestionsScreen;