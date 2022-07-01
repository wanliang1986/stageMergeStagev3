import authRequest from './request';

export const searchAllInvoiceList = (
  page = '',
  size = '',
  search = '',
  sort = '',
  advancedSearch = ''
) => {
  console.log('query', advancedSearch);

  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/invoices/?search=${search}&page=${page}&size=${size}&sort=${sort}&sort=id,desc${advancedSearch}`,
    config
  );
};

export const getStartupFeeByCompany = (companyId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(
    `/invoices/companyId/${companyId}?invoiceType=STARTUP_FEE&invoiceStatus=STARTUP_FEE_PAID_UNUSED`,
    config
  );
};

export const getInvoiceByStart = (startId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/invoices/startId/${startId}`, config);
};

export const getOneInvoice = (invoiceId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/invoices/${invoiceId}`, config);
};

export const updateInvoice = (invoice, invoiceId = '') => {
  const config = {
    method: invoiceId ? 'PUT' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  };
  console.log('[edit]', invoice, invoiceId);
  return authRequest.send(`/invoices/${invoiceId}`, config);
};

export const createInvoiceStartupfee = (invoice) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  };
  return authRequest.send(`/invoices/startup-fee`, config);
};

export const createInvoiceFTE = (invoice) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invoice),
  };
  return authRequest.send(`/invoices/fte`, config);
};

export const searchAllInvoiceListElasticSearch = (
  from = 0,
  size = 1000,
  query = {}
) => {
  const search = {
    from,
    size,
    query,
  };
  const config = {
    method: 'POST',
    headers: {},
    body: JSON.stringify(search),
  };
  return authRequest.send(`/search/starts`, config);
};

export const getInvoiceDetailList = (invoiceNo) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send(`/invoices/invoice-no/${invoiceNo}`, config);
};

export const downloadInvoice = (invoiceId) => {
  const config = {
    method: 'GET',
    headers: {},
  };

  return authRequest.send2(`/invoices/download/${invoiceId}`, config);
};

export const voidInvoiceById = (voidRecord) => {
  const config = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(voidRecord),
  };
  return authRequest.send(`/invoices/void`, config);
};

export const recordInvoicePayment = (paymentRecord) => {
  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentRecord),
  };
  return authRequest.send(`/invoice-payment-records`, config);
};
