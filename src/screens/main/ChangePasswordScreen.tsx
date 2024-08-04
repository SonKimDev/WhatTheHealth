import {View, SafeAreaView, Platform, Alert, Text} from 'react-native';
import {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {Lock} from 'iconsax-react-native';
import {COLORS, SIZES} from '../../constans/themes';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {removeAuth} from '../../store/slices/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LoadingModal} from '../../modals';
import {Controller, useForm} from 'react-hook-form';
import {removeActivity} from '../../store/slices/activity';

export default function ChangePasswordScreen() {
  const [isShowLoading, setIsShowLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    control,
    formState: {errors},
    watch,
    handleSubmit,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsShowLoading(true);
    try {
      const userAuth = auth().currentUser;
      if (!userAuth) {
        Alert.alert('Thông báo', 'Bạn chưa đăng nhập.');
        return;
      }
      const credential = auth.EmailAuthProvider.credential(
        userAuth?.email,
        data.currentPassword,
      );
      await userAuth.reauthenticateWithCredential(credential);
      await userAuth.updatePassword(data.newPassword);
      Alert.alert('Thông báo', 'Mật khẩu của bạn đã được thay đổi thành công.');
      await AsyncStorage.removeItem('user');
      dispatch(removeAuth());
      dispatch(removeActivity());
      setIsShowLoading(false);
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Thông báo', 'Mật khẩu hiện tại không đúng.');
      } else {
        Alert.alert('Thông báo', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    }
    setIsShowLoading(false);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 20}}>
        <Controller
          control={control}
          name="currentPassword"
          rules={{
            required: {
              value: true,
              message: 'Nhập mật khẩu hiện tại không được để trống.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputComponent
                  affix={
                    <Lock size={SIZES.h3} color={COLORS.GRAY1} variant="Bold" />
                  }
                  placeHolder={'Mật khẩu hiện tại'}
                  onDeleteText={onChange}
                  value={value}
                  onChange={onChange}
                  isPassword={true}
                  onBlur={onBlur}
                />
                {errors.currentPassword && (
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
                    {errors.currentPassword.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: {
              value: true,
              message: 'Mật khẩu mới không được để trống.',
            },
            minLength: {
              value: 6,
              message: 'Mật khẩu mới phải có ít nhất 6 kí tự trở lên.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputComponent
                  affix={
                    <Lock size={SIZES.h3} color={COLORS.GRAY1} variant="Bold" />
                  }
                  placeHolder={'Mật khẩu mới'}
                  onDeleteText={onChange}
                  value={value}
                  onChange={onChange}
                  isPassword={true}
                  onBlur={onBlur}
                />
                {errors.newPassword && (
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
                    {errors.newPassword.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="reNewPassword"
          rules={{
            required: {
              value: true,
              message: 'Nhập lại mật khẩu mới không được để trống.',
            },
            validate: value =>
              value === watch('newPassword') || 'Nhập lại mật khẩu không khớp.',
            minLength: {
              value: 6,
              message: 'Nhập lại mật khẩu phải có ít nhất 6 kí tự trở lên.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputComponent
                  affix={
                    <Lock size={SIZES.h3} color={COLORS.GRAY1} variant="Bold" />
                  }
                  placeHolder={'Nhập lại mật khẩu mới'}
                  onDeleteText={onChange}
                  value={value}
                  onChange={onChange}
                  isPassword={true}
                  onBlur={onBlur}
                />
                {errors.reNewPassword && (
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
                    {errors.reNewPassword.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <View style={{flex: 1}} />
        <ButtonComponent
          title="Đổi Mật Khẩu"
          onPress={handleSubmit(onSubmit)}
        />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <LoadingModal visible={isShowLoading} />
    </SafeAreaView>
  );
}
