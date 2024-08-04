import {View, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS} from '../constans/themes';

interface Props {
  visible: boolean;
}

export default function LoadingModal(props: Props) {
  const {visible} = props;

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    </Modal>
  );
}
