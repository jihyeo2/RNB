import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { useFormikContext } from "formik";

import AppButton from "./AppButton";

function TwoButtons(props) {
  const { setFieldValue } = useFormikContext();
  const [state, setState] = useState(0);


  return (
    <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 6}}>
      <AppButton 
        title="픽업" 
        width={170} 
        borderRadius={5} 
        color= {(state == 1)? "wood": "white"} 
        borderColor="wood" 
        textColor={(state == 1)? "white" : "black"} 
        onPress={()=>{
            setFieldValue("method", "픽업" );
            setState(1);
        }}
      />
      <AppButton 
        title="배달" 
        width={170} 
        borderRadius={5} 
        color= {(state == 2)? "wood": "white"} 
        borderColor="wood" 
        textColor={(state == 2)? "white" : "black"} 
        onPress={()=>{
            setFieldValue("method", "배달" );
            setState(2);
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default TwoButtons;