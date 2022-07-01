import React, { Component } from 'react';
import FormInput from '../../../particial/FormInput';
import DatePicker from 'react-datepicker';
import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import Select from 'react-select';
import moment from 'moment-timezone';
import {
  jobType,
  currency as currencyOptions,
} from '../../../../constants/formOptions';
import { swichSalary } from '../../../../../utils';

import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';
import NumberFormat from 'react-number-format';

const feeTypeOptions = [
  {
    value: 'PERCENTAGE',
    label: '%',
  },
  {
    value: 'FLAT_AMOUNT',
    label: 'Flat Amount',
  },
];
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

class FullTimeForm extends Component {
  constructor(props) {
    super(props);
    this.state = this._getStateFromOffer(
      props.application.applicationOfferLetter || {
        salary:
          (props.application.agreedPayRate &&
            (props.application.agreedPayRate.agreedPayRate < 0
              ? ''
              : props.application.agreedPayRate.agreedPayRate)) ||
          '',
        rateUnitType:
          (props.application.agreedPayRate &&
            props.application.agreedPayRate.rateUnitType) ||
          'YEARLY',
        currency:
          (props.application.agreedPayRate &&
            props.application.agreedPayRate.currency) ||
          'USD',
      }
    );
  }

  _getStateFromOffer = (offer) => {
    console.log('offer', offer);
    return {
      currency: offer.currency || 'USD',
      rateUnitType: offer.rateUnitType,
      totalBillAmount: offer.totalBillAmount,

      startDate: offer.startDate,
      warrantyEndDate: offer.warrantyEndDate,

      salary: offer.salary || '',
      signOnBonus: offer.signOnBonus || '',
      retentionBonus: offer.retentionBonus || '',
      annualBonus: offer.annualBonus || '',
      relocationPackage: offer.relocationPackage || '',
      extraFee: offer.extraFee || '',
      feeType: offer.feeType || 'PERCENTAGE', // PERCENTAGE, FLAT_AMOUNT
      feePercentage: offer.feePercentage || '',
      totalBillableAmount: offer.totalBillableAmount,
    };
  };

