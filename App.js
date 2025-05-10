import React from 'react';
import { ProfileProvider } from './context/ProfileContext'; // ✅ make sure this exists
import AppNavigation from './navigation/AppNavigation';

const App = () => {
  return (
    <ProfileProvider>
      <AppNavigation />
    </ProfileProvider>
  );
};

export default App;
