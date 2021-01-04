import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import OrdersScreen from "../screens/OrdersScreen";
import AddOrdersScreen from "../screens/AddOrdersScreen";
import AppText from "../components/AppText";


const Stack = createStackNavigator();
const OrdersNavigator = () => (
  <Stack.Navigator
    mode="modal"
  >
    <Stack.Screen 
      name="Orders" 
      component={OrdersScreen} 
    />
    <Stack.Screen 
      name="AddOrders" 
      component={AddOrdersScreen} 
      options={{
        headerTitle: () => (<AppText style={{marginLeft: "31%", fontWeight: "bold", fontSize: 16}}>주문하기</AppText>),
      }}
    />
  </Stack.Navigator>
);

export default OrdersNavigator;
