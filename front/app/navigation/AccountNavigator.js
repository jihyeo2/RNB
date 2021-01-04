import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AccountScreen from "../screens/AccountScreen";
import AAccountScreen from "../screens/AAccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import AuthContext from "../auth/context";



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
    </Stack.Navigator>
  );
  return <AccountNavigator />;
}

export default AccountNavigator;
