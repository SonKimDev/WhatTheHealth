import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import {ButtonComponent, SpaceComponent} from '../../components';
import ImageCropPicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import {addAuth} from '../../store/slices/auth';
import {useNavigation} from '@react-navigation/native';

export default function ChangeAvatarScreen() {
  const [image, setImage] = useState(null);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handlePickAvatar = () => {
    ImageCropPicker.openPicker({
      mediaType: 'photo',
      cropping: true,
      width: 300,
      height: 300,
      includeBase64: true,
      compressImageQuality: 0.8,
    })
      .then(image => {
        setImage(image);
      })
      .catch(error => {
        Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + error.message);
      });
  };

  const handleUploadAvatar = async () => {
    if (image) {
      try {
        await firestore()
          .collection('users')
          .doc(user?.id)
          .update({
            avatar: image.data,
          })
          .then(async () => {
            dispatch(addAuth({avatar: image.data}));
            navigation.goBack();
          });
        Alert.alert('Thành công', 'Ảnh đại diện đã được thay đổi thành công!');
      } catch (error) {
        console.error(error);
        Alert.alert('Lỗi', 'Không thể lưu ảnh đại diện: ' + error.message);
      }
    }
  };

  useLayoutEffect(() => {
    const loadCurrentAvatar = async () => {
      if (!user?.avatar) {
        return;
      }
      setImage({data: user?.avatar, mime: 'image/jpeg'});
    };
    loadCurrentAvatar();
  }, []);

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 16}}>
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          Nhấn vào ảnh để thay đổi ảnh đại diện
        </Text>
        <SpaceComponent height={16} />
        <TouchableOpacity
          onPress={() => handlePickAvatar()}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={
              image
                ? {uri: `data:${image.mime};base64,${image.data}`}
                : require('../../assets/images/avatar.png')
            }
            style={{
              width: 300,
              height: 300,
              borderRadius: 10,
            }}
          />
        </TouchableOpacity>
        <View style={{flex: 1}} />
        <ButtonComponent
          title="Xác Nhận Thay Đổi"
          onPress={handleUploadAvatar}
          disabled={image === null}
        />
        {Platform.OS === 'android' && <SpaceComponent height={16} />}
      </View>
    </SafeAreaView>
  );
}
