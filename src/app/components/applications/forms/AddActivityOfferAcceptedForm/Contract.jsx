import React, { Component } from 'react';
import FormInput from '../../../particial/FormInput';
import DatePicker from 'react-datepicker';
import Immutable from 'immutable';
import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import Select from 'react-select';
import moment from 'moment-timezone';
import {
  jobType,
  currency as currencyOptions,
} from '../../../../constants/formOptions';
import { getApplicationOfferLetterParam } from '../../../../../apn-sdk';
import { connect } from 'react-redux';
import { showErrorMessage } from '../../../../actions';
import { mapOfferLetterParams, swichRate } from '../../../../../utils';

import NumberFormat from 'react-number-format';

const rateUnitTypeOptions = [
  { label: 'Yearly', value: 'YEARLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Hourly', value: 'HOURLY' },
];
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});
const state = {};

class ContractForm extends Component {
  constructor(props) {
    super(props);
    this.state = this._getStateFromOffer(
      props.application.applicationOfferLetter || {
        finalPayRate:
          (props.application.agreedPayRate &&
            (props.application.agreedPayRate.agreedPayRate < 0
              ? ''
              : props.application.agreedPayRate.agreedPayRate)) ||
          '',
        rateUnitType:
          (props.application.agreedPayRate &&
            props.application.agreedPayRate.rateUnitType) ||
          'HOURLY',
        currency:
          (props.application.agreedPayRate &&
            props.application.agreedPayRate.currency) ||
          'USD',
        estimatedWorkingHourPerWeek: 40,
        startDate:
          props.job.get('startDate') &&
          moment(props.job.get('startDate')).tz('utc').format('YYYY-MM-DD'),
        endDate:
          props.job.get('endDate') &&
          moment(props.job.get('endDate')).tz('utc').format('YYYY-MM-DD'),
      }
    );
  }

  componentDidMount() {
    this.getApplicationOfferLetterParam();
  }

  _getStateFromOffer = (offer) => {
    console.log('offer', offer);
    return {
      currency: offer.currency || 'USD',
      rateUnitType: offer.rateUnitType,
      totalBillAmount: offer.totalBillAmount,

      startDate: offer.startDate,
      endDate: offer.endDate,

      finalBillRate: offer.finalBillRate,
      finalPayRate: offer.finalPayRate,
      estimatedWorkingHourPerWeek: offer.estimatedWorkingHourPerWeek || 40,
      taxBurdenRate: offer.taxBurdenRate,
      taxBurdenRateOpts: offer.taxBurdenRate ? [offer.taxBurdenRate] : [],
      mspRate: offer.mspRate,
      mspRateOpts: offer.mspRate ? [offer.mspRate] : [],
      immigrationCost: offer.immigrationCost,
      immigrationCostOpts: offer.immigrationCost ? [offer.immigrationCost] : [],
      extraCost: offer.extraCost || '',
    };
  };

  getApplicationOfferLetterParam = () => {
    const { dispatch } = this.props;
    if (state.offerLetterParam) {
      this.setState(state.offerLetterParam);
    } else {
      getApplicationOfferLetterParam()
        .then(({ response }) => {
          state.offerLetterParam = mapOfferLetterParams(response);
          this.setState(state.offerLetterParam);
        })
        .catch((err) => dispatch(showErrorMessage(err)));
    }
  };

