import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {globalStyles} from '../../styles/globalStyles';
import {ButtonComponent, CardComponent, SpaceComponent} from '../../components';
import {COLORS, SCREEN, SIZES} from '../../constans/themes';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import {selectActivity} from '../../store/slices/activity/selectors';
import firestore from '@react-native-firebase/firestore';
import {addActivity} from '../../store/slices/activity';
export default function HomeScreen() {
  const user = useSelector(selectUser);
  const today = new Date().toISOString().split('T')[0];
  const activity = useSelector(selectActivity);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [target, setTarget] = useState({
    steps: 100,
    distance: 100,
    meditation: 100,
    yoga: 100,
  });

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const tracking = await firestore()
          .collection('activities')
          .doc(user?.id)
          .collection('trackings')
          .doc(today)
          .get();

        const meditation = await firestore()
          .collection('activities')
          .doc(user?.id)
          .collection('meditation')
          .doc(today)
          .get();

        const yoga = await firestore()
          .collection('activities')
          .doc(user?.id)
          .collection('yoga')
          .doc(today)
          .get();

        if (tracking.exists) {
          const activity = tracking.data();

          dispatch(
            addActivity({
              steps: activity?.steps || 0,
              distance: activity?.distance || 0,
            }),
          );
        }

        if (meditation.exists) {
          const activity = meditation.data();

          dispatch(
            addActivity({
              meditation: activity?.time || 0,
            }),
          );
        }

        if (yoga.exists) {
          const activity = yoga.data();

          dispatch(
            addActivity({
              yoga: activity?.time || 0,
            }),
          );
        }
      } catch (error) {
        console.log('error fetching activity data: ', error);
      }
    };

    const fetchTarget = async () => {
      try {
        const targetDoc = await firestore()
          .collection('targets')
          .doc(user?.id)
          .collection('dailyTargets')
          .doc(today)
          .get();

        if (targetDoc.exists) {
          // If target for today exists, set it to state
          setTarget(targetDoc.data());
        } else {
          // If not exists, create a new target with random values
          const newTarget = {
            steps: Math.floor(Math.random() * 1000) + 500,
            distance: Math.random() * 4 + 1,
            meditation: Math.floor(Math.random() * 60) + 10,
            yoga: Math.floor(Math.random() * 60) + 10,
          };

          await firestore()
            .collection('targets')
            .doc(user?.id)
            .collection('dailyTargets')
            .doc(today)
            .set(newTarget);

          setTarget(newTarget);
        }
      } catch (error) {
        console.log('error fetching or creating target data: ', error);
      }
    };
    fetchTarget();
    fetchActivity();
  }, []);

  const renderBmi = (bmi: number) => {
    if (bmi) {
      let bmiStatus;
      if (bmi >= 29) {
        bmiStatus = 'Béo phì';
      } else if (bmi > 18) {
        bmiStatus = 'Bình thường';
      } else {
        bmiStatus = 'Gầy';
      }
      return <Text style={{color: COLORS.WHITE}}>Tình trạng: {bmiStatus}</Text>;
    } else {
      return <Text style={{color: COLORS.WHITE}}>Chưa có thông tin BMI</Text>;
    }
  };

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <ScrollView
        style={{paddingHorizontal: 20}}
        showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.text}>Chào mừng,</Text>
        <Text style={globalStyles.title}>
          {user?.firstName + ' ' + user?.lastName}
        </Text>
        <SpaceComponent height={10} />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            paddingHorizontal: 20,
          }}>
          <Image
            source={require('../../assets/images/Banner.png')}
            style={{width: SCREEN.WIDTH, height: 200, resizeMode: 'stretch'}}
          />
          <View style={{position: 'absolute', top: 50, left: 20}}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontWeight: '700',
              }}>
              {'BMI (Chỉ số khối cơ thể)'}
            </Text>
            <SpaceComponent height={5} />
            {renderBmi(user?.bmi)}
            <SpaceComponent height={10} />
            <ButtonComponent
              title="Gợi Ý"
              onPress={() => navigation.navigate('BMIFoodSuggestionsScreen')}
            />
          </View>
          <View style={{position: 'absolute', right: 47, top: 57}}>
            <Text
              style={{
                color: COLORS.WHITE,
                fontWeight: '700',
              }}>
              {user?.bmi?.toFixed(1)}
            </Text>
          </View>
        </View>
        <CardComponent
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 16,
            backgroundColor: COLORS.BLUE,
            paddingVertical: 18,
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              fontSize: SIZES.h5,
              color: COLORS.WHITE,
              fontWeight: 'bold',
            }}>
            Nhiệm Vụ Hôm Nay
          </Text>
          <View style={{width: 100}}>
            <ButtonComponent
              title="Kiểm Tra"
              onPress={() => navigation.navigate('GratitudeScreen')}
            />
          </View>
        </CardComponent>
        <SpaceComponent height={30} />
        <Text
          style={{
            color: COLORS.BLACK,
            fontWeight: 'bold',
            fontSize: SIZES.h3,
          }}>
          Hoạt Động Hôm Nay 🏋🏻‍♂️
        </Text>
        <SpaceComponent height={15} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CardComponent
            style={{
              padding: 10,
              flex: 1,
              marginHorizontal: 4,
              backgroundColor: COLORS.BLUE,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                color: COLORS.WHITE,
                fontWeight: 'bold',
              }}>
              Số bước chân
            </Text>
            <Text
              style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
              {activity.steps}
            </Text>
          </CardComponent>
          <CardComponent
            style={{
              padding: 10,
              flex: 1,
              marginHorizontal: 4,
              backgroundColor: COLORS.BLUE,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                color: COLORS.WHITE,
                fontWeight: 'bold',
              }}>
              Số km
            </Text>
            <Text
              style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
              {activity.distance.toFixed(2)}
            </Text>
          </CardComponent>
        </View>
        <SpaceComponent height={15} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CardComponent
            style={{
              padding: 10,
              flex: 1,
              marginHorizontal: 4,
              backgroundColor: COLORS.BLUE,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                color: COLORS.WHITE,
                fontWeight: 'bold',
              }}>
              Số thời gian thiền(phút)
            </Text>
            <Text
              style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
              {activity.meditation}
            </Text>
          </CardComponent>
          <CardComponent
            style={{
              padding: 10,
              flex: 1,
              marginHorizontal: 4,
              backgroundColor: COLORS.BLUE,
            }}>
            <Text
              style={{
                fontSize: SIZES.h5,
                color: COLORS.WHITE,
                fontWeight: 'bold',
              }}>
              Số thời gian tập Yoga(phút)
            </Text>
            <Text
              style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
              {activity.yoga}
            </Text>
          </CardComponent>
        </View>
        <SpaceComponent height={15} />
        <View>
          <Text
            style={{
              color: COLORS.BLACK,
              fontWeight: 'bold',
              fontSize: SIZES.h3,
            }}>
            Mục tiêu Hôm Nay 🔥
          </Text>
          <SpaceComponent height={15} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CardComponent
              style={{
                padding: 10,
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: COLORS.PRIMARY,
              }}>
              <Text
                style={{
                  fontSize: SIZES.h5,
                  color: COLORS.WHITE,
                  fontWeight: 'bold',
                }}>
                Số bước chân
              </Text>
              <Text
                style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
                {target.steps}{' '}
                {activity.steps >= target.steps ? (
                  <Text style={{fontSize: SIZES.h6}}>(Đạt)</Text>
                ) : (
                  ''
                )}
              </Text>
            </CardComponent>
            <CardComponent
              style={{
                padding: 10,
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: COLORS.DANGER,
              }}>
              <Text
                style={{
                  fontSize: SIZES.h5,
                  color: COLORS.WHITE,
                  fontWeight: 'bold',
                }}>
                Số km
              </Text>
              <Text
                style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
                {target?.distance.toFixed(2)}
                {activity.distance >= target.distance ? (
                  <Text style={{fontSize: SIZES.h6}}>(Đạt)</Text>
                ) : (
                  ''
                )}
              </Text>
            </CardComponent>
          </View>
          <SpaceComponent height={15} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CardComponent
              style={{
                padding: 10,
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: COLORS.BLUE,
              }}>
              <Text
                style={{
                  fontSize: SIZES.h5,
                  color: COLORS.WHITE,
                  fontWeight: 'bold',
                }}>
                Số thời gian thiền(phút)
              </Text>
              <Text
                style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
                {target.meditation}
                {activity.meditation >= target.meditation ? (
                  <Text style={{fontSize: SIZES.h6}}>(Đạt)</Text>
                ) : (
                  ''
                )}
              </Text>
            </CardComponent>
            <CardComponent
              style={{
                padding: 10,
                flex: 1,
                marginHorizontal: 4,
                backgroundColor: COLORS.WARNING,
              }}>
              <Text
                style={{
                  fontSize: SIZES.h5,
                  color: COLORS.WHITE,
                  fontWeight: 'bold',
                }}>
                Số thời gian tập Yoga(phút)
              </Text>
              <Text
                style={{fontWeight: '700', fontSize: 28, color: COLORS.WHITE}}>
                {target.yoga}
                {activity.yoga >= target.yoga ? (
                  <Text style={{fontSize: SIZES.h6}}>(Đạt)</Text>
                ) : (
                  ''
                )}
              </Text>
            </CardComponent>
          </View>
        </View>
        <SpaceComponent height={15} />
        <View>
          <Text
            style={{
              color: COLORS.BLACK,
              fontWeight: 'bold',
              fontSize: SIZES.h3,
            }}>
            Bài Tập 🧘🏻‍♀️
          </Text>
          <SpaceComponent height={15} />
          <TouchableOpacity
            onPress={() => navigation.navigate('TrackingScreen')}>
            <CardComponent
              style={{
                padding: 10,
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{flex: 9, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/tracking.png')}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    resizeMode: 'contain',
                  }}
                />
                <View style={{flexShrink: 1}}>
                  <Text style={{fontSize: SIZES.h5, fontWeight: 'bold'}}>
                    Chạy bộ
                  </Text>
                  <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
                    Duy trì thể lực và duy trì cân nặng hiệu quả.
                  </Text>
                </View>
              </View>
            </CardComponent>
          </TouchableOpacity>
          <SpaceComponent height={15} />
          <TouchableOpacity
            onPress={() => navigation.navigate('MeditationScreen')}>
            <CardComponent
              style={{
                padding: 10,
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{flex: 9, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/meditation.png')}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    resizeMode: 'contain',
                  }}
                />
                <View style={{flexShrink: 1}}>
                  <Text style={{fontSize: SIZES.h5, fontWeight: 'bold'}}>
                    Thiền
                  </Text>
                  <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
                    Cải thiện tập trung và giảm căng thẳng.
                  </Text>
                </View>
              </View>
            </CardComponent>
          </TouchableOpacity>
          <SpaceComponent height={15} />
          <TouchableOpacity onPress={() => navigation.navigate('YogaScreen')}>
            <CardComponent
              style={{
                padding: 10,
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{flex: 9, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/yoga.png')}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    resizeMode: 'contain',
                  }}
                />
                <View style={{flexShrink: 1}}>
                  <Text style={{fontSize: SIZES.h5, fontWeight: 'bold'}}>
                    Yoga
                  </Text>
                  <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
                    Luyện tập kết nối cơ thể, hơi thở và tâm trí.
                  </Text>
                </View>
              </View>
            </CardComponent>
          </TouchableOpacity>
        </View>
        <SpaceComponent height={15} />
        <View>
          <Text
            style={{
              color: COLORS.BLACK,
              fontWeight: 'bold',
              fontSize: SIZES.h3,
            }}>
            Chăm Sóc Giấc Ngủ 🛏️
          </Text>
          <SpaceComponent height={15} />
          <TouchableOpacity
            onPress={() => navigation.navigate('SleepCareScreen')}>
            <CardComponent
              style={{
                padding: 10,
                height: 80,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{flex: 9, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../assets/images/Icon-Bed.png')}
                  style={{
                    width: 55,
                    height: 55,
                    marginRight: 10,
                    resizeMode: 'contain',
                  }}
                />
                <View style={{flexShrink: 1}}>
                  <Text style={{fontSize: SIZES.h5, fontWeight: 'bold'}}>
                    Ngủ
                  </Text>
                  <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
                    Theo dõi giấc ngủ của bạn.
                  </Text>
                </View>
              </View>
            </CardComponent>
          </TouchableOpacity>
        </View>
        <SpaceComponent height={30} />
      </ScrollView>
    </SafeAreaView>
  );
}
