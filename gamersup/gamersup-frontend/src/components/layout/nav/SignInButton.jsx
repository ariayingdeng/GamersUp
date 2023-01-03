import React from 'react';
import { Link } from 'react-router-dom';

function SignInButton() {
  return (
    <Link to='/login' className='btn btn-ghost btn-lg rounded-btn ml-3'>
      Sign In
    </Link>
  );
}

export default SignInButton;
