import React from "react";
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";


import AppointmentsScreen from "../screens/AppointmentsScreen";
import AddAppointmentsScreen from "../screens/AddAppointmentsScreen";
import AppText from "../components/AppText";

const Stack = createStackNavigator();
const AppointmentsNavigator = () => (
  <Stack.Navigator
    mode="modal"
    screenOptions={{
      headerShown: true,
    }}
  >
    <Stack.Screen 
      name="Appointments" 
      component={AppointmentsScreen} 
      options={{
        headerLeft: () => (
          <TouchableOpacity style={{marginHorizontal: 20}}>
           <MaterialIcons name="notifications" size={25} />
          </TouchableOpacity>
        ),
        headerTitle: () => (<AppText style={{alignSelf: "center", fontWeight: "bold", fontSize: 16}}>예약</AppText>),
        headerRight: () => (
          <TouchableOpacity style={{marginHorizontal: 20}}>
            <MaterialCommunityIcons name="refresh" size={25} />
          </TouchableOpacity>
        )
      }}
    />
    <Stack.Screen name="AddAppointments" component={AddAppointmentsScreen} />
  </Stack.Navigator>
);

export default AppointmentsNavigator;
