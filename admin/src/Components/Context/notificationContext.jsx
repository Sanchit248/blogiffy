import { createContext, useState } from 'react';

// Create a context for the notification
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  // Declare the notification state variable but don't initialize it yet
  const [unread, setUnread] = useState([]);

  return (
    <NotificationContext.Provider value={{ unread, setUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};
