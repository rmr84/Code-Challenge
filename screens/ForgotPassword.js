import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { theme } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigation = useNavigation();

  const handleReset = async () => {
    if (isLoading) return;
    setIsLoading(true);
    if (email === "") {
      setError("Please enter an e-mail address.");
      setIsLoading(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("");
      setSuccess("Reset password sent, please check your e-mail inbox");
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("User not found. Please check your email address");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        default:
          console.error(error);
          setError("An unexpected error occurred. Please try again later");
          break;
      }
      setSuccess("");
    }
    setIsLoading(false);
  };

  return (
    <ScrollView backgroundColor={theme.colors.background}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          RESET PASSWORD
        </Text>
        <Text style={[theme.fonts.body, styles.label]}>
          Please enter your email below
        </Text>

        <Text style={[theme.fonts.body, styles.label]}>Email address</Text>
        <TextInput
          style={theme.styles.input}
          value={email}
          mode={"outlined"}
          onChangeText={setEmail}
          keyboardType={"email-address"}
          autoCompleteType={"email"}
          autoCapitalize={"none"}
        />
        {success !== "" && <Text style={theme.fonts.success}>{success}</Text>}
        {error !== "" && <Text style={theme.fonts.error}>{error}</Text>}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={handleReset}>
            <Button
              mode={"contained"}
              loading={isLoading}
              style={theme.styles.buttonPrimary}
              labelStyle={theme.fonts.button}
            >
              Continue
            </Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Button
              mode={"contained"}
              loading={isLoading}
              style={theme.styles.buttonSecondary}
              labelStyle={theme.fonts.button}
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
  label: {
    marginTop: 20,
    marginBottom: 4,
  },
});
