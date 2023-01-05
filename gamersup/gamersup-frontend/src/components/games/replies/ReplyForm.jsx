import React, { useState, useContext } from 'react';
import UserContext from '../../../context/user/UserContext';
import ReplyContext from '../../../context/games/ReplyContext';

function ReplyForm({ reviewID }) {
  const { user, isLoggedIn } = useContext(UserContext);
  const { addReply } = useContext(ReplyContext);

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
    addReply(reviewID, user.id, text);
    setText('');
    setBtnDisabled(true);
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
          className='btn btn-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus'
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
