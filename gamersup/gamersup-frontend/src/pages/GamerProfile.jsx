import { useContext, useEffect, React, useState } from 'react';
import UserContext from '../context/user/UserContext';
import GameListForProfile from '../components/profile/GameListForProfile';
import ProfileComponent from '../components/profile/ProfileComponent';
import LoginForm from './LoginForm';
import Loading from '../components/layout/Loading';
import { useParams } from 'react-router-dom';

// Multiple user view --> using variable as id and check
function GamerProfile({ socket }) {
  const {
    isLoggedIn,
    getWantToPlayByGamerId,
    getPlayedByGamerId,
    reading,
    fetching,
    getGamerById,
  } = useContext(UserContext);
  const params = useParams();
  const [gamer, setGamer] = useState();
  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    setUserReady(false);
    getGamerById(params.id).then((response) => {
      setGamer(response.data);
      setUserReady(true);
    });
    getWantToPlayByGamerId(params.id);
    getPlayedByGamerId(params.id);
  }, [params.id]);

  if (reading || fetching || !userReady) {
    return <Loading />;
  } else {
    if (isLoggedIn()) {
      return (
        <>
          <div className='card bg-base-300 p-4 my-8'>
            <ProfileComponent gamer={gamer} socket={socket} />
          </div>

          <div>
            <GameListForProfile />
          </div>
        </>
      );
    } else {
      return <LoginForm />;
    }
  }
}

export default GamerProfile;
