import { createContext, useReducer } from 'react';
import chatReducer from './ChatReducer';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const initialState = {
    joined: false,
    chatHistory: [],
  };

  const joinChat = () => {
    dispatch({
      type: 'JOIN_CHAT',
    });
  };

  const addMessage = (data) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: data,
    });
  };

  const clearMessages = () => {
    dispatch({
      type: 'CLEAR_MESSAGE',
    });
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider
      value={{
        joined: state.joined,
        chatHistory: state.chatHistory,
        joinChat,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
