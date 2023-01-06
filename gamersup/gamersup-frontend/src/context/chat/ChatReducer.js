const chatReducer = (state, action) => {
  switch (action.type) {
    case 'JOIN_CHAT':
      return {
        ...state,
        joined: true,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };
    case 'CLEAR_MESSAGE':
      return {
        joined: false,
        chatHistory: [],
      };
    default:
      return state;
  }
};

export default chatReducer;
