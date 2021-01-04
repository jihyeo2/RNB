import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ShoppingScreen from "../screens/ShoppingScreen";
import SearchResultsScreen from "../screens/SearchResultsScreen";
import CategoryShoppingScreen from "../screens/CategoryShoppingScreen";
import StoreMainScreen from "../screens/StoreMainScreen";
import SearchItemContext from "../components/SearchItemContext";
import AppointmentsScreen from "../screens/AppointmentsScreen";

function ShopNavigator() {
  const [searchItem, setSearchItem] = useState();

  const Stack = createStackNavigator();
  return (
    <SearchItemContext.Provider value={{ searchItem, setSearchItem }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="CategoryShopping" component={AppointmentsScreen} />
      </Stack.Navigator>
    </SearchItemContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

export default ShopNavigator;
