import React, { createContext, useState, useContext } from 'react';

// Create a User Context
const UserContext = createContext();

// Create a custom hook for easier access to the context
export const useUser = () => {
  return useContext(UserContext);
};

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
