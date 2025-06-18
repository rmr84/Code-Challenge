import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEntries } from "../context/EntriesContext";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../styles/theme";
import { weekDays } from "../utils/constants";
import { Card } from "react-native-paper";
export const Dashboard = () => {
  const navigation = useNavigation();
  const { entries } = useEntries();
  const [weeklyMood, setWeeklyMood] = useState({});

  useEffect(() => {
    const moodByDay = {};

    entries?.forEach((entry) => {
      const date = new Date(entry.createdAt);
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

      if (!moodByDay[weekday]) {
        moodByDay[weekday] = { count: 0, totals: {} };
      }

      const mood = entry.mood || {};
      for (const [key, val] of Object.entries(mood)) {
        if (!moodByDay[weekday].totals[key]) {
          moodByDay[weekday].totals[key] = 0;
        }
        moodByDay[weekday].totals[key] += val;
      }

      moodByDay[weekday].count += 1;
    });

    const averaged = {};

    for (const [day, data] of Object.entries(moodByDay)) {
      const average = {};

      for (const [moodKey, total] of Object.entries(data.totals)) {
        const avg = total / data.count;
        average[moodKey] = avg;
      }

      averaged[day] = average;
    }

    setWeeklyMood(averaged);
  }, [entries]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={theme.styles.container}>
        <Text style={[theme.fonts.header, theme.styles.centeredText]}>
          Daily Average Scores
        </Text>

        {entries?.length === 0 ? (
          <TouchableOpacity onPress={() => navigation.navigate("Journal")}>
            <Text style={styles.noDataLabel}>
              Add some journal entries to get your daily average scores! →
            </Text>
          </TouchableOpacity>
        ) : (
          weekDays.map((day) => {
            const moods = weeklyMood[day];
            return (
              <View key={day} style={{ marginVertical: 12 }}>
                <Text style={[theme.fonts.subHeader, { marginBottom: 6 }]}>
                  {day}
                </Text>
                <Card style={styles.card}>
                  <Card.Content>
                    {moods ? (
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {Object.entries(moods).map(([mood, value]) => {
                          const normalized = Math.min(value / 100, 1);
                          const bgColor = `rgba(132, 186, 205, ${
                            normalized * 0.85
                          })`;

                          return (
                            <View
                              key={mood}
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 8,
                                borderRadius: 12,
                                backgroundColor: bgColor,
                                marginRight: 6,
                                marginBottom: 6,
                              }}
                            >
                              <Text style={{ fontSize: 12, color: "#004d40" }}>
                                {mood}: {Math.round(value)}%
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <Text
                        style={{
                          fontSize: 12,
                          fontStyle: "italic",
                          color: "#888",
                        }}
                      >
                        No journal entries for this day
                      </Text>
                    )}
                  </Card.Content>
                </Card>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchIconContainer: {
    alignSelf: "flex-end",
    padding: 10,
    marginTop: -20,
    marginRight: 10,
    marginBottom: 25,
    width: 25,
    height: 25,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    backgroundColor: "white",
    width: "100%",
    marginTop: 20,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imageContent: {
    marginBottom: 20,
  },
  textWithIconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  bootcampText: {
    fontFamily: "Lovelo-Black",
    fontSize: 16,
    color: "#282646",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.beige?.[200] || "#f4f1ee",
    borderRadius: 12,
    paddingVertical: 4,
  },
  noDataLabel: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    color: "#666",
    fontWeight: "bold",
  },
});
