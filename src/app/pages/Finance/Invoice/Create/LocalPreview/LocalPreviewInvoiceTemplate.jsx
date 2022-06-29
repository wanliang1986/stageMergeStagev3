import React from 'react';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Divider from '@material-ui/core/Divider';
import { currency as currencyOptions } from '../../../../../constants/formOptions';

import logo from './newlogo.png';

const style = (theme) => ({
  invoice: {
    margin: '0 20px 20px 20px',
    width: '540px',
    height: '600px',
    border: '1px solid #e0e0e0',
    fontSize: '9px',
    boxSizing: 'border-box',
    fontFamily: 'Helvetica',
  },
  info: {
    '& span': {
      fontWeight: '600',
      fontSize: '10px',
    },
  },
  table: {
    borderBottom: '0.5px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    '&>div': {
      borderBottom: '0.5px solid #e0e0e0',
      padding: '10px 0',

      '&:last-child': {
        borderBottom: 'none',
        padding: '15px 0',
      },
    },
  },

  leftColumn: {
    flexBasis: '60%',
  },
  rightColumn: {
    flexBasis: '40%',
  },
  tableHeader: {
    backgroundColor: '#505050',
    marginTop: '15px',
    marginLeft: '-1px',
    color: '#fff',
    padding: '4px 0',
    display: 'flex',
    width: 'calc(100% + 2px)',
    justifyContent: 'space-around',
  },
  firstRow: {
    // borderBottom: '0.2px solid #e0e0e0',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const LocalPreviewInvoiceTemplate = (props) => {
  const { classes, invoice, subInvoice, childInvoiceNumber, index, t } = props;
  const { totalBillAmount, discount, taxAmount, totalInvoiceAmount } =
    _getDueAmount(invoice);
  return (
    <div>
      <section className={classes.invoice} style={{ boxSizing: 'border-box' }}>
        <div
          className="row"
          style={{ alignItems: 'center', marginTop: 30, marginBottom: 30 }}
        >
          <div className={classes.leftColumn}>
            <img
              src={logo}
              width="140px"
              style={{ paddingLeft: '20px' }}
              alt="intelliProLogo"
            />
          </div>

          <div
            className={classes.rightColumn}
            style={{ textAlign: 'right', paddingRight: 24 }}
          >
            <span style={{ fontWeight: '800', fontSize: '12px' }}>
              Invoice No.XXXXXXXXX{index ? `-${index}` : ''}
            </span>
          </div>
        </div>

        <div className={`row ${classes.info}`}>
          <div
            className={classes.leftColumn}
            style={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ flexBasis: '50%' }}>
              <span>Customer Name and Address</span>
              <br />
              {invoice.customerName}
              <br />
              {invoice.customerAddress}
            </div>
            <div>
              <span>Customer Reference #:</span> {invoice.customerReference}
              <br />
              <span>PO #:</span> {invoice.poNo}
              <br />
              {/*<span>Customer Contact:</span> {invoice.clientContact}*/}
              {/*<br />*/}
              <span>{t('field:Invoice Date')}:</span> {invoice.invoiceDate}{' '}
              <br />
            </div>
          </div>

          <div className={classes.rightColumn}>
            <span>Remit To</span>
            <br />
            *Please make payment via direct deposit to:
            <br />
            <br />
            <span>Bank of America</span>
            <br />
            <span>Routing #:</span> 121000358
            <br />
            <span>Account #:</span> 000427571829
            <br />
            <span>Account Name:</span> Intellipro Group Inc.
            <br />
            <span>Bank Address:</span> 2900 S. EI Camino Real,
            <br />
            <span
              style={{
                fontWeight: '400',
                paddingLeft: '74px',
                fontSize: '9px',
              }}
            >
              San Mateo, CA 94403
            </span>
            <br />
            <span>Account Type:</span> Checking
            <br />
          </div>
        </div>

        <div className={classes.tableHeader}>
          <span style={{ flexBasis: '25%' }}>Item</span>
          <span>Quantity</span>
          <span>Billing Rate</span>
          <span>Unit</span>
          <span>Amount Due</span>
        </div>
        {/*totalBillAmount*/}
        <div className={`row expanded ${classes.firstRow}`}>
          <span style={{ padding: '10px 0 10px 20px' }}>
            Placement fee for {invoice.talentName}
            <br />
            Start Date: {invoice.startDate}
          </span>

          <span
            style={{
              position: 'absolute',
              left: '473px',
            }}
          >
            {currencyLabels[invoice.currency] || ''}
            {totalBillAmount.toLocaleString()}
          </span>
        </div>

        {/*discount*/}
        {!!discount && (
          <div className={`row expanded ${classes.firstRow}`}>
            <span style={{ padding: '3px 0 3px 20px' }}>Discount</span>

            <span
              style={{
                position: 'absolute',
                left: '473px',
              }}
            >
              -{currencyLabels[invoice.currency] || '$'}
              {discount.toLocaleString()}
            </span>
          </div>
        )}

        {/*taxAmount*/}
        <div className={`row expanded ${classes.firstRow}`}>
          <span style={{ padding: '3px 0 3px 20px' }}>Tax</span>

          <span
            style={{
              position: 'absolute',
              left: '473px',
            }}
          >
            {currencyLabels[invoice.currency] || '$'}
            {taxAmount.toLocaleString()}
          </span>
        </div>

        {/*startupFee*/}
        {!!invoice.startupFeeAmount && (
          <div className={`row expanded ${classes.firstRow}`}>
            <span style={{ padding: '3px 0 3px 20px' }}>Startup Fee</span>

            <span
              style={{
                position: 'absolute',
                left: '473px',
              }}
            >
              -{currencyLabels[invoice.currency] || '$'}
              {(Number(invoice.startupFeeAmount) || 0).toLocaleString()}
            </span>
          </div>
        )}

        {/*applyCredit*/}
        {!!invoice.applyCredit && (
          <div className={`row expanded ${classes.firstRow}`}>
            <span style={{ padding: '3px 0 3px 20px' }}>Credit</span>

            <span
              style={{
                position: 'absolute',
                left: '473px',
              }}
            >
              -{currencyLabels[invoice.currency] || '$'}
              {(Number(invoice.applyCredit) || 0).toLocaleString()}
            </span>
          </div>
        )}

        <Divider style={{ marginTop: 10 }} />

        <div
          className={`row expanded`}
          style={{ borderBottom: '0.2px solid #e0e0e0' }}
        >
          <div className={classes.leftColumn}></div>
          <div className={`${classes.rightColumn} ${classes.table}`}>
            <div style={{ fontWeight: '600' }}>
              Total Amount:{' '}
              <span
                style={{
                  width: 122,
                  display: 'inline-block',
                  textAlign: 'right',
                }}
              >
                {currencyLabels[invoice.currency] || '$'}
                {totalInvoiceAmount.toLocaleString()}
              </span>
            </div>

            {subInvoice && (
              <div
                className="flex-container align-justify"
                style={{ fontWeight: '600', paddingRight: 30 }}
              >
                <span>{index === 1 ? 'First' : 'Second'} Amount:</span>
                <span>
                  {currencyLabels[invoice.currency] || '$'}
                  {subInvoice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={`row expanded`}>
          <div
            className={classes.leftColumn}
            style={{ padding: '10px 0 0 20px' }}
          >
            Payment due within 30 days
          </div>
        </div>
      </section>
    </div>
  );
};

export default withTranslation(['action', 'message', 'field'])(
  withStyles(style)(LocalPreviewInvoiceTemplate)
);

const _getDueAmount = (invoice) => {
  const totalBillAmount = Number(invoice.totalBillAmount) || 0;
  const discount = Number(invoice.discount) || 0;
  const taxRate = Number(invoice.taxRate) || 0;
  const taxAmount = Number(((totalBillAmount - discount) * taxRate).toFixed(2));
  const totalInvoiceAmount =
    totalBillAmount -
    discount +
    taxAmount -
    (Number(invoice.startupFeeAmount) || 0) -
    (Number(invoice.applyCredit) || 0);
  return {
    totalBillAmount,
    discount,
    taxAmount,
    totalInvoiceAmount,
    // dueAmount: totalInvoiceAmount,
  };
};
