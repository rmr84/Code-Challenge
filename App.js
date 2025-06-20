import { UsersProvider } from "./context/UsersContext";
import { EntriesProvider } from "./context/EntriesContext";
import { FiltersProvider } from "./context/FiltersContext";
import Navigation from "./components/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "./styles/theme";
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
export default function App() {
  const paperTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.blue[600],
      background: theme.colors.background,
      surface: "#fff",
      text: theme.colors.text,
      placeholder: theme.colors.brown[400],
      error: theme.colors.error,
    },
  };
  return (
    <>
      <PaperProvider theme={paperTheme}>
        <UsersProvider>
          <FiltersProvider>
            <EntriesProvider>
              <SafeAreaProvider>
                <Navigation />
              </SafeAreaProvider>
            </EntriesProvider>
          </FiltersProvider>
        </UsersProvider>
      </PaperProvider>
    </>
  );
}
