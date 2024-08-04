import {View, Text, SafeAreaView, Platform, Alert} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {COLORS, SIZES} from '../../constans/themes';
import {Calendar2, Lock, User} from 'iconsax-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {LoadingModal} from '../../modals';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';

export default function RegisterScreen() {
  const [isShowLoading, setIsShowLoading] = useState(false);

  const {
    control,
    formState: {errors},
    watch,
    handleSubmit,
  } = useForm();
  const navigation = useNavigation();

  const onSubmit = async (data: any) => {
    setIsShowLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        data.email,
        data.password,
      );
      const user = userCredential.user;

      await firestore().collection('users').doc(user.uid).set({
        id: user.uid,
        avatar: null,
        email: user.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: null,
        height: null,
        weight: null,
        bmi: null,
        friends: [],
        roles: 'member',
      });
      Alert.alert('Thông báo', 'Đăng ký thành công');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Thông báo', 'Có lỗi xảy ra, vui lòng thử lại sau.');
    }
    setIsShowLoading(false);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 30}}>
        <SpaceComponent height={40} />
        <Text
          style={[
            globalStyles.text,
            {color: COLORS.BLACK, textAlign: 'center'},
          ]}>
          Chào mừng trở lại,
        </Text>
        <SpaceComponent height={5} />
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>Đăng Ký</Text>
        <SpaceComponent height={30} />
        <Controller
          control={control}
          name="firstName"
          rules={{
            required: {
              value: true,
              message: 'Họ không được để trống.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <InputComponent
                affix={
                  <User size={SIZES.h3} color={COLORS.GRAY1} variant="Bold" />
                }
                placeHolder={'Họ'}
                onDeleteText={onChange}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
              />
              {errors.firstName && (
                <Text style={{color: COLORS.DANGER, marginTop: 10}}>
                  {errors.firstName.message}
                </Text>
              )}
            </>
          )}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="lastName"
          rules={{
            required: {
              value: true,
              message: 'Tên không được để trống.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputComponent
                  affix={
                    <User size={SIZES.h3} color={COLORS.GRAY1} variant="Bold" />
                  }
                  placeHolder={'Tên'}
                  onDeleteText={onChange}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
                {errors.lastName && (
                  <Text style={{color: COLORS.DANGER, marginTop: 10}}>
                    {errors.lastName.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: 'Email không được bỏ trống',
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Email không hợp lệ.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <>
              <InputComponent
                affix={
                  <Calendar2
                    size={SIZES.h3}
                    color={COLORS.GRAY1}
                    variant="Bold"
                  />
                }
                placeHolder={'Email'}
                onDeleteText={onChange}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
              />
              {errors.email && (
                <Text
                  style={{
                    color: COLORS.DANGER,
                    marginTop: 10,
                  }}>
                  {errors.email.message}
                </Text>
              )}
            </>
          )}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="password"
          rules={{
            required: {
              value: true,
              message: 'Mật khẩu không được để trống.',
            },
            minLength: {
              value: 6,
              message: 'Mật khẩu phải có ít nhất 6 kí tự trở lên.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <InputComponent
                  affix={
                    <Lock size={SIZES.h3} color={COLORS.GRAY1} variant="Bold" />
                  }
                  placeHolder={'Mật khẩu'}
                  onDeleteText={onChange}
                  value={value}
                  onChange={onChange}
                  isPassword={true}
                  onBlur={onBlur}
                />
                {errors.password && (
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
                    {errors.password.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="rePassword"
          rules={{
            required: {
              value: true,
              message: 'Nhập lại mật khẩu mới không được để trống.',
            },
            validate: value =>
              value === watch('password') || 'Nhập lại mật khẩu không khớp.',
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
                  placeHolder={'Nhập lại mật khẩu'}
                  onDeleteText={onChange}
                  value={value}
                  onChange={onChange}
                  isPassword={true}
                  onBlur={onBlur}
                />
                {errors.rePassword && (
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
                    {errors.rePassword.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <View style={{flex: 1}} />
        <ButtonComponent title={'Đăng Ký'} onPress={handleSubmit(onSubmit)} />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <LoadingModal visible={isShowLoading} />
    </SafeAreaView>
  );
}
