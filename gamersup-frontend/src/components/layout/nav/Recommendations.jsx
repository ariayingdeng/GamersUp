import React from 'react';
import { Link } from 'react-router-dom';

function Recommendations() {
  return (
    <Link
      to={`/recommendations/${JSON.parse(sessionStorage.getItem('user')).id}`}
      className='btn btn-ghost btn-lg rounded-btn ml-3'
    >
      Recommendations
    </Link>
  );
}

export default Recommendations;
