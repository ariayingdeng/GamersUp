import { useContext, useState, useEffect } from 'react';
import UserContext from '../context/user/UserContext';
import AlertContext from '../context/alert/AlertContext';
import {
  LockClosedIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
} from '@heroicons/react/solid';
import { Link, useNavigate } from 'react-router-dom';
import Home from './Home';
import jwtDecode from 'jwt-decode';

function LoginForm() {
  const navigate = useNavigate();

  // Set show password icon and function
  const [showPassword, setShowPassword] = useState(false);

  const { setAlertWithTimeout } = useContext(AlertContext);

  const {
    isLoggedIn,
    executeAuthenticationService,
    getUserInfoByEmail,
    executeGoogleAuthService,
  } = useContext(UserContext);

  // not working for now
  // const REGISTER_SESSION = process.env.REACT_APP_REGISTER_SESSION

  useEffect(() => {
    if (isLoggedIn()) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    await executeAuthenticationService(email, password)
      .then((response) => {
        if (response.status === 200) {
          getUserInfoByEmail(email);
          navigate('/', { replace: true });
        } else {
          setAlertWithTimeout('Invalid credentials.', 'error');
        }
      })
      .catch((err) => {
        if (err.response) {
          setAlertWithTimeout('Invalid credentials.', 'error');
        } else if (err.request) {
          setAlertWithTimeout('Please try again later.', 'error');
        } else {
          setAlertWithTimeout('Please try again later.', 'error');
        }
      });
  };

  /** For Google Login */
  const handleCallbackResponse = async (response) => {
    const user = jwtDecode(response.credential);
    await executeGoogleAuthService(user.name, user.email, user.picture)
      .then(() => {
        getUserInfoByEmail(user.email);
      })
      .catch((err) => {
        if (err.response) {
          setAlertWithTimeout(err.response.data.error, 'error');
        } else if (err.request) {
          setAlertWithTimeout(err.request, 'error');
        } else {
          setAlertWithTimeout(err.message, 'error');
        }
      });
  };

  useEffect(() => {
    /* global google: from the google script in index.html */
    google.accounts.id.initialize({
      client_id:
        '319829939398-2m69isi5ul5mbq7o5mub2u0kvn9suvge.apps.googleusercontent.com',
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large' }
    );
  }, []);

  if (isLoggedIn()) {
    return <Home />;
  } else {
    return (
      <>
        <div className='card card-side bg-base-100 shadow-xl w-1/2 mt-3 mb-3 mx-auto'>
          <div className='min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mx-auto'>
            <div className='max-w-md space-y-8'>
              <div>
                <h2 className='text-center text-3xl font-extrabold text-neutral-content'>
                  Sign in to your account
                </h2>
                <p className='mt-2 text-center text-xl text-neutral-content'>
                  OR{' '}
                  <Link
                    to='/signup'
                    className='font-medium text-primary hover:text-primary-focus'
                  >
                    create a new account
                  </Link>
                </p>
              </div>
              <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                <input type='hidden' name='remember' defaultValue='true' />
                <div className='rounded-md shadow-sm space-y-px'>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500 text-lg'>
                        <MailIcon
                          className='h-5 w-5 text-secondary group-hover:text-secondary-focus'
                          aria-hidden='true'
                        />
                      </span>
                    </div>
                    <label htmlFor='email-address' className='sr-only'>
                      Email address
                    </label>
                    <input
                      type='email'
                      name='email'
                      required
                      className='block w-full pl-10 pr-12 text-lg placeholder-gray-500 text-gray-900 border-primary rounded-t-md focus:ring-primary-focus focus:border-primary-focus focus:outline-none focus:z-10'
                      placeholder='Email address'
                    />
                  </div>

                  <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <span className='text-gray-500 text-lg'>
                        <LockClosedIcon
                          className='h-5 w-5 text-secondary group-hover:text-secondary-focus'
                          aria-hidden='true'
                        />
                      </span>
                    </div>
                    <label htmlFor='password' className='sr-only'>
                      Password
                    </label>
                    <input
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      required
                      className='block w-full pl-10 pr-12 border-primary placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-focus focus:border-primary-focus focus:z-10 text-lg'
                      placeholder='Password'
                    />
                    <div className='absolute inset-y-0 right-3 flex items-center'>
                      {showPassword ? (
                        <EyeIcon
                          className='h-5 w-5 text-secondary group-hover:text-secondary-focus'
                          aria-hidden='true'
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <EyeOffIcon
                          className='h-5 w-5 text-secondary group-hover:text-secondary-focus'
                          aria-hidden='true'
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='h-4 w-4 text-primary focus:ring-primary-focus border-primary-focus rounded'
                    />
                    <label
                      htmlFor='remember-me'
                      className='ml-2 block text-sm text-neutral-content'
                    >
                      Remember me
                    </label>
                  </div>

                  <div>
                    <Link
                      to='/forgotpassword'
                      className='text-base font-bold text-primary hover:text-primary-focus'
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-medium rounded-md btn btn-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus'
                  >
                    {/* <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                      <LockClosedIcon
                        className='h-5 w-5 text-secondary group-hover:text-secondary-focus'
                        aria-hidden='true'
                      />
                    </span> */}
                    Sign in
                  </button>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-xl text-neutral-content'>OR</p>
                  <div id='google-signin-button'></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoginForm;