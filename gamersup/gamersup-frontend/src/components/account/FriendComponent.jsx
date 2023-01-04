import React from 'react';
import gamerAvatar from '../../images/gamers-logo.png';
import { Link } from 'react-router-dom';

function FriendComponent({ friend }) {
  return (
    <li className='w-48 rounded-full bg-base-300 mx-3 my-2'>
      <Link to={'/profile/' + friend.id}>
        {/* {friend.avatarUrl !== null && (
          <img
            src={friend.avatarUrl}
            alt='Avatar'
            className='w-14 rounded-full avatar'
          />
        )}
        {friend.avatarUrl === null && (
          <img
            src={gamerAvatar}
            alt='avatar'
            className='w-14 rounded-full avatar'
          />
        )} */}
        <img
          src={friend.avatarUrl !== null ? friend.avatarUrl : gamerAvatar}
          alt='avatar'
          className='w-14 h-14 rounded-full avatar'
          onError={(e) => {
            e.target.src = gamerAvatar;
          }}
        />
        <div className='my-auto text-base'>{friend.name}</div>
      </Link>
    </li>
  );
}

export default FriendComponent;
