import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import InputSpinner from "react-native-input-spinner";
import { useFormikContext } from "formik";

import colors from "../config/colors";
import AppTextInput from "../components/AppTextInput";

const labels = ["물품을 골라주세요", "생식", "믹스", "개별포장", "프로폴리스", "솔순효소", "와송효소", "소화제", "크리스탈", "기타"];

function OrderPicker({inc}) {
  const [others, setOthers] = useState(false);
  const [change, setChange] = useState(0);
  const [val, setVal] = useState("select");
  const { setFieldValue, values } = useFormikContext();

  if (change != inc) {
    setOthers(false);
    setChange(change+1);
  }

  return (
    <>
    <View style={styles.container}>
      <View style={styles.picker}>
        <Picker
          selectedValue={val}
          style={styles.box}
          mode='dropdown'
          onValueChange={(itemValue, itemIndex) => {
            if (itemIndex == 9) {
              setVal(itemValue);
              setOthers(true);
            } else if (itemIndex > 0) {
              setOthers(false);
              setVal(itemValue);
              setFieldValue("label", labels[itemIndex]);
          }
        }}>
          <Picker.Item label={labels[0]} value="select" />
          <Picker.Item label={labels[1]} value="powder" />
          <Picker.Item label={labels[2]} value="mix" />
          <Picker.Item label={labels[3]} value="dailypacket" />
          <Picker.Item label={labels[4]} value="propolis" />
          <Picker.Item label={labels[5]} value="senz" />
          <Picker.Item label={labels[6]} value="yenz" />
          <Picker.Item label={labels[7]} value="dizaid" />
          <Picker.Item label={labels[8]} value="crystal" />
          <Picker.Item label={labels[9]} value="others" />
        </Picker>
      </View>
      <InputSpinner 
        max={10}
        min={0}
        step={1}
        height={40}
        width={120}
        showBorder
        background={colors.white}
        rounded = {false}
        color={colors.wood}
        value={values["count"]}
        onChange={(number) => {
          setFieldValue("count", number);
        }}
      />
    </View>
    {others ? 
    <AppTextInput 
      width={213} 
      textInputStyle={{height: 40}}
      borderRadius={5}
      borderColor={colors.wood}
      InputStyle={{paddingLeft: 5, height: 40, marginLeft: "7%", marginBottom: 15, marginTop: -20, backgroundColor: colors.wood}}
      onChangeText={(text) => {
       setFieldValue("label", text);
      }}
      />
      : 
      null}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 20,
    justifyContent: "space-evenly",
  },
  picker: {
    borderWidth: 1, 
    borderColor: colors.wood, 
    borderRadius: 5, 
    height: 40, 
    width: 215, 
    justifyContent: 'center', 
    backgroundColor: colors.white}
});

export default OrderPicker;