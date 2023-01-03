import React, { useEffect, useContext, useState } from 'react';
import UserContext from '../../../context/user/UserContext';
import { Link } from 'react-router-dom';
import gamerAvatar from '../../../images/gamers-logo.png';

function Notifications({ socket }) {
  const { user, getGamerById, acceptFriendWithUI } = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);
  const [contents, setContents] = useState([]); // content of the notifications: id, avatarUrl, message
  const [accept, setAccept] = useState(false);

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
          const { id, avatarUrl, name } = gamer;
          const message = getNotificationMessage(name, type);
          setContents((prev) => [{ id, avatarUrl, message, type }, ...prev]);
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
      case 2:
        content += ' sent you a friend request.';
        break;
      case 3:
        content += ' and you became friends!';
        break;
    }
    return content;
  };

  const disPlayNotification = (content, index) => {
    return (
      <li key={index} className='w-80 rounded-box bg-base-300 my-1'>
        <div className='grid grid-cols-6 gap-1'>
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
          </Link>
          <div className='my-auto text-base col-span-5 flex justify-between'>
            <Link to={'/profile/' + content.id}>{content.message}</Link>
            {content.type === 2 && accept === false && (
              <button
                className='btn-primary w-24 h-9 my-auto font-medium rounded-lg text-xs hover:bg-primary-focus'
                onClick={() => handleAccept(user.id, content.id)}
              >
                ACCEPT
              </button>
            )}
            {content.type === 2 && accept === true && (
              <button
                className='bg-neutral-focus w-24 h-9 my-auto font-medium rounded-lg text-xs'
                disabled
              >
                ACCEPTED
              </button>
            )}
          </div>
        </div>
      </li>
    );
  };

  const handleRead = () => {
    setNotifications([]);
    setContents([]);
  };

  const handleAccept = async (idA, idB) => {
    await acceptFriendWithUI(idA, idB);
    socket?.emit('sendNotification', {
      senderId: idA,
      receiverId: idB,
      type: 3,
    });
    socket?.emit('sendNotification', {
      senderId: idB,
      receiverId: idA,
      type: 3,
    });
    setAccept(true);
  };

  return (
    <div className='dropdown dropdown-end'>
      <label tabIndex='0' className='btn btn-ghost btn-lg btn-circle'>
        <span className='material-symbols-outlined'>notifications</span>
        {notifications.length > 0 && (
          // <span className='badge badge-xs badge-error indicator-item'></span>
          <div className='notificationsNum'>{notifications.length}</div>
        )}
      </label>
      <ul
        tabIndex='0'
        className='mt-1 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-80'
      >
        {contents?.map((content, index) => disPlayNotification(content, index))}
        {notifications.length > 0 && (
          <li
            className='w-48 mx-auto my-2 btn btn-primary rounded-box'
            onClick={handleRead}
          >
            Mark as Read
          </li>
        )}
        {notifications.length < 1 && (
          <li className='w-80 rounded-box bg-base-300 py-2'>
            <p className='text-base rounded-box mx-auto'>
              No new notifications.
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Notifications;
