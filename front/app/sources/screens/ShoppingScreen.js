import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";

import categoriesApi from "../api/categories";
import useApi from "../hooks/useApi";
import AppText from "../components/AppText";
import Screen from "../components/Screen";

function ShoppingScreen({ navigation }) {
  const getListingsApi = useApi(categoriesApi.getCategories);

  useEffect(() => {
    async function fetchData() {
      const response = await getListingsApi.request();
    }
    fetchData();
  }, []);

  return (
    <Screen>
      <AppText> 주문 내역 조회 및 주문하기</AppText>
    </Screen>
  );
}

//want to make the list scrollable? already it is

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
    justifyContent: "center",
  },
});

export default ShoppingScreen;
