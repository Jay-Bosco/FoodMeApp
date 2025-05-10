import React, { createContext, useState } from 'react';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  // Profile data
  const [profileData, setProfileData] = useState({
    username: 'John Doe',        // Default username
    profileImage: null,           // Default profile image
    currentWeight: '',            // Default current weight
    goalWeight: '',             // Default goal weight
    targetDate: '',              // Default target date
    isAuthenticated: false,         // Auth status
    darkMode: false,             // Default dark mode setting
    remindersEnabled: false,
  });

  // Selected meals for diet planning
  const [selectedMeals, setSelectedMeals] = useState([]);

  const toggleMealSelection = (meal) => {
    setSelectedMeals((prev) => {
      const exists = prev.find((m) => m.id === meal.id);
      if (exists) {
        return prev.filter((m) => m.id !== meal.id); // Remove
      } else {
        return [...prev, meal]; // Add
      }
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setProfileData,
        selectedMeals,
        setSelectedMeals,
        toggleMealSelection,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
