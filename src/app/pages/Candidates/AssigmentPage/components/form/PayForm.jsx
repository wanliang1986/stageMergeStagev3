import React, { Component } from 'react';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import Checkbox from '@material-ui/core/Checkbox';
import Select from 'react-select';
import Grid from '@material-ui/core/Grid';
import {
  employmentCategory,
  groupInvoiceContent,
  currency,
  timeUnit,
  overTime,
  expenseInvoice,
  discountType,
} from '../../../../../constants/formOptions';

const getPayRate = (arr) => {
  let PayRate = null;
  if (arr) {
    PayRate = arr.filter((item) => {
      return item.type === 'PAY_RATE';
    });
  }
  return PayRate;
};

const getOverTimePayRate = (arr) => {
  let PayRate = arr.filter((item) => {
    return item.type === 'OVER_TIME';
  });
  return PayRate;
};

const getDoubleTimePayRate = (arr) => {
  let PayRate = arr.filter((item) => {
    return item.type === 'DOUBLE_TIME';
  });
  return PayRate;
};

class PayForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExempt: this.props.isExempt,
      employmentCategory: this.props.payInfo
        ? this.props.payInfo.employmentCategory
        : 'CONTRACTOR',
      payRate: this.props.payInfo
        ? getPayRate(this.props.payInfo.payRateInfo)[0].payRate
        : this.props.currentStart &&
          this.props.currentStart
            .get('startContractRates')
            .get(0)
            .get('finalPayRate'),
      currency: this.props.payInfo
        ? getPayRate(this.props.payInfo.payRateInfo)[0].currency
        : this.props.currentStart &&
          this.props.currentStart
            .get('startContractRates')
            .get(0)
            .get('currency'),
      timeUnit: this.props.payInfo
        ? getPayRate(this.props.payInfo.payRateInfo)[0].timeUnit
        : this.props.currentStart &&
          this.props.currentStart
            .get('startContractRates')
            .get(0)
            .get('rateUnitType'),
      overTimePayRate: this.props.payInfo
        ? getOverTimePayRate(this.props.payInfo.payRateInfo)[0].payRate
        : null,
      overTimePayRateTimeUnit: this.props.payInfo
        ? getOverTimePayRate(this.props.payInfo.payRateInfo)[0].timeUnit
        : 'HOURLY',
      doubleTimePayRate: this.props.payInfo
        ? getDoubleTimePayRate(this.props.payInfo.payRateInfo)[0].payRate
        : null,
      doubleTimePayRateTimeUnit: this.props.payInfo
        ? getDoubleTimePayRate(this.props.payInfo.payRateInfo)[0].timeUnit
        : 'HOURLY',
      comments: this.props.payInfo ? this.props.payInfo.comments : null,
    };
  }
  changeExempt = () => {
    this.props.changeExempt();
    this.setState({
      overTimePayRate: '',
      overTimePayRateTimeUnit: 'HOURLY',
      doubleTimePayRate: '',
      doubleTimePayRateTimeUnit: 'HOURLY',
    });
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.isExempt !== this.state.isExempt) {
      this.setState(
        {
          isExempt: nextProps.isExempt,
        },
        () => {
          if (this.state.isExempt === true) {
            this.setState({
              overTimePayRate: '',
              overTimePayRateTimeUnit: 'HOURLY',
              doubleTimePayRate: '',
              doubleTimePayRateTimeUnit: 'HOURLY',
            });
          }
        }
      );
    }
    if (
      JSON.stringify(nextProps.payInfo) !== JSON.stringify(this.props.payInfo)
    ) {
      this._setBillInfoState(nextProps.payInfo);
    }
  }
  _setBillInfoState = (payInfo) => {
    this.setState({
      isExempt: payInfo.isExcept,
      employmentCategory: payInfo.employmentCategory,
      payRate: getPayRate(payInfo.payRateInfo)[0].payRate,
      currency: getPayRate(payInfo.payRateInfo)[0].currency,
      timeUnit: getPayRate(payInfo.payRateInfo)[0].timeUnit,
      overTimePayRate: getOverTimePayRate(payInfo.payRateInfo)[0].payRate,
      overTimePayRateTimeUnit: getOverTimePayRate(payInfo.payRateInfo)[0]
        .timeUnit,
      doubleTimePayRate: getDoubleTimePayRate(payInfo.payRateInfo)[0].payRate,
      doubleTimePayRateTimeUnit: getDoubleTimePayRate(payInfo.payRateInfo)[0]
        .timeUnit,
      comments: payInfo.comments,
    });
  };
  changePayRate = (e) => {
    this.setState({
      payRate: e.target.value,
    });
    this.props.removeErrorMsgHandler('PayRate');
    this.props.getPayRate(Number(e.target.value));
  };
  render() {
    const { t, isClockIn, pageType, errorMessage, editType } = this.props;
    return (
      <>
        <form id="payForm">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormReactSelectContainer
                label={t('field:Employment Category')}
                isRequired={true}
              >
                <Select
                  searchable
                  valueKey={'value'}
                  labelKey={'label'}
                  value={this.state.employmentCategory}
                  options={employmentCategory}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      employmentCategory: option.value,
                    });
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="EmploymentCategory"
                type="hidden"
                value={this.state.employmentCategory}
                form="billinforForm"
              />
            </Grid>
            <Grid item xs={4}>
              <FormInput
                name="PayRate"
                label={t('field:Pay Rate')}
                value={this.state.payRate}
                isRequired={true}
                onChange={(e) => {
                  this.changePayRate(e);
                }}
                disabled={pageType === 'history' || !editType}
                form="billinforForm"
                errorMessage={errorMessage && errorMessage.get('PayRate')}
              />
            </Grid>
            <Grid item xs={4} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer
                errorMessage={errorMessage && errorMessage.get('CurrencyError')}
              >
                <Select
                  searchable
                  valueKey={'value'}
                  labelKey={'label2'}
                  value={this.state.currency}
                  options={currency}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      currency: option.value,
                    });
                    this.props.removeErrorMsgHandler('CurrencyError');
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="payCurrency"
                type="hidden"
                value={this.state.currency}
                form="billinforForm"
              />
            </Grid>
            <Grid item xs={4} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer
                errorMessage={errorMessage && errorMessage.get('TimeUnitError')}
              >
                <Select
                  searchable
                  labelKey={'label'}
                  valueKey={'value'}
                  value={this.state.timeUnit}
                  options={timeUnit}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      timeUnit: option.value,
                    });
                    this.props.removeErrorMsgHandler('TimeUnitError');
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="payTimeUnit"
                type="hidden"
                value={this.state.timeUnit}
                form="billinforForm"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isExempt}
                    onChange={() => {
                      this.changeExempt();
                    }}
                    name="Overtime Exempt"
                    color="primary"
                    disabled={
                      isClockIn === true || pageType === 'history' || !editType
                    }
                  />
                }
                label="Overtime Exempt	"
              />
            </Grid>
            <Grid item xs={4}>
              <FormInput
                name="OvertimePayRate"
                label={t('field:Overtime Pay Rate')}
                isRequired={true}
                value={this.state.overTimePayRate}
                onChange={(e) => {
                  this.setState({
                    overTimePayRate: e.target.value,
                  });
                  this.props.removeErrorMsgHandler('OvertimePayRate');
                }}
                disabled={
                  this.state.isExempt === true ||
                  pageType === 'history' ||
                  !editType
                }
                form="billinforForm"
                errorMessage={
                  errorMessage && errorMessage.get('OvertimePayRate')
                }
              />
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer>
                <Select
                  searchable
                  labelKey={'label'}
                  valueKey={'value'}
                  value={this.state.overTimePayRateTimeUnit}
                  options={[{ value: 'HOURLY', label: 'Hourly' }]}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      overTimePayRateTimeUnit: option.value,
                    });
                  }}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                />
              </FormReactSelectContainer>
              <input
                name="overTimePayRateTimeUnit"
                value={this.state.overTimePayRateTimeUnit}
                type="hidden"
                form="billinforForm"
              />
            </Grid>
            <Grid item xs={4}>
              <FormInput
                name="DoubleTimePayRate"
                label={t('field:Double Time Pay Rate')}
                // isRequired={true}
                value={this.state.doubleTimePayRate}
                onChange={(e) => {
                  this.setState({
                    doubleTimePayRate: e.target.value,
                  });
                  this.props.removeErrorMsgHandler('DoubleTimePayRate');
                }}
                errorMessage={
                  errorMessage && errorMessage.get('DoubleTimePayRate')
                }
                disabled={
                  this.state.isExempt === true ||
                  pageType === 'history' ||
                  !editType
                }
                form="billinforForm"
              />
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer>
                <Select
                  name="time"
                  searchable
                  labelKey={'label'}
                  valueKey={'value'}
                  options={[{ value: 'HOURLY', label: 'Hourly' }]}
                  clearable={false}
                  autoBlur={true}
                  value={this.state.doubleTimePayRateTimeUnit}
                  onChange={(option) => {
                    this.setState({
                      doubleTimePayRateTimeUnit: option.value,
                    });
                  }}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                />
              </FormReactSelectContainer>
              <input
                name="time"
                value={this.state.doubleTimePayRateTimeUnit}
                type="hidden"
                form="billinforForm"
              />
            </Grid>
            <Grid item xs={12}>
              <FormTextArea
                name="comments"
                label={t('field:Comments (1000 chars max)')}
                rows="3"
                value={this.state.comments}
                onChange={(e) => {
                  this.setState({
                    comments: e.target.value,
                  });
                }}
                disabled={pageType === 'history' || !editType}
                form="billinforForm"
                maxLength={1000}
              />
            </Grid>
          </Grid>
        </form>
      </>
    );
  }
}

export default PayForm;
