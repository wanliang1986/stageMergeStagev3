import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { dateFormat2 } from '../../../../../../utils';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import * as Color from '../../../../../styles/Colors';

import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import PaymentRecordFrom from '../Dialogs/PaymentRecordFrom';

const styles = {
  wrapper: {
    padding: '20px',
    backgroundColor: '#FDFDFD',
    margin: '24px',
    position: 'relative',
    border: '1px solid transparent',
    borderColor: Color.GALLERY,
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
      borderBottomColor: Color.GALLERY,
      borderWidth: '17px',
      borderBottomWidth: '25px',
      marginLeft: '-17px',
    },

    transition: 'transform 0.3s ease-out',
  },
};
const currencyMap = {
  USD: '$',
  CNY: '¥',
};
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

  showRecordForm = () => {
    this.setState({ recordOpen: true });
  };

  closeRecordForm = () => {
    this.setState({ recordOpen: false });
  };

  render() {
    const { transform, recordOpen } = this.state;
    const {
      classes,
      data,
      invoice,
      // t
    } = this.props;
    if (data) {
      return (
        <section className={classes.wrapper} style={transform}>
          <Typography variant="h6" gutterBottom style={{ fontWeight: '400' }}>
            Get Paid
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Paid amount: {currencyMap[invoice.get('currency')]}{' '}
            {data.get('paidAmount').toLocaleString()}
          </Typography>
          <Typography style={{ marginTop: '8px' }}>
            Your invoice is {data.get('closeWithoutFullPayment') ? 'not' : ''}{' '}
            paid in full
          </Typography>
          <Typography style={{ marginTop: '8px' }}>
            Payment is recorded by {data.get('userFullName')} on{' '}
            {dateFormat2(data.get('createdDate'))}
          </Typography>
        </section>
      );
    }
    return (
      <section className={classes.wrapper} style={transform}>
        <Fragment>
          <Typography variant="h6" style={{ fontWeight: '400' }} gutterBottom>
            Get Paid
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Amount due: {currencyMap[invoice.get('currency')]}
            {invoice.get('dueAmount').toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Your invoice is awaiting payment
          </Typography>

          {invoice.get('status') !== 'VOID' ? (
            <div style={{ marginTop: '16px', display: 'flex' }}>
              <PrimaryButton
                style={{ marginRight: '10px' }}
                onClick={this.showRecordForm}
              >
                Record a Payment
              </PrimaryButton>
            </div>
          ) : (
            ''
          )}

          <Dialog open={recordOpen} maxWidth={'xs'} fullWidth>
            <PaymentRecordFrom
              onClose={this.closeRecordForm}
              invoice={invoice}
            />
          </Dialog>
        </Fragment>
      </section>
    );
  }
}

export default withStyles(styles)(StepperController3);
