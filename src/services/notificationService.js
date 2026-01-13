import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

// Register for push notifications
export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        // token = (await Notifications.getExpoPushTokenAsync()).data;
        // console.log(token);
    } else {
        // console.log('Must use physical device for Push Notifications');
    }

    return token;
}

// Schedule a daily reminder
export async function scheduleDailyReminder() {
    try {
        // Cancel all existing notifications to avoid duplicates
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Schedule notification for 7 PM every day
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Tabu time! 🎭",
                body: "Gather your friends and start a new round! Who will be the winner today?",
                sound: true,
            },
            trigger: {
                hour: 19, // 7 PM
                minute: 0,
                repeats: true,
            },
        });

        console.log('Daily reminder scheduled for 7 PM');
    } catch (error) {
        console.error('Error scheduling notification:', error);
    }
}
