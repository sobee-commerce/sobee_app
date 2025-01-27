import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ClickOutsideProvider} from 'react-native-click-outside';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {SocketProvider, ThemeProvider} from './context';
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
  );
};

export default App;
