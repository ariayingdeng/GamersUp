const handleNotification = (socket, senderId, receiverId, type) => {
  socket.emit('sendNotification', { senderId, receiverId, type });
};

export default { handleNotification };
