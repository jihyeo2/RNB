import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import AppTextInput from "./AppTextInput";
import colors from "../config/colors";

function Searchbox({style, onChangeFilter}) {
  const [filter, setFilter] = useState("성함");
  const [text, setText] = useState("달력 보기");
  const [date, setDate] = useState(Date.now());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setText(currentDate.toString().substring(0,15));
    onChangeFilter({num: 2, timestamp: event.nativeEvent.timestamp});
  };

  const handlePress = (num, text) => {
    onChangeFilter({num: num, value: text});
  };

  return (
    <View style={[styles.container, style]}>
        <View style={styles.dropdown}>
          <Picker
          selectedValue={filter}
          mode="dropdown"
          onValueChange={(itemValue, itemIndex) => {
              setFilter(itemValue);
          }}
          >
              <Picker.Item label="성함" value="성함" />
              <Picker.Item label="번호" value="번호" />
              <Picker.Item label="날짜" value="날짜" />
          </Picker>
        </View>
        <View style={styles.separator}/>
        { filter == "성함" ? 
          <AppTextInput width="62%" borderColor={colors.wood} InputStyle={styles.box} textInputStyle={{height: 40, fontSize: 15}} onEndEditing={({nativeEvent: text})=>handlePress(0, text.text)}/> //onSubmitEditing={({nativeEvent: text})=>handlePress(0, text.text)}
          : null}
        { filter == "번호" ? 
          <AppTextInput width="62%" borderColor={colors.wood} InputStyle={styles.box} textInputStyle={{height: 40, fontSize: 15}} onEndEditing={({nativeEvent: text})=>handlePress(1, text.text)}/>
          : null}
        { filter == "날짜" ? 
          <View style={[styles.box, {width: "62%", justifyContent: "center", alignItems: "center"}]} >
              <Text onPress={() => setShow(true)}>{text}</Text>
              {show && 
              <DateTimePicker 
                  mode="date" 
                  value={date} 
                  testID="dateTimePicker"
                  display = "default"
                  onChange={onChange}
              /> }
              
          </View>
          : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
      backgroundColor: colors.wood,
      height: 50,
      padding: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderColor: colors.darkwood,
      borderWidth: 2,
  },
  dropdown: {
      width: "34%",
      backgroundColor: colors.wood,
      borderRadius: 5,
      height: 40,
      justifyContent: "center",
  },
  box: {
      backgroundColor: colors.wood,
      borderRadius: 5,
      height: 40,
      marginTop: 1,
      width: 260,
    },
  separator: {
    height: "100%",
    width: 2,
    backgroundColor: colors.darkwood,
    marginHorizontal: 7
  },
});

export default Searchbox;