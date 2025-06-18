import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import { SignUp } from "../screens/SignUp";
import { SignIn } from "../screens/SignIn";
import { OTP } from "../screens/OTP";
import { Dashboard } from "../screens/Dashboard";
import { ForgotPassword } from "../screens/ForgotPassword";
import { BottomNavigation } from "./BottomNavigation";
import Authentication from "./Authentication";
import { Journal } from "../screens/Journal";
const { Navigator, Screen } = createStackNavigator();
export default function Navigation() {
  const [currentScreen, setCurrentScreen] = useState("Dashboard");
  const hideBottomNavScreens = ["SignIn", "SignUp", "OTP", "ForgotPassword"];
  return (
    <NavigationContainer
      onStateChange={(state) =>
        setCurrentScreen(
          state.routes[state.index].state
            ? state.routes[state.index].state.routes[
                state.routes[state.index].state.index
              ].name
            : state.routes[state.index].name
        )
      }
    >
      <Authentication />
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name={"SignIn"} component={SignIn} />
        <Screen name={"SignUp"} component={SignUp} />
        <Screen name={"OTP"} component={OTP} />
        <Screen name={"Dashboard"} component={Dashboard} />
        <Screen name={"ForgotPassword"} component={ForgotPassword} />
        <Screen name={"Journal"} component={Journal} />
      </Navigator>
      {!hideBottomNavScreens.includes(currentScreen) && (
        <BottomNavigation currentScreen={currentScreen} />
      )}
    </NavigationContainer>
  );
}
