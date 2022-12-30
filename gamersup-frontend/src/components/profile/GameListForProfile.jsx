import GameListMiddleLayer from "./GameListMiddleLayer";
import { useContext } from 'react';
import UserContext from '../../context/user/UserContext';

function GameListForProfile() {   
    const { wantToPlay, played } = useContext(UserContext);

    return (   
      <>    
        <div className="card bg-base-300 p-4 my-8">
          <h1 className="card-title">Games Want To Play</h1>      
          {/* <GameListMiddleLayer className="card-body" title="Games Want To Play" /> */}
          <GameListMiddleLayer games={wantToPlay} />
        </div>
        <div className="card bg-base-300 p-4 my-8">
          <h1 className="card-title">Games Played</h1>      
          {/* <GameListMiddleLayer className="card-body" title="Games Played" /> */}
          <GameListMiddleLayer games={played} />
        </div>      
      </>
    );
    
 
 
}

export default GameListForProfile;
