import {Modal, Pressable, Image} from 'react-native';
import React from 'react';

interface Props {
  visible?: boolean;
  avatar?: string;
  onClose?: () => void;
}

export default function ShowAvatarModal(props: Props) {
  const {visible, avatar, onClose} = props;

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
        <Image
          source={
            avatar
              ? {uri: `data:${'image/jpeg'};base64,${avatar}`}
              : require('../assets/images/avatar.png')
          }
          style={{width: 300, height: 300}}
        />
      </Pressable>
    </Modal>
  );
}
