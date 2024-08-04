import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS, SIZES} from '../../constans/themes';
import {ButtonComponent, SpaceComponent} from '../../components';
import {globalStyles} from '../../styles/globalStyles';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import firestore from '@react-native-firebase/firestore';
import {LoadingModal} from '../../modals';
import {addActivity} from '../../store/slices/activity';

export default function YogaScreen() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const today = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(5);
  const [isStart, setIsStart] = useState(false);
  const [video, setVideo] = useState('I7eoLFbSH6U');
  const handleStartYogaWorkout = async () => {
    if (!isStart) {
      if (duration == 5) {
        await setVideo('jeDcF1lhyVM');
        setDuration(5);
        setIsStart(true);
      } else if (duration == 10) {
        await setVideo('P3b826Zr9CM');
        setDuration(10);
        setIsStart(true);
      } else if (duration == 15) {
        await setVideo('OiwOmuqwr5k');
        setDuration(15);
        setIsStart(true);
      }
    } else {
      navigation.goBack();
    }
  };

  const onStateChange = useCallback(
    async state => {
      if (state === 'ended') {
        setIsLoading(true);
        const data = {
          date: today,
          time: duration,
        };
        const yogaRef = firestore()
          .collection('activities')
          .doc(user?.id)
          .collection('yoga')
          .doc(today);
        try {
          const yogaData = await yogaRef.get();
          if (yogaData.exists) {
            const existingData = yogaData.data();
            firestore()
              .collection('activities')
              .doc(user?.id)
              .collection('yoga')
              .doc(today)
              .update({
                time: existingData?.time + duration,
              })
              .then(() => {
                firestore()
                  .collection('activities')
                  .doc(user?.id)
                  .collection('yoga')
                  .doc(today)
                  .get()
                  .then(doc => {
                    if (doc.exists) {
                      const data = doc.data();
                      dispatch(addActivity({yoga: data?.time}));
                    }
                  });
              });
          } else {
            yogaRef.set(data);
            dispatch(addActivity({yoga: data?.time}));
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
        setIsLoading(false);
        Alert.alert(
          'Thông báo',
          'Chúc mừng bạn đã hoàn thành bài tập Yoga ' + duration + ' phút',
          [{text: 'OK', onPress: () => navigation.goBack()}],
        );
      }
    },
    [navigation, duration],
  );

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <SpaceComponent height={20} />
        {isStart ? (
          <YoutubePlayer
            height={300}
            play={isStart}
            videoId={video}
            onChangeState={onStateChange}
          />
        ) : (
          <>
            <Text style={[globalStyles.title, {textAlign: 'center'}]}>
              Chọn Thời Gian Tập Yoga
            </Text>
            <SpaceComponent height={10} />
            <FlatList
              data={[
                {id: 1, duration: 5},
                {id: 2, duration: 10},
                {id: 3, duration: 15},
              ]}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      duration === item.duration ? COLORS.BLUE : COLORS.WHITE,
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderWidth: duration === item.duration ? 0 : 1,
                    borderColor:
                      duration === item.duration ? null : COLORS.BLUE,
                    height: 50,
                  }}
                  onPress={async () => {
                    await setDuration(item.duration);
                    console.log(duration);
                  }}>
                  <Text
                    style={{
                      color:
                        duration === item.duration ? COLORS.WHITE : COLORS.BLUE,
                    }}>
                    {item.duration} Phút
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id.toString()}
              horizontal
              style={{marginHorizontal: 10}}
              ItemSeparatorComponent={() => <SpaceComponent width={10} />}
            />
          </>
        )}

        <View style={{flex: 1}} />

        <SpaceComponent height={20} />

        <ButtonComponent
          title="Bắt Đầu Tập Yoga"
          onPress={() => handleStartYogaWorkout()}
        />
      </View>
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}
