import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  ButtonComponent,
  CardChildrenComponent,
  CardComponent,
  SpaceComponent,
} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {removeAuth} from '../../store/slices/auth';
import {globalStyles} from '../../styles/globalStyles';
import {
  ConfirmationModal,
  InfoModal,
  LoadingModal,
  SettingModal,
  ShowAvatarModal,
} from '../../modals';
import {COLORS, SIZES} from '../../constans/themes';
import {
  Activity,
  Chart1,
  Clock,
  Cup,
  LogoutCurve,
  Notification,
  Setting2,
  Shield,
  User,
  UserTick,
} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {selectUser} from '../../store/slices/auth/selectors';
import {removeActivity} from '../../store/slices/activity';
import messaging from '@react-native-firebase/messaging';

export default function UserScreen() {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowConfirm, setisShowConfirm] = useState(false);
  const [isShowSetting, setIsShowSetting] = useState(false);
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  const [isShowInfo, setIsShowInfo] = useState(false);
  const [isEnableNotification, setIsEnableNotification] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const handleLogOut = async () => {
    setIsShowLoading(true);
    await AsyncStorage.removeItem('user');
    dispatch(removeAuth());
    dispatch(removeActivity());
    setIsShowLoading(false);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View
        style={{
          flex: 1,
        }}>
        {Platform.OS === 'ios' && <SpaceComponent height={16} />}
        <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
          <TouchableOpacity
            onPress={() => setIsShowAvatar(true)}
            style={{
              width: 55,
              height: 55,
              borderRadius: 999,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                user?.avatar
                  ? {uri: `data:${'image/jpeg'};base64,${user?.avatar}`}
                  : require('../../assets/images/avatar.png')
              }
              style={{width: '100%', height: '100%', resizeMode: 'stretch'}}
            />
          </TouchableOpacity>
          <SpaceComponent width={15} />
          <View style={{flex: 1}}>
            <SpaceComponent height={5} />
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: 'bold',
                color: COLORS.BLACK,
              }}>
              {user?.firstName + ' ' + user?.lastName}
            </Text>
            <SpaceComponent height={5} />
            <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
              {user?.roles === 'member' ? 'Người Dùng' : 'Admin'}
            </Text>
          </View>
          <View style={{width: 83}}>
            <ButtonComponent
              title="Sửa"
              onPress={() => setIsShowSetting(true)}
            />
          </View>
        </View>
        <SpaceComponent height={15} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          <CardComponent
            style={{
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
              width: 100,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: '500',
                color: COLORS.PRIMARY,
              }}>
              {user?.height + 'cm'}
            </Text>
            <SpaceComponent height={4} />
            <Text
              style={{
                fontSize: SIZES.h6,
                color: COLORS.GRAY1,
              }}>
              Chiều cao
            </Text>
          </CardComponent>
          <CardComponent
            style={{
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
              width: 100,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: '500',
                color: COLORS.PRIMARY,
              }}>
              {user?.weight + 'kg'}
            </Text>
            <SpaceComponent height={4} />
            <Text
              style={{
                fontSize: SIZES.h6,
                color: COLORS.GRAY1,
              }}>
              Cân nặng
            </Text>
          </CardComponent>
          <CardComponent
            style={{
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 10,
              width: 100,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                fontWeight: '500',
                color: COLORS.PRIMARY,
              }}>
              {user?.bmi && user?.bmi.toFixed(1)}
            </Text>
            <SpaceComponent height={4} />
            <Text
              style={{
                fontSize: SIZES.h6,
                color: COLORS.GRAY1,
              }}>
              BMI
            </Text>
          </CardComponent>
        </View>
        <SpaceComponent height={15} />
        <ScrollView
          contentContainerStyle={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          <CardComponent
            style={{paddingHorizontal: 20, paddingVertical: 20, marginTop: 15}}>
            <Text style={[globalStyles.title]}>Tài Khoản</Text>
            <SpaceComponent height={15} />
            <CardChildrenComponent
              title="Thông Tin Cá Nhân"
              affix={
                <User
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => setIsShowInfo(true)}
            />
            <SpaceComponent height={10} />
            <CardChildrenComponent
              title="Thành Tựu"
              affix={
                <Cup size={SIZES.h2} color={COLORS.PRIMARY} variant="Outline" />
              }
              onPress={() => {}}
            />
            <SpaceComponent height={10} />
            <CardChildrenComponent
              title="Lịch Sử Hoạt Động"
              affix={
                <Activity
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => {}}
            />
            <SpaceComponent height={10} />
            <CardChildrenComponent
              title="Tiến Độ Luyện Tập"
              affix={
                <Chart1
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => {}}
            />
          </CardComponent>
          <SpaceComponent height={15} />
          <CardComponent style={{paddingHorizontal: 20, paddingVertical: 20}}>
            <Text style={[globalStyles.title]}>Thông Báo</Text>
            <SpaceComponent height={15} />
            <CardChildrenComponent
              title="Bật Thông Báo"
              affix={
                <Notification
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              isSwitch
              value={isEnableNotification}
              onChange={setIsEnableNotification}
            />
          </CardComponent>
          <SpaceComponent height={15} />
          <CardComponent
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              marginBottom: 16,
            }}>
            <Text style={[globalStyles.title]}>Khác</Text>
            <SpaceComponent height={15} />
            <CardChildrenComponent
              title="Liên Hệ Với Chúng Tôi"
              affix={
                <Clock
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => {}}
            />
            <SpaceComponent height={10} />
            <CardChildrenComponent
              title="Chính Sách Bảo Mật"
              affix={
                <Shield
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => navigation.navigate('PrivacyPolicyScreen')}
            />
            <SpaceComponent height={10} />
            <CardChildrenComponent
              title="Cài Đặt"
              affix={
                <Setting2
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => {}}
            />
            <SpaceComponent height={10} />
            {user?.roles === 'admin' && (
              <View>
                <CardChildrenComponent
                  title="Admin"
                  affix={
                    <UserTick
                      size={SIZES.h2}
                      color={COLORS.PRIMARY}
                      variant="Outline"
                    />
                  }
                  onPress={() => navigation.navigate('AdminScreen')}
                />
                <SpaceComponent height={10} />
              </View>
            )}
            <CardChildrenComponent
              title="Đăng Xuất"
              affix={
                <LogoutCurve
                  size={SIZES.h2}
                  color={COLORS.PRIMARY}
                  variant="Outline"
                />
              }
              onPress={() => setisShowConfirm(true)}
            />
          </CardComponent>
        </ScrollView>
        <LoadingModal visible={isShowLoading} />
        <ConfirmationModal
          visible={isShowConfirm}
          onCancel={() => setisShowConfirm(false)}
          onAccept={handleLogOut}
          title="Đăng Xuất"
        />
        <SettingModal
          visible={isShowSetting}
          onClose={() => setIsShowSetting(false)}
        />
        <InfoModal
          fullName={user?.firstName + ' ' + user?.lastName}
          email={user?.email}
          height={user?.height}
          weight={user?.weight}
          bmi={user?.bmi}
          visible={isShowInfo}
          onClose={() => setIsShowInfo(false)}
        />
        <ShowAvatarModal
          visible={isShowAvatar}
          avatar={user?.avatar}
          onClose={() => setIsShowAvatar(false)}
        />
      </View>
    </SafeAreaView>
  );
}
