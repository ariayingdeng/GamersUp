import { React, useEffect, useContext, useState } from 'react';
import { PlusIcon, CheckIcon } from '@heroicons/react/solid';
import GamesContext from '../../context/games/GamesContext';
import UserContext from '../../context/user/UserContext';
import AlertContext from '../../context/alert/AlertContext';

function WantPlayedStats({ gameID, user }) {
  const { id } = user;

  const { getWantToPlayNumber, getPlayedNumber } = useContext(GamesContext);

  const {
    isLoggedIn,
    clickWantToPlay,
    clickPlayed,
    checkWantToPlay,
    checkPlayed,
  } = useContext(UserContext);

  const { setAlertWithTimeout } = useContext(AlertContext);

  const [wantToPlayNum, setWantToPlayNum] = useState(0);
  const [playedNum, setPlayedNum] = useState(0);
  const [wantToPlay, setWantToPlay] = useState(0); // 0: false, 1: true
  const [played, setPlayed] = useState(0); // 0: false, 1: true

  useEffect(() => {
    if (isLoggedIn()) {
      checkWantToPlay(gameID).then((response) => {
        setWantToPlay(response.data);
      });
      checkPlayed(gameID).then((response) => {
        setPlayed(response.data);
      });
    } else {
      setWantToPlay(0);
      setPlayed(0);
    }
  }, [gameID, isLoggedIn, checkWantToPlay, checkPlayed]);

  useEffect(() => {
    if (gameID !== null) {
      getWantToPlayNumber(gameID).then((response) => {
        setWantToPlayNum(response.data);
      });
      getPlayedNumber(gameID).then((response) => {
        setPlayedNum(response.data);
      });
    }
  }, [gameID, getWantToPlayNumber, getPlayedNumber, wantToPlay, played]);

  const handleClickWant = async (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      await clickWantToPlay(gameID, id).then((response) => {
        setWantToPlay(response.data.checked);
      });
    } else {
      setAlertWithTimeout('Please sign in.', 'information');
    }
  };

  const handleClickPlayed = async (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      await clickPlayed(gameID, id).then((response) => {
        setPlayed(response.data.checked);
      });
    } else {
      setAlertWithTimeout('Please sign in.', 'information');
    }
  };

  return (
    <div className='w-full rounded-lg shadow-md bg-base-100 stats'>
      <div className='stat'>
        <div
          className='stat-title text-md btn-ghost hover:bg-primary-focus'
          onClick={handleClickWant}
        >
          <PlusIcon className='inline mr-1 w-5' />
          {wantToPlay === 1 && <strong>Cancel Want-to-Play</strong>}
          {wantToPlay === 0 && <strong>Want to Play</strong>}
        </div>
        <div className='text-lg stat-value'>{wantToPlayNum}</div>
      </div>

      <div className='stat'>
        <div
          className='stat-title text-md btn-ghost hover:bg-primary-focus'
          onClick={handleClickPlayed}
        >
          <CheckIcon className='inline mr-1 w-5' />
          {played === 1 && <strong>Cancel Played</strong>}
          {played === 0 && <strong>Played</strong>}
        </div>
        <div className='text-lg stat-value'>{playedNum}</div>
      </div>
    </div>
  );
}

export default WantPlayedStats;
