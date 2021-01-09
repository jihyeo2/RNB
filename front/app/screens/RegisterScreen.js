import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import * as Yup from "yup";
import {MaterialCommunityIcons} from "@expo/vector-icons";


import {
  AppFormField as FormField,
  AppForm as Form,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import useAuth from "../auth/useAuth";
import usersApi from "../api/users";
import ordersApi from "../api/orders";
import authApi from "../api/auth";
import ActivityIndicator from "../components/ActivityIndicator";
import useApi from "../hooks/useApi";
import AppText from "../components/AppText";
import colors from "../config/colors";


function RegisterScreen(props) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().label("성함").test('isname', '이름은 최소 2자리여야 합니다.', (value) => value && value.length > 1),
    phone: Yup.string().label("전화번호").test('isnumber', '전화번호는 9-11자리여야 합니다.', (value) => value && value.length > 8 && value.length < 12),
    address: Yup.string().label("주소").test('isaddress', '주소를 입력하셔야 합니다.', (value) => value),
    password: Yup.string().label("비밀번호").test('ispassword', '비밀번호는 최소 6자리여야 합니다.', (value) => value && value.length > 5),
  });
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const checkApi = useApi(ordersApi.getByCustomer);
  const check1Api = useApi(ordersApi.getOrders);
  const auth = useAuth();
  const [error, setError] = useState();
  const [registerFailed, setRegisterFailed] = useState(false);

  const handleSubmit = async (userInfo) => {
    const result = await registerApi.request(userInfo);

    if (!result.ok) {
      if (result.data) {
        console.log(result.data.error);
        setError(result.data.error);
      } else {
        setError("An unexpected error occurred.");
        console.log(result);
      }
      setRegisterFailed(true);
      return;
    }

    const { data: authToken } = await loginApi.request(
      userInfo.phone,
      userInfo.password
    );

    const response = await checkApi.request(authToken);
    const response1 = await check1Api.request(authToken);


    auth.logIn(authToken);
  };

  return (
    <View style={{backgroundColor: colors.wood, flex: 1}}>
      <ScrollView>
        <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
        <View style={styles.container}>
          <AppText style={styles.title}>회원가입</AppText>
          <View style={{alignSelf: "center", marginBottom: 15}}>
            <MaterialCommunityIcons name="account-circle-outline" color={colors.black} size={90}/>
          </View>
          <View style={styles.form}>
            <ErrorMessage error={error} visible={registerFailed} />
            <Form
              initialValues={{
                name: "",
                phone: "",
                address: "",
                password: "",
                isAdmin: false,
                notification: true
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <FormField name="name" placeholder="성함 입력" bottomline textInputStyle={{marginBottom: 3, fontSize: 16}} linecolor={colors.darkwood} borderColor={colors.wood}></FormField>
              <FormField name="phone" placeholder="전화번호 (-)없이 숫자만 입력" autoCorrect={false} keyboardType="numeric" bottomline textInputStyle={{marginBottom: 3, fontSize: 16}} linecolor={colors.darkwood} borderColor={colors.wood}></FormField>
              <FormField name="address" placeholder="주소 입력" bottomline textInputStyle={{marginBottom: 3, fontSize: 16}} linecolor={colors.darkwood} borderColor={colors.wood}></FormField>
              <AppText style={{color: "red", fontSize: 14, marginBottom: "15%"}}>⚠ 여기에 작성하신 전화번호와 주소로 연락과 배송이 되기 때문에 정확히 기재해주시길 바랍니다.</AppText>
              <FormField
                name="password"
                bottomline
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                placeholder="비밀번호 입력"
                textContentType="password"
                textInputStyle={{marginBottom: 4, fontSize: 16}}
                linecolor={colors.darkwood}
                borderColor={colors.wood}
              ></FormField>
              <View style={{marginTop: "17%"}}>
                <SubmitButton title="가입 완료" color="darkwood" textColor="white" height={50} borderRadius={12}/>
              </View>
            </Form>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "10%",
    padding: 10,
    margin: 12,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: "5%"
  },  
});

export default RegisterScreen;
