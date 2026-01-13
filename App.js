import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from './src/screens/LandingScreen';
import CategorySelectionScreen from './src/screens/CategorySelectionScreen';
import GamePlayScreen from './src/screens/GamePlayScreen';
import RoundResultsScreen from './src/screens/RoundResultsScreen';
import { LanguageProvider } from './src/context/LanguageContext';
import { GameDataProvider } from './src/context/GameDataContext';
import { registerForPushNotificationsAsync, scheduleDailyReminder } from './src/services/notificationService';

const Stack = createNativeStackNavigator();

export default function App() {
    useEffect(() => {
        async function setupNotifications() {
            await registerForPushNotificationsAsync();
            await scheduleDailyReminder();
        }
        setupNotifications();
    }, []);

    return (
        <LanguageProvider>
            <GameDataProvider>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Landing"
                        screenOptions={{
                            headerShown: false,
                            animation: 'slide_from_right'
                        }}
                    >
                        <Stack.Screen name="Landing" component={LandingScreen} />
                        <Stack.Screen name="Selection" component={CategorySelectionScreen} />
                        <Stack.Screen name="Gameplay" component={GamePlayScreen} />
                        <Stack.Screen name="Results" component={RoundResultsScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </GameDataProvider>
        </LanguageProvider>
    );
}
