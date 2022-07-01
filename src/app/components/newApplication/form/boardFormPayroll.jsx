import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormInput from '../../particial/FormInput';
import DatePicker from 'react-datepicker';
import FormTextArea from '../../particial/FormTextArea';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import {
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationOfferFree,
  USER_TYPES,
} from '../../../constants/formOptions';
import {
  mapOfferLetterParams,
  swichRate,
  swichSalary,
} from '../../../../utils';
import NumberFormat from 'react-number-format';
import moment from 'moment-timezone';
import FormTitle from '../component/formTitle';
import { getApplicationPageSection } from '../../../../apn-sdk/newApplication';
import { showErrorMessage } from '../../../actions';
import { NewApplicationOfferLetterParam } from '../../../../apn-sdk';
import CommisionForm from '../component/CommisionForm';
import BasicInfoSection from '../component/BasicInfoSection';
import SalaryForm from '../component/SalaryForm';
import {
  newCreateStart,
  updateStart,
  selectStartToOpen,
} from '../../../actions/startActions';
import { getApplication } from '../../../actions/applicationActions';
import Loading from '../../particial/Loading';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const state = {};
class ApplicationBoardForm extends React.Component {
  constructor(props) {
    super(props);

    const { application } = props;
    const applicationBaseInfo = application.getIn([
      'onboard',
      'ipgOfferBaseInfo',
    ]);
    const applicationFeeCharge = application.getIn([
      'onboard',
      'ipgOfferAcceptContractFeeCharge',
    ]);
    const applicationSalary = application.getIn([
      'onboard',
      'ipgOfferAcceptFteSalaryPackages',
    ]);
    const applicationFTEFee = application.getIn([
      'onboard',
      'ipgOfferAcceptFteFeeCharge',
    ]);
    this.state = {
      sendEmailToClientFlag:
        application.getIn(['onboard', 'updateJobStatusToFilled']) || false,
      sendEmailToTalentFlag:
        application.getIn(['onboard', 'updateTalentExperience']) || false,
      startDate: null,
      errorMessage: Immutable.Map(),
      note: application.getIn(['onboard', 'note']) || '',
      onboardDate: applicationBaseInfo
        ? applicationBaseInfo.get('onboardDate')
        : null,
      warrantyEndDate: applicationBaseInfo
        ? applicationBaseInfo.get('warrantyEndDate')
        : null,
      currency: applicationBaseInfo
        ? applicationBaseInfo.get('currency')
        : null,
      rateUnitType: applicationBaseInfo
        ? applicationBaseInfo.get('rateUnitType')
        : null,
      taxBurdenRate: applicationFeeCharge
        ? applicationFeeCharge.get('taxBurdenRate').toJS()
        : null,
      mspRate: applicationFeeCharge
        ? applicationFeeCharge.get('mspRate').toJS()
        : null,
      immigrationCost: applicationFeeCharge
        ? applicationFeeCharge.get('immigrationCost').toJS()
        : null,
      extraCost: applicationFeeCharge
        ? applicationFeeCharge.get('extraCost')
        : null,
      estimatedWorkingHourPerWeek: applicationFeeCharge
        ? applicationFeeCharge.get('estimatedWorkingHourPerWeek')
        : 40,
      finalBillRate: applicationFeeCharge
        ? applicationFeeCharge.get('finalBillRate')
        : null,
      finalPayRate: applicationFeeCharge
        ? applicationFeeCharge.get('finalPayRate')
        : null,
      totalBillAmount: applicationFeeCharge
        ? applicationFeeCharge.get('gm')
        : null,
      freeList: [{ feeType: 'PERCENTAGE', currency: 'USD', fee: '' }],
      userList: [{ userId: null, percentage: 10, currency: 'USD', amount: '' }],
      salaryList: applicationSalary
        ? applicationSalary.toJS()
        : [{ salaryType: 'BASE_SALARY', amount: 0, needCharge: true }],
      applicationCommissions: [],
      owner: [],
      pageSectionArr: [],
      feeType: applicationFTEFee
        ? applicationFTEFee.get('feeType')
        : 'PERCENTAGE',
      amount: applicationFTEFee ? applicationFTEFee.get('amount') : null,
      totalAmount:
        applicationFTEFee && applicationSalary && applicationBaseInfo
          ? this.getFTETotalAmount(
              applicationFTEFee,
              applicationSalary.toJS(),
              applicationBaseInfo.get('rateUnitType')
            )
          : null, //FTE的收费信息的可收费账单金额
      checkingDuplication: false,
    };
  }

