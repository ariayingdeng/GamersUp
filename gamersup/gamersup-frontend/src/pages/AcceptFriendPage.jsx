import { useContext } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from '../context/user/UserContext';

function AcceptFriendPage() {
  const { acceptFriend } = useContext(UserContext);
  const params = useParams();

  useEffect(() => {
    acceptFriend(params.idA, params.idB);
  }, []);

  // useEffect(() => {
  //   socket?.emit('sendNotification', {
  //     senderId: params.idA,
  //     receiverId: params.idB,
  //     type: 3,
  //   });
  //   socket?.emit('sendNotification', {
  //     senderId: params.idB,
  //     receiverId: params.idA,
  //     type: 3,
  //   });
  // }, [socket, params.idA, params.idB]);

  return (
    <p className='text-2xl text-center'>
      Congratulations! You accepted the friend request!
      <span className='material-symbols-outlined ml-5'>diversity_1</span>
    </p>
  );
}

export default AcceptFriendPage;
