import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import AppleHealthKit from 'react-native-health';
import {globalStyles} from '../../styles/globalStyles';
import {SpaceComponent} from '../../components';
import {COLORS, SIZES} from '../../constans/themes';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import {addActivity} from '../../store/slices/activity';

export default function TrackingScreen() {
  const [stepCount, setStepCount] = useState(0);
  const [distance, setDistance] = useState(0);
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [initialStepCount, setInitialStepCount] = useState(0);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const options = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.StepCount],
        write: [AppleHealthKit.Constants.Permissions.StepCount],
      },
    };

    AppleHealthKit.initHealthKit(options, err => {
      if (err) {
        console.log('Error initializing HealthKit:', err);
        return;
      }
      console.log('HealthKit initialized');
    });

    return () => {};
  }, []);

  useEffect(() => {
    let timer = null;
    let stepInterval = null;

    if (isStarted && !isPaused) {
      timer = setInterval(() => {
        setSecond(prevSecond => {
          if (prevSecond === 59) {
            setMinute(prevMinute => prevMinute + 1);
            return 0;
          }
          return prevSecond + 1;
        });
      }, 1000);

      stepInterval = setInterval(() => {
        if (startTime) {
          const endDate = new Date().toISOString();
          AppleHealthKit.getStepCount(
            {
              startDate: startTime,
              endDate,
            },
            (err, result) => {
              if (err) {
                console.log('Error fetching step count:', err);
                return;
              }
              const totalSteps = result.value || 0;
              setStepCount(totalSteps - initialStepCount);
              setDistance(((totalSteps - initialStepCount) * 0.8) / 1000);
            },
          );
        }
      }, 1000);
    } else {
      clearInterval(timer);
      clearInterval(stepInterval);
    }

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, [isStarted, isPaused, startTime, initialStepCount]);

  const startTracking = () => {
    setIsStarted(true);
    setIsPaused(false);
    const now = new Date().toISOString();
    setStartTime(now);
    AppleHealthKit.getStepCount(
      {
        startDate: now,
        endDate: now,
      },
      (err, result) => {
        if (err) {
          console.log('Error fetching initial step count:', err);
          return;
        }
        setInitialStepCount(result.value || 0);
      },
    );
  };

  const pauseTracking = () => {
    setIsPaused(true);
  };

  const resumeTracking = () => {
    setIsPaused(false);
  };

  const endTracking = async () => {
    setIsStarted(false);
    setIsPaused(false);
    setSecond(0);
    setMinute(0);
    setStepCount(0);
    setDistance(0);
    await saveDataToFirebase();
  };

  const saveDataToFirebase = async () => {
    const today = new Date().toISOString().split('T')[0];
    const data = {
      steps: stepCount,
      distance: distance,
      date: today,
      time: `${minute}:${second < 10 ? `0${second}` : second}`,
    };

    const userId = user?.id;

    if (!userId) {
      console.log('User ID is not available');
      return;
    }

    const userRef = firestore().collection('activities').doc(userId);
    const trackingRef = userRef.collection('trackings').doc(today);

    try {
      const trackingDoc = await trackingRef.get();

      if (trackingDoc.exists) {
        const existingData = trackingDoc.data();
        await trackingRef
          .update({
            steps: existingData?.steps + stepCount,
            distance: existingData?.distance + distance,
            time: `${minute}:${second < 10 ? `0${second}` : second}`,
          })
          .then(() => {
            firestore()
              .collection('activities')
              .doc(userId)
              .collection('trackings')
              .doc(today)
              .get()
              .then(doc => {
                if (doc.exists) {
                  const data = doc.data();
                  dispatch(
                    addActivity({steps: data?.steps, distance: data?.distance}),
                  );
                }
              });
          });
      } else {
        await trackingRef.set(data);
        dispatch(addActivity({steps: data?.steps, distance: data?.distance}));
      }

      console.log('Data saved successfully');
    } catch (error) {
      console.log('Error saving data to Firestore:', error);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        <SpaceComponent height={20} />
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          Thời Gian
        </Text>
        <Text style={[globalStyles.title, {textAlign: 'center', fontSize: 70}]}>
          {minute < 10 ? `0${minute}` : minute}:
          {second < 10 ? `0${second}` : second}
        </Text>
        <View style={{borderBottomWidth: 1, borderColor: COLORS.GRAY3}} />
        <SpaceComponent height={10} />
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <View>
            <Text style={{fontWeight: '500', fontSize: SIZES.h5}}>Số bước</Text>
            <Text style={{fontWeight: '700', fontSize: 30}}>{stepCount}</Text>
          </View>
          <View>
            <Text style={{fontWeight: '500', fontSize: SIZES.h5}}>Số km</Text>
            <Text style={{fontWeight: '700', fontSize: 30}}>
              {distance.toFixed(2)}
            </Text>
          </View>
        </View>
        <SpaceComponent height={10} />
        <View style={{borderBottomWidth: 1, borderColor: COLORS.GRAY3}} />
        <View style={{flex: 1}} />
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={endTracking}
            style={{
              width: 70,
              height: 70,
              borderRadius: 999,
              backgroundColor: isStarted ? COLORS.DANGER : COLORS.GRAY1,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isStarted ? 1 : 0.5,
            }}
            disabled={!isStarted}>
            <Text
              style={{
                color: isStarted ? COLORS.WHITE : COLORS.GRAY2,
                fontSize: SIZES.h6,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Kết thúc
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isStarted) {
                isPaused ? resumeTracking() : pauseTracking();
              } else {
                startTracking();
              }
            }}
            style={{
              width: 70,
              height: 70,
              borderRadius: 999,
              backgroundColor: isStarted ? COLORS.WARNING : COLORS.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontSize: SIZES.h6,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {isStarted ? (isPaused ? 'Tiếp tục' : 'Tạm dừng') : 'Bắt đầu'}
            </Text>
          </TouchableOpacity>
        </View>
        <SpaceComponent height={10} />
      </View>
    </SafeAreaView>
  );
}
