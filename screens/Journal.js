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
import { TextInput, Button, Card, ActivityIndicator } from "react-native-paper";
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

    if (newEntryTitle.length === 0 || newEntryText.length === 0) {
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
  const formatMoodValue = (val) =>
    typeof val === "number" ? val.toFixed(2) : "N/A";
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
              style={theme.styles.buttonPrimary}
              labelStyle={theme.fonts.button}
            >
              {isLoading ? (
                <ActivityIndicator animating={true} color="white" />
              ) : (
                "Add Entry"
              )}
            </Button>
          </TouchableOpacity>

          <View style={styles.entriesContainer}>
            {entries?.length === 0 ? (
              <Text style={[theme.fonts.subHeader, { textAlign: "center" }]}>
                No journal entries yet. Start writing now!
              </Text>
            ) : (
              entries?.map((entry) => {
                const created = new Date(entry.createdAt);
                const updated = new Date(entry.updatedAt);
                const newerDate = updated > created ? updated : created;

                const formattedDate = newerDate.toLocaleDateString();

                return (
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
                        right={() => (
                          <Text
                            style={{
                              marginRight: 12,
                              fontSize: 12,
                              color: theme.colors.brown[700],
                              alignSelf: "center",
                            }}
                          >
                            {formattedDate}
                          </Text>
                        )}
                      />
                      <Card.Content>
                        <Text style={theme.fonts.body}>{entry.body}</Text>
                        {entry.mood && (
                          <View style={styles.moodContainer}>
                            {Object.entries(entry.mood).map(([key, val]) => {
                              const value = typeof val === "number" ? val : 0;
                              const normalized = Math.min(value / 100, 1);

                              const bgColor = `rgba(132, 186, 205, ${
                                normalized * 0.85
                              })`;

                              return (
                                <View
                                  key={key}
                                  style={[
                                    styles.moodBadge,
                                    { backgroundColor: bgColor },
                                  ]}
                                >
                                  <Text style={styles.moodText}>
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    : {Math.round(value)}%
                                  </Text>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </Card.Content>
                    </Card>
                  </TouchableOpacity>
                );
              })
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
            <Text style={[theme.fonts.body, theme.styles.label]}>Title</Text>
            <TextInput
              style={theme.styles.input}
              value={newEntryTitle}
              onChangeText={setNewEntryTitle}
              mode="outlined"
            />
            <Text style={[theme.fonts.body, theme.styles.label]}>Content</Text>
            <TextInput
              style={[theme.styles.input, styles.textArea]}
              value={newEntryText}
              onChangeText={setNewEntryText}
              mode="outlined"
              multiline
              numberOfLines={10}
            />

            <View style={theme.styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <Button
                  mode={"contained"}
                  style={theme.styles.buttonSecondary}
                  labelStyle={theme.fonts.button}
                >
                  {isLoading ? (
                    <ActivityIndicator animating={true} color="white" />
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEntry}>
                <Button
                  mode={"contained"}
                  style={theme.styles.buttonPrimary}
                  labelStyle={theme.fonts.button}
                >
                  {isLoading ? (
                    <ActivityIndicator animating={true} color="white" />
                  ) : (
                    "Save"
                  )}
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

  modalHeaderContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  deleteIconContainer: {
    position: "absolute",
    top: 5,
    right: 0,
    padding: 8,
    zIndex: 10,
  },

  deleteIcon: {
    width: 24,
    height: 24,
  },

  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 6,
  },

  moodBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },

  moodText: {
    fontSize: 12,
    color: "#004d40",
    fontWeight: "600",
  },
});
