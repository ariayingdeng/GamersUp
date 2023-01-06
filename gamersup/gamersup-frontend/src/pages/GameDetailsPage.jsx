import { React, useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GamesContext from '../context/games/GamesContext';
import ReviewContext from '../context/games/ReviewContext';
import Loading from '../components/layout/Loading';
import gameimage from '../images/gameimage.jpg';
import ReviewForm from '../components/games/reviews/ReviewForm';
import ReviewsList from '../components/games/reviews/ReviewsList';
import WantPlayedStats from '../components/games/WantPlayedStats';

function GameDetailsPage({ socket }) {
  const { getGameByID, loading } = useContext(GamesContext);

  const { getReviewsByGameId } = useContext(ReviewContext);

  const { gameid } = useParams();

  const [game, setGame] = useState({});
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getGameByID(gameid)
      .then((response) => {
        setGame(response.data);
      })
      .catch((error) => {
        console.log('Getting game error: ' + error);
      });
  }, [gameid]);

  useEffect(() => {
    getReviewsByGameId(gameid)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.log('Getting reviews error: ' + error);
      });
  }, [gameid, reviews]);

  // destruct properties from game object
  const { name, genres, background_image, rating, rating_top, website } = game;

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        <div className='w-full mx-auto lg:w-10/12'>
          <div className='mt-5 mb-5'>
            <Link to='/' className='btn btn-outline'>
              Back To Home
            </Link>
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 mb:grid-cols-2 mb-3 md:gap-8'>
            <div className='custom-image mb-3 md:mb-0'>
              <div className='rounded-lg shadow-xl card image-full'>
                {background_image != null && (
                  <figure>
                    <img
                      className='custom-image'
                      src={background_image}
                      alt={'game_image'}
                    />
                  </figure>
                )}

                {background_image == null && (
                  <figure>
                    <img
                      className='custom-image'
                      src={gameimage}
                      alt={'default_game_image'}
                    />
                  </figure>
                )}
                <div className='card-body justify-end'>
                  <h2 className='card-title'>{name}</h2>
                </div>
              </div>
            </div>

            <div className='mb-3'>
              <div className='mb-4'>
                <h1 className='text-3xl card-title mb-2'>{name}</h1>
                {genres &&
                  genres.map((genre) => (
                    <div
                      className='ml-1 mr-1 badge badge-accent font-semibold'
                      key={genre.id}
                    >
                      {genre.name}
                    </div>
                  ))}
                {/* <p>{description}</p> */}
              </div>

              <div className='mb-8 w-full rounded-lg shadow-md bg-base-100 stats'>
                {rating && (
                  <div className='stat'>
                    <div className='stat-title text-md'>Rating</div>
                    <div className='text-lg stat-value'>
                      {rating} / {rating_top}
                    </div>
                  </div>
                )}
                {website && (
                  <div className='stat'>
                    <div className='stat-title text-md'>Website</div>
                    <div className='text-lg stat-value'>
                      <a href={`${website}`} target='_blank' rel='noreferrer'>
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <WantPlayedStats gameID={gameid} />
            </div>
          </div>
          <ReviewForm gameId={gameid} />
          <ReviewsList reviews={reviews} socket={socket} />
        </div>
      </>
    );
  }
}

export default GameDetailsPage;
