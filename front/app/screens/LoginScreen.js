import React, { useState } from "react";
import { Image, StyleSheet, View, ScrollView} from "react-native";
import * as Yup from "yup";

import {
  ErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import ordersApi from "../api/orders";
import routes from "../navigation/routes";
import colors from "../config/colors";
import AppText from "../components/AppText";

const validationSchema = Yup.object().shape({ 
  phone: Yup.string().label("전화번호 (-)없이 숫자만").test('isnumber', '전화번호는 9-11자리여야 합니다.', (value) => value && value.length > 8 && value.length < 12),
  password: Yup.string().label("비밀번호").test('ispassword', '비밀번호는 최소 6자리여야 합니다.', (value) => value && value.length > 5),
});

function LoginScreen({navigation}) {
  const auth = useAuth();
  const loginApi = useApi(authApi.login);
  const checkApi = useApi(ordersApi.getByCustomer);
  const check1Api = useApi(ordersApi.getOrders);

  const [error, setError] = useState();
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async ({ phone, password }) => {
    const result = await loginApi.request(phone, password);

    if (!result.ok) {
      if (result.data) {
        console.log(result.data.error);
        setError(result.data.error);
      } else {
        setError("An unexpected error occurred.");
        console.log(result);
      }
      setLoginFailed(true);
      return;
    }

    const response = await checkApi.request(result.data);
    const response1 = await check1Api.request(result.data);

    
    auth.logIn(result.data);
  };

  return (
    <View
    style={styles.background}
    >
      <ScrollView>
        <Image style={styles.logo} source={require("../assets/login.jpg")} />
        <AppText style={styles.text}>DANBI</AppText>
        <View style={styles.box}>
          <AppForm
            initialValues={{ phone: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <ErrorMessage
              error="전화번호 또는 비밀번호를 잘못 입력하셨습니다."
              visible={loginFailed}
            />
              <AppFormField
                textInputStyle={{
                  flex: 1,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                icon="phone"
                keyboardType="numeric"
                name="phone"
                placeholder="전화번호 (-)없이 숫자만"
              />
              <AppFormField
                textInputStyle={{
                  flex: 1,
                }}
                autoCapitalize="none"
                autoCorrect={false}
                icon="lock"
                name="password"
                placeholder="비밀번호"
                secureTextEntry
                textContentType="password"
              />
            <View style={{marginTop: "0%"}}>
              <SubmitButton title="로그인" color="white" textColor="black"/>
              <AppText style={{fontSize: 15, alignSelf: "center"}} onPress={() => navigation.navigate(routes.REGISTER)}>회원가입</AppText>
            </View>
          </AppForm>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 10,
    backgroundColor: "#e8f4e6"
  },
  text: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: "20%",
    alignSelf: "center",
    color: colors.black,
  },  
  logo: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginTop: "25%",
  },
  box: {
    width: "90%",
    alignSelf: "center"
  }
});

export default LoginScreen;
