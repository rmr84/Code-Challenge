import React from "react";
import { auth } from "../utils/firebase";
import { useUsers } from "../context/UsersContext";
import { useEntries } from "../context/EntriesContext";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Card } from "react-native-paper";
import { theme } from "../styles/theme";

export const Settings = () => {
  const { setUser } = useUsers();
  const { setEntries } = useEntries();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        setUser(null);
        setEntries([]);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          Settings
        </Text>

        <TouchableOpacity onPress={handleSignOut} style={styles.touchable}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[theme.fonts.body, styles.signOutText]}>
                Sign Out
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginTop: 30,
  },
  card: {
    backgroundColor: theme.colors.beige[200],
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  signOutText: {
    color: theme.colors.text,
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
});
