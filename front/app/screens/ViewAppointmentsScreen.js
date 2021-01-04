import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import Screen from "../components/Screen";
import AppText from "../components/AppText";


function ViewAppointmentsScreen(props) {

  const isVisible = useIsFocused();
  const [notification, setNotification] = useState(true);

  useEffect (() => {

  }, [isVisible]);

  const handlePress = () => {
    loadData();
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
            setNotification(!notification);
          }}>
            {notification? 
              <MaterialIcons name="notifications" size={25} />
            :
              <MaterialIcons name="notifications-off" size={25} />
            }
        </TouchableOpacity>
        <AppText style={styles.title}>예약</AppText>
        <TouchableOpacity onPress={handlePress}>
          <MaterialCommunityIcons name="refresh" size={25} />
        </TouchableOpacity>
      </View>
      <Image style={{height: 300, width: 300, alignSelf: "center"}} source={require("../assets/dino.jpg")}/>
      <AppText style={{fontSize: 40, alignSelf: "center"}}>Coming Soon...</AppText>
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 100
  },
  container: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf: "center", 
  },
});

export default ViewAppointmentsScreen;