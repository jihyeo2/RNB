import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ViewOrdersScreen from "../screens/ViewOrdersScreen";
import AccountNavigator from "./AccountNavigator";
import useNotifications from "../hooks/useNotifications";
import ViewAppointmentsScreen from "../screens/ViewAppointmentsScreen";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  useNotifications();

  return (
    <Tab.Navigator>
        <Tab.Screen
        name="주문 내역"
        component={ViewOrdersScreen}
        options={{
            tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="store" size={size} color={color} />
            ),
        }}
        />
        <Tab.Screen
        name="Account"
        component={AccountNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="account-circle" size={size + 3} color={color} />
          )}
        }
        />
        <Tab.Screen
        name="Appointments"
        component={ViewAppointmentsScreen}
        options={{
            tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="calendar-multiselect" size={size} color={color} />
            ),
            }}
        />
    </Tab.Navigator>
  );
};
export default AdminNavigator;
