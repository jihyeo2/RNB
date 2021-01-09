import React, {useEffect, useRef, useState} from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import rootNavigation from "../navigation/rootNavigation";
import routes from "../navigation/routes";


import Order from "./Order";
import ErrorMessage from "./forms/ErrorMessage";
import AppText from "./AppText";
import CachedOrder from "../components/CachedOrder";
import colors from "../config/colors";

function OrderList({ name, onInitial }) {
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const orders = values[name];
  const scrollView = useRef();

  const handleAdd = (order) => {
    if (orders) {
      setFieldValue(name, [...orders, order]);
    } else {
      setFieldValue(name, [order]);
    }
  };

  const handleRemove = (order) => {
      setFieldValue(
        name,
        orders.filter((orderItem) => orderItem !== order)
      );
  };



  return (
    <>
      <ScrollView
      >
        <Order onChangeOrder={(order) => handleAdd(order)} />
        <View>
          <View style={{backgroundColor: colors.white, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 5}}>
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={colors.black} /> 
            <AppText style={styles.title}>리스트</AppText>
          </View>
          <View style={{paddingHorizontal: 15, paddingVertical: 5, height: 185}}>
            <ScrollView 
              ref={scrollView} 
              onContentSizeChange={() => scrollView.current.scrollToEnd()}
            >
              {orders && orders.map((order) => (
                <>
                  <View key={order._id}>
                  <CachedOrder
                      key={order._id}
                      order={order}
                      onChangeOrder={() => handleRemove(order)}
                  />
                  </View>
                </>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>      
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

const styles = StyleSheet.create({
    title: {
      fontSize: 13,
      fontWeight: "bold",
      margin: 10
    },
})

export default OrderList;


