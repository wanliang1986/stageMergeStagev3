import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getEmailBlasts = (state) => state.relationModel.emailBlasts;
const getEmailBlastId = (_, emailBlastId) => parseInt(emailBlastId, 10);
const getRecipients = (state) => state.relationModel.recipients;

const getEmailBlastList = createSelector([getEmailBlasts], (emailBlasts) => {
  return (
    emailBlasts
      // .filter(emailBlast => emailBlast.get('id'))
      .sortBy(
        (emailBlast) => emailBlast.get('id'),
        (a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .toList()
  );
});

export default getEmailBlastList;

export const getRecipientList = createSelector(
  [getEmailBlastId, getEmailBlasts, getRecipients],
  (emailBlastId, emailBlasts, recipients) => {
    const recipientIds = emailBlasts.getIn([
      String(emailBlastId),
      'recipientIds',
    ]);
    return recipientIds
      ? recipientIds
          .map((recipientId) => recipients.get(String(recipientId)))
          .sortBy(
            (el) => el.get('id'),
            (a, b) => {
              if (a < b) {
                return 1;
              }
              if (a > b) {
                return -1;
              }
              if (a === b) {
                return 0;
              }
            }
          )
          .toList()
      : Immutable.List();
  }
);
