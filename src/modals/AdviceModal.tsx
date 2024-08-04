import {
  View,
  Modal,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {ButtonComponent, SpaceComponent} from '../components';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {selectUser} from '../store/slices/auth/selectors';
import LoadingModal from './LoadingModal';
import {COLORS} from '../constans/themes';
import {useForm, Controller} from 'react-hook-form';
interface Props {
  visible: boolean;
  type?: string;
  item: any;
  onClose: () => void;
}

export default function AdviceModal(props: Props) {
  const user = useSelector(selectUser);
  const {visible, type, item, onClose} = props;
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    formState: {errors},
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      answer: '',
    },
  });

  useEffect(() => {
    setValue('answer', '');
  }, [visible]);

  const nicknames = ['Sensei Không Liêm', 'Vườn Bóng Tối', 'Let Me Solo Her'];

  const handleAnswer = ({answer}) => {
    setIsLoading(true);
    firestore()
      .collection('advices')
      .doc(item.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          if (doc.data()?.status === 'unanswered') {
            const randomNickname =
              nicknames[Math.floor(Math.random() * nicknames.length)];
            firestore().collection('advices').doc(item.id).update({
              status: 'answered',
              answer: answer,
              professorId: user?.id,
              professorNickname: randomNickname,
            });
            setIsLoading(false);
            Alert.alert('Thông báo', 'Gửi lời khuyên thành công!');
            onClose();
          } else {
            setIsLoading(false);
            onClose();
            Alert.alert('Lỗi', 'Không thể gửi Lựa Khuyên này');
          }
        }
      });
    onClose();
  };

  return (
    <Modal statusBarTranslucent visible={visible} animationType="slide">
      {type === 'professional' ? (
        <SafeAreaView style={globalStyles.container}>
          <View style={{flex: 1, paddingHorizontal: 20}}>
            <Controller
              control={control}
              name="answer"
              rules={{
                required: 'Lời khuyên không được để trống',
                minLength: {
                  value: 10,
                  message: 'Lời khuyên phải có ít nhất 10 kí tự',
                },
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <View>
                  <TextInput
                    style={{
                      height: 150,
                      borderColor: COLORS.GRAY3,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 10,
                      textAlignVertical: 'top',
                      backgroundColor: COLORS.WHITE,
                    }}
                    placeholder="Nhập lời khuyên của bạn..."
                    multiline={true}
                    numberOfLines={4}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {errors.answer && (
                    <Text style={{color: COLORS.DANGER, marginTop: 10}}>
                      {errors.answer.message}
                    </Text>
                  )}
                </View>
              )}
            />
            <View style={{flex: 1}} />
            <ButtonComponent
              onPress={handleSubmit(handleAnswer)}
              title="Gửi Lời Khuyên"
            />
            <SpaceComponent height={20} />
            <ButtonComponent onPress={onClose} title="Đóng" />
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={globalStyles.container}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
            }}>
            <View style={{flexDirection: 'row'}}>
              <SpaceComponent width={10} />
              <View>
                <Text>{item?.professorNickname}</Text>
                <Text style={{color: COLORS.GRAY2}}>
                  đã trả lời vấn đề của bạn...
                </Text>
              </View>
            </View>
            <SpaceComponent height={5} />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.GRAY3,
              }}
            />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={[globalStyles.title, {textAlign: 'center'}]}>
                {item?.answer}
              </Text>
            </View>
            <ButtonComponent onPress={onClose} title="Trở Lại" />
          </View>
        </SafeAreaView>
      )}
      <LoadingModal visible={isLoading} />
    </Modal>
  );
}
