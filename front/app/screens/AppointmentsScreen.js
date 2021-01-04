import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import Icon from "../components/Icon";
import colors from "../config/colors";

function AppointmentsScreen({navigation}) {
  return (
  <Screen style={styles.container}>
    <Image style={{height: 300, width: 300, alignSelf: "center"}} source={require("../assets/dino.jpg")}/>
    <AppText style={{fontSize: 40, alignSelf: "center"}}>Coming Soon...</AppText>
      <TouchableOpacity
            style={styles.edit}
            // onPress={() => navigation.navigate(routes.ADDAPPOINTMENTS)}
          >
            <Icon
              name="plus"
              size={60}
              backgroundColor={colors.secondary}
            />
          </TouchableOpacity>
  </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      alignSelf: "center"
  },
  edit: {
    position: "absolute",
    right: "5%",
    bottom: "5%",
    zIndex: 1,
  },
});

export default AppointmentsScreen;