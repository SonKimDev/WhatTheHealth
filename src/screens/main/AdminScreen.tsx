import {
  View,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {globalStyles} from '../../styles/globalStyles';
import firestore from '@react-native-firebase/firestore';
import {
  ButtonComponent,
  CardComponent,
  InputComponent,
  SpaceComponent,
} from '../../components';
import {ArrowDown, ArrowUp, SearchNormal1} from 'iconsax-react-native';
import {COLORS, SIZES} from '../../constans/themes';
export default function AdminScreen() {
  const [listUser, setListUser] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const getListUser = async () => {
    try {
      const response = await firestore()
        .collection('users')
        .where('roles', '!=', 'admin')
        .get();
      const list = [];
      response.forEach(doc => {
        list.push(doc.data());
      });
      setListUser(list);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeRole = async item => {
    try {
      await firestore()
        .collection('users')
        .doc(item.id)
        .update({roles: item.roles === 'member' ? 'professional' : 'member'});
      getListUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchUser = () => {
    if (searchValue) {
      const filteredList = listUser.filter(item =>
        item.id.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setListUser(filteredList);
    } else {
      getListUser();
    }
  };

  useEffect(() => {
    getListUser();
  }, [searchValue === '']);

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 16}}>
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          Danh sách người dùng
        </Text>
        <SpaceComponent height={20} />
        <InputComponent
          placeHolder="Tìm kiếm..."
          affix={
            <SearchNormal1 size={20} color={COLORS.PRIMARY} variant="Outline" />
          }
          value={searchValue}
          onChange={setSearchValue}
          onDeleteText={() => setSearchValue('')}
        />
        <SpaceComponent height={20} />
        <ButtonComponent
          title="Tìm kiếm"
          onPress={() => handleSearchUser()}
          disabled={searchValue ? false : true}
        />
        <SpaceComponent height={20} />
        <FlatList
          data={listUser}
          renderItem={({item}) => (
            <CardComponent
              style={{
                paddingVertical: 16,
                paddingHorizontal: 10,
                marginHorizontal: 10,
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: COLORS.BLACK}}>{'Id: ' + item.id}</Text>
                <Text style={{color: COLORS.BLACK}}>
                  {'Họ và Tên: ' + item.firstName + ' ' + item.lastName}
                </Text>
                <Text style={{color: COLORS.BLACK}}>
                  {'Loại tài khoản: ' + item.roles}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleChangeRole(item)}
                style={{
                  backgroundColor:
                    item.roles === 'member' ? COLORS.PRIMARY : COLORS.DANGER,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                }}>
                {item.roles === 'member' ? (
                  <ArrowUp
                    color={COLORS.WHITE}
                    size={SIZES.h1}
                    variant="Outline"
                  />
                ) : (
                  <ArrowDown
                    color={COLORS.WHITE}
                    size={SIZES.h1}
                    variant="Outline"
                  />
                )}
              </TouchableOpacity>
            </CardComponent>
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
