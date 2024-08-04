import React, {useState} from 'react';
import {
  ButtonComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {COLORS, SIZES} from '../../constans/themes';
import {Calendar2, Lock, LoginCurve} from 'iconsax-react-native';
import {Alert, Platform, SafeAreaView, Text, View} from 'react-native';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import {LoadingModal} from '../../modals';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useDispatch} from 'react-redux';
import {addAuth} from '../../store/slices/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Controller, useForm} from 'react-hook-form';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const onSubmit = (data: any) => {
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then(userCredential => {
        var user = userCredential.user;
        firestore()
          .collection('users')
          .doc(user.uid)
          .get()
          .then(async doc => {
            if (doc.exists) {
              var userInfo = doc.data();
              if (userInfo) {
                await AsyncStorage.setItem('user', JSON.stringify(userInfo)),
                  dispatch(addAuth(userInfo));
              }
            } else {
              console.log('Không tìm thấy thông tin user');
            }
          })
          .catch(error => {
            console.log('Lỗi lấy dữ liệu user', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch(error => {
        if (error.code === 'auth/invalid-credential') {
          Alert.alert('Thông báo', 'Tài khoản hoặc mật khẩu không chính xác.');
        } else {
          Alert.alert('Thông báo', 'Có lỗi xảy ra, vui lòng thử lại sau.');
        }
        setIsLoading(false);
      });
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
          Chào Mừng Trở Lại,
        </Text>
        <SpaceComponent height={5} />
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          Đăng Nhập
        </Text>
        <SpaceComponent height={30} />
        <Controller
          control={control}
          name="email"
          rules={{
            required: {
              value: true,
              message: 'Email không được để trống.',
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Email không hợp lệ.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
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
            );
          }}
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
              message: 'Mật khẩu phải có ít nhất 6 kí tự.',
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
        <Text
          onPress={() => navigation.navigate('ForgotPasswordScreen')}
          style={[
            globalStyles.text,
            {
              textAlign: 'center',
              textDecorationLine: 'underline',
              color: COLORS.GRAY2,
            },
          ]}>
          Quên mật khẩu
        </Text>
        <View style={{flex: 1}} />
        <ButtonComponent
          title={'Đăng Nhập'}
          affix={
            <LoginCurve size={SIZES.h2} color={COLORS.WHITE} variant="Bold" />
          }
          onPress={handleSubmit(onSubmit)}
        />
        <SpaceComponent height={20} />
        <Text
          style={[
            globalStyles.text,
            {textAlign: 'center', color: COLORS.BLACK},
          ]}>
          Bạn chưa có tài khoản?{' '}
          <Text
            onPress={() => navigation.navigate('RegisterScreen')}
            style={{color: COLORS.PRIMARY, fontWeight: 'bold'}}>
            Đăng Ký
          </Text>
        </Text>
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}
