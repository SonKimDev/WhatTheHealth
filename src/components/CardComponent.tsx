import {View, StyleSheet, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import {COLORS} from '../constans/themes';

interface Props {
  children?: ReactNode;
  style?: ViewStyle;
}

export default function CardComponent(props: Props) {
  const {children, style} = props;

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    shadowColor: COLORS.GRAY1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
