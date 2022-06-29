import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';
import { showErrorMessage } from './index';
const emailBlastSchema = new schema.Entity('emailBlasts');
const recipientSchema = new schema.Entity('recipients');
const draft = new schema.Entity('drafts');

export const sendEmail =
  (from, to, cc, bcc, subject, content, files) => (dispatch, getState) => {
    return apnSDK
      .sendEmail(from, to, cc, bcc, subject, content, files)
      .then(() => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: 'Email sent successfully',
            type: 'hint',
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: err.message || err,
            type: 'error',
          },
        });
        throw err;
      });
  };

export const sendTestEmail = (subject, content) => (dispatch, getState) => {
  const currentUser = getState().controller.currentUser;
  return apnSDK
    .sendEmail(
      currentUser.get('email'),
      currentUser.get('email'),
      null,
      null,
      subject,
      content
    )
    .then(() => {
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        message: {
          message: `A test email has been sent to ${currentUser.get('email')}`,
          type: 'info',
        },
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const sendEmailToAM =
  (to, cc, subject, content, files) => (dispatch, getState) => {
    const from = getState().controller.currentUser.get('email');

    return apnSDK
      .sendEmail(from, to, cc, null, subject, content, files)
      .then(() => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: 'Email sent successfully',
            type: 'hint',
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: err.message || err,
            type: 'error',
          },
        });
        throw err;
      });
  };

export const sendEmailToJobUsers =
  (to, subject, content, files) => (dispatch, getState) => {
    const from = getState().controller.currentUser.get('email');

    return apnSDK
      .sendEmail(from, to, from, null, subject, content, files)
      .then(() => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: 'Email sent successfully',
            type: 'hint',
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: err.message || err,
            type: 'error',
          },
        });
        throw err;
      });
  };

export const sendEmailToTalents =
  (bcc, subject, content, files) => (dispatch, getState) => {
    const from = getState().controller.currentUser.get('email');

    return apnSDK
      .sendEmail(from, from, null, bcc, subject, content, files)
      .then(() => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: 'Email sent successfully',
            type: 'hint',
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            message: err.message || err,
            type: 'error',
          },
        });
        throw err;
      });
  };

export const sendEmailByList = (params) => (dispatch) => {
  return apnSDK
    .sendEmailByList(params)
    .then(() => {
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        message: {
          message: 'Email sent successfully',
          type: 'hint',
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.ADD_MESSAGE,
        message: {
          message: err.message || err,
          type: 'error',
        },
      });
      throw err;
    });
};

export const upsertEmailBlast =
  (newList, oldListId) => (dispatch, getState) => {
    return apnSDK
      .upsertEmailBlast(newList, oldListId)
      .then(({ response }) => {
        console.log('upsert email blast', response);
        const normalizedData = normalize(response, emailBlastSchema);
        dispatch({
          type: ActionTypes.UPSERT_EMAIL_BLAST,
          normalizedData,
        });

        return response;
      })
      .catch((err) => dispatch(showErrorMessage(err)));
  };

// export const getEmailBlast = listId => (dispatch, getState) => {
//   return apnSDK
//     .getHotList(listId)
//     .then(({ response }) => {
//       console.log('hotList list', response);
//
//       const normalizedData = normalize(response, emailBlastSchema);
//       dispatch({
//         type: ActionTypes.GET_EMAIL_BLAST_LIST,
//         normalizedData
//       });
//     })
//     .catch(err => dispatch(showErrorMessage(err)));
// };

export const addTalentToEmailBlast = (listId, talentIds) => (dispatch) => {
  return apnSDK
    .addEmailBlastRecipientsFromTalents(listId, talentIds)
    .then(({ response }) => {
      console.log('get Recipients', response);
      const normalizedData = normalize(response, [recipientSchema]);
      dispatch({
        type: ActionTypes.ADD_EMAIL_BLAST_RECIPIENT,
        normalizedData,
        listId,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const addContactsToEmailBlast = (listId, talentIds) => (dispatch) => {
  return apnSDK
    .addEmailBlastRecipientsFromContacts(listId, talentIds)
    .then(({ response }) => {
      console.log('get Recipients', response);
      const normalizedData = normalize(response, [recipientSchema]);
      dispatch({
        type: ActionTypes.ADD_EMAIL_BLAST_RECIPIENT,
        normalizedData,
        listId,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const addRecipientToEmailBlast = (listId, recipients) => (dispatch) => {
  return apnSDK
    .addEmailBlastRecipients(listId, recipients)
    .then(({ response }) => {
      console.log('add Recipients', response);
      const normalizedData = normalize(response, [recipientSchema]);
      dispatch({
        type: ActionTypes.ADD_EMAIL_BLAST_RECIPIENT,
        normalizedData,
        listId,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const getEmailBlastRecipients = (listId) => (dispatch) => {
  return apnSDK
    .getEmailBlastRecipients(listId)
    .then(({ response }) => {
      console.log('get Recipients', response);
      const normalizedData = normalize(response, [recipientSchema]);
      dispatch({
        type: ActionTypes.GET_EMAIL_BLAST_RECIPIENTS,
        normalizedData,
        listId,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const deleteEmailBlastRecipient =
  (listId, recipientId) => (dispatch, getState) => {
    return apnSDK
      .deleteEmailBlastRecipient(listId, recipientId)
      .then((response) => {
        console.log('delete recipientId', response);
        dispatch({
          type: ActionTypes.DELETE_EMAIL_BLAST_RECIPIENT,
          listId,
          recipientId,
        });
        return response;
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
      });
  };

export const getMyEmailBlastList = () => (dispatch, getState) => {
  return apnSDK
    .getMyEmailBlastList()
    .then(({ response }) => {
      console.log('my email-blast list', response);

      const normalizedData = normalize(response, [emailBlastSchema]);
      dispatch({
        type: ActionTypes.GET_EMAIL_BLAST_LIST,
        normalizedData,
      });
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};

export const deleteEmailBlast = (listId) => (dispatch, getState) => {
  return apnSDK
    .deleteEmailBlast(listId)
    .then(() => {
      dispatch({
        type: ActionTypes.DELETE_EMAIL_BLAST,
        listId,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
    });
};

export const draftList = () => (dispatch, getState) => {
  return apnSDK.draftList().then(({ response }) => {
    console.log('draft', response);
    const normalizedData = normalize(response, [draft]);
    console.log(normalizedData);

    dispatch({
      type: ActionTypes.GET_EMAILBLAST_DRAFT_LIST,
      normalizedData,
    });
  });
};

export const upsertDraft = (draft, draftId) => (dispatch, getState) => {
  return apnSDK.upsertEmailDraft(draft, draftId).then(({ response }) => {
    console.log('draft', response);
    dispatch({
      type: ActionTypes.UPSERT_DRAFT,
      draft: response,
    });
  });
};

export const deleteDraft = (draftId) => (dispatch, getState) => {
  return apnSDK.deleteEmailDraft(draftId).then(({ response }) => {
    console.log('draft', response);
    dispatch({
      type: ActionTypes.DELETE_DRAFT,
      draftId: draftId.toString(),
    });
  });
};

//EmailBlast changeStatus

export const changeEmailStatus = (id, status) => (dispatch, getState) => {
  return apnSDK
    .changeEmailStatus(id, status)
    .then(({ response }) => {
      console.log('changeEmailStatus', response);
      const normalizedData = normalize(response, emailBlastSchema);
      dispatch({
        type: ActionTypes.UPSERT_EMAIL_BLAST,
        normalizedData,
      });
      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};
