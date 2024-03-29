import { useContext, useEffect } from 'react'
import GamesContext from '../../context/games/GamesContext'
import GamePlatforms from './GamePlatforms'
import Loading from '../layout/Loading'
import PageBar from '../layout/PageBar'
import GameItem from './GameItem'

function GamesList() {

  const { games, loading, platformId, searchText, getGames } =
    useContext(GamesContext)

  // const { alert, setAlert, removeAlert } = useContext(AlertContext)

  useEffect(() => {
    // get games with platformId
    getGames(platformId, searchText)

    // // set Alert with search results info
    // let msg = ''
    // if (games.length < 1) {
    //   msg = 'Sorry. Currently unavailable.'
    //   if (searchText !== '') {
    //     msg = 'Sorry. No results for "' + searchText + '".'
    //   }
    //   setAlert(msg, 'information')
    // } else {
    //   if (alert !== null) {
    //     removeAlert()
    //   }

    //   if (searchText !== '') {
    //     const msg = games.length + ' results for "' + searchText + '".'
    //     setAlert(msg, 'information')
    //   }
    // }
  }, [platformId, searchText])

  if (loading) {
    return <Loading />
  } else {
    return (
      <>
        <GamePlatforms />
        <PageBar />
        {/* <div className='flex flex-wrap justify-between mt-5'> */}
        <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 mt-5 gap-5'>
          {games.map((game) => (
            <GameItem key={game.id} game={game} />
          ))}
        </div>
        <PageBar />
      </>
    )
  }
}

export default GamesList
