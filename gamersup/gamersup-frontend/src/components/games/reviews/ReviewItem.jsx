import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReviewContext from '../../../context/games/ReviewContext';
import ReplyContext from '../../../context/games/ReplyContext';
import UserContext from '../../../context/user/UserContext';
import { FaTimes, FaEdit, FaCommentDots } from 'react-icons/fa';
import { BsStar, BsStarFill } from 'react-icons/bs';
import PropTypes from 'prop-types';
import EditReviewForm from './EditReviewForm';
import gamerAvatar from '../../../images/gamers-logo.png';
import Replies from '../replies/Replies';

function ReviewItem({ item, socket }) {
  const { deleteReview, addStar, cancelStar, checkiIsStarred } =
    useContext(ReviewContext);
  const { newReply, getRepliesByReviewId } = useContext(ReplyContext);
  const { user, isLoggedIn, getGamerById } = useContext(UserContext);
  const [commenter, setCommenter] = useState();
  const [itemEdit, setItemEdit] = useState({
    item: {},
    edit: false,
  });
  const [openReplies, setOpenReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [starred, setStarred] = useState(false);

  const { id, gameID, userID, rating, comment, stars } = item;

  useEffect(() => {
    if (userID !== null) {
      getGamerById(userID).then((response) => {
        setCommenter(response.data);
      });
    }
  }, []);

  // get replies of this review
  useEffect(() => {
    getRepliesByReviewId(id).then((response) => {
      setReplies(response.data);
    });
  }, [newReply]);

  // check starred
  useEffect(() => {
    checkiIsStarred(id, user.id).then((response) => {
      setStarred(response.data);
    });
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

  const handleClickStar = (e) => {
    if (starred === false) {
      addStar(id, user.id);
      setStarred(true);
      socket?.emit('sendNotification', {
        senderId: user.id,
        receiverId: userID,
        type: 4,
      });
    } else {
      cancelStar(id, user.id);
      setStarred(false);
    }
  };

  const handleClickReplies = (e) => {
    if (openReplies === false) {
      setOpenReplies(true);
    } else {
      setOpenReplies(false);
    }
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
            <img
              src={
                commenter?.avatarUrl !== null
                  ? commenter?.avatarUrl
                  : gamerAvatar
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
            <button
              onClick={handleClickStar}
              className='hover:bg-primary mr-5 badge badge-warning badge-lg'
            >
              {starred ? (
                <BsStarFill className='mr-2' />
              ) : (
                <BsStar className='mr-2' />
              )}{' '}
              Starred &nbsp;
              <span className='font-semibold'>{stars}</span>
            </button>
            <button
              onClick={handleClickReplies}
              className='hover:bg-primary mr-5 badge badge-success badge-lg'
            >
              <FaCommentDots className='mr-2' /> Replies &nbsp;
              <span className='font-semibold'>{replies.length}</span>
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
        {openReplies && (
          <Replies
            review={item}
            setOpenReplies={setOpenReplies}
            replies={replies}
            socket={socket}
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
