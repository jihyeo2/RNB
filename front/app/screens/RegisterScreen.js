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
import authApi from "../api/auth";
import ActivityIndicator from "../components/ActivityIndicator";
import useApi from "../hooks/useApi";
import AppText from "../components/AppText";
import colors from "../config/colors";


function RegisterScreen(props) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(3).max(50).label("성함"),
    phone: Yup.string().required().min(1).max(20).label("전화번호"),
    address: Yup.string().required().min(1).max(500).label("주소"),
    password: Yup.string().required().min(5).max(1024).label("비밀번호"),
  });
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();
  const [registerFailed, setRegisterFailed] = useState(false);

  const handleSubmit = async (userInfo) => {
    console.log("RegisterScreen: ", userInfo);
    const result = await registerApi.request(userInfo);

    console.log("RegisterScreen: ", result);

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
                isAdmin: false
              }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              <FormField name="name" placeholder="성함 입력" bottomline textInputStyle={{marginBottom: 3, fontSize: 16}} linecolor={colors.darkwood} borderColor={colors.wood}></FormField>
              <FormField name="phone" placeholder="전화번호 입력" autoCorrect={false} keyboardType="numeric" bottomline textInputStyle={{marginBottom: 3, fontSize: 16}} linecolor={colors.darkwood} borderColor={colors.wood}></FormField>
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
