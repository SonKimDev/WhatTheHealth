import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from './src/screens/SplashScreen';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store/store';
import RouteNavigator from './src/navigators/RouteNavigator';

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

  const renderContent = () => {
    if (isShowSplash) {
      return <SplashScreen />;
    }
    return (
      <NavigationContainer>
        <RouteNavigator />
      </NavigationContainer>
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor={'transparent'}
      />
      <Provider store={store}>{renderContent()}</Provider>
    </>
  );
}
