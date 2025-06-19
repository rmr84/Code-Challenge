import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { theme } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";

export const VerifyEmail = ({ route }) => {
  const { credential } = route.params;
  const navigation = useNavigation();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const resendVerify = async () => {
    try {
      await sendEmailVerification(credential);
      setSuccess("Verification email sent successfully!");
    } catch (error) {
      if (error.code === "auth/user-token-expired") {
        setError("The verification request has expired. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError(
          "Request limit exceeded. Please wait a short time to try again."
        );
      }

      console.error("Error: ", error);
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          Almost there!
        </Text>
        <Text style={theme.fonts.subHeader}>
          Please verify your e-mail to proceed.
        </Text>

        <Text style={styles.noEmail}>Didn&apos;t receive an e-mail?</Text>
        <TouchableOpacity onPress={() => resendVerify()}>
          <Text style={styles.resend}>Re-send verification e-mail</Text>
        </TouchableOpacity>
        {success && <Text style={theme.fonts.success}>{success}</Text>}
        {error && <Text style={theme.fonts.error}>{error}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Button
            mode={"contained"}
            style={theme.styles.buttonPrimary}
            labelStyle={theme.fonts.button}
          >
            Continue
          </Button>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: theme.colors.background,
    justifyContent: "flex-end",
    alignItems: "end",
    paddingTop: 300,
    alignItems: "center",
  },


  noEmail: {
    marginTop: 15,
    marginBottom: 15,
    fontFamily: "eurof55",
    color: "#282646",
    fontSize: 16,
  },
  resend: {
    fontWeight: "bold",
    color: theme.colors.blue[700],
    fontSize: 16,
  },
});
