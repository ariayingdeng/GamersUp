import { React, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import UserContext from '../../context/user/UserContext';
import Notifications from './nav/Notifications';
import SearchBar from './nav/SearchBar';
import SignInButton from './nav/SignInButton';
import Recommendations from './nav/Recommendations';
import Friends from './nav/Friends';
import Chat from './nav/Chat';
import Avatar from './nav/Avatar';

function Navbar({ socket, title }) {
  const { isLoggedIn, getLoggedUserInSession, user } = useContext(UserContext);

  useEffect(() => {
    if (isLoggedIn()) {
      // get the logged user
      getLoggedUserInSession();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      const userId = JSON.parse(sessionStorage.getItem('user')).id;
      socket?.emit('userLogin', userId);
      console.log('socket', socket);
      console.log('user', userId);
    }
  }, [socket, user]);

  return (
    <nav className='navbar shadow-lg bg-base-300'>
      <div className='container mx-auto'>
        <div className='flex-none px-2 mx-2'>
          <Link to='/' className='text-4xl font-bold text-primary align-middle'>
            {title}
          </Link>
        </div>
        <div className='flex-1 px-2 mx-2 text-neutral-content'>
          <div className='flex justify-end'>
            <SearchBar />
            {!isLoggedIn() && <SignInButton />}
            {isLoggedIn() && (
              <>
                <Recommendations />
                <Friends />
                <Notifications socket={socket} />
                <Chat socket={socket} />
                <Avatar socket={socket} />
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.defaultProps = {
  title: 'Gamers Up',
};

Navbar.propTypes = {
  title: PropTypes.string,
};

export default Navbar;
