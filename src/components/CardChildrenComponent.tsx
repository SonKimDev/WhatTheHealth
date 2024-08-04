import {View, Text, Pressable, Switch} from 'react-native';
import {ReactNode} from 'react';
import {ArrowRight2} from 'iconsax-react-native';
import {COLORS, SIZES} from '../constans/themes';
import SpaceComponent from './SpaceComponent';

interface Props {
  title: string;
  affix: ReactNode;
  isSwitch?: boolean;
  value?: boolean;
  onChange?: () => void;
  onPress?: () => void;
}

export default function CardChildrenComponent(props: Props) {
  const {title, affix, isSwitch, value, onChange, onPress} = props;

  return (
    <Pressable
      style={{flexDirection: 'row', alignItems: 'center'}}
      onPress={onPress}>
      <View
        style={{
          width: SIZES.h2,
          height: SIZES.h2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {affix}
      </View>
      <SpaceComponent width={10} />
      <Text style={{color: COLORS.GRAY1, fontSize: SIZES.h6, flex: 1}}>
        {title}
      </Text>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onChange}
          thumbColor={COLORS.WHITE}
          trackColor={{false: COLORS.GRAY1, true: COLORS.PRIMARY}}
        />
      ) : (
        <View
          style={{
            width: SIZES.h2,
            height: SIZES.h2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ArrowRight2 size={SIZES.h2} color={COLORS.GRAY1} variant="Outline" />
        </View>
      )}
    </Pressable>
  );
}
