import { React, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GamesContext from '../../context/games/GamesContext';
import gameimage from '../../images/gameimage.jpg';

function GameListItem({ id }) {
  const { getGameByID } = useContext(GamesContext);
  // const [ validImage, setValidImage ] = useState(true)

  const [game, setGame] = useState();

  useEffect(() => {
    getGameByID(id).then((response) => {
      setGame(response.data);
    });
    // if (game?.background_image == null) {
    //   setValidImage(false)
    // }
    // game is not update yet, so the image is not valid
  }, []);

  return (
    <Link to={`/game/${id}`}>
      <div className='card w-72 bg-base-200 shadow-xl flex-none mr-5'>
        {/* {validImage && ( */}
        {game?.background_image === null && (
          <figure>
            <img
              className='custom-card-image'
              src={gameimage}
              alt={'game_image'}
            />
          </figure>
        )}

        {/* {!validImage && ( */}
        {game?.background_image !== null && (
          <figure>
            <img
              className='custom-card-image'
              src={game?.background_image}
              alt={'default_game_image'}
            />
          </figure>
        )}

        <div className='card-body'>
          <div className='card-title text-base mb-3'>
            <div className='inline badge badge-accent font-bold'>
              {game?.rating}
            </div>
            {game?.name}
          </div>
          {/* <div className='card-actions justify-start'>
            <button className='btn-ghost badge badge-outline text-xs hover:bg-primary-focus'>
              <PlusIcon className='inline mr-1 w-5' />
              Want to Play
            </button>
            <button className='btn-ghost badge badge-outline text-xs'>
              <CheckIcon className='inline mr-1 w-5' />
              Played
            </button>
          </div> */}
        </div>
      </div>
    </Link>
  );
}

export default GameListItem;
