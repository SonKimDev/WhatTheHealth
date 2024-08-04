import {View, Text, Modal, Pressable} from 'react-native';
import React from 'react';
import {COLORS, SCREEN, SIZES} from '../constans/themes';
import {SpaceComponent} from '../components';

interface Props {
  visible?: boolean;
  email?: string;
  fullName?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  onClose?: () => void;
}

export default function InfoModal(props: Props) {
  const {visible, email, fullName, height, weight, bmi, onClose} = props;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade">
      <Pressable
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}
        onPress={onClose}>
        <Pressable
          style={{
            width: SCREEN.WIDTH * 0.8,
            backgroundColor: COLORS.WHITE,
            borderRadius: 20,
            paddingVertical: 16,
            paddingHorizontal: 20,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontWeight: 'bold',
                fontSize: SIZES.h5,
              }}>
              Họ và Tên:
            </Text>
            <Text style={{color: COLORS.BLACK, fontSize: SIZES.h5}}>
              {fullName}
            </Text>
          </View>
          <SpaceComponent height={10} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontWeight: 'bold',
                fontSize: SIZES.h5,
              }}>
              Email:
            </Text>
            <Text style={{color: COLORS.BLACK, fontSize: SIZES.h5}}>
              {email}
            </Text>
          </View>
          <SpaceComponent height={10} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontWeight: 'bold',
                fontSize: SIZES.h5,
              }}>
              Chiều cao:
            </Text>
            <Text style={{color: COLORS.BLACK, fontSize: SIZES.h5}}>
              {height + 'cm'}
            </Text>
          </View>
          <SpaceComponent height={10} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontWeight: 'bold',
                fontSize: SIZES.h5,
              }}>
              Cân nặng:
            </Text>
            <Text style={{color: COLORS.BLACK, fontSize: SIZES.h5}}>
              {weight + 'kg'}
            </Text>
          </View>
          <SpaceComponent height={10} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: COLORS.BLACK,
                fontWeight: 'bold',
                fontSize: SIZES.h5,
              }}>
              BMI:
            </Text>
            <Text style={{color: COLORS.BLACK, fontSize: SIZES.h5}}>
              {bmi?.toFixed(1)}
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
