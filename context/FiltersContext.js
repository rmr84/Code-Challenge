import { createContext, useContext, useState } from "react";

export const FiltersContext = createContext(null);

export const useFilters = () => useContext(FiltersContext);

export const EntriesProvider = ({ children }) => {
  const [filters, setFilters] = useState([]);

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
