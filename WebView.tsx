import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  BackHandler,
  Alert,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from './src/header';
import autoLoginUtil from './helper/web';
import NetInfo from '@react-native-community/netinfo';

const MyWebView = () => {
  const route = useRoute();
  // const { username: paramUsername, password: paramPassword } = route.params || {};
  const webViewRef = useRef<WebViewType>(null);
  // const webViewRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [progress, setProgress] = useState(0);
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState({
    username: null,
    password: null,
  });
  const BASE_URL = 'https://bvgindex.com/cbse';
  console.log('BASE_URL----',BASE_URL)

  // const encodedPassword = encodeURIComponent(credentials.password);
  // //const loginUrl = `https://bvgindex.com/KSA/Home/Login1?LoginId=${credentials.username}&Password=${encodedPassword}`;
  // const autoLoginScript = autoLoginUtil(paramUsername, paramPassword);
  useEffect(() => {
    const fetchCredentials = async () => {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      setCredentials({ username: username || '', password: password || '' });
      if (username && password) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
      
    };
    fetchCredentials();
  }, []);
const encodedPassword = credentials.password && encodeURIComponent(credentials.password);
const autoLoginScript = credentials.password && autoLoginUtil(credentials.username, credentials.password);

  // Check network connectivity 
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (!state.isConnected) {
        setHasError(true);
      } else if (hasError) {
        // Attempt to reload when connection is restored
        webViewRef.current?.reload();
        setHasError(false);
      }
    });

    return () => unsubscribe();
  }, [hasError]);

  // Handle credentials and cookies
  useEffect(() => {
    const fetchCredentialsAndCookies = async () => {
      try {
        let username = credentials.username;
        let password = credentials.password;

        if (!username || !password) {
          username = await AsyncStorage.getItem('username');
          password = await AsyncStorage.getItem('password');
          if (username && password) {
            setCredentials({ username, password });
          }
        }

        const cookies = await CookieManager.get(BASE_URL);
        if (cookies && Object.keys(cookies).length > 0) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error fetching credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentialsAndCookies();
  }, [credentials]);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    });

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
    console.log('Navigation State:', navState);
    // Check if we've reached a successful login page
    if (navState.url && navState?.url?.includes('User/User/Dashboard') || navState?.url?.includes('Home/Login1')) {
      CookieManager.get(BASE_URL).then(cookies => {
        if (cookies && Object.keys(cookies).length > 0) {
          setIsLoggedIn(true);
        }
      });
    }
  };

  const handleLoadProgress = ({ nativeEvent }) => {
    setProgress(nativeEvent.progress);
  };

  const handleError = async (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error:', nativeEvent);
    setHasError(true);
    
    if (!isConnected) return;
    
    // Auto-retry for certain errors
    if (nativeEvent?.description?.includes('ERR_CONNECTION_RESET') || 
        nativeEvent?.description.includes('ERR_TIMED_OUT')) {
      setTimeout(() => webViewRef.current?.reload(), 2000);
      await AsyncStorage.clear();
                navigation?.replace('login')
    }
  };

  const renderError = () => {
    if (!hasError) return null;
    
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {isConnected ? 
            'Failed to load content. Please try again.' : 
            'No internet connection. Please check your network.'}
        </Text>
        <Text style={styles.retryText} onPress={() => {
          setHasError(false);
          webViewRef.current?.reload();
        }}>
          Tap to retry
        </Text>
      </View>
    );
  };

  const renderLoading = () => {
    if (!loading && progress >= 1) return null;
    
    return (
      <View style={styles.progressContainer}>
        <ActivityIndicator 
          size="large" 
          color="#009efb" 
          animating={progress < 1}
        />
        {progress < 1 && (
          <Text style={styles.loadingText}>Loading... {Math.round(progress * 100)}%</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.fullScreenLoading}>
        <ActivityIndicator size="large" color="#009efb" />
        <Text style={styles.loadingText}>Initializing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#009efb" />
      {/* <Header /> */}
      
      {renderError()}
      
      <WebView
        ref={webViewRef}
        // source={{ uri: BASE_URL }}
        source={{ uri:  'https://bvgindex.com/cbse' }}
        style={[styles.webview, hasError && styles.hiddenWebview]}
        injectedJavaScript={autoLoginScript}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadProgress={handleLoadProgress}
        onError={handleError}
        onHttpError={(syntheticEvent) => {
          console.log('HTTP error:', syntheticEvent.nativeEvent.statusCode);
          webViewRef.current?.reload();
          setHasError(true);
        }}
        onContentProcessDidTerminate={() => {
          Alert.alert('Process Terminated', 'The web process terminated. Reloading...');
          webViewRef.current?.reload();
        }}
        startInLoadingState={true}
        renderLoading={() => renderLoading()}
        allowsBackForwardNavigationGestures={true}
        sharedCookiesEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        thirdPartyCookiesEnabled={true}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        pullToRefreshEnabled={true}
        applicationNameForUserAgent="BVGApp/1.0.0"
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
      />
      
      {renderLoading()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
  },
  hiddenWebview: {
    height: 0,
    width: 0,
  },
  progressContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#009efb',
    fontWeight: 'bold',
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default MyWebView;