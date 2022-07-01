import React from 'react';
import moment from 'moment-timezone';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getAllDivisionListByTenantId,
  getClientContactByCompanyId,
} from '../../../../../apn-sdk';
import Immutable from 'immutable';
import { createInvoiceStartupfee } from '../../../../actions/invoiceActions';
import { currency as currencyOptions } from '../../../../constants/formOptions';

import DatePicker from 'react-datepicker';
import Select from 'react-select';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../components/particial/FormInput';
import NumberFormat from 'react-number-format';
import FormTextArea from '../../../../components/particial/FormTextArea';

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
};
const invoiceTypeList = [
  { value: 'STARTUP_FEE', label: 'Startup Fee Invoice' },
  { value: 'FTE', label: 'FTE' },
];

class StartupFeeInvoiceCreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      divisionList: [],
      clientContactOptions: [],
      errorMessage: Immutable.Map(),
      processing: false,

      invoiceDate: moment(),
      dueDate: moment(),
      invoiceType: 'STARTUP_FEE',
      companyId: null,
      currency: 'USD',
    };
  }
  componentDidMount() {
    getAllDivisionListByTenantId().then((res) => {
      console.log('[division list]', res.response);
      const divisionList = res.response.map((ele) => {
        return {
          label: ele.name,
          value: ele.id,
        };
      });
      this.setState({ divisionList: divisionList });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const createInvoiceForm = e.target;

    const { t, dispatch, history, companyOptions } = this.props;

    let errorMessage = this._validateForm(createInvoiceForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true });
    const invoice = {
      companyId: createInvoiceForm.companyId.value,
      customerName: createInvoiceForm.customerName.value,
      clientContactId: createInvoiceForm.clientContactId.value,
      poNo: createInvoiceForm.poNo.value,
      customerReference: createInvoiceForm.customerReference.value,
      divisionId: createInvoiceForm.divisionId.value || null,

      invoiceDate: createInvoiceForm.invoiceDate.value,
      dueDate: createInvoiceForm.dueDate.value,
      dueAmount: createInvoiceForm.dueAmount.value,
      currency: createInvoiceForm.currency.value,
      note: createInvoiceForm.note.value,

      invoiceType: createInvoiceForm.invoiceType.value,
    };
    console.log(invoice);

    dispatch(createInvoiceStartupfee(invoice)).then((res) => {
      console.log(res);
      this.setState({ processing: false });
      history.replace(`/finance/invoices/detail/${res['invoiceNo']}`);
    });
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();

    if (!form.companyId.value) {
      errorMessage = errorMessage.set(
        'company',
        t('message:Client name is required.')
      );
    }

    if (!form.invoiceDate.value) {
      errorMessage = errorMessage.set(
        'invoiceDate',
        t('message:Invoice date is required.')
      );
    }
    if (!form.dueDate.value) {
      errorMessage = errorMessage.set(
        'dueDate',
        t('message:Due date is required.')
      );
    }

    if (!form.dueAmount.value) {
      errorMessage = errorMessage.set(
        'dueAmount',
        t('message:Invoice amount is required.')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleCompanyChange = (companyId) => {
    if (companyId !== this.state.companyId) {
      const company = this.props.companyOptions.find(
        (c) => c.value === companyId
      );
      this.setState({
        companyId: company && company.value,
        customerName: company && company.label,
        clientContactId: null,
      });
      if (company) {
        getClientContactByCompanyId(company.value).then(({ response }) => {
          this.setState({
            clientContactOptions: response || [],
          });
        });
      } else {
        this.setState({
          clientContactOptions: [],
        });
      }
    }
  };

  handleClientContactChange = (clientContactId) => {
    this.setState({
      clientContactId,
    });
  };

  render() {
    const {
      errorMessage,
      divisionList,
      clientContactOptions,
      processing,
      companyId,
      clientContactId,
      currency,
    } = this.state;
    const { t, classes, companyOptions } = this.props;

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ position: 'relative' }}
      >
        <form
          className={classes.container}
          onSubmit={this.handleSubmit}
          id={'header'}
          style={{ width: 800 }}
        >
          <div
            className="flex-child-auto container-padding"
            style={{ overflow: 'auto' }}
          >
            <Typography variant="h5" style={{ marginBottom: '10px' }}>
              Invoice #
            </Typography>
            <div className="row expanded">
              <div className="small-4 columns">
                <FormReactSelectContainer
                  label={t('field:Client Name')}
                  isRequired={true}
                  errorMessage={errorMessage.get('company')}
                >
                  <Select
                    options={companyOptions}
                    value={companyId}
                    onChange={this.handleCompanyChange}
                    onBlur={() => this.removeErrorMessage('company')}
                    simpleValue
                    noResultsText={''}
                    autoBlur={true}
                    clearable={false}
                    openOnFocus={true}
                  />
                </FormReactSelectContainer>
                <input type="hidden" name="companyId" value={companyId || ''} />
                <input
                  type="hidden"
                  name="customerName"
                  value={this.state.customerName || ''}
                />
              </div>
              <div className="small-4 columns">
                <FormReactSelectContainer
                  label={t('field:Client Contact')}
                  errorMessage={
                    errorMessage ? errorMessage.get('clientContact') : null
                  }
                >
                  <Select
                    labelKey={'name'}
                    valueKey={'id'}
                    options={clientContactOptions}
                    value={clientContactId}
                    onChange={this.handleClientContactChange}
                    onBlur={() => this.removeErrorMessage('clientContact')}
                    simpleValue
                    noResultsText={''}
                    autoBlur={true}
                    clearable={false}
                    openOnFocus={true}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="clientContactId"
                  value={clientContactId || ''}
                />
              </div>

              <div className="small-4 columns">
                <FormReactSelectContainer
                  label={t('field:division')}
                  errorMessage={errorMessage.get('division')}
                >
                  <Select
                    name="divisionSelect"
                    value={this.state.divisionId}
                    onChange={(divisionId) => this.setState({ divisionId })}
                    simpleValue
                    options={divisionList}
                    searchable={false}
                    clearable={false}
                    autoBlur={true}
                    onFocus={() => this.removeErrorMessage('division')}
                  />
                </FormReactSelectContainer>
                <input
                  name="divisionId"
                  type="hidden"
                  value={this.state.divisionId || ''}
                />
              </div>
            </div>
            <div className="row expanded">
              <div className="small-4 columns">
                <FormReactSelectContainer label={t('field:Invoice Type')}>
                  <Select
                    value={this.state.invoiceType}
                    onChange={(invoiceType) =>
                      invoiceType && this.setState({ invoiceType })
                    }
                    simpleValue
                    options={invoiceTypeList}
                    disabled
                  />
                </FormReactSelectContainer>
                <input
                  name="invoiceType"
                  type="hidden"
                  value={this.state.invoiceType}
                />
              </div>

              <div className="small-4 columns">
                <FormInput
                  name="poNo"
                  label={t('field:poNo')}
                  defaultValue={''}
                />
              </div>

              <div className="small-4 columns">
                <FormInput
                  name="customerReference"
                  label={t('field:customerReference')}
                  defaultValue={''}
                />
              </div>
            </div>
            <div className="row expanded">
              <div className="small-4 columns">
                <DatePicker
                  customInput={
                    <FormInput
                      label={t('field:Invoice Date')}
                      name="invoiceDate"
                      isRequired
                      errorMessage={errorMessage.get('invoiceDate')}
                      onBlur={() => this.removeErrorMessage('invoiceDate')}
                    />
                  }
                  className={classes.fullWidth}
                  selected={this.state.invoiceDate}
                  onChange={(invoiceDate) => {
                    invoiceDate && this.removeErrorMessage('invoiceDate');
                    this.setState({ invoiceDate });
                  }}
                  placeholderText="mm/dd/yyyy"
                />
                <input
                  name="invoiceDate"
                  type="hidden"
                  value={
                    this.state.invoiceDate
                      ? this.state.invoiceDate.toISOString().split('.')[0] + 'Z'
                      : ''
                  }
                />
              </div>
              <div className="small-4 columns">
                <FormReactSelectContainer
                  label={t('field:Invoice Amount')}
                  isRequired
                  errorMessage={errorMessage.get('dueAmount')}
                >
                  <NumberFormat
                    decimalScale={0}
                    thousandSeparator
                    prefix={currency === 'USD' ? '$' : '¥'}
                    value={this.state.dueAmount}
                    onValueChange={(values) =>
                      this.setState({ dueAmount: values.value })
                    }
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="dueAmount"
                  value={this.state.dueAmount || ''}
                />
              </div>
              <div className="small-4 columns">
                <FormReactSelectContainer label="&nbsp;">
                  <Select
                    value={this.state.currency}
                    onChange={(currency) =>
                      currency && this.setState({ currency })
                    }
                    options={currencyOptions}
                    simpleValue
                    autoBlur
                    clearable={false}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="currency"
                  value={this.state.currency || ''}
                />
              </div>
            </div>

            <div className="small-4 columns">
              <DatePicker
                customInput={
                  <FormInput
                    label={t('field:dueDate')}
                    name="dueDate"
                    isRequired
                    onBlur={() => this.removeErrorMessage('dueDate')}
                  />
                }
                className={classes.fullWidth}
                selected={this.state.dueDate}
                onChange={(dueDate) => {
                  dueDate && this.removeErrorMessage('dueDate');
                  this.setState({ dueDate });
                }}
                placeholderText="mm/dd/yyyy"
              />
              <input
                name="dueDate"
                type="hidden"
                value={
                  this.state.dueDate
                    ? this.state.dueDate.format('YYYY-MM-DD')
                    : ''
                }
              />
            </div>

            <div className="small-12 columns">
              <FormTextArea
                name="note"
                label={t('field:note')}
                rows="3"
                defaultValue={''}
              />
            </div>
          </div>

          <div>
            <Divider />
            <div className="container-padding">
              <div className={classes.wrapper} style={{ display: 'flex' }}>
                <PrimaryButton
                  type="submit"
                  style={{ minWidth: 120, marginLeft: '15px' }}
                  processing={processing}
                >
                  {t('action:create')}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </form>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    companyOptions: state.model.companiesOptions.toJS(),
  };
};

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStateToProps)(withStyles(styles)(StartupFeeInvoiceCreateForm))
);
