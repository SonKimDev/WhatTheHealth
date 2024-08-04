import {View, Text, SafeAreaView, Image, Platform} from 'react-native';
import {useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {COLORS, SCREEN, SIZES} from '../../constans/themes';
import {
  ButtonComponent,
  InputComponent,
  PickerInputComponent,
  SpaceComponent,
} from '../../components';
import {
  ArrowRight2,
  ArrowSwapVertical,
  Profile2User,
  WeightMeter,
} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {LoadingModal, SelectGenderModal} from '../../modals';
import firestore from '@react-native-firebase/firestore';
import {Controller, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import {addAuth} from '../../store/slices/auth';

export default function CompleteProfileScreen() {
  const [gender, setGender] = useState('');
  const [errorGender, setErrorGender] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [isShowSelectGenderModal, setIsShowSelectGenderModal] = useState(false);
  const dispatch = useDispatch();
  const {
    control,
    formState: {errors},
    handleSubmit,
  } = useForm();
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const onSubmit = async (data: any) => {
    if (gender === '') {
      setErrorGender(true);
      return;
    } else {
      setErrorGender(false);
    }
    setIsShowLoading(true);
    await firestore()
      .collection('users')
      .doc(user?.id)
      .update({
        height: parseInt(data.height),
        weight: parseInt(data.weight),
        gender: gender,
        bmi:
          parseInt(data.weight) /
          ((parseInt(data.height) * parseInt(data.height)) / 10000),
      })
      .then(() => {
        dispatch(
          addAuth({
            height: parseInt(data.height),
            weight: parseInt(data.weight),
            gender: gender,
            bmi:
              parseInt(data.weight) /
              ((parseInt(data.height) * parseInt(data.height)) / 10000),
          }),
        );
      });
    setIsShowLoading(false);
    navigation.replace('SuccessInfoScreen');
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <Image
        source={require('../../assets/images/complete-info.png')}
        style={{
          width: SCREEN.WIDTH,
          height: SCREEN.HEIGHT * 0.4,
          resizeMode: 'contain',
        }}
      />
      <View style={{flex: 1, paddingHorizontal: 30}}>
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          Hoàn thiện thông tin
        </Text>
        <SpaceComponent height={5} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          Chúng giúp chúng tôi hiểu hơn về bạn!
        </Text>
        <SpaceComponent height={30} />
        <PickerInputComponent
          affix={
            <Profile2User
              size={SIZES.h3}
              color={COLORS.GRAY1}
              variant="Outline"
            />
          }
          value={gender}
          onPress={() => setIsShowSelectGenderModal(true)}
          placeHolder="Giới tính"
        />
        {errorGender && (
          <>
            <Text
              style={{
                color: COLORS.DANGER,
                marginTop: 10,
              }}>
              Vui lòng chọn giới tính của bạn
            </Text>
          </>
        )}
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
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
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
                  <Text
                    style={{
                      color: COLORS.DANGER,
                      marginTop: 10,
                    }}>
                    {errors.height.message}
                  </Text>
                )}
              </>
            );
          }}
        />
        <View style={{flex: 1}} />
        <ButtonComponent
          title="Tiếp Tục"
          suffix={
            <ArrowRight2
              size={SIZES.h2}
              color={COLORS.WHITE}
              variant="Outline"
            />
          }
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      {Platform.OS === 'android' && <SpaceComponent height={16} />}
      <SelectGenderModal
        visible={isShowSelectGenderModal}
        onClose={() => setIsShowSelectGenderModal(false)}
        onSelected={setGender}
      />
      <LoadingModal visible={isShowLoading} />
    </SafeAreaView>
  );
}
