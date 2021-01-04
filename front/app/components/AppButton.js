import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  color = "primary",
  fontSize = 18,
  padding = 15,
  width,
  height,
  borderRadius = 15,
  textColor = "black",
  borderColor = color
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }, { borderColor: colors[borderColor] }, {width}, {borderRadius}, {height}, { padding }]}
      onPress={onPress}
      setOpacityTo={(10, 0.5)}
    >
      <Text style={[styles.text, {color: colors[textColor]}, { fontSize }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
  },
  text: {
    // textTransform: "uppercase",
    fontWeight: "300",
    letterSpacing: 1,
    textShadowColor: colors.black,
    // textShadowRadius: 2,
  },
});

export default AppButton;
