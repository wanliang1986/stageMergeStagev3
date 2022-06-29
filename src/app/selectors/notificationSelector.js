import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getNotifications = (state) => state.model.notifications;
const getNotificationType = (_, type) => type;

const getNotificationList = createSelector(
    [getNotifications, getNotificationType],
    (notifications, type) => {
        return notifications.filter(notification => !type || notification.get('type') === type)
            .map(notification => {
                if (type === 'ApplicationUpdate') {
                    // console.log(notification.get('content'));
                    return notification.merge(Immutable.fromJS(JSON.parse(notification.get('content'))))
                }
                return notification
            })
            .toList()
        // .sortBy((activity) => activity.get('createdDate'),
        //     (a, b) => {
        //         if (a < b) {
        //             return 1;
        //         }
        //         if (a > b) {
        //             return -1;
        //         }
        //         if (a === b) {
        //             return 0;
        //         }
        //     }
        // )

    }
);
export default getNotificationList;