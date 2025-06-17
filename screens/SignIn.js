import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useUsers } from "../context/UsersContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../styles/theme";
export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const { setUser } = useUsers();

  const handleSignIn = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = credential.user;

      if (!firebaseUser.emailVerified) {
        setError("Please verify your email to login.");
      } else {
      //  const response = await getUserAPI({ fb_token: firebaseUser.uid });
      //  TODO: setUser(response.data); need a way to store users and their journal entries. 
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setError("User not found. Please sign up.");
          break;
        case "auth/missing-password":
          setError("Please enter a password.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        default:
          setError(error.message);
          break;
      }
    }

    setIsLoading(false);
  };

 
  return (
    <ScrollView >
      <View style={theme.styles.container}>
        <Text style={theme.fonts.headerText}>WELCOME BACK!</Text>
        <Text style={theme.fonts.inputLabelText}>Email address</Text>
        <TextInput
          style={theme.styles.input}
          value={email}
          mode={"outlined"}
          onChangeText={setEmail}
          keyboardType={"email-address"}
          autoComplete={"email"}
          autoCapitalize={"none"}
        />
        <Text style={theme.fonts.inputLabelText}>Password</Text>
        <TextInput
          style={theme.styles.input}
          value={password}
          mode={"outlined"}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={"new-password"}
        />
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        {error && <Text style={theme.fonts.errorText}>{error}</Text>}

        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleSignIn}>
            <Button
              mode={"contained"}
              loading={isLoading}
              style={[components.button, theme.styles.continue]}
              labelStyle={theme.fonts.buttonText}
            >
              Continue
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Button
              mode={"contained"}
              style={[components.button, theme.styles.back]}
              labelStyle={theme.fonts.buttonText}
            >
              Back
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "end",
    paddingTop: 100,
    padding: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
  logoContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  label: {
    fontFamily: "eurof55",
    fontSize: 18,
    fontWeight: 500,
    width: "100%",
    marginTop: 25,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-start",
    marginTop: 20,
  },
  forgotPasswordText: {
    fontFamily: "eurof55",
    fontSize: 18,
    color: "#282646",
  },
});
