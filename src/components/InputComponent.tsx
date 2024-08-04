import {View, TextInput, TouchableOpacity} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {COLORS, SIZES} from '../constans/themes';
import {CloseCircle, Eye, EyeSlash} from 'iconsax-react-native';

interface Props {
  affix?: ReactNode;
  suffix?: ReactNode;
  placeHolder?: String;
  isPassword?: boolean;
  value?: string;
  isNumber?: boolean;
  editable?: boolean;
  onBlur?: () => void;
  onDeleteText: () => void;
  onChange: (text: string) => void;
}

export default function InputComponent(props: Props) {
  const {
    affix,
    suffix,
    placeHolder = '',
    isPassword,
    value = '',
    isNumber = false,
    editable = true,
    onBlur,
    onDeleteText,
    onChange,
  } = props;
  const [isShowPassword, setIsShowPassword] = useState(isPassword);
  return (
    <View
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
      <TextInput
        style={{
          flex: 1,
          marginLeft: 10,
          height: '100%',
          marginRight: 10,
        }}
        placeholder={placeHolder}
        placeholderTextColor={COLORS.GRAY2}
        secureTextEntry={isShowPassword}
        value={value}
        onChangeText={onChange}
        keyboardType={isNumber ? 'number-pad' : 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        onBlur={onBlur}
        editable={editable}
      />
      {suffix ?? isPassword ? (
        <TouchableOpacity
          onPress={() => setIsShowPassword(!isShowPassword)}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: SIZES.h3,
            height: SIZES.h3,
          }}>
          {isShowPassword ? (
            <EyeSlash size={SIZES.h3} color={COLORS.GRAY1} variant="Outline" />
          ) : (
            <Eye size={SIZES.h3} color={COLORS.GRAY1} variant="Outline" />
          )}
        </TouchableOpacity>
      ) : (
        value && (
          <TouchableOpacity
            onPress={() => onDeleteText('')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: SIZES.h3,
              height: SIZES.h3,
            }}>
            <CloseCircle
              size={SIZES.h3}
              color={COLORS.GRAY1}
              variant="Outline"
            />
          </TouchableOpacity>
        )
      )}
    </View>
  );
}
