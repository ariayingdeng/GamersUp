import { createContext, useReducer } from 'react';
import replyReducer from './ReplyReducer';
import axios from 'axios';

const ReplyContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

export const ReplyProvider = ({ children }) => {
  const initialState = {
    newReply: null,
    error: false,
  };

  const [state, dispatch] = useReducer(replyReducer, initialState);

  // Add a new reply to database
  const addReply = async (reviewID, userID, comment) => {
    await axios
      .post(`${API_URL}/reviews/review=${reviewID}/reply`, {
        userID,
        comment,
      })
      .then((response) => {
        dispatch({
          type: 'ADD_REPLY',
          payload: response.data,
        });
      })
      .catch(() => {
        dispatch({
          type: 'REPLY_ERROR',
        });
      });
  };

  const getRepliesByReviewId = async (reviewID) => {
    return await axios.get(`${API_URL}/reviews/review=${reviewID}/allreplies`);
  };

  return (
    <ReplyContext.Provider
      value={{
        newReply: state.newReply,
        error: state.error,
        addReply,
        getRepliesByReviewId,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
};

export default ReplyContext;
