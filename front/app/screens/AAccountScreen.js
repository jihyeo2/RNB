import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image
} from "react-native";
import { useIsFocused } from "@react-navigation/native";


import Screen from "../components/Screen";
import ListItem from "../components/lists/ListItem";
import colors from "../config/colors";
import routes from "../navigation/routes";
import useApi from "../hooks/useApi";
import userApi from "../api/users";
import orderApi from "../api/orders";
import authStorage from "../auth/storage";
import AppText from "../components/AppText";
import useAuth from "../auth/useAuth";
import ListItemSeparator from "../components/lists/ListItemSeparator";


function AAccountScreen({ navigation }) {
  const isVisible = useIsFocused();
  const token = authStorage.getToken();
  const getUserApi = useApi(userApi.show);
  const getOrdersApi = useApi(orderApi.getOrders);
  const deleteUserApi = useApi(userApi.remove);
  const { logOut } = useAuth();

  const [status, setStatus] = useState("-");

  useEffect(() => {
    async function fetchData() {
      const response = await getUserApi.request(token);
      const { data } = await getOrdersApi.request(token);
      if (data.length == 0) {
        setStatus("-");
      } else {
        setStatus(data[0].customer.name + " 님");
      }
    }
    fetchData();
  }, [isVisible]);

  const handlePress = async () => {
    const response = deleteUserApi.request(token);
    logOut();
  };

  return (
    <Screen style={styles.screen}>
      <Image style={styles.header} source={require("../assets/plant7.jpg")} />
      <View style={styles.container}>
        <AppText style={styles.title}>DANBI</AppText>
        <AppText style={styles.subtitle}>Love Nature, Study Nature.</AppText>
        <View style={styles.blackboard}>
          <AppText style={{ fontSize: 17, fontWeight: "bold" }}>"{getUserApi.data.name}"님의</AppText>
          <View style={{ marginVertical: 10, alignItems: "center" }}>
            <View style={styles.scoreboard}>
              <View style={{ alignItems: "center", justifyContent: "space-evenly" }}>
                <AppText style={{ fontSize: 12 }}>최근 주문</AppText>
                <AppText style={{ fontSize: 14, color: colors.blue }}>{status}</AppText>
              </View>
              <View style={styles.separator}></View>
              <View style={{ alignItems: "center", justifyContent: "space-evenly" }}>
                <AppText style={{ fontSize: 12 }}>다음 예약</AppText>
                <AppText style={{ fontSize: 16, color: colors.blue }}>-</AppText>
              </View>
            </View>
          </View>
        </View>
        <View>
          <ListItem
            title="개인정보 변경"
            showChevrons
            onPress={() =>
              navigation.navigate(routes.ACCOUNTEDIT, getUserApi.data)
            }
          />

          <ListItemSeparator />

          <ListItem
            title="알림 설정"
            showChevrons
            onPress={() =>
              navigation.navigate(routes.SETNOTIFICATION, getUserApi.data)
            }
          />

          <ListItemSeparator />

          <ListItem
            title="회원 탈퇴"
            showChevrons
            onPress={() => handlePress()}
          />

          <ListItemSeparator />

          <ListItem
            title="로그아웃"
            showChevrons
            onPress={() => logOut()}
          />

        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.wood,
  },
  container: {
    marginBottom: 15,
  },
  header: {
    width: "70%",
    height: "8%",
    marginLeft: "3%",
    marginVertical: "3%"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: "5%",
  },
  subtitle: {
    fontSize: 15,
    marginLeft: "5%"
  },
  blackboard: {
    marginVertical: "9%",
    marginLeft: "5%",
    height: 100,
  },
  scoreboard: {
    backgroundColor: colors.white,
    width: "90%",
    height: "93%",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 3,
    // alignItems: "center"
  },
  separator: {
    backgroundColor: colors.wood,
    height: "100%",
    width: 1
  }
});

export default AAccountScreen;
