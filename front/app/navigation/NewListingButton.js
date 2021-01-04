import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

function NewListingButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <MaterialCommunityIcons
          name="account"
          color={colors.white}
          size={30}
        />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    height: 75,
    borderColor: colors.white,
    borderWidth: 10,
    width: 75,
    bottom: 40,
    borderRadius: 40,
  },
});

export default NewListingButton;
