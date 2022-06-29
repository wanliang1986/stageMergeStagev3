import React from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import FormInput from '../../../../../components/particial/FormInput';
import { currency as currencyOptions } from '../../../../../constants/formOptions';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import NumberFormat from 'react-number-format';
import Select from 'react-select';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';

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

const offers = {};

class FullTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currency: props.startFteRate.currency || 'USD',
      rateUnitType: props.startFteRate.rateUnitType || 'YEARLY',
      totalBillAmount: props.startFteRate.totalBillAmount || '',

      startDate: props.start.startDate && moment(props.start.startDate),

      salary: props.startFteRate.salary || '',
      signOnBonus: props.startFteRate.signOnBonus || '',
      retentionBonus: props.startFteRate.retentionBonus || '',
      annualBonus: props.startFteRate.annualBonus || '',
      relocationPackage: props.startFteRate.relocationPackage || '',
      extraFee: props.startFteRate.extraFee || '',
      // totalBillableAmount: sum(salary,signOnBonus,retentionBonus,annualBonus,relocationPackage,extraFee)
      totalBillableAmount: props.startFteRate.totalBillableAmount || '',
      feeType: props.startFteRate.feeType || 'PERCENTAGE', // PERCENTAGE, FLAT_AMOUNT
      feePercentage: props.startFteRate.feePercentage || '',
    };
  }

  handleStartDateChange = (startDate) => {
    this.props.removeErrorMsgHandler('startDate');
    this.setState({ startDate });
  };

  handleGMChange = (key) => (values) => {
    if (key === 'salary') {
      this.props.removeErrorMsgHandler('salary');
      setTimeout(() => {
        this.props.removeErrorMsgHandler('totalBillableAmount');
      }, 10);
    }
    this.setState({ [key]: values.value }, this.computeFullTimeGM);
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

  handleFeeChange = (values) => {
    this.setState({ totalBillAmount: values.value });
    this.props.removeErrorMsgHandler('totalBillAmount');
  };

  handlePctChange = (e) => {
    // console.log('handlePctChange');
    this.setState({ feePercentage: e.target.value }, this.computeFullTimeGM);
  };

  handleCurrencyChange = (currency) => {
    currency = currency || this.state.currency;
    this.setState({
      currency,
    });

    this.props.removeErrorMsgHandler('currency');
  };

  handleRateUnitTypeChange = (rateUnitType) => {
    rateUnitType = rateUnitType || this.state.rateUnitType;
    this.setState({ rateUnitType }, this._computeFullTimeGM);
  };

  render() {
    const { startDate, warrantyEndDate, currency, salary } = this.state;
    const { t, edit, errorMessage, start } = this.props;
    return (
      <>
        <input type="hidden" name="startType" value="CONVERT_TO_FTE" />
        <div className="row expanded">
          <div className="small-6 columns">
            <DatePicker
              customInput={
                <FormInput
                  label={t('field:startDate')}
                  name="startDate"
                  isRequired
                  errorMessage={errorMessage.get('startDate')}
                />
              }
              selected={startDate}
              onChange={this.handleStartDateChange}
              placeholderText="mm/dd/yyyy"
              disabled={!edit}
            />
            <input
              name="startDate"
              type="hidden"
              value={startDate ? startDate.format('YYYY-MM-DD') : ''}
            />
            <input
              name="warrantyEndDate"
              type="hidden"
              value={
                startDate
                  ? moment(startDate).add(3, 'months').format('YYYY-MM-DD')
                  : ''
              }
            />
          </div>
          <div className="small-6 columns" />
        </div>
        {/* 1 row */}
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              isRequired
              label={t('field:baseSalary')}
              errorMessage={errorMessage.get('salary')}
            >
              <NumberFormat
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={salary}
                onValueChange={this.handleGMChange('salary')}
                disabled={!edit}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="salary" value={salary || ''} />
          </div>

          {/* don't lost ，you edit here ....  */}
          <div className="small-4 columns">
            <FormReactSelectContainer
              isRequired
              errorMessage={errorMessage.get('currency')}
              label="Salary Currency"
            >
              <Select
                labelKey={'label2'}
                disabled={!edit}
                value={currency}
                simpleValue
                options={currencyOptions}
                clearable={false}
                onChange={this.handleCurrencyChange}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="currency" value={currency} />
          </div>

          <div className="small-4 columns">
            <FormReactSelectContainer isRequired label="Salary Unit Type">
              <Select
                clearable={false}
                disabled={!edit}
                value={this.state.rateUnitType}
                simpleValue
                options={rateUnitTypeOptions}
                onChange={this.handleRateUnitTypeChange}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="rateUnitType"
              value={this.state.rateUnitType}
            />
          </div>
          {/* --------------- */}
        </div>

        {/* 2 row */}
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
            >
              <NumberFormat
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.signOnBonus}
                onValueChange={this.handleGMChange('signOnBonus')}
                disabled={!edit}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="signOnBonus"
              value={this.state.signOnBonus || ''}
            />
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
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.retentionBonus}
                onValueChange={this.handleGMChange('retentionBonus')}
                disabled={!edit}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="retentionBonus"
              value={this.state.retentionBonus || ''}
            />
          </div>

          <div className="small-4 columns">
            <FormReactSelectContainer
              label={
                <div className="flex-container">
                  <span>{t('field:annualBonus')}</span>
                  &nbsp;
                  <Tooltip
                    arrow
                    title={`Separate from Salary. Only record billable bonus.`}
                  >
                    <Info fontSize="small" color="disabled" />
                  </Tooltip>
                </div>
              }
            >
              <NumberFormat
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.annualBonus}
                onValueChange={this.handleGMChange('annualBonus')}
                disabled={!edit}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="annualBonus"
              value={this.state.annualBonus || ''}
            />
          </div>

          {/* 3 row */}
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:relocationPackage')}>
              <NumberFormat
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.relocationPackage}
                onValueChange={this.handleGMChange('relocationPackage')}
                disabled={!edit}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="relocationPackage"
              value={this.state.relocationPackage || ''}
            />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={t('field:extraFee')}>
              <NumberFormat
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.extraFee}
                onValueChange={this.handleGMChange('extraFee')}
                disabled={!edit}
                decimalScale={2}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="extraFee"
              value={this.state.extraFee || ''}
            />
          </div>

          <div className="small-4 columns">
            <FormReactSelectContainer
              label={t('field:totalBillablePackage')}
              isRequired
              errorMessage={errorMessage.get('totalBillableAmount')}
            >
              <NumberFormat
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.totalBillableAmount}
                disabled
                decimalScale={2}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="totalBillableAmount"
              value={this.state.totalBillableAmount || ''}
            />
          </div>
        </div>

        {/* 4 row */}
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer
              isRequired
              label={t('field:feeType')}
              errorMessage={errorMessage.get('feeType')}
            >
              <Select
                value={this.state.feeType}
                onChange={this.handleFeeTypeChange}
                simpleValue
                options={feeTypeOptions}
                autoBlur
                clearable={false}
                disabled={!edit}
              />
            </FormReactSelectContainer>
            <input type="hidden" value={this.state.feeType} name="feeType" />
          </div>
          <div className="small-4 columns">
            {this.state.feeType === 'PERCENTAGE' && (
              <FormInput
                label={'%'}
                disabled={!edit}
                value={this.state.feePercentage || ''}
                onChange={this.handlePctChange}
                type="number"
                min={5}
                max={100}
              />
            )}
            <input
              type="hidden"
              name="feePercentage"
              value={this.state.feePercentage || ''}
            />
          </div>

          <div className="small-4 columns">
            <FormReactSelectContainer
              isRequired
              errorMessage={errorMessage.get('totalBillAmount')}
              label={t('field:finalFee')}
            >
              <NumberFormat
                disabled={this.state.feeType === 'PERCENTAGE' || !edit}
                decimalScale={2}
                thousandSeparator
                prefix={currencyLabels[currency]}
                value={this.state.totalBillAmount}
                onValueChange={this.handleFeeChange}
                allowNegative={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="totalBillAmount"
              value={this.state.totalBillAmount}
            />
          </div>
        </div>
      </>
    );
  }
}

export default FullTime;

// 计算年薪
const swichSalary = (salary, unit) => {
  let annualSalary = '';
  switch (unit) {
    // 月
    case 'MONTHLY':
      annualSalary = salary * 12;
      break;
    // 周
    case 'WEEKLY':
      annualSalary = salary * 52; // 2080 /40
      break;
    // 日
    case 'DAILY':
      annualSalary = salary * 260; // 2080 / 8;
      break;

    // 小时
    case 'HOURLY':
      annualSalary = salary * 2080;
      break;
    // 年
    default:
      annualSalary = salary;
  }
  return annualSalary;
};
