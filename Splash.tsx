// SplashScreen.js

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkCredentials = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        
       
        if (username && password) {
          // navigation.replace('main');
          navigation.replace('main');
        } else {
          navigation.replace('login');
        }
      } catch (error) {
        console.error('Error checking credentials:', error.message);
        navigation.replace('login');
      }
    };

    checkCredentials();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
