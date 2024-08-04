import {View, Text, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {COLORS, SIZES} from '../../constans/themes';
import {SpaceComponent} from '../../components';
import {globalStyles} from '../../styles/globalStyles';

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={[globalStyles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>1. Giới thiệu</Text>
          <Text style={styles.sectionContent}>
            Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính sách bảo mật
            này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin
            cá nhân của bạn.
          </Text>
          <SpaceComponent height={20} />

          <Text style={styles.sectionTitle}>
            2. Thông tin chúng tôi thu thập
          </Text>
          <Text style={styles.sectionContent}>
            Chúng tôi có thể thu thập thông tin cá nhân như tên, địa chỉ email,
            số điện thoại, và thông tin khác mà bạn cung cấp khi sử dụng dịch vụ
            của chúng tôi.
          </Text>
          <SpaceComponent height={20} />

          <Text style={styles.sectionTitle}>
            3. Cách chúng tôi sử dụng thông tin
          </Text>
          <Text style={styles.sectionContent}>
            Chúng tôi sử dụng thông tin cá nhân để cung cấp dịch vụ, cải thiện
            trải nghiệm của bạn, và liên lạc với bạn về các cập nhật và khuyến
            mãi.
          </Text>
          <SpaceComponent height={20} />

          <Text style={styles.sectionTitle}>4. Bảo mật thông tin</Text>
          <Text style={styles.sectionContent}>
            Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin
            cá nhân của bạn khỏi việc truy cập trái phép, sử dụng hoặc tiết lộ.
          </Text>
          <SpaceComponent height={20} />

          <Text style={styles.sectionTitle}>5. Quyền của bạn</Text>
          <Text style={styles.sectionContent}>
            Bạn có quyền yêu cầu truy cập, sửa đổi, hoặc xóa thông tin cá nhân
            của mình. Bạn cũng có quyền từ chối nhận thông tin tiếp thị từ chúng
            tôi.
          </Text>
          <SpaceComponent height={20} />

          <Text style={styles.sectionTitle}>6. Thay đổi chính sách</Text>
          <Text style={styles.sectionContent}>
            Chúng tôi có thể cập nhật chính sách bảo mật này từ thời gian này
            đến thời gian khác. Mọi thay đổi sẽ được thông báo trên trang này.
          </Text>
          <SpaceComponent height={20} />

          <Text style={styles.sectionTitle}>7. Liên hệ với chúng tôi</Text>
          <Text style={styles.sectionContent}>
            Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật của chúng tôi,
            vui lòng liên hệ với chúng tôi qua email sonkhph21573@fpt.edu.vn
          </Text>
          <SpaceComponent height={20} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  content: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.BLACK,
  },
  sectionContent: {
    fontSize: SIZES.h5,
    color: COLORS.BLACK,
    lineHeight: 22,
  },
});
