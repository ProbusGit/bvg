import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  BackHandler,
  Alert,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {WebView} from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import Header from './src/header';
import RNFS from 'react-native-fs';

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
  console.log('currentUrl', currentUrl);
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

  // Helper to handle PDF downloads
  const handlePdfDownload = async (url: string) => {
    try {
      setLoading(true);
      const fileName = url.split('/').pop() || 'download.pdf';
      const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      const options = {
        fromUrl: url,
        toFile: downloadDest,
      };
      await RNFS.downloadFile(options).promise;
      setLoading(false);
      Alert.alert('Download Complete', `PDF saved to: ${downloadDest}`);
    } catch (error) {
      setLoading(false);
      Alert.alert('Download Failed', 'Could not download PDF.');
    }
  };

  // Intercept navigation requests to handle PDF downloads
  const handleShouldStartLoadWithRequest = (event: any) => {
    console.log('Request URL:', event.url);
    
    if (
      event.url.endsWith('.pdf') ||
      event.url.includes('DownloadSalarySalipList')
    ) {
      handlePdfDownload(event.url);
      return false; // Prevent WebView from loading the PDF
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden />
      <Header />
      {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009efb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
      )}
      <WebView
      source={{uri: currentUrl}}
      onLoadStart={() => setLoading(true)}
      onLoadEnd={() => setLoading(false)}
      style={{flex: 1, display: loading ? 'none' : 'flex'}}
      ref={webViewRef}
      onNavigationStateChange={handleNavigationStateChange}
      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      onHttpError={() => {
        Alert.alert(
        'Error',
        'An error occurred while loading the page.',
        [
          {text: 'Retry', onPress: () => webViewRef.current?.reload()},
          {text: 'Cancel', style: 'cancel'},
        ]
        );
      }}
      onError={() => {
        Alert.alert(
        'Error',
        'An error occurred while loading the page.',
        [
          {text: 'Retry', onPress: () => webViewRef.current?.reload()},
          {text: 'Cancel', style: 'cancel'},
        ]
        );
      }}
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
  },
});

export default MyWebView;
