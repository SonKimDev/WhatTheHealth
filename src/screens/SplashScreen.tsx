import {Image, View} from 'react-native';
import React from 'react';
import {SCREEN} from '../constans/themes';

export default function SplashScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../assets/images/mini-logo.png')}
        style={{
          width: SCREEN.WIDTH - 80,
          height: SCREEN.HEIGHT * 0.2,
          resizeMode: 'contain',
        }}
      />
    </View>
  );
}
