import * as Immutable from 'immutable';
import { createSelector } from 'reselect';
import { formatUserName, formatMultipleName } from '../../utils';
// import Immutable from 'immutable';

const getCompanies = (state) => state.model.companies;
const getJobId = (_, jobId) => jobId;
const getJobs = (state) => state.model.jobs;

export const getCompanyList = createSelector([getCompanies], (companies) =>
  companies
    .map((company) => {
      // console.log(company.get('id'));
      const accountManager = formatMultipleName(company.get('accountManager'));
      const bdManager = formatUserName(company.get('bdManager'));
      const bdManagerId = company.getIn(['bdManager', 'id']);
      const city = company.getIn(['addresses', 0, 'city']);
      const level = company.get('type');
      return company
        .set('accountManager', accountManager)
        .set('bdManager', bdManager)
        .set('bdManagerId', bdManagerId)
        .set('city', city)
        .set('level', level);
    })
    .toList()
);

export const getAllCompanyList = createSelector(
  [getCompanyList],
  (companies) => {
    return companies.filter(
      (company) => company.get('type') !== 'POTENTIAL_CLIENT'
    );
  }
);

export const getProspect = createSelector([getCompanyList], (companies) => {
  return companies.filter(
    (company) => company.get('type') === 'POTENTIAL_CLIENT'
  );
});

export const getClientCompanyOptionsArray = createSelector(
  [getAllCompanyList, getJobs, getJobId],
  (companies, jobs, jobId) => {
    if (jobId) {
      const job = jobs.get(String(jobId));
      const companyId = job.get('companyId');
      const companyName = job.get('company');
      // console.log(companyId, companyName);
      const oldCompany = companies.find((c) => c.get('id') === companyId);
      if (!oldCompany) {
        companies = companies.unshift(
          Immutable.Map({ id: companyId, name: companyName, active: false })
        );
      }
    }

    return companies
      .toJS()
      .map((c) => ({ value: c.id, label: c.name, disabled: !c.active }));
  }
);