  computeContractGM = () => {
    clearTimeout(this.computeGM);
    this.computeGM = setTimeout(this._computeContractGM, 400);
  };
  // GM???????????? GM=(Bill Rate-Pay Rate-Tax Burden???Pay Rate*Tax Burden Rate???- MSP(Bill Rate*MSP Rate))*
  // (End Date-Start Date)/7*(Est. Working Hours/Week)
  // -Immigration Cost-Extra Cost
  _computeContractGM = () => {
    const {
      rateUnitType,
      taxBurdenRate,
      mspRate,
      immigrationCost,
      extraCost,
      endDate,
      startDate,
      estimatedWorkingHourPerWeek,
      finalBillRate,
      finalPayRate,
    } = this.state;
    if (
      finalBillRate &&
      finalPayRate &&
      taxBurdenRate &&
      mspRate &&
      immigrationCost &&
      endDate &&
      startDate
    ) {
      const dateGap = moment(endDate).diff(moment(startDate), 'days') + 1;
      const finalBillRate_hourly = swichRate(finalBillRate, rateUnitType);
      const finalPayRate_hourly = swichRate(finalPayRate, rateUnitType);
      const immigrationCostVal = immigrationCost.value;
      const totalBillAmount =
        (finalBillRate_hourly -
          finalPayRate_hourly -
          finalPayRate_hourly * (taxBurdenRate.value / 100) -
          finalBillRate_hourly * (mspRate.value / 100)) *
          ((dateGap / 7) * estimatedWorkingHourPerWeek) -
        immigrationCostVal -
        extraCost;
      console.log(totalBillAmount);
      this.setState({ totalBillAmount: Number(totalBillAmount.toFixed(4)) });
    }
  };

