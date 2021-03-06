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
      'offerAccept',
      'ipgOfferBaseInfo',
    ]);
    const applicationFeeCharge = application.getIn([
      'offerAccept',
      'ipgOfferAcceptContractFeeCharge',
    ]);
    const applicationSalary = application.getIn([
      'offerAccept',
      'salaryPackages',
    ]);
    const applicationFTEFee = application.getIn([
      'offerAccept',
      'ipgOfferAcceptFteFeeCharge',
    ]);
    this.state = {
      sendEmailToClientFlag:
        application.getIn(['onboard', 'updateJobStatusToFilled']) || false,
      sendEmailToTalentFlag:
        application.getIn(['onboard', 'updateTalentExperience']) || false,
      startDate: application.getIn(['onboard', 'startDate']),
      warrantyEndDateGen: application.getIn(['onboard', 'warrantyEndDate']),
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
        : null,
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
          : null, //FTE???????????????????????????????????????
      checkingDuplication: false,
    };
  }

  // ????????????????????????FTE???????????????????????????????????????,????????????????????????????????????
  getFTETotalAmount = (applicationFTEFee, applicationSalary, rateUnitType) => {
    let TotalBillCharge = 0; //???????????????
    let TotalFTEChargeAmount = 0; //?????????????????????
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
    // ??????????????????????????????section
    getApplicationPageSection('ON_BOARD', application.get('jobType')).then(
      ({ response }) => {
        this.setState({
          pageSectionArr: this.filterArrItem(response),
        });
      }
    );

    // ????????????
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

  static validateForm = (basicForm, commissions, pageSectionArr, hasOwner) => {
    let errorMessage = Immutable.Map();

    if (commissions) {
      const am = commissions.find((c) => c.userRole === USER_TYPES.AM);
      if (!am) {
        errorMessage = errorMessage.set('commissions', '????????????????????????');
      }

      const commissionWithoutDuplicates = [
        ...new Set(commissions.map((c) => `${c.userRole}-${c.userId}`)),
      ];
      if (commissions.length > commissionWithoutDuplicates.length) {
        errorMessage = errorMessage.set('commissions', '????????????????????????');
      }

      const sum = commissions.reduce((s, c) => {
        return s + (Number(c.percentage) || 0);
      }, 0);

      if (sum + hasOwner * 10 !== 100) {
        errorMessage = errorMessage.set('commissions', '????????????????????????');
      }
      if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
        errorMessage = errorMessage.set(
          'commissions',
          '?????????????????????????????????0'
        );
      }
    }
    if (basicForm.currency && !basicForm.currency.value) {
      errorMessage = errorMessage.set('currency', '??????????????????');
    }
    if (basicForm.rateUnitType && !basicForm.rateUnitType.value) {
      errorMessage = errorMessage.set('rateUnitType', '??????????????????');
    }
    if (basicForm.onboardDate && !basicForm.onboardDate.value) {
      errorMessage = errorMessage.set('onboardDate', '????????????????????????');
    }
    if (basicForm.warrantyEndDate && !basicForm.warrantyEndDate.value) {
      errorMessage = errorMessage.set('warrantyEndDate', '????????????????????????');
    }
    if (basicForm.finalBillRate && !basicForm.finalBillRate.value) {
      errorMessage = errorMessage.set('finalBillRate', '????????????????????????');
    }
    if (basicForm.finalPayRate && !basicForm.finalPayRate.value) {
      errorMessage = errorMessage.set('finalPayRate', '????????????????????????');
    }
    if (basicForm.taxBurdenRate && !basicForm.taxBurdenRate.value) {
      errorMessage = errorMessage.set('taxBurdenRate', '??????????????????????????????');
    }
    if (basicForm.mspRate && !basicForm.mspRate.value) {
      errorMessage = errorMessage.set('mspRate', 'MSP???????????????');
    }
    if (basicForm.immigrationCost && !basicForm.immigrationCost.value) {
      errorMessage = errorMessage.set('immigrationCost', '????????????????????????');
    }
    if (basicForm.startDate && !basicForm.startDate.value) {
      errorMessage = errorMessage.set('startDate', '????????????????????????');
    }
    if (basicForm.warrantyEndDateGen && !basicForm.warrantyEndDateGen.value) {
      errorMessage = errorMessage.set(
        'warrantyEndDateGen',
        '?????????????????????????????????'
      );
    }
    if (
      basicForm.gm &&
      basicForm.gm.value &&
      basicForm.gm.value.includes('-')
    ) {
      errorMessage = errorMessage.set('gm', 'GM????????????0');
    }
    if (
      basicForm.estimatedWorkingHourPerWeek &&
      !basicForm.estimatedWorkingHourPerWeek.value
    ) {
      errorMessage = errorMessage.set(
        'estimatedWorkingHourPerWeek',
        '????????????????????????'
      );
    }

    if (basicForm.amount && !basicForm.amount.value) {
      errorMessage = errorMessage.set('amount', '??????????????????');
    }
    if (basicForm.totalAmount && !Number(basicForm.totalAmount.value)) {
      errorMessage = errorMessage.set('amount', '??????????????????');
    }
    if (basicForm.clientNote && basicForm.clientNote.value.length > 5000) {
      errorMessage = errorMessage.set('note', '??????????????????5000??????');
    }

    if (pageSectionArr.includes('IPG_NOTE_REQUIRED')) {
      if (
        (basicForm.clientNote && !basicForm.clientNote.value) ||
        /^\s+$/gi.test(basicForm.clientNote.value)
      ) {
        errorMessage = errorMessage.set('note', '??????????????????');
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
      warrantyEndDateGen,
      startDate,
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
    // ??????????????????
    let errorMessage;
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      const owner = this.$ref.state.owner.filter((c) => !!c.userId);
      errorMessage = ApplicationBoardForm.validateForm(
        onboard,
        filteredApplicationCommissions,
        pageSectionArr,
        owner ? owner.length > 0 : null
      );
    } else {
      errorMessage = ApplicationBoardForm.validateForm(
        onboard,
        null,
        pageSectionArr,
        null
      );
    }
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    const onboardForm = {
      talentRecruitmentProcessId: application.getIn([
        'offer',
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
    if (pageSectionArr.includes('DEFAULT_BASE_PAGE_ON_BOARD')) {
      onboardForm.startDate = moment(startDate).format('YYYY-MM-DD');
      onboardForm.warrantyEndDate =
        moment(warrantyEndDateGen).format('YYYY-MM-DD');
    }
    if (pageSectionArr.includes('IPG_FTE_ALL_PACKAGE')) {
      // ?????????type????????????????????????
      const filteredApplicationSalary = this.$refSalary.state.salaryList.filter(
        (c) => {
          if (c.amount === 0 && c.salaryType) {
            return c;
          }
          return c.amount && c.salaryType;
        }
      );
      onboardForm.salaryPackages = filteredApplicationSalary;
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
        console.log('sadsasa', normalizedData);
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

  renderFreeCommission = (commission) => {
    const { errorMessage, freeList } = this.state;
    const index = freeList.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        {/* 1.???????????? */}
        <div className="small-6 columns">
          <FormReactSelectContainer
            label={index < 1 ? '??????' : null}
            isRequired={index < 1 && true}
          >
            <Select
              value={commission.feeType}
              simpleValue
              options={ApplicationOfferFree}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              onChange={(feeType) => {
                commission.feeType = feeType || commission.feeType;
                this.setState({
                  freeList: freeList.slice(),
                });
              }}
            />
          </FormReactSelectContainer>
        </div>

        <div
          className={
            freeList.length <= 1
              ? 'small-6 row expanded'
              : 'small-5 row expanded'
          }
        >
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={index < 1 ? '????????????' : null}
              isRequired={index < 1 && true}
              errorMessage={errorMessage.get('currency')}
            >
              <Select
                labelKey={'label3'}
                clearable={false}
                simpleValue
                options={currencyOptions}
                value={commission.currency}
                onChange={(currency) => {
                  commission.currency = currency || commission.currency;
                  this.setState({
                    freeList: freeList.slice(),
                  });
                }}
              />
            </FormReactSelectContainer>
          </div>
          <div className="small-6 columns">
            <FormInput
              label={index < 1 ? <>&nbsp;</> : null}
              name="commissions.fee"
              value={commission.fee || ''}
              onChange={(e) => {
                commission.fee = e.target.value;
                this.setState({
                  freeList: freeList.slice(),
                });
              }}
              type="number"
              min={0}
              errorMessage={
                commission.userId && errorMessage.get('commissionPct') && true
              }
            />
          </div>
        </div>

        {freeList.length <= 1 ? null : (
          <div className="small-1 columns horizontal-layout align-self-top">
            {/* ?????? */}
            <IconButton
              size="small"
              style={index < 1 ? { marginTop: 20 } : null}
              onClick={() => {
                this.setState({
                  freeList: freeList.filter((c) => c !== commission),
                });
              }}
            >
              <Delete />
            </IconButton>
          </div>
        )}
      </div>
    );
  };

  renderUserCommission = (commission) => {
    const { errorMessage, userList } = this.state;
    const index = userList.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        {/* 1.????????? */}
        <div className="small-4 columns">
          <FormReactSelectContainer
            label={index < 1 ? '?????????' : null}
            isRequired={index < 1 && true}
          >
            <Select
              labelKey={'label2'}
              clearable={false}
              value={commission.userId}
              simpleValue
              onChange={(userId) => {
                commission.userId = userId || commission.userId;
                this.setState({
                  userList: userList.slice(),
                });
              }}
            />
          </FormReactSelectContainer>
        </div>

        <div className="small-3 columns">
          <FormInput
            label={index < 1 ? '??????' : null}
            isRequired={index < 1 && true}
            value={commission.percentage}
            onChange={(percentage) => {
              commission.percentage = percentage || commission.percentage;
              this.setState({
                userList: userList.slice(),
              });
            }}
          />
        </div>

        <div className="small-5 row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={index < 1 ? '????????????' : null}
              isRequired={index < 1 && true}
            >
              <Select
                labelKey={'label3'}
                clearable={false}
                disabled
                options={currencyOptions}
                value={commission.currency}
                onChange={(currency) => {
                  commission.currency = currency || commission.currency;
                  this.setState({
                    userList: userList.slice(),
                  });
                }}
              />
            </FormReactSelectContainer>
          </div>
          <div
            className={
              userList.length <= 1 ? 'small-6 columns' : 'small-5 columns'
            }
          >
            <FormInput
              label={index < 1 ? <>&nbsp;</> : null}
              value={commission.amount || ''}
              onChange={(e) => {
                commission.amount = e.target.value;
                this.setState({
                  userList: userList.slice(),
                });
              }}
            />
          </div>
          {userList.length <= 1 ? null : (
            <div className="small-1 columns horizontal-layout align-self-top">
              {/* ?????? */}
              <IconButton
                size="small"
                style={index < 1 ? { marginTop: 20 } : null}
                onClick={() => {
                  this.setState({
                    userList: userList.filter((c) => c !== commission),
                  });
                }}
              >
                <Delete />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    );
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
      let TotalBillCharge = 0; //???????????????
      let TotalFTEChargeAmount = 0; //?????????????????????
      let newAmount = 0; //?????????????????????(?????????????????????)
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
      warrantyEndDateGen,
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
        {pageSectionArr.includes('IPG_OFFER_INFO') ? (
          <>
            <BasicInfoSection job={job} candidate={candidate} />
            <FormTitle title={'Offer??????'} />
            <div className="row expanded small-12">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'????????????'}
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
                  label={'???????????????'}
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
                  label={'??????/??????'}
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
        ) : null}

        {pageSectionArr.includes('IPG_FTE_ALL_PACKAGE') ? (
          <SalaryForm
            key={'onboardSalary'}
            currency={currency}
            onRef={(ref) => {
              this.$refSalary = ref;
            }}
            salaryList={salaryList}
            _computeFullTimeGM={this._computeFullTimeGM}
          />
        ) : null}

        {pageSectionArr.includes('IPG_FTE_FEE_CHARGE') ? (
          <>
            <FormTitle title={'????????????'} />
            <div className="row small-12">
              <div className="small-6 row expanded">
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={'????????????'}
                    isRequired={true}
                    errorMessage={errorMessage.get('feeType')}
                  >
                    <Select
                      clearable={false}
                      simpleValue
                      options={ApplicationOfferFree}
                      value={feeType}
                      onChange={this.handleFTEDropDownChange('feeType')}
                    />
                  </FormReactSelectContainer>
                </div>
                <div className="small-6 columns">
                  <FormReactSelectContainer label={<>&nbsp;</>}>
                    <NumberFormat
                      thousandSeparator
                      value={amount}
                      onValueChange={this.handleFTENumberChange('amount')}
                      allowNegative={false}
                      isAllowed={
                        feeType === 'PERCENTAGE'
                          ? this.withValueCap
                          : this.withValueCapTwo
                      }
                    />
                  </FormReactSelectContainer>
                </div>
              </div>
              <div className="small-6 columns">
                <FormInput
                  label={'?????????????????????'}
                  isRequired={true}
                  errorMessage={t(errorMessage.get('amount'))}
                  value={totalAmount}
                  name="totalAmount"
                  disabled
                />
                <input type="hidden" name="amount" value={amount || ''} />
              </div>
            </div>
          </>
        ) : null}

        {pageSectionArr.includes('IPG_CONTRACT_FEE_CHARGE') ? (
          <>
            <FormTitle title={'????????????'} />
            <div className="row expanded small-12">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  errorMessage={t(errorMessage.get('finalBillRate'))}
                  label={'????????????'}
                  isRequired={true}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={finalBillRate}
                    placeholder={'???????????????'}
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
                  label={'????????????'}
                  isRequired={true}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={finalPayRate}
                    placeholder={'???????????????'}
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
                  label={'??????????????????'}
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
                    placeholder={'?????????'}
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
                  label={'MSP???'}
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
                    placeholder={'?????????'}
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
                  label={'????????????'}
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
                    placeholder={'?????????'}
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
                  label={'????????????'}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={extraCost}
                    onValueChange={this.handleNumberChange('extraCost')}
                    onBlur={() => {
                      this.removeErrorMessage('extraCost');
                    }}
                    placeholder={'???????????????'}
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
                  label={'????????????????????????'}
                  value={estimatedWorkingHourPerWeek}
                  isRequired={true}
                  type="number"
                  min={1}
                  max={56}
                  placeholder={'?????????'}
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
        ) : null}

        {pageSectionArr.includes('DEFAULT_FEE_CHARGE') ? (
          <>
            <div
              style={{
                color: '#505050',
                fontSize: 16,
                fontWeight: 600,
                marginTop: 30,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>{'????????????'}</div>
              <div
                style={{ color: '#1890ff', fontWeight: 300, cursor: 'pointer' }}
                onClick={() => {
                  freeList.splice(freeList.length + 1, 0, {
                    feeType: null,
                    currency: 'USD',
                    fee: 0,
                  });
                  this.setState({
                    freeList: freeList.slice(),
                  });
                }}
              >
                {'+ ??????'}
              </div>
            </div>
            {freeList.map((commission) => {
              return this.renderFreeCommission(commission);
            })}
            <div
              style={{
                color: '#505050',
                fontSize: 14,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              {'????????????  ??61.5'}
            </div>
          </>
        ) : null}

        {pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
          <>
            <CommisionForm
              key={'SubmitToOnboard'}
              onRef={(ref) => {
                this.$ref = ref;
              }}
              application={application}
              removeErrorMessage={this.removeErrorMessage}
            />
            {errorMessage.get('commissions') && (
              <div className="columns" style={{ marginTop: 4 }}>
                <div className="foundation">
                  <span className="form-error is-visible">
                    {errorMessage.get('commissions')}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : null}
        {pageSectionArr.includes('DEFAULT_COMMISSION_USER') ? (
          <>
            <div
              style={{
                color: '#505050',
                fontSize: 16,
                fontWeight: 600,
                marginTop: 30,
                marginBottom: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>{'????????????'}</div>
              <div
                style={{ color: '#1890ff', fontWeight: 300, cursor: 'pointer' }}
                onClick={() => {
                  userList.splice(userList.length + 1, 0, {
                    userId: null,
                    percentage: 0,
                    currency: 'USD',
                    amount: 0,
                  });
                  this.setState({
                    userList: userList.slice(),
                  });
                }}
              >
                {'+ ??????'}
              </div>
            </div>
            {userList.map((commission) => {
              return this.renderUserCommission(commission);
            })}
          </>
        ) : null}
        {pageSectionArr.includes('IPG_NOTE_REQUIRED') ? (
          <>
            <div className="row expanded small-12">
              <div className="small-12 columns">
                <FormTextArea
                  errorMessage={errorMessage.get('note')}
                  onFocus={() => this.removeErrorMessage('note')}
                  label={'??????'}
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
        ) : null}

        {pageSectionArr.includes('DEFAULT_BASE_PAGE_ON_BOARD') ? (
          <div className="row expanded small-12">
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={'????????????'}
                isRequired={true}
                errorMessage={errorMessage.get('startDate')}
              >
                <DatePicker
                  selected={startDate ? moment(startDate) : null}
                  onChange={(startDate) => this.setState({ startDate })}
                  // filterDate={endDate && isWeekday}
                  maxDate={warrantyEndDateGen && moment(warrantyEndDateGen)}
                  showDisabledMonthNavigation
                  onBlur={() => {
                    this.removeErrorMessage('startDate');
                  }}
                />
                <input
                  type="hidden"
                  name="startDate"
                  value={startDate ? startDate : ''}
                />
              </FormReactSelectContainer>
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={'?????????????????????'}
                isRequired={true}
                errorMessage={errorMessage.get('warrantyEndDateGen')}
              >
                <DatePicker
                  selected={
                    warrantyEndDateGen ? moment(warrantyEndDateGen) : null
                  }
                  onChange={(warrantyEndDateGen) =>
                    this.setState({ warrantyEndDateGen })
                  }
                  minDate={startDate && moment(startDate)}
                  // filterDate={endDate && isWeekday}
                  showDisabledMonthNavigation
                  onBlur={() => {
                    this.removeErrorMessage('warrantyEndDateGen');
                  }}
                />
                <input
                  type="hidden"
                  name="warrantyEndDateGen"
                  value={warrantyEndDateGen ? warrantyEndDateGen : ''}
                />
              </FormReactSelectContainer>
            </div>
          </div>
        ) : null}

        {/* <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormReactSelectContainer label={'??????????????????'}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={sendEmailToClientFlag}
                    onChange={(e) =>
                      this.setState({ sendEmailToClientFlag: e.target.checked })
                    }
                  />
                }
                label={'????????????????????????????????????'}
              />
            </FormReactSelectContainer>
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer label={'???????????????????????????'}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={sendEmailToTalentFlag}
                    onChange={(e) =>
                      this.setState({ sendEmailToTalentFlag: e.target.checked })
                    }
                  />
                }
                label={'???'}
              />
            </FormReactSelectContainer>
          </div>
        </div> */}
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
