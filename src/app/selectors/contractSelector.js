import { createSelector } from 'reselect';
import Immutable from 'immutable';
import moment from 'moment-timezone';

const getContracts = (state) => state.model.contracts;
const getCompanyId = (_, companyId) => parseInt(companyId, 10);
const getContractId = (_, selectedContractId) => {
  return selectedContractId + '';
};
const getUsers = (state) => state.model.users;

export const getContractsListByCompany = createSelector(
  [getContracts, getCompanyId],
  (contractList, companyId) => {
    return contractList
      .filter((contract) => contract.get('companyId') === companyId)
      .toList()
      .map((contract) => {
        let newMap = contract
          // .update('startDate', value => value.substring(0, 10))
          // .update('endDate', value => (value ? value.substring(0, 10) : null))
          // .update('lastModifiedDate', value => value.substring(0, 10));
          .update('startDate', (value) => moment(value).format('YYYY-MM-DD'))
          .update('endDate', (value) => moment(value).format('YYYY-MM-DD'))
          .update('lastModifiedDate', (value) =>
            moment(value).format('YYYY-MM-DD')
          );
        return newMap;
      });
  }
);

export const getContractById = createSelector(
  [getContracts, getContractId],
  (contractList, contractId) => {
    // console.log('[[id]]', contractId);
    const contract = contractList.get(contractId);
    if (contract) {
      return (
        contractList
          .get(contractId)
          // .update('startDate', value => value.substring(0, 10))
          // .update('endDate', value => (value ? value.substring(0, 10) : null))
          // .update('lastModifiedDate', value => value.substring(0, 10));
          .update('startDate', (value) => moment(value))
          .update('endDate', (value) => (value ? moment(value) : null))
          .update('lastModifiedDate', (value) => moment(value))
      );
    } else {
      return undefined;
    }
  }
);