  handleDateChange = (key, value) => {
    this.setState({ [key]: value }, this.computeContractGM);
    this.props.removeErrorMsgHandler(key);
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value }, this.computeContractGM);
    this.props.removeErrorMsgHandler(key);
  };

  handleDropDownChange = (key) => (value) => {
    // console.log(key, value);
    value = value || this.state[key];
    this.setState({ [key]: value }, this._computeContractGM);
    this.props.removeErrorMsgHandler(key);
  };
  handleCurrencyChange = (currency) => {
    if (currency && currency !== this.state.currency) {
      this.setState(
        {
          currency,
          immigrationCost: null,
          taxBurdenRate: null,
          mspRate: null,
          totalBillAmount: null,
        },
        this._computeContractGM
      );
    }
  };

  render() {
    const {
      startDate,
      endDate,
      currency,
      rateUnitType,
      finalBillRate,
      finalPayRate,
      taxBurdenRate,
      mspRate,
      immigrationCost,
      extraCost,
      estimatedWorkingHourPerWeek,
      totalBillAmount,
      immigrationCostOpts,
      mspRateOpts,
      taxBurdenRateOpts,
    } = this.state;

    const { errorMessage, positionType, positionTitle, edit, t } = this.props;
    return (
      <section>
        {/* add by bill from 2021/1/12*/}

        {/* 1 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              value={positionTitle}
              name="Title"
              label={'Title'}
              disabled
            />
          </div>

          <div className="small-6 columns">
            <FormReactSelectContainer label="Position Type">
              <Select
                options={jobType}
                name={'positionType'}
                value={positionType}
                disabled
              />
            </FormReactSelectContainer>
          </div>
        </div>

        {/* 2 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <DatePicker
              dropdownMode={'select'}
              disabled={edit}
              selected={startDate ? moment(startDate) : null}
              customInput={
                <FormInput
                  label={t('field:startDate')}
                  isRequired
                  errorMessage={t(errorMessage.get('startDate'))}
                />
              }
              onChange={(date) => {
                this.handleDateChange(
                  'startDate',
                  date ? date.format('YYYY-MM-DD') : null
                );
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input type="hidden" name="startDate" value={startDate || ''} />
          </div>

          <div className="small-6 columns">
            <DatePicker
              dropdownMode={'select'}
              disabled={edit}
              selected={endDate ? moment(endDate) : null}
              minDate={startDate ? moment(startDate) : null}
              customInput={
                <FormInput
                  label={t('field:endDate')}
                  isRequired
                  errorMessage={t(errorMessage.get('endDate'))}
                />
              }
              onChange={(date) => {
                this.handleDateChange(
                  'endDate',
                  date ? date.format('YYYY-MM-DD') : null
                );
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input type="hidden" name="endDate" value={endDate || ''} />
          </div>
        </div>

        {/* 3 row */}

        {/* finalBillRate */}
        <div className="row expanded">
          <div className="small-3 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('finalBillRate'))}
              label={t('field:Final Bill Rate')}
              isRequired
            >
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={finalBillRate}
                onValueChange={this.handleNumberChange('finalBillRate')}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="finalBillRate"
              value={finalBillRate || ''}
            />
          </div>

          {/* finalPayRate */}
          <div className="small-3 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('finalPayRate'))}
              label={t('field:Final Pay Rate')}
              isRequired
            >
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={finalPayRate}
                onValueChange={this.handleNumberChange('finalPayRate')}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="finalPayRate"
              value={finalPayRate || ''}
            />
          </div>

          {/* ???????????? */}
          <div
            className="small-3 columns"
            // style={{ position: 'relative', top: '21px' }}
          >
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('currency'))}
              label={t('field:Rate Currency')}
              isRequired
            >
              <Select
                labelKey={'label2'}
                clearable={false}
                disabled={edit}
                value={currency}
                options={currencyOptions}
                onChange={this.handleCurrencyChange}
                simpleValue
              />
            </FormReactSelectContainer>
            <input type="hidden" name="currency" value={currency || ''} />
          </div>

          {/* ?????? */}
          <div className="small-3 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('rateUnitType'))}
              label={t('field:Rate Unit Type')}
              isRequired
            >
              <Select
                clearable={false}
                disabled={edit}
                value={rateUnitType}
                simpleValue
                options={rateUnitTypeOptions}
                onChange={this.handleDropDownChange('rateUnitType')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="rateUnitType"
              value={rateUnitType || ''}
            />
          </div>
        </div>

        {/* 4 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label="Tax Burden Rate"
              isRequired
              errorMessage={t(errorMessage.get('taxBurdenRate'))}
            >
              <Select
                valueKey={'code'}
                labelKey={'description'}
                clearable={false}
                disabled={edit}
                options={taxBurdenRateOpts.filter(
                  (e) => e.currency === currency
                )}
                value={taxBurdenRate}
                onChange={this.handleDropDownChange('taxBurdenRate')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="taxBurdenRateCode"
              value={(taxBurdenRate && taxBurdenRate.code) || ''}
            />
          </div>

          <div className="small-6 columns">
            <FormReactSelectContainer
              label="MSP Rate"
              isRequired
              errorMessage={t(errorMessage.get('mspRate'))}
            >
              <Select
                valueKey={'code'}
                labelKey={'description'}
                clearable={false}
                disabled={edit}
                options={mspRateOpts.filter((e) => e.currency === currency)}
                value={mspRate}
                onChange={this.handleDropDownChange('mspRate')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="mspRateCode"
              value={(mspRate && mspRate.code) || ''}
            />
          </div>
        </div>

        {/* 5 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label="Immigration Cost"
              isRequired
              errorMessage={t(errorMessage.get('immigrationCost'))}
            >
              <Select
                valueKey={'code'}
                labelKey={'description'}
                clearable={false}
                disabled={edit}
                options={immigrationCostOpts.filter(
                  (e) => e.currency === currency
                )}
                value={immigrationCost}
                onChange={this.handleDropDownChange('immigrationCost')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="immigrationCostCode"
              value={(immigrationCost && immigrationCost.code) || ''}
            />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer label={'Extra Cost'}>
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={extraCost}
                onValueChange={this.handleNumberChange('extraCost')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="extraCost" value={extraCost || ''} />
          </div>
        </div>

        {/* 6 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              disabled={edit}
              value={estimatedWorkingHourPerWeek}
              label={'Estimated Working Hour Per Week'}
              name="estimatedWorkingHourPerWeek"
              type="number"
              min={1}
              max={56}
              onChange={(e) => {
                this.setState(
                  { estimatedWorkingHourPerWeek: Number(e.target.value) },
                  this.computeContractGM
                );
              }}
            />
          </div>

          <div className="small-6 columns">
            <FormInput
              errorMessage={t(errorMessage.get('totalBillAmount'))}
              label={'GM'}
              isRequired
              disabled
              value={
                totalBillAmount
                  ? `${
                      currencyLabels[currency]
                    }${totalBillAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : ''
              }
            />
            <input
              type="hidden"
              name="totalBillAmount"
              value={totalBillAmount || ''}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default connect()(ContractForm);
