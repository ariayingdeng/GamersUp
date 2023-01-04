import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewContext from '../../context/games/ReviewContext';
import UserContext from '../../context/user/UserContext';
import { FaTimes, FaEdit, FaStar, FaCommentDots } from 'react-icons/fa';
import PropTypes from 'prop-types';
import EditReviewForm from '../games/EditReviewForm';
import gamerAvatar from '../../images/gamers-logo.png';

function ReviewItem({ item }) {
  const { deleteReview } = useContext(ReviewContext);
  const { user, isLoggedIn, getGamerById } = useContext(UserContext);
  const [commenter, setCommenter] = useState();
  const [itemEdit, setItemEdit] = useState({
    item: {},
    edit: false,
  });

  const { id, gameID, userID, rating, comment } = item;

  useEffect(() => {
    if (userID !== null) {
      getGamerById(userID).then((response) => {
        setCommenter(response.data);
      });
    }
  }, []);

  const handleClickEdit = (e) => {
    if (itemEdit.edit === false) {
      setItemEdit({
        item,
        edit: true,
      });
    } else {
      setItemEdit({
        item: {},
        edit: false,
      });
    }
  };

  const closeEditForm = (e) => {
    setItemEdit({
      item: {},
      edit: false,
    });
  };

  if (rating !== 0 && rating !== 6) {
    return (
      <>
        <div className='w-full review-card bg-base-200'>
          <div className='num-display'>{rating}</div>
          <Link
            to={`/profile/${userID}`}
            className='mr-2 mb-2 text-gray-400 flex justify-start'
          >
            {/* {commenter?.avatarUrl === null && (
              <img
                src={gamerAvatar}
                alt='avatar'
                className='w-10 rounded-full'
              />
            )}
            {commenter?.avatarUrl !== null && (
              <img
                src={commenter?.avatarUrl}
                alt='avatar'
                className='w-10 rounded-full'
              />
            )} */}
            <img
              src={
                commenter?.avatarUrl !== null ? commenter?.avatarUrl : gamerAvatar
              }
              alt='avatar'
              className='w-10 h-10 rounded-full'
              onError={(e) => {
                e.target.src = gamerAvatar;
              }}
            />
            <p className='mt-2 ml-3'>{commenter?.name}</p>
          </Link>
          {isLoggedIn() && user?.id === commenter?.id && (
            <>
              <button onClick={() => deleteReview(id)} className='close'>
                <FaTimes color='pink' />
              </button>
              <button onClick={handleClickEdit} className='edit'>
                <FaEdit color='pink' />
              </button>
            </>
          )}
          <div className='text-display'>{comment}</div>
          <div
            className='
      flex justify-end'
          >
            <button className='hover:bg-primary mr-5 badge badge-warning badge-lg'>
              <FaStar className='mr-2' /> Starred &nbsp;
              <span className='font-semibold'>36</span>
            </button>
            <button className='hover:bg-primary mr-5 badge badge-success badge-lg'>
              <FaCommentDots className='mr-2' /> Comments &nbsp;
              <span className='font-semibold'>12</span>
            </button>
          </div>
        </div>
        {itemEdit.edit && (
          <EditReviewForm
            gameId={gameID}
            itemEdit={itemEdit}
            closeEditForm={closeEditForm}
          />
        )}
      </>
    );
  }
}

ReviewItem.propTypes = {
  item: PropTypes.object,
};

export default ReviewItem;
