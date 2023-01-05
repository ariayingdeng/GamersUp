import React from 'react';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';
import { FaTimes } from 'react-icons/fa';

function Replies({ reviewID, setOpenReplies, replies }) {
  return (
    <div className='w-full review-card bg-teal-900'>
      <button onClick={() => setOpenReplies(false)} className='close'>
        <FaTimes color='pink' />
      </button>
      <ReplyForm reviewID={reviewID} />
      <ReplyList replies={replies} />
    </div>
  );
}

export default Replies;
