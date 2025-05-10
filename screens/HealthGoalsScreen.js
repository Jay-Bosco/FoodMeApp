// screens/HealthGoalsScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { ProfileContext } from '../context/ProfileContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../constants/colors';

const HealthGoalsScreen = ({ navigation }) => {
  const { profileData, setProfileData } = useContext(ProfileContext);
  const [currentWeight, setCurrentWeight] = useState(profileData.currentWeight);
  const [goalWeight, setGoalWeight] = useState(profileData.goalWeight);
  const [targetDate, setTargetDate] = useState(profileData.targetDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveGoal = () => {
    if (!currentWeight || !goalWeight || !targetDate) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setProfileData({
      ...profileData,
      currentWeight,
      goalWeight,
      targetDate,
    });

    navigation.goBack(); // Navigate back to ProfileScreen
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || targetDate;
    setShowDatePicker(false);
    setTargetDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Health Goals</Text>

      <Text style={styles.label}>Current Weight (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={currentWeight}
        onChangeText={setCurrentWeight}
        placeholder="Enter current weight"
      />

      <Text style={styles.label}>Goal Weight (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={goalWeight}
        onChangeText={setGoalWeight}
        placeholder="Enter goal weight"
      />

      <Text style={styles.label}>Target Date</Text>
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePickerModal}>
      <Text style={styles.dateText}>
  {targetDate ? targetDate.toLocaleDateString() : 'Select target date'}
</Text>

      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={targetDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
        <Text style={styles.saveButtonText}>Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.BACKGROUND_COLOR,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: Colors.BUTTON_COLOR,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.BUTTON_COLOR,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HealthGoalsScreen;
