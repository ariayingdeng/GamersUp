import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForgotPassword from './components/account/ForgotPassword';
import LoginForm from './pages/LoginForm';
import ResetPassword from './components/account/ResetPassword';
import SignupForm from './pages/SignupForm';
import GamesList from './components/games/GamesList';
import Alert from './components/layout/Alert';
import Footer from './components/layout/Footer';
import Navbar from './components/layout/Navbar';
import { AlertProvider } from './context/alert/AlertContext';
import { GamesProvider } from './context/games/GamesContext';
import { UserProvider } from './context/user/UserContext';
import { ReviewProvider } from './context/games/ReviewContext';
import { ChatProvider } from './context/chat/ChatContext';
import { ReplyProvider } from './context/games/ReplyContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import GameDetailsPage from './pages/GameDetailsPage';
import GamerProfile from './pages/GamerProfile';
import Settings from './pages/Settings';
import AcceptFriendPage from './pages/AcceptFriendPage';
import ChatRoom from './pages/ChatRoom';
import RecommendationPage from './pages/RecommendationPage';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import useSocket from './hooks/useSocket';

function App() {
  const socket = useSocket();

  return (
    <GamesProvider>
      <UserProvider>
        <ReviewProvider>
          <ReplyProvider>
            <AlertProvider>
              <ChatProvider>
                <Router>
                  <div className='flex flex-col justify-between h-screen'>
                    <Navbar socket={socket} />
                    <main className='container mx-auto px-4 pb-15'>
                      <Alert />
                      <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/platform/:id' element={<GamesList />} />
                        <Route
                          path='/game/:gameid'
                          element={<GameDetailsPage socket={socket} />}
                        />
                        <Route path='/login' element={<LoginForm />} />
                        <Route path='/signup' element={<SignupForm />} />
                        <Route
                          path='/forgotpassword'
                          element={<ForgotPassword />}
                        />
                        <Route
                          path='/resetpassword'
                          element={<ResetPassword />}
                        />
                        <Route
                          path='/profile/:id'
                          element={<GamerProfile socket={socket} />}
                        />
                        <Route
                          path='/acceptFriend/:idA&:idB'
                          element={<AcceptFriendPage />}
                        />
                        <Route
                          path='/settings'
                          element={
                            <AuthenticatedRoute>
                              <Settings />
                            </AuthenticatedRoute>
                          }
                        />
                        <Route
                          path='/recommendations/:id'
                          element={
                            <AuthenticatedRoute>
                              <RecommendationPage socket={socket} />
                            </AuthenticatedRoute>
                          }
                        />
                        <Route
                          path='/chatRoom'
                          element={
                            <AuthenticatedRoute>
                              <ChatRoom socket={socket} />
                            </AuthenticatedRoute>
                          }
                        />
                        <Route path='/*' element={<NotFound />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </ChatProvider>
            </AlertProvider>
          </ReplyProvider>
        </ReviewProvider>
      </UserProvider>
    </GamesProvider>
  );
}

export default App;
