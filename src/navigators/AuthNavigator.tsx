import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ForgotPasswordScreen,
  LoginScreen,
  OnBoardingScreen,
  RegisterScreen,
} from '../screens/auth';
import {COLORS} from '../constans/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthNavigator() {
  const Stack = createNativeStackNavigator();
  const [firstLaunch, setFirstLaunch] = useState(null);

  React.useLayoutEffect(() => {
    const loadFirstLaunch = async () => {
      const value = await AsyncStorage.getItem('firstLaunch');
      if (value === null) {
        setFirstLaunch(true);
      } else {
        setFirstLaunch(false);
      }
    };
    loadFirstLaunch();
  });

  return (
    firstLaunch != null && (
      <Stack.Navigator
        screenOptions={{
          headerTintColor: COLORS.BLACK,
        }}>
        {firstLaunch && (
          <Stack.Screen
            name="OnBoardingScreen"
            component={OnBoardingScreen}
            options={{headerShown: false}}
          />
        )}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            title: 'Đăng Ký',
          }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{
            headerShown: true,
            headerBackTitleVisible: false,
            title: 'Quên Mật Khẩu',
          }}
        />
      </Stack.Navigator>
    )
  );
}
