import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import OrdersNavigator from "./OrdersNavigator";
import AppointmentsNavigator from "./AppointmentsNavigator";
import AccountNavigator from "./AccountNavigator";
import useNotifications from "../hooks/useNotifications";

const Tab = createBottomTabNavigator();
const CustomerNavigator = () => {
  useNotifications();

  return (
    <Tab.Navigator
      tabBarOptions={{style: {height: 55, }}}
    >
        <Tab.Screen
        name="주문"
        component={OrdersNavigator}
        options={{
            tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="store" size={size} color={color} />
            ),
          }
          }
        />
        <Tab.Screen
        name="프로필"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="account-circle" size={size + 3} color={color} />
          )}
        }
        />
        <Tab.Screen
        name="예약"
        component={AppointmentsNavigator}
        options={{
            tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="calendar-multiselect" size={size} color={color} />
            ),
            }}
        />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
