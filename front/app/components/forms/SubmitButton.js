import React from "react";
import { TouchableOpacity } from "react-native";
import { useFormikContext } from "formik";

import Icon from "../Icon";
import AppButton from "../AppButton";

function SubmitButton({ title, color, textColor, type = "button", width, height, fontSize, borderRadius }) {
  const { handleSubmit } = useFormikContext();

  return ((type == "button") ? 
    <AppButton title={title} onPress={handleSubmit} textColor={textColor} height={height} fontSize={fontSize} borderRadius={borderRadius} color={color} width={width}/> 
    : <TouchableOpacity onPress={handleSubmit}>
        <Icon name={title} backgroundColor={color}/>
      </TouchableOpacity>);
}

export default SubmitButton;
