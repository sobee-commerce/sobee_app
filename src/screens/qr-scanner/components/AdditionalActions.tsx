import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'lucide-react-native';
import {Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = {
  tintColor?: string;
  isHeader?: boolean;
};

const AdditionalActions = ({tintColor = '#fff', isHeader = false}: Props) => {
  const navigation = useNavigation<ApplicationNavigationProps>();

  const Wrapper = isHeader ? View : SafeAreaView;

  return (
    <>
      <Wrapper style={[styles.container]}>
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft stroke={tintColor} size={24} />
        </Pressable>
      </Wrapper>
    </>
  );
};

export default AdditionalActions;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1,
    right: 20,
    left: 20,
    top: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
});
