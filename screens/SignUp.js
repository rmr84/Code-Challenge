import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
//import { createUserAPI } from "../utils/api";
import { TextInput, Button } from "react-native-paper";
import { theme } from "../styles/theme";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { AnimatedRotatingText } from "../styles/AnimatedRotatingText";
export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const errors = checkSignUpErrors();
    if (errors.length > 0) {
      setError(errors[0]);
      setIsLoading(false);
      return;
    }
    try {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError("This email address is already in use");
        setIsLoading(false);
        return;
      }

      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(credential.user);

      /*  const response = await createUserAPI({
      TODO: Set up api 
        fb_token: credential.user.uid,
        name,
        email,
       
      }); */

      if (response.status === 200) {
        navigation.navigate("OTP", { credential: credential.user });
        setError("");
      } else {
        setError("Failed to create user");
      }
    } catch (error) {
      console.error(error.message);
      setError("An error occurred while signing up");
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailExists = async (email) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        "dummyPassword"
      );
      return !!userCredential.user;
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        return false;
      } else {
        return true;
      }
    }
  };

  const checkSignUpErrors = () => {
    const errors = [];
    if (email.trim() === "") {
      errors.push("Please enter your e-mail");
    }
    if (password === "") {
      errors.push("Please enter a password");
    }
    if (confirmPassword === "") {
      errors.push("Please re-enter your password");
    }
    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    return errors;
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          Sign Up
        </Text>
        <AnimatedRotatingText />
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

        <Text style={[theme.fonts.body, styles.label]}>Create Password</Text>
        <TextInput
          style={theme.styles.input}
          value={password}
          mode={"outlined"}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete={"new-password"}
        />
        <Text style={[theme.fonts.body, styles.label]}>
          Re-enter your password
        </Text>
        <TextInput
          style={theme.styles.input}
          value={confirmPassword}
          mode={"outlined"}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoComplete={"new-password"}
        />
        {error && (
          <Text style={theme.fonts.error}>
            {error === "auth/invalid-email"
              ? "Please enter a valid e-mail address"
              : error === "auth/email-already-in-use"
              ? "This e-mail address is already in use"
              : error === "auth/missing-password"
              ? "Please enter a password"
              : error === "auth/weak-password"
              ? "Please enter a stronger password."
              : error}
          </Text>
        )}

        <TouchableOpacity onPress={handleSignUp}>
          <Button
            mode={"contained"}
            loading={isLoading}
            style={theme.styles.buttonPrimary}
            labelStyle={theme.fonts.button}
          >
            Continue
          </Button>
        </TouchableOpacity>
        <View style={styles.accountRow}>
          <Text style={theme.fonts.caption}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={[theme.fonts.caption, styles.signupLink]}>
              Sign In →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    label: {
        marginTop: 20,
        marginBottom: 4,
      },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "flex-start",
  },
  signupLink: {
    color: theme.colors.blue[700],
    fontWeight: "600",
  },
});