  // 因为后台没有记录FTE的收费信息的可收费账单金额,需要页面初始计算一遍回显
  getFTETotalAmount = (applicationFTEFee, applicationSalary, rateUnitType) => {
    let TotalBillCharge = 0; //可收费总计
    let TotalFTEChargeAmount = 0; //可计费基本薪资
    let newAmount = 0;
    applicationSalary &&
      applicationSalary.map((item) => {
        if (item.salaryType === 'BASE_SALARY') {
          TotalFTEChargeAmount = TotalFTEChargeAmount + Number(item.amount);
        }
        if (item.needCharge || item.salaryType === 'BASE_SALARY') {
          TotalBillCharge = TotalBillCharge + Number(item.amount);
        }
      });
    const annualSalary = swichSalary(TotalFTEChargeAmount, rateUnitType);
    const totalBillableAmount =
      Number(annualSalary) +
      Number(TotalBillCharge) -
      Number(TotalFTEChargeAmount);
    if (applicationFTEFee.get('feeType') === 'PERCENTAGE') {
      newAmount = (
        totalBillableAmount *
        (applicationFTEFee.get('amount') / 100)
      ).toFixed(2);
    } else {
      newAmount = applicationFTEFee.get('amount');
    }
    return newAmount;
  };

  componentDidMount() {
    const { dispatch, application } = this.props;
    // 获取当前流程页面配置section
    getApplicationPageSection('ON_BOARD', application.get('jobType')).then(
      ({ response }) => {
        this.setState({
          pageSectionArr: this.filterArrItem(response),
        });
      }
    );
    // 获取税率 下拉列表
    this.getApplicationOfferLetterParam();
  }

  getApplicationOfferLetterParam = () => {
    const { dispatch } = this.props;
    if (state.offerLetterParam) {
      this.setState(state.offerLetterParam);
    } else {
      NewApplicationOfferLetterParam()
        .then(({ response }) => {
          state.offerLetterParam = mapOfferLetterParams(response);
          this.setState(state.offerLetterParam);
        })
        .catch((err) => dispatch(showErrorMessage(err)));
    }
  };

