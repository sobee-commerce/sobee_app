import {useCameraContext} from '@/context/CameraContext';
import {ApplicationScreenProps} from '@/types';
import {useEffect, useRef, useState} from 'react';
import {Alert, StatusBar, StyleSheet, View} from 'react-native';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import AdditionalActions from './components/AdditionalActions';
import CameraActions from './components/CameraActions';
import NoDeviceFound from './components/NoDeviceFound';
import Overlay from './components/Overlay';
import RequestCameraPermission from './components/RequestCameraPermission';

const QrScanner = ({
  navigation,
  route,
}: ApplicationScreenProps<'ScanQRCode'>) => {
  const cameraRef = useRef<Camera>(null);
  const {torch, isCameraFront} = useCameraContext();
  const cameraPosition = isCameraFront ? 'front' : 'back';

  const {hasPermission} = useCameraPermission();
  const device = useCameraDevice(cameraPosition);
  const format = useCameraFormat(device, [{photoHdr: true}, {videoHdr: true}]);
  const hasTorch = device?.hasTorch;
  const [code, setCode] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: !hasPermission,
      headerTitleAlign: 'left',
      headerTitle: undefined,
      headerRight: ({tintColor}) => (
        <AdditionalActions tintColor={tintColor} isHeader />
      ),
    });
  }, [hasPermission, navigation]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: data => {
      const firstCode = data[0];
      if (!firstCode) {
        return Alert.alert('No QR code found');
      }
      const value = firstCode.value;
      if (!value) {
        return Alert.alert('No QR code found');
      }
      if (value === code) {
        return;
      }
      navigation.canGoBack() && navigation.goBack();
      setCode(value);
      route.params?.onSuccess?.(value);
    },
  });

  const onError = (e: CameraRuntimeError) => {
    switch (e.code) {
      case 'system/camera-is-restricted':
        console.log('Camera is restricted');
        break;
      default:
        console.log('Camera error', e.message);
        break;
    }
  };

  if (!hasPermission) {
    return <RequestCameraPermission />;
  }
  if (device == null) {
    return <NoDeviceFound />;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
        device={device}
        isActive
        format={format}
        photoHdr={format?.supportsPhotoHdr}
        videoHdr={format?.supportsVideoHdr}
        onError={onError}
        torch={torch ? 'on' : 'off'}
      />
      <Overlay />
      <AdditionalActions />
      <CameraActions hasTorch={hasTorch} />
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
    </View>
  );
};

export default QrScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
