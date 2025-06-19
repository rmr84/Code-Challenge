import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState } from "react";
import { SignUp } from "../screens/SignUp";
import { SignIn } from "../screens/SignIn";
import { VerifyEmail } from "../screens/VerifyEmail";
import { Dashboard } from "../screens/Dashboard";
import { ForgotPassword } from "../screens/ForgotPassword";
import { BottomNavigation } from "./BottomNavigation";
import Authentication from "./Authentication";
import { Journal } from "../screens/Journal";
import { Settings } from "../screens/Settings";
const { Navigator, Screen } = createStackNavigator();
export default function Navigation() {
  const [currentScreen, setCurrentScreen] = useState("Dashboard");
  const hideBottomNavScreens = ["SignIn", "SignUp", "VerifyEmail", "ForgotPassword"];
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
        <Screen name={"VerifyEmail"} component={VerifyEmail} />
        <Screen
          name="Dashboard"
          component={Dashboard}
          options={{ gestureEnabled: false }}
        />
        <Screen name={"ForgotPassword"} component={ForgotPassword} />
        <Screen
          name={"Journal"}
          component={Journal}
          options={{ gestureEnabled: false }}
        />
        <Screen
          name={"Settings"}
          component={Settings}
          options={{ gestureEnabled: false }}
        />
      </Navigator>
      {!hideBottomNavScreens.includes(currentScreen) && (
        <BottomNavigation currentScreen={currentScreen} />
      )}
    </NavigationContainer>
  );
}
