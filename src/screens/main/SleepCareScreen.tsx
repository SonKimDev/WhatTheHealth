import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, Image} from 'react-native';
import AppleHealthKit from 'react-native-health';
import {globalStyles} from '../../styles/globalStyles';
import {CardComponent, SpaceComponent} from '../../components';
import {COLORS, SIZES} from '../../constans/themes';

const HealthKitSleepData = () => {
  const [sleepData, setSleepData] = useState([]);
  const [sleepAdvice, setSleepAdvice] = useState('');
  const [sleepHour, setSleepHour] = useState(0);
  const [sleepMinute, setSleepMinute] = useState(0);
  const [startSleep, setStartSleep] = useState('');

  useEffect(() => {
    const permissions = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.SleepAnalysis],
      },
    };

    AppleHealthKit.initHealthKit(permissions, error => {
      if (error) {
        console.log('Error initializing HealthKit: ', error);
        return;
      }

      fetchSleepData();
    });
  }, []);

  const fetchSleepData = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const options = {
      startDate: yesterday.toISOString(),
      endDate: new Date().toISOString(),
    };

    AppleHealthKit.getSleepSamples(options, (err, results) => {
      if (err) {
        console.log('Error fetching sleep data: ', err);
        return;
      }
      setSleepData(results);

      if (results.length > 0) {
        const totalSleepMinutes = results.reduce((total, sample) => {
          const startDate = new Date(sample.startDate);
          const endDate = new Date(sample.endDate);
          const duration = (endDate - startDate) / (1000 * 60); // convert milliseconds to minutes
          const startHour = startDate.getHours();
          let formattedStartHour = startHour % 12 || 12;
          const period = startHour >= 12 ? 'tối' : 'sáng';

          setStartSleep(`${formattedStartHour} giờ ${period}`);

          return total + duration;
        }, 0);

        const totalSleepHours = Math.floor(totalSleepMinutes / 60);
        const totalSleepRemainingMinutes = totalSleepMinutes % 60;
        setSleepHour(totalSleepHours);
        setSleepMinute(totalSleepRemainingMinutes);
        if (totalSleepHours < 7) {
          setSleepAdvice(
            `Bạn đã ngủ ${totalSleepHours} giờ ${totalSleepRemainingMinutes} phút. Hãy cố gắng ngủ nhiều hơn để duy trì sức khỏe tốt.`,
          );
        } else if (totalSleepHours > 9) {
          setSleepAdvice(
            `Bạn đã ngủ ${totalSleepHours} giờ. Hãy duy trì giấc ngủ đều đặn để có sức khỏe tốt.`,
          );
        } else {
          setSleepAdvice(
            `Bạn đã ngủ ${totalSleepHours} giờ. Hãy tiếp tục duy trì giấc ngủ đủ và tốt.`,
          );
        }
      }
    });
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 10}}>
        <View>
          <Image
            source={require('../../assets/images/sleep-well.png')}
            style={{width: '100%', height: 200, resizeMode: 'contain'}}
          />
          <Text
            style={{
              position: 'absolute',
              left: 20,
              top: 40,
              fontSize: SIZES.h3,
            }}>
            Giờ lý tưởng để ngủ
          </Text>
          <Text
            style={{
              position: 'absolute',
              left: 20,
              top: 70,
              fontSize: SIZES.h1,
              color: COLORS.BLUE,
              fontWeight: 'bold',
            }}>
            8 giờ 0 phút
          </Text>
        </View>
        <SpaceComponent height={20} />
        <CardComponent
          style={{
            padding: 20,
            height: 93,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/Icon-Bed.png')}
            style={{width: 30, height: 30, resizeMode: 'contain'}}
          />
          <SpaceComponent width={15} />
          <View>
            <Text
              style={{
                fontSize: SIZES.h6,
                color: COLORS.BLACK,
              }}>
              <Text style={{fontWeight: 'bold', fontSize: SIZES.h5}}>
                Đi ngủ{', '}
              </Text>
              {startSleep}
            </Text>
            <Text style={{fontSize: SIZES.h5, color: COLORS.GRAY1}}>
              {sleepHour} tiếng {sleepMinute} phút
            </Text>
          </View>
        </CardComponent>
        <SpaceComponent height={20} />
        <CardComponent
          style={{
            backgroundColor: '#F5E9FB',
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: SIZES.h3,
              color: COLORS.BLACK,
            }}>
            {sleepAdvice}
          </Text>
        </CardComponent>
      </View>
    </SafeAreaView>
  );
};

export default HealthKitSleepData;
