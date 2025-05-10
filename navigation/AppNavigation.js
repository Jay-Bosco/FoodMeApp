import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import WaterIntakeScreen from '../screens/WaterIntakeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import HealthGoalsScreen from '../screens/HealthGoalsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MealSuggestionsScreen from '../screens/MealSuggestionsScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import YourDietScreen from '../screens/YourDietScreen';
import MealPortionScreen from '../screens/MealPortionScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthenticationScreen from '../screens/AuthenticationScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CompleteSignUpScreen from '../screens/CompleteSignUpScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// HomeStack
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WaterIntake" component={WaterIntakeScreen} />
      <Stack.Screen name="HealthGoals" component={HealthGoalsScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="MealSuggestions" component={MealSuggestionsScreen} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} />
      <Stack.Screen name="MealPortion" component={MealPortionScreen} />
      <Stack.Screen name="YourDiet" component={YourDietScreen} />
    </Stack.Navigator>
  );
}

// ProfileStack
function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="YourDiet" component={YourDietScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileStack} options={{ headerShown: false }}/>
      <Tab.Screen name="Health Goals" component={HealthGoalsScreen} />
      <Tab.Screen name="YourDiet" component={YourDietScreen}/>
    </Tab.Navigator>
  );
}

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Authentication" component={AuthenticationScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CompleteSignUp" component={CompleteSignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
