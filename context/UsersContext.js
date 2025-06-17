import { createContext, useContext, useState } from "react";

export const UsersContext = createContext(null);

export const useUsers = () => useContext(UsersContext);

export const UsersProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <UsersContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};
