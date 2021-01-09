import React, { useContext, useState, useRef, useEffect } from "react";
import {Platform} from 'react-native';
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import expoPushTokensApi from "../api/expoPushTokens";
import useApi from "./useApi";
import authStorage from "../auth/storage";
import * as rootNavigation from "../navigation/rootNavigation";
import AuthContext from "../auth/context";
import routes from "../navigation/routes";


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
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    registerforPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification, " ", notification.request.content);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (user && user.isAdmin) {
        rootNavigation.navigate(routes.ORDERS);
      } else if (user && !user.isAdmin) {
        rootNavigation.navigate(routes.VIEWORDERS);
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };

  }, []);

  const registerforPushNotifications = async () => {
    if (Constants.isDevice) {
      try {
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
        const authToken = authStorage.getToken();
        const response = await pushTokenApi.request(token, authToken);

        console.log("final result: ", token, " & ", authToken);

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            priority: 'max',
            sound: true,
            lightColor: '#FF231F7C',
          });
          Notifications.setNotificationChannelAsync('off', {
            name: 'off',
            importance: Notifications.AndroidImportance.MAX,
            priority: 'max',
            sound: false,
            lightColor: '#FF231F7C',
          });
        }
      } catch (error) {
        console.log("Error getting a push token");
      }
    } 

  };
};

export default useNotifications;
