import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { connect } from 'react-redux';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormTextArea from '../../particial/FormTextArea';
import FormInput from '../../particial/FormInput';
import DatePicker from 'react-datepicker';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import {
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationOfferFree,
  USER_TYPES,
  chargeType,
} from '../../../constants/formOptions';
import {
  mapOfferLetterParams,
  swichRate,
  swichSalary,
} from '../../../../utils';
import NumberFormat from 'react-number-format';
import moment from 'moment-timezone';
import FormTitle from '../component/formTitle';
import UserOptionSte from '../component/userOptionSte';
import { getApplicationPageSection } from '../../../../apn-sdk/newApplication';
import { newApplicationSubmitToOfferAccept } from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
import { NewApplicationOfferLetterParam } from '../../../../apn-sdk';
import CommisionForm from '../component/CommisionForm';
import BasicInfoSection from '../component/BasicInfoSection';
import SalaryForm from '../component/SalaryForm';
import Loading from '../../particial/Loading';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const state = {};
class ApplicationResultForm extends React.Component {
  constructor(props) {
    super(props);
    const { application } = props;
    //versionsFlag = true 为通用版本
    const versionsFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    const AgreedPayRate = application.get('agreedPayRate');
    const Feelist = application.getIn(['offer', 'feeCharge']);
    const userCurrency = application.getIn(['offer', 'salary']);
    const commissionFlag =
      application.get('commission').size === 0 ? false : true;
    const IpgOfferBaseInfo = application.getIn([
      'offerAccept',
      'ipgOfferBaseInfo',
    ]);
    const IpgContractFeeCharge = application.getIn([
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
    const UserRes = commissionFlag
      ? application.getIn(['commission', 'users']) &&
        application.getIn(['commission', 'users']).toJS()
      : application.get('kpiUsers') && application.get('kpiUsers').toJS();
    this.state = {
      errorMessage: Immutable.Map(),
      note:
        application.getIn(['offerAccept', 'note']) ||
        application.getIn(['commission', 'note']) ||
        '',
      onboardDate: IpgOfferBaseInfo
        ? IpgOfferBaseInfo.get('onboardDate')
        : null,
      warrantyEndDate: IpgOfferBaseInfo
        ? IpgOfferBaseInfo.get('warrantyEndDate')
        : null,
      currency: IpgOfferBaseInfo
        ? IpgOfferBaseInfo.get('currency')
        : AgreedPayRate
        ? AgreedPayRate.get('currency')
        : null,
      rateUnitType: IpgOfferBaseInfo
        ? IpgOfferBaseInfo.get('rateUnitType')
        : AgreedPayRate
        ? AgreedPayRate.get('rateUnitType')
        : null,
      amount: applicationFTEFee ? applicationFTEFee.get('amount') : null,
      totalAmount:
        applicationFTEFee && applicationSalary && IpgOfferBaseInfo
          ? this.getFTETotalAmount(
              applicationFTEFee,
              applicationSalary.toJS(),
              IpgOfferBaseInfo.get('rateUnitType')
            )
          : null, //FTE的收费信息的可收费账单金额
      totalBillAmount: IpgContractFeeCharge //Contract的收费信息的GM
        ? IpgContractFeeCharge.get('gm')
        : null,
      taxBurdenRate: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('taxBurdenRate').toJS()
        : null,
      mspRate: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('mspRate').toJS()
        : null,
      immigrationCost: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('immigrationCost').toJS()
        : null,
      extraCost: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('extraCost')
        : null,
      estimatedWorkingHourPerWeek: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('estimatedWorkingHourPerWeek')
        : 40,
      finalBillRate: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('finalBillRate')
        : null,
      finalPayRate: IpgContractFeeCharge
        ? IpgContractFeeCharge.get('finalPayRate')
        : AgreedPayRate
        ? AgreedPayRate.get('agreedPayRate')
        : null,
      freeList: Feelist ? Feelist.toJS() : null,
      userCurrency: userCurrency && userCurrency.get('currency'),
      userList: UserRes,
      salaryList: applicationSalary
        ? applicationSalary.toJS()
        : [{ salaryType: 'BASE_SALARY', amount: 0, needCharge: true }],
      applicationCommissions: [],
      owner: [],
      pageSectionArr: [],
      feeType: applicationFTEFee
        ? applicationFTEFee.get('feeType')
        : 'PERCENTAGE',
      user:
        application.getIn(['submitToClient', 'kpiUsers']) &&
        application.getIn(['submitToClient', 'kpiUsers']).toJS(),
      checkingDuplication: false,
      versionsFlag: versionsFlag,
      expenseRatio: Feelist && Feelist.get('rate') * 100,
      feeChargeAmount: Feelist && Feelist.get('amount'),
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
    console.log(application.get('talentRecruitmentProcessNodes').toJS());
    //ipgFlag = true 为通用版本
    let ipgFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    // 获取当前流程页面配置section
    getApplicationPageSection(
      ipgFlag ? 'COMMISSION' : 'OFFER_ACCEPT',
      application.get('jobType')
    ).then(({ response }) => {
      this.setState({
        pageSectionArr: this.filterArrItem(response),
      });
    });

    // 获取税率
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

  static validateForm = (
    basicForm,
    commissions,
    pageSectionArr,
    userList,
    hasOwner
  ) => {
    let errorMessage = Immutable.Map();

    if (commissions) {
      const am = commissions.find((c) => c.userRole === USER_TYPES.AM);
      if (!am) {
        errorMessage = errorMessage.set('commissions', '客户经理不能为空');
      }

      const commissionWithoutDuplicates = [
        ...new Set(commissions.map((c) => `${c.userRole}-${c.userId}`)),
      ];
      if (commissions.length > commissionWithoutDuplicates.length) {
        errorMessage = errorMessage.set('commissions', '用户角色不能重复');
      }

      const sum = commissions.reduce((s, c) => {
        return s + (Number(c.percentage) || 0);
      }, 0);

      if (sum + hasOwner * 10 !== 100) {
        errorMessage = errorMessage.set('commissions', '用户分配比例错误');
      }
      if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
        errorMessage = errorMessage.set(
          'commissions',
          '每一项分配比例应该大于0'
        );
      }
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
      basicForm.estimatedWorkingHourPerWeek &&
      !basicForm.estimatedWorkingHourPerWeek.value
    ) {
      errorMessage = errorMessage.set(
        'estimatedWorkingHourPerWeek',
        '工作时间不能为空'
      );
    }
    if (
      basicForm.gm &&
      basicForm.gm.value &&
      basicForm.gm.value.includes('-')
    ) {
      errorMessage = errorMessage.set('gm', 'GM不能小于0');
    }
    if (basicForm.amount && !Number(basicForm.amount.value)) {
      errorMessage = errorMessage.set('amount', '费用不能为空');
    }
    if (basicForm.totalAmount && !Number(basicForm.totalAmount.value)) {
      errorMessage = errorMessage.set('amount', '费用不能为空');
    }
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
    console.log(userList);
    if (pageSectionArr.includes('DEFAULT_COMMISSION_USER')) {
      const sum = userList.reduce((s, c) => {
        return s + (Number(c.percentage) || 0);
      }, 0);

      if (sum !== 100) {
        errorMessage = errorMessage.set('commissionsUser', '用户分配比例错误');
      }
      if (userList.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
        errorMessage = errorMessage.set(
          'commissionsUser',
          '每一项分配比例应该大于0'
        );
      }
      if (userList.every((x) => x.userId) === false) {
        errorMessage = errorMessage.set('commissionsUser', '参与者不能为空');
      }
    }
    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleSubmitResult = (e) => {
    e.preventDefault();
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
      userCurrency,
      versionsFlag,
    } = this.state;
    const { application } = this.props;
    const offerAccept = e.target;
    if (pageSectionArr.length === 0) {
      return;
    }
    // 分配比例校验
    let errorMessage;
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      const owner = this.$ref.state.owner.filter((c) => !!c.userId);
      errorMessage = ApplicationResultForm.validateForm(
        offerAccept,
        filteredApplicationCommissions,
        pageSectionArr,
        userList,
        owner ? owner.length > 0 : null
      );
    } else {
      errorMessage = ApplicationResultForm.validateForm(
        offerAccept,
        null,
        pageSectionArr,
        userList,
        null
      );
    }
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    // 清空提示信息
    this.setState({
      errorMessage: Immutable.Map(),
    });
    const offerAcceptForm = {
      talentRecruitmentProcessId: application.getIn([
        'offer',
        'talentRecruitmentProcessId',
      ]),
      note: offerAccept.clientNote.value,
    };
    if (pageSectionArr.includes('IPG_OFFER_INFO')) {
      offerAcceptForm.ipgOfferBaseInfo = {
        onboardDate: moment(onboardDate).format('YYYY-MM-DD'),
        warrantyEndDate: moment(warrantyEndDate).format('YYYY-MM-DD'),
        currency,
        rateUnitType,
      };
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
      offerAcceptForm.salaryPackages = filteredApplicationSalary;
    }
    if (pageSectionArr.includes('IPG_FTE_FEE_CHARGE')) {
      offerAcceptForm.ipgOfferAcceptFteFeeCharge = {
        feeType,
        amount,
      };
    }
    if (pageSectionArr.includes('IPG_CONTRACT_FEE_CHARGE')) {
      offerAcceptForm.ipgOfferAcceptContractFeeCharge = {
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
      offerAcceptForm.feeCharge = freeList;
    }
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      offerAcceptForm.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (pageSectionArr.includes('DEFAULT_COMMISSION_USER')) {
      userList.forEach((x) => Object.assign(x, { currency: userCurrency }));
      userList.forEach((x) => delete x.user);
      offerAcceptForm.users = userList;
    }
    console.log(offerAcceptForm);
    this.setState({
      checkingDuplication: true,
    });
    this.props.onSubmit(true);
    this.props
      .dispatch(
        newApplicationSubmitToOfferAccept(offerAcceptForm, versionsFlag)
      )
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        // if (status !== oldApplication.get('status')) {
        //   dispatch(
        //     updateDashboardApplStatus(newApplication.id, newApplication.status)
        //   );
        this.props.dispatch({ type: 'UPDATE_DB_DATA' });
        // }
        this.setState({ checkingDuplication: false });
        this.props.onSubmit(false);
        this.props.onSubmitToPerformance(e);
      })
      .catch((err) => {
        this.setState({ checkingDuplication: false });
        this.props.onSubmit(false);
        this.props.dispatch(showErrorMessage(err));
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

  renderFreeCommission = (commission) => {
    const { errorMessage, freeList } = this.state;
    const index = freeList.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        {/* 1.薪资类型 */}
        <div className="small-6 columns">
          <FormReactSelectContainer
            label={index < 1 ? '类型' : null}
            isRequired={index < 1 && true}
          >
            <Select
              value={commission.feeChargeType}
              simpleValue
              searchable={false}
              options={chargeType}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              onChange={(feeChargeType) => {
                commission.feeChargeType =
                  feeChargeType || commission.feeChargeType;
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
              label={index < 1 ? '收费金额' : null}
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
            {/* <FormInput
              label={index < 1 ? <>&nbsp;</> : null}
              name="commissions.fee"
              value={commission.amount || ''}
              onChange={(e) => {
                commission.amount = e.target.value;
                this.setState({
                  freeList: freeList.slice(),
                });
              }}
              type="number"
              min={0}
              errorMessage={
                commission.userId && errorMessage.get('commissionPct') && true
              }
            /> */}
            <FormReactSelectContainer
              label={<>&nbsp;</>}
              errorMessage={errorMessage.get('feeChargeTypeValue')}
            >
              <NumberFormat
                thousandSeparator
                value={commission.amount || ''}
                placeholder={'请输入金额'}
                onValueChange={(values) => {
                  commission.amount = values.value;
                  this.setState({
                    freeList: freeList.slice(),
                  });
                }}
                allowNegative={false}
                onBlur={() => this.removeErrorMessage('feeChargeTypeValue')}
              />
            </FormReactSelectContainer>
          </div>
        </div>

        {freeList.length <= 1 ? null : (
          <div className="small-1 columns horizontal-layout align-self-top">
            {/* 删除 */}
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

  handleUser = (user) => {
    this.setState({
      user,
    });
  };

  renderUserCommission = (commission) => {
    const { errorMessage, userList, user, userCurrency, feeChargeAmount } =
      this.state;
    const index = userList.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        {/* 1.参与者 */}
        <div className="small-4 columns">
          <FormReactSelectContainer
            label={index < 1 ? '参与者' : null}
            isRequired={index < 1 && true}
          >
            {/* <Select
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
            /> */}
          </FormReactSelectContainer>
          <UserOptionSte
            onBlur={() => this.removeErrorMessage('commissionsUser')}
            handleUser={(val) => {
              commission.userId = val.id;
              this.setState({
                userList: userList.slice(),
              });
            }}
            list={userList}
            value={commission.user}
          />
        </div>

        <div className="small-3 columns">
          {/* <FormInput
            label={index < 1 ? '比例' : null}
            isRequired={index < 1 && true}
            value={commission.percentage}
            onChange={(percentage) => {
              commission.percentage = percentage.target.value;
              this.setState({
                userList: userList.slice(),
              });
            }}
          /> */}
          <FormReactSelectContainer
            label={index < 1 ? '比例' : null}
            isRequired={index < 1 && true}
          >
            <NumberFormat
              thousandSeparator
              value={commission.percentage}
              onValueChange={(values) => {
                commission.percentage = Number(values.value);
                commission.amount = Number(
                  ((values.value / 100) * feeChargeAmount).toFixed(2)
                );
                // this.setState({
                //   userList: userList.slice(),
                // });
              }}
              onBlur={() => this.removeErrorMessage('commissionsUser')}
              allowNegative={false}
              // onBlur={() => this.removeErrorMessage('amount')}
              isAllowed={this.withValueCap}
            />
          </FormReactSelectContainer>
        </div>

        <div className="small-5 row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={index < 1 ? '收费金额' : null}
              isRequired={index < 1 && true}
            >
              <Select
                labelKey={'label3'}
                clearable={false}
                disabled
                options={currencyOptions}
                value={userCurrency}
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
              label={index < 1 ? '业绩' : null}
              value={commission.amount || ''}
              disabled
              isRequired={index < 1 && true}
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
              {/* 删除 */}
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
    const { feeType } = this.state;
    this.setState({ [key]: values.value }, () => {
      this._computeFullTimeGM();
    });
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
      taxBurdenRateOpts,
      mspRateOpts,
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
      totalAmount,
      user,
      expenseRatio,
      feeChargeAmount,
    } = this.state;
    if (pageSectionArr.length === 0) {
      return <Loading />;
    }
    return (
      <form onSubmit={this.handleSubmitResult} id="newApplicationResultForm">
        <BasicInfoSection job={job} candidate={candidate} />

        {pageSectionArr.includes('IPG_OFFER_INFO') ? (
          <>
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
                    onBlur={() => this.removeErrorMessage('onboardDate')}
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
                  label={
                    job.get('type') === 'FULL_TIME' ? '试用期结束' : '结束日期'
                  }
                  isRequired={true}
                  errorMessage={errorMessage.get('warrantyEndDate')}
                >
                  <DatePicker
                    dropdownMode={'scroll'}
                    minDate={onboardDate && moment(onboardDate)}
                    selected={warrantyEndDate ? moment(warrantyEndDate) : null}
                    onChange={this.handleDateChange('warrantyEndDate')}
                    onBlur={() => this.removeErrorMessage('warrantyEndDate')}
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
                    onBlur={() => this.removeErrorMessage('currency')}
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
                    onBlur={() => this.removeErrorMessage('rateUnitType')}
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
            key={'offerAcceptSalary'}
            currency={currency}
            onRef={(ref) => {
              this.$refSalary = ref;
            }}
            salaryList={this.state.salaryList}
            _computeFullTimeGM={this._computeFullTimeGM}
          />
        ) : null}

        {pageSectionArr.includes('IPG_FTE_FEE_CHARGE') ? (
          <>
            <FormTitle title={'收费信息'} />
            <div className="row small-12">
              <div className="small-6 row expanded">
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={'费用类型'}
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
                  <input type="hidden" name="feeType" value={feeType || ''} />
                </div>
                <div className="small-6 columns">
                  <FormReactSelectContainer label={<>&nbsp;</>}>
                    <NumberFormat
                      thousandSeparator
                      value={amount}
                      onValueChange={this.handleFTENumberChange('amount')}
                      allowNegative={false}
                      onBlur={() => this.removeErrorMessage('amount')}
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
                  label={'可收费账单金额'}
                  errorMessage={t(errorMessage.get('amount'))}
                  isRequired={true}
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
                    allowNegative={false}
                    onBlur={() => this.removeErrorMessage('finalBillRate')}
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
                    allowNegative={false}
                    onBlur={() => this.removeErrorMessage('finalPayRate')}
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
                    onBlur={() => this.removeErrorMessage('taxBurdenRate')}
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
                    onBlur={() => this.removeErrorMessage('mspRate')}
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
                    onBlur={() => this.removeErrorMessage('immigrationCost')}
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
                    placeholder={'请输入金额'}
                    onValueChange={this.handleNumberChange('extraCost')}
                    allowNegative={false}
                    onBlur={() => this.removeErrorMessage('extraCost')}
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
                  onBlur={() =>
                    this.removeErrorMessage('estimatedWorkingHourPerWeek')
                  }
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
                  onBlur={() => this.removeErrorMessage('gm')}
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
              <div>{'收费信息'}</div>
              {/* <div
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
                {'+ 添加'}
              </div> */}
            </div>
            <div className="row expanded">
              {/* 1.薪资类型 */}
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'费用比率'}
                  isRequired={true}
                  errorMessage={errorMessage.get('expenseRatio')}
                >
                  <NumberFormat
                    thousandSeparator
                    value={expenseRatio}
                    onValueChange={(values) => {
                      this.setState({
                        expenseRatio: values.value,
                      });
                    }}
                    disabled={true}
                    allowNegative={false}
                    onBlur={() => this.removeErrorMessage('expenseRatio')}
                    isAllowed={this.withValueCap}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="expenseRatio"
                  value={expenseRatio || ''}
                />
              </div>

              <div className={'small-6 row expanded'}>
                <div className="columns">
                  <FormReactSelectContainer
                    label={'可收费账单金额'}
                    isRequired={true}
                    errorMessage={errorMessage.get('feeChargeTypeValue')}
                  >
                    <NumberFormat
                      thousandSeparator
                      value={feeChargeAmount || ''}
                      placeholder={'请输入金额'}
                      // onValueChange={(values) => {
                      //   commission.amount = values.value;
                      //   this.setState({
                      //     freeList: freeList.slice(),
                      //   });
                      // }}
                      disabled={true}
                      allowNegative={false}
                      onBlur={() =>
                        this.removeErrorMessage('feeChargeTypeValue')
                      }
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="feeChargeTypeValue"
                    value={totalAmount || ''}
                  />
                </div>
              </div>
            </div>
            {/* {freeList.map((commission) => {
              return this.renderFreeCommission(commission);
            })} */}
          </>
        ) : null}

        {pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
          <>
            <CommisionForm
              key={'SubmitToOfferAccept'}
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
              <div>{'业绩分配'}</div>
              <div
                style={{ color: '#1890ff', fontWeight: 300, cursor: 'pointer' }}
                onClick={() => {
                  userList.splice(userList.length + 1, 0, {
                    userId: null,
                    percentage: null,
                    currency: null,
                    amount: null,
                  });
                  this.setState({
                    userList: userList.slice(),
                  });
                }}
              >
                {'+ 添加'}
              </div>
            </div>
            {userList.map((commission) => {
              return this.renderUserCommission(commission);
            })}
            {errorMessage.get('commissionsUser') && (
              <div className="columns" style={{ marginTop: 4 }}>
                <div className="foundation">
                  <span className="form-error is-visible">
                    {errorMessage.get('commissionsUser')}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : null}

        {pageSectionArr.length ? (
          <div className="row expanded small-12">
            <div className="small-12 columns">
              <FormTextArea
                errorMessage={errorMessage.get('note')}
                onFocus={() => this.removeErrorMessage('note')}
                isRequired={
                  pageSectionArr.includes('IPG_NOTE_REQUIRED') ? true : false
                }
                label={'备注'}
                name="clientNote"
                defaultValue={note || ''}
                rows="2"
                maxLength={100}
              />
            </div>
          </div>
        ) : null}

        <Dialog open={this.state.checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Submiting To OfferAccept'}</Typography>
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {};
}

export default connect(mapStoreStateToProps)(ApplicationResultForm);
