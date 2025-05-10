import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ProfileContext } from '../context/ProfileContext';
import { useNavigation } from '@react-navigation/native';

const Colors = {
    PRIMARY: '#FF6F00',
    TEXT: '#2d3436',
    BACKGROUND: '#FFFFFF',
    DARK_BACKGROUND: '#121212',
    WHITE: '#FFFFFF',
    DARK_TEXT: '#FFFFFF',
};

const SettingsScreen = () => {
    const { profileData, setProfileData } = useContext(ProfileContext);
    const [darkMode, setDarkMode] = useState(profileData.darkMode || false);
    const [remindersEnabled, setRemindersEnabled] = useState(profileData.remindersEnabled || false);
    const navigation = useNavigation();

    const toggleDarkMode = (value) => {
        setDarkMode(value);
        setProfileData(prev => ({ ...prev, darkMode: value }));
    };

    const toggleReminders = (value) => {
        setRemindersEnabled(value);
        setProfileData(prev => ({ ...prev, remindersEnabled: value }));
    };

    const handleLogout = () => {
        setProfileData(prev => ({
            ...prev,
            username: null,
            isAuthenticated: false,
        }));
        navigation.navigate('Login');
    };

    const styles = getStyles(darkMode); // Get styles based on local darkMode state

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General</Text>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Dark Mode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: '#767577', true: Colors.PRIMARY }}
                        thumbColor={darkMode ? Colors.WHITE : '#f4f3f4'}
                    />
                </View>
                <View style={styles.settingItem}>
                    <Text style={styles.settingText}>Reminders</Text>
                    <Switch
                        value={remindersEnabled}
                        onValueChange={toggleReminders}
                        trackColor={{ false: '#767577', true: Colors.PRIMARY }}
                        thumbColor={remindersEnabled ? Colors.WHITE : '#f4f3f4'}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                    <Text style={[styles.settingText, { color: Colors.PRIMARY }]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Moved styles to a separate function
const getStyles = (darkMode) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: darkMode ? Colors.DARK_BACKGROUND : Colors.BACKGROUND,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: darkMode ? Colors.DARK_TEXT : Colors.TEXT,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: darkMode ? Colors.DARK_TEXT : Colors.TEXT,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: darkMode ? '#4a4a4a' : '#eee',
    },
    settingText: {
        fontSize: 16,
        color: darkMode ? Colors.DARK_TEXT : Colors.TEXT,
    },
});

export default SettingsScreen;
