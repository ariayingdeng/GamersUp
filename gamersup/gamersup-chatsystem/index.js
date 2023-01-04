const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const users = {};

const addUser = (socketId, user) => {
  !users[socketId] && (users[socketId] = user);
};

const removeUser = (socketId) => {
  if (users[socketId]) {
    delete users[socketId];
  }
};

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    if (user != null && user.id > 0) {
      addUser(socket.id, user);
      console.log('User joined: ' + users[socket.id].name + ' ' + socket.id);
      socket.broadcast.emit('message', {
        name: user.name,
        message: ' joined the chat room',
        type: 'join',
      });
      io.emit('user-list', users);
    }
  });

  socket.on('requestUserList', () => {
    io.emit('user-list', users);
  })

  socket.on('sendMessage', ({ name, message }) => {
    io.emit('message', {
      name,
      message,
      type: 'chat',
    });
  });

  socket.on('disconnect', () => {
    if (users[socket.id] != null || users[socket.id] != undefined) {
      console.log('Left: ' + users[socket.id].name + ' ' + socket.id);
      io.emit('message', {
        name: users[socket.id].name,
        message: ' left the chat room',
        type: 'left',
      });
    }
    removeUser(socket.id);
    io.emit('user-list', users);
  });
});

// io.on('connection', (socket) => {
//   socket.on('join', (user) => {
//     if (user != null && user.id > 0) {
//       users[socket.id] = user;
//       console.log('User joined: ' + users[socket.id].name + ' ' + socket.id);
//       console.log(JSON.stringify(users));
//       socket.broadcast.emit('joined_user', user);
//       io.emit('user-list', users);
//     }
//   });

//   socket.on('sendMessage', (data) => {
//     console.log(data);
//     io.emit('getMessage', data);
//   });

//   socket.on('chat_message', (message) => {
//     socket.broadcast.emit('chat', {
//       name: users[socket.id],
//       message: message,
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('Socket user: ' + users[socket.id]);
//     console.log('Left: ' + socket.id);
//     if (users[socket.id] != null || users[socket.id] != undefined) {
//       io.emit('left', {
//         name: users[socket.id].name,
//         message: users[socket.id] + ' left the chat room',
//       });
//     }
//     delete users[socket.id];
//     io.emit('user-list', users);
//   });
// });

server.listen(3000, () => {
  console.log('Server started on port 3000...');
});
