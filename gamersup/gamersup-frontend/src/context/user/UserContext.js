import { createContext, useReducer } from 'react';
import userReducer from './UserReducer';
import axios from 'axios';

const UserContext = createContext();

const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const LOGIN_SESSION = process.env.REACT_APP_AUTH_SESSION;
const REGISTER_SESSION = process.env.REACT_APP_REGISTER_SESSION;

export const UserProvider = ({ children }) => {
  const initialState = {
    error: false,
    reading: true,
    user: { id: 0 }, // logged user's info
    wantToPlay: [],
    played: [],
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  const reading = (load) => {
    dispatch({ type: 'READING', payload: load });
  };

  const fetching = () => {
    dispatch({
      type: 'FETCHING',
    });
  };

  // Execute back end authentication service for login feature
  const executeAuthenticationService = async (email, password) => {
    return await axios.post(`${API_URL}/account/authenticate`, {
      email,
      password,
    });
  };

  // Execute Google login authentication
  const executeGoogleAuthService = async (name, email, avatarUrl) => {
    // return axios.get(`${API_URL}/oauth2/client/google`, {
    //   withCredentials: true,
    // });
    return await axios.post(`${API_URL}/account/login/google`, {
      name,
      email,
      avatarUrl,
    });
  };

  const getUserInfoByEmail = (email) => {
    axios
      .get(`${API_URL}/gamerinfo/email=${email}`)
      .then((response) => {
        const loggedUser = JSON.stringify(response.data);
        sessionStorage.setItem(LOGIN_SESSION, loggedUser);
        dispatch({
          type: 'LOGIN',
          payload: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'ERROR',
        });
      });
  };

  const getLoggedUserInSession = () => {
    if (isLoggedIn()) {
      const loggedUser = JSON.parse(sessionStorage.getItem(LOGIN_SESSION));
      dispatch({
        type: 'GET_LOGGED_USER',
        payload: loggedUser,
      });
    }
  };

  const logout = () => {
    sessionStorage.removeItem(LOGIN_SESSION);
    dispatch({
      type: 'LOGOUT',
    });
  };

  const isLoggedIn = () => {
    const loggedUser = sessionStorage.getItem(LOGIN_SESSION);
    if (loggedUser !== null) {
      return true;
    }
    return false;
  };

  // Execute back end registration service
  const executeRegisterService = async (name, email, password) => {
    await axios
      .post(`${API_URL}/account/registration`, {
        name,
        email,
        password,
      })
      .then((response) => {
        //response.data.jwt
        // console.log(response)
        sessionStorage.setItem(REGISTER_SESSION, email);
        dispatch({
          type: 'REGISTER',
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'ERROR',
        });
      });
  };

  const getGamerById = async (id) => {
    return await axios.get(`${API_URL}/gamerinfo/gamer=${id}`);
  };

  const getWantToPlayByGamerId = async (id) => {
    reading(true);
    await axios
      .get(`${API_URL}/games/user=${id}/wanttoplaylist`)
      .then((response) => {
        dispatch({
          type: 'GET_WANT_TO_PLAY',
          payload: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'ERROR',
        });
      });
  };

  const getPlayedByGamerId = async (id) => {
    fetching(true);
    await axios
      .get(`${API_URL}/games/user=${id}/playedlist`)
      .then((response) => {
        dispatch({
          type: 'GET_PLAYED',
          payload: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'ERROR',
        });
      });
  };

  const clickWantToPlay = async (gameID) => {
    return await axios.put(`${API_URL}/games/wanttoplay`, {
      gameID,
      gamerID: state.user.id,
    });
  };

  const clickPlayed = async (gameID) => {
    return await axios.put(`${API_URL}/games/played`, {
      gameID,
      gamerID: state.user.id,
    });
  };

  const checkWantToPlay = async (id) => {
    return await axios.post(`${API_URL}/games/check/wanttoplay`, {
      gameID: id,
      gamerID: state.user.id,
    });
  };

  const checkPlayed = async (id) => {
    return await axios.post(`${API_URL}/games/check/played`, {
      gameID: id,
      gamerID: state.user.id,
    });
  };

  const changeBio = async (bio) => {
    const userId = state.user.id;
    axios
      .put(`${API_URL}/gamerinfo/bio/changebio`, {
        userId,
        bio,
      })
      .then((response) => {
        getUserInfoByEmail(state.user.email);
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'ERROR',
        });
      });
  };

  const changeAvatar = async (url) => {
    const userId = state.user.id;
    await axios
      .put(`${API_URL}/gamerinfo/changeAvatar`, {
        userId,
        url,
      })
      .then((response) => {
        getUserInfoByEmail(state.user.email);
      })
      .catch((err) => {
        console.log(err);
        dispatch({
          type: 'ERROR',
        });
      });
  };

  const changeBirthday = async (dob) => {
    const userId = state.user.id;
    return await axios.put(`${API_URL}/gamerinfo/changeBirthday`, {
      userId,
      dob,
    });
  };

  const changeLevel = async (level) => {
    const userId = state.user.id;
    return await axios.put(`${API_URL}/gamerinfo/changeLevel`, {
      userId,
      level,
    });
  };

  const changeLikes = async (gamerId) => {
    return await axios.put(`${API_URL}/gamerinfo/changeLikes/${gamerId}`);
  };

  const getFriends = async () => {
    const userId = state.user.id;
    return await axios.get(`${API_URL}/gamerinfo/friends/${userId}`);
  };

  /* add a game review with rating 5 when the user clicks love for a game */
  const addLoveGameReview = async (gameID) => {
    const userID = state.user.id;
    return axios.put(`${API_URL}/reviews/lovegame`, {
      userID,
      gameID,
    });
  };

  /* add a game review with rating 0 when the user clicks hate for a game */
  const addHateGameReview = async (gameID) => {
    const userID = state.user.id;
    return axios.put(`${API_URL}/reviews/hategame`, {
      userID,
      gameID,
    });
  };

  /** delete a review when the user cancel love or hate a game */
  const cancelLoveHate = async (gameID) => {
    const userID = state.user.id;
    return axios.delete(`${API_URL}/reviews/user=${userID}&game=${gameID}`, {
      userID,
      gameID,
    });
  };

  /** check whether the user loves a game */
  const checkLoveGame = async (gameID) => {
    const userID = state.user.id;
    return axios.post(`${API_URL}/reviews/check/love`, {
      userID,
      gameID,
    });
  };

  /** check whether the user hates a game */
  const checkHateGame = async (gameID) => {
    const userID = state.user.id;
    return axios.post(`${API_URL}/reviews/check/hate`, {
      userID,
      gameID,
    });
  };

  /** get Likes number for profile page*/
  const getLikes = (id) => {
    return axios.get(`${API_URL}/gamerinfo/getLikes/${id}`);
  };

  /** check is friend or not for profile page */
  const isFriend = (userId, gamerId) => {
    return axios.get(
      `${API_URL}/gamerinfo/isFriend/ida=${userId}&idb=${gamerId}`
    );
  };

  /** create friend request for adding friend */
  const addFriend = (userId, gamerId) => {
    return axios.post(
      `${API_URL}/gamerinfo/addfriendrequest/${userId}&${gamerId}`
    );
  };

  /** accept friend  */
  const acceptFriend = (userId, gamerId) => {
    return axios.post(`${API_URL}/gamerinfo/friendsAdd/${userId}&${gamerId}`);
  };

  /** get recommended friend list from back end */
  const getRecommendFriends = (userId) => {
    return axios.get(`${API_URL}/recommendations/gamerlist/user=${userId}`);
  };

  /** get recommended game list from back end */
  const getRecommendGames = (userId) => {
    return axios.get(`${API_URL}/recommendations/games/user=${userId}`);
  };

  /** check whether the user has ratings */
  const hasRatings = (userId) => {
    return axios.get(`${API_URL}/recommendations/hasratings/user=${userId}`);
  };

  const changePassword = (userId, currentPassword, newPassword) => {
    return axios.put(`${API_URL}/account/change/password`, {
      userId,
      currentPassword,
      newPassword,
    });
  };

  /** Update the settings of the user */
  const updateSettings = async (userId, avatarUrl, level, dob, bio) => {
    return await axios.put(`${API_URL}/gamerinfo/update/settings`, {
      userId,
      avatarUrl,
      level,
      dob,
      bio,
    });
  };

  return (
    <UserContext.Provider
      value={{
        error: state.error,
        reading: state.reading,
        user: state.user,
        wantToPlay: state.wantToPlay,
        played: state.played,
        wantToPlayObject: state.wantToPlayObject,
        playedObject: state.playedObject,
        executeAuthenticationService,
        getUserInfoByEmail,
        logout,
        executeRegisterService,
        clickWantToPlay,
        clickPlayed,
        checkWantToPlay,
        checkPlayed,
        getGamerById,
        getWantToPlayByGamerId,
        getPlayedByGamerId,
        changeBio,
        changeAvatar,
        getFriends,
        isLoggedIn,
        getLoggedUserInSession,
        changeBirthday,
        changeLevel,
        changeLikes,
        addLoveGameReview,
        addHateGameReview,
        checkLoveGame,
        checkHateGame,
        cancelLoveHate,
        getLikes,
        isFriend,
        addFriend,
        acceptFriend,
        getRecommendFriends,
        getRecommendGames,
        hasRatings,
        changePassword,
        executeGoogleAuthService,
        updateSettings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
