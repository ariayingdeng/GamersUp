import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GamesContext from '../../../context/games/GamesContext';

function SearchBar() {
  const navigate = useNavigate();

  const { searchGames } = useContext(GamesContext);
  const [text, setText] = useState('');

  const handleChange = (e) => setText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    //search games
    searchGames(text);
    navigate('/', { replace: true });
  };

  return (
    <div>
      <form className='form-control' onSubmit={handleSubmit}>
        <input
          type='text'
          className='w-full pr-10 mt-2 bg-base-100 text-lg input input-bordered'
          placeholder='Search for games...'
          value={text}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}

export default SearchBar;
