import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { theme } from "../styles/theme";
import { createEntryAPI, updateEntryAPI, deleteEntryAPI } from "../utils/api";
import { useUsers } from "../context/UsersContext";
import { useEntries } from "../context/EntriesContext";
export const Journal = () => {
  const [newEntryText, setNewEntryText] = useState("");
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const { user } = useUsers();
  const { entries, setEntries } = useEntries();

  const handleSaveEntry = () => {
    if (isLoading) return;

    if (!newEntryTitle.length > 0 || !newEntryText.length > 0) {
      setError("Please enter a title and some content.");
      return;
    }

    setIsLoading(true);

    const entry = {
      title: newEntryTitle,
      body: newEntryText,
      userId: user._id,
    };

    const request = editingEntry
      ? updateEntryAPI(editingEntry._id, entry)
      : createEntryAPI(entry);

    request
      .then((response) => {
        if (response?.data) {
          if (editingEntry) {
            setEntries((prev) =>
              prev.map((e) => (e._id === editingEntry._id ? response.data : e))
            );
          } else {
            setEntries((prev) => [response.data, ...prev]);
          }
          setNewEntryText("");
          setNewEntryTitle("");
          setEditingEntry(null);
          setIsModalVisible(false);
        } else {
          console.error("No data returned");
        }
      })
      .catch((err) => {
        console.error("Error saving journal entry:", err);
      })
      .finally(() => {
        setIsLoading(false);
        setError("");
      });
  };

  const handleDeleteEntry = () => {
    if (!editingEntry) return;
    setIsLoading(true);
    deleteEntryAPI(editingEntry._id)
      .then(() => {
        setEntries((prev) => prev.filter((e) => e._id !== editingEntry._id));
        setIsModalVisible(false);
        setEditingEntry(null);
        setNewEntryText("");
        setNewEntryTitle("");
      })
      .catch((err) => {
        console.error("Delete entry error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={theme.styles.container}>
          <Text style={[theme.fonts.header, theme.styles.centeredText]}>
            My Journal
          </Text>

          <TouchableOpacity
            onPress={() => {
              setEditingEntry(null);
              setIsModalVisible(true);
              setNewEntryText("");
              setNewEntryTitle("");
            }}
          >
            <Button
              mode={"contained"}
              loading={isLoading}
              style={theme.styles.buttonPrimary}
              labelStyle={theme.fonts.button}
            >
              Add Entry
            </Button>
          </TouchableOpacity>

          <View style={styles.entriesContainer}>
            {entries?.length === 0 ? (
              <Text style={[theme.fonts.subHeader, { textAlign: "center" }]}>
                No journal entries yet. Start writing now!
              </Text>
            ) : (
              entries?.map((entry) => (
                <TouchableOpacity
                  key={entry._id}
                  onPress={() => {
                    setEditingEntry(entry);
                    setNewEntryTitle(entry.title);
                    setNewEntryText(entry.body);
                    setIsModalVisible(true);
                  }}
                >
                  <Card style={styles.card}>
                    <Card.Title
                      title={entry.title}
                      titleStyle={theme.styles.cardTitle}
                    />
                    <Card.Content>
                      <Text style={theme.fonts.body}>{entry.body}</Text>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderContainer}>
              <Text style={[theme.fonts.header, styles.modalHeader]}>
                {editingEntry ? "Edit Entry" : "New Entry"}
              </Text>

              {editingEntry && (
                <TouchableOpacity
                  onPress={handleDeleteEntry}
                  style={styles.deleteIconContainer}
                  disabled={isLoading}
                >
                  <Image
                    source={require("../assets/delete.png")}
                    style={styles.deleteIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text style={[theme.fonts.body, styles.label]}>Title</Text>
            <TextInput
              style={theme.styles.input}
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
              mode="outlined"
            />
            <Text style={[theme.fonts.body, styles.label]}>Content</Text>
            <TextInput
              style={[theme.styles.input, styles.textArea]}
              value={newEntryText}
              onChangeText={setNewEntryText}
              mode="outlined"
              multiline
              numberOfLines={10}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSaveEntry}>
                <Button
                  mode={"contained"}
                  loading={isLoading}
                  style={theme.styles.buttonPrimary}
                  labelStyle={theme.fonts.button}
                >
                  Save
                </Button>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Button
                  mode={"contained"}
                  loading={isLoading}
                  style={theme.styles.buttonSecondary}
                  labelStyle={theme.fonts.button}
                >
                  Cancel
                </Button>
              </TouchableOpacity>
            </View>
            {error && <Text style={theme.fonts.error}>{error}</Text>}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  entriesContainer: {
    marginTop: 30,
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.beige[200],
    borderRadius: 12,
    paddingVertical: 4,
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
    marginBottom: 16,
  },
  textArea: {
    height: 160,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonSpacing: {
    marginRight: 10,
  },

  modalHeaderContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  deleteIconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
    zIndex: 10,
  },

  deleteIcon: {
    width: 24,
    height: 24,
  },
});
