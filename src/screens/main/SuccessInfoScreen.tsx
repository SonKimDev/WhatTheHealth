import {View, Text, SafeAreaView, Image, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {SCREEN} from '../../constans/themes';
import {ButtonComponent, SpaceComponent} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';

export default function SuccessInfoScreen() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 30}}>
        <Image
          source={require('../../assets/images/success-info.png')}
          style={{
            width: SCREEN.WIDTH,
            height: SCREEN.HEIGHT * 0.4,
            alignSelf: 'center',
            resizeMode: 'contain',
          }}
        />
        <SpaceComponent height={44} />
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          {'Xin chào, ' + user?.lastName}
        </Text>
        <SpaceComponent height={5} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          Bây giờ bạn đã sẵn sàng, hãy cùng chúng tôi
        </Text>
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          chinh phục mục tiêu của bạn
        </Text>
        <View style={{flex: 1}} />
        <ButtonComponent
          title="Hoàn Thành"
          onPress={() => navigation.replace('TabScreen')}
        />
      </View>
      {Platform.OS === 'android' && <SpaceComponent height={16} />}
    </SafeAreaView>
  );
}
