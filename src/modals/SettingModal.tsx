import {Modal, Pressable, Animated, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {ButtonComponent} from '../components';
import {useNavigation} from '@react-navigation/native';
import SpaceComponent from '../components/SpaceComponent';
import {COLORS, SCREEN} from '../constans/themes';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingModal(props: Props) {
  const {onClose, visible} = props;
  const transformY = useRef(new Animated.Value(SCREEN.HEIGHT * 0.3)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.spring(transformY, {
        toValue: 0, // Vị trí đích khi mở
        stiffness: 300,
        damping: 28,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(transformY, {
      toValue: SCREEN.HEIGHT * 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal transparent statusBarTranslucent visible={visible}>
      <Pressable
        onPress={handleClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'flex-end',
        }}>
        <Pressable>
          <Animated.View
            style={[
              {
                width: SCREEN.WIDTH,
                height: SCREEN.HEIGHT * 0.3,
                backgroundColor: COLORS.WHITE,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                shadowColor: COLORS.BLACK,
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.5,
                shadowRadius: 2,
                elevation: 5,
              },
              {transform: [{translateY: transformY}]},
            ]}>
            <View style={{flex: 1}} />
            <ButtonComponent
              title="Đổi Ảnh Đại Diện"
              onPress={() => {
                handleClose();
                navigation.navigate('ChangeAvatarScreen');
              }}
            />
            <SpaceComponent height={16} />
            <ButtonComponent
              title="Chỉnh Sửa Thông Tin"
              onPress={() => {
                handleClose();
                navigation.navigate('ChangeUserInfoScreen');
              }}
            />
            <SpaceComponent height={16} />
            <ButtonComponent
              title="Đổi Mật Khẩu"
              onPress={() => {
                handleClose();
                navigation.navigate('ChangePasswordScreen');
              }}
            />
            <SpaceComponent height={20} />
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
