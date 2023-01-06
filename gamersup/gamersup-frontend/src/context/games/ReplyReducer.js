const replyReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_REPLY':
      return {
        ...state,
        newReply: action.payload,
      };
    case 'REPLY_ERROR':
      return {
        ...state,
        error: true,
      };
    default:
      return state;
  }
};

export default replyReducer;
