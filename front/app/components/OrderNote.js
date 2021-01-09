import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Alert, Switch } from 'react-native';
import Clipboard from 'expo-clipboard';
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";


import colors from "../config/colors";
import AppText from "./AppText";
import useApi from '../hooks/useApi';
import ordersApi from "../api/orders";
import usersApi from "../api/users";
import authStorage from "../auth/storage";
import Icon from "./Icon";
import messagesApi from "../api/messages";
import AppButton from './AppButton';

function OrderNote({order, onPress}) {
  const isVisible = useIsFocused();
  console.log("os", order);


  const time = order.timestamp;
  const items = order.items;
  const name = order.customer.name;
  const phone = order.customer.phone;
  const address = order.customer.address;
  let status = order.status;
  const method = order.method;

  const [touched, setTouched] = useState(false);
  const h = (touched) ? 180 + (items.length) * 20: 170;
  const data = (items.length < 3 || ((items.length > 2)&& touched)) ? items: [items[0], items[1]];
  
  var date = new Date(time);
  var timestamp = "" + date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate() + " "+ date.getHours()+":"+date.getMinutes();

  const deleteOrdersApi = useApi(ordersApi.remove);
  const updateOrdersApi = useApi(ordersApi.edit);
  const myselfApi = useApi(usersApi.show);
  const ringApi = useApi(messagesApi.post);
  const authToken = authStorage.getToken();
  
  const handleCancel = () => {
    Alert.alert(
      "주문 삭제",
      "주문을 삭제하시겠습니까?",
      [
        {
          text: "네",
          onPress: async () => {
            const reponse = await deleteOrdersApi.request(authToken, order._id);
            const result = await ringApi.request({
              recipient: order.customer._id,
              message: {
              title: timestamp + "에 주문하신 건이",
              body: "관리자에 의해 삭제되었습니다."
            }});
            const { data } = await myselfApi.request(authToken);
            const result1 = await ringApi.request({
              recipient: "admin",
              message: {
                title: timestamp + "에 " + name + "님이 주문하신 건이",
                body: data.name + "에 의해 삭제되었습니다."
              }
            });
            onPress();
          },
        },
        { text: "아니오" },
      ],
      { cancelable: true, onDismiss: () => {} }
      );
    };

  const [confirmed, setConfirmed] = useState((status == "확인완료" && status != "승인대기") || (status == "픽업/ 배달 가능" && status != "승인대기"));
  const [delivered, setDelivered] = useState(status == "픽업/ 배달 가능" && status != "확인완료" && status != "승인대기");
  useEffect(() => {handleUpdate()}, [confirmed, delivered]);
  useEffect(() => {
    setConfirmed((status == "확인완료" && status != "승인대기") || (status == "픽업/ 배달 가능" && status != "승인대기"));
    setDelivered(status == "픽업/ 배달 가능" && status != "확인완료" && status != "승인대기");
  }, [isVisible]);
  console.log("ordernote: ", status, confirmed, delivered);



  const handleUpdate = async() => {
    if (delivered && !confirmed) {
      setDelivered(false);
      Alert.alert(
        "주의",
        "'확인완료'하시기 전에 '픽업가능/발송완료'할 수 없습니다.",
        [
          { text: "네" },
        ],
        { cancelable: true, onDismiss: () => {} }
        );
    } else {
      console.log("confirmed, deliverred: ", confirmed, delivered);
      let state = "";
      let body = "";
      if (delivered && confirmed) {
        state = "픽업/ 배달 가능";
        body = (method == "픽업")? "픽업가능합니다" : "발송완료되었습니다";
      } else if (!delivered && confirmed) {
        state = "확인완료";
        if (status == "승인대기") {
          body = "확인완료되었습니다";
        } else if (status == "픽업/ 배달 가능") {
          body = (method == "픽업")? "픽업이 아직 가능하지 않습니다." : "발송이 아직 완료되지 않았습니다.";
        }
      } else {
        state = "승인대기";
        body = (status == "확인완료")? "확인이 아직 완료되지 않았습니다." : "승인 대기 중입니다.";
      }
      if (state == status) {
        console.log(".");
      } else {
        console.log(state);
        const response = await updateOrdersApi.request(authToken, {...order, status: state});
        console.log(response);
        status = state;
        const result = await ringApi.request({
          recipient: order.customer._id,
          message: {
          title: timestamp + "에 주문하신 건이",
          body: body
        }});
        const { data } = await myselfApi.request(authToken);
        const result1 = await ringApi.request({
          recipient: "admin",
          message: {
            title: timestamp + "에 " + name + "님이 주문하신 건이",
            body: data.name + "에 의해 " + body
          }
        });
        onPress();
      }
    }
  };


  const onClick = () => {
    const info = "성함: " + name + "\n" + "전화번호: " + phone + "\n" + "주소: " + address;
    Clipboard.setString(info);
  };

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <AppText style={styles.date}>{timestamp}</AppText>
      <TouchableWithoutFeedback onPress={() => setTouched(!touched)}>
        <View style={[styles.listing, {height: h}]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
            <View style={{width: "58%"}}>
              <View style={styles.top}>
                <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                  <AppText style={{fontSize: 15, marginBottom: 3}}>{name}</AppText>
                  <TouchableOpacity onPress={onClick}>
                    <Icon name="content-copy" size={30} backgroundColor={colors.white} iconColor={colors.black}/>
                  </TouchableOpacity>
                  <AppText style={{fontSize: 15, marginBottom: 3}}>/ {method}</AppText>
                </View>
              </View>
              <AppText style={{fontSize: 12, color: colors.medium }}>전화번호: {phone}</AppText>
              <AppText style={{fontSize: 12, color: colors.medium, marginBottom: 10}}>주소: {address}</AppText>
            </View>
            <View style={{alignItems: "flex-end", justifyContent: "center"}}>
              <View style={{flexDirection: "row", marginVertical: 8}}>
                <AppText style={{fontSize: 11}}>확인완료</AppText>
                <Switch
                  trackColor={{ false: colors.grey, true: colors.lightred }}
                  thumbColor={confirmed ? colors.red : colors.white}
                  ios_backgroundColor={colors.grey}
                  onValueChange={setConfirmed}
                  value={confirmed}
                />
              </View>
              <View style={{flexDirection: "row", marginVertical: 8}}>
                {(method == "픽업") ? 
                  <AppText style={{fontSize: 11}}>픽업가능</AppText>
                  :
                  <AppText style={{fontSize: 11}}>발송완료</AppText>
                }
                <Switch
                  trackColor={{ false: colors.grey, true: colors.lightblue }}
                  thumbColor={delivered ? colors.blue : colors.white}
                  ios_backgroundColor={colors.grey}
                  onValueChange={setDelivered}
                  value={delivered}
                />
              </View>
              <AppButton title="삭제" fontSize={15} width={68} height={30} borderRadius={5} color="darkwood" textColor="white" onPress={handleCancel}/>
            </View>
          </View>
          <View style={{alignSelf: "center"}}>
            { !touched ? 
            <MaterialCommunityIcons name="chevron-down" size={25}/>
              : null }
          </View>
          <View>
          { touched? <FlatList 
                  data = {items}
                  keyExtractor = {(item) => item.name}
                  numColumns={1}
                  renderItem={({item}) => (
                  <AppText style={{fontSize: 14}}>{item.label} {item.count}개</AppText>
                  )}
                /> : null}
            </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: "88%",
    alignSelf: "center",
  },
  date: {
    alignSelf: "flex-end",
    fontSize: 15
  },
  listing: {
    backgroundColor: colors.white,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 150,
    marginTop: 5,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 5
  },
});

export default OrderNote;