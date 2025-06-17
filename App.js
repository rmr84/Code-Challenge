import { UsersProvider } from "./context/UsersContext";
import Navigation from "./components/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
export default function App() {
  return (
    <>
      <UsersProvider>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </UsersProvider>
    </>
  );
}
