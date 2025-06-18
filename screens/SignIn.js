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
import { theme } from "../styles/theme";
import { AnimatedRotatingText } from "../styles/AnimatedRotatingText";
import { getUsersAPI } from "../utils/api";
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
        const response = await getUsersAPI({ fb_token: firebaseUser.uid });
        setUser(response.data);
        navigation.navigate("Dashboard");
      }
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-not-found":
          setError("User not found.");
          break;
        case "auth/missing-password":
          setError("Please enter a password.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-credential":
          setError("Wrong e-mail or password. Please Try again.");
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

        <AnimatedRotatingText />
        <Text style={[theme.fonts.body, theme.styles.label]}>
          Email address
        </Text>
        <TextInput
          style={theme.styles.input}
          value={email}
          mode="outlined"
          onChangeText={setEmail}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
        />

        <Text style={[theme.fonts.body, theme.styles.label]}>Password</Text>
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

        {error && (
          <Text style={[theme.fonts.error, styles.errorText]}>{error}</Text>
        )}

        <TouchableOpacity onPress={handleSignIn}>
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
          <Text style={theme.fonts.caption}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={[theme.fonts.caption, styles.signupLink]}>
              Sign Up →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 75,
  },

  bottomContainer: {
    marginTop: 40,
    gap: 16,
  },
  forgotPasswordContainer: {
    marginTop: 12,
    alignSelf: "flex-end",
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

  forgotPasswordText: {
    color: theme.colors.brown[700],
  },
});
