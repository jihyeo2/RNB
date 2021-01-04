import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableWithoutFeedback, Alert, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "../components/AppText";
import useApi from '../hooks/useApi';
import ordersApi from "../api/orders";
import authStorage from "../auth/storage";
import MapProgress from "../components/MapProgress";

function Customernote({items, time, status, method, id, onPress}) {
  const [touched, setTouched] = useState(false);
  const h = (items.length > 4 && touched) ? 160 + (items.length - 4) * 20: 170;
  const data = (items.length < 5 || ((items.length > 4)&& touched)) ? items: [items[0], items[1], items[2], items[3]];

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

  const deleteOrdersApi = useApi(ordersApi.remove);
  const authToken = authStorage.getToken();

  const handleCancel = () => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this store?",
      [
        {
          text: "Yes",
          onPress: async () => {
            if (status == "승인대기") {
              const reponse = await deleteOrdersApi.request(authToken, id);
              onPress();
            }
          },
        },
        { text: "No" },
      ],
      { cancelable: true, onDismiss: () => {} }
    );
  };

return (
  <View style={styles.container}>
    <AppText style={styles.date}>{timestamp}</AppText>
    <TouchableWithoutFeedback onPress={() => setTouched(!touched)}>
      <View style={[styles.listing, {height: h}]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
          <View>
            <AppText style={{fontSize: 16, marginBottom: 10, color: colors.darkwood}}>{method}</AppText>
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
          <View style={{alignItems: "flex-end", height: 130, justifyContent: "space-between"}}>
            <MapProgress status={step}/>
            <TouchableOpacity onPress={handleCancel}>
              <View style={styles.button}>
                <Text style={{fontSize: 12, color: colors.darkwood}}>취소하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{alignSelf: "center"}}>
          {items.length > 4 && !touched ? 
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
  width: "85%",
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
}
});

export default Customernote;