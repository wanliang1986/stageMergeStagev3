import React from 'react';
import { connect } from 'react-redux';
import { currency as currencyOptions } from '../../../../../constants/formOptions';
import DatePicker from 'react-datepicker';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import moment from 'moment-timezone';
import { getApplicationOfferLetterParam } from '../../../../../../apn-sdk';
import { showErrorMessage } from '../../../../../actions';
import { mapOfferLetterParams, swichRate } from '../../../../../../utils';

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

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingParams: true,
      currency: props.startContractRate.currency || 'USD',
      rateUnitType: props.startContractRate.rateUnitType || 'HOURLY',
      totalBillAmount: props.startContractRate.totalBillAmount || '',

      startDate: props.startContractRate.startDate,
      endDate: props.startContractRate.endDate,

      finalBillRate: props.startContractRate.finalBillRate,
      finalPayRate: props.startContractRate.finalPayRate,
      estimatedWorkingHourPerWeek:
        props.startContractRate.estimatedWorkingHourPerWeek,
      taxBurdenRate: props.startContractRate.taxBurdenRate,
      mspRate: props.startContractRate.mspRate,
      immigrationCost: props.startContractRate.immigrationCost,
      extraCost: props.startContractRate.extraCost || '',

      // options
      taxBurdenRateOpts: props.startContractRate.taxBurdenRate
        ? [props.startContractRate.taxBurdenRate]
        : [],
      mspRateOpts: props.startContractRate.mspRate
        ? [props.startContractRate.mspRate]
        : [],
      immigrationCostOpts: props.startContractRate.immigrationCost
        ? [props.startContractRate.immigrationCost]
        : [],
    };
  }

  componentDidMount() {
    this.getParams();
  }

  getParams = () => {
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
      const totalBillAmount =
        (finalBillRate_hourly -
          finalPayRate_hourly -
          finalPayRate_hourly * (taxBurdenRate.value / 100) -
          finalBillRate_hourly * (mspRate.value / 100)) *
          ((dateGap / 7) * estimatedWorkingHourPerWeek) -
        immigrationCost.value -
        extraCost;
      console.log(totalBillAmount);
      this.setState({ totalBillAmount });
    }
  };

  handleDateChange = (key) => (value) => {
    this.setState(
      { [key]: value ? value.format('YYYY-MM-DD') : null },
      this.computeContractGM
    );
    this.props.removeErrorMsgHandler(key);
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value }, this.computeContractGM);
    this.props.removeErrorMsgHandler(key);
  };

  handleDropDownChange = (key) => (value) => {
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
      loadingParams,
      startDate,
      endDate,
      currency,
      rateUnitType,
      finalBillRate,
      finalPayRate,
      taxBurdenRateOpts,
      taxBurdenRate,
      mspRateOpts,
      mspRate,
      immigrationCostOpts,
      immigrationCost,
      extraCost,
      estimatedWorkingHourPerWeek,
      totalBillAmount,
    } = this.state;
    const { t, edit, errorMessage, start } = this.props;
    if (loadingParams) {
      return null;
    }
    return (
      <>
        <input
          type="hidden"
          name="startType"
          value={start.startType || 'CONTRACT_NEW_HIRE'}
        />
        <div className="row expanded">
          <div className="small-6 columns">
            <DatePicker
              dropdownMode={'scroll'}
              customInput={
                <FormInput
                  label={t('field:startDate')}
                  isRequired
                  errorMessage={t(errorMessage.get('startDate'))}
                />
              }
              selected={startDate ? moment(startDate) : null}
              onChange={this.handleDateChange('startDate')}
              placeholderText="mm/dd/yyyy"
              disabled={!edit}
            />
            <input name="startDate" type="hidden" value={startDate || ''} />
          </div>

          <div className="small-6 columns">
            <DatePicker
              dropdownMode={'scroll'}
              minDate={startDate ? moment(startDate) : null}
              customInput={
                <FormInput
                  isRequired
                  errorMessage={t(errorMessage.get('endDate'))}
                  label={t('field:endDate')}
                />
              }
              selected={endDate ? moment(endDate) : null}
              onChange={this.handleDateChange('endDate')}
              placeholderText="mm/dd/yyyy"
              disabled={!edit}
            />
            <input name="endDate" type="hidden" value={endDate || ''} />
          </div>
        </div>

        <div className="row expanded">
          {/* finalBillRate */}
          <div className="small-3 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('finalBillRate'))}
              label={t('field:Final Bill Rate')}
              isRequired
            >
              <NumberFormat
                disabled={!edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={finalBillRate}
                onValueChange={this.handleNumberChange('finalBillRate')}
                decimalScale={2}
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
                disabled={!edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={finalPayRate}
                onValueChange={this.handleNumberChange('finalPayRate')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="finalPayRate"
              value={finalPayRate || ''}
            />
          </div>

          {/* 货币单位 */}
          <div className="small-3 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('currency'))}
              label={t('field:Rate Currency')}
              isRequired
            >
              <Select
                labelKey="label2"
                clearable={false}
                disabled={!edit}
                value={currency}
                options={currencyOptions}
                onChange={this.handleCurrencyChange}
                simpleValue
              />
            </FormReactSelectContainer>
            <input type="hidden" name="currency" value={currency} />
          </div>

          {/* 周期 */}
          <div className="small-3 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('rateUnitType'))}
              label={t('field:Rate Unit Type')}
              isRequired
            >
              <Select
                clearable={false}
                disabled={!edit}
                value={rateUnitType}
                simpleValue
                options={rateUnitTypeOptions}
                onChange={this.handleDropDownChange('rateUnitType')}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="rateUnitType" value={rateUnitType} />
          </div>
        </div>

        {/* 4 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:Tax Burden Rate')}
              isRequired
              errorMessage={t(errorMessage.get('taxBurdenRate'))}
            >
              <Select
                valueKey={'code'}
                labelKey={'description'}
                clearable={false}
                disabled={!edit}
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
              label={t('field:MSP Rate')}
              isRequired
              errorMessage={t(errorMessage.get('mspRate'))}
            >
              <Select
                valueKey={'code'}
                labelKey={'description'}
                clearable={false}
                disabled={!edit}
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
              label={t('field:Immigration Cost')}
              isRequired
              errorMessage={t(errorMessage.get('immigrationCost'))}
            >
              <Select
                valueKey={'code'}
                labelKey={'description'}
                clearable={false}
                disabled={!edit}
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
                disabled={!edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={extraCost}
                onValueChange={this.handleNumberChange('extraCost')}
                decimalScale={2}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="extraCost" value={extraCost || ''} />
          </div>
        </div>

        {/* 6 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              isRequired
              errorMessage={t(errorMessage.get('estimatedWorkingHourPerWeek'))}
              disabled={!edit}
              value={estimatedWorkingHourPerWeek || ''}
              label={'Estimated Working Hour Per Week'}
              name="estimatedWorkingHourPerWeek"
              type="number"
              min={1}
              max={56}
              onChange={(e) => {
                this.props.removeErrorMsgHandler('estimatedWorkingHourPerWeek');
                this.setState(
                  { estimatedWorkingHourPerWeek: Number(e.target.value) },
                  this.computeContractGM
                );
              }}
            />
          </div>

          <div className="small-6 columns">
            <FormInput
              errorMessage={errorMessage.get('totalBillAmount')}
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
      </>
    );
  }
}

export default connect()(Contract);
