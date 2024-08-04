import {View, Text, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {COLORS, SIZES} from '../constans/themes';

interface Props {
  affix?: ReactNode;
  title: string;
  suffix?: ReactNode;
  disabled?: boolean;
  onPress: () => void;
}

export default function ButtonComponent(props: Props) {
  const {affix, title, suffix, disabled, onPress} = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        backgroundColor: disabled ? COLORS.GRAY2 : COLORS.PRIMARY,
        borderRadius: 99,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.PRIMARY,
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: disabled ? 0 : 0.5,
        shadowRadius: 10,
        elevation: 5,
      }}
      disabled={disabled}>
      {affix && (
        <View
          style={{
            marginRight: 3,
            width: SIZES.h2,
            height: SIZES.h2,
          }}>
          {affix}
        </View>
      )}
      <Text
        style={{
          fontSize: SIZES.h4,
          fontWeight: 'bold',
          color: disabled ? COLORS.GRAY1 : COLORS.WHITE,
          paddingVertical: 15,
        }}>
        {title}
      </Text>
      {suffix && (
        <View
          style={{
            marginLeft: 3,
            width: SIZES.h2,
            height: SIZES.h2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {suffix}
        </View>
      )}
    </TouchableOpacity>
  );
}
