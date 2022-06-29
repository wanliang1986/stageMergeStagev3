import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  searchAllInvoiceListElasticSearch,
  getClientCredits,
} from '../../../../../apn-sdk/invoice';
import { getAllDivisionListByTenantId } from '../../../../../apn-sdk/division';
import memoizeOne from 'memoize-one';
import { getActiveClientList } from '../../../../selectors/clientSelector';
import { getClientContactByCompanyId } from '../../../../actions/clientActions';
import moment from 'moment-timezone';
import Immutable from 'immutable';
import {
  currency as currencyOptions,
  JOB_TYPES,
} from '../../../../constants/formOptions';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import NumberFormat from 'react-number-format';

import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import FormInput from '../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../components/particial/FormTextArea';
import SplitedInvoice from './SplitedInvoice';
import StartupFeeSelector from './StartupFeeSelector';
import InvoiceAmountDisplay from './InvoiceAmountDisplay';

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
  { value: 'FTE', label: 'FTE Invoice' },
];
const originalState = {
  invoiceType: 'FTE',
};

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const EmployeeOption = React.forwardRef(
  ({ children, className, option, onSelect, onFocus, isFocused }) => {
    // console.log('EmployeeOption', children, option);
    return (
      <div
        className={className}
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onSelect(option, event);
        }}
        onMouseEnter={(event) => {
          onFocus(option, event);
        }}
        onMouseMove={(event) => {
          if (!isFocused) {
            onFocus(option, event);
          }
        }}
        title={option.title}
      >
        <b>{children}</b> <br />
        <span style={{ fontSize: '0.85em' }}>
          {`#${option.jobId}-${option.jobTitle}`}
        </span>
      </div>
    );
  }
);

class InvoiceBasicForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      divisionId: null,
      employee: null,

      useCredit: false,
      clientCredits: 0,

      paidStartupFee: false,
      startupFeeInvoiceNo: null,
      startupFeeList: [],

      split: false,
      invoiceData: this._getInvoiceDataFromStart({}),
    };
    this.startList = [];
  }

  componentDidMount() {
    getAllDivisionListByTenantId().then((res) => {
      // console.log('[division list]', res.response);
      const divisionList = res.response.map((ele) => {
        return {
          label: ele.name,
          value: ele.id,
        };
      });
      this.setState({ divisionList: divisionList });
    });
  }

  fetchClientContacts = (companyId) => {
    if (companyId) {
      this.props.dispatch(getClientContactByCompanyId(companyId));
    }
  };

  fetchClientCredits = (companyId) => {
    if (companyId) {
      getClientCredits(companyId).then(({ response }) => {
        this.setState({ clientCredits: response.balance });
      });
    }
  };

  getEmployeeNameList = (input) => {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    const queryEmployee = {
      bool: {
        must: [
          {
            match: {
              talentName: {
                query: input,
                fuzziness: 'AUTO',
                operator: 'or',
              },
            },
          },
          {
            match: {
              positionType: JOB_TYPES.FullTime,
            },
          },
        ],
      },
    };

    return searchAllInvoiceListElasticSearch(0, 20, queryEmployee).then(
      (json) => {
        // console.log('search start', json.response.hits.hits);
        this.startList = [].concat(
          json.response.hits.hits.map((ele) => ele['_source'])
        );

        const employeeNameList = this.startList.map((start) => {
          return {
            name: start.talentName,
            id: start.id,
            jobId: start.jobId,
            jobTitle: start.jobTitle,
          };
        });
        return { options: employeeNameList };
      }
    );
  };

  onSelectEmployee = (employee) => {
    // console.log(employee);

    if (employee) {
      this.setState({ employee, splitInvoice: false });
      let start = this.startList.find((s) => s.id === employee.id);
      if (start) {
        this.setState(
          {
            split: false,
            paidStartupFee: false,
            startupFeeInvoiceNo: null,
            startupFeeList: [],
            invoiceData: this._getInvoiceDataFromStart(start),
          },
          () => {
            this.fetchClientContacts(this.state.invoiceData.companyId);
            this.fetchClientCredits(this.state.invoiceData.companyId);
            this.props.cleanErrorMessage();
          }
        );
      }
    }
  };

  _getInvoiceDataFromStart = (start) => {
    console.log('_getInvoiceDataFromStart', start);
    const startFteRate = (start && start.startFteRate) || {};
    return {
      startId: start.id || '',
      startDate: start.startDate || null,
      talentId: start.talentId || '',
      talentName: start.talentName || '',
      jobId: start.jobId || '',
      jobTitle: start.jobTitle || '',
      poNo: '',
      customerReference: '',

      companyId: start.companyId || '',
      clientContactId: start.clientContactId || '',
      clientName: start.company || '',
      customerName:
        (start.startClientInfo && start.startClientInfo.clientName) || '',
      customerAddress:
        (start.startClientInfo && start.startClientInfo.clientAddress) || '',

      currency: startFteRate.currency || 'USD',
      totalBillablePackage: startFteRate.totalBillableAmount || '',
      totalBillAmount: startFteRate.totalBillAmount || 0,
      taxRate: '',
      discount: '',
      applyCredit: '',
      totalInvoiceAmount: startFteRate.totalBillAmount || 0,
      dueAmount: startFteRate.totalBillAmount || 0,

      invoiceDate: moment().format('yyyy-MM-DD'),
      dueDate: moment().add(30, 'days').format('yyyy-MM-DD'),
      note: '',
    };
  };

  splitInvoiceHandler = (e) => {
    const split = e.target.checked;
    this.setState({ split: e.target.checked });
    if (split) {
      this.setState({
        split,
        subInvoiceList: [
          {
            invoiceDate: moment().format('yyyy-MM-DD'),
            dueDate: null,
            dueAmount: '',
          },
          {
            invoiceDate: moment().format('yyyy-MM-DD'),
            dueDate: null,
            dueAmount: '',
          },
        ],
      });
    } else {
      this.setState({ split, subInvoiceList: [] });
    }
  };

  onFocus = (removeErrorMsgHandler) => (e) => {
    this.setState(originalState);
    if (removeErrorMsgHandler) {
      removeErrorMsgHandler('employee');
    }
  };

  handleNumberChange =
    (key) =>
    ({ value }) => {
      const newInvoiceData = Object.assign({}, this.state.invoiceData);
      newInvoiceData[key] = value;
      this.setState({ invoiceData: newInvoiceData });
    };
  handleRateChange =
    (key) =>
    ({ value }) => {
      const newInvoiceData = Object.assign({}, this.state.invoiceData);
      newInvoiceData[key] = value / 100;
      this.setState({ invoiceData: newInvoiceData });
    };

  inputChangeHandler = (event) => {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    const newInvoiceData = Object.assign({}, this.state.invoiceData, {
      [name]: value,
    });
    this.setState({ invoiceData: newInvoiceData }, () => {
      this.props.removeErrorMsgHandler(name);
    });
  };

  handleDateChange = (key) => (date) => {
    const updates = {
      [key]: date ? date.format('yyyy-MM-DD') : null,
    };
    const newInvoiceData = Object.assign({}, this.state.invoiceData, updates);
    this.setState({ invoiceData: newInvoiceData }, () => {
      this.props.removeErrorMsgHandler(key);
    });
  };

  removeErrorMessage = () => () => {};

  toggleApplyCredit = (e) => {
    const useCredit = e.target.checked;
    this.setState({ useCredit });
    this.handleNumberChange('applyCredit')({ value: '' });
  };

  render() {
    const {
      t,
      classes,
      // invoice,
      errorMessage,
      removeErrorMsgHandler,
      clientList,
      dispatch,
    } = this.props;

    const invoice = this.state.invoiceData;

    const { companyMap, companyOptions } = getCompanyOptions(clientList);
    const clientOptions = companyMap[invoice.clientName] || [];

    //use clientContactName on preview
    const clientContact =
      invoice.clientContactId &&
      clientOptions.find((c) => c.id === invoice.clientContactId);
    return (
      <div>
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:employee')}
              errorMessage={errorMessage ? errorMessage.get('employee') : null}
            >
              <Select.Async
                multi={false}
                value={this.state.employee}
                onChange={this.onSelectEmployee}
                valueKey="id"
                labelKey="name"
                loadOptions={this.getEmployeeNameList}
                optionComponent={EmployeeOption}
                searchPromptText={'Type to search employee'}
                autoBlur={true}
                onFocus={this.onFocus(removeErrorMsgHandler)}
                clearable={false}
              />
            </FormReactSelectContainer>
            <input
              name="talentId"
              type="hidden"
              value={invoice.talentId || ''}
            />
            <input
              name="talentName"
              type="hidden"
              value={invoice.talentName || ''}
            />
            <input name="startId" type="hidden" value={invoice.startId || ''} />
          </div>

          <div className="small-4 columns">
            <FormInput
              name="jobId"
              label={t('field:jobNumber')}
              value={invoice.jobId || ''}
              readOnly
            />
          </div>

          <div className="small-4 columns">
            <FormInput
              name="jobTitle"
              label={t('field:jobTitle')}
              value={invoice.jobTitle || ''}
              readOnly
            />
          </div>
        </div>

        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:Invoice Type')}>
              <Select
                name="invoiceType"
                value={'FTE'}
                simpleValue
                options={invoiceTypeList}
                disabled
                inputProps={{ readOnly: true }}
              />
            </FormReactSelectContainer>
          </div>

          <div className="small-4 columns">
            <FormInput
              name="poNo"
              label={t('field:poNo')}
              value={invoice.poNo || ''}
              onChange={this.inputChangeHandler}
            />
          </div>

          <div className="small-4 columns">
            <FormInput
              name="customerReference"
              label={t('field:customerReference')}
              value={invoice.customerReference || ''}
              onChange={this.inputChangeHandler}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:Client Name')}>
              <Select
                options={companyOptions}
                value={invoice.clientName}
                simpleValue
                clearable={false}
                disabled
              />
            </FormReactSelectContainer>

            <input
              type="hidden"
              name="companyId"
              value={invoice.companyId || ''}
            />
            <input
              type="hidden"
              name="clientName"
              value={invoice.clientName || ''}
            />

            <input
              type="hidden"
              name="customerName"
              value={invoice.customerName || invoice.clientName || ''}
            />
            <input
              type="hidden"
              name="customerAddress"
              value={invoice.customerAddress || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('tab:Client Contact')}>
              <Select
                labelKey={'name'}
                valueKey={'id'}
                options={clientOptions}
                value={invoice.clientContactId}
                simpleValue
                clearable={false}
                disabled
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="clientContactId"
              value={invoice.clientContactId || ''}
            />
            <input
              type="hidden"
              name="clientContact"
              value={clientContact ? clientContact.name : ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:Division')}
              // isRequired
              errorMessage={errorMessage ? errorMessage.get('division') : null}
            >
              <Select
                value={this.state.divisionId}
                onChange={(divisionId) => this.setState({ divisionId })}
                simpleValue
                options={this.state.divisionList}
                searchable={false}
                clearable={false}
                autoBlur={true}
                onFocus={() => {
                  if (removeErrorMsgHandler) {
                    removeErrorMsgHandler('division');
                  }
                }}
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
            <DatePicker
              customInput={
                <FormInput
                  label={t('field:invoiceDate')}
                  isRequired={!this.state.split}
                  errorMessage={t(errorMessage.get('invoiceDate'))}
                />
              }
              className={classes.fullWidth}
              selected={
                invoice.invoiceDate && !this.state.split
                  ? moment(invoice.invoiceDate)
                  : null
              }
              onChange={this.handleDateChange('invoiceDate')}
              placeholderText="mm/dd/yyyy"
              disabled={this.state.split}
            />
            <input
              name="invoiceDate"
              type="hidden"
              value={invoice.invoiceDate || ''}
            />
          </div>

          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput
                  label={t('field:dueDate')}
                  isRequired={!this.state.split}
                  errorMessage={t(errorMessage.get('dueDate'))}
                />
              }
              className={classes.fullWidth}
              selected={
                invoice.dueDate && !this.state.split
                  ? moment(invoice.dueDate)
                  : null
              }
              onChange={this.handleDateChange('dueDate')}
              placeholderText="mm/dd/yyyy"
              disabled={this.state.split}
              minDate={invoice.invoiceDate ? moment(invoice.invoiceDate) : null}
            />
            <input name="dueDate" type="hidden" value={invoice.dueDate || ''} />
          </div>

          <div className="small-4 columns">
            <DatePicker
              customInput={<FormInput label={t('field:startDate')} />}
              className={classes.fullWidth}
              selected={invoice.startDate ? moment(invoice.startDate) : null}
              placeholderText="mm/dd/yyyy"
              disabled
            />
            <input
              name="startDate"
              type="hidden"
              value={invoice.startDate || ''}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:totalBillablePackage')}
              isRequired
              errorMessage={errorMessage.get('totalBillablePackage')}
            >
              <NumberFormat
                disabled
                decimalScale={0}
                thousandSeparator
                prefix={currencyLabels[invoice.currency] || ''}
                value={invoice.totalBillablePackage}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="totalBillablePackage"
              value={invoice.totalBillablePackage || ''}
            />
            <input
              type="hidden"
              name="currency"
              value={invoice.currency || ''}
            />
          </div>

          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('tab:Total Bill Amount')}
              isRequired
              errorMessage={errorMessage.get('totalBillAmount')}
            >
              <NumberFormat
                disabled
                decimalScale={2}
                thousandSeparator
                prefix={currencyLabels[invoice.currency] || ''}
                value={invoice.totalBillAmount || ''}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="totalBillAmount"
              value={invoice.totalBillAmount || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('tab:Discount')}
              errorMessage={errorMessage.get('discount')}
            >
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                prefix={currencyLabels[invoice.currency] || ''}
                value={invoice.discount}
                onValueChange={this.handleNumberChange('discount')}
                allowNegative={false}
                className={clsx({
                  'is-invalid-input': !!errorMessage.get('discount'),
                })}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="discount"
              value={invoice.discount || ''}
            />
          </div>
        </div>

        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('tab:Tax')}
              errorMessage={errorMessage.get('tax')}
            >
              <NumberFormat
                decimalScale={2}
                thousandSeparator
                suffix={'%'}
                value={invoice.taxRate ? Number(invoice.taxRate) * 100 : ''}
                onValueChange={this.handleRateChange('taxRate')}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="taxRate" value={invoice.taxRate || ''} />
          </div>

          <div className="small-8 ">
            <div className=" columns">
              <FormControlLabel
                control={
                  <Switch
                    onChange={this.toggleApplyCredit}
                    value="useCredit"
                    color="primary"
                    name="useCredit"
                    size={'small'}
                    checked={this.state.useCredit}
                  />
                }
                label={
                  <Typography
                    style={{
                      fontSize: '0.75rem',
                      color: '#212121',
                    }}
                  >
                    {t('tab:Apply Credit')}
                    {this.state.clientCredits ? (
                      <>
                        {' '}
                        (
                        <span style={{ color: '#2b97de' }}>
                          {currencyLabels[invoice.currency] || ''}
                          {this.state.clientCredits}
                        </span>{' '}
                        {t('tab:credit available')})
                      </>
                    ) : (
                      ''
                    )}
                  </Typography>
                }
                labelPlacement="start"
                style={{ marginLeft: 0, height: 21 }}
                disabled={!this.state.clientCredits}
                htmlFor={'applyCreditInput'}
              />
            </div>

            <div className="small-6 columns">
              <FormReactSelectContainer
                errorMessage={errorMessage.get('applyCredit')}
              >
                <NumberFormat
                  id={'applyCreditInput'}
                  decimalScale={2}
                  thousandSeparator
                  prefix={currencyLabels[invoice.currency] || ''}
                  value={invoice.applyCredit}
                  onValueChange={this.handleNumberChange('applyCredit')}
                  disabled={!this.state.useCredit}
                  allowNegative={false}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="applyCredit"
                value={invoice.applyCredit || ''}
              />
            </div>
          </div>
        </div>

        <StartupFeeSelector
          key={invoice.companyId}
          invoice={invoice}
          dispatch={dispatch}
          t={t}
          onSelect={(startupFee) => {
            console.log(startupFee);
            this.setState({
              invoiceData: {
                ...invoice,
                paidStartupFee: Boolean(startupFee),
                startupFeeInvoiceNo: startupFee ? startupFee.invoiceNo : null,
                startupFeeAmount: startupFee ? startupFee.dueAmount : null,
              },
            });
          }}
          errorMessage={errorMessage}
          removeErrorMsgHandler={removeErrorMsgHandler}
        />

        <div className="row expanded">
          <div className="small-12 columns">
            <FormTextArea
              name="note"
              label={t('field:note')}
              rows="3"
              value={invoice.note || ''}
              onChange={this.inputChangeHandler}
              errorMessage={t(errorMessage.get('note'))}
            />
          </div>
        </div>

        <InvoiceAmountDisplay invoice={invoice} t={t} />

        <div className="row expanded">
          <div className="columns">
            <FormControlLabel
              control={
                <Switch
                  onChange={this.splitInvoiceHandler}
                  value="splited"
                  color="primary"
                  name="split"
                  checked={this.state.split}
                />
              }
              label={t('tab:Split Invoice')}
              labelPlacement="start"
              style={{ marginLeft: 0 }}
            />
          </div>
        </div>

        {this.state.split ? (
          <div>
            <div className="columns">
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: ' #cc4b37',
                }}
              >
                {errorMessage.get('subAmountSum')}
              </span>
            </div>

            {[1, 2].map((ele, i) => (
              <SplitedInvoice
                key={i}
                t={t}
                removeErrorMsgHandler={removeErrorMsgHandler}
                errorMessage={errorMessage}
                index={i}
                currency={invoice.currency}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

InvoiceBasicForm.defaultProps = {
  errorMessage: Immutable.Map(),
};
const mapStateToProps = (state) => {
  return {
    clientList: getActiveClientList(state),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(InvoiceBasicForm));
const getCompanyOptions = memoizeOne((clientList) => {
  const companyMap = clientList.groupBy((c) => c.get('company')).toJS();
  const companyOptions = Object.keys(companyMap).map((v) => ({
    value: v,
    label: v,
  }));
  companyMap[null] = clientList.toJS();

  return {
    companyMap,
    companyOptions,
  };
});
