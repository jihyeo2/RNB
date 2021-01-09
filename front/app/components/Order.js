import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import * as Yup from 'yup';

import {
    AppForm as Form,
    SubmitButton,
  } from "../components/forms";
import OrderPicker from "./OrderPicker";
import colors from "../config/colors";


function Order({onChangeOrder}) {
  const [inc, setInc] = useState(0);
  
  const validationSchema = Yup.object().shape({
    label: Yup.string().required(),
    count: Yup.number().required().min(1).max(10)
  });
  
  const handleAdd = async (order, { resetForm }) => {
    if (order.label != "물품을 골라주세요") {
      onChangeOrder(order);
      resetForm();
      setInc(inc+1);
    }  
};

  return (
  <>
    <Form
        initialValues={{
            label: "물품을 골라주세요",
            count: 0
        }}
        onSubmit={handleAdd}
        validationSchema={validationSchema}
    >
      <OrderPicker inc={inc}/>
      <View style={styles.add}>
        <SubmitButton title="담기" fontSize={14} color="darkwood" borderRadius={5} height={25} textColor="white"/>
      </View>
    </Form>
  </>
  );
}
const styles = StyleSheet.create({
  add: {
    alignSelf: "center",
    marginBottom: 10
  }
});

export default Order;