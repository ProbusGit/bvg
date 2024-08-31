// In App.js in a new project
import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './Login';
import MyWebView from './WebView';
import SplashScreen from './Splash';
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="login" component={LoginPage} />
        <Stack.Screen name="web" component={MyWebView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
