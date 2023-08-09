import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

const NoInternetConnection = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => { return true },
    );
    return () => backHandler.remove();

  }, []);

  const handleConnectivityChange = (state) => {
    if (isFocused && state.isConnected) {
      navigateToPreviousScreen();
    }
  };

  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        navigateToPreviousScreen();
      }
    });
  };

  const navigateToPreviousScreen = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet</Text>
      <TouchableOpacity style={styles.button} onPress={handleRetry}>
        <Text style={styles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default NoInternetConnection;
