import {useTheme} from '@/context';
import {useCameraContext} from '@/context/CameraContext';
import {
  ImagesIcon,
  SwitchCameraIcon,
  ZapIcon,
  ZapOffIcon,
} from 'lucide-react-native';
import {Pressable, StyleSheet, View} from 'react-native';

type Props = {
  hasTorch?: boolean;
};

const CameraActions = ({hasTorch = false}: Props) => {
  const {toggleTorch, torch, pickImage, toggleSwitchCamera} =
    useCameraContext();
  const {colors} = useTheme();
  const TorchIcon = torch ? ZapIcon : ZapOffIcon;

  return (
    <View style={styles.torchContainer}>
      {hasTorch && (
        <Pressable onPress={toggleTorch} style={styles.torch}>
          <TorchIcon size={30} color={colors.white} />
        </Pressable>
      )}
      <Pressable
        onPress={pickImage}
        hitSlop={20}
        style={[styles.otherActions, styles.pickImage]}>
        <ImagesIcon stroke={colors.white} size={24} />
      </Pressable>
      <Pressable
        onPress={toggleSwitchCamera}
        hitSlop={20}
        style={[styles.otherActions, styles.switchCamera]}>
        <SwitchCameraIcon stroke={colors.white} size={24} />
      </Pressable>
    </View>
  );
};

export default CameraActions;

const styles = StyleSheet.create({
  torchContainer: {
    position: 'absolute',
    zIndex: 2,
    bottom: 20,
    left: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  torch: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 100,
    bottom: 20,
  },
  otherActions: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 14,
    borderRadius: 100,
    bottom: 20,
  },
  pickImage: {
    position: 'absolute',
    right: 0,
  },
  switchCamera: {
    position: 'absolute',
    left: 0,
  },
});
