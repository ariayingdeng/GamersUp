import React from 'react';
import ReplyForm from './ReplyForm';
import ReplyList from './ReplyList';
import { FaTimes } from 'react-icons/fa';

function Replies({ review, setOpenReplies, replies, socket }) {
  return (
    <div className='w-full review-card bg-teal-900'>
      <button onClick={() => setOpenReplies(false)} className='close'>
        <FaTimes className='text-teal-200' />
      </button>
      <ReplyForm review={review} socket={socket} />
      <ReplyList replies={replies} />
    </div>
  );
}

export default Replies;
