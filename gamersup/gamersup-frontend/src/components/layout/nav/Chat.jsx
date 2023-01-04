import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Chat({ socket }) {
  //socket for notifications
  const [newChat, setNewChat] = useState(false);

  useEffect(() => {
    socket?.on('getChatReminder', (data) => {
      setNewChat(true);
    });
  }, [socket]);

  const handleClickChat = (e) => {
    e.preventDefault();
    setNewChat(false);
  };

  return (
    <div className='w-12 rounded-full mt-2 mr-5 ml-1'>
      <button className='btn btn-ghost btn-circle' onClick={handleClickChat}>
        <Link to='/chatRoom' className='indicator'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-7 w-7'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
            />
          </svg>
          {newChat && (
            <span className='badge badge-xs badge-error indicator-item'></span>
          )}
        </Link>
      </button>
    </div>
  );
}

export default Chat;
