import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { LanguageProvider } from './src/services/i18n';

// Optimize native screen transitions and memory consumption on Android & iOS
enableScreens(true);

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
}
