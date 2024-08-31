import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import useStyles from './useStyles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon set you want to use

import FastImage from 'react-native-fast-image';
import useHeader from './useHeader';

import greetUser from './greeting';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {};

const Header = (props: Props) => {
  const styles = useStyles();
  const { employeeDetails, ntfCount } = useHeader();
  const [userName, setUserName] = useState('');
  const { message, image, profileImage } = greetUser();
  const navigation = useNavigation<any>();

  const handleProfileImagePress = () => {
    // Navigate to the user profile screen, you can pass parameters if needed
    // navigation.navigate(screenNames.profile, { userId: null });
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('login')
    // Navigate to the login screen or another appropriate screen
    // navigation.navigate(screenNames.login);
  };

  useEffect(() => {
    const employeeName = getUserName().then(name => { });
  }, []);

  const getUserName = async () => {
    const employeeName = await AsyncStorage.getItem('employeeName');
    setUserName(employeeName);
  };

  return (
    <ImageBackground
      blurRadius={2}
      style={styles.headerImageBackgroundView}
      imageStyle={styles.headerImage}
      source={image}>
      <View style={styles.parentContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.rowLeftContainer}>
            {/* <Icon
              name="menu"
              onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
              size={22}
              color={'#ffffff'}
            /> */}
            <View style={styles.userGreetContainer}>
              <Text style={styles.greetText}>{message}</Text>
              <Text style={styles.usernameText}>
                {userName ? userName : 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.rowRightContainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate(screenNames.notificationScreen)
              }>
              <View style={styles.bellIconContainer}>
                {/* <Icon name="bell" size={22} color={'#ffffff'} /> */}

                {ntfCount ? (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>{ntfCount}</Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>
            </TouchableWithoutFeedback>

            <Pressable onPress={handleProfileImagePress}>
              <FastImage
                resizeMode="contain"
                style={styles.profileImage}
                source={
                  employeeDetails?.photo ? { uri: employeeDetails.photo } : profileImage
                }
              />
            </Pressable>

            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Icon name="sign-out" size={26} color="#ffffff" />
            </Pressable>
          </View>
        </View>
        {/* <Searchbar
          value=""
          mode="view"
          placeholder="Search Employees"
          editable={false}
          style={styles.searchBar}
          inputStyle={styles.searchText}
        /> */}
      </View>
    </ImageBackground>
  );
};

export default Header;