  filterArrItem = (arr) => {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item.nodePageSection);
    });
    return newArr;
  };

  static validateForm = (basicForm, commissions, pageSectionArr) => {
    let errorMessage = Immutable.Map();

    if (commissions) {
      // const am = commissions.find((c) => c.userRole === USER_TYPES.AM);
      // if (!am) {
      //   errorMessage = errorMessage.set('commissions', '客户经理不能为空');
      // }
      // const commissionWithoutDuplicates = [
      //   ...new Set(commissions.map((c) => `${c.userRole}-${c.userId}`)),
      // ];
      // if (commissions.length > commissionWithoutDuplicates.length) {
      //   errorMessage = errorMessage.set('commissions', '用户角色不能重复');
      // }
      // const sum = commissions.reduce((s, c) => {
      //   return s + (Number(c.percentage) || 0);
      // }, 0);
      // if (sum !== 100) {
      //   errorMessage = errorMessage.set('commissions', '用户分配比例错误');
      // }
      // if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
      //   errorMessage = errorMessage.set(
      //     'commissions',
      //     '每一项分配比例应该大于0'
      //   );
      // }
    }
    if (basicForm.currency && !basicForm.currency.value) {
      errorMessage = errorMessage.set('currency', '币种不能为空');
    }
    if (basicForm.rateUnitType && !basicForm.rateUnitType.value) {
      errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
    }
    if (basicForm.onboardDate && !basicForm.onboardDate.value) {
      errorMessage = errorMessage.set('onboardDate', '入职日期不能为空');
    }
    if (basicForm.warrantyEndDate && !basicForm.warrantyEndDate.value) {
      errorMessage = errorMessage.set('warrantyEndDate', '结束日期不能为空');
    }
    if (basicForm.finalBillRate && !basicForm.finalBillRate.value) {
      errorMessage = errorMessage.set('finalBillRate', '收费金额不能为空');
    }
    if (basicForm.finalPayRate && !basicForm.finalPayRate.value) {
      errorMessage = errorMessage.set('finalPayRate', '工资金额不能为空');
    }
    if (basicForm.taxBurdenRate && !basicForm.taxBurdenRate.value) {
      errorMessage = errorMessage.set('taxBurdenRate', '雇主税费成本不能为空');
    }
    if (basicForm.mspRate && !basicForm.mspRate.value) {
      errorMessage = errorMessage.set('mspRate', 'MSP率不能为空');
    }
    if (basicForm.immigrationCost && !basicForm.immigrationCost.value) {
      errorMessage = errorMessage.set('immigrationCost', '移民费用不能为空');
    }
    if (
      basicForm.gm &&
      basicForm.gm.value &&
      basicForm.gm.value.includes('-')
    ) {
      errorMessage = errorMessage.set('gm', 'GM不能小于0');
    }
    if (
      basicForm.estimatedWorkingHourPerWeek &&
      !basicForm.estimatedWorkingHourPerWeek.value
    ) {
      errorMessage = errorMessage.set(
        'estimatedWorkingHourPerWeek',
        '工作时间不能为空'
      );
    }

    // if (basicForm.amount && !basicForm.amount.value) {
    //   errorMessage = errorMessage.set('amount', '费用不能为空');
    // }
    // if (basicForm.totalAmount && !Number(basicForm.totalAmount.value)) {
    //   errorMessage = errorMessage.set('amount', '费用不能为空');
    // }
    if (basicForm.clientNote && basicForm.clientNote.value.length > 5000) {
      errorMessage = errorMessage.set('note', '备注不能大于5000长度');
    }
    if (pageSectionArr.includes('IPG_NOTE_REQUIRED')) {
      if (
        (basicForm.clientNote && !basicForm.clientNote.value) ||
        /^\s+$/gi.test(basicForm.clientNote.value)
      ) {
        errorMessage = errorMessage.set('note', '备注不能为空');
      }
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleSubmitInterview = (e) => {
    e.preventDefault();
    const { dispatch, application } = this.props;
    const {
      pageSectionArr,
      onboardDate,
      warrantyEndDate,
      feeType,
      amount,
      freeList,
      userList,
      currency,
      rateUnitType,
    } = this.state;
    const onboard = e.target;
    if (pageSectionArr.length === 0) {
      return;
    }
    // 分配比例校验
    let errorMessage;
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      errorMessage = ApplicationBoardForm.validateForm(
        onboard,
        filteredApplicationCommissions,
        pageSectionArr
      );
    } else {
      errorMessage = ApplicationBoardForm.validateForm(
        onboard,
        null,
        pageSectionArr
      );
    }
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    const onboardForm = {
      talentRecruitmentProcessId: application.getIn([
        'submitToJob',
        'talentRecruitmentProcessId',
      ]),
      // updateJobStatusToFilled: this.state.sendEmailToClientFlag,
      // updateTalentExperience: this.state.sendEmailToTalentFlag,
    };
    if (pageSectionArr.includes('IPG_OFFER_INFO')) {
      onboardForm.ipgOfferBaseInfo = {
        onboardDate: moment(onboardDate).format('YYYY-MM-DD'),
        warrantyEndDate: moment(warrantyEndDate).format('YYYY-MM-DD'),
        currency,
        rateUnitType,
      };
      onboardForm.note = onboard.clientNote.value;
    }
    if (pageSectionArr.includes('IPG_FTE_ALL_PACKAGE')) {
      // 过滤掉type没填并且金额没填
      const filteredApplicationSalary = this.$refSalary.state.salaryList.filter(
        (c) => {
          if (c.amount === 0 && c.salaryType) {
            return c;
          }
          return c.amount && c.salaryType;
        }
      );
      onboardForm.ipgOfferAcceptFteSalaryPackages = filteredApplicationSalary;
    }
    if (pageSectionArr.includes('IPG_FTE_FEE_CHARGE')) {
      onboardForm.ipgOfferAcceptFteFeeCharge = {
        feeType,
        amount,
      };
    }
    if (pageSectionArr.includes('IPG_CONTRACT_FEE_CHARGE')) {
      onboardForm.ipgOfferAcceptContractFeeCharge = {
        finalBillRate: this.state.finalBillRate,
        finalPayRate: this.state.finalPayRate,
        taxBurdenRateCode: this.state.taxBurdenRate.code,
        mspRateCode: this.state.mspRate.code,
        immigrationCostCode: this.state.immigrationCost.code,
        extraCost: this.state.extraCost,
        estimatedWorkingHourPerWeek: this.state.estimatedWorkingHourPerWeek,
        gm: this.state.totalBillAmount,
      };
    }
    if (pageSectionArr.includes('DEFAULT_FEE_CHARGE')) {
      onboardForm.feeCharges = freeList;
    }
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      onboardForm.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (pageSectionArr.includes('DEFAULT_COMMISSION_USER')) {
      onboardForm.users = userList;
    }
    console.log(onboardForm);
    this.setState({
      checkingDuplication: true,
    });
    this.props.onSubmit(true);
    dispatch(newCreateStart(onboardForm))
      .then((normalizedData) => {
        onboardForm.id = normalizedData.result;
        // dispatch(
        //   selectStartToOpen(this.props.start.merge(Immutable.fromJS(newStart)))
        // );
        // dispatch(getApplication(normalizedData.talentId));
        this.setState({ checkingDuplication: false });
        this.props.onSubmit(false);
        this.props.onSubmitToOnboard(e);
      })
      .catch((err) => {
        this.setState({ checkingDuplication: false });
        dispatch(showErrorMessage(err));
        this.props.onSubmit(false);
      });
  };

  handleDropDownChange = (key) => (value) => {
    const { job } = this.props;
    const { currency } = this.state;
    value = value || this.state[key];
    if (job.get('type') === 'FULL_TIME') {
      this.setState({ [key]: value }, this._computeFullTimeGM);
    } else {
      this.setState({ [key]: value }, this._computeContractGM);
      if (key === 'currency' && value !== currency) {
        this.setState(
          {
            taxBurdenRate: null,
            mspRate: null,
            immigrationCost: null,
          },
          this._computeContractGM
        );
      }
    }
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value }, this.computeContractGM);
    // this.props.removeErrorMsgHandler(key);
  };

  handleFTENumberChange = (key) => (values) => {
    this.setState({ [key]: values.value }, () => {
      this._computeFullTimeGM();
    });
  };

  handleFTEDropDownChange = (key) => (value) => {
    const { amount } = this.state;
    value = value || this.state[key];
    this.setState({ [key]: value }, () => {
      this._computeFullTimeGM();
    });
    if (value === 'PERCENTAGE') {
      this.setState(
        {
          amount: '',
        },
        () => {
          this._computeFullTimeGM();
        }
      );
    }
  };

  _computeFullTimeGM = () => {
    const { feeType, amount, rateUnitType } = this.state;
    if (amount) {
      let TotalBillCharge = 0; //可收费总计
      let TotalFTEChargeAmount = 0; //可计费基本薪资
      let newAmount = 0; //可收费账单金额(以年为单位计算)
      this.$refSalary.state.salaryList.map((item) => {
        if (
          (item.needCharge || item.salaryType === 'BASE_SALARY') &&
          item.salaryType
        ) {
          TotalBillCharge = TotalBillCharge + Number(item.amount);
        }
        if (item.salaryType === 'BASE_SALARY') {
          TotalFTEChargeAmount = TotalFTEChargeAmount + Number(item.amount);
        }
      });
      const annualSalary = swichSalary(TotalFTEChargeAmount, rateUnitType);
      const totalBillableAmount =
        Number(annualSalary) +
        Number(TotalBillCharge) -
        Number(TotalFTEChargeAmount);

      if (feeType === 'PERCENTAGE') {
        newAmount = totalBillableAmount * (amount / 100);
      } else {
        newAmount = amount ? Number(amount) : 0;
      }
      this.setState({
        totalAmount: newAmount.toFixed(2),
      });
    } else {
      this.setState({
        totalAmount: 0,
      });
    }
  };

  handleDateChange = (key) => (value) => {
    this.setState(
      { [key]: value ? value.format('YYYY-MM-DD') : null },
      this.computeContractGM
    );
  };

  withValueCap = (inputObj) => {
    const { value } = inputObj;
    if (value <= 100) return true;
    return false;
  };
  withValueCapTwo = (inputObj) => {
    return true;
  };

  computeContractGM = () => {
    clearTimeout(this.computeGM);
    this.removeErrorMessage('gm');
    this.computeGM = setTimeout(this._computeContractGM, 400);
  };

  // GM计算公式 GM=(Bill Rate-Pay Rate-Tax Burden（Pay Rate*Tax Burden Rate）- MSP(Bill Rate*MSP Rate))*
  // (End Date-Start Date)/7*(Est. Working Hours/Week)
  // -Immigration Cost-Extra Cost
  _computeContractGM = () => {
    const {
      rateUnitType,
      taxBurdenRate,
      mspRate,
      immigrationCost,
      extraCost,
      warrantyEndDate,
      onboardDate,
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
      warrantyEndDate &&
      onboardDate
    ) {
      const dateGap =
        moment(warrantyEndDate).diff(moment(onboardDate), 'days') + 1;
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
        Number(extraCost);
      console.log(totalBillAmount);
      this.setState({ totalBillAmount: Number(totalBillAmount.toFixed(4)) });
    }
  };

  render() {
    const { t, job, candidate, application } = this.props;
    const {
      note,
      errorMessage,
      startDate,
      warrantyEndDate,
      onboardDate,
      currency,
      rateUnitType,
      finalPayRate,
      finalBillRate,
      estimatedWorkingHourPerWeek,
      extraCost,
      immigrationCost,
      mspRate,
      taxBurdenRate,
      freeList,
      userList,
      totalBillAmount,
      pageSectionArr,
      amount,
      feeType,
      taxBurdenRateOpts,
      mspRateOpts,
      immigrationCostOpts,
      sendEmailToClientFlag,
      sendEmailToTalentFlag,
      salaryList,
      totalAmount,
    } = this.state;
    if (pageSectionArr.length === 0) {
      return <Loading />;
    }
    return (
      <form onSubmit={this.handleSubmitInterview} id="newApplicationBoardForm">
        <>
          <BasicInfoSection job={job} candidate={candidate} />
          <FormTitle title={'Offer信息'} />
          <div className="row expanded small-12">
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={'入职日期'}
                isRequired={true}
                errorMessage={errorMessage.get('onboardDate')}
              >
                <DatePicker
                  dropdownMode={'scroll'}
                  maxDate={warrantyEndDate && moment(warrantyEndDate)}
                  selected={onboardDate ? moment(onboardDate) : null}
                  onChange={this.handleDateChange('onboardDate')}
                  onBlur={() => {
                    this.removeErrorMessage('onboardDate');
                  }}
                  placeholderText="mm/dd/yyyy"
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="onboardDate"
                value={onboardDate ? onboardDate : ''}
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={'结束日期'}
                isRequired={true}
                errorMessage={errorMessage.get('warrantyEndDate')}
              >
                <DatePicker
                  dropdownMode={'scroll'}
                  minDate={onboardDate && moment(onboardDate)}
                  selected={warrantyEndDate ? moment(warrantyEndDate) : null}
                  onChange={this.handleDateChange('warrantyEndDate')}
                  onBlur={() => {
                    this.removeErrorMessage('warrantyEndDate');
                  }}
                  placeholderText="mm/dd/yyyy"
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="warrantyEndDate"
                value={warrantyEndDate ? warrantyEndDate : ''}
              />
            </div>
          </div>
          <div className="row expanded small-6">
            <div className="small-3 columns">
              <FormReactSelectContainer
                label={'币种/类型'}
                isRequired={true}
                errorMessage={errorMessage.get('currency')}
              >
                <Select
                  labelKey={'label3'}
                  clearable={false}
                  simpleValue
                  options={currencyOptions}
                  value={currency}
                  onChange={this.handleDropDownChange('currency')}
                  onBlur={() => {
                    this.removeErrorMessage('currency');
                  }}
                />
              </FormReactSelectContainer>
              <input type="hidden" name="currency" value={currency || ''} />
            </div>
            <div className="small-3 columns">
              <FormReactSelectContainer
                label={<>&nbsp;</>}
                errorMessage={errorMessage.get('rateUnitType')}
              >
                <Select
                  labelKey={'label2'}
                  clearable={false}
                  simpleValue
                  options={payRateUnitTypes}
                  value={rateUnitType}
                  onChange={this.handleDropDownChange('rateUnitType')}
                  onBlur={() => {
                    this.removeErrorMessage('rateUnitType');
                  }}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="rateUnitType"
                value={rateUnitType || ''}
              />
            </div>
          </div>
        </>

        {
          <>
            <FormTitle title={'收费信息'} />
            <div className="row expanded small-12">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  errorMessage={t(errorMessage.get('finalBillRate'))}
                  label={'收费金额'}
                  isRequired={true}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={finalBillRate}
                    placeholder={'请输入金额'}
                    onValueChange={this.handleNumberChange('finalBillRate')}
                    onBlur={() => {
                      this.removeErrorMessage('finalBillRate');
                    }}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="finalBillRate"
                  value={finalBillRate || ''}
                />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  errorMessage={t(errorMessage.get('finalPayRate'))}
                  label={'工资金额'}
                  isRequired={true}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={finalPayRate}
                    placeholder={'请输入金额'}
                    onValueChange={this.handleNumberChange('finalPayRate')}
                    onBlur={() => {
                      this.removeErrorMessage('finalPayRate');
                    }}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="finalPayRate"
                  value={finalPayRate || ''}
                />
              </div>
            </div>
            <div className="row expanded small-12">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'雇主税费成本'}
                  isRequired={true}
                  errorMessage={errorMessage.get('taxBurdenRate')}
                >
                  <Select
                    valueKey={'code'}
                    labelKey={'description'}
                    clearable={false}
                    options={
                      taxBurdenRateOpts &&
                      taxBurdenRateOpts.filter((e) => e.currency === currency)
                    }
                    placeholder={'请选择'}
                    value={taxBurdenRate}
                    onChange={this.handleDropDownChange('taxBurdenRate')}
                    onBlur={() => {
                      this.removeErrorMessage('taxBurdenRate');
                    }}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="taxBurdenRate"
                  value={taxBurdenRate || ''}
                />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'MSP率'}
                  isRequired={true}
                  errorMessage={errorMessage.get('mspRate')}
                >
                  <Select
                    valueKey={'code'}
                    labelKey={'description'}
                    clearable={false}
                    options={
                      mspRateOpts &&
                      mspRateOpts.filter((e) => e.currency === currency)
                    }
                    placeholder={'请选择'}
                    value={mspRate}
                    onChange={this.handleDropDownChange('mspRate')}
                    onBlur={() => {
                      this.removeErrorMessage('mspRate');
                    }}
                  />
                </FormReactSelectContainer>
                <input type="hidden" name="mspRate" value={mspRate || ''} />
              </div>
            </div>
            <div className="row expanded small-12">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'移民费用'}
                  isRequired={true}
                  errorMessage={errorMessage.get('immigrationCost')}
                >
                  <Select
                    valueKey={'code'}
                    labelKey={'description'}
                    clearable={false}
                    options={
                      immigrationCostOpts &&
                      immigrationCostOpts.filter((e) => e.currency === currency)
                    }
                    placeholder={'请选择'}
                    value={immigrationCost}
                    onChange={this.handleDropDownChange('immigrationCost')}
                    onBlur={() => {
                      this.removeErrorMessage('immigrationCost');
                    }}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="immigrationCost"
                  value={immigrationCost || ''}
                />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  errorMessage={t(errorMessage.get('extraCost'))}
                  label={'额外费用'}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={extraCost}
                    onValueChange={this.handleNumberChange('extraCost')}
                    onBlur={() => {
                      this.removeErrorMessage('extraCost');
                    }}
                    placeholder={'请输入金额'}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input type="hidden" name="extraCost" value={extraCost || ''} />
              </div>
            </div>
            <div className="row expanded small-12">
              <div className="small-6 columns">
                <FormInput
                  name="estimatedWorkingHourPerWeek"
                  label={'预计每周工作时间'}
                  value={estimatedWorkingHourPerWeek}
                  isRequired={true}
                  type="number"
                  min={1}
                  max={56}
                  placeholder={'请输入'}
                  onChange={(e) => {
                    this.setState(
                      {
                        estimatedWorkingHourPerWeek: e.target.value
                          ? Number(e.target.value)
                          : e.target.value,
                      },
                      this.computeContractGM
                    );
                  }}
                  errorMessage={errorMessage.get('estimatedWorkingHourPerWeek')}
                  onBlur={() => {
                    this.removeErrorMessage('estimatedWorkingHourPerWeek');
                  }}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="gm"
                  label={'GM'}
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
                  disabled
                  errorMessage={errorMessage.get('gm')}
                />
              </div>
            </div>
          </>
        }

        {
          <>
            <div className="row expanded small-12">
              <div className="small-12 columns">
                <FormTextArea
                  errorMessage={errorMessage.get('note')}
                  onFocus={() => this.removeErrorMessage('note')}
                  label={'备注'}
                  isRequired={
                    pageSectionArr.includes('IPG_NOTE_REQUIRED') ? true : false
                  }
                  name="clientNote"
                  defaultValue={note || ''}
                  rows="3"
                  maxLength={100}
                />
              </div>
            </div>
          </>
        }

        <Dialog open={this.state.checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Submiting To OnBoard'}</Typography>
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

function mapStoreStateToProps(state, { invoice }) {
  // const clientContactId = invoice.get('clientContactId');
  return {
    // templateList: templateSelector(state, 'Invoice_Email'),
    // user: state.controller.currentUser,
    // client: clientContactId && state.model.clients.get(String(clientContactId)),
  };
}

export default connect(mapStoreStateToProps)(ApplicationBoardForm);
