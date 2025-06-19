import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import {
  TextInput,
  Button,
  Card,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import { theme } from "../styles/theme";
import { createEntryAPI, updateEntryAPI, deleteEntryAPI } from "../utils/api";
import { useUsers } from "../context/UsersContext";
import { useEntries } from "../context/EntriesContext";
import filterIcon from "../assets/filters.png";
import { useFilters } from "../context/FiltersContext";
import { moods } from "../utils/constants";
export const Journal = () => {
  const [newEntryText, setNewEntryText] = useState("");
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEntryModalVisible, setIsEntryModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [editingEntry, setEditingEntry] = useState(null);
  const { user } = useUsers();
  const { entries, setEntries } = useEntries();
  const { moodFilter, setMoodFilter } = useFilters();
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

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
          setIsEntryModalVisible(false);
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
        setIsEntryModalVisible(false);
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

  const getMoodLevel = (value) => {
    if (value >= 51) return "High";
    if (value >= 26) return "Medium";
    return "Low";
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={theme.styles.container}>
          <View style={styles.headerRow}>
            <Text style={theme.fonts.header}>My Journal</Text>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
              <Image source={filterIcon} style={styles.filterIcon} />
            </TouchableOpacity>
          </View>

          {moodFilter.length > 0 && (
            <View style={styles.filterTagContainer}>
              {moodFilter.map(({ type, level }) => (
                <View key={`${type}-${level}`} style={styles.filterTag}>
                  <Text style={styles.filterTagText}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} ({level})
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      setMoodFilter((prev) =>
                        prev.filter(
                          (f) => !(f.type === type && f.level === level)
                        )
                      )
                    }
                  >
                    <Text style={styles.filterTagClose}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              setEditingEntry(null);
              setIsEntryModalVisible(true);
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
              entries
                ?.filter((entry) => {
                  if (!moodFilter.length) return true;
                  return moodFilter.some(({ type, level }) => {
                    const moodValue = entry.mood?.[type];
                    if (moodValue == null) return false;
                    return getMoodLevel(moodValue) === level;
                  });
                })
                .map((entry) => {
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
                        setIsEntryModalVisible(true);
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
                                      {key.charAt(0).toUpperCase() +
                                        key.slice(1)}
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
      {/* Entry modal */}
      <Modal
        visible={isEntryModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEntryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderContainer}>
              <Text style={[theme.fonts.header, styles.modalHeader]}>
                {editingEntry ? "Edit Entry" : "New Entry"}
              </Text>
              {!editingEntry && (
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => setIsEntryModalVisible(false)}
                  style={styles.closeButton}
                />
              )}

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
                  setIsEntryModalVisible(false);
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
      {/* Filter modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsFilterModalVisible(false);
          setSelectedMood(null);
          setSelectedLevel(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[theme.fonts.header, { marginBottom: 16 }]}>
              Filter Journal Entries
            </Text>

            <TouchableOpacity style={styles.closeButton}>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.closeButton}
              />
            </TouchableOpacity>

            <Text style={theme.fonts.body}>Select Mood</Text>
            <View style={styles.filterButtonRow}>
              {moods.map((mood) => (
                <Button
                  key={mood}
                  mode={selectedMood === mood ? "contained" : "outlined"}
                  onPress={() => setSelectedMood(mood)}
                  disabled={selectedLevel && selectedMood !== mood}
                  style={{ marginRight: 8, marginTop: 8 }}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </Button>
              ))}
            </View>

            <Text style={[theme.fonts.body, { marginTop: 16 }]}>
              Select Level
            </Text>
            <View style={styles.filterButtonRow}>
              {["Low", "Medium", "High"].map((level) => {
                const alreadyExists = moodFilter.some(
                  (f) =>
                    f.type === selectedMood?.toLowerCase() && f.level === level
                );

                return (
                  <Button
                    key={level}
                    mode={selectedLevel === level ? "contained" : "outlined"}
                    onPress={() => {
                      if (selectedMood) setSelectedLevel(level);
                    }}
                    disabled={!selectedMood || alreadyExists}
                    style={{ marginRight: 8, marginTop: 8 }}
                  >
                    {level}
                  </Button>
                );
              })}
            </View>

            <View style={[theme.styles.modalButtons, { marginTop: 24 }]}>
              <TouchableOpacity>
                <Button
                  mode={"contained"}
                  onPress={() => {
                    setMoodFilter([]);
                    setSelectedMood(null);
                    setSelectedLevel(null);
                    setIsFilterModalVisible(false);
                  }}
                  style={theme.styles.buttonSecondary}
                  labelStyle={theme.fonts.button}
                >
                  Clear
                </Button>
              </TouchableOpacity>
              <TouchableOpacity>
                <Button
                  mode="contained"
                  onPress={() => {
                    const alreadyExists = moodFilter.some(
                      (f) =>
                        f.type === selectedMood && f.level === selectedLevel
                    );

                    if (!alreadyExists) {
                      setMoodFilter((prev) => [
                        ...prev,
                        {
                          type: selectedMood.toLowerCase(),
                          level: selectedLevel,
                        },
                      ]);
                    }

                    setSelectedMood(null);
                    setSelectedLevel(null);
                    setIsFilterModalVisible(false);
                  }}
                  style={theme.styles.buttonPrimary}
                  labelStyle={theme.fonts.button}
                  disabled={!selectedMood || !selectedLevel}
                >
                  Apply
                </Button>
              </TouchableOpacity>
            </View>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 75,
    marginRight: 10,
  },

  filterIcon: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },

  filterButtonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },

  filterTagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    marginBottom: 10,
  },

  filterTag: {
    flexDirection: "row",
    backgroundColor: theme.colors.blue[100],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
  },

  filterTagText: {
    fontSize: 12,
    marginRight: 6,
    color: theme.colors.blue[800],
    fontWeight: "bold",
  },

  filterTagClose: {
    fontSize: 12,
    color: theme.colors.blue[900],
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});
