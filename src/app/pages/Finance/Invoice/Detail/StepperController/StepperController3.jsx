import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { dateFormat2, dateFormat3 } from '../../../../../../utils';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import RecordPaymentForm from '../Dialogs/RecordPaymentForm';
import RecordCreditForm from '../Dialogs/RecordCreditForm';
import { currency as currencyOptions } from '../../../../../constants/formOptions';
import { withTranslation } from 'react-i18next';
const styles = {
  wrapper: {
    padding: '20px',
    backgroundColor: '#FDFDFD',
    margin: '24px',
    position: 'relative',
    border: '1px solid transparent',
    borderColor: '#e2e2e2',
    borderRadius: '5px',
    '&::before, &::after': {
      bottom: '100%',
      left: '42%',
      border: '1px solid transparent',
      content: '""',
      height: 0,
      width: 0,
      position: 'absolute',
    },
    '&::after': {
      borderBottomColor: '#FDFDFD',
      borderWidth: '15px',
      borderBottomWidth: '23px',
      marginLeft: '-15px',
    },
    '&::before': {
      borderBottomColor: '#e2e2e2',
      borderWidth: '17px',
      borderBottomWidth: '25px',
      marginLeft: '-17px',
    },

    transition: 'transform 0.3s ease-out',
  },
};

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class StepperController3 extends Component {
  constructor(props) {
    super(props);

    let transform = { transform: 'translateX(0)' };
    if (this.props.appearFrom === 'left') {
      transform = { transform: 'translateX(100vw)' };
    } else if (this.props.appearFrom === 'right') {
      transform = { transform: 'translateX(-100vw)' };
    }
    this.state = {
      recordOpen: false,
      transform: transform,
      recordPayment: false,
      recordCredit: false,
    };
  }

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({ transform: { transform: 'translateX(0)' } });
    }, 1);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  showRecordPaymentForm = () => {
    this.setState({ recordPayment: true });
  };

  closeRecordPaymentForm = () => {
    this.setState({ recordPayment: false });
  };
  showRecordCreditForm = () => {
    this.setState({ recordCredit: true });
  };

  closeRecordCreditForm = () => {
    this.setState({ recordCredit: false });
  };

  render() {
    const { transform, recordPayment, recordCredit } = this.state;
    const { classes, paidActivities, creditActivity, invoice, t } = this.props;
    console.log('paidActivities', paidActivities.toJS());
    console.log('creditActivity', creditActivity && creditActivity.toJS());

    const paidAmount = paidActivities.reduce((paidAmount, paidActivity) => {
      return paidAmount + paidActivity.get('paidAmount');
    }, 0);
    const amountDue = invoice.get('dueAmount') - paidAmount;
    const closeWithoutFullPayment = paidActivities.find((paidActivity) =>
      paidActivity.get('closeWithoutFullPayment')
    );
    console.log(paidAmount, amountDue, invoice.get('dueAmount'));
    return (
      <section className={classes.wrapper} style={transform}>
        <Typography variant="h6" gutterBottom>
          {t('tab:Get Paid')}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          {t('tab:Amount due')}: {currencyLabels[invoice.get('currency')]}
          {amountDue.toLocaleString()}
          {closeWithoutFullPayment &&
            `${t('tab:(Invoice closed without full payment)')}`}
        </Typography>

        {amountDue > 0 && !closeWithoutFullPayment && (
          <Typography variant="body2" gutterBottom>
            {t('tab:Your invoice is awaiting payment')}
          </Typography>
        )}

        {paidActivities.map((paidActivity) => {
          return (
            <div
              key={paidActivity.get('id')}
              style={{
                textIndent: '-2rem',
                paddingLeft: '2rem',
                overflowWrap: 'break-word',
              }}
            >
              <Typography
                variant="body2"
                gutterBottom={!paidActivity.get('note')}
              >
                <b style={{ fontWeight: 500 }}>
                  {paidActivity.get('closeWithoutFullPayment')
                    ? t('field:Close Invoice without Full Payment')
                    : 'Payment received'}
                  :&nbsp;
                </b>
                on {dateFormat3(paidActivity.get('paymentDate'))}, a payment for{' '}
                {currencyLabels[invoice.get('currency')]}
                {paidActivity.get('paidAmount').toLocaleString()} was made using{' '}
                {paidActivity
                  .get('paymentMethod')
                  .toLowerCase()
                  .replaceAll('_', ' ')}
                .
              </Typography>
              {paidActivity.get('note') && (
                <Typography variant="body2" gutterBottom>
                  <b style={{ fontWeight: 500 }}>Note:&nbsp;</b>
                  {paidActivity.get('note')}
                </Typography>
              )}
            </div>
          );
        })}

        {creditActivity && (
          <div
            style={{
              textIndent: '-2rem',
              paddingLeft: '2rem',
              overflowWrap: 'break-word',
            }}
          >
            <Typography
              variant="body2"
              gutterBottom={!creditActivity.get('note')}
            >
              <b style={{ fontWeight: 500 }}>
                {t('tab:Credit transferred')}:&nbsp;
              </b>
              on {dateFormat2(creditActivity.get('createdDate'))},{' '}
              {currencyLabels[invoice.get('currency')]}
              {creditActivity.get('amount').toLocaleString()} was transferred to
              credit
            </Typography>
            {creditActivity.get('note') && (
              <Typography variant="body2" gutterBottom>
                <b style={{ fontWeight: 500 }}>Note:&nbsp;</b>
                {creditActivity.get('note')}
              </Typography>
            )}
          </div>
        )}

        {invoice.get('status') !== 'VOID' &&
          amountDue > 0 &&
          !closeWithoutFullPayment && (
            <div style={{ marginTop: '16px', display: 'flex' }}>
              <PrimaryButton onClick={this.showRecordPaymentForm}>
                {t('tab:Record a Payment')}
              </PrimaryButton>
            </div>
          )}
        {invoice.get('status') !== 'VOID' &&
          invoice.get('invoiceType') !== 'STARTUP_FEE' &&
          !creditActivity &&
          (amountDue <= 0 || closeWithoutFullPayment) && (
            <div style={{ marginTop: '16px', display: 'flex' }}>
              <PrimaryButton onClick={this.showRecordCreditForm}>
                {t('tab:Record Credit')}
              </PrimaryButton>
            </div>
          )}

        <Dialog open={recordPayment} maxWidth={'xs'} fullWidth>
          <RecordPaymentForm
            onClose={this.closeRecordPaymentForm}
            invoice={invoice}
            amountDue={Number(amountDue.toFixed(2))}
          />
        </Dialog>

        <Dialog open={recordCredit} maxWidth={'xs'} fullWidth>
          <RecordCreditForm
            onClose={this.closeRecordCreditForm}
            invoice={invoice}
            paidAmount={Number(paidAmount.toFixed(2))}
          />
        </Dialog>
      </section>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(StepperController3));
