import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import AAccountScreen from "../screens/AAccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import SetNotificationScreen from "../screens/SetNotificationScreen";
import AuthContext from "../auth/context";
import AppText from "../components/AppText";

function AccountNavigator(props) {
  const { user } = useContext(AuthContext);
  const Stack = createStackNavigator();

  const AccountNavigator = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      { user.isAdmin? 
              <Stack.Screen 
              name="MyAccount" 
              component={AAccountScreen} 
            />
            :
            <Stack.Screen 
            name="MyAccount" 
            component={AccountScreen} 
          />
      }
      <Stack.Screen 
        name="AccountEdit" 
        component={AccountEditScreen} 
      />
      <Stack.Screen 
        name="SetNotification" 
        component={SetNotificationScreen} 
        options={{
          headerShown: true,
          headerTitle: () => (<AppText style={{marginLeft: "35%", fontWeight: "bold", fontSize: 16}}>알림</AppText>),
        }}
      />
    </Stack.Navigator>
  );
  return <AccountNavigator />;
}

export default AccountNavigator;
