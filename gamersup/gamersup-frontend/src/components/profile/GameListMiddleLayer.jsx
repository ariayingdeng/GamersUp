// import { useContext } from 'react';
// import UserContext from '../../context/user/UserContext';
import PropTypes from 'prop-types';
import GameListItem from './GameListItem';

function GameListMiddleLayer({ games }) {
//   const { wantToPlay, played } = useContext(UserContext);

  return (
    <div className='card-body '>
      <div className='flex overflow-auto mt-2 mb-2'>
        {games?.map((game) => (
          <GameListItem key={game.gameID} id={game.gameID} />
        ))}
      </div>
    </div>
  );

  // if (title === "Games Want To Play") {
  //     return (
  //         <>
  //             <div className='flex overflow-auto mt-2 mb-2'>
  //             {wantToPlay?.map((game) => (
  //                 <GameListItem key={game.gameID} id={game.gameID} />
  //           ))}
  //             </div>
  //         </>
  //     )
  // } else if (title === "Games Played") {
  //     return (
  //         <>
  //             <div className='flex overflow-auto mt-2 mb-2'>
  //             {played?.map((game) => (
  //                 <GameListItem key={game.gameID} id={game.gameID} />
  //           ))}
  //             </div>
  //         </>
  //     )
  // }
}
GameListMiddleLayer.propTypes = {
  title: PropTypes.string,
};

export default GameListMiddleLayer;
