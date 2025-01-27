import {Button} from '@/components/common';
import {readQRCode} from '@/native/QRCodeModule.android';
import {ApplicationNavigationProps} from '@/types';
import {useNavigation} from '@react-navigation/native';
import {createContext, useCallback, useContext, useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Portal} from 'react-native-portalize';
import {useTheme} from './ThemeContext';

type CameraContextType = {
  torch: boolean;
  toggleTorch: () => void;
  pickImage: () => void;
  isCameraFront: boolean;
  toggleSwitchCamera: () => void;
};

export const CameraContext = createContext<CameraContextType>({
  torch: false,
  toggleTorch: () => {},
  pickImage: () => {},
  isCameraFront: false,
  toggleSwitchCamera: () => {},
});

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within a CameraProvider');
  }
  return context;
};

export const CameraProvider = ({children}: {children: React.ReactNode}) => {
  const navigation = useNavigation<ApplicationNavigationProps>();
  const [torch, setTorch] = useState(false);
  const [isCameraFront, setIsCameraFront] = useState(false);
  const [isPickImageLoading, setIsPickImageLoading] = useState(false);
  const {colors} = useTheme();

  const toggleTorch = () => {
    setTorch(prev => !prev);
  };

  const toggleSwitchCamera = useCallback(() => {
    setIsCameraFront(prev => !prev);
    if (torch) {
      setTorch(false);
    }
  }, [torch]);

  const pickImage = useCallback((onSuccess?: (data: string) => void) => {
    ImageCropPicker.openPicker({
      includeBase64: true,
      width: 512,
      height: 512,
    })
      .then(image => {
        //@ts-ignore
        const base64 = image.data;
        setIsPickImageLoading(true);
        readQRCode(base64)
          .then(data => {
            if (!data) {
              Alert.alert('QR Code not found');
              return;
            }
            onSuccess?.(data);
          })
          .catch(() => {
            Alert.alert('QR Code not found');
          })
          .finally(() => {
            setIsPickImageLoading(false);
          });
      })
      .catch(() => {});
  }, []);

  const value: CameraContextType = {
    pickImage,
    torch,
    toggleTorch,
    isCameraFront,
    toggleSwitchCamera,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
      {isPickImageLoading && (
        <Portal>
          <View style={styles.loading}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color={colors.base.primary} />
              <Text>Scanning QR Code from image</Text>
              <Button onPress={() => setIsPickImageLoading(false)}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </Portal>
      )}
    </CameraContext.Provider>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContent: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    gap: 16,
  },
});
