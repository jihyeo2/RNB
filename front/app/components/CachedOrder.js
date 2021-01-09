import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import colors from '../config/colors';
import { MaterialCommunityIcons } from "@expo/vector-icons";


import AppText from "./AppText";

function CachedOrder({order, onChangeOrder}) {
  return (
  <View style={styles.container}>
      <AppText style={styles.label} numberOfLines={1}>{order.label}</AppText>
      <AppText style={styles.count}>{order.count}개</AppText>
      <TouchableHighlight style={styles.button} onPress={onChangeOrder}>
        <MaterialCommunityIcons name="close-box" size={30} color={colors.wood} /> 
      </TouchableHighlight>
  </View>
    );
}
const styles = StyleSheet.create({
  container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 5,
      borderRadius: 5,
      borderColor: colors.wood,
      borderWidth: 1,
      padding: 10,
      backgroundColor: colors.white
  },
  label: {
    fontSize: 15,
    width: "60%"
  },
  count: {
    position: "absolute",
    right: "30%",
    fontSize: 15
  },
  button: {
      position: "absolute",
      right: "1%",
  }
});

export default CachedOrder;