import {useTheme} from '@/context';
import {useGetOrderItemsQuery} from '@/services';
import {FONT_FAMILY, FONT_SIZE, TYPOGRAPHY} from '@/theme';
import {ApplicationScreenProps} from '@/types';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {CircleDashed, MessageCircle, ShoppingCart} from 'lucide-react-native';
import {Pressable, Text, View} from 'react-native';
import {bottomTabsMock} from './bottom-tabs.mock';

const Tab = createBottomTabNavigator();

const BottomTabs = ({navigation}: ApplicationScreenProps<'Main'>) => {
  const {colors} = useTheme();
  const {data} = useGetOrderItemsQuery();
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: {
          color: colors.white,
          fontFamily: FONT_FAMILY.semiBold,
          fontSize: FONT_SIZE.h6,
        },
        headerTintColor: colors.white,
        headerRight: ({tintColor}) => (
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              alignItems: 'center',
              marginRight: 16,
            }}>
            <Pressable onPress={() => navigation.navigate('Cart')}>
              <ShoppingCart size={24} color={tintColor} strokeWidth={1.5} />
              {data?.data?.length ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    backgroundColor: colors.base.danger,
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={[{color: colors.white}, TYPOGRAPHY.overline]}>
                    {data.data.length}
                  </Text>
                </View>
              ) : null}
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Chat')}>
              <MessageCircle size={24} color={tintColor} strokeWidth={1.5} />
            </Pressable>
          </View>
        ),
      }}>
      {bottomTabsMock.map(tab => (
        <Tab.Screen
          key={tab.key}
          name={tab.title}
          component={tab.component}
          options={{title: tab.title}}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabs;

const CustomBottomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 'auto',
        backgroundColor: colors.layout.background,
        elevation: 10,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        const GeneIcon = bottomTabsMock.at(index)?.icon || CircleDashed;
        const color = isFocused
          ? colors.base.primary
          : colors.default.default500;
        return (
          <Pressable
            key={state.routes[index].key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
            }}>
            <GeneIcon
              size={24}
              color={color}
              strokeWidth={isFocused ? 1.5 : 1}
            />
            <Text style={[{color}, TYPOGRAPHY.caption]}>{label as string}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
