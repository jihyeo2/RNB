import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import AppText from "../components/AppText";
import Icon from "../components/Icon";
import colors from "../config/colors";
import routes from "../navigation/routes";
import ActivityIndicator from "../components/ActivityIndicator";
import useApi from "../hooks/useApi";
import ordersApi from "../api/orders";
import usersApi from "../api/users";
import authStorage from "../auth/storage";
import Customernote from "../components/Customernote";

function OrdersScreen({navigation}) {

  const [notification, setNotification] = useState(true);
  
  useLayoutEffect(() => {
    loadHeader();
  }, [notification]);

  const loadHeader = () => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={{marginHorizontal: 20}} onPress={() => {
          setNotification(!notification);
        }}>
         {notification? 
            <MaterialIcons name="notifications" size={25} />
          :
            <MaterialIcons name="notifications-off" size={25} />
          }
        </TouchableOpacity>
      ),
      headerTitle: () => (<AppText style={{alignSelf: "center", fontWeight: "bold", fontSize: 16}}>주문</AppText>),
      headerRight: () => (
        <TouchableOpacity style={{marginHorizontal: 20}} onPress={handlePress}>
          <MaterialCommunityIcons name="refresh" size={25} />
        </TouchableOpacity>
      )
    });
  };



  const isVisible = useIsFocused();
  const [data, setData] = useState([]);

  const token = authStorage.getToken();
  const getUserApi = useApi(usersApi.show);
  const getOrdersApi = useApi(ordersApi.getByCustomer);

  const loadData = async() => {
    const {data} = await getOrdersApi.request(token);
    setData(data);
  };

  useEffect (() => {
    loadData();
  }, [isVisible]);


  const handlePress = () => {
    loadData();
  };

  return (
    <>
    <ActivityIndicator visible={getOrdersApi.loading}/>
    <View style={styles.container}>
      {(data.length != 0) ? (
          <ScrollView>
            {data.map(order => 
              {return (<Customernote 
                        id={order._id} 
                        time={order.timestamp} 
                        status={order.status} 
                        method={order.method}
                        items={order.items}
                        onPress={handlePress}
                        />)})}
          </ScrollView>
        ) : (
        <AppText style={{ color: colors.medium, alignSelf: "center" }}>
          No orders yet!
        </AppText>     
      )}
    </View>
    <TouchableOpacity
          style={styles.edit}
          onPress={() => navigation.navigate(routes.ADDORDERS)}
        >
          <Icon
            name="plus"
            size={60}
            backgroundColor={colors.primary}
          />
    </TouchableOpacity>
  </>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.wood,
      paddingBottom: "5%",
      justifyContent: "center",
      flex: 1
    },
    edit: {
      position: "absolute",
      right: "3%",
      bottom: "2%",
      zIndex: 1,
      },

  });

export default OrdersScreen;
