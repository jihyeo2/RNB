import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableWithoutFeedback, Alert, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "../components/AppText";
import useApi from '../hooks/useApi';
import ordersApi from "../api/orders";
import authStorage from "../auth/storage";
import MapProgress from "../components/MapProgress";
import messagesApi from "../api/messages";

function Customernote({order, items, time, status, method, id, onPress}) {
  const [touched, setTouched] = useState(false);
  const h = (touched) ? 170 + (items.length) * 20: 170;
  // const data = (items.length < 5 || ((items.length > 4)&& touched)) ? items: [items[0], items[1], items[2], items[3]];

  var date = new Date(time);
  var timestamp = "" + date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate() + " "+ date.getHours()+":"+date.getMinutes();
  let color = colors.grey;
  let step = 0;
  if (status == "승인대기") {
    color = colors.red;
  } else if (status == "확인완료") {
    step = 1;
  } else {
    step = 2;
  }
  const alternative = (method == "픽업")? "배달": "픽업으";


  const deleteOrdersApi = useApi(ordersApi.remove);
  const editOrdersApi = useApi(ordersApi.edit);
  const ringApi = useApi(messagesApi.post);
  const authToken = authStorage.getToken();

  const handleCancel = () => {
    if (status == "승인대기") {
      Alert.alert(
        "주문 취소",
        "주문을 취소하시겠습니까?",
        [
          {
            text: "네",
            onPress: async () => {
              const reponse = await deleteOrdersApi.request(authToken, id);
              const result = await ringApi.request({
                recipient: "admin",
                message: {
                title: order.customer.name + "님이",
                body: timestamp + "에 주문하신 내역을 취소하셨습니다."
              }});
              onPress();
            },
          },
          { text: "아니오" },
        ],
        { cancelable: true, onDismiss: () => {} }
      );
    }
  };

  const handleChange = () => {
    const new_order = {
      ...order,
      method: alternative.substring(0,2)
    }
    if (status != "픽업/ 배달 가능") {
      Alert.alert(
        "수령 방법 변경",
        alternative + "로 변경하시겠습니까?",
        [
          {
            text: "네",
            onPress: async () => {
              const response = await editOrdersApi.request(authToken, new_order);
              const result = await ringApi.request({
                recipient: "admin",
                message: {
                title: new_order.customer.name + "님이",
                body: alternative + "로 수령 방법을 수정하셨습니다."
              }});
              onPress();
            },
          },
          { text: "아니오" },
        ],
        { cancelable: true, onDismiss: () => {} }
      );
    }
  };

return (
  <View style={styles.container}>
    <AppText style={styles.date}>{timestamp}</AppText>
    <TouchableWithoutFeedback onPress={() => setTouched(!touched)}>
      <View style={[styles.listing, {height: h}]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          <View style={{width: "60%"}}>
            <AppText style={{fontSize: 16, marginBottom: 10, color: colors.darkwood}}>{method}</AppText>
            <MapProgress status={step} method={method}/>
          </View>
          <View style={{alignItems: "flex-end", height: 130, justifyContent: "space-between"}}>
            <View>
              <TouchableOpacity onPress={handleChange}>
                {(status != "픽업/ 배달 가능")? 
                  <View style={styles.button}>
                    <Text style={{fontSize: 12, color: colors.darkwood}}>{alternative}로 변경</Text>
                  </View>
                  : 
                  <View style={styles.cancelled}>
                    <Text style={{fontSize: 12, color: colors.white}}>{alternative}로 변경</Text>
                  </View>
                }

              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel}>
                {(status == "승인대기")? 
                  <View style={styles.button}>
                    <Text style={{fontSize: 12, color: colors.darkwood}}>취소하기</Text>
                  </View>
                  : 
                  <View style={styles.cancelled}>
                    <Text style={{fontSize: 12, color: colors.white}}>취소하기</Text>
                  </View>
                }

              </TouchableOpacity>
            </View>
          </View>
        </View>
        {touched? 
        <View>
              <FlatList 
                data = {items}
                keyExtractor = {(item) => item.name}
                numColumns={1}
                renderItem={({item}) => (
                  <AppText style={{fontSize: 14}}>{item.label} {item.count}개</AppText>
                )}
              />
        </View>
        : <View style={{alignSelf: "center"}}>
          <MaterialCommunityIcons name="chevron-down" size={25}/>
        </View>}
      </View>
    </TouchableWithoutFeedback>
  </View>
);
}
const styles = StyleSheet.create({
container: {
  width: "80%",
  alignSelf: "center",
  marginTop: 10,
},
date: {
  alignSelf: "flex-end",
  fontSize: 14
},
listing: {
  backgroundColor: colors.white,
  borderRadius: 5,
  paddingTop: 15,
  paddingHorizontal: 15,
  height: 150,
  marginTop: 5,
},
top: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center"
},
button: {
  backgroundColor: colors.white, 
  paddingHorizontal: 10, 
  paddingVertical: 5, 
  borderRadius: 5, 
  borderWidth: 1, 
  borderColor: colors.darkwood,
  marginBottom: 5,
  alignItems: "center",
  width: 108
},
cancelled: {
  backgroundColor: colors.grey,
  paddingHorizontal: 10, 
  paddingVertical: 5, 
  borderRadius: 5, 
  marginBottom: 5,
  alignItems: "center",
  width: 108
}
});

export default Customernote;