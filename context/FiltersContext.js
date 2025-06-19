import { createContext, useContext, useState } from "react";

export const FiltersContext = createContext(null);

export const useFilters = () => useContext(FiltersContext);

export const FiltersProvider = ({ children }) => {
  const [moodFilter, setMoodFilter] = useState([]);

  return (
    <FiltersContext.Provider
      value={{
        moodFilter,
        setMoodFilter,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
