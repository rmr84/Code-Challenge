import { Surface, Text } from "react-native-paper";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const BottomNavigation = ({ currentScreen }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const buttons = [
    {
      icon: require("../assets/home.png"),
      screen: "Dashboard",
      description: "Home",
    },
    {
      icon: require("../assets/journal.png"),
      screen: "Journal",
      description: "Journal",
    },
    {
      icon: require("../assets/settings.png"),
      screen: "Settings",
      description: "Settings",
    },
  ];

  return (
    <Surface style={{ ...styles.container, paddingBottom: insets.bottom + 5 }}>
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.screen}
          onPress={() => navigation.navigate(button.screen)}
        >
          <View style={styles.button}>
            <View
              style={{
                ...styles.iconBackground,
                backgroundColor:
                  currentScreen === button.screen
                    ? theme.colors.blue[500]
                    : "transparent",
              }}
            >
              <Image source={button.icon} style={styles.icon} />
            </View>
            <Text style={styles.description}>{button.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 5,
    backgroundColor: "#FFFFFF",
  },
  button: {
    alignItems: "center",
  },
  iconBackground: {
    height: 50,
    width: 50,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  icon: {
    width: "70%",
    height: "100%",
    resizeMode: "contain",
  },
  description: {
    color: theme.colors.blue[700],
    fontSize: 16,
    fontFamily: "Georgia",
    fontWeight: "bold"
  },
});
