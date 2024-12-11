import { createContext, useState } from 'react';

// Create a context for the user
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Declare the user state variable but don't initialize it yet
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
};
