import {
  View,
  Text,
  SafeAreaView,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  SectionList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {
  ButtonComponent,
  CardComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {selectUser} from '../../store/slices/auth/selectors';
import {useSelector} from 'react-redux';
import {MessageQuestion} from 'iconsax-react-native';
import {COLORS, SIZES} from '../../constans/themes';
import firestore from '@react-native-firebase/firestore';
import {AdviceModal, LoadingModal} from '../../modals';
import {Controller, useForm} from 'react-hook-form';
export default function AdviceScreen() {
  const user = useSelector(selectUser);
  const [category, setCategory] = useState('Sức Khoẻ');
  const [isShowAdviceModal, setIsShowAdviceModal] = useState(false);
  const [sendAdviceToday, setSendAdviceToday] = useState(false);
  const [itemSelect, setItemSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advices, setAdvices] = useState({
    unanswered: [],
    answered: [],
  });

  const today = new Date().toISOString().split('T')[0];
  const nicknames = [
    'Gấu trúc mộng mơ',
    'Mèo lười biếng',
    'Cá vàng nhớ nhà',
    'Chó con hiếu động',
    'Thỏ ngọc tinh nghịch',
    'Rồng nhỏ mạnh mẽ',
  ];
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSubmit = (data: any) => {
    setIsLoading(true);
    const randomNickname =
      nicknames[Math.floor(Math.random() * nicknames.length)];
    firestore()
      .collection('advices')
      .add({
        userId: user.id,
        content: data.adviceContent,
        userNickname: randomNickname,
        type: category,
        date: today,
        status: 'unanswered',
        professorId: null,
        professorNickname: null,
        answer: null,
      })
      .then(() => {
        setSendAdviceToday(true);
        getAllAdvice();
        setIsLoading(false);
        Alert.alert('Thông báo', 'Gửi vấn đề thành công!');
      })
      .catch(error => {
        Alert.alert('Lỗi', error.message);
        setIsLoading(false);
      });
  };

  const checkSendAdviceToday = () => {
    firestore()
      .collection('advices')
      .where('userId', '==', user.id)
      .where('date', '==', today)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          setSendAdviceToday(true);
        } else {
          setSendAdviceToday(false);
        }
      });
  };

  const getAllAdvice = async () => {
    if (user?.roles === 'professional') {
      firestore()
        .collection('advices')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const unanswered = [];
            const answered = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
              if (data.status === 'unanswered') {
                unanswered.push({id: doc.id, ...data});
              } else {
                answered.push({id: doc.id, ...data});
              }
            });
            setAdvices({unanswered, answered});
          }
        });
    } else {
      firestore()
        .collection('advices')
        .where('userId', '==', user.id)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            const unanswered = [];
            const answered = [];
            querySnapshot.forEach(doc => {
              const data = doc.data();
              if (data.status === 'unanswered') {
                unanswered.push({id: doc.id, ...data});
              } else {
                answered.push({id: doc.id, ...data});
              }
            });
            setAdvices({unanswered, answered});
          }
        });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    checkSendAdviceToday();
    getAllAdvice();
    setIsLoading(false);
  }, []);

  return user?.roles == 'professional' ? (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        {Platform.OS === 'ios' && <SpaceComponent height={16} />}
        <FlatList
          data={advices.unanswered}
          renderItem={advice => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setItemSelect(advice.item);
                  setIsShowAdviceModal(true);
                }}>
                <CardComponent
                  style={{
                    padding: 10,
                    margin: 10,
                    height: 150,
                    maxHeight: 150,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{justifyContent: 'space-between'}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: SIZES.h5,
                          color: COLORS.BLACK,
                        }}>
                        {advice.item.userNickname}
                      </Text>
                      <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
                        đã gửi vấn đề về {advice.item.type}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: SIZES.h6,
                        color: COLORS.BLACK,
                        textAlign: 'center',
                      }}>
                      {advice.item.content}
                    </Text>
                  </View>
                  <SpaceComponent height={10} />
                  <Text
                    style={{
                      fontSize: SIZES.h6,
                      color: COLORS.GRAY2,
                      alignSelf: 'flex-end',
                    }}>
                    {advice.item.date}
                  </Text>
                </CardComponent>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={[globalStyles.title, {textAlign: 'center'}]}>
                Danh sách vấn đề chưa được phản hồi
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                marginTop: '50%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Hiện không có vấn đề nào cần phản hồi.</Text>
            </View>
          )}
        />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <AdviceModal
        visible={isShowAdviceModal}
        onClose={() => {
          getAllAdvice();
          setIsShowAdviceModal(false);
        }}
        item={itemSelect}
        type={user?.roles}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20}}>
        {Platform.OS === 'ios' && <SpaceComponent height={16} />}
        {sendAdviceToday ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{textAlign: 'center'}}>
              Bạn đã gửi vấn đề hôm nay, vui lòng quay trở lại vào ngày mai.
            </Text>
          </View>
        ) : (
          <View>
            <Controller
              control={control}
              name="adviceContent"
              rules={{
                required: {
                  value: true,
                  message: 'Vấn đề không được để trống.',
                },
                minLength: {
                  value: 10,
                  message: 'Vấn đề phải có ít nhất 10 kí tự.',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <>
                  <InputComponent
                    placeHolder={'Nhập vấn đề của bạn...'}
                    affix={
                      <MessageQuestion
                        size={SIZES.h3}
                        color={COLORS.GRAY1}
                        variant="Bold"
                      />
                    }
                    value={value}
                    onChange={onChange}
                    onDeleteText={onChange}
                    onBlur={onBlur}
                  />
                  {errors.adviceContent && (
                    <Text style={{color: COLORS.DANGER, marginTop: 10}}>
                      {errors.adviceContent.message}
                    </Text>
                  )}
                </>
              )}
            />
            <SpaceComponent height={16} />
            <Text>Chọn thể loại vấn đề cần tư vấn của bạn:</Text>
            <SpaceComponent height={10} />
            <FlatList
              data={[
                {id: 1, category: 'Sức Khoẻ'},
                {id: 2, category: 'Tâm Lý'},
                {id: 3, category: 'Giới Tính'},
              ]}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => setCategory(item.category)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      category === item.category ? COLORS.BLUE : COLORS.WHITE,
                    borderRadius: 5,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderWidth: category === item.category ? 0 : 1,
                    borderColor:
                      category === item.category ? null : COLORS.BLUE,
                  }}>
                  <Text
                    style={{
                      color:
                        category === item.category ? COLORS.WHITE : COLORS.BLUE,
                    }}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              ItemSeparatorComponent={() => <SpaceComponent width={10} />}
            />
            <SpaceComponent height={16} />
            <ButtonComponent title="Gửi" onPress={handleSubmit(onSubmit)} />
          </View>
        )}

        <SpaceComponent height={16} />
        <SectionList
          sections={[
            {title: 'Chưa phản hồi', data: advices.unanswered},
            {title: 'Đã phản hồi', data: advices.answered},
          ]}
          data={[{id: 1}]}
          renderItem={advice => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (advice.section.title == 'Đã phản hồi') {
                    setItemSelect(advice.item);
                    setIsShowAdviceModal(true);
                  }
                }}>
                <CardComponent
                  style={{
                    padding: 10,
                    margin: 10,
                    height: 150,
                    maxHeight: 150,
                  }}>
                  {advice.item.status === 'answered' && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <SpaceComponent width={10} />
                      <View style={{justifyContent: 'space-between'}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: SIZES.h5,
                            color: COLORS.BLACK,
                          }}>
                          {advice.item.professorNickname}
                        </Text>
                        <Text style={{fontSize: SIZES.h6, color: COLORS.GRAY1}}>
                          đã gửi lời khuyên về vấn đề {advice.item.type}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: SIZES.h6,
                        color: COLORS.BLACK,
                        textAlign: 'center',
                      }}>
                      {advice.item.content}
                    </Text>
                  </View>
                  <SpaceComponent height={10} />
                  <Text
                    style={{
                      fontSize: SIZES.h6,
                      color: COLORS.GRAY2,
                      alignSelf: 'flex-end',
                    }}>
                    {advice.item.date}
                  </Text>
                </CardComponent>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({section}) => (
            <View style={{backgroundColor: COLORS.WHITE, padding: 8}}>
              <Text style={{fontWeight: 'bold'}}>{section.title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
      <AdviceModal
        visible={isShowAdviceModal}
        onClose={() => {
          getAllAdvice();
          setIsShowAdviceModal(false);
        }}
        item={itemSelect}
      />
      <LoadingModal visible={isLoading} />
    </SafeAreaView>
  );
}
