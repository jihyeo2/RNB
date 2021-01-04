import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Alert, Switch } from 'react-native';
import Clipboard from 'expo-clipboard';
import { MaterialCommunityIcons } from "@expo/vector-icons";


import colors from "../config/colors";
import AppText from "./AppText";
import useApi from '../hooks/useApi';
import ordersApi from "../api/orders";
import authStorage from "../auth/storage";
import Icon from "./Icon";
import AppButton from './AppButton';

function OrderNote({order, onPress}) {
  const time = order.timestamp;
  const items = order.items;
  const name = order.customer.name;
  const phone = order.customer.phone;
  const address = order.customer.address;
  const method = order.method;

  const [touched, setTouched] = useState(false);
  const h = (items.length > 2 && touched) ? 160 + (items.length - 2) * 20: 170;
  const data = (items.length < 3 || ((items.length > 2)&& touched)) ? items: [items[0], items[1]];
  
  var date = new Date(time);
  var timestamp = "" + date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate() + " "+ date.getHours()+":"+date.getMinutes();

  const deleteOrdersApi = useApi(ordersApi.remove);
  const updateOrdersApi = useApi(ordersApi.edit);
  const authToken = authStorage.getToken();
  
  const handleCancel = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this store?",
      [
        {
          text: "Yes",
          onPress: async () => {
            const reponse = await deleteOrdersApi.request(authToken, order._id);
            onPress();
          },
        },
        { text: "No" },
      ],
      { cancelable: true, onDismiss: () => {} }
      );
    };

  const [confirmed, setConfirmed] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {handleUpdate()}, [confirmed, delivered]);


  const handleUpdate = async() => {
    if (delivered && !confirmed) {
      setDelivered(false);
      Alert.alert(
        "Warning",
        "You cannot toggle the delivery button before confirming the order",
        [
          { text: "OK" },
        ],
        { cancelable: true, onDismiss: () => {} }
        );
    } else {
      let status = "승인대기";
      if (delivered && confirmed) {
        status = "픽업/ 배달 가능";
        setDisabled(true);
      } else if (confirmed) {
        status = "확인완료";
      } else {
        status = "승인대기";
      }
      const response = await updateOrdersApi.request(authToken, {...order, status: status});
      onPress();
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
            <View>
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
              <AppText style={{fontSize: 12, color: colors.medium, marginBottom: 10 }}>주소: {address}</AppText>
              <View>
                <FlatList 
                  data = {data}
                  keyExtractor = {(item) => item.name}
                  numColumns={1}
                  renderItem={({item}) => (
                  <AppText style={{fontSize: 14}}>{item.label} {item.count}개</AppText>
                  )}
                />
              </View>
            </View>
            <View style={{alignItems: "flex-end", justifyContent: "center"}}>
              <View style={{flexDirection: "row", marginVertical: 8}}>
                <AppText style={{fontSize: 11}}>확인</AppText>
                <Switch
                  trackColor={{ false: colors.grey, true: colors.lightred }}
                  thumbColor={confirmed ? colors.red : colors.white}
                  ios_backgroundColor={colors.grey}
                  onValueChange={setConfirmed}
                  value={confirmed}
                  disabled = {disabled}
                />
              </View>
              <View style={{flexDirection: "row", marginVertical: 8}}>
                <AppText style={{fontSize: 11}}>픽업/ 배달 가능</AppText>
                <Switch
                  trackColor={{ false: colors.grey, true: colors.lightblue }}
                  thumbColor={delivered ? colors.blue : colors.white}
                  ios_backgroundColor={colors.grey}
                  onValueChange={setDelivered}
                  value={delivered}
                  disabled = {disabled}
                />
              </View>
              <AppButton title="삭제" fontSize={15} width={68} height={30} borderRadius={5} color="darkwood" textColor="white" onPress={handleCancel}/>
            </View>
          </View>
          <View style={{alignSelf: "center"}}>
            {items.length > 2 && !touched ? 
            <MaterialCommunityIcons name="chevron-down" size={25}/>
            : null}
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