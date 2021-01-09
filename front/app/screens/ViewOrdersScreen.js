import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

import Screen from "../components/Screen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ActivityIndicator from "../components/ActivityIndicator";
import useApi from "../hooks/useApi";
import ordersApi from "../api/orders";
import OrderNote from "../components/OrderNote";
import authStorage from "../auth/storage";
import Searchbox from "../components/Searchbox";

function ViewOrdersScreen(props) {
  const isVisible = useIsFocused();
  const [search, setSearch] = useState(false);
  const h = search? "17%" : "5%";
  

  const token = authStorage.getToken();
  const getOrdersApi = useApi(ordersApi.getOrders);
  const filteredOrdersApi = useApi(ordersApi.search);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  let fdata = [];

  const loadData = async() => {
    const {data} = await getOrdersApi.request(token);
    console.log("VOscreen: ", data);
    setData(data);
    setLoading(false);
  };

  useEffect (() => {
    loadData();
  }, [isVisible]);

  const handlePress = () => {
    loadData();
  };

  const onChange = async (filter) => {
    const response = await filteredOrdersApi.request(token, filter);
    fdata = filteredOrdersApi.data;
  };

  return (
    <Screen>
      <ActivityIndicator visible={getOrdersApi.loading}/>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            setSearch(!search);
            // const response = await filteredOrdersApi.request(token, {num: 0, value: ""});
          }}>
              <FontAwesome
                name="search"
                size={20}
              />
        </TouchableOpacity>
        <AppText style={styles.title}>주문</AppText>
        <TouchableOpacity onPress={handlePress}>
          <MaterialCommunityIcons name="refresh" size={25} />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: colors.wood, flex: 1}}>
        <View style={[styles.container, {paddingBottom: h}]}>
          {search ? <Searchbox onChangeFilter={onChange}/> : null}
          {search ? (
              <ScrollView >
                {filteredOrdersApi.data.map(order => 
                  {return (<OrderNote 
                            order={order}
                            onPress={handlePress}
                            />)})}
              </ScrollView>
            ) : (
              <ScrollView >
                {!loading && data.length != 0 && data.map(order => 
                  {return (<OrderNote 
                            order={order}
                            onPress={handlePress}
                            />)})}
              </ScrollView>
          )}
          {!loading && data.length != 0? null :
          <View style={styles.empty}>
            <AppText style={{ color: colors.medium, alignSelf: "center" }}>
            주문내역이 없습니다.
            </AppText>  
          </View>
          }
        </View>
    </View>
  </Screen>
  );
}
const styles = StyleSheet.create({
    header: {
      flexDirection: "row", 
      justifyContent: "space-between", 
      alignItems: "center",
      paddingHorizontal: 20,
    },
    container: {
      backgroundColor: colors.wood,
      justifyContent: "center"
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 10,
      alignSelf: "center", 
    },
    edit: {
      position: "absolute",
      right: "2%",
      bottom: "2%",
      zIndex: 1,
    },
    empty: {
      alignSelf: "center",
      position: "absolute",
      top: "50%",
      zIndex: 1
    }
  });

export default ViewOrdersScreen;
