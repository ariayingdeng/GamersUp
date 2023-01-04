import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import FriendComponent from '../components/account/FriendComponent';

const ws = socketIOClient('http://localhost:3000');
// const useMountEffect = (fun) => useEffect(fun, [])

function ChatRoom({ socket }) {
  // socket: for notifications
  const scrollRef = useRef(null);
  const [userList, setUserList] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('user'));

  // useMountEffect(() => {
  // ws.off('join_user').on('joined_user', (data) => {
  //   if (data !== null && data.id > 0) {
  //     getMessage(data, 'join')
  //   }
  //   // })
  //   ws.on('joined_user', (data) => {
  //     if (data !== null && data.id > 0) {
  //       getMessage(data, 'join')
  //     }
  //   })
  //   ws.on('message', (data) => {
  //     getMessage(data, 'message')
  //   })
  //   ws.on('left', (data) => {
  //     getMessage(data, 'left')
  //   })
  //   ws.on('user-list', (data) => {
  //     if (data !== null) setUserList(data)
  //   })

  //   return () => {
  //     ws.off('joined_user')
  //     ws.off('message')
  //     ws.off('left')
  //     ws.off('user-list')
  //   }
  // }, [])

  useEffect(() => {
    ws.on('joined_user', (data) => {
      if (data !== null && data.id > 0) {
        getMessage(data, 'join');
      }
    });
    ws.on('message', (data) => {
      getMessage(data, 'message');
    });
    ws.on('left', (data) => {
      getMessage(data, 'left');
    });
    ws.on('user-list', (data) => {
      if (data !== null) setUserList(data);
    });

    return () => {
      ws.off('joined_user');
      ws.off('message');
      ws.off('left');
      ws.off('user-list');
    };
  }, [ws]);

  useEffect(() => {
    if (user !== null) {
      ws.emit('join', user);
    }

    return () => {
      ws.off('joined');
    };
  }, [ws]);

  // Update the userList
  // useEffect(() => {
  //   ws.on('user-list', (data) => {
  //     if (data !== null) setUserList(data);
  //   });

  //   return () => {
  //     ws.off('user-list');
  //   };
  // }, [ws]);

  const getMessage = (data, type) => {
    let messageBox = document.querySelector('.message');
    var scrollHeight = messageBox.scrollHeight;
    let messageContainer = document.createElement('div');
    switch (type) {
      case 'message':
        messageContainer.innerText = data.name + ': ' + data.message;
        break;
      case 'join':
        messageContainer.innerText = data.name + ' joined the room';
        break;
      case 'left':
        messageContainer.innerText = data.name + ' left the room';
        break;
      default:
        break;
    }
    messageContainer.classList.add('text-left');
    messageContainer.classList.add('m-2');
    messageBox.appendChild(messageContainer);
    scrollRef.current.scrollTo({
      behavior: 'smooth',
      top: scrollHeight,
    });
  };

  const sendMessage = (e) => {
    if (document.querySelector('.messageInput').value === '') return;
    const message = document.querySelector('.messageInput').value;
    document.querySelector('.messageInput').value = '';
    ws.emit('sendMessage', {
      name: user.name,
      message: message,
    });
    // For chat reminder on the nav bar
    socket.emit('sendChatReminder', {
      senderId: user.id,
      type: 5,
    });
  };

  return (
    <div className='grid grid-cols-5 gap-5 my-5 mr-5'>
      <div
        className='card bg-base-200 shadow-xl col-span-4'
        style={{ height: '30rem' }}
      >
        <h1 className='text-center text-xl  bg-base-300 py-5'>Chat Room</h1>
        <div
          className='messageBox overflow-auto'
          style={{ height: '25rem' }}
          ref={scrollRef}
        >
          <div className='message'></div>
        </div>
        <div>
          <input
            type='text'
            className='messageInput text-black mx-3 rounded'
            placeholder='Type your message here'
            style={{ width: '85%' }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className='btn btn-primary m-2 px-7'
            style={{ width: '10%' }}
          >
            Send
          </button>
        </div>
      </div>

      <ul
        tabIndex='0'
        className='p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-60'
      >
        <li>
          <a
            href='https://discord.com/channels/1005230771893702808/1005230771893702811'
            target='_blank'
            className='btn btn-ghost bg-base-300'
          >
            Discord
          </a>
        </li>
        {Object.keys(userList).map((socketID) => (
          <FriendComponent
            key={userList[socketID].id}
            friend={userList[socketID]}
          />
        ))}
      </ul>
    </div>
  );
}

export default ChatRoom;
