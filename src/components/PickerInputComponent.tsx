import {Pressable, Text, View} from 'react-native';
import {ReactNode} from 'react';
import {COLORS, SIZES} from '../constans/themes';
import {ArrowDown2} from 'iconsax-react-native';

interface Props {
  affix?: ReactNode;
  value?: string;
  placeHolder?: string;
  onPress: () => void;
}
export default function PickerInputComponent(props: Props) {
  const {affix, value, placeHolder, onPress} = props;

  const displayValue = () => {
    if (value === 'male') return 'Nam';
    if (value === 'female') return 'Nữ';
    return placeHolder;
  };

  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 48,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: COLORS.BORDER,
      }}>
      {affix ?? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: SIZES.h3,
            height: SIZES.h3,
          }}>
          {affix}
        </View>
      )}
      <Text
        style={{
          color: value ? COLORS.BLACK : COLORS.GRAY2,
          fontSize: SIZES.h5,
          flex: 1,
          marginLeft: 10,
          marginRight: 10,
        }}>
        {displayValue()}
      </Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: SIZES.h3,
          height: SIZES.h3,
        }}>
        <ArrowDown2 color={COLORS.GRAY2} size={SIZES.h3} />
      </View>
    </Pressable>
  );
}
