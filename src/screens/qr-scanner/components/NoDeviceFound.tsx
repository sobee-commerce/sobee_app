import {StyleSheet, Text, View} from 'react-native';

const NoDeviceFound = () => {
  return (
    <View style={styles.container}>
      <Text>No device found.</Text>
    </View>
  );
};

export default NoDeviceFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
