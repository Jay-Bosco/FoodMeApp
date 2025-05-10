import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { ProfileContext } from '../context/ProfileContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const Colors = {
    PRIMARY: '#FF6F00',
    SECONDARY: '#27ae60',
    BACKGROUND: '#FFFFFF',
    WHITE: '#FFFFFF',
    TEXT: '#2d3436',
};

const SignUpScreen = ({ navigation }) => {
    const { setProfileData } = useContext(ProfileContext);
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [birthdateString, setBirthdateString] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSignUp = () => {
        if (
            firstName &&
            surname &&
            birthdateString &&
            username &&
            email &&
            password &&
            confirmPassword
        ) {
            if (password !== confirmPassword) {
                setMessage('Passwords do not match.');
                return;
            }

            //  Include uid in profileData (For now, we'll generate a random one)
            const uid =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            const profileData = {
                firstName,
                surname,
                birthdate: birthdateString,
                username,
                email,
                isAuthenticated: true,
                uid: uid, //  Include the uid here!
            };
            setProfileData(profileData);
            setMessage('Account created successfully!');
            navigation.navigate('CompleteSignUp', { profileData });
        } else {
            setMessage('Please fill in all fields.');
        }
    };

    const onDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || birthdate;
            setBirthdate(currentDate);
            const dateString = currentDate.toLocaleDateString();
            setBirthdateString(dateString);
        }
        setShowDatePicker(false);
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={require('../assets/logo.png')} // Adjust the path as needed
                style={styles.logo}
            />

            {/* Title */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to start your healthy eating journey.</Text>

            {/* Inputs */}
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                placeholder="Surname"
                value={surname}
                onChangeText={setSurname}
                placeholderTextColor="#aaa"
            />

            {/* Birthday Picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: birthdateString ? Colors.TEXT : '#aaa' }}>
                    {birthdateString || 'Select your birthdate'}
                </Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={birthdate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date(1900, 0, 1)} // Adjust the minimum date as needed
                    maximumDate={new Date()} // Prevent future dates
                />
            )}

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#aaa"
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#aaa"
            />

            {/* Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Feedback Message */}
            {message ? <Text style={styles.message}>{message}</Text> : null}

            {/* Already have account link */}
            <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}> Login</Text>
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
        color: Colors.TEXT,
        marginBottom: 30,
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
        justifyContent: 'center',
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
    loginText: {
        fontSize: 14,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default SignUpScreen;
