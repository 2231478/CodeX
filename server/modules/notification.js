const notificationModule = {
  createAndNotifyUser: async (dbHelper, data, userSocketMap) => {
    const { title, message, userId, reservationId } = data;
    const notification = {
      title,
      message,
      isRead: false,
      userId,
      reservationId,
      createdAt: new Date()
    };

    const saved = await dbHelper.create('notification', notification);

    const userWs = userSocketMap?.get(userId);
    if (userWs && userWs.readyState === 1) {
      userWs.send(JSON.stringify({
        type: 'notification',
        notification: {
          title,
          message,
          createdAt: notification.createdAt,
        }
      }));
    }

    return saved;
  },
};

export default notificationModule;
