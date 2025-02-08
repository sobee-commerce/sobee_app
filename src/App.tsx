import {StripeProvider} from '@stripe/stripe-react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ClickOutsideProvider} from 'react-native-click-outside';
import 'react-native-gesture-handler';
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