  handleDateChange = (key, value) => {
    this.setState({ [key]: value }, this.computeContractGM);
    this.props.removeErrorMsgHandler(key);
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value }, this.computeFullTimeGM);
    this.props.removeErrorMsgHandler(key);
    this.props.removeErrorMsgHandler('totalBillableAmount');
  };

  computeFullTimeGM = () => {
    clearTimeout(this.computeGM);
    this.computeGM = setTimeout(this._computeFullTimeGM, 400);
  };
  _computeFullTimeGM = () => {
    let {
      rateUnitType,
      feeType,
      feePercentage,
      salary,
      signOnBonus,
      retentionBonus,
      annualBonus,
      relocationPackage,
      extraFee,
    } = this.state;
    const annualSalary = swichSalary(salary, rateUnitType);
    const totalBillableAmount =
      Number(annualSalary) +
      Number(signOnBonus) +
      Number(retentionBonus) +
      Number(annualBonus) +
      Number(relocationPackage) +
      Number(extraFee);
    console.log(totalBillableAmount);
    this.setState({ totalBillableAmount });
    if (feeType === 'PERCENTAGE') {
      const totalBillAmount =
        totalBillableAmount && feePercentage
          ? (totalBillableAmount * feePercentage) / 100
          : '';
      // console.log(totalBillAmount);
      this.setState({ totalBillAmount });
    }
    return totalBillableAmount;
  };

  handleFeeTypeChange = (feeType) => {
    feeType = feeType || this.state.feeType;
    this.setState({ feeType }, () => {
      if (this.state.feeType === 'PERCENTAGE') {
        this._computeFullTimeGM();
      }
    });
  };
  handlePctChange = (e) => {
    this.setState({ feePercentage: e.target.value }, this.computeFullTimeGM);
  };

  handleGMChange = (values) => {
    this.setState({ totalBillAmount: values.value });
    this.props.removeErrorMsgHandler('totalBillAmount');
  };

  handleDropDownChange = (key) => (value) => {
    // console.log(key, value);
    value = value || this.state[key];
    this.setState({ [key]: value }, this._computeFullTimeGM);
    this.props.removeErrorMsgHandler(key);
  };

  render() {
    const {
      startDate,
      warrantyEndDate,
      currency,
      rateUnitType,
      salary,
      signOnBonus,
      retentionBonus,
      annualBonus,
      relocationPackage,
      extraFee,
      totalBillableAmount,
      totalBillAmount,
      feeType,
      feePercentage,
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
            <FormReactSelectContainer label={'Position Type'}>
              <Select
                name="PositionType"
                options={jobType}
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
              selected={warrantyEndDate ? moment(warrantyEndDate) : null}
              minDate={startDate ? moment(startDate) : null}
              customInput={
                <FormInput
                  label={t('field:Warranty End Date')}
                  isRequired
                  errorMessage={t(errorMessage.get('warrantyEndDate'))}
                />
              }
              onChange={(date) => {
                this.handleDateChange(
                  'warrantyEndDate',
                  date ? date.format('YYYY-MM-DD') : null
                );
              }}
              placeholderText="mm/dd/yyyy"
            />
            <input
              type="hidden"
              name="warrantyEndDate"
              value={warrantyEndDate || ''}
            />
          </div>
        </div>

        {/* 3 row */}
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('salary'))}
              label={t('field:baseSalary')}
              isRequired
            >
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={salary}
                onValueChange={this.handleNumberChange('salary')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="salary" value={salary || ''} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              isRequired
              errorMessage={t(errorMessage.get('currency'))}
              label="Salary Currency"
            >
              <Select
                labelKey={'label2'}
                clearable={false}
                disabled={edit}
                value={currency}
                simpleValue
                options={currencyOptions}
                onChange={this.handleDropDownChange('currency')}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="currency" value={currency || ''} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              isRequired
              errorMessage={t(errorMessage.get('rateUnitType'))}
              label="Salary Unit Type"
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
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={
                <div className="flex-container">
                  <span>{t('field:signonBonus')}</span>
                  &nbsp;
                  <Tooltip title={t('field:signonBonus')} arrow>
                    <Info fontSize="small" color="disabled" />
                  </Tooltip>
                </div>
              }
              // isRequired
            >
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={signOnBonus}
                onValueChange={this.handleNumberChange('signOnBonus')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="signOnBonus" value={signOnBonus || ''} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={
                <div className="flex-container">
                  <span>{t('field:retentionBonus')}</span>
                  &nbsp;
                  <Tooltip title={t('field:retentionBonus')} arrow>
                    <Info fontSize="small" color="disabled" />
                  </Tooltip>
                </div>
              }
            >
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={retentionBonus}
                onValueChange={this.handleNumberChange('retentionBonus')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="retentionBonus"
              value={retentionBonus || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              label={
                <div className="flex-container">
                  <span>{t('field:annualBonus')}</span>
                  &nbsp;
                  <Tooltip arrow title={t('field:annualBonus')}>
                    <Info fontSize="small" color="disabled" />
                  </Tooltip>
                </div>
              }
            >
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={annualBonus}
                onValueChange={this.handleNumberChange('annualBonus')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="annualBonus" value={annualBonus || ''} />
          </div>
        </div>

        {/* 5 row */}
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:relocationPackage')}>
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={relocationPackage}
                onValueChange={this.handleNumberChange('relocationPackage')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="relocationPackage"
              value={relocationPackage || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:extraFee')}>
              <NumberFormat
                disabled={edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={extraFee}
                onValueChange={this.handleNumberChange('extraFee')}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="extraFee" value={extraFee || ''} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('totalBillableAmount'))}
              label={t('field:totalBillablePackage')}
              isRequired
            >
              <NumberFormat
                disabled={true}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={totalBillableAmount}
                decimalScale={2}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="totalBillableAmount"
              value={totalBillableAmount || ''}
            />
          </div>
        </div>

        {/* 6 row */}
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('feeType'))}
              isRequired
              label={t('field:feeType')}
            >
              <Select
                clearable={false}
                disabled={edit}
                value={feeType}
                simpleValue
                options={feeTypeOptions}
                onChange={this.handleFeeTypeChange}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="feeType" value={feeType} />
          </div>
          <div className="small-4 columns">
            {feeType !== 'FLAT_AMOUNT' && (
              <FormInput
                disabled={edit}
                value={feePercentage}
                label={'%'}
                type="number"
                max={100}
                min={0}
                name="feePercentage"
                onChange={this.handlePctChange}
              />
            )}
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer
              errorMessage={t(errorMessage.get('totalBillAmount'))}
              label={'Total Bill Amount / GM'}
              isRequired
            >
              <NumberFormat
                disabled={this.state.feeType === 'PERCENTAGE' || edit}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={totalBillAmount}
                onValueChange={this.handleGMChange}
                allowNegative={false}
              />
            </FormReactSelectContainer>
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

export default FullTimeForm;
