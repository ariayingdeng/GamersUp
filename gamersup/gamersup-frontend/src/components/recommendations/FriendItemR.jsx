import { useContext, useState, useEffect } from 'react';
import UserContext from '../../context/user/UserContext';
import gamerAvatar from '../../images/gamers-logo.png';
import {
  CheckCircleIcon,
  PlusCircleIcon,
  ThumbUpIcon,
} from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
import AvatarImage from '../utils/AvatarImage';

function FriendItemR({ userID, gamerID, socket }) {
  const { isLoggedIn, getGamerById, isFriend, addFriend, changeLikes } =
    useContext(UserContext);

  const [gamer, setGamer] = useState({});
  const [friend, setFriend] = useState(false);
  const [clickLike, setClickLike] = useState(false);
  const [clickAdd, setClickAdd] = useState(false); // for requesting to add friend

  useEffect(() => {
    getGamerById(gamerID)
      .then((response) => {
        setGamer(response.data);
      })
      .catch((error) => console.log(error));

    isFriend(userID, gamerID)
      .then((response) => {
        setFriend(response.data);
      })
      .catch((error) => console.log(error));

    setClickLike(false);
  }, [clickLike]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (isLoggedIn()) {
      socket?.emit('sendNotification', {
        senderId: userID,
        receiverId: gamerID,
        type: 2,
      });
      await addFriend(userID, gamerID);
      setClickAdd(true);
    }
  };

  const handleClickLike = async (e) => {
    // e.preventDefault();
    if (isLoggedIn()) {
      socket?.emit('sendNotification', {
        senderId: userID,
        receiverId: gamerID,
        type: 1,
      });
      await changeLikes(gamerID).then((response) => {
        setClickLike(response.data);
      });
    }
  };

  return (
    <div className='card shadow-md compact side bg-base-100 my-3'>
      <div className='flex-row items-center space-x-4 card-body'>
        <div className='avatar rounded-full shadow w-14 h-14'>
          <Link to={`/profile/` + gamerID}>
            {/* {gamer.avatarUrl !== null && (
              <img
                src={gamer.avatarUrl}
                alt='Avatar'
                className='w-14 h-14 rounded-full avatar'
              />
            )}
            {gamer.avatarUrl === null && (
              <img
                src={gamerAvatar}
                alt='avatar'
                className='w-14 h-14 rounded-full avatar'
              />
            )} */}
            <AvatarImage
              imgUrl={gamer.avatarUrl}
              gamerAvatar={gamerAvatar}
              style={'w-14 h-14 rounded-full avatar'}
            />
          </Link>
        </div>
        <div className='w-40'>
          <div className='flex'>
            <h3 className='card-title my-auto'>
              <Link to={`/profile/` + gamerID}>{gamer.name}</Link>
            </h3>
            <div className='badge badge-success font-semibold ml-3 my-auto'>
              {gamer.level === 0 && <span>Newbie</span>}
              {gamer.level === 1 && <span>Veteran</span>}
              {gamer.level === 2 && <span>Pro</span>}
              {gamer.level == null && <span>Unknown</span>}
            </div>
          </div>
          <p className='my-1'>{gamer.bio}</p>
          <div className='flex justify-between'>
            <div
              className='my-auto btn-ghost badge badge-accent font-bold hover:text-primary'
              onClick={handleClickLike}
            >
              <ThumbUpIcon className='inline mr-1 w-4' />
              {gamer.likes}
            </div>
            <div className='mr-1 w-8 my-auto'>
              {friend && <CheckCircleIcon className='text-primary' />}
              {!friend &&
                (clickAdd ? (
                  <PlusCircleIcon className='my-2 text-primary hover:text-primary' />
                ) : (
                  <PlusCircleIcon
                    className='btn btn-ghost btn-circle w-8 hover:text-primary'
                    onClick={handleAdd}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendItemR;
