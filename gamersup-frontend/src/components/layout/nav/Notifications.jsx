import React from 'react';

function Notifications() {
  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex='0' className='btn btn-ghost btn-lg btn-circle'>
        <span className='material-symbols-outlined'>notifications</span>
        <span className='badge badge-xs badge-error indicator-item'></span>
      </label>
      {/* <ul
        tabIndex='0'
        className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-60'
      >
        <FriendList />
      </ul> */}
    </div>
  );
}

export default Notifications;
