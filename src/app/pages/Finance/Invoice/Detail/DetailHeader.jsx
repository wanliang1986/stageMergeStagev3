import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { downloadInvoice } from '../../../../../apn-sdk/invoice';
import { dateFormat } from '../../../../../utils';
import { ADD_SEND_EMAIL_REQUEST } from '../../../../constants/actionTypes';
import { SEND_EMAIL_TYPES } from '../../../../constants/formOptions';
import { currency as currencyOptions } from '../../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';

import Email from '@material-ui/icons/Email';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import { VoidIcon } from '../../../../components/Icons';

import VoidForm from './Dialogs/VoidForm';

const styles = (theme) => ({
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 24px',
  },
  headerColumn: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '30px',
    fontWeight: 400,
  },
  actions: {
    position: 'absolute',
    right: 10,
    top: 14,
    '& button': {
      padding: 8,
    },
  },
});

const statusMap = {
  PAID: 'Paid',
  UNPAID: 'Unpaid',
  OVERDUE: 'Expired',
  STARTUP_FEE_PAID_USED: 'Paid - Used',
  STARTUP_FEE_PAID_UNUSED: 'Paid - Unused',
  STARTUP_FEE_UNPAID_UNUSED: 'Unpaid - Unused',
  VOID: 'Void',
};
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class DetailHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openVoid: false,
    };
    this.invoiceFile = null;
  }

  handleDownload = () => {
    // console.log('handleDownload');
    if (this.invoiceFile) {
      console.log('has downloaded invoice');
      this._downloadFile(this.invoiceFile);
    } else {
      this._getInvoiceFile().then(() => {
        console.log('invoice download');
        this._downloadFile(this.invoiceFile);
      });
    }
  };

  _downloadFile = (file) => {
    const fileURL = window.URL.createObjectURL(file);

    //view
    // window.open(fileURL);

    //download
    try {
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', fileURL);
      linkElement.setAttribute('download', file.name);
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: false,
      });
      linkElement.dispatchEvent(clickEvent);
    } catch (ex) {
      console.log(ex);
    }
  };

  _getInvoiceFile = () => {
    const { invoice } = this.props;
    return downloadInvoice(invoice.get('id')).then(({ response }) => {
      const invoiceFile = new File(
        [response],
        `Invoice-${invoice.get('subInvoiceNo')}`,
        {
          type: response.type,
        }
      );
      this.invoiceFile = invoiceFile;
      return invoiceFile;
    });
  };

  openVoid = () => {
    this.setState({ openVoid: true });
  };
  closeVoid = () => {
    this.setState({ openVoid: false });
  };

  openEmail = () => {
    if (this.invoiceFile) {
      this.handleSendEmailToCandidate();
    } else {
      this._getInvoiceFile().finally(() => this.handleSendEmailToCandidate());
    }
  };

  handleSendEmailToCandidate = () => {
    const { dispatch, invoice } = this.props;
    const invoiceFile = this.invoiceFile;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToClientInvoice,
        data: {
          invoiceFile,
          invoice,
        },
      },
    });
  };

  render() {
    const { classes, invoice, t, dispatch } = this.props;
    // console.log(invoice.toJS());

    return (
      <header className={classes.header}>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ fontSize: '1.15rem' }}
        >
          {`Invoice`} {invoice.get('subInvoiceNo')}
        </Typography>
        <div className="flex-container">
          <Typography variant="h6" className={classes.headerColumn}>
            <Typography
              variant="body2"
              style={{ color: '#717171' }}
            >{`Status`}</Typography>
            {statusMap[invoice.get('status')]}
          </Typography>
          <Typography variant="h6" className={classes.headerColumn}>
            <Typography
              variant="body2"
              style={{ color: '#717171' }}
            >{`Client`}</Typography>
            {invoice.get('customerName')}
          </Typography>

          <Typography variant="h6" className={classes.headerColumn}>
            <Typography
              variant="body2"
              style={{ color: '#717171' }}
            >{`Amount`}</Typography>
            {currencyLabels[invoice.get('currency')]}
            {invoice.get('dueAmount').toLocaleString()}
          </Typography>

          <Typography variant="h6" className={classes.headerColumn}>
            <Typography
              variant="body2"
              style={{ color: '#717171' }}
            >{`Due Date`}</Typography>
            {dateFormat(invoice.get('dueDate'))}
          </Typography>
        </div>

        <div className={classes.actions}>
          <IconButton edge={'start'} onClick={this.handleDownload}>
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={this.openEmail}>
            <Email />
          </IconButton>
          <IconButton onClick={this.openVoid}>
            <VoidIcon />
          </IconButton>
        </div>

        <Dialog open={this.state.openVoid} fullWidth maxWidth="xs">
          <VoidForm
            onClose={this.closeVoid}
            invoiceId={invoice.get('id')}
            t={t}
            dispatch={dispatch}
          />
        </Dialog>
      </header>
    );
  }
}

export default connect()(withStyles(styles)(DetailHeader));
