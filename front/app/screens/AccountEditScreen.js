import React, { useEffect, useState, useLayoutEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, InteractionManager } from "react-native";
import * as Yup from "yup";
import {MaterialCommunityIcons} from "@expo/vector-icons";

import Screen from "../components/Screen";
import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton 
} from "../components/forms";

import userApi from "../api/users";
import useApi from "../hooks/useApi";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import authStorage from "../auth/storage";
import colors from "../config/colors";
// import UploadScreen from "./UploadScreen";


function AccountEditScreen({ navigation, route }) {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(3).max(50).label("Name"),
    phone: Yup.string().required().min(1).max(20).label("Phone Number"),
    address: Yup.string().required().min(1).max(500).label("Address"),
    currentPassword: Yup.string()
      .required()
      .min(5)
      .max(1024)
      .label("Current Password"),
    password: Yup.string().required().min(5).max(1024).label("New Password"),
  });

  const user = route.params;
  let token = null;
  const editUserApi = useApi(userApi.edit);
  // const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState();

  useEffect(() => {
    token = authStorage.getToken();
  }, []);

  const handleSubmit = async (userInfo, {resetForm}) => {

    console.log(userInfo);
    const result = await editUserApi.request(token, {...userInfo, isAdmin: user.isAdmin}, (progress) =>
      setProgress(progress)
    );

    console.log(result);
    if (!result.ok) {
      // setUploadVisible(false);
      return alert("프로필을 정상적으로 변경할 수 없습니다. 현 비밀번호를 정확히 입력하셨나 부탁드립니다.");
    }
    resetForm();
    navigation.navigate(routes.MYACCOUNT);
  };

  return (
    <Screen style={styles.container}>
      {/* <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      /> */}
      <ScrollView style={{paddingHorizontal: 15, marginTop: "5%"}}>
        <Form
          initialValues={{
            name: user.name,
            phone: user.phone,
            address: user.address,
            currentPassword: "",
            password: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View>
            <AppText style={styles.title}>프로필 수정</AppText>
            <AppText style={{fontSize: 13, color: colors.darkwood, fontWeight: "bold"}}>성함</AppText>
            <FormField name="name" bottomline textInputStyle={{marginBottom: 2, fontSize: 16}} linecolor={colors.darkwood}></FormField>
            <AppText style={{fontSize: 13, marginTop: 5, color: colors.darkwood, fontWeight: "bold"}}>전화번호</AppText>
            <FormField name="phone" bottomline textInputStyle={{marginBottom: 2, fontSize: 16}} linecolor={colors.darkwood}></FormField>
            <AppText style={{fontSize: 13, marginTop: 5, color: colors.darkwood, fontWeight: "bold"}}>주소</AppText>
            <FormField name="address" bottomline textInputStyle={{marginBottom: 2, fontSize: 16}} linecolor={colors.darkwood}></FormField>
          </View>

          <AppText style={{fontSize: 13, marginTop: 5, color: colors.darkwood, fontWeight: "bold"}}>비밀번호</AppText>
          <View style={styles.vertical}>
            <FormField
              bottomline
              name="currentPassword"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              placeholder="현재 비밀번호"
              textContentType="password"
              textInputStyle={{marginBottom: 1, fontSize: 16}}
              linecolor={colors.darkwood}
            ></FormField>
            <FormField
              bottomline
              name="password"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              placeholder="새 비밀번호"
              textContentType="password"
              textInputStyle={{marginBottom: 3, fontSize: 16}}
              linecolor={colors.darkwood}
            ></FormField>
            <AppText style={{color: colors.red, fontSize: 12}}>⚠ 비밀번호를 변경하고 싶지 않으시면 새 비밀번호 칸에 현재의 비밀번호를 다시 한번 입력해주세요.</AppText>
          </View>
          <SubmitButton title="수정 완료" color="darkwood" textColor="white" height={50} borderRadius={12}/>
        </Form>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  }, 
  images: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  vertical: {
    flex: 1,
    flexDirection: "column",
    marginBottom: "5%"
  },
  button: {
    width: "40%"
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: "7%"
  },  
});

export default AccountEditScreen;
