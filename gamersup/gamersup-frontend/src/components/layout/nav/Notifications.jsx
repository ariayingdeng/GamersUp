import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../../../context/user/UserContext';
import { Link } from 'react-router-dom';
import gamerAvatar from '../../../images/gamers-logo.png';

function Notifications({ socket }) {
  const { getGamerById } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);

  const [contents, setContents] = useState([]); // content of the notifications: id, avatarUrl, message

  useEffect(() => {
    socket?.on('getNotification', (data) => {
      setNotifications((prev) => [...prev, data]);
      // setNotifications([...notifications, data]); // cause infinite loop
    });
  }, [socket]);

  useEffect(() => {
    console.log('notifications', notifications);
    console.log('contents', contents);
    if (notifications.length > 0) {
      const { senderId, type } = notifications[notifications.length - 1];
      getGamerById(senderId)
        .then((response) => {
          const gamer = response.data;
          console.log('gamer', gamer);
          const { id, avatarUrl, name } = gamer;
          const message = getNotificationMessage(name, type);
          setContents((prev) => [...prev, { id, avatarUrl, message }]);
        })
        .catch((error) => console.log(error));
    }
  }, [notifications]);

  const getNotificationMessage = (name, type) => {
    let content = name;
    switch (type) {
      case 1:
        content += ' liked your profile.';
        break;
    }
    return content;
  };

  const disPlayNotification = (content, index) => {
    return (
      <li key={index} className='w-72 rounded-box bg-base-300 my-1'>
        <Link to={'/profile/' + content.id} className='rounded-box'>
          {content.avatarUrl === null && (
            <img
              src={gamerAvatar}
              alt='avatar'
              className='w-8 rounded-full avatar'
            />
          )}
          {content.avatarUrl !== null && (
            <img
              src={content.avatarUrl}
              alt='avatar'
              className='w-8 rounded-full avatar'
            />
          )}
          <div className='my-auto text-base'>{content.message}</div>
        </Link>
      </li>
    );
  };

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex='0' className='btn btn-ghost btn-lg btn-circle'>
        <span className='material-symbols-outlined'>notifications</span>
        {notifications.length > 0 && (
          <span className='badge badge-xs badge-error indicator-item'></span>
        )}
      </label>
      <ul
        tabIndex='0'
        className='mt-1 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-72'
      >
        {contents?.map((content, index) => disPlayNotification(content, index))}
      </ul>
    </div>
  );
}

export default Notifications;
