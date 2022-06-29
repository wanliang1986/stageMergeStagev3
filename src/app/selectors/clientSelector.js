import { createSelector } from 'reselect';
import Immutable from 'immutable';

const getCurrentUser = (state) => state.controller.currentUser;
const getClients = (state) => state.model.clients;
const getCompanies = (state) => state.model.companies;
const getCurrentClientId = (_, currentClientId) => currentClientId;
const getCompanyId = (_, companyId) => parseInt(companyId, 10);

export const getMyClientList = createSelector(
  [getClients, getCurrentUser],
  (clients, currentUser) => {
    // console.log('client selector');
    const currentUserId = currentUser.get('id');
    const tenantId = currentUser.get('tenantId');
    const isAdmin =
      currentUser.get('authorities') &&
      currentUser
        .get('authorities')
        .includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
    return clients
      .filter(
        (client) =>
          isAdmin ||
          client.get('accountManagerId') === currentUserId ||
          client.get('createdBy') === `${currentUserId},${tenantId}`
      )
      .toList();
  }
);

export const getClientListByCompany = createSelector(
  [getClients, getCompanyId],
  (clients, companyId) => {
    // console.log(clients.toJS());
    return clients
      .filter((client) => client.get('companyEntityId') === companyId)
      .toList();
  }
);

export const getClientContactArrayByCompany = createSelector(
  [getClientListByCompany],
  (clientContactList) => {
    // console.log(clients.toJS());
    return clientContactList.toJS();
  }
);

export const getHasApprovedClientContactByCompany = createSelector(
  [getClientListByCompany],
  (clientContactList) => {
    // console.log(clients.toJS());
    let list = clientContactList.filter(
      (client) => client.get('inactived') === false && client.get('approverId')
    );
    return list.toJS();
  }
);

export const getActiveClientList = createSelector(
  [getClients, getCurrentClientId],
  (clients, currentClientId) => {
    return clients
      .filter(
        (client) => client.get('active') || client.get('id') === currentClientId
      )
      .toList();
  }
);

export default getMyClientList;
