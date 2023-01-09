import React from 'react';

const AvatarImage = ({ imgUrl, gamerAvatar, style }) => {
  return (
    <img
      src={imgUrl !== null ? imgUrl : gamerAvatar}
      alt='avatar'
      onError={(e) => {
        e.target.src = gamerAvatar;
      }}
      referrerPolicy='no-referrer'
      className={style}
    />
  );
};

export default AvatarImage;
