import React, { useState, useRef, useEffect } from "react";
import {Text, View, Button, Platform} from 'react-native';
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import expoPushTokensApi from "../api/expoPushTokens";
import useApi from "./useApi";
import authStorage from "../auth/storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const useNotifications = () => {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const pushTokenApi = useApi(expoPushTokensApi.register);
  
  useEffect(() => {
    registerforPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

  }, []);

  const registerforPushNotifications = async () => {
    console.log("registered for noticiations");
    try {
    //   const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   if (!permission.granted) return;
    //   console.log("yes permission");
    //   const token = await Notifications.getExpoPushTokenAsync();
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      console.log("token ", token);

      const authToken = authStorage.getToken();
      const response = await pushTokenApi.request(token, authToken);
      console.log("expopushtoken registeresd", response.data);
    } catch (error) {
      console.log("Error getting a push token", token);
    }
  };
};

export default useNotifications;
