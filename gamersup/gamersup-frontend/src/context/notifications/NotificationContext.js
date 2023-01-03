import { createContext, useReducer } from 'react';
import notificationReducer from './NotificationReducer';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const initialState = {
    notifications: [],
    read: false,
  };

  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const handleNotification = (socket, senderId, receiverId, type) => {
    socket.emit('sendNotification', { senderId, receiverId, type });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        read: state.read,
        handleNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
