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
import autoLoginUtil from './helper/web';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Header from './src/header';

const MyWebView = () => {
  const route = useRoute();
  const {username: paramUsername, password: paramPassword} = route.params ?? {};
  const webViewRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('https://bvgindex.com/KSA/');
  const [canGoBack, setCanGoBack] = useState(false);
  const [username, setUsername] = useState(paramUsername);
  const [password, setPassword] = useState(paramPassword);

  const loginUrl = 'https://bvgindex.com/BPCL';
  const successUrl = 'https://bvgindex.com/BPCL';

  useEffect(() => {
    const fetchCredentials = async () => {
      if (!username || !password) {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');
        setUsername(storedUsername);
        setPassword(storedPassword);
      }
    };

    const checkCookies = async () => {
      const cookies = await CookieManager.get('https://bvgindex.com/BPCL');
      if (cookies && Object.keys(cookies).length > 0) {
        // console.log('Cookies found:', cookies);
        setIsLoggedIn(true);
        setCurrentUrl(successUrl);
      } else {
        // console.log('No cookies found');
      }
      setLoading(false);
    };

    fetchCredentials();
    checkCookies();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true;
        } else {
          Alert.alert(
            'Exit App',
            'Are you sure you want to exit?',
            [
              {text: 'Cancel', onPress: () => {}, style: 'cancel'},
              {text: 'Exit', onPress: () => BackHandler.exitApp()},
            ],
            {cancelable: false},
          );
          return true;
        }
      },
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = navState => {
    setCanGoBack(navState.canGoBack);
    // console.log('Navigation State Change:', navState);
    if (navState.url.includes(successUrl)) {
      CookieManager.get('https://bvglens.com').then(cookies => {
        // console.log('Captured cookies:', cookies);
        setIsLoggedIn(true);
        setCurrentUrl(successUrl);
      });
    }
  };

  const handleLogout = async () => {
    await CookieManager.clearAll();
    // console.log('Cookies cleared');
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

  const autoLoginScript = autoLoginUtil(username, password);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden />
      <Header />
      {/* <LinearGradient colors={['#009efb', '#2b6cb0']} style={styles.header}>
        <Image
          source={{ uri: 'https://example.com/profile-icon.png' }}
          style={styles.profileIcon}
        />
        <Text style={styles.greeting}>Hello, {username}!</Text>
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </LinearGradient> */}
      <WebView
        source={{uri: currentUrl}}
        style={{flex: 1}}
        ref={webViewRef}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScript={autoLoginScript}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
  greeting: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
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
