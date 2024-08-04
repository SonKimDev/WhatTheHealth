import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import {COLORS, SCREEN, SIZES} from '../constans/themes';

interface Props {
  visible?: boolean;
  title?: string;
  onAccept: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal(props: Props) {
  const {visible, title, onAccept, onCancel} = props;

  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: SCREEN.WIDTH * 0.7,
            height: SCREEN.HEIGHT * 0.13,
            backgroundColor: COLORS.WHITE,
            borderRadius: 20,
            overflow: 'hidden',
          }}>
          <View
            style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                color: COLORS.BLACK,
                fontSize: SIZES.h4,
                fontWeight: 'bold',
              }}>
              {title}
            </Text>
          </View>
          <View style={{flex: 2, flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopWidth: 0.5,
                borderRightWidth: 0.25,
                borderColor: COLORS.GRAY3,
              }}>
              <Text style={{color: COLORS.BLUE, fontSize: SIZES.h4}}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onAccept}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopWidth: 0.5,
                borderLeftWidth: 0.25,
                borderColor: COLORS.GRAY3,
              }}>
              <Text style={{color: COLORS.DANGER, fontSize: SIZES.h4}}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
