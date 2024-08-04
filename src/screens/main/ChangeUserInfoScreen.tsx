import {View, Text, SafeAreaView, Platform, Alert} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {ArrowSwapVertical, User, WeightMeter} from 'iconsax-react-native';
import {COLORS, SIZES} from '../../constans/themes';
import {LoadingModal} from '../../modals';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import {addAuth} from '../../store/slices/auth';
import {Controller, useForm} from 'react-hook-form';

export default function ChangeUserInfoScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(selectUser);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm();

  const onSubmit = (data: any) => {
    setIsLoading(true);
    try {
      firestore()
        .collection('users')
        .doc(user?.id)
        .update({
          firstName: data.firstName,
          lastName: data.lastName,
          height: parseInt(data.height),
          weight: parseInt(data.weight),
          bmi:
            parseInt(data.weight) /
            ((parseInt(data.height) * parseInt(data.height)) / 10000),
        })
        .then(async () => {
          dispatch(
            addAuth({
              firstName: data.firstName,
              lastName: data.lastName,
              height: parseInt(data.height),
              weight: parseInt(data.weight),
              bmi:
                parseInt(data.weight) /
                ((parseInt(data.height) * parseInt(data.height)) / 10000),
            }),
          );
          Alert.alert('Thay đổi thông tin thành công!');
          navigation.goBack();
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          console.log(error);
        });
    } catch (error) {
      Alert.alert('Thông báo', 'Đóng thư viện biểu thức');
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 16}}>
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
          name="weight"
          rules={{
            required: {
              value: true,
              message: 'Cân nặng không được để trống.',
            },
            min: {
              value: 1,
              message:
                'Ai cũng nặng hơn 0kg phải không? Và tôi biết bạn cũng vậy.',
            },
            max: {
              value: 635,
              message: 'Bạn lập kỉ lục người nặng cân nhất thế giới à?',
            },
            pattern: {
              value: /^(?:[1-9][0-9]*)$/,
              message: 'Cân nặng không hợp lệ',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View style={{width: '80%'}}>
                    <InputComponent
                      placeHolder="Cân nặng"
                      affix={
                        <WeightMeter
                          size={SIZES.h3}
                          color={COLORS.GRAY1}
                          variant="Outline"
                        />
                      }
                      value={value}
                      onChange={onChange}
                      onDeleteText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.PRIMARY,
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.WHITE,
                        fontSize: SIZES.h6,
                        fontWeight: 'bold',
                      }}>
                      KG
                    </Text>
                  </View>
                </View>
                {errors.weight && (
                  <Text style={{color: COLORS.DANGER, marginTop: 10}}>
                    {errors.weight.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <SpaceComponent height={10} />
        <Controller
          control={control}
          name="height"
          rules={{
            required: {
              value: true,
              message: 'Chiều cao không được để trống.',
            },
            min: {
              value: 1,
              message:
                'Ai cũng cao hơn 0cm phải không? Và tôi biết bạn cũng vậy.',
            },
            max: {
              value: 272,
              message: 'Bạn lập kỉ lục người cao nhất thế giới à?',
            },
            pattern: {
              value: /^(?:[1-9][0-9]*)$/,
              message: 'Chiều cao không hợp lệ',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => {
            return (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <View style={{width: '80%'}}>
                    <InputComponent
                      placeHolder="Chiều cao"
                      affix={
                        <ArrowSwapVertical
                          size={SIZES.h3}
                          color={COLORS.GRAY1}
                          variant="Outline"
                        />
                      }
                      value={value}
                      onChange={onChange}
                      onDeleteText={onChange}
                      onBlur={onBlur}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.PRIMARY,
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: COLORS.WHITE,
                        fontSize: SIZES.h6,
                        fontWeight: 'bold',
                      }}>
                      CM
                    </Text>
                  </View>
                </View>
                {errors.height && (
                  <Text style={{color: COLORS.DANGER, marginTop: 10}}>
                    {errors.height.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <View style={{flex: 1}} />
        <ButtonComponent
          title="Xác Nhận Thay Đổi"
          onPress={handleSubmit(onSubmit)}
        />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}
