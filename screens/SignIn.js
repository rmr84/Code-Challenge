import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useUsers } from "../context/UsersContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../styles/theme";
import { components } from "../styles/components";
import { Read } from "react-native-vector-icons";
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
        // TODO: Fetch user data and set it
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
        case "auth/invalid-credential":
          setError("User not found. Please sign up.");
          break;
        default:
          setError(error.message);
          break;
      }
    }

    setIsLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          Sign In
        </Text>

        <Text style={[theme.fonts.body, styles.label]}>Email address</Text>
        <TextInput
          style={theme.styles.input}
          value={email}
          mode="outlined"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
        />

        <Text style={[theme.fonts.body, styles.label]}>Password</Text>
        <TextInput
          style={theme.styles.input}
          value={password}
          mode="outlined"
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={[theme.fonts.caption, styles.forgotPasswordText]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        {error ? (
          <Text style={[theme.fonts.error, styles.errorText]}>{error}</Text>
        ) : null}

        <TouchableOpacity onPress={handleSignIn}>
          <Button
            mode={"contained"}
            loading={isLoading}
            style={[components.button, theme.styles.buttonPrimary]}
            labelStyle={theme.fonts.buttonText}
          >
            Continue
          </Button>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 75,
  },

  label: {
    marginTop: 20,
    marginBottom: 4,
  },
  bottomContainer: {
    marginTop: 40,
    gap: 16,
  },
  forgotPasswordContainer: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: theme.colors.brown[700],
  },
});
