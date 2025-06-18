import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { theme } from "../styles/theme";
import { getEntriesAPI, createEntryAPI } from "../utils/api";
import { useUsers } from "../context/UsersContext";
import { useEntries } from "../context/EntriesContext";
export const Journal = () => {
  const [newEntryText, setNewEntryText] = useState("");
  const [newEntryTitle, setNewEntryTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useUsers();
  const { entries, setEntries } = useEntries();

  useEffect(() => {
    console.log("entries: ", entries);
  }, []);

  const handleAddEntry = () => {
    if (!newEntryTitle.trim() || !newEntryText.trim() || isLoading) return;

    setIsLoading(true);

    const newEntry = {
      title: newEntryTitle,
      body: newEntryText,
      userId: user._id,
    };

    createEntryAPI(newEntry)
      .then((response) => {
        if (response?.data) {
          setEntries([response.data, ...entries]);
          setNewEntryText("");
          setNewEntryTitle("");
          setIsModalVisible(false);
        } else {
          console.error("No data returned from createEntryAPI");
        }
      })
      .catch((err) => {
        console.error("Error creating journal entry:", err);
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

          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
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
              <Text style={theme.fonts.body}>No journal entries yet.</Text>
            ) : (
              entries?.map((entry) => (
                <Card key={entry._id} style={styles.card}>
                  <Card.Title
                    title={entry.title}
                    titleStyle={theme.styles.cardTitle}
                  />
                  <Card.Content>
                    <Text style={theme.fonts.body}>{entry.body}</Text>
                  </Card.Content>
                </Card>
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
            <Text style={[theme.fonts.header, styles.modalHeader]}>
              New Entry
            </Text>
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
              <TouchableOpacity onPress={handleAddEntry}>
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
});
