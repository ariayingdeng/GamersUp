import React, { useContext, useState, useEffect } from 'react';
import UserContext from '../../../context/user/UserContext';
import { Link } from 'react-router-dom';
import gamerAvatar from '../../../images/gamers-logo.png';
import AvatarImage from '../../utils/AvatarImage';

function ReplyItem({ reply }) {
  const { comment, userID } = reply;

  const { getGamerById } = useContext(UserContext);

  const [commenter, setCommenter] = useState({});

  useEffect(() => {
    getGamerById(userID).then((response) => {
      setCommenter(response.data);
    });
  }, []);

  return (
    <div className='flex mt-6 mx-5'>
      <Link to={`/profile/${userID}`} className='mr-4 text-gray-400'>
        {/* <img
          src={
            commenter?.avatarUrl !== null ? commenter?.avatarUrl : gamerAvatar
          }
          alt='avatar'
          className='w-10 h-10 rounded-xl'
          onError={(e) => {
            e.target.src = gamerAvatar;
          }}
        /> */}
        <AvatarImage
          imgUrl={commenter?.avatarUrl}
          gamerAvatar={gamerAvatar}
          style={'w-10 h-10 rounded-xl'}
        />
      </Link>
      <div className='flex-col'>
        <p className='text-xs text-gray-300'>{commenter?.name}</p>
        <div className='text-display'>{comment}</div>
      </div>
    </div>
  );
}

export default ReplyItem;
