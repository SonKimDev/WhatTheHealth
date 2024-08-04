import {View, Text, FlatList, SafeAreaView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectGratitude, selectUser} from '../../store/slices/auth/selectors';
import {addGratitudes, loadGratitudes} from '../../store/slices/auth';
import firestore from '@react-native-firebase/firestore';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  CardComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {COLORS, SIZES} from '../../constans/themes';
import {Heart} from 'iconsax-react-native';
import {useForm, Controller} from 'react-hook-form';

export default function GratitudeScreen() {
  const dispatch = useDispatch();
  const gratitudes = useSelector(selectGratitude);
  const user = useSelector(selectUser);
  const today = new Date().toISOString().split('T')[0];
  const [isGratitudeToday, setIsGratitudeToday] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      gratitude: '',
    },
  });

  const fetchGratitudes = async () => {
    const snapshot = await firestore()
      .collection('gratitudes')
      .where('userId', '==', user?.id)
      .get();

    const fetchedGratitudes = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));

    dispatch(loadGratitudes(fetchedGratitudes));
  };

  const handleSendGratitude = async data => {
    const {gratitude} = data;

    if (gratitude.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập điều biết ơn của bạn!');
      return;
    }

    await firestore().collection('gratitudes').add({
      userId: user?.id,
      gratitude: gratitude,
      date: today,
    });

    await dispatch(
      addGratitudes({userId: user?.id, date: today, content: gratitude}),
    );

    fetchGratitudes();
    reset(); // Reset form input
    setIsGratitudeToday(true);
    Alert.alert('Thông báo', 'Gửi điều biết ơn thành công!');
  };

  useEffect(() => {
    const checkGratitudes = () => {
      firestore()
        .collection('gratitudes')
        .where('userId', '==', user?.id)
        .where('date', '==', today)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            setIsGratitudeToday(true);
          } else {
            setIsGratitudeToday(false);
          }
        });
    };
    checkGratitudes();
    fetchGratitudes();
  }, []);

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 10, paddingVertical: 16}}>
        {isGratitudeToday ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomWidth: 1,
              paddingBottom: 10,
              borderColor: COLORS.GRAY3,
            }}>
            <Text style={{textAlign: 'center'}}>
              Bạn đã gửi lời biết ơn hôm nay, hãy quay trở lại vào ngày mai nhé.
            </Text>
          </View>
        ) : (
          <>
            <Controller
              control={control}
              name="gratitude"
              rules={{
                required: {
                  value: true,
                  message: 'Điều biết ơn không được để trống.',
                },
                minLength: {
                  value: 5,
                  message: 'Điều biết ơn phải có ít nhất 5 kí tự.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <InputComponent
                  placeHolder={'Hôm nay bạn biết ơn điều gì?'}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  onDeleteText={() => onChange('')}
                  affix={
                    <Heart size={20} color={COLORS.PRIMARY} variant="Bold" />
                  }
                />
              )}
            />
            {errors.gratitude && (
              <Text style={{color: 'red', marginVertical: 10}}>
                {errors.gratitude.message}
              </Text>
            )}
            <SpaceComponent height={10} />
            <ButtonComponent
              title="Gửi"
              onPress={handleSubmit(handleSendGratitude)}
            />
          </>
        )}
        <SpaceComponent height={10} />
        <FlatList
          data={gratitudes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <CardComponent
              style={{
                paddingHorizontal: 20,
                marginHorizontal: 10,
                marginVertical: 5,
                paddingVertical: 10,
                height: 200,
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: SIZES.h1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: COLORS.BLACK,
                  }}>
                  {item?.gratitude}
                </Text>
              </View>
              <Text style={{alignSelf: 'flex-end'}}>{item?.date}</Text>
            </CardComponent>
          )}
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 150,
              }}>
              <Text>Bạn chưa gửi điều biết ơn nào cả.</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
