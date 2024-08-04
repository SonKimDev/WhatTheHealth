import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {CardComponent, SpaceComponent} from '../../components';
import {COLORS, SCREEN, SIZES} from '../../constans/themes';
import {useNavigation} from '@react-navigation/native';

export default function MeditationScreen() {
  const navigation = useNavigation();

  const handleNextToStartMeditation = (data: any) => {
    navigation.replace('StartMediationScreen', {duration: data});
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <SpaceComponent height={20} />
        <Text
          style={{
            textAlign: 'center',
            fontSize: SIZES.h2,
            fontWeight: 'bold',
            color: COLORS.BLACK,
          }}>
          Hướng Dẫn Ngắn Gọn
        </Text>
        <SpaceComponent height={15} />
        <Text style={[globalStyles.text]}>
          1. Tìm một không gian yên tĩnh và ngồi thoải mái.{'\n'}
          2. Nhắm mắt và hít thở sâu.{'\n'}
          3. Tập trung vào hơi thở và cảm nhận sự tĩnh lặng.{'\n'}
          4. Khi suy nghĩ xuất hiện, nhẹ nhàng đưa tâm trí trở lại hơi thở.
        </Text>
        <SpaceComponent height={40} />
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TouchableOpacity onPress={() => handleNextToStartMeditation(10)}>
            <CardComponent
              style={{
                width: SCREEN.WIDTH * 0.42,
                height: SCREEN.HEIGHT * 0.2,
                borderRadius: 20,
                overflow: 'hidden',
              }}>
              <ImageBackground
                source={require('../../assets/images/morning.png')}
                style={{width: '100%', height: '100%'}}
              />
              <Text
                style={{
                  color: COLORS.WHITE,
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  fontWeight: 'bold',
                  fontSize: SIZES.h3,
                  fontStyle: 'italic',
                }}>
                10 phút
              </Text>
            </CardComponent>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNextToStartMeditation(20)}>
            <CardComponent
              style={{
                width: SCREEN.WIDTH * 0.42,
                height: SCREEN.HEIGHT * 0.2,
                borderRadius: 20,
                overflow: 'hidden',
              }}>
              <ImageBackground
                source={require('../../assets/images/night.png')}
                style={{width: '100%', height: '100%'}}
              />
              <Text
                style={{
                  color: COLORS.WHITE,
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  fontWeight: 'bold',
                  fontSize: SIZES.h3,
                  fontStyle: 'italic',
                }}>
                20 phút
              </Text>
            </CardComponent>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
