import React from 'react';
import FriendList from './FriendList';

function Friends() {
  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex='0' className='btn btn-ghost btn-lg btn-circle'>
        <span className='material-symbols-outlined'>group</span>
      </label>
      <ul
        tabIndex='0'
        className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-60'
      >
        <FriendList />
      </ul>
    </div>
  );
}

export default Friends;
