import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/theme";
import { useUsers } from "../context/UsersContext";

export const Dashboard = ({ navigation }) => {
  const pageNavigation = useNavigation();
  const { user, setUser } = useUsers();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          Your Journal
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchIconContainer: {
    alignSelf: "flex-end",
    padding: 10,
    marginTop: -20,
    marginRight: 10,
    marginBottom: 25,
    width: 25,
    height: 25,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 20,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imageContent: {
    marginBottom: 20,
  },
  textWithIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  bootcampText: {
    fontFamily: "Lovelo-Black",
    fontSize: 16,
    color: "#282646",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
