import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatContext from '../../../context/chat/ChatContext';
import UserContext from '../../../context/user/UserContext';
import gamerAvatar from '../../../images/gamers-logo.png';
import AvatarImage from '../../utils/AvatarImage'

function Avatar({ socket }) {
  const { logout, user } = useContext(UserContext);
  const { clearMessages } = useContext(ChatContext);

  const handleClickLogout = () => {
    logout();
    socket?.emit('userLogout');
    clearMessages();
  };

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex='0' className='btn btn-ghost btn-circle avatar'>
        <div className='w-12 rounded-full mt-2'>
          {/* {user.avatarUrl !== null && <img src={user.avatarUrl} alt='avatar' />}
          {user.avatarUrl === null && <img src={gamerAvatar} alt='avatar' />} */}
          {/* <img
            src={user.avatarUrl !== null ? user.avatarUrl : gamerAvatar}
            alt='avatar'
            onError={(e) => {
              e.target.src = gamerAvatar;
            }}
            referrerPolicy='no-referrer'
          /> */}
          <AvatarImage imgUrl={user.avatarUrl} gamerAvatar={gamerAvatar} />
        </div>
      </label>
      <ul
        tabIndex='0'
        className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-44'
      >
        <li>
          <Link
            to={`/profile/${JSON.parse(sessionStorage.getItem('user')).id}`}
            className='text-lg'
          >
            Profile
          </Link>
        </li>
        <li>
          <Link to='/settings' className='text-lg'>
            Settings
          </Link>
        </li>
        <li>
          <Link to='/resetpassword' className='text-lg'>
            Reset Password
          </Link>
        </li>
        <li>
          <div className='text-lg' onClick={handleClickLogout}>
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Avatar;
