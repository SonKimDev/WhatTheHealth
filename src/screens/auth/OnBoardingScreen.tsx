import {View, Text, Image} from 'react-native';
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {COLORS, SCREEN, SIZES} from '../../constans/themes';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slices = [
  {
    id: 1,
    img: require('../../assets/images/Onboarding-1.png'),
    title: 'Mục Tiêu',
    description:
      'Đừng lo lắng nếu bạn gặp khó khăn trong việc xác định mục tiêu của mình. Chúng tôi có thể giúp bạn xác định và theo dõi mục tiêu của mình.',
  },
  {
    id: 2,
    img: require('../../assets/images/Onboarding-2.png'),
    title: 'Đốt Cháy',
    description:
      'Hãy tiếp tục đốt cháy năng lượng để đạt được mục tiêu của bạn, cơn đau chỉ là tạm thời, nếu bạn bỏ cuộc bây giờ, bạn sẽ chịu đựng nỗi đau mãi mãi.',
  },
  {
    id: 3,
    img: require('../../assets/images/Onboarding-3.png'),
    title: 'Ăn Uống',
    description:
      'Hãy bắt đầu một lối sống lành mạnh cùng chúng tôi, chúng tôi có thể xác định chế độ ăn uống của bạn mỗi ngày. Ăn uống lành mạnh rất thú vị.',
  },
  {
    id: 4,
    img: require('../../assets/images/Onboarding-4.png'),
    title: 'Giấc Ngủ',
    description:
      'Cải thiện chất lượng giấc ngủ của bạn cùng chúng tôi, giấc ngủ chất lượng tốt có thể mang lại tâm trạng tốt vào buổi sáng.',
  },
];

const renderItem = ({item}: any) => (
  <View style={{flex: 1}}>
    <Image
      source={item.img}
      style={{
        width: SCREEN.WIDTH,
        resizeMode: 'stretch',
        height: 421,
      }}
    />
    <Text
      style={{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 50,
        paddingHorizontal: 20,
        color: COLORS.BLACK,
      }}>
      {item.title}
    </Text>
    <Text
      style={{
        fontSize: SIZES.h4,
        marginTop: 15,
        paddingHorizontal: 20,
        color: COLORS.GRAY1,
      }}>
      {item.description}
    </Text>
  </View>
);

const buttonLabel = content => (
  <View
    style={{
      padding: 15,
    }}>
    <Text
      style={{color: COLORS.PRIMARY, fontWeight: 'bold', fontSize: SIZES.h4}}>
      {content}
    </Text>
  </View>
);

export default function OnBoardingScreen() {
  const navigation = useNavigation();

  return (
    <AppIntroSlider
      data={slices}
      renderItem={renderItem}
      activeDotStyle={{backgroundColor: COLORS.PRIMARY, width: 30}}
      renderNextButton={() => buttonLabel('Tiếp Tục')}
      renderDoneButton={() => buttonLabel('Hoàn Thành')}
      onDone={async () => {
        try {
          await AsyncStorage.setItem('firstLaunch', 'true');
          navigation.replace('LoginScreen');
        } catch (error) {
          console.error('Error saving onboarding status:', error);
        }
      }}
    />
  );
}
