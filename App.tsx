import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomNavigation, Text, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import LoginPage from './Login';
import MyWebView from './WebView';
import SplashScreen from './Splash';
import LogoutScreen from './Logout';

const Stack = createNativeStackNavigator();

function MainTabs() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'web', title: 'Web', focusedIcon: 'web', unfocusedIcon: 'web' },
    { key: 'logout', title: 'Logout', focusedIcon: 'logout', unfocusedIcon: 'logout' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'web':
        return <MyWebView />;
      case 'logout':
        return <LogoutScreen />;
      default:
        return null;
    }
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  };

  return (
    <PaperProvider theme={theme}>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{ backgroundColor: '#fff' }}
      />
    </PaperProvider>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="login" component={LoginPage} />
        <Stack.Screen 
          name="main" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;