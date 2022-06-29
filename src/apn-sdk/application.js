/**
 * Created by chenghui on 5/31/17.
 */
import authRequest from './request';

export const addApplication = (application) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  };

  return authRequest.send(`/applications`, config);
};

export const addApplicationPayrolling = (application) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  };

  return authRequest.send(`/applications/payroll-job`, config);
};

export const getApplication = (applicationId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/applications/${applicationId}`, config);
};

export const updateApplication = (application, applicationId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  };

  return authRequest.send(`/applications/${applicationId}`, config);
};

export const updateApplication2 = (application, applicationId) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  };

  return authRequest.send(`/applications/full-update/${applicationId}`, config);
};

export const reactiveApplication = (application) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  };

  return authRequest.send(`/applications/reactive-reject`, config);
};

export const getActivitiesByApplication = (applicationId) => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return authRequest.send(`/activities?applicationId=${applicationId}`, config);
};

export const getApplicationCommissions = (applicationId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/application-commissions/applicationId/${applicationId}`,
    config
  );
};

export const updateApplicationCommissions = (
  applicationId,
  applicationCommissions
) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(applicationCommissions),
  };

  return authRequest.send(
    `/application-commissions/applicationId/${applicationId}`,
    config
  );
};

export const getApplicationOfferLetterParam = () => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/offer-letter-cost-rates`, config);
};

export const createApplicationOfferLetter = (OfferLetter) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(OfferLetter),
  };

  return authRequest.send(`/application-offer-letters`, config);
};

export const updateApplicationOfferLetter = (applicationId) => {
  const config = {
    method: 'PUT',
    headers: {},
  };

  return authRequest.send(
    `/application-offer-letters/applicationId/${applicationId}`,
    config
  );
};

export const getOfferLettersByApplicationId = (applicationId) => {
  const config = {
    method: 'get',
    headers: {},
  };

  return authRequest.send(
    `/application-offer-letters/applicationId/${applicationId}`,
    config
  );
};
