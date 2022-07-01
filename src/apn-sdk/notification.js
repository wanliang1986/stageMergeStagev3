import authRequest from './request';

export const deleteNotification = (notificationId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/notifications/${notificationId}`, config);
};

export const getMyNotifications = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/my-notifications?size=1000`, config);
};

/*
*
*
JobUpdate(1), ApplicationUpdate(2);

{“id”:1,
“userId”:3,
“type”:“JobUpdate”,
“content”:“xxxxx”
}
*
*
*
*
*
* */
