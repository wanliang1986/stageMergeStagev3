import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';
import { normalize } from 'normalizr';
import { showErrorMessage } from './index';
import { invoice } from './schemas';
import { APPLY_CREDIT_INVOICE } from '../constants/actionTypes';

export const searchAllInvoiceList =
  (page, size, search, sort, advancedSearch) => (dispatch, getState) => {
    if (getState().controller.searchInvoices.all.isFetching) {
      return Promise.resolve('loading...');
    }
    dispatch({
      type: ActionTypes.REQUEST_INVOICE_LIST,
      tab: 'all',
    });
    return apnSDK
      .searchAllInvoiceList(page, size, search, sort, advancedSearch)
      .then(({ response, headers }) => {
        console.log('all invoices', response);
        // headers.forEach(value=>console.log(value))
        const normalizedData = normalize(response.elements || [], [invoice]);
        dispatch({
          type: ActionTypes.RECEIVE_INVOICE_LIST,
          tab: 'all',
          normalizedData,
          total: parseInt(headers.get('pagination-count'), 10),
        });
        return response;
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_INVOICE_LIST,
          tab: 'all',
        });
        dispatch(showErrorMessage(err));
      });
  };
export const loadMoreAllInvoiceList =
  (page, size, search, sort, advancedSearch) => (dispatch, getState) => {
    if (getState().controller.searchInvoices.all.isFetching) {
      return Promise.resolve('loading...');
    }
    dispatch({
      type: ActionTypes.REQUEST_INVOICE_LIST,
      tab: 'all',
    });
    return apnSDK
      .searchAllInvoiceList(page, size, search, sort, advancedSearch)
      .then(({ response, headers }) => {
        console.log('more all invoices', response);
        const normalizedData = normalize(response.elements || [], [invoice]);
        dispatch({
          type: ActionTypes.ADD_INVOICE_TO_LIST,
          tab: 'all',
          ids: normalizedData.result,
          normalizedData,
        });
        return response;
      })
      .catch((err) => {
        dispatch({
          type: ActionTypes.FAILURE_INVOICE_LIST,
          tab: 'all',
        });
        dispatch(showErrorMessage(err));
      });
  };

//void invoice
export const voidInvoice = (voidRecord) => (dispatch) => {
  return apnSDK
    .voidInvoiceById(voidRecord)
    .then(({ response }) => {
      dispatch({
        type: ActionTypes.VOID_INVOICE,
        invoiceActivity: response,
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};
//This invoice already paid. You can't void an invoice already paid.
export const voidInvoice2 = (invoiceNo, reason) => (dispatch, getState) => {
  // console.log(invoiceNo);
  const invoiceIds = getState()
    .relationModel.invoices.filter((i) => i.get('invoiceNo') === invoiceNo)
    .map((i) => i.get('id'))
    .toList()
    .toArray();
  const paidActivities = getState().relationModel.invoiceActivities.filter(
    (i) =>
      invoiceIds.includes(i.get('invoiceId')) &&
      i.get('invoiceActivityType') === 'PAYMENT'
  );
  if (paidActivities.size > 0) {
    dispatch(
      showErrorMessage(
        new Error(
          "This invoice already paid. You can't void an invoice already paid."
        )
      )
    );
    return Promise.reject(
      new Error(
        "This invoice already paid. You can't void an invoice already paid."
      )
    );
  }
  return Promise.all(
    invoiceIds.map((invoiceId) => {
      return dispatch(voidInvoice({ invoiceId, reason }));
    })
  );
};

//record payment
export const recordInvoicePayment = (paymentRecord) => (dispatch) => {
  return apnSDK
    .recordInvoicePayment(paymentRecord)
    .then(({ response }) => {
      dispatch({
        type: ActionTypes.PAID_INVOICE,
        invoiceActivity: Object.assign(response, paymentRecord),
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

export const recordApplyCredit = (creditRecord) => (dispatch) => {
  return apnSDK
    .recordApplyCredit(creditRecord)
    .then(({ response }) => {
      dispatch({
        type: ActionTypes.APPLY_CREDIT_INVOICE,
        invoiceActivity: Object.assign(response, creditRecord),
      });
    })
    .catch((err) => {
      dispatch(showErrorMessage(err));
      throw err;
    });
};

export const createInvoiceFTE = (invoiceData) => (dispatch) => {
  return apnSDK.createInvoiceFTE(invoiceData).then(({ response }) => {
    console.log('create invoice Startup fee: ', response);
    const normalizedData = normalize(response, [invoice]);

    dispatch({
      type: ActionTypes.ADD_SUB_INVOICE_LIST,
      normalizedData,
    });

    return response;
  });
};

export const createInvoiceStartupfee = (invoiceData) => (dispatch) => {
  return apnSDK.createInvoiceStartupfee(invoiceData).then(({ response }) => {
    console.log('create invoice Startup fee: ', response);
    dispatch({
      type: ActionTypes.ADD_INVOICE,
      invoice: response,
    });

    return response;
  });
};

export const getInvoiceDetailList = (invoiceNo) => (dispatch, getState) => {
  return apnSDK
    .getInvoiceDetailList(invoiceNo)
    .then(({ response }) => {
      console.log('Details invoice : ', response);
      const normalizedData = normalize(response, [invoice]);
      // console.log('Details invoice normalized', normalizedData);
      dispatch({
        type: ActionTypes.GET_INVOICE_DETAIL_LIST,
        normalizedData,
      });

      return response;
    })
    .catch((err) => dispatch(showErrorMessage(err)));
};
