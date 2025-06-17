import { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigation } from "@react-navigation/native";
import { useUsers } from "../context/UsersContext";

export default function Authentication({ currentScreen }) {
  const { user, setUser } = useUsers();
  const navigation = useNavigation();

  useEffect(() => {
    if (!navigation) return;

    return auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser?.emailVerified) {
          navigation.navigate("Dashboard");
        }
      } else {
        setUser({});
        navigation.navigate("SignIn");
      }
    });
  }, [navigation, currentScreen]);
}
