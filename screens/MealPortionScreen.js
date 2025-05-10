import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebaseConfig';

const MealPortionScreen = ({ route }) => {
    const { mealId, mealName, isSwallow, selectedSoup: initialSelectedSoup } = route.params; // Added selectedSoup from route
    const [meal, setMeal] = useState(null);
    const [soupLink, setSoupLink] = useState(null);
    const [swallowLink, setSwallowLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSoup, setSelectedSoup] = useState(initialSelectedSoup); // Local state for selected soup


    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const docRef = doc(db, 'meals', mealId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMeal(docSnap.data());
                } else {
                    console.warn('Meal not found in Firestore');
                }

                if (isSwallow) {
                    const soups = await AsyncStorage.getItem('selectedSoups');
                    const storedSoups = soups ? JSON.parse(soups) : {};
                    const storedSoupName = storedSoups[mealName];

                    if (storedSoupName) {
                         setSelectedSoup(storedSoupName); //set selected soup
                        const soupDoc = await getDoc(doc(db, 'soup_videos', storedSoupName.toLowerCase()));
                        if (soupDoc.exists()) {
                            setSoupLink(soupDoc.data().youtubeLink);
                        }
                    }

                    // Fetch swallow link
                    const swallowDocRef = doc(db, 'swallow_videos', mealName.toLowerCase());
                    const swallowDocSnap = await getDoc(swallowDocRef);
                    if (swallowDocSnap.exists()) {
                        setSwallowLink(swallowDocSnap.data().youtubeLink);
                    }
                }
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeal();
    }, [mealId, mealName, isSwallow, initialSelectedSoup]); // Added initialSelectedSoup to dependencies

    const openYouTube = (link) => {
        if (link) {
            Linking.openURL(link).catch(() => alert('Unable to open link'));
        } else {
            alert('No tutorial available.');
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#FF0000" />
            </View>
        );
    }

    if (!meal) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Meal not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{meal.name}</Text>
            <Text style={styles.description}>{meal.description}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recommended Portion Size</Text>
                <Text>🍽 1 serving (250g - 300g)</Text>
                <Text>🔥 {meal.calories} kcal</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Healthy Eating Tips</Text>
                <Text>✔️ Eat slowly and enjoy your food.</Text>
                <Text>✔️ Avoid eating late at night.</Text>
                <Text>✔️ Drink water before meals.</Text>
            </View>

             <TouchableOpacity style={styles.button} onPress={() => openYouTube(meal.youtubeLink)}>
                <Text style={styles.buttonText}>📺 How to cook {meal.name}</Text>
            </TouchableOpacity>

            {isSwallow && swallowLink && (
                <TouchableOpacity style={[styles.button, { backgroundColor: '#e67e22' }]} onPress={() => openYouTube(swallowLink)}>
                    <Text style={styles.buttonText}>📺 How to make swallow</Text>
                </TouchableOpacity>
            )}

            {isSwallow && soupLink && (
                <TouchableOpacity style={[styles.button, { backgroundColor: '#27ae60' }]} onPress={() => openYouTube(soupLink)}>
                    <Text style={styles.buttonText}>🍲 How to cook {selectedSoup}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
    description: { textAlign: 'center', color: '#555', marginBottom: 20 },
    section: { marginBottom: 20, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    button: { backgroundColor: '#FF0000', padding: 12, borderRadius: 8, marginTop: 20 },
    buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
    errorText: { fontSize: 16, color: 'red' },
});

export default MealPortionScreen;
