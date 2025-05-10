import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { ProfileContext } from '../context/ProfileContext';

const CompleteSignUpScreen = ({ route, navigation }) => {
    const { setProfileData } = useContext(ProfileContext);
    const { profileData: initialProfileData } = route.params;
    const [dietPreference, setDietPreference] = useState('');
    const [allergies, setAllergies] = useState('');
    const [message, setMessage] = useState('');

    const handleCompleteSignUp = () => {
        if (!dietPreference || !allergies) {
            setMessage('Please fill in all fields.');
            return;
        }

        const completeProfileData = {
            ...initialProfileData,
            dietPreference,
            allergies,
            isAuthenticated: true,
        };

        setProfileData(completeProfileData);

        Alert.alert('Success', 'Account created successfully!', [
            {
                text: 'OK',
                onPress: () => navigation.replace('MainTabs'),
            },
        ]);

    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.header}>Complete Sign-Up</Text>

            <Text style={styles.infoText}>Name: {initialProfileData?.firstName} {initialProfileData?.surname}</Text>
            <Text style={styles.infoText}>Birthdate: {new Date(initialProfileData?.birthdate).toDateString()}</Text>
            <Text style={styles.infoText}>Username: {initialProfileData?.username}</Text>
            <Text style={styles.infoText}>Email: {initialProfileData?.email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Dietary Preference (e.g., Vegan, Vegetarian)"
                value={dietPreference}
                onChangeText={setDietPreference}
            />

            <TextInput
                style={styles.input}
                placeholder="Allergies (if any)"
                value={allergies}
                onChangeText={setAllergies}
            />

            {message ? (
                <Text style={[styles.message, { color: message === 'Account created successfully!' ? 'green' : 'red' }]}>
                    {message}
                </Text>
            ) : null}

            <TouchableOpacity style={styles.button} onPress={handleCompleteSignUp}>
                <Text style={styles.buttonText}>Complete Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#FF6F00',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        marginTop: 10,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CompleteSignUpScreen;
