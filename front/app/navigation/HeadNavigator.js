import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CustomerNavigator from "./CustomerNavigator";
import AdminNavigator from "./AdminNavigator";
import AuthNavigator from "./AuthNavigator";
import AuthContext from "../auth/context";

function HeadNavigator(props) {
  const { user } = useContext(AuthContext);
  const Stack = createStackNavigator();
  const HeadNavigator = () => (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user && user.isAdmin? (
        <Stack.Screen name="Admin" component={AdminNavigator} />
      ) : null}
      {user && !(user.isAdmin)? (
        <Stack.Screen name="Customer" component={CustomerNavigator} />
      ) : null}
      {user ? null
      : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )
      }
    </Stack.Navigator>
  );
  return <HeadNavigator />;
}

export default HeadNavigator;
