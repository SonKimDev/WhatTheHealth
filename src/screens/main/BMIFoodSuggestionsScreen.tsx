import {View, Text, SafeAreaView, FlatList} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {selectUser} from '../../store/slices/auth/selectors';
import {globalStyles} from '../../styles/globalStyles';
import {CardComponent, SpaceComponent} from '../../components';

export default function BMIFoodSuggestionsScreen() {
  const user = useSelector(selectUser);

  const getFoodSuggestions = bmi => {
    if (bmi < 18.5) {
      return {
        suggestions: [
          'Protein: Thịt gà, thịt bò, cá',
          'Carbs: Gạo, bánh mì, mì',
          'Chất béo tốt: Bơ, hạt, dầu ô liu',
          'Vitamin và khoáng chất: Trái cây, rau xanh',
        ],
        avoid: ['Thực phẩm chế biến sẵn', 'Đồ ăn nhanh', 'Đồ ăn nhiều đường'],
        advice:
          'Tăng cường calo và protein để giúp tăng cân. Chia nhỏ bữa ăn và ăn nhiều lần trong ngày.',
      };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return {
        suggestions: [
          'Protein: Thịt nạc, cá, đậu',
          'Carbs: Ngũ cốc nguyên hạt, khoai lang',
          'Chất béo tốt: Hạt, dầu cá',
          'Vitamin và khoáng chất: Rau củ, trái cây',
        ],
        avoid: ['Thực phẩm nhiều đường', 'Thực phẩm chiên xào nhiều dầu mỡ'],
        advice:
          'Duy trì chế độ ăn cân bằng và hoạt động thể chất để giữ BMI ổn định. Hãy chú ý đến lượng calo tiêu thụ và các chất dinh dưỡng.',
      };
    } else if (bmi >= 25 && bmi < 29.9) {
      return {
        suggestions: [
          'Protein: Thịt nạc, cá, đậu',
          'Carbs: Ngũ cốc nguyên hạt, rau xanh',
          'Chất béo tốt: Hạt, dầu cá',
          'Vitamin và khoáng chất: Rau củ, trái cây ít ngọt',
        ],
        avoid: [
          'Thực phẩm nhiều đường',
          'Thực phẩm chế biến sẵn',
          'Đồ ăn nhanh',
        ],
        advice:
          'Giảm lượng calo và tăng cường hoạt động thể chất. Lựa chọn thực phẩm giàu chất xơ và ít calo.',
      };
    } else {
      return {
        suggestions: [
          'Protein: Thịt nạc, cá, đậu',
          'Carbs: Ngũ cốc nguyên hạt, rau xanh',
          'Chất béo tốt: Hạt, dầu cá',
          'Vitamin và khoáng chất: Rau củ, trái cây ít ngọt',
        ],
        avoid: [
          'Thực phẩm nhiều đường',
          'Thực phẩm chiên xào nhiều dầu mỡ',
          'Thực phẩm chế biến sẵn',
        ],
        advice:
          'Tập trung vào việc giảm cân thông qua chế độ ăn uống lành mạnh và tập luyện thể thao. Tránh thực phẩm có nhiều đường và chất béo bão hòa.',
      };
    }
  };

  const {suggestions, avoid, advice} = getFoodSuggestions(user?.bmi);

  return (
    <SafeAreaView style={[globalStyles.container]}>
      <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 10}}>
        <Text style={[globalStyles.title, {textAlign: 'center'}]}>
          BMI hiện tại của bạn: {user?.bmi.toFixed(1)}
        </Text>
        <SpaceComponent height={10} />
        <Text style={[globalStyles.subtitle]}>Thực phẩm nên ăn:</Text>
        <SpaceComponent height={10} />
        <FlatList
          data={suggestions}
          renderItem={({item}) => (
            <CardComponent style={{padding: 20, margin: 5}}>
              <Text>{item}</Text>
            </CardComponent>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text style={[globalStyles.subtitle]}>Thực phẩm nên tránh:</Text>
        <SpaceComponent height={10} />
        <FlatList
          data={avoid}
          renderItem={({item}) => (
            <CardComponent style={{padding: 20, margin: 5}}>
              <Text>{item}</Text>
            </CardComponent>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <Text style={[globalStyles.subtitle]}>Lời khuyên:</Text>
        <SpaceComponent height={10} />
        <CardComponent style={{padding: 20, margin: 5}}>
          <Text>{advice}</Text>
        </CardComponent>
      </View>
    </SafeAreaView>
  );
}
