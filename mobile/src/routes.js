import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Main from "./pages/Main";
import Profile from "./pages/Profile";

const Stack = createStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#7d47f0"
          },
          headerTintColor: "#fff",
          headerTitleAlign: "center"
        }}
      >
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            title: "DevRadar"
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Perfil no GitHub"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
