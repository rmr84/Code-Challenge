import { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { useUsers } from "../context/UsersContext";
import { getUsersAPI } from "../utils/api";

export default function Authentication() {
  const { setUser } = useUsers();
  const navigation = useNavigation();

  useEffect(() => {
    if (!navigation) return;

    return auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser?.emailVerified) {
          try {
            const response = getUsersAPI({ fb_token: firebaseUser?.uid });
            setUser(response?.data);
            navigation.navigate("Dashboard");
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } else {
        setUser({});
        navigation.navigate("SignIn");
      }
    });
  }, [navigation]);
}
