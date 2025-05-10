import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Modal,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/colors';
import { ProfileContext } from '../context/ProfileContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const YourDietScreen = () => {
    const navigation = useNavigation();
    const [meals, setMeals] = useState([]);
    const [soups, setSoups] = useState({});
    const [loading, setLoading] = useState(true);
    const [soupModalVisible, setSoupModalVisible] = useState(false);
    const [selectedMealKey, setSelectedMealKey] = useState(null);
    const { profile } = useContext(ProfileContext);
    const [eatenMeals, setEatenMeals] = useState({});
    const [availableSoups, setAvailableSoups] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const soupsSnapshot = await getDocs(collection(db, 'soups'));
                const soupsData = soupsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setAvailableSoups(soupsData);

                const storedMeals = await AsyncStorage.getItem('selectedMeals');
                const storedSoups = await AsyncStorage.getItem('selectedSoups');
                const storedEaten = await AsyncStorage.getItem('eatenMeals');

                setMeals(storedMeals ? JSON.parse(storedMeals) : []);
                setSoups(storedSoups ? JSON.parse(storedSoups) : {});
                setEatenMeals(storedEaten ? JSON.parse(storedEaten) : {});
            } catch (err) {
                console.log('Error loading data', err);
                Alert.alert('Error', 'Failed to load diet data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const assignWeeklyMeals = () => {
        if (!Array.isArray(meals) || meals.length === 0) return [];
        const assigned = [];
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const breakfast = meals[i % meals.length];
            const lunch = meals[(i + 1) % meals.length];
            const dinner = meals[(i + 2) % meals.length];
            assigned.push({ day, breakfast, lunch, dinner });
        }
        return assigned;
    };

    const openSoupModal = (key) => {
        setSelectedMealKey(key);
        setSoupModalVisible(true);
    };

    const closeSoupModal = () => {
        setSoupModalVisible(false);
        setSelectedMealKey(null);
    };

    const selectSoup = async (soup) => {
        if (selectedMealKey) {
            const updated = { ...soups, [selectedMealKey]: soup };
            setSoups(updated);
            await AsyncStorage.setItem('selectedSoups', JSON.stringify(updated));
        }
        closeSoupModal();
    };

    const toggleMealEatenStatus = async (day, mealType) => {
        try {
            const mealKey = `${day}-${mealType}`;
            const updatedEaten = { ...eatenMeals };

            if (updatedEaten[mealKey]) {
                delete updatedEaten[mealKey];
                Alert.alert('Success', `${mealType} for ${day} unmarked`);
            } else {
                updatedEaten[mealKey] = true;
                Alert.alert('Success', `${mealType} for ${day} marked as eaten!`);
            }

            await AsyncStorage.setItem('eatenMeals', JSON.stringify(updatedEaten));
            setEatenMeals(updatedEaten);
        } catch (error) {
            console.error('Error toggling meal status:', error);
            Alert.alert('Error', 'Failed to update meal status');
        }
    };

    const weeklyMeals = assignWeeklyMeals();

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Here's your weekly diet plan</Text>

            {weeklyMeals.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No meals selected yet</Text>
                    <TouchableOpacity
                        style={styles.addMealsButton}
                        onPress={() => navigation.navigate('MealSuggestions')}
                    >
                        <Text style={styles.addMealsText}>Select Meals</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                weeklyMeals.map((item, index) => (
                    <View key={index} style={styles.dayContainer}>
                        <Text style={styles.dayTitle}>{item.day}</Text>

                        {['breakfast', 'lunch', 'dinner'].map(type => {
                            const meal = item[type];
                            const mealKey = `${item.day}-${type}`;
                            const isSwallow = meal?.isSwallow;
                            const selectedSoup = soups[mealKey];
                            const isEaten = eatenMeals[mealKey];

                            return (
                                <View key={type} style={[
                                    styles.mealContainer,
                                    isEaten && styles.eatenMeal,
                                ]}>
                                    <TouchableOpacity
                                        onPress={() =>
                                            meal && navigation.navigate('MealPortion', {
                                                mealId: meal.id,
                                                mealName: meal.name,
                                                selectedSoup: selectedSoup || null,
                                                isSwallow: isSwallow
                                            })
                                        }
                                        style={styles.mealContent}
                                    >
                                        <View style={styles.mealHeader}>
                                            <Text style={styles.mealType}>
                                                {type === 'breakfast'
                                                    ? '🍳 Breakfast'
                                                    : type === 'lunch'
                                                        ? '🍽 Lunch'
                                                        : '🍲 Dinner'}
                                            </Text>
                                            {isEaten && <Text style={styles.eatenBadge}>✓ Eaten</Text>}
                                        </View>

                                        <Text style={styles.mealName}>
                                            {meal ? meal.name : 'No meal assigned'}
                                        </Text>

                                        {meal && isSwallow && selectedSoup && (
                                            <Text style={styles.soupText}>with {selectedSoup.name}</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.actionsContainer}>
                                        {meal && isSwallow && (
                                            <TouchableOpacity
                                                style={styles.soupButton}
                                                onPress={() => openSoupModal(mealKey)}
                                            >
                                                <Text style={styles.soupButtonText}>
                                                    {selectedSoup ? `🍲 ${selectedSoup.name}` : 'Select Soup'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        {meal && (
                                            <TouchableOpacity
                                                style={[
                                                    styles.eatenButton,
                                                    isEaten && styles.unmarkButton,
                                                ]}
                                                onPress={() => toggleMealEatenStatus(item.day, type)}
                                            >
                                                <Text style={styles.eatenButtonText}>
                                                    {isEaten ? 'Unmark' : 'Mark Eaten'}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))
            )}

            {/* Soup Selection Modal */}
            <Modal
                visible={soupModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={closeSoupModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a Soup</Text>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {availableSoups.map(soup => (
                                <TouchableOpacity
                                    key={soup.id}
                                    onPress={() => selectSoup(soup)}
                                    style={styles.modalItem}
                                >
                                    {soup.imageUrl && (
                                        <Image
                                            source={{ uri: soup.imageUrl }}
                                            style={styles.soupImage}
                                        />
                                    )}
                                    <Text style={styles.modalItemText}>{soup.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={closeSoupModal}
                        >
                            <Text style={styles.closeModalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.BACKGROUND_COLOR,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.PRIMARY,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: Colors.TEXT,
        marginBottom: 20,
    },
    addMealsButton: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        width: '60%',
        alignItems: 'center',
    },
    addMealsText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
    },
    dayContainer: {
        backgroundColor: Colors.CARD_BACKGROUND,
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.TEXT,
        textAlign: 'center',
    },
    mealContainer: {
        backgroundColor: Colors.WHITE,
        padding: 12,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    eatenMeal: {
        backgroundColor: '#f0fff0',
    },
    mealContent: {
        flex: 1,
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    mealType: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.PRIMARY,
    },
    eatenBadge: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 14,
    },
    mealName: {
        fontSize: 16,
        color: Colors.TEXT,
        marginBottom: 3,
    },
    soupText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    soupContainer: {
        flex: 1,
        marginRight: 10,
    },
    soupButton: {
        padding: 8,
        backgroundColor: '#eee',
        borderRadius: 6,
    },
    soupButtonText: {
        fontSize: 14,
        color: '#444',
    },
    eatenButton: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        minWidth: 100,
        alignItems: 'center',
    },
    unmarkButton: {
        backgroundColor: '#ff4444',
    },
    eatenButtonText: {
        color: Colors.WHITE,
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        width: '100%',
        alignItems: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalItemText: {
        marginLeft: 10,
        fontSize: 16
    },
    closeModalButton: {
        marginTop: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 8,
    },
    closeModalButtonText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
        fontSize: 16
    },
    soupImage: {
        width: 50,
        height: 50,
        borderRadius: 5,
        marginRight: 10,
        resizeMode: 'cover'
    },
});

export default YourDietScreen;

