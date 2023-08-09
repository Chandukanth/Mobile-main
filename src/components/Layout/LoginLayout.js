import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import { Color } from '../../helper/Color';

const Layout = ({ children }) => {

  const [isInternetConnection, setIsInternetConnection] = useState(false)
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleConnectivityChange = (state) => {
    setIsInternetConnection(state && state.isConnected)
    if (!state.isConnected) {
      navigation.navigate('NoInternet');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <StatusBar barStyle="dark-content" backgroundColor={!isInternetConnection ? Color.RED : Color.WHITE} />
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'scroll',
    backgroundColor: '#fff',
  },
  header: {
    height: 0,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
