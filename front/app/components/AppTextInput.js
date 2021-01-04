import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import defaultStyles from "../config/styles";
import SearchButton from "./forms/SearchButton";
import colors from "../config/colors";

function AppTextInput({
  searchButton,
  icon,
  width = "100%",
  InputStyle,
  textInputStyle,
  bottomline = false,
  linecolor = colors.black,
  borderColor = colors.white,
  borderRadius = 15,
  ...otherProps
}) {
  return (
    <View style={{marginTop: 10, marginBottom: 20}}>
      <View style={[styles.container, { width }, {borderColor}, {borderRadius}, InputStyle]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={25}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor={colors.medium}
          style={[defaultStyles.text, styles.text, textInputStyle]}
          {...otherProps}
        />
        {searchButton && <SearchButton />}
      </View>
      {bottomline && <View style={[styles.separator, {backgroundColor: linecolor}]}></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    borderWidth: 2,
    paddingVertical: 15,
    marginVertical: -10,
  },
  icon: {
    marginHorizontal: 10,
  },
  separator: {
    width: "100%",
    height: 1,
  },
  searchIcon: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  text: {
    flex: 1,
  },
});

export default AppTextInput;
