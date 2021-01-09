import React, { useState, useLayoutEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";


import usersApi from "../api/users";
import useApi from "../hooks/useApi";
import authStorage from "../auth/storage";


function SetNotificationScreen({route}) {
  const user = route.params;
  const token = authStorage.getToken();
  const editUserApi = useApi(usersApi.editNotification);
  const [notification, setNotification] = useState(user.notification);

  const handleNotification = async() => {
    const response = await editUserApi.request(token, {...user, notification: !notification});
    setNotification(!notification);
  };

  return (
  <View style={styles.container}>
    <TouchableOpacity style={{marginHorizontal: 20}} onPress={handleNotification}>
        {notification? 
        <MaterialIcons name="notifications" size={80} />
        :
        <MaterialIcons name="notifications-off" size={80} />
        }
    </TouchableOpacity>
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1
  },
});

export default SetNotificationScreen;