import * as React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './Login';
import MyWebView from './WebView';
import SplashScreen from './Splash';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='splash' screenOptions={{headerShown: false}}>
          <Stack.Screen name="splash" component={SplashScreen} />
          <Stack.Screen name="login" component={LoginPage} />
          <Stack.Screen name="web" component={MyWebView} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Adjust based on your app's design
  },
});

export default App;
