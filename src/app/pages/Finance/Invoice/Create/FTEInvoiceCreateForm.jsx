import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createInvoiceFTE } from '../../../../actions/invoiceActions';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import PotentialButton from '../../../../components/particial/PotentialButton';

import InvoiceBasicForm from './InvoiceBasicForm';
import LocalPreview from './LocalPreview';
import { showErrorMessage } from '../../../../actions';
import AlertDialog from '../../../../components/particial/AlertDialog';
import moment from 'moment-timezone';

const styles = (theme) => ({
  root: {
    minWidth: 730,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    '& form': {
      width: 728,
    },
  },
});

class InvoiceCreate extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMessage: Immutable.Map(),
      visible: false,
      creating: false,
      handleCreateInvoice: null,
      childInvoiceNumber: 0,
      previewing: false,
      invoice: { subInvoiceList: [] },
    };
    this.invoiceForm = React.createRef();
  }

  handleCreateInvoice = (e) => {
    e.preventDefault();

    this.setState();
    const invoice = this._getInvoiceFromForm(e.target);
    if (invoice) {
      this.setState({
        handleCreateInvoice: () => {
          this.setState({ creating: true });
          this.props
            .dispatch(createInvoiceFTE({ ...invoice, clientContact: null }))
            .then((res) => {
              this.props.history.replace(
                `/finance/invoices/detail/${res[0]['invoiceNo']}`
              );
            })
            .catch((err) => {
              this.props.dispatch(showErrorMessage(err));
              this.setState({ creating: false });
            });
        },
      });
    }
  };
  handleCancelCreateInvoice = () => {
    this.setState({ creating: false, handleCreateInvoice: null });
  };

  _validateForm(form, t, subInvoiceList, totalAmount) {
    let errorMessage = Immutable.Map();
    if (form.startupFeeInvoiceNo && !form.startupFeeInvoiceNo.value) {
      errorMessage = errorMessage.set(
        'startupFeeInvoiceNo',
        'message:startupFeeInvoiceNoIsRequired'
      );
    }

    if (!form.talentName.value) {
      errorMessage = errorMessage.set(
        'employee',
        t('message:employeeIsRequired')
      );
    }

    // if (!form.divisionId.value) {
    //   errorMessage = errorMessage.set(
    //     'division',
    //     t('message:divisionIsRequired')
    //   );
    // }

    if (form.note.value.length > 2000) {
      errorMessage = errorMessage.set(
        'note',
        'message:The length of Note is More than 2000'
      );
    }

    if (form.dueAmount.value && Number(form.dueAmount.value) < 0) {
      errorMessage = errorMessage.set(
        'dueAmount',
        t('message:amountDueIsNonNegative')
      );
      this.props.dispatch(
        showErrorMessage(new Error(t('message:amountDueIsNonNegative')))
      );
    }
    if (!form.split.checked) {
      if (!form.invoiceDate.value) {
        errorMessage = errorMessage.set(
          'invoiceDate',
          'message:Invoice Date is required'
        );
      }
      if (!form.dueDate.value) {
        errorMessage = errorMessage.set(
          'dueDate',
          'message:Due Date is required'
        );
      }
      if (
        form.invoiceDate.value &&
        form.dueDate.value &&
        moment(form.dueDate.value).isBefore(moment(form.invoiceDate.value))
      ) {
        errorMessage = errorMessage.set(
          'dueDate',
          'message:Due Date should not be before Invoice Date'
        );
      }
    }

    if (form.split.checked) {
      [0, 1].forEach((value) => {
        if (!form[`childInvoiceDate${value}`].value) {
          errorMessage = errorMessage.set(
            `childInvoiceDate${value}`,
            'message:Invoice Date is required'
          );
        }
        if (!form[`childInvoiceDueDate${value}`].value) {
          errorMessage = errorMessage.set(
            `childInvoiceDueDate${value}`,
            'message:Due Date is required'
          );
        }
        if (
          form[`childInvoiceDate${value}`].value &&
          form[`childInvoiceDueDate${value}`].value &&
          moment(form[`childInvoiceDueDate${value}`].value).isBefore(
            moment(form[`childInvoiceDate${value}`].value)
          )
        ) {
          errorMessage = errorMessage.set(
            `childInvoiceDueDate${value}`,
            'message:Due Date should not be before Invoice Date'
          );
        }
        if (
          form[`childInvoiceAmount${value}`].value &&
          Number(form[`childInvoiceAmount${value}`].value) === 0
        ) {
          errorMessage = errorMessage.set(
            `childInvoiceAmount${value}`,
            'message:Due Amount should be greater then 0'
          );
        }

        if (!form[`childInvoiceAmount${value}`].value) {
          errorMessage = errorMessage.set(
            `childInvoiceAmount${value}`,
            'message:amountDueIsRequired'
          );
        }
      });
      if (
        !errorMessage.get('childInvoiceAmount0') &&
        !errorMessage.get('childInvoiceAmount1')
      ) {
        const amount = subInvoiceList.reduce((acc, ele) => {
          // console.log(ele);
          return acc + parseFloat(ele.dueAmount);
        }, 0);
        // console.log('[sum]', amount, totalAmount);

        if (Number(amount.toFixed(2)) !== totalAmount) {
          errorMessage = errorMessage.set(
            'subAmountSum',
            t('message:subAmountSum')
          );
        }
      }
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  cleanErrorMessage = () => {
    return this.setState({
      errorMessage: Immutable.Map(),
    });
  };

  handlePreview = (e) => {
    console.log('preview');
    const invoice = this._getInvoiceFromForm(this.invoiceForm.current);
    if (invoice) {
      this.setState({
        invoice,
        previewing: true,
      });
    }
  };

  _getInvoiceFromForm = (createInvoiceForm) => {
    if (!createInvoiceForm) return;
    const { t } = this.props;

    const split = createInvoiceForm.split.checked;
    const paidStartupFee = createInvoiceForm.paidStartupFee.checked;

    const subInvoiceList =
      split &&
      [1, 2].map((_, index) => {
        return {
          invoiceDate: createInvoiceForm[`childInvoiceDate${index}`].value,
          dueDate: createInvoiceForm[`childInvoiceDueDate${index}`].value,
          dueAmount: Number(
            createInvoiceForm[`childInvoiceAmount${index}`].value
          ),
        };
      });
    const totalBillAmount =
      Number(createInvoiceForm.totalBillAmount.value) || 0;
    const discount = Number(createInvoiceForm.discount.value) || 0;
    const taxRate = Number(createInvoiceForm.taxRate.value) || 0;

    const applyCredit = Number(createInvoiceForm.applyCredit.value) || 0;
    const startupFeeAmount = createInvoiceForm.startupFeeAmount
      ? Number(createInvoiceForm.startupFeeAmount.value) || 0
      : 0;
    const totalInvoiceAmount =
      Number(createInvoiceForm.totalInvoiceAmount.value) || 0;
    const dueAmount = totalInvoiceAmount;

    let errorMessage = this._validateForm(
      createInvoiceForm,
      t,
      subInvoiceList,
      totalInvoiceAmount
    );
    if (errorMessage) {
      let anchorElement = document.getElementById('header');
      if (anchorElement && 'scrollIntoView' in anchorElement) {
        anchorElement.scrollIntoView();
        return this.setState({ errorMessage });
      } else {
        return this.setState({ errorMessage });
      }
    }

    return {
      startId: Number(createInvoiceForm.startId.value),
      startDate: createInvoiceForm.startDate.value,
      talentId: createInvoiceForm.talentId.value,
      talentName: createInvoiceForm.talentName.value,
      jobId: createInvoiceForm.jobId.value,
      jobTitle: createInvoiceForm.jobTitle.value,
      currency: createInvoiceForm.currency.value,

      companyId: createInvoiceForm.companyId.value,
      clientName: createInvoiceForm.clientName.value,
      clientContactId: createInvoiceForm.clientContactId.value,
      clientContact: createInvoiceForm.clientContact.value,
      customerName: createInvoiceForm.customerName.value,
      customerAddress: createInvoiceForm.customerAddress.value,
      divisionId: createInvoiceForm.divisionId.value,

      invoiceDate: createInvoiceForm.invoiceDate.value,
      dueDate: createInvoiceForm.dueDate.value,

      poNo: createInvoiceForm.poNo.value,
      customerReference: createInvoiceForm.customerReference.value,
      invoiceType: createInvoiceForm.invoiceType.value,

      totalBillablePackage: Number(
        createInvoiceForm.totalBillablePackage.value
      ),
      totalBillAmount,
      discount,
      taxRate,
      applyCredit,
      startupFeeAmount,
      totalInvoiceAmount,
      dueAmount,
      note: createInvoiceForm.note.value,

      subInvoiceList: subInvoiceList || null,
      split,
      paidStartupFee,
      startupFeeInvoiceNo:
        createInvoiceForm.startupFeeInvoiceNo &&
        createInvoiceForm.startupFeeInvoiceNo.value,
    };
  };

  handleClosePreview = () => {
    this.setState({ previewing: false });
  };

  render() {
    const { errorMessage, previewing, invoice, handleCreateInvoice } =
      this.state;
    const { t, classes } = this.props;

    return (
      <>
        <Paper className={classes.root}>
          <form
            onSubmit={this.handleCreateInvoice}
            id={'header'}
            ref={this.invoiceForm}
          >
            <div
              className="flex-child-auto container-padding"
              style={{ overflow: 'auto' }}
            >
              <div className="columns">
                <Typography variant="h6" gutterBottom>
                  {t('tab:Invoice')} #
                </Typography>
              </div>

              <InvoiceBasicForm
                t={t}
                errorMessage={errorMessage}
                removeErrorMsgHandler={this.removeErrorMessage}
                cleanErrorMessage={this.cleanErrorMessage}
              />
            </div>
            <div className="columns">
              <Divider variant="middle" />
              <div className="container-padding horizontal-layout">
                <PotentialButton onClick={this.handlePreview}>
                  {t('preview')}
                </PotentialButton>

                <PrimaryButton
                  type="submit"
                  processing={this.state.creating}
                  style={{ minWidth: 120 }}
                >
                  {t('action:saveAndContinue')}
                </PrimaryButton>
              </div>
            </div>
          </form>
        </Paper>

        <Dialog open={previewing} onClose={this.handleClosePreview}>
          <div
            style={{
              position: 'relative',
              zIndex: 100,
              visibility: previewing ? 'visible' : 'hidden',
            }}
          >
            <LocalPreview
              invoice={invoice}
              closePreview={this.handleClosePreview}
            />
          </div>
        </Dialog>

        <AlertDialog
          onOK={handleCreateInvoice}
          onCancel={this.handleCancelCreateInvoice}
          title={t('common:createInvoice')}
          content={t('message:createInvoiceAlert')}
          okLabel={t('action:confirm')}
          cancelLabel={t('action:cancel')}
        />
      </>
    );
  }
}

InvoiceCreate.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withTranslation(['action', 'message', 'field'])(
  connect()(withStyles(styles)(InvoiceCreate))
);
