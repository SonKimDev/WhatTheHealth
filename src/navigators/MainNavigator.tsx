import {useLayoutEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import {
  AdminScreen,
  BMIFoodSuggestionsScreen,
  ChangeAvatarScreen,
  ChangePasswordScreen,
  ChangeUserInfoScreen,
  CompleteProfileScreen,
  GratitudeScreen,
  MeditationScreen,
  PrivacyPolicyScreen,
  SleepCareScreen,
  StartMediationScreen,
  SuccessInfoScreen,
  TrackingScreen,
  YogaScreen,
} from '../screens/main';
import {COLORS} from '../constans/themes';
import {useSelector} from 'react-redux';
import {selectUser} from '../store/slices/auth/selectors';

export default function MainNavigator() {
  const Stack = createNativeStackNavigator();
  const [completeInfo, setCompleteInfo] = useState(null);
  const user = useSelector(selectUser);
  console.log(user);

  useLayoutEffect(() => {
    const loadCompleteInfo = async () => {
      if (
        user?.weight === null ||
        user?.height === null ||
        user?.gender === null
      ) {
        setCompleteInfo(false);
      } else {
        setCompleteInfo(true);
      }
    };
    loadCompleteInfo();
  }, []);
  return (
    completeInfo != null && (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: COLORS.BLACK,
        }}>
        {!completeInfo && (
          <Stack.Screen
            name="CompleteProfileScreen"
            component={CompleteProfileScreen}
          />
        )}
        <Stack.Screen name="TabScreen" component={TabNavigator} />
        <Stack.Screen name="SuccessInfoScreen" component={SuccessInfoScreen} />
        <Stack.Screen
          name="GratitudeScreen"
          component={GratitudeScreen}
          options={{
            headerShown: true,
            title: 'Biết Ơn Mỗi Ngày',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="AdminScreen"
          component={AdminScreen}
          options={{
            headerShown: true,
            title: 'Quản lí',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ChangeAvatarScreen"
          component={ChangeAvatarScreen}
          options={{
            headerShown: true,
            title: 'Đổi Ảnh Đại Diện',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ChangeUserInfoScreen"
          component={ChangeUserInfoScreen}
          options={{
            headerShown: true,
            title: 'Chỉnh Sửa Thông Tin',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{
            headerShown: true,
            title: 'Đổi Mật Khẩu',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{
            headerShown: true,
            title: 'Chính Sách Bảo Mật',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="MeditationScreen"
          component={MeditationScreen}
          options={{
            headerShown: true,
            title: 'Chọn Thời Gian Thiền',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="StartMediationScreen"
          component={StartMediationScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="YogaScreen"
          component={YogaScreen}
          options={{
            headerShown: true,
            title: 'Yoga',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="TrackingScreen"
          component={TrackingScreen}
          options={{
            headerShown: true,
            title: 'Chạy Ngay Đi!',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="BMIFoodSuggestionsScreen"
          component={BMIFoodSuggestionsScreen}
          options={{
            headerShown: true,
            title: 'Gợi Ý Thức Ăn Theo BMI',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="SleepCareScreen"
          component={SleepCareScreen}
          options={{
            headerShown: true,
            title: 'Dữ Liệu Giấc Ngủ Gần Nhất',
            headerBackTitleVisible: false,
          }}
        />
      </Stack.Navigator>
    )
  );
}
