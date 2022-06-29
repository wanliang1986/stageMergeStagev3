import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import Immutable from 'immutable';

const getHistory = (state) =>
  JSON.stringify(state.router.location.state) || '{}';
const getIds = (state, tab) => state.controller.searchCommissions[tab].ids;
const getCommissions = (state) => state.relationModel.commissions;
const getTab = (_, tab) => tab;
const getDivisions = (state) => state.model.divisions;

export const getQuery = createSelector(
  [getHistory, getTab],
  (historyState, tab) => {
    if (tab === 'all') {
      tab = 'commissionAll';
    }
    historyState = JSON.parse(historyState);
    const query = (historyState && historyState[tab]) || {
      filters: {},
      sort: {},
    };
    return JSON.stringify(query);
  }
);

const makeGetSort = () =>
  createSelector(getQuery, (query) => {
    console.log('get sort', query);
    const { sort } = JSON.parse(query);
    return (
      Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || [
        'createdDate',
      ]
    );
  });

export const makeGetCommissionList = () => {
  // console.log('make createSelector');
  const getSort = makeGetSort();
  return createSelector(
    [getSort, getIds, getCommissions, getTab],
    (sort, ids, commissions, tab) => {
      console.log(
        `%c create commission selector for ${tab}`,
        'color: green',
        sort,
        ids && ids.toJSON()
      );
      return ids
        ? ids
            .map((id) => {
              let commission = commissions.get(String(id));

              return commission
                .set(
                  'grossMargin',
                  commission.get('grossMargin') ||
                    commission.getIn(['invoice', 'finalFee'])
                )
                .set('currency', commission.getIn(['start', 'currency']))
                .set('talentName', commission.getIn(['start', 'talentName']))
                .set('jobTitle', commission.getIn(['start', 'jobTitle']))
                .set('jobId', commission.getIn(['start', 'jobId']))
                .set('company', commission.getIn(['start', 'company']))
                .set('startDate', commission.getIn(['start', 'startDate']))
                .set(
                  'startCommissions',
                  commission.getIn(['start', 'startCommissions'])
                );
            })
            .sortBy(
              (job) => job.get(sort[0]),
              (a, b) => {
                if (
                  sort[0] !== 'id' &&
                  sort[0] !== 'receivedAmount' &&
                  sort[0] !== 'grossMargin'
                ) {
                  a = a ? a.toLowerCase() : '';
                  b = b ? b.toLowerCase() : '';
                }
                if (a < b) {
                  return -((sort[1] === 'ASC') - 0.5);
                }
                if (a > b) {
                  return (sort[1] === 'ASC') - 0.5;
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
};

const getCommissionList = makeGetCommissionList();

export default getCommissionList;
