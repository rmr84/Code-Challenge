import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import { SignUp } from "../screens/SignUp";
import { SignIn } from "../screens/SignIn";
import { OTP } from "../screens/OTP";
import { Dashboard } from "../screens/Dashboard";
import { ForgotPassword } from "../screens/ForgotPassword";

import Authentication from "./Authentication";
const { Navigator, Screen } = createStackNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <Authentication />
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name={"SignIn"} component={SignIn} />
        <Screen name={"SignUp"} component={SignUp} />
        <Screen name={"OTP"} component={OTP} />
        <Screen name={"Dashboard"} component={Dashboard} />
        <Screen name={"ForgotPassword"} component={ForgotPassword} />
      </Navigator>
    </NavigationContainer>
  );
}
