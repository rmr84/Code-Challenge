import React, { useState } from "react";
import { auth } from "../utils/firebase";
import { useUsers } from "../context/UsersContext";
import { useEntries } from "../context/EntriesContext";
import { deleteUserAPI } from "../utils/api";
import {
  deleteUser,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { theme } from "../styles/theme";

export const Settings = () => {
  const { user, setUser } = useUsers();
  const { setEntries } = useEntries();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleDeleteAccount = () => {
    if (!user?._id || !auth.currentUser) return;

    setIsLoading(true);

    deleteUserAPI(user._id)
      .then((response) => {
        if (response?.status === 200) {
          // Delete the Firebase Auth user
          return deleteUser(auth.currentUser)
            .then(() => {
              setUser(null);
              setEntries([]);
            })
            .catch((error) => {
              console.error("Firebase Auth user deletion error:", error);
            });
        } else {
          console.error("Delete request failed:", response?.data || response);
        }
      })
      .catch((error) => {
        console.error("Error deleting account from DB:", error);
      })
      .finally(() => {
        setIsLoading(false);
        setDeleteModalVisible(false);
      });
  };

  const handleChangePassword = () => {
    if (!auth.currentUser) return;

    setIsLoading(true);
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );

    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        return updatePassword(auth.currentUser, newPassword)
          .then(() => {
            setPasswordModalVisible(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          })
          .catch((error) => {
            console.error("Update password error:", error);
            setPasswordError("Failed to update password. Try again.");
          });
      })
      .catch((error) => {
        console.error("Reauthentication error:", error);
        setPasswordError("Current password is incorrect.");
      })
      .finally(() => {
        setIsLoading(false);
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

        <TouchableOpacity
          onPress={() => setPasswordModalVisible(true)}
          style={styles.touchable}
        >
          <Card style={styles.card}>
            <Card.Content>
              <Text style={[theme.fonts.body, styles.signOutText]}>
                Change Password
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setDeleteModalVisible(true)}
          style={styles.touchable}
        >
          <Card style={[styles.card, styles.deleteCard]}>
            <Card.Content>
              <Text style={[theme.fonts.body, styles.deleteText]}>
                Delete Account
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Delete account modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[theme.fonts.header, styles.modalHeader]}>
              Are you sure?
            </Text>
            <Text style={[theme.fonts.body, styles.modalBody]}>
              This will permanently delete your account and all of your data.
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="contained"
                loading={isLoading}
                onPress={handleDeleteAccount}
                style={[theme.styles.buttonPrimary, styles.button]}
              >
                Yes, Delete
              </Button>
              <Button
                mode="contained"
                disabled={isLoading}
                onPress={() => setDeleteModalVisible(false)}
                style={[theme.styles.buttonSecondary, styles.button]}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change password modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[theme.fonts.header, styles.modalHeader]}>
              Change Password
            </Text>

            <TextInput
              mode="outlined"
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              style={theme.styles.input}
            />

            <TextInput
              mode="outlined"
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={theme.styles.input}
            />

            <TextInput
              mode="outlined"
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={theme.styles.input}
            />

            {passwordError ? (
              <Text style={theme.fonts.error}>{passwordError}</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                mode="contained"
                loading={isLoading}
                onPress={handleChangePassword}
                style={[theme.styles.buttonPrimary, styles.button]}
              >
                Update Password
              </Button>
              <Button
                mode="contained"
                disabled={isLoading}
                onPress={() => setPasswordModalVisible(false)}
                style={[theme.styles.buttonSecondary, styles.button]}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  deleteCard: {
    backgroundColor: "#f8d7da",
  },
  deleteText: {
    color: "#d9534f",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    textAlign: "center",
    marginBottom: 10,
  },
  modalBody: {
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "column",
    gap: 10,
  },
  button: {
    marginTop: 8,
  },
});
