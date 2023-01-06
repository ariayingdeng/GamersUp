import React from 'react';
import ReplyItem from './ReplyItem';

function ReplyList({ replies }) {

  return (
    <>
      {replies?.map((reply) => (
        <ReplyItem key={reply.id} reply={reply} />
      ))}
    </>
  );
}

export default ReplyList;
