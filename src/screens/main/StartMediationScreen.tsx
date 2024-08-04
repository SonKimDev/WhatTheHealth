import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ButtonComponent, SpaceComponent} from '../../components';
import {COLORS, SIZES} from '../../constans/themes';
import {LoadingModal} from '../../modals';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import Sound from 'react-native-sound';
import {addActivity} from '../../store/slices/activity';

// Khởi tạo biến toàn cục cho âm thanh
let sound;

export default function StartMediationScreen() {
  const route = useRoute();
  const {duration} = route.params;
  const user = useSelector(selectUser);
  const today = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(false);

  useEffect(() => {
    sound = new Sound(
      'meditation-sound.mp3', // Tên file âm thanh
      Sound.MAIN_BUNDLE, // Đặt tùy chọn này cho iOS
      error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        console.log('Sound loaded successfully');
        sound.setNumberOfLoops(-1); // Lặp vô hạn
      },
    );

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (duration) {
      setMinute(duration);
    }
    setIsLoading(false);
  }, [duration]);

  const updatedData = async () => {
    const data = {
      date: today,
      time: duration,
    };
    const meditationRef = firestore()
      .collection('activities')
      .doc(user?.id)
      .collection('meditation')
      .doc(today);
    try {
      const meditationDoc = await meditationRef.get();
      if (meditationDoc.exists) {
        const existingData = meditationDoc.data();
        firestore()
          .collection('activities')
          .doc(user?.id)
          .collection('meditation')
          .doc(today)
          .update({
            time: existingData?.time + duration,
          })
          .then(() => {
            setIsLoading(false);
            navigation.goBack();
            // dispatch(addActivity({meditation: }));
            firestore()
              .collection('activities')
              .doc(user?.id)
              .collection('meditation')
              .doc(today)
              .get()
              .then(doc => {
                if (doc.exists) {
                  const data = doc.data();
                  dispatch(addActivity({meditation: data?.time}));
                }
              });
            Alert.alert(
              'Thông báo',
              'Chúc mừng bạn đã hoàn thành bài tập thiền ' +
                duration +
                ' phút.',
            );
          });
      } else {
        meditationRef.set(data);
        dispatch(addActivity({meditation: data?.time}));
        setIsLoading(false);
        navigation.goBack();
        Alert.alert(
          'Thông báo',
          'Chúc mừng bạn đã hoàn thành bài tập thiền ' + duration + ' phút.',
        );
      }
    } catch (error) {
      console.log('Error updating data:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (start) {
      if (sound) {
        sound.play(success => {
          if (success) {
            console.log('Sound is playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
        });
      }

      timer = setInterval(() => {
        setSecond(prevSecond => {
          if (prevSecond === 0) {
            if (minute === 0) {
              clearInterval(timer);
              setIsLoading(true);
              updatedData();
              if (sound) {
                sound.stop(() => console.log('Sound stopped'));
              }
              return 0;
            }
            setMinute(prevMinute => prevMinute - 1);
            return 59;
          }
          return prevSecond - 1;
        });
      }, 1000);
    } else if (!start && second !== 0) {
      if (sound) {
        sound.pause(() => console.log('Sound paused'));
      }
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [start, minute]);

  return (
    <ImageBackground
      blurRadius={2}
      source={
        duration === 10
          ? require('../../assets/images/morning.png')
          : require('../../assets/images/night.png')
      }
      style={{flex: 1}}>
      <SafeAreaView
        style={[globalStyles.container, {backgroundColor: 'transparent'}]}>
        <View style={{flex: 1, paddingHorizontal: 20}}>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: 20,
              borderRadius: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: SIZES.h2,
                fontWeight: 'bold',
                color: COLORS.BLACK,
              }}>
              Hướng Dẫn Ngắn Gọn
            </Text>
            <SpaceComponent height={15} />
            <Text style={[globalStyles.text, {color: COLORS.BLACK}]}>
              1. Tìm một không gian yên tĩnh và ngồi thoải mái.{'\n'}
              2. Nhắm mắt và hít thở sâu.{'\n'}
              3. Tập trung vào hơi thở và cảm nhận sự tĩnh lặng.{'\n'}
              4. Khi suy nghĩ xuất hiện, nhẹ nhàng đưa tâm trí trở lại hơi thở.
            </Text>
          </View>
          <SpaceComponent height={20} />
          <Image
            source={require('../../assets/images/meditation.png')}
            style={{
              width: '100%',
              height: 300,
              resizeMode: 'contain',
            }}
          />
          <SpaceComponent height={25} />
          <Text
            style={[
              globalStyles.title,
              {textAlign: 'center', fontSize: 38, color: COLORS.WHITE},
            ]}>
            {minute >= 10 ? minute : '0' + minute}:
            {second >= 10 ? second : '0' + second}
          </Text>
          <View style={{flex: 1}} />
          <ButtonComponent
            title={start ? 'Dừng Lại' : 'Bắt Đầu'}
            onPress={() => setStart(!start)}
          />
          <SpaceComponent height={10} />
        </View>
      </SafeAreaView>
      <LoadingModal visible={isLoading} />
    </ImageBackground>
  );
}
