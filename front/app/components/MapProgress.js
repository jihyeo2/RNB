import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import colors from "../config/colors";

function MapProgress({status, method}) {
  return (
  <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: colors.lightgreen}]}/>
        <View style={[styles.line, {backgroundColor: (status == 1 || status == 2)? colors.lightgreen: colors.grey}]}/>
        <View style={[styles.dot, { backgroundColor: (status == 1 || status == 2)? colors.lightgreen: colors.grey}]}/>
        <View style={[styles.line, {backgroundColor: (status == 2)? colors.lightgreen: colors.grey}]}/>
        <View style={[styles.dot, { backgroundColor: (status == 2)? colors.lightgreen: colors.grey}]}/>
      </View>
      <View style={styles.right}>
          <Text style={[styles.text, { color: (status == 0)? colors.green: colors.grey}]}>승인대기</Text>
          <Text style={[styles.text, { color: (status == 1)? colors.green: colors.grey}]}>확인완료</Text>
          {(method == "픽업") ?
          <Text style={[styles.text, { color: (status == 2)? colors.green: colors.grey}]}>픽업가능</Text>
          :
          <Text style={[styles.text, { color: (status == 2)? colors.green: colors.grey}]}>발송완료</Text>                    
          }
      </View>
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
      flexDirection: "row",
      width: 120,
      justifyContent: "flex-start",
      marginBottom: 10,
  },
  left: {
    justifyContent: "flex-start",
    paddingVertical: 8,
    marginRight: 10
  },
  line: {
      height: 20,
      width: 2,
      marginLeft: 3,
      backgroundColor: colors.grey,
  },
  dot: {
      height: 8,
      width: 8,
      borderRadius: 4,
  },
  right: {
      justifyContent: "space-between",
      alignItems: "flex-end"
  },
  text: {
      fontSize: 11,
  }
});

export default MapProgress;