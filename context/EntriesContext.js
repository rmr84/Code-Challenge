import { createContext, useContext, useState } from "react";

export const EntriesContext = createContext(null);

export const useEntries = () => useContext(EntriesContext);

export const EntriesProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);

  return (
    <EntriesContext.Provider
      value={{
        entries,
        setEntries,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};
