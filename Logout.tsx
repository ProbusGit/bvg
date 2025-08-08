import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions, useFocusEffect } from '@react-navigation/native';

const LogoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      const showLogoutConfirmation = () => {
        Alert.alert(
          'Confirm Logout',
          'Are you sure you want to log out?',
          [
            {
              text: 'Yes',
              onPress: async () => {
                setIsLoggingOut(true); // Start the logout process
                await AsyncStorage.clear();
                navigation.replace('login')
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => navigation.goBack(), // Navigate back to the previous screen if "Cancel" is pressed
            },
          ],
          { cancelable: false }
        );
      };

      
      showLogoutConfirmation();
    }, [navigation])
  );

  const logout = async () => {
    setIsLoggingOut(true);
    await AsyncStorage.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }],
      })
    );
  };
  return (
    <View style={styles.container}>
      {isLoggingOut ? (
        <>
          <Text>Logging out...</Text>
              <Text>
              If you are not redirected,{' '}
              <TouchableOpacity onPress={() => {logout()}}>
                <Text style={{ color: 'blue' }}>tap here to login</Text>
              </TouchableOpacity>
              .
              </Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </>
      ) : (
        <View>
          <Text>
              If you are not redirected,{' '}
              <TouchableOpacity onPress={() =>{logout()}}>
                <Text style={{ color: 'blue' }}>tap here to login</Text>
              </TouchableOpacity>
              .
              </Text>
        <Text>Awaiting confirmation...</Text> 
        </View>
      )}
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

export default LogoutScreen;
