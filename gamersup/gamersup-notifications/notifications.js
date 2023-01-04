import { Server } from 'socket.io';

const io = new Server({
  /* options */
  cors: {
    origin: 'http://localhost:5252',
  },
});

let onlineUsers = [];

const addNewUser = (socketId, userId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ socketId, userId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  socket.on('userLogin', (userId) => {
    addNewUser(socket.id, userId);
    console.log(userId + ' ' + socket.id + ' connected');
    console.log(JSON.stringify(onlineUsers));
  });

  socket.on('userLogout', () => {
    removeUser(socket.id);
    console.log(socket.id + ' logout');
    console.log(JSON.stringify(onlineUsers));
  });

  /** Notification types:
   * type = 1: like profile, 
   * type = 2: friend request, 
   * type = 3: friend request accepted, 
   * type = 4: replies of comments, 
   * type = 5: chat reminder */ 
  socket.on('sendNotification', ({ senderId, receiverId, type }) => {
    console.log(
      'Notification sent ' + senderId + ' ' + receiverId + ' ' + type
    );
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getNotification', {
        senderId,
        type,
      });
      console.log('receiver ' + receiver.userId + ' ' + receiver.socketId);
    }
    console.log(JSON.stringify(onlineUsers));
  });

  // For chat icon reminder
  socket.on('sendChatReminder', ({ senderId, type }) => {
    console.log('Chat sent ' + senderId + ' ' + type);
    io.emit('getChatReminder', {
      senderId,
      type,
    });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log(socket.id + ' disconnected');
    console.log(JSON.stringify(onlineUsers));
  });
});

io.listen(3200);
