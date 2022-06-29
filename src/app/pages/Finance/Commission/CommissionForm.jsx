import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import * as FormOptions from '../../../constants/formOptions';
import { getStart } from '../../../actions/startActions';
import { createCommission } from '../../../actions/commissionActions';
import { getInvoiceByStart } from '../../../../apn-sdk';
import { withStyles } from '@material-ui/core';
import { getJobTypeLabel } from '../../../constants/formOptions';

import Select from 'react-select';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import Loading from '../../../components/particial/Loading';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';

const userTypeOptions = FormOptions.userType;
const currencyMaps = {
  USD: '$',
  CNY: '¥',
};
const rateUnitTypeMaps = {
  YEARLY: '/Year',
  MONTHLY: '/Month',
  WEEKLY: '/Week',
  DAILY: '/Day',
  HOURLY: '/Hour',
};
const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
};

class CommissionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: null,
      invoiceOptions: [],

      grossMargin: 0,
      receivedAmount: 0,
      applyCredit: 0,

      errorMessage: Immutable.Map(),
    };
  }
  componentDidMount(): void {
    const { startId, dispatch } = this.props;
    dispatch(getStart(startId));
    getInvoiceByStart(startId).then(({ response }) =>
      this.setState({
        invoiceOptions: response.filter((i) => i.status === 'PAID'),
      })
    );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const commissionForm = e.target;
    const { dispatch, onSubmitSuccess, onSubmit, t } = this.props;
    console.log('handleSubmit');
    let errorMessage = this._validateForm(commissionForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    onSubmit();

    const newCommission = {
      startId: commissionForm.startId.value,
      invoiceNo: commissionForm.invoiceNo && commissionForm.invoiceNo.value,
      invoiceId: commissionForm.invoiceId && commissionForm.invoiceId.value,
      receivedAmount: Number(commissionForm.receivedAmount.value),
      grossMargin: Number(commissionForm.grossMargin.value),
      billDate: commissionForm.billDate.value,
    };

    console.log(newCommission);
    dispatch(createCommission(newCommission)).then(onSubmitSuccess);
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();
    if (!form.billDate.value) {
      errorMessage = errorMessage.set(
        'billDate',
        t('message:Bill Date is required')
      );
    }
    if (!form.grossMargin.value) {
      errorMessage = errorMessage.set(
        'grossMargin',
        t('message:Gross Margin is required')
      );
    }
    if (!form.receivedAmount.value) {
      errorMessage = errorMessage.set(
        'receivedAmount',
        t('message:Received Amount is required')
      );
    }
    return errorMessage.size > 0 && errorMessage;
  };

  renderCommission = (commission) => {
    const { receivedAmount, applyCredit, grossMargin } = this.state;
    const { t, start, startCommissions } = this.props;
    const index = startCommissions.indexOf(commission);
    console.log(receivedAmount);
    const saleAmount =
      ((Number(grossMargin) || 0) * commission.percentage) / 100;
    return (
      <div key={index} className="row expanded">
        <div className="small-3 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              autoBlur
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-3 columns">
          <FormReactSelectContainer>
            <Select
              valueKey="userId"
              labelKey="userFullName"
              value={commission}
              options={startCommissions}
              autoBlur
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-3 columns">
          <FormInput
            name="commissions.commissionPct"
            value={commission.percentage}
            type="number"
            disabled
          />
        </div>
        <div className="small-3 columns">
          <FormReactSelectContainer>
            <NumberFormat
              thousandSeparator
              prefix={start.get('currency') === 'USD' ? '$' : '¥'}
              value={saleAmount}
              disabled
            />
          </FormReactSelectContainer>
        </div>
      </div>
    );
  };

  render() {
    const { invoiceOptions, errorMessage } = this.state;
    const { t, classes, start, startId, startCommissions } = this.props;
    let startContractRates = start.get('startContractRates').toJS()[0];

    if (!startCommissions) {
      return (
        <>
          <DialogTitle>{t('common:createCommission')}</DialogTitle>
          <div style={{ height: '40vh', display: 'flex' }}>
            <Loading />
          </div>
          ;
        </>
      );
    }
    const { recruiter, sales, sourcer, owner } = startCommissions.reduce(
      (res, c) => {
        if (c.userRole === 'AM') {
          res.sales.push(c);
        } else if (c.userRole === 'SOURCER') {
          res.sourcer.push(c);
        } else if (c.userRole === 'RECRUITER') {
          res.recruiter.push(c);
        } else if (c.userRole === 'OWNER') {
          res.owner.push(c);
        }
        return res;
      },
      {
        recruiter: [],
        sales: [],
        sourcer: [],
        owner: [],
      }
    );

    return (
      <>
        <DialogTitle>{t('common:createCommission')}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id="commissionForm">
            <input type="hidden" name="startId" value={startId} />

            <div className="row expanded">
              <div className="small-6 columns">
                <FormInput
                  name="jobTitle"
                  label={t('field:employee')}
                  value={start.get('talentName') || ''}
                  readOnly
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="jobTitle"
                  label={t('field:jobTitle')}
                  value={start.get('jobTitle') || ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row expanded">
              <div className="small-6 columns">
                <FormInput
                  name="company"
                  label={t('field:company')}
                  value={start.get('company') || ''}
                  readOnly
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="positionType"
                  label={t('field:positionType')}
                  value={getJobTypeLabel(start.get('positionType')) || ''}
                  readOnly
                />
              </div>
            </div>
            <div className="row expanded">
              <div className="small-6 columns">
                <FormInput
                  name="startDate"
                  type="date"
                  label={t('field:startDate')}
                  value={start.get('startDate') || ''}
                  readOnly
                />
              </div>

              <div className="small-6 columns">
                <FormInput
                  name="endDate"
                  type="date"
                  label={t('field:endDate')}
                  value={start.get('endDate') || ''}
                  readOnly
                />
              </div>
            </div>
            {start.get('positionType') === 'FULL_TIME' ? (
              <div className="row expanded">
                <div className="small-6 columns">
                  <FormReactSelectContainer label={t('field:Invoice No.')}>
                    <Select
                      labelKey={'invoiceNo'}
                      valueKey={'invoiceNo'}
                      options={invoiceOptions}
                      value={this.state.invoice}
                      onChange={(invoice) =>
                        this.setState({
                          invoice,
                          billDate: invoice && moment(invoice.invoiceDate),
                          grossMargin: invoice
                            ? Number(invoice.finalFee) || 0
                            : 0,
                          receivedAmount: invoice
                            ? Number(invoice.totalAmount) || 0
                            : 0,
                        })
                      }
                      noResultsText={''}
                      autoBlur
                      clearable={false}
                      openOnFocus
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="invoiceNo"
                    value={
                      (this.state.invoice && this.state.invoice.invoiceNo) || ''
                    }
                  />

                  <input
                    type="hidden"
                    name="invoiceId"
                    value={(this.state.invoice && this.state.invoice.id) || ''}
                  />
                </div>
                <div className="small-6 columns">
                  <DatePicker
                    customInput={
                      <FormInput
                        label={t('field:billDate')}
                        isRequired
                        errorMessage={errorMessage.get('billDate')}
                      />
                    }
                    disabled={!!this.state.invoice}
                    className={classes.fullWidth}
                    selected={this.state.billDate}
                    onChange={(billDate) => this.setState({ billDate })}
                    placeholderText="mm/dd/yyyy"
                  />
                  <input
                    name="billDate"
                    type="hidden"
                    value={
                      this.state.billDate
                        ? this.state.billDate.format('YYYY-MM-DD')
                        : ''
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="row expanded">
                <div className="small-3 columns">
                  <FormInput
                    label={t('field:Final Bill Rate')}
                    name="finalBillRate"
                    defaultValue={`${
                      currencyMaps[startContractRates.currency]
                    }${startContractRates.finalBillRate}${
                      rateUnitTypeMaps[startContractRates.rateUnitType]
                    }`}
                    disabled
                  />
                </div>
                <div className="small-3 columns">
                  <FormInput
                    label={t('field:Final Pay Rate')}
                    name="finalBillRate"
                    defaultValue={`${
                      currencyMaps[startContractRates.currency]
                    }${startContractRates.finalPayRate}${
                      rateUnitTypeMaps[startContractRates.rateUnitType]
                    }`}
                    disabled
                  />
                </div>
                <div className="small-6 columns">
                  <DatePicker
                    customInput={
                      <FormInput
                        label={t('field:billDate')}
                        isRequired
                        errorMessage={errorMessage.get('billDate')}
                      />
                    }
                    className={classes.fullWidth}
                    selected={this.state.billDate}
                    onChange={(billDate) => this.setState({ billDate })}
                    placeholderText="mm/dd/yyyy"
                  />
                  <input
                    name="billDate"
                    type="hidden"
                    value={
                      this.state.billDate
                        ? this.state.billDate.format('YYYY-MM-DD')
                        : ''
                    }
                  />
                </div>
              </div>
            )}
            <div className="row expanded">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={t('field:receivedAmount')}
                  isRequired
                  errorMessage={errorMessage.get('receivedAmount')}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={start.get('currency') === 'USD' ? '$' : '¥'}
                    value={this.state.receivedAmount || ''}
                    onValueChange={({ value }) =>
                      this.setState({ receivedAmount: value })
                    }
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="receivedAmount"
                  value={this.state.receivedAmount || ''}
                />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={t('field:grossMargin')}
                  isRequired
                  errorMessage={errorMessage.get('grossMargin')}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={start.get('currency') === 'USD' ? '$' : '¥'}
                    value={this.state.grossMargin || ''}
                    onValueChange={({ value }) =>
                      this.setState({ grossMargin: value })
                    }
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="grossMargin"
                  value={this.state.grossMargin || ''}
                />
              </div>
            </div>

            <div className="row expanded">
              <div className="small-3 columns">
                <FormReactSelectContainer
                  isRequired
                  label={t('field:userRole')}
                />
              </div>
              <div className="small-3 columns">
                <FormReactSelectContainer
                  isRequired
                  label={t('field:userName')}
                />
              </div>
              <div className="small-3 columns">
                <FormReactSelectContainer
                  isRequired
                  label={t('field:commissionSplit')}
                />
              </div>

              <div className="small-3 columns">
                <FormReactSelectContainer label={t('field:Commission')} />
              </div>
            </div>
            {sales.map((commission) => {
              return this.renderCommission(commission, 'AM', sales.length);
            })}
            {recruiter.map((commission) => {
              return this.renderCommission(
                commission,
                'RECRUITER',
                recruiter.length
              );
            })}

            {sourcer.map((commission) => {
              return this.renderCommission(
                commission,
                'SOURCER',
                sourcer.length
              );
            })}
            {owner.map((commission) => {
              return this.renderCommission(commission, 'OWNER', owner.length);
            })}
          </form>
        </DialogContent>
      </>
    );
  }
}

function mapStoreStateToProps(state, { startId }) {
  const start = state.relationModel.starts.get(String(startId));
  return {
    start,
    startCommissions:
      start.get('startCommissions') && start.get('startCommissions').toJS(),
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(CommissionForm)
);
