const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const users = {};

io.on('connection', (socket) => {
  socket.on('join', (user) => {
    if (user != null && user.id > 0) {
      users[socket.id] = user;
      console.log('User: ' + users[socket.id].name + socket.id);
      socket.broadcast.emit('joined_user', user);
      io.emit('user-list', users);
    }
  });

  socket.on('sendMessage', (data) => {
    console.log(data);
    io.emit('message', data);
  });

  socket.on('chat_message', (message) => {
    socket.broadcast.emit('chat', {
      name: users[socket.id],
      message: message,
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket user: ' + users[socket.id]);
    console.log('Left: ' + socket.id);
    if (users[socket.id] != null || users[socket.id] != undefined) {
      io.emit('left', {
        name: users[socket.id].name,
        message: users[socket.id] + ' left the chat room',
      });
    }
    delete users[socket.id];
    io.emit('user-list', users);
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000...');
});
