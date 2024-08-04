import {StyleSheet, Platform, StatusBar} from 'react-native';
import {COLORS, SIZES} from '../constans/themes';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  text: {
    fontSize: SIZES.h5,
    color: COLORS.GRAY1,
  },
  title: {
    fontSize: 24,
    color: COLORS.BLACK,
    fontWeight: 'bold',
  },
});
