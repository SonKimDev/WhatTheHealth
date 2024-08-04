import {
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {COLORS, SCREEN, SIZES} from '../constans/themes';
import {Man, Woman} from 'iconsax-react-native';
import {SpaceComponent} from '../components';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelected: (value: string) => void;
}

export default function SelectGenderModal(props: Props) {
  const {visible, onClose, onSelected} = props;

  const translateY = useRef(new Animated.Value(SCREEN.HEIGHT * 0.2)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        stiffness: 300,
        damping: 27,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN.HEIGHT * 0.2,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const animatedClose = () => {
    Animated.timing(translateY, {
      toValue: SCREEN.HEIGHT * 0.2,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <Pressable
        onPress={animatedClose}
        style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.2)'}}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Animated.View
            style={[
              {
                backgroundColor: COLORS.WHITE,
                width: SCREEN.WIDTH,
                height: SCREEN.HEIGHT * 0.2,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
              },
              {transform: [{translateY}]},
            ]}>
            <Text style={{fontSize: SIZES.h3, color: COLORS.BLACK}}>
              Chọn giới tính của bạn.
            </Text>
            <SpaceComponent height={16} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  onSelected('male');
                  animatedClose();
                }}
                style={{
                  borderRadius: 20,
                  width: 70,
                  height: 70,
                  backgroundColor: COLORS.PRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                }}>
                <Man size={40} color={COLORS.WHITE} variant="Outline" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onSelected('female');
                  animatedClose();
                }}
                style={{
                  borderRadius: 20,
                  width: 70,
                  height: 70,
                  backgroundColor: COLORS.PRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                }}>
                <Woman size={40} color={COLORS.WHITE} variant="Outline" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
}
