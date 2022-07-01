import React from 'react';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { currency as currencyOptions } from '../../../../../constants/formOptions';

import logo from '../../../../../../logo.png';

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
    borderBottom: '0.2px solid #e0e0e0',
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
  const { classes, invoice, subInvoice, childInvoiceNumber, index } = props;

  console.log('[laal]', childInvoiceNumber);
  return (
    <div>
      <div style={{ padding: '20px 20px 0 20px' }}>
        Invoice #{childInvoiceNumber ? `${childInvoiceNumber}-${index}` : ''}
      </div>
      <section className={classes.invoice} style={{ boxSizing: 'border-box' }}>
        <div className="row" style={{ alignItems: 'center' }}>
          <div className={classes.leftColumn}>
            <img
              src={logo}
              width="140px"
              style={{ paddingLeft: '20px' }}
              alt="intelliProLogo"
            />
          </div>

          <div className={classes.rightColumn}>
            <span style={{ fontWeight: '800', fontSize: '12px' }}>
              Invoice No.XXXXXXXXXXXXXX{index ? `-${index}` : ''}
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
              <span>PO #:</span>
              {invoice.poNo}
              <br />
              <span>Customer Contact:</span>
              {invoice.clientContact}
              <br />
              <span>Invoice Date:</span> {invoice.invoiceDate} <br />
            </div>
          </div>

          <div className={classes.rightColumn}>
            <span>Remit To</span>
            <br />
            Please make payment via direct deposit to:
            <br />
            Bank of America
            <br />
            Routing #: 121000358
            <br />
            Account #: 0427571829
            <br />
            Account name: Intellipro Group Inc.
            <br />
            Address: 2900 S. EI Camino Real,
            <br />
            <span
              style={{
                fontWeight: '400',
                paddingLeft: '38px',
                fontSize: '9px',
              }}
            >
              San Mateo,{' '}
            </span>
            <br />
            <span
              style={{
                fontWeight: '400',
                paddingLeft: '38px',
                fontSize: '9px',
              }}
            >
              CA 94403{' '}
            </span>
            <br />
            Account Type: Checking
            <br />
            Mailing Address: P.O. BOX 4364
            <br />
            <span
              style={{
                fontWeight: '400',
                paddingLeft: '70px',
                fontSize: '9px',
              }}
            >
              4601 LAFAYETTE ST
            </span>
            <br />
            <span
              style={{
                fontWeight: '400',
                paddingLeft: '70px',
                fontSize: '9px',
              }}
            >
              SANTA CLARA
            </span>
            <br />
            <span
              style={{
                fontWeight: '400',
                paddingLeft: '70px',
                fontSize: '9px',
              }}
            >
              CA 95056
            </span>
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
            {currencyLabels[invoice.currency] || '$'}
            {subInvoice ? subInvoice : invoice.dueAmount}
          </span>
        </div>

        <div
          className={`row expanded`}
          style={{ borderBottom: '0.2px solid #e0e0e0' }}
        >
          <div className={classes.leftColumn}></div>
          <div className={`${classes.rightColumn} ${classes.table}`}>
            <div>
              Subtotal:{' '}
              <span style={{ paddingLeft: '112px' }}>
                {currencyLabels[invoice.currency] || '$'}
                {subInvoice ? subInvoice : invoice.totalAmount}
              </span>
            </div>
            <div style={{ fontWeight: '800' }}>
              Total Amount:{' '}
              <span style={{ paddingLeft: '87px' }}>
                {currencyLabels[invoice.currency] || '$'}
                {invoice.totalAmount}
              </span>
            </div>
            <div></div>
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
