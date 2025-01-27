import {NativeModules} from 'react-native';
const {QRCodeModule} = NativeModules;

export const generateQRCode = (
  content: string,
  width: number = 200,
  height: number = 200,
  qrColor = '#000000', // Default QR color is black
  backgroundColor = '#FFFFFF', // Default background color is white
  errorCorrection = 'M', // Default error correction level is 'M'
  logoBase64?: string, // Optional logo in Base64 format
): Promise<string> => {
  return new Promise((resolve, reject) => {
    QRCodeModule.generateQRCode(
      content,
      width,
      height,
      qrColor,
      backgroundColor,
      errorCorrection,
      logoBase64,
      (error: any, qrCode: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(qrCode);
        }
      },
    );
  });
};

export const readQRCode = (encodedImage: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    QRCodeModule.readQRCodeFromBitmap(
      encodedImage,
      (error: any, result: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );
  });
};
