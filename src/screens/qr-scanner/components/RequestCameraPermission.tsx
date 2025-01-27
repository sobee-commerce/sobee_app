import {Button} from '@/components/common';
import {useTheme} from '@/context';
import {useCameraContext} from '@/context/CameraContext';
import {TYPOGRAPHY} from '@/theme';
import {WIDTH, vs} from '@/utils/responsive';
import {useCallback} from 'react';
import {Alert, Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useCameraPermission} from 'react-native-vision-camera';

const RequestCameraPermission = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const {colors} = useTheme();
  const {pickImage} = useCameraContext();

  const onPressRequestCameraPermission = useCallback(async () => {
    if (hasPermission) {
      return;
    }
    const result = await requestPermission();

    if (!result) {
      Alert.alert(
        'Permission denied',
        "You can't use the camera without permission",
      );
    }
  }, [hasPermission, requestPermission]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/illustrations/camera.webp')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={[TYPOGRAPHY.body2]}>
        Request camera permission to scan QR code
      </Text>

      <View style={styles.actionContainer}>
        <Button
          color="primary"
          onPress={onPressRequestCameraPermission}
          style={{
            maxWidth: 240,
          }}>
          <Text
            style={[
              TYPOGRAPHY.button,
              {
                color: colors.content.content1,
              },
            ]}>
            Grant access
          </Text>
        </Button>
        <Text style={[TYPOGRAPHY.body2]}>or</Text>
        <Button
          onPress={pickImage}
          style={{
            maxWidth: 240,
          }}
          color="secondary">
          <Text
            style={[
              TYPOGRAPHY.button,
              {
                color: colors.content.content1,
              },
            ]}>
            Pick from library
          </Text>
        </Button>
      </View>
      <StatusBar
        backgroundColor={colors.transparent}
        barStyle="dark-content"
        translucent
      />
    </View>
  );
};

export default RequestCameraPermission;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: vs(20),
    padding: 20,
    backgroundColor: 'white',
  },
  image: {
    width: WIDTH - 40,
    height: WIDTH - 100,
  },
  actionContainer: {
    gap: 8,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
