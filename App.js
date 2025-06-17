import { UsersProvider } from "./context/UsersContext";

export default function App() {
  return (
    <>
      <UsersProvider>
        <Navigation />
      </UsersProvider>
    </>
  );
}
