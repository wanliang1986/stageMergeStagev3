import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { currency as currencyOptions } from '../../../../constants/formOptions';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  summaryDiv: {
    backgroundColor: 'rgba(200,200,200,.2)',
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px 6px',
  },
  summary: {
    right: '5px',
    width: '32%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
};

class InvoiceAmountDisplay extends React.Component {
  render() {
    const { invoice, t, classes } = this.props;
    const { totalBillAmount, discount, taxAmount, totalInvoiceAmount } =
      _getDueAmount(invoice);
    return (
      <div className="row expanded" style={{ marginTop: 30, marginBottom: 16 }}>
        <div className="small-12 columns align-right">
          <div className={classes.summaryDiv}>
            <div className={classes.summary}>
              <Typography
                variant="caption"
                className={classes.row}
                gutterBottom
              >
                {t('tab:Total Bill Amount')}
                <span>
                  {currencyLabels[invoice.currency] || ''}
                  {totalBillAmount.toLocaleString()}
                </span>
              </Typography>
              <Typography
                variant="caption"
                className={classes.row}
                gutterBottom
              >
                {t('tab:Discount')}
                <span>
                  {!!discount && '-'}
                  {currencyLabels[invoice.currency] || ''}
                  {discount.toLocaleString()}
                </span>
              </Typography>

              <Typography
                variant="caption"
                className={classes.row}
                gutterBottom
              >
                {t('tab:Tax')}
                <span>
                  {currencyLabels[invoice.currency] || ''}
                  {taxAmount.toLocaleString()}
                </span>
              </Typography>
              {invoice.paidStartupFee && (
                <Typography
                  variant="caption"
                  className={classes.row}
                  gutterBottom
                >
                  {'Startup Fee'}
                  <span>
                    -{currencyLabels[invoice.currency] || ''}
                    {(Number(invoice.startupFeeAmount) || 0).toLocaleString()}
                  </span>
                </Typography>
              )}
              {Boolean(invoice.applyCredit) && (
                <Typography
                  variant="caption"
                  className={classes.row}
                  gutterBottom
                >
                  {'Credit'}
                  <span>
                    -{currencyLabels[invoice.currency] || ''}
                    {(Number(invoice.applyCredit) || 0).toLocaleString()}
                  </span>
                </Typography>
              )}
              <Typography variant="subtitle1" className={classes.row}>
                <b>{t('tab:Total')}</b>
                <b>
                  {currencyLabels[invoice.currency] || ''}
                  {totalInvoiceAmount.toLocaleString()}
                </b>
              </Typography>
            </div>
          </div>
        </div>
        <input
          type="hidden"
          name="totalInvoiceAmount"
          value={totalInvoiceAmount || ''}
        />
        <input
          type="hidden"
          name="dueAmount"
          value={totalInvoiceAmount || ''}
        />
      </div>
    );
  }
}

export default withStyles(styles)(InvoiceAmountDisplay);

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
    totalInvoiceAmount: Number(totalInvoiceAmount.toFixed(2)),
    // dueAmount: totalInvoiceAmount,
  };
};
