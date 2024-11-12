import {HomeScreen, OrderScreen, ProfileScreen, SearchScreen} from '@/screens';
import {ApplicationStackParamList} from '@/types';
import {Box, Compass, LucideIcon, Search, UserRound} from 'lucide-react-native';
type BottomTab = {
  key: keyof ApplicationStackParamList;
  title: string;
  icon: LucideIcon;
  component: React.FC;
};

export const bottomTabsMock: BottomTab[] = [
  {
    key: 'Home',
    title: 'Explore',
    icon: Compass,
    component: HomeScreen,
  },
  {
    key: 'Search',
    title: 'Search',
    icon: Search,
    component: SearchScreen,
  },
  {
    key: 'Order',
    title: 'Orders',
    icon: Box,
    component: OrderScreen,
  },
  {
    key: 'Profile',
    title: 'Profile',
    icon: UserRound,
    component: ProfileScreen,
  },
];