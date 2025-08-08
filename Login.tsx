import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AUTH_TOkEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTcxNTIzNzEsImlzcyI6Imh0dHA6Ly9CVkdLc2EuY29tIiwiYXVkIjoiaHR0cDovL0JWR0tzYS5jb20ifQ.g3ATL1osYGbI7bFQmwIN69M02HIUe167egKv2W_GNWc';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {

    // Validate username
    if (username.trim() === '') {
      setUsernameError('Username cannot be empty');
    } else {
      setUsernameError('');
    }

    // Validate password
    if (password.trim() === '') {
      setPasswordError('Password cannot be empty');
    } else {
      setPasswordError('');
    }
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);
    // await AsyncStorage.setItem('userId', data.data.employeeId.toString());
    // await AsyncStorage.setItem('employeeName', data.data.employeeName);
    // Navigate to the next screen if login is successful
    setLoading(false); // Stop loading
    // navigation.replace('web', {username, password});
    // return
    // Proceed with login logic if both username and password are valid
    if (username.trim() !== '' && password.trim() !== '') {
      setLoading(true); // Start loading
      try {
        const response = await fetch('http://115.124.97.70:8093/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AUTH_TOkEN}`, // Add the Bearer token here
          },
          body: JSON.stringify({
            loginId: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('response', response);
          // Store credentials in AsyncStorage
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
          await AsyncStorage.setItem('userId', data.data.employeeId.toString());
          await AsyncStorage.setItem('employeeName', data.data.employeeName);
          // Navigate to the next screen if login is successful
          setLoading(false); // Stop loading
          // navigation.replace('web', {username, password});
          navigation.replace('main');

        } else {
          // Handle login failure
          setLoading(false); // Stop loading
          Alert.alert(
            'Login Failed',
            data.message || 'Invalid username or password',
          );
        }
      } catch (error) {
        // Handle network or other errors
        setLoading(false); // Stop loading
        Alert.alert('Login Failed',
            error?.data?.message || 'Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Image style={styles.logo} source={require('./assets/bvg_logo.webp')} />

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          autoCapitalize="none"
          onChangeText={text => setUsername(text)}
        />
      </View>
      {usernameError ? (
        <Text style={styles.errorText}>{usernameError}</Text>
      ) : null}

      <View style={styles.inputView}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
        style={[styles.inputText, { flex: 1 }]}
        placeholder="Password"
        placeholderTextColor="#003f5c"
        secureTextEntry={!showPassword}
        onChangeText={text => setPassword(text)}
        value={password}
          />
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
        <Text style={{ padding: 8 }}>
            <Text style={{ fontSize: 22 }}>
              {!showPassword ? '🔒' : '🔓'}
            </Text>
        </Text>
          </TouchableOpacity>
        </View>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    color: '#5c5c5c',
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#d9d9d9',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: '#333',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#009efb',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginPage;
