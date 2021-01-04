import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import Customernote from "./Customernote";

function FlatNotes({orders}) {
    console.log("flatnotes", orders);

  return (
    //   <FlatList
    //     data={orders}
    //     keyExtractor={(order) => order._id.toString()}
    //     renderItem={({order}) => (<Customernote id={order._id} time={order.timestamp} status={order.status} items={order.items}/>)}
    //     ItemSeparatorComponent
    //   />
    <View>
        {orders.map(order => {return (<Customernote id={order._id} time={order.timestamp} status={order.status} items={order.items}/>)})}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default FlatNotes;
