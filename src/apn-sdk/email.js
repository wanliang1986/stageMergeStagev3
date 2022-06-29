import authRequest from './request';

export const sendEmail = (from, to, cc, bcc, subject, content, files) => {
  const requestBody = new FormData();

  if (cc) {
    requestBody.append('cc', cc);
  }
  if (bcc) {
    requestBody.append('bcc', bcc);
  }
  requestBody.append('to', to);
  requestBody.append('from', from);
  requestBody.append('subject', subject || '( no subject )');
  requestBody.append('html_content', content);
  if (files) {
    files.forEach((file) => requestBody.append('files', file));
  }
  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };
  //catch server error and resolve it
  return authRequest.send(`/send_rich_mail`, config);
};

export const upsertEmailBlast = (emailBlast, emailBlastId = '') => {
  const config = {
    method: emailBlastId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBlast),
  };

  return authRequest.send(`/mailing-list/${emailBlastId}`, config);
};

export const addEmailBlastRecipients = (listId, recipients) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(recipients),
  };

  return authRequest.send(`/mailing-list/${listId}`, config);
};

export const addEmailBlastRecipientsFromTalents = (listId, talentIds) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentIds),
  };

  return authRequest.send(`/mailing-list/${listId}/talent`, config);
};

export const addEmailBlastRecipientsFromContacts = (listId, talentIds) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(talentIds),
  };

  return authRequest.send(`/mailing-list/${listId}/contact`, config);
};

export const getEmailBlastRecipients = (listId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/mailing-list/${listId}`, config);
};

export const deleteEmailBlastRecipient = (listId, recipientId) => {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.send(`/mailing-list/${listId}/${recipientId}`, config);
};

export const getMyEmailBlastList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/mailing-list`, config);
};

export const deleteEmailBlast = (listId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/mailing-list/${listId}`, config);
};

export const uploadAttachment = (file) => {
  const requestBody = new FormData();
  requestBody.append('file', file);

  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };

  return authRequest.send(`/files/email-attachment`, config);
};

export const sendEmailByList = (data) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  //catch server error and resolve it
  return authRequest.send(`/send-email-by-list`, config);
};

export const getMyEmailBlastHistoryList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/email/history?page=0&size=10000`, config);
};

export const draftList = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/email/draft?page=0&size=10000`, config);
};

export const upsertEmailDraft = (draft, draftId = '') => {
  const config = {
    method: draftId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(draft),
  };

  return authRequest.send(`/email/draft/${draftId}`, config);
};

export const deleteEmailDraft = (draftId = '') => {
  const config = {
    method: 'DELETE',
    headers: {},
  };

  return authRequest.send(`/email/draft/${draftId}`, config);
};

export const getEmailReport = (from, to) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/email/stats?from=${from}&to=${to}`, config);
};

export const getEmailDetailByIdByStatus = (blastId, status) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/email/stats/details/${blastId}?metric=${status}`,
    config
  );
};

//change email status
export const changeEmailStatus = (id, status) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: status,
    }),
  };
  return authRequest.send(`/mailing-list/${id}/change-status`, config);
};
