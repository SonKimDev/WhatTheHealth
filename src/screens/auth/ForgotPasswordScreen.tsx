import {View, Text, SafeAreaView, Platform, Alert} from 'react-native';
import React, {useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {Calendar2} from 'iconsax-react-native';
import {COLORS, SIZES} from '../../constans/themes';
import auth from '@react-native-firebase/auth';
import {LoadingModal} from '../../modals';
import {useNavigation} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';

export default function ForgotPasswordScreen() {
  const [isShowLoading, setIsShowLoading] = useState(false);

  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm();
  const navigation = useNavigation();

  const onSubmit = (data: any) => {
    setIsShowLoading(true);
    auth()
      .sendPasswordResetEmail(data.email)
      .then(() => {
        Alert.alert(
          'Thông báo',
          'Gửi thành công!\nVui lòng kiểm tra email của bạn.',
        );
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('Lỗi', error.message);
      });
    setIsShowLoading(false);
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 30}}>
        <SpaceComponent height={40} />
        <Text style={[globalStyles.title]}>Quên mật khẩu</Text>
        <Text style={[globalStyles.text]}>
          Nhập email của bạn và chúng tôi sẽ tự động gửi một mail tới email của
          bạn.
        </Text>
        <SpaceComponent height={16} />
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

        <View style={{flex: 1}} />
        <ButtonComponent
          title={'Gửi Yêu Cầu'}
          onPress={handleSubmit(onSubmit)}
        />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <LoadingModal visible={isShowLoading} />
    </SafeAreaView>
  );
}
