import React, {useState, useEffect} from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import * as Yup from "yup";
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";


import AppText from "../components/AppText";
import { AppForm as Form, SubmitButton} from "../components/forms";
import OrderList from "../components/OrderList";
import useApi from "../hooks/useApi";
import userInfoApi from "../api/users";
import routes from "../navigation/routes";
import authStorage from "../auth/storage";
import ordersApi from "../api/orders";
import messagesApi from "../api/messages";
import TwoButtons from "../components/TwoButtons";


function AddOrdersScreen({ navigation }) {
  const isVisible = useIsFocused(); 

  const validationSchema = Yup.object().shape({
    orders: Yup.array().min(1, "물품을 최소 한가지 입력해주세요."),
  });
  const addOrdersApi = useApi(ordersApi.add); 
  const ringApi = useApi(messagesApi.post);

  let userId = "";
  let userName = "";
  const authToken = authStorage.getToken();

  const fetchData = async() => {
    const { data } = await userInfoApi.show(authToken);
    userId = data._id.toString();
    userName = data.name;
  };

  useEffect(() => {
    fetchData();
  }, [isVisible]);

  const handleSubmit = async (listing, {resetForm}) => {
    console.log("addordersscreen: ", listing);
    if (listing.items.length == 0) {
      Alert.alert(
        "주의",
        "아무것도 리스트에 담지 않으셨습니다.",
        [
          { text: "OK" },
        ],
        { cancelable: true, onDismiss: () => {} }
        );
    } else {
      const response = await addOrdersApi.request(
        authToken,
        {
          customerId: userId,
          timestamp: Date.now(),
          status: "승인대기",
          method: listing.method,
          items: listing.items
        }
      );
      console.log(response);
      if (!response.ok) {
        return alert("주문이 실패했습니다.");
      }

      let string = "주문물품: ";      
      listing.items.forEach(item => string += (item.label +" "+ item.count+ "개, "));
      const result = await ringApi.request({
        title: userName + "님이 주문하셨습니다!",
        body: string.substring(0, string.length - 2),
      });
      resetForm();
      navigation.navigate(routes.ORDERS);
    }

  };

  return (
    <View style={{backgroundColor: colors.lightgrey, flex: 1}}>
      <View style={{backgroundColor: colors.white, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 5}}>
        <MaterialCommunityIcons name="cart" size={20} color={colors.black} /> 
        <AppText style={styles.title}>물품과 수량 선택</AppText>
      </View>
      <View>        
        <Form
          initialValues={{
            items: [],
            method: ""
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <OrderList name="items" />
          <View>
            <View style={{flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 5, backgroundColor: colors.white}}>
              <MaterialCommunityIcons name="truck-fast" size={20} color={colors.black} /> 
              <AppText style={styles.title}>수령 방법 선택</AppText>
            </View>
            <TwoButtons />
          </View>
          <View style={{paddingHorizontal: 10}}>
            <SubmitButton title="주문하기" color="darkwood" textColor="white" height={50} borderRadius={12}/>
          </View>
        </Form>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 13,
    fontWeight: "bold",
    margin: 10
},
  box: {
    height: 100,
    width: 300
  }
});

export default AddOrdersScreen;