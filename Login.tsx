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
    
    // await AsyncStorage.setItem('userId', data.data.employeeId.toString());
    // await AsyncStorage.setItem('employeeName', data.data.employeeName);
    // Navigate to the next screen if login is successful
    setLoading(false); // Stop loading
    // Proceed with login logic if both username and password are valid
    if (username.trim() !== '' && password.trim() !== '') {
      setLoading(true); // Start loading
      try {
        const response = await fetch('http://115.124.97.70:8095/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: username,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log('response ======', response);

          // Store credentials in AsyncStorage
          await AsyncStorage.setItem('username', username);
          await AsyncStorage.setItem('password', password);
          // await AsyncStorage.setItem('userId', data.data.employeeId.toString());
          await AsyncStorage.setItem('employeeName', data.data.employeeName);
          
          setLoading(false); // Stop loading
          navigation.replace('main');
        } else {
          console.error('Login failed:', data);
          setLoading(false);
          Alert.alert('Login Failed', data.message || 'Invalid username or password');
        }
      } catch (error) {
        console.error('Login error:', error);
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

      <View style={styles.header}>
        <Image 
          style={styles.logo} 
          source={require('./assets/bvg_logo.webp')} 
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <TextInput
            style={{...styles.input, borderWidth:1, width:'100%'}}
            placeholder="Username"
            placeholderTextColor="#999"
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
          />
          {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordInput}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              onChangeText={text => setPassword(text)}
              value={password}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(prev => !prev)}
            >
              <Text style={styles.eyeIconText}>
                {showPassword ? '🔒' : '🔓'}
              </Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    // borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
    width: '85%',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    padding: 10,
    alignSelf:'flex-end',
    alignContent:'flex-end'
  },
  eyeIconText: {
    fontSize: 20,
  },
  loginButton: {
    height: 50,
    backgroundColor: '#009efb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
  },
});

export default LoginPage;