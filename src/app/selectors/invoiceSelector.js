import { createSelector } from 'reselect';
import moment from 'moment-timezone';
import Immutable from 'immutable';

const getInvoice = (state) => state.model.invoice;

export const getDataForInvoiceTable = createSelector(
  [getInvoice],
  (invoiceListFromStore) => {
    const invoiceList = invoiceListFromStore
      .toList()
      .map((invoice) => Immutable.fromJS(invoice))
      .map((invoice) => {
        return Immutable.fromJS({
          id: invoice.get('id'),
          invoiceNo: invoice.get('invoiceNo'),
          subInvoiceNo: invoice.get('subInvoiceNo'),
          invoiceDate: moment(invoice.get('createdDate').slice(0, 10))
            .format()
            .slice(0, 10),
          createdDate: moment(invoice.get('createdDate').slice(0, 10))
            .format()
            .slice(0, 10),
          employeeName: invoice.get('talentName'),
          status: invoice.get('status'),
          type: invoice.get('placementType'),
          invoiceAmount: invoice.get('amountDue'),
          dueAmount: invoice.get('dueAmount'),
          balance: invoice.get('balance'),
          billingCompany: invoice.get('customerName'),
          division: invoice.getIn(['division', 'name']),
          divisionId: invoice.get('divisionId'),
        });
      });

    console.log('[selector]', invoiceList);
    return invoiceList;
  }
);

const getHistory = (state) =>
  JSON.stringify(state.router.location.state) || '{}';
const getIds = (state, tab) => state.controller.searchInvoices[tab].ids;
const getInvoices2 = (state) => state.relationModel.invoices;
const getTab = (_, tab) => tab;
const getDivisions = (state) => state.model.divisions;

export const getQuery = createSelector(
  [getHistory, getTab],
  (historyState, tab) => {
    if (tab === 'all') {
      tab = 'invoiceAll';
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

export const makeGetInvoiceList = () => {
  // console.log('make createSelector');
  const getSort = makeGetSort();
  return createSelector(
    [getSort, getIds, getInvoices2, getDivisions, getTab],
    (sort, ids, invoices, divisions, tab) => {
      console.log(
        `%c create invoice selector for ${tab}`,
        'color: green',
        sort,
        ids && ids.toJSON()
      );
      return ids
        ? ids
            .map((id) => {
              let invoice = invoices.get(String(id));
              const divisionId = invoice.get('divisionId');
              if (divisionId) {
                invoice = invoice.set(
                  'divisionName',
                  divisions.getIn([divisionId.toString(), 'name'])
                );
              }
              return invoice;
            })
            .sortBy(
              (job) => job.get(sort[0]),
              (a, b) => {
                if (
                  sort[0] !== 'id' &&
                  sort[0] !== 'dueAmount' &&
                  sort[0] !== 'divisionId'
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

const getInvoiceList = makeGetInvoiceList();

export default getInvoiceList;

const getInvoiceNumber = (_, invoiceNumber) => invoiceNumber;

export const getInvoiceByInvoiceNumber = createSelector(
  getInvoiceNumber,
  getInvoices2,
  (invoiceNumber, invoices) => {
    return invoices
      .filter((i) => i.get('invoiceNo') === invoiceNumber)
      .toList()
      .sortBy(
        (el) => el.get('createdDate'),
        (a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          if (a === b) {
            return 0;
          }
        }
      );
  }
);
const getInvoiceId = (_, invoiceId) => invoiceId;

const getInvoiceActivities = (state) => state.relationModel.invoiceActivities;

export const getInvoiceActivitiesByInvoiceId = createSelector(
  getInvoiceId,
  getInvoiceActivities,
  (invoiceId, activities) => {
    return activities
      .filter((i) => i.get('invoiceId') === invoiceId)
      .toList()
      .sortBy(
        (el) => el.get('createdDate'),
        (a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          if (a === b) {
            return 0;
          }
        }
      );
  }
);
