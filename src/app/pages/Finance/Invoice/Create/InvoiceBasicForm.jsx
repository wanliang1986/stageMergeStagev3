import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { searchAllInvoiceListElasticSearch } from '../../../../../apn-sdk/invoice';
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

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },

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
const invoiceTypeList = [
  { value: 'STARTUP_FEE', label: 'Startup Fee Invoice' },
  { value: 'FTE', label: 'FTE' },
];
const originalState = {
  invoiceType: 'FTE',
};

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class InvoiceBasicForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      divisionId: null,
      employee: null,

      applyCredit: false,

      paidStartupFee: false,
      startupFeeInvoiceNo: null,
      startupFeeList: [],
      // startupFeeInvoiceNo: '20200121040075',
      // startupFeeAmount: 4000,

      split: false,
      invoiceData: this._getInvoiceDataFromStart({}),
    };
    this.startList = [];
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

  fetchClientContacts = (companyId) => {
    if (companyId) {
      this.props.dispatch(getClientContactByCompanyId(companyId));
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
            regexp: {
              talentName: `${input}.*`,
            },
          },
          {
            match: {
              positionType: JOB_TYPES.FullTime,
            },
          },
          {
            match: {
              status: 'ACTIVE',
            },
          },
        ],
      },
    };

    return searchAllInvoiceListElasticSearch(0, 20, queryEmployee).then(
      (json) => {
        console.log('search start', json.response.hits.hits);
        this.startList = [].concat(
          json.response.hits.hits.map((ele) => ele['_source'])
        );

        const employeeNameList = this.startList.map((start) => {
          return {
            name: start.talentName,
            id: start.id,
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
          }
        );
      }
    }
  };

  _getInvoiceDataFromStart = (start) => {
    console.log(start);
    const startFteRate = (start && start.startFteRate) || {};
    return {
      startId: start.id || '',
      startDate: start.startDate && moment(start.startDate),
      talentId: start.talentId || '',
      talentName: start.talentName || '',
      jobId: start.jobId || '',
      jobTitle: start.jobTitle || '',
      customerName: start.company || '',
      companyId: start.companyId || '',
      clientContactId: start.clientContactId || '',

      currency: startFteRate.currency || 'USD',
      totalBillablePackage: startFteRate.totalBillableAmount || '',
      feeType: startFteRate.feeType,
      finalFee: startFteRate.totalBillAmount || 0,
      discount: '',
      applyCredit: '',
      totalAmount: startFteRate.totalBillAmount || 0,
      dueAmount: startFteRate.totalBillAmount || 0,
      pct:
        startFteRate.feePercentage &&
        (startFteRate.feePercentage >= 1
          ? startFteRate.feePercentage
          : startFteRate.feePercentage * 100),

      invoiceDate: moment(),
      dueDate: moment().add(30, 'days'),
      note: '',
    };
  };

  splitInvoceHandler = (e) => {
    const split = e.target.checked;
    this.setState({ split: e.target.checked });
    if (split) {
      this.setState({
        split,
        subInvoiceList: [
          {
            date: moment(),
            amount: '',
          },
          {
            date: moment(),
            amount: '',
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

  inputChangeHandler = (event) => {
    const target = event.target;
    let value = target.value;
    const name = target.name;
    const newInvoiceData = Object.assign({}, this.state.invoiceData, {
      [name]: value,
    });
    this.setState({ invoiceData: newInvoiceData });
  };

  removeErrorMessage = () => () => {};

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
    const clientOptions = companyMap[invoice.customerName] || [];
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
                searchPromptText={'Type to search employee'}
                autoBlur={true}
                onFocus={this.onFocus(removeErrorMsgHandler)}
                clearable={false}
              />
            </FormReactSelectContainer>
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
                onChange={(invoiceType) =>
                  invoiceType && this.setState({ invoiceType })
                }
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
                value={invoice.customerName}
                simpleValue
                clearable={false}
                disabled
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="customerName"
              value={invoice.customerName || ''}
            />
            <input
              type="hidden"
              name="companyId"
              value={invoice.companyId || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:Client Contact')}>
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
              label={t('field:division')}
              isRequired
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
                <FormInput label={t('field:invoiceDate')} name="invoiceDate" />
              }
              className={classes.fullWidth}
              selected={invoice.invoiceDate}
              onChange={(invoiceDate) => {
                this.setState({ invoice: { ...invoice, invoiceDate } });
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="invoiceDate"
              type="hidden"
              value={
                invoice.invoiceDate
                  ? invoice.invoiceDate.format('YYYY-MM-DD')
                  : ''
              }
            />
          </div>

          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:dueDate')} name="dueDate" />
              }
              className={classes.fullWidth}
              selected={invoice.dueDate}
              onChange={(dueDate) => {
                this.setState({ invoice: { ...invoice, dueDate } });
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="dueDate"
              type="hidden"
              value={
                invoice.dueDate ? invoice.dueDate.format('YYYY-MM-DD') : ''
              }
            />
          </div>

          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:startDate')} name="startDate" />
              }
              className={classes.fullWidth}
              selected={invoice.startDate}
              placeholderText="mm/dd/yyyy"
              disabled
            />
            <input
              name="startDate"
              type="hidden"
              value={
                invoice.startDate ? invoice.startDate.format('YYYY-MM-DD') : ''
              }
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
                // onValueChange={this.handleNumberChange('totalBillablePackage')}
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
            {invoice.feeType === 'PERCENTAGE' && (
              <FormInput
                name="fee"
                label={t('field:fee')}
                value={invoice.pct}
                readOnly
              />
            )}
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:finalFee')}
              isRequired
              errorMessage={errorMessage.get('finalFee')}
            >
              <NumberFormat
                disabled
                decimalScale={0}
                thousandSeparator
                prefix={currencyLabels[invoice.currency] || ''}
                value={invoice.finalFee}
                // onValueChange={this.handleNumberChange('finalFee')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="finalFee"
              value={invoice.finalFee || ''}
            />
            <input
              type="hidden"
              name="dueAmount"
              value={invoice.dueAmount || ''}
            />
            <input
              type="hidden"
              name="totalAmount"
              value={invoice.totalAmount || ''}
            />
          </div>
        </div>

        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:discount')}
              errorMessage={errorMessage.get('discount')}
            >
              <NumberFormat
                decimalScale={0}
                thousandSeparator
                prefix={currencyLabels[invoice.currency] || ''}
                value={invoice.discount}
                onValueChange={this.handleNumberChange('discount')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="discount"
              value={invoice.discount || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:Apply Credit')}
              errorMessage={errorMessage.get('applyCredit')}
            >
              <NumberFormat
                decimalScale={0}
                thousandSeparator
                prefix={currencyLabels[invoice.currency] || ''}
                value={invoice.applyCredit}
                onValueChange={this.handleNumberChange('applyCredit')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="applyCredit"
              value={invoice.applyCredit || ''}
            />
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
        />

        <div className="row expanded">
          <div className="small-12 columns">
            <FormTextArea
              name="note"
              label={t('field:note')}
              rows="3"
              value={invoice.note}
              onChange={this.inputChangeHandler}
            />
          </div>
          <input name="talentId" type="hidden" value={invoice.talentId || ''} />
          <input
            name="talentName"
            type="hidden"
            value={invoice.talentName || ''}
          />
          <input name="startId" type="hidden" value={invoice.startId || ''} />
        </div>

        <div
          className="row expanded"
          style={{ marginTop: 30, marginBottom: 16 }}
        >
          <div className="small-12 columns align-right">
            <div className={classes.summaryDiv}>
              <div className={classes.summary}>
                <Typography
                  variant="caption"
                  className={classes.row}
                  gutterBottom
                >
                  Subtotal
                  <span>
                    {currencyLabels[invoice.currency] || ''}
                    {(Number(invoice.finalFee) || 0).toLocaleString()}
                  </span>
                </Typography>
                <Typography
                  variant="caption"
                  className={classes.row}
                  gutterBottom
                >
                  Discount
                  <span>
                    {currencyLabels[invoice.currency] || ''}
                    {invoice.discount && '-'}
                    {(Number(invoice.discount) || 0).toLocaleString()}
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
                      {currencyLabels[invoice.currency] || ''}-
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
                      {currencyLabels[invoice.currency] || ''}-
                      {(Number(invoice.applyCredit) || 0).toLocaleString()}
                    </span>
                  </Typography>
                )}
                <Typography variant="subtitle1" className={classes.row}>
                  <b>Total</b>
                  <b>
                    {currencyLabels[invoice.currency] || ''}
                    {(
                      (Number(invoice.finalFee) || 0) -
                      (Number(invoice.discount) || 0) -
                      (Number(invoice.startupFeeAmount) || 0) -
                      (Number(invoice.applyCredit) || 0)
                    ).toLocaleString()}
                  </b>
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="row expanded">
          <div className="columns">
            <FormControlLabel
              control={
                <Switch
                  onChange={this.splitInvoceHandler}
                  value="splited"
                  color="primary"
                  name="split"
                  checked={this.state.split}
                />
              }
              label="Split Invoice"
              labelPlacement="start"
              style={{ marginLeft: 0 }}
            />
          </div>
        </div>

        {this.state.split ? (
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: ' #cc4b37',
              }}
            >
              {errorMessage.get('subAmountSum')}
            </span>

            {[1, 2].map((ele, i) => (
              <SplitedInvoice
                key={i}
                t={t}
                removeErrorMsgHandler={removeErrorMsgHandler}
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
