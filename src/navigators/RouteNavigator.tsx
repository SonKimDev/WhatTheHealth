import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {addAuth} from '../store/slices/auth';
import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';
import {selectUser} from '../store/slices/auth/selectors';

export default function RouteNavigator() {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const loadUserInfo = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      dispatch(addAuth(JSON.parse(user)));
    }
  };

  React.useEffect(() => {
    loadUserInfo();
  }, []);

  return user ? <MainNavigator /> : <AuthNavigator />;
}
