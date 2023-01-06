import React, { useState, useContext } from 'react';
import UserContext from '../../../context/user/UserContext';
import ReplyContext from '../../../context/games/ReplyContext';

function ReplyForm({ review, socket }) {
  const { user, isLoggedIn } = useContext(UserContext);
  const { addReply } = useContext(ReplyContext);
  const { id, gameID, userID } = review;

  const [text, setText] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [message, setMessage] = useState('');

  const handleTextChange = (e) => {
    if (!isLoggedIn()) {
      setMessage('Please sign in.');
    } else if (text === '') {
      setBtnDisabled(true);
      setMessage(null);
    } else if (text !== '' && text.trim().length < 4) {
      setBtnDisabled(true);
      setMessage('Please enter at least 5 characters.');
    } else {
      setBtnDisabled(false);
      setMessage(null);
    }
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    addReply(id, user.id, text);
    setText('');
    setBtnDisabled(true);
    socket?.emit('sendReplyNotification', {
      senderId: user.id,
      receiverId: userID,
      review: review,
    });
  };

  return (
    <>
      <div className='input-group text-neutral-content'>
        <input
          className='review-input bg-teal-800 text-lg input input-bordered'
          onChange={handleTextChange}
          type='text'
          placeholder='Write a reply'
          value={text}
        />
        <button
          type='submit'
          onClick={handleSubmit}
          className='btn btn-success hover:bg-teal-400'
          disabled={btnDisabled}
        >
          Send
        </button>
      </div>
      {message && <div className='message'>{message}</div>}
    </>
  );
}

export default ReplyForm;
