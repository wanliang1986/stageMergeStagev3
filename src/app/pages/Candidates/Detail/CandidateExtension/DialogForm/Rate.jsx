import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { currency as currencyOptions } from '../../../../../constants/formOptions';
import moment from 'moment-timezone';
import { getApplicationOfferLetterParam } from '../../../../../../apn-sdk';
import { showErrorMessage } from '../../../../../actions';
import {
  selectStartToOpen,
  updateStartContractRate,
  deleteStartContractRate,
} from '../../../../../actions/startActions';
import { mapOfferLetterParams, swichRate } from '../../../../../../utils';

import Select from 'react-select';
import DatePicker from 'react-datepicker';
import NumberFormat from 'react-number-format';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import FormTextArea from '../../../../../components/particial/FormTextArea';

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
      errorMessage: Immutable.Map(),
      processing: false,

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

  handleSubmit = (e) => {
    e.preventDefault();
    const startContractRateForm = e.target;
    const { startContractRate: oldStartContractRate, t, dispatch } = this.props;

    let errorMessage = this._validateForm(startContractRateForm, t);

    if (errorMessage) {
      // console.log(errorMessage.toJS());
      return this.setState({ errorMessage });
    }

    this.setState({ errorMessage: Immutable.Map(), processing: true });

    const newStartContractRate = {
      startDate: startContractRateForm.startDate.value,
      endDate: startContractRateForm.endDate.value,
      currency: startContractRateForm.currency.value,
      rateUnitType: startContractRateForm.rateUnitType.value,

      finalBillRate: startContractRateForm.finalBillRate.value,
      finalPayRate: startContractRateForm.finalPayRate.value,

      taxBurdenRateCode: startContractRateForm.taxBurdenRateCode.value,
      mspRateCode: startContractRateForm.mspRateCode.value,
      immigrationCostCode: startContractRateForm.immigrationCostCode.value,
      extraCost: Number(startContractRateForm.extraCost.value) || 0,
      estimatedWorkingHourPerWeek:
        Number(startContractRateForm.estimatedWorkingHourPerWeek.value) || 0,
      totalBillAmount:
        Number(
          Number(startContractRateForm.totalBillAmount.value).toFixed(2)
        ) || 0,

      note: startContractRateForm.note.value,
    };
    console.log(newStartContractRate);
    dispatch(
      updateStartContractRate(
        newStartContractRate,
        oldStartContractRate.id,
        oldStartContractRate.startId
      )
    )
      .then((startContractRates) => {
        dispatch(
          selectStartToOpen(
            Immutable.fromJS(this.props.start).merge(
              Immutable.fromJS({ startContractRates })
            )
          )
        );
      })
      .then(this.handleCancel)
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  handleRemove = () => {
    const { start, startContractRate, dispatch } = this.props;
    this.setState({ processing: true });
    dispatch(deleteStartContractRate(startContractRate.id, start.id))
      .then((startContractRates) => {
        dispatch(
          selectStartToOpen(
            Immutable.fromJS(this.props.start).merge(
              Immutable.fromJS({ startContractRates })
            )
          )
        );
      })
      .then(this.handleCancel)
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();

    if (!form.startDate.value) {
      errorMessage = errorMessage.set(
        'startDate',
        'message:Start Date is required'
      );
    }
    if (
      form.startDate.value &&
      form.oldStartDate.value &&
      !moment(form.startDate.value).isAfter(moment(form.oldStartDate.value))
    ) {
      errorMessage = errorMessage.set(
        'startDate',
        'message:Start Date should be after previous Start Date'
      );
    }
    if (
      form.endDate.value &&
      form.startDate.value &&
      moment(form.startDate.value).isAfter(moment(form.endDate.value))
    ) {
      errorMessage = errorMessage.set(
        'startDate',
        'message:Start Date should not be after End Date'
      );
    }

    // gm params
    if (!form.endDate.value) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date is required'
      );
    }

    if (!form.finalBillRate.value) {
      errorMessage = errorMessage.set(
        'finalBillRate',
        'message:Final Bill Rate is required'
      );
    }
    if (!form.finalPayRate.value) {
      errorMessage = errorMessage.set(
        'finalPayRate',
        'message:Final Pay Rate is required'
      );
    }

    if (!form.rateUnitType.value) {
      errorMessage = errorMessage.set(
        'rateUnitType',
        'message:Rate Unit Type Is Required'
      );
    }
    if (!form.currency.value) {
      errorMessage = errorMessage.set(
        'currency',
        'message:Currency is required'
      );
    }

    if (!form.immigrationCostCode.value) {
      errorMessage = errorMessage.set(
        'immigrationCost',
        'message:Immigration Cost is required'
      );
    }

    if (!form.taxBurdenRateCode.value) {
      errorMessage = errorMessage.set(
        'taxBurdenRate',
        'message:Tax Burden Rate is required'
      );
    }

    if (!form.mspRateCode.value) {
      errorMessage = errorMessage.set(
        'mspRate',
        'message:MSP Rate is required'
      );
    }

    if (!form.estimatedWorkingHourPerWeek.value) {
      errorMessage = errorMessage.set(
        'estimatedWorkingHourPerWeek',
        'message:Estimated Working Hour Per Week is required'
      );
    }

    if (!form.totalBillAmount.value) {
      errorMessage = errorMessage.set(
        'totalBillAmount',
        t('message:Total Bill Amount is required')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

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
    this._removeErrorMsgHandler(key);
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value }, this.computeContractGM);
    this._removeErrorMsgHandler(key);
  };

  handleGMChange = (key) => (values) => {
    this.setState({ [key]: values.value }, this.computeContractGM);
    this._removeErrorMsgHandler(key);
  };

  handleDropDownChange = (key) => (value) => {
    value = value || this.state[key];
    this.setState({ [key]: value }, this._computeContractGM);
    this._removeErrorMsgHandler(key);
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleCancel = () => {
    this.props.onClose();
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
      processing,
      errorMessage,
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
    const { t, oldContractRate } = this.props;
    if (loadingParams) {
      return null;
    }
    const canDelete = !!oldContractRate;
    return (
      <>
        <DialogTitle>{t('common:Edit Rate Change')}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id={'rateForm'}>
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
                  minDate={
                    oldContractRate
                      ? moment(oldContractRate.startDate).add(1, 'days')
                      : null
                  }
                  maxDate={moment(endDate)}
                />
                <input name="startDate" type="hidden" value={startDate || ''} />
                <input
                  name="oldStartDate"
                  type="hidden"
                  value={oldContractRate ? oldContractRate.startDate : ''}
                />
              </div>

              <div className="small-6 columns">
                <DatePicker
                  dropdownMode={'scroll'}
                  disabled={canDelete}
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
                    labelKey={'label2'}
                    clearable={false}
                    value={currency}
                    options={currencyOptions}
                    onChange={this.handleCurrencyChange}
                    simpleValue
                    disabled={canDelete}
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
                  label="Tax Burden Rate"
                  isRequired
                  errorMessage={t(errorMessage.get('taxBurdenRate'))}
                >
                  <Select
                    valueKey={'code'}
                    labelKey={'description'}
                    clearable={false}
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
                  isRequired
                  errorMessage={t(
                    errorMessage.get('estimatedWorkingHourPerWeek')
                  )}
                  value={estimatedWorkingHourPerWeek || ''}
                  label={'Estimated Working Hour Per Week'}
                  name="estimatedWorkingHourPerWeek"
                  type="number"
                  min={1}
                  max={56}
                  onChange={(e) => {
                    this._removeErrorMsgHandler('estimatedWorkingHourPerWeek');
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

            {/* 备忘 */}
            <div className="row expanded">
              <div className="small-12 columns">
                <FormTextArea
                  label={t('field:Rate Note')}
                  name="note"
                  defaultValue={this.props.startContractRate.note || ''}
                  rows={4}
                />
              </div>
            </div>
          </form>
        </DialogContent>

        <DialogActions>
          <SecondaryButton onClick={this.handleCancel}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type={'submit'}
            form={'rateForm'}
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
          <div className={'flex-child-auto'} />
          {canDelete && (
            <Button
              onClick={this.handleRemove}
              variant={'outlined'}
              color={'secondary'}
              disabled={processing}
            >
              {t('action:delete')}
            </Button>
          )}
        </DialogActions>
      </>
    );
  }
}

export default connect()(Contract);

// 把immigrationCost转为usd(美元单位)
const computeUSD = (currency, cost) => {
  let newCost = '';
  switch (currency) {
    case 'CNY':
      newCost = 6.4902 * cost;
      break;
    case 'EUR':
      newCost = 0.8273 * cost;
      break;
    default:
      newCost = cost;
  }
  return newCost;
};
