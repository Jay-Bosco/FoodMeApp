import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig"; // adjust if your config path is different

const MealDetailScreen = ({ route }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealRef = doc(db, "meals", mealId);
        const mealSnap = await getDoc(mealRef);

        if (mealSnap.exists()) {
          setMeal(mealSnap.data());
        } else {
          console.log("Meal not found in Firestore.");
        }
      } catch (error) {
        console.log("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  const openYouTubeLink = (url) => {
    if (!url) return alert("No video link provided.");

    const formatted = url.startsWith("http")
      ? url
      : `https://www.youtube.com/watch?v=${url}`;

    Linking.openURL(formatted).catch(() =>
      alert("Unable to open the video link.")
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Meal not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{meal.name}</Text>
      <Text style={styles.description}>{meal.description || "No description available."}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {meal.ingredients?.length > 0 ? (
          meal.ingredients.map((item, index) => (
            <Text key={index} style={styles.text}>• {item}</Text>
          ))
        ) : (
          <Text style={styles.text}>No ingredients listed.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.text}>{meal.instructions || "No instructions available."}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portion</Text>
        <Text style={styles.text}>🍽 {meal.portionSize || "Standard"}</Text>
        <Text style={styles.text}>🔥 Calories: {meal.calories || "Not specified"} kcal</Text>
      </View>

      {meal.youtubeLink && (
        <TouchableOpacity
          style={styles.youtubeButton}
          onPress={() => openYouTubeLink(meal.youtubeLink)}
        >
          <Text style={styles.youtubeButtonText}>📺 Watch Tutorial</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  youtubeButton: {
    backgroundColor: "#FF0000",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  youtubeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MealDetailScreen;
