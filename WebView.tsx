import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  BackHandler,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import Header from './src/header';

const MyWebView = () => {
  const route = useRoute();
  const {username: paramUsername, password: paramPassword} = route.params || {};
  const webViewRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [credentials, setCredentials] = useState({
    username: paramUsername,
    password: paramPassword,
  });

  const encodedPassword = encodeURIComponent(credentials.password);
  console.log(credentials)
  const loginUrl = `https://bvglens.com/LENSAPP/Home/Login1?LoginId=${credentials.username}&Password=${encodedPassword}`;
  const successUrl = loginUrl;
  const [currentUrl, setCurrentUrl] = useState(loginUrl);

  useEffect(() => {
    const fetchCredentialsAndCookies = async () => {
      let username = credentials.username;
      let password = credentials.password;

      if (!username || !password) {
        username = await AsyncStorage.getItem('username');
        password = await AsyncStorage.getItem('password');
        setCredentials({username, password});
      }

      const cookies = await CookieManager.get(loginUrl);
      if (cookies && Object.keys(cookies).length > 0) {
        setIsLoggedIn(true);
        setCurrentUrl(successUrl);
      }
      setLoading(false);
    };

    fetchCredentialsAndCookies();
  }, [credentials]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      } else {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
    });
    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = navState => {
    setCanGoBack(navState.canGoBack);
    if (navState.url.includes(successUrl)) {
      CookieManager.get(`https://bvglens.com/LENSAPP/Home/Login1?LoginId=${credentials.username}&Password=${encodedPassword}`).then(cookies => {
        setIsLoggedIn(true);
        setCurrentUrl(successUrl);
      });
    }
  };

  const handleLogout = async () => {
    await CookieManager.clearAll();
    setIsLoggedIn(false);
    setCurrentUrl(loginUrl);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden />
      <Header />
      <WebView
        source={{uri: currentUrl}}
        style={{flex: 1}}
        ref={webViewRef}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  logoutText: {
    color: '#009efb',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MyWebView;
