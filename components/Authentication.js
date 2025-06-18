import { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { useUsers } from "../context/UsersContext";
import { getUsersAPI, getEntriesAPI } from "../utils/api";
import { useEntries } from "../context/EntriesContext";
export default function Authentication() {
  const { setUser } = useUsers();
  const { setEntries } = useEntries();
  const navigation = useNavigation();

 useEffect(() => {
    if (!navigation) return;

    return auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser?.emailVerified) {
          getUsersAPI({ fb_token: firebaseUser?.uid })
            .then((response) => {
              const userData = response?.data;
              setUser(userData);
              if (userData?._id) {
                return getEntriesAPI({ userId: userData._id });
              } else {
                return Promise.resolve([]);
              }
            })
            .then((entriesResponse) => {
              if (entriesResponse?.data) {
                setEntries(entriesResponse.data);
              } else {
                setEntries([]);
              }

              navigation.navigate("Dashboard");
            })
            .catch((error) => {
              console.error("Error fetching user or entries data:", error);
            });
        }
      } else {
        setUser({});
        setEntries([]);
        navigation.navigate("SignIn");
      }
    });
  }, [navigation]);
}
