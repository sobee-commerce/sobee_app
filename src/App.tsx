import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {StripeProvider} from '@stripe/stripe-react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect} from 'react';
import {ClickOutsideProvider} from 'react-native-click-outside';
import 'react-native-gesture-handler';
import {
  RESULTS,
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider, SocketProvider, ThemeProvider} from './context';
import {ApplicationNavigator} from './navigators';
import {STORAGE} from './utils';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '875181324783-v3tevbvceqcbaht8me5283gb387rg4sh.apps.googleusercontent.com',
    });
  }, []);

  async function onDisplayNotification(d: any) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      sound: 'default',
      vibration: true,
      vibrationPattern: [300, 500],
      visibility: AndroidVisibility.PUBLIC,
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee
      .displayNotification({
        title: d.notification.title,
        body: d.notification.body,
        data: d.data,
        android: {
          channelId,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          sound: 'default',
          showTimestamp: true,
          vibrationPattern: [300, 100, 100, 100],
        },
      })
      .catch(console.log);
  }

  useEffect(() => {
    (async () => {
      const {status: checkStatus} = await checkNotifications();

      if (checkStatus !== RESULTS.GRANTED && checkStatus !== RESULTS.LIMITED) {
        const {status: grantStatus} = await requestNotifications([
          'badge',
          'sound',
          'alert',
        ]);
        if (
          grantStatus !== RESULTS.GRANTED &&
          grantStatus !== RESULTS.LIMITED
        ) {
          return;
        }
      }
    })();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      await onDisplayNotification({
        notification: remoteMessage.notification,
        data: remoteMessage.data,
      });
    });
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51QqHO6BXIJhk4NY0IM0s9ni75pAwxrca9NluHObPyPa2jRMBvUv7tBSugwI72OIvrokmBtYnC6hXNux03aH345Kb00Qk29sFDD">
      <AuthProvider>
        <SocketProvider>
          <ClickOutsideProvider>
            <SafeAreaProvider style={{flex: 1}}>
              <ThemeProvider storage={STORAGE}>
                <QueryClientProvider client={queryClient}>
                  <ApplicationNavigator />
                </QueryClientProvider>
              </ThemeProvider>
            </SafeAreaProvider>
          </ClickOutsideProvider>
        </SocketProvider>
      </AuthProvider>
    </StripeProvider>
  );
};

export default App;
