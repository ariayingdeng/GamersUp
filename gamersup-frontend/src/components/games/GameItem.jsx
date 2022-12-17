import { React, useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gameimage from '../../images/gameimage.jpg';
import { PlusIcon, CheckIcon } from '@heroicons/react/solid';
import PropTypes from 'prop-types';
import UserContext from '../../context/user/UserContext';

function GameItem({ game, user }) {
  const navigate = useNavigate();
  const { id: gameID, name, background_image, rating } = game;
  const { id: userID } = user;

  const {
    isLoggedIn,
    clickWantToPlay,
    clickPlayed,
    checkWantToPlay,
    checkPlayed,
  } = useContext(UserContext);

  const [validImage, setValidImage] = useState(true);
  const [wantToPlay, setWantToPlay] = useState(0);
  const [played, setPlayed] = useState(0);

  useEffect(() => {
    if (background_image == null) {
      setValidImage(false);
    }
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
  }, [background_image, gameID, isLoggedIn, checkWantToPlay, checkPlayed]);

  const handleClickWant = async (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      await clickWantToPlay(gameID, userID).then((response) => {
        setWantToPlay(response.data.checked);
      });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const handleClickPlayed = async (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      await clickPlayed(gameID, userID).then((response) => {
        setPlayed(response.data.checked);
      });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className='card w-72 mb-5 bg-base-200 shadow-xl'>
      <Link to={`/game/${gameID}`}>
        {validImage && (
          <figure>
            <img
              className='custom-card-image'
              src={background_image}
              alt={'game_image'}
            />
          </figure>
        )}

        {!validImage && (
          <figure>
            <img
              className='custom-card-image'
              src={gameimage}
              alt={'default_game_image'}
            />
          </figure>
        )}
      </Link>

      <div className='card-body'>
        <div className='card-title text-base mb-3'>
          <div className='inline badge badge-accent font-bold'>{rating}</div>
          <Link to={`/game/${gameID}`}>{name}</Link>
        </div>
        <div className='card-actions justify-start'>
          {wantToPlay === 1 && (
            <button
              className='btn-ghost bg-primary badge badge-outline text-xs hover:bg-primary-focus'
              onClick={handleClickWant}
            >
              <PlusIcon className='inline mr-1 w-5' />
              Added
            </button>
          )}
          {wantToPlay === 0 && (
            <button
              className='btn-ghost badge badge-outline text-xs hover:bg-primary-focus'
              onClick={handleClickWant}
            >
              <PlusIcon className='inline mr-1 w-5' />
              Want to Play
            </button>
          )}
          {played === 1 && (
            <button
              className='btn-ghost bg-primary badge badge-outline text-xs hover:bg-primary-focus'
              onClick={handleClickPlayed}
            >
              <CheckIcon className='inline mr-1 w-5' />
              Added
            </button>
          )}
          {played === 0 && (
            <button
              className='btn-ghost badge badge-outline text-xs hover:bg-primary-focus'
              onClick={handleClickPlayed}
            >
              <CheckIcon className='inline mr-1 w-5' />
              Played
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

GameItem.propTypes = {
  game: PropTypes.object,
};

export default GameItem;
