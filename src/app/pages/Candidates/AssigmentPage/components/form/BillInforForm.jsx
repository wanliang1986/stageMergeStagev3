import React, { Component } from 'react';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import {
  groupInvoiceType,
  groupInvoiceContent,
  currency,
  timeUnit,
  overTime,
  expenseInvoice,
  discountType,
} from '../../../../../constants/formOptions';
import { connect } from 'react-redux';

const getBillRate = (arr) => {
  let billRate = null;
  if (arr) {
    billRate = arr.filter((item, index) => {
      return item.type === 'BILL_RATE';
    });
  }
  return billRate;
};

const getOverTimeBillRate = (arr) => {
  let billRate = arr.filter((item, index) => {
    return item.type === 'OVER_TIME';
  });
  return billRate;
};

const getDoubleTimeBillRate = (arr) => {
  let billRate = arr.filter((item, index) => {
    return item.type === 'DOUBLE_TIME';
  });
  return billRate;
};

class BillInfoFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactId: this.props.billInfo ? this.props.billInfo.contactId : null,
      groupInvoiceType: this.props.billInfo
        ? this.props.billInfo.groupInvoiceType
        : 'EMPLOYEE',
      invoiceContentType:
        this.props.billInfo && this.props.billInfo.invoiceContentType
          ? this.props.billInfo.invoiceContentType
          : 'TIMESHEET',
      groupInvoiceContent: this.props.billInfo
        ? this.props.billInfo.groupInvoiceContent
        : null,
      billRate: this.props.billInfo
        ? getBillRate(this.props.billInfo.payRateInfo)[0].payRate
        : this.props.currentStart &&
          this.props.currentStart
            .get('startContractRates')
            .get(0)
            .get('finalBillRate'),
      currency: this.props.billInfo
        ? getBillRate(this.props.billInfo.payRateInfo)[0].currency
        : this.props.currentStart &&
          this.props.currentStart
            .get('startContractRates')
            .get(0)
            .get('currency'),
      timeUnit: this.props.billInfo
        ? getBillRate(this.props.billInfo.payRateInfo)[0].timeUnit
        : this.props.currentStart &&
          this.props.currentStart
            .get('startContractRates')
            .get(0)
            .get('rateUnitType'),
      isExempt: this.props.isExempt,
      overTime: this.props.billInfo ? this.props.billInfo.overtimeType : 'AUTO',
      overTimeBillRate: this.props.billInfo
        ? getOverTimeBillRate(this.props.billInfo.payRateInfo)[0].payRate
        : null,
      overTimeBilltimeUnit: this.props.billInfo
        ? getOverTimeBillRate(this.props.billInfo.payRateInfo)[0].timeUnit
        : 'HOURLY',
      doubleTimeBillRate: this.props.billInfo
        ? getDoubleTimeBillRate(this.props.billInfo.payRateInfo)[0].payRate
        : null,
      doubleTimeBilltimeUnit: this.props.billInfo
        ? getDoubleTimeBillRate(this.props.billInfo.payRateInfo)[0].timeUnit
        : 'HOURLY',
      expenseInvoice: this.props.billInfo
        ? this.props.billInfo.expenseInvoice
        : 'EXPENSE_DETAIL',
      discount: this.props.billInfo
        ? this.props.billInfo.discountType
        : 'NO_DISCOUNT',
      paymentTerms: this.props.billInfo
        ? this.props.billInfo.paymentTerms
        : null,
      assignmentId: this.props.assignmentId,
    };
  }

  changeExempt = () => {
    this.props.changeExempt();
    this.setState({
      overTime: 'AUTO',
      overTimeBillRate: '',
      overTimeBilltimeUnit: 'HOURLY',
      doubleTimeBillRate: '',
      doubleTimeBilltimeUnit: 'HOURLY',
    });
  };

  getDiscount = (type) => {
    if (type) {
      let score = discountType.filter((item, index) => {
        return item.value === type;
      });
      return score[0].label_2;
    }
  };
  getTimeUnit = (type) => {
    let unit = timeUnit.filter((item) => {
      return item.value === type;
    });
    return unit[0].label;
  };

  getCurrency = (type) => {
    let _currency = currency.filter((item) => {
      return item.value === type;
    });
    return _currency[0].label;
  };

  componentWillReceiveProps(nextProps) {
    // console.log("nextProps.billInfo",nextProps.billInfo)
    if (nextProps.isExempt !== this.state.isExempt) {
      this.setState(
        {
          isExempt: nextProps.isExempt,
        },
        () => {
          if (this.state.isExempt === true) {
            this.setState({
              overTime: 'AUTO',
              overTimeBillRate: '',
              overTimeBilltimeUnit: 'HOURLY',
              doubleTimeBillRate: '',
              doubleTimeBilltimeUnit: 'HOURLY',
            });
          }
        }
      );
    }
    if (
      JSON.stringify(nextProps.billInfo) !== JSON.stringify(this.props.billInfo)
    ) {
      this._setBillInfoState(nextProps.billInfo);
    }
  }

  _setBillInfoState = (billInfo) => {
    this.setState(
      {
        contactId: billInfo && billInfo.contactId,
        groupInvoiceType: billInfo && billInfo.groupInvoiceType,
        invoiceContentType: billInfo && billInfo.invoiceContentType,
        groupInvoiceContent: billInfo && billInfo.groupInvoiceContent,
        billRate: billInfo && getBillRate(billInfo.payRateInfo)[0].payRate,
        currency: billInfo && getBillRate(billInfo.payRateInfo)[0].currency,
        timeUnit: billInfo && getBillRate(billInfo.payRateInfo)[0].timeUnit,
        overTime: billInfo && billInfo.overtimeType,
        overTimeBillRate:
          billInfo && getOverTimeBillRate(billInfo.payRateInfo)[0].payRate,
        overTimeBilltimeUnit:
          billInfo && getOverTimeBillRate(billInfo.payRateInfo)[0].timeUnit,
        doubleTimeBillRate:
          billInfo && getDoubleTimeBillRate(billInfo.payRateInfo)[0].payRate,
        doubleTimeBilltimeUnit:
          billInfo && getDoubleTimeBillRate(billInfo.payRateInfo)[0].timeUnit,
        expenseInvoice: billInfo && billInfo.expenseInvoice,
        discount: billInfo && billInfo.discountType,
        paymentTerms: billInfo && billInfo.paymentTerms,
        isExempt: billInfo && billInfo.isExcept,
      },
      () => {
        this.getNetBillRate();
        this.getNetOverTimeBillRate();
        this.getNetDoubleTimeBillRate();
      }
    );
  };

  nextBillRateCount = () => {
    const { billRate, discount } = this.state;
    if (billRate) {
      let _discount = this.getDiscount(discount);
      let nextBillRate = Number(billRate) * (1 - _discount / 100);
      return Math.round(nextBillRate * 100) / 100;
    }
    return null;
  };

  getNetBillRate = () => {
    const { billRate, timeUnit, currency } = this.state;
    let str = '';
    if (billRate) {
      let nextBillRate = this.nextBillRateCount();
      str =
        this.getCurrency(currency) +
        nextBillRate +
        '/' +
        this.getTimeUnit(timeUnit);
    }
    return str;
  };
  getNetOverTimeBillRate = () => {
    const { overTimeBillRate, discount, timeUnit, currency } = this.state;
    let str = '';
    if (overTimeBillRate) {
      let _discount = this.getDiscount(discount);
      let nextOverTimeRate = Number(overTimeBillRate) * (1 - _discount / 100);
      str =
        this.getCurrency(currency) +
        Math.round(nextOverTimeRate * 100) / 100 +
        '/Hourly';
      // this.getTimeUnit(timeUnit);
    }
    return str;
  };

  getNetDoubleTimeBillRate = () => {
    const { doubleTimeBillRate, discount, timeUnit, currency } = this.state;
    let str = '';
    if (doubleTimeBillRate) {
      let _discount = this.getDiscount(discount);
      let nextDoubleTimeRate =
        Number(doubleTimeBillRate) * (1 - _discount / 100);
      console.log(nextDoubleTimeRate);
      str =
        this.getCurrency(currency) +
        Math.round(nextDoubleTimeRate * 100) / 100 +
        '/Hourly';
      // this.getTimeUnit(timeUnit);
    }
    return str;
  };

  // hourlyGMCount = () => {
  //   const { payRate, currentStart } = this.props;
  //   // console.log(currentStart.get('startContractRates').get('0').get('taxBurdenRate').get('description'))
  // };

  render() {
    const {
      t,
      clientList,
      talentFormRef,
      isClockIn,
      pageType,
      errorMessage,
      index,
      editType,
      timeSheetType,
      contactsList,
    } = this.props;

    // console.log(this.state.billRate)
    console.log(this.state.doubleTimeBillRate);
    console.log(contactsList);
    return (
      <div key={`billInfo_${index}`}>
        <form id="billinforForm" ref={talentFormRef}>
          <Grid container spacing={3} key={`form_${index}`}>
            <Grid item xs={6}>
              <FormReactSelectContainer
                label={t('field:Billing Contact')}
                isRequired={true}
                errorMessage={errorMessage && errorMessage.get('contactId')}
              >
                <Select
                  key="contactId"
                  searchable
                  value={this.state.contactId}
                  labelKey={'name'}
                  valueKey={'id'}
                  options={contactsList}
                  clearable={false}
                  onChange={(contact) => {
                    this.setState({ contactId: contact.id });
                  }}
                  disabled={pageType === 'history' || !editType}
                  autoBlur={true}
                  onFocus={() => this.props.removeErrorMsgHandler('contactId')}
                />
              </FormReactSelectContainer>
              <input
                name="BillingContact"
                value={this.state.contactId}
                type="hidden"
              />
            </Grid>
            <Grid item xs={6}>
              <FormReactSelectContainer label={t('field:Group Invoice by')}>
                <Select
                  key="groupInvoiceType"
                  searchable
                  value={this.state.groupInvoiceType}
                  valueKey={'value'}
                  labelKey={'label'}
                  options={groupInvoiceType}
                  clearable={false}
                  autoBlur={true}
                  onChange={(invoiceType) => {
                    this.setState({
                      groupInvoiceType: invoiceType.value,
                    });
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="GroupInvoiceby"
                value={this.state.groupInvoiceType}
                type="hidden"
              />
              {(this.state.groupInvoiceType === 'CUSTOM' ||
                this.state.groupInvoiceType === 'PO' ||
                this.state.groupInvoiceType === 'CUSTOM_REF') && (
                <FormInput
                  name="groupInvoiceContent"
                  value={this.state.groupInvoiceContent}
                  disabled={pageType === 'history' || !editType}
                  onChange={(e) => {
                    this.setState({
                      groupInvoiceContent: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('groupInvoiceContent');
                  }}
                  errorMessage={
                    errorMessage && errorMessage.get('groupInvoiceContent')
                  }
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <FormReactSelectContainer label={t('field:Invoice Content')}>
                <Select
                  searchable
                  value={this.state.invoiceContentType}
                  valueKey={'value'}
                  labelKey={'label'}
                  options={groupInvoiceContent}
                  clearable={false}
                  autoBlur={true}
                  onChange={(content) => {
                    this.setState({
                      invoiceContentType: content.value,
                    });
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="invoiceContentType"
                value={this.state.invoiceContentType}
                type="hidden"
              />
            </Grid>
            <Grid item xs={4}>
              {pageType === 'history' ? (
                <FormInput
                  name="BillRate"
                  defaultValue={this.state.billRate}
                  label={t('field:Bill Rate')}
                  isRequired={true}
                  onChange={(e) => {
                    this.setState({
                      billRate: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('BillRate');
                  }}
                  disabled={pageType === 'history' || !editType}
                  errorMessage={errorMessage && errorMessage.get('BillRate')}
                />
              ) : (
                <FormInput
                  name="BillRate"
                  value={this.state.billRate}
                  label={t('field:Bill Rate')}
                  isRequired={true}
                  onChange={(e) => {
                    this.setState({
                      billRate: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('BillRate');
                  }}
                  disabled={pageType === 'history' || !editType}
                  errorMessage={errorMessage && errorMessage.get('BillRate')}
                />
              )}
            </Grid>
            <Grid item xs={4} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer
                errorMessage={errorMessage && errorMessage.get('CurrencyError')}
              >
                <Select
                  searchable
                  value={this.state.currency}
                  valueKey={'value'}
                  labelKey={'label2'}
                  onChange={(option) => {
                    this.setState({
                      currency: option.value,
                    });
                    this.props.removeErrorMsgHandler('CurrencyError');
                  }}
                  options={currency}
                  clearable={false}
                  autoBlur={true}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="currency"
                value={this.state.currency}
                type="hidden"
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
                  options={timeUnit}
                  clearable={false}
                  autoBlur={true}
                  value={this.state.timeUnit}
                  onChange={(option) => {
                    this.props.removeErrorMsgHandler('TimeUnitError');
                    this.setState({
                      timeUnit: option.value,
                    });
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="billRateTimeUnit"
                value={this.state.timeUnit}
                type="hidden"
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.isExempt}
                    onChange={() => {
                      this.changeExempt();
                    }}
                    name="OvertimeExempt"
                    color="primary"
                    disabled={
                      isClockIn === true || pageType === 'history' || !editType
                    }
                  />
                }
                label="Overtime Exempt"
              />
            </Grid>
            <Grid item xs={8}>
              <FormReactSelectContainer label={t('field:Overtime')}>
                <Select
                  searchable
                  labelKey={'label'}
                  valueKey={'value'}
                  value={this.state.overTime}
                  options={overTime}
                  onChange={(option) => {
                    this.setState({
                      overTime: option.value,
                    });
                  }}
                  clearable={false}
                  autoBlur={true}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType ||
                    (timeSheetType === 'WEEK' && this.props.isClockIn)
                  }
                />
              </FormReactSelectContainer>
              <input
                name="Overtime"
                value={this.state.overTime}
                type="hidden"
              />
            </Grid>
            <Grid item xs={4}>
              {pageType === 'history' ? (
                <FormInput
                  name="OvertimeBillRate"
                  label={t('field:Overtime Bill Rate')}
                  isRequired={true}
                  defaultValue={this.state.overTimeBillRate}
                  onChange={(e) => {
                    this.setState({
                      overTimeBillRate: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('overTimeBillRate');
                  }}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                  errorMessage={
                    errorMessage && errorMessage.get('overTimeBillRate')
                  }
                />
              ) : (
                <FormInput
                  name="OvertimeBillRate"
                  label={t('field:Overtime Bill Rate')}
                  isRequired={true}
                  value={this.state.overTimeBillRate}
                  onChange={(e) => {
                    this.setState({
                      overTimeBillRate: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('overTimeBillRate');
                  }}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                  errorMessage={
                    errorMessage && errorMessage.get('overTimeBillRate')
                  }
                />
              )}
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer>
                <Select
                  searchable
                  value={this.state.overTimeBilltimeUnit}
                  labelKey={'label'}
                  valueKey={'value'}
                  options={[{ value: 'HOURLY', label: 'Hourly' }]}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      overTimeBilltimeUnit: option.value,
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
                name="overTimeBilltimeUnit"
                value={this.state.overTimeBilltimeUnit}
                type="hidden"
              />
            </Grid>
            <Grid item xs={4}>
              {pageType === 'history' ? (
                <FormInput
                  name="DoubleTimeBillRate"
                  label={t('field:Double Time Bill Rate')}
                  // isRequired={true}
                  defaultValue={this.state.doubleTimeBillRate}
                  onChange={(e) => {
                    this.setState({
                      doubleTimeBillRate: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('DoubleTimeBillRate');
                  }}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                  errorMessage={
                    errorMessage && errorMessage.get('DoubleTimeBillRate')
                  }
                />
              ) : (
                <FormInput
                  name="DoubleTimeBillRate"
                  label={t('field:Double Time Bill Rate')}
                  // isRequired={true}
                  value={this.state.doubleTimeBillRate}
                  onChange={(e) => {
                    this.setState({
                      doubleTimeBillRate: e.target.value,
                    });
                    this.props.removeErrorMsgHandler('DoubleTimeBillRate');
                  }}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                  errorMessage={
                    errorMessage && errorMessage.get('DoubleTimeBillRate')
                  }
                />
              )}
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '33px' }}>
              <FormReactSelectContainer>
                <Select
                  searchable
                  labelKey={'label'}
                  valueKey={'value'}
                  value={this.state.doubleTimeBilltimeUnit}
                  options={[{ value: 'HOURLY', label: 'Hourly' }]}
                  clearable={false}
                  autoBlur={true}
                  disabled={
                    this.state.isExempt === true ||
                    pageType === 'history' ||
                    !editType
                  }
                  onChange={(option) => {
                    this.setState({
                      doubleTimeBilltimeUnit: option.value,
                    });
                  }}
                />
              </FormReactSelectContainer>
              <input
                name="doubleTimeBilltimeUnit"
                value={this.state.doubleTimeBilltimeUnit}
                type="hidden"
              />
            </Grid>
            <Grid item xs={12}>
              <FormReactSelectContainer label={t('field:Expense Invoices')}>
                <Select
                  searchable
                  valueKey={'value'}
                  labelKey={'label'}
                  value={this.state.expenseInvoice}
                  options={expenseInvoice}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      expenseInvoice: option.value,
                    });
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="ExpenseInvoices"
                value={this.state.expenseInvoice}
                type="hidden"
              />
            </Grid>
            <Grid item xs={4}>
              <FormReactSelectContainer label={t('field:Default Discount (%)')}>
                <Select
                  searchable
                  valueKey={'value'}
                  labelKey={'label_1'}
                  value={this.state.discount}
                  options={discountType}
                  clearable={false}
                  autoBlur={true}
                  onChange={(option) => {
                    this.setState({
                      discount: option.value,
                    });
                  }}
                  disabled={pageType === 'history' || !editType}
                />
              </FormReactSelectContainer>
              <input
                name="DefaultDiscount"
                value={this.state.discount}
                type="hidden"
              />
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '33px' }}>
              <FormInput
                disabled
                value={this.getDiscount(this.state.discount)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormInput
                name="PaymentTerms"
                label={t('field:Payment Terms (days)')}
                // isRequired={true}
                value={this.state.paymentTerms}
                onChange={(e) => {
                  this.setState({
                    paymentTerms: e.target.value,
                  });
                  this.props.removeErrorMsgHandler('PaymentTerms');
                }}
                disabled={pageType === 'history' || !editType}
                errorMessage={errorMessage && errorMessage.get('PaymentTerms')}
              />
            </Grid>
            {pageType === 'history' ? (
              <>
                <Grid item xs={4}>
                  <FormInput
                    name="netBillRate"
                    disabled
                    label={t('filed:Net Bill Rate')}
                    defaultValue={this.getNetBillRate()}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormInput
                    disabled
                    name="netOverTimeRate"
                    label={t('filed:Net Overtime Rate')}
                    defaultValue={this.getNetOverTimeBillRate()}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormInput
                    disabled
                    name="netDoubleTimeRate"
                    label={t('filed:Net Double Time Rate')}
                    defaultValue={this.getNetDoubleTimeBillRate()}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={4}>
                  <FormInput
                    name="netBillRate"
                    disabled
                    label={t('filed:Net Bill Rate')}
                    value={this.getNetBillRate()}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormInput
                    disabled
                    name="netOverTimeRate"
                    label={t('filed:Net Overtime Rate')}
                    value={this.getNetOverTimeBillRate()}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormInput
                    disabled
                    name="netDoubleTimeRate"
                    label={t('filed:Net Double Time Rate')}
                    value={this.getNetDoubleTimeBillRate()}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // const assignment = state.controller.assignment.get('assignmentDetail');
  // const billInfo = assignment.billInfo;
  return {
    // billInfo,
  };
};

export default connect(mapStateToProps)(BillInfoFrom);
