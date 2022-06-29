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
import Add from '@material-ui/icons/Add';

import {
  mapOfferLetterParams,
  swichRate,
  swichSalary,
} from '../../../../utils';
import {
  currency as currencyOptions,
  payRateUnitTypes,
  chargeType,
  ApplicationOfferSalary,
  SalaryStructure,
  ApplicationOfferFree,
  USER_TYPES,
} from '../../../constants/formOptions';
import SalaryFormGen from '../component/SalaryFormGen';
import FormTitle from '../component/formTitle';
import UserOption from '../component/userOption';
import { getApplicationPageSection } from '../../../../apn-sdk/newApplication';
import { newApplicationSubmitToOffer } from '../../../actions/applicationActions';
import { showErrorMessage } from '../../../actions';
import moment from 'moment-timezone';
import EditCommisionForm from '../component/EditCommisionForm';
import Loading from '../../particial/Loading';
import NumberFormat from 'react-number-format';
import lodash, { values } from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});
class ApplicationOfferForm extends React.Component {
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
    const CurrencyGen = application.getIn(['offer', 'salary']);
    const salaryList = application.getIn(['offer', 'salaryPackages']);
    const FreeList = application.getIn(['offer', 'feeCharge']);
    this.state = {
      errorMessage: Immutable.Map(),
      note: application.getIn(['offer', 'note']) || '',
      signedDate: application.getIn(['offer', 'signedDate'])
        ? moment(application.getIn(['offer', 'signedDate']))
        : null,
      estimateOnboardDate: application.getIn(['offer', 'estimateOnboardDate'])
        ? moment(application.getIn(['offer', 'estimateOnboardDate']))
        : null,
      kpiUsers: null,
      commonSalaryList: salaryList
        ? salaryList.toJS()
        : [
            { salaryType: 'BASE_SALARY', amount: '', needCharge: true },
            { salaryType: 'RETENTION_BONUS', amount: '', needCharge: true },
          ],
      expenseRatio: FreeList && FreeList.get('rate') * 100,
      totalAmount: FreeList && FreeList.get('amount'),
      currency: AgreedPayRate ? AgreedPayRate.get('currency') : '',
      rateUnitType: AgreedPayRate ? AgreedPayRate.get('rateUnitType') : '',
      agreedPayRate: AgreedPayRate ? AgreedPayRate.get('agreedPayRate') : '',
      pageSectionArr: [],
      user: application.get('kpiUsers') && application.get('kpiUsers').toJS(),
      //通用版
      currencyGen: CurrencyGen ? CurrencyGen.get('currency') : '',
      rateUnitTypeGen: CurrencyGen ? CurrencyGen.get('rateUnitType') : '',
      versionsFlag: versionsFlag,
      checkingDuplication: false,
      freeList: FreeList
        ? FreeList.toJS()
        : [{ feeChargeType: '', currency: '', amount: '' }],
    };
  }

  componentDidMount() {
    const { dispatch, application } = this.props;
    // 获取当前流程页面配置section
    getApplicationPageSection('OFFER', application.get('jobType')).then(
      ({ response }) => {
        this.setState({
          pageSectionArr: this.filterArrItem(response),
        });
      }
    );
  }

  filterArrItem = (arr) => {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item.nodePageSection);
    });
    return newArr;
  };

  _computeFullTimeGM = () => {
    const { feeType, expenseRatio, rateUnitTypeGen } = this.state;
    if (expenseRatio) {
      let TotalBillCharge = 0; //可收费总计
      let TotalFTEChargeAmount = 0; //可计费基本薪资
      let newAmount = 0; //可收费账单金额(以年为单位计算)
      this.$refSalary.state.salaryList.map((item) => {
        if (item.needCharge && item.salaryType) {
          TotalBillCharge = TotalBillCharge + Number(item.amount);
        }
        if (item.salaryType === 'BASE_SALARY') {
          TotalFTEChargeAmount = TotalFTEChargeAmount + Number(item.amount);
        }
      });
      const annualSalary = swichSalary(TotalFTEChargeAmount, rateUnitTypeGen);
      // 可计费基本薪资和年份挂钩
      const totalBillableAmount =
        Number(annualSalary) +
        Number(TotalBillCharge) -
        Number(TotalFTEChargeAmount);

      newAmount = totalBillableAmount * (expenseRatio / 100);

      this.setState({
        totalAmount: newAmount.toFixed(2),
      });
    } else {
      this.setState({
        totalAmount: 0,
      });
    }
  };

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
    // if (applicationFTEFee.get('feeType') === 'PERCENTAGE') {
    newAmount = (
      totalBillableAmount *
      (applicationFTEFee.get('amount') / 100)
    ).toFixed(2);
    // } else {
    //   newAmount = applicationFTEFee.get('amount');
    // }
    return newAmount;
  };

  handleFTENumberChange = (key) => (values) => {
    const { feeType } = this.state;
    this.setState({ [key]: values.value }, () => {
      this._computeFullTimeGM();
    });
  };

  static validateForm = (
    basicForm,
    commissions,
    versionsFlag,
    commonSalaryList,
    pageSectionArr,
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

    if (basicForm.signedDate && !basicForm.signedDate.value) {
      errorMessage = errorMessage.set('signedDate', '签订日期不能为空');
    }
    if (basicForm.estimateOnboardDate && !basicForm.estimateOnboardDate.value) {
      errorMessage = errorMessage.set(
        'estimateOnboardDate',
        '预计入职日期不能为空'
      );
    }
    if (basicForm.kpiUser && !basicForm.kpiUser.value) {
      errorMessage = errorMessage.set('kpiUser', '参与者不能为空');
    }

    if (
      basicForm.currency &&
      basicForm.rateUnitType &&
      basicForm.agreedPayRate
    ) {
      if (basicForm.currency.value && !basicForm.agreedPayRate.value) {
        errorMessage = errorMessage.set('agreedPayRate', '金额不能为空');
      } else if (basicForm.currency.value && !basicForm.rateUnitType.value) {
        errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
      } else if (basicForm.agreedPayRate.value && !basicForm.currency.value) {
        errorMessage = errorMessage.set('currency', '币种不能为空');
      } else if (
        basicForm.agreedPayRate.value &&
        !basicForm.rateUnitType.value
      ) {
        errorMessage = errorMessage.set('rateUnitType', '类型不能为空');
      } else if (
        basicForm.rateUnitType.value &&
        !basicForm.agreedPayRate.value
      ) {
        errorMessage = errorMessage.set('agreedPayRate', '金额不能为空');
      } else if (basicForm.rateUnitType.value && !basicForm.currency.value) {
        errorMessage = errorMessage.set('currency', '币种不能为空');
      }
    }
    if (pageSectionArr.includes('IPG_NOTE_REQUIRED')) {
      if (basicForm.clientNote && !basicForm.clientNote.value) {
        errorMessage = errorMessage.set('note', '备注不能为空');
      }
    }
    if (basicForm.clientNote && basicForm.clientNote.value.length > 5000) {
      errorMessage = errorMessage.set('note', '备注不能大于5000长度');
    }

    // 通用版本
    if (versionsFlag) {
      if (!basicForm.currencyGen.value) {
        errorMessage = errorMessage.set('currencyGen', '币种不能为空');
      }
      if (!basicForm.rateUnitTypeGen.value) {
        errorMessage = errorMessage.set('rateUnitTypeGen', '类型不能为空');
      }
      // if (!basicForm.feeChargeType.value) {
      //   errorMessage = errorMessage.set('feeChargeType', '类型不能为空');
      // }
      // if (!basicForm.feeChargeTypeValue.value) {
      //   errorMessage = errorMessage.set('feeChargeTypeValue', '金额不能为空');
      // }
      if (!basicForm.expenseRatio.value) {
        errorMessage = errorMessage.set('expenseRatio', '费用比例不能为空');
      }
      if (basicForm.totalAmount && !Number(basicForm.totalAmount.value)) {
        errorMessage = errorMessage.set(
          'totalAmount',
          '可收费账单金额不能为空'
        );
      }

      // let arr = [];
      // let arr2 = [];
      // let salaryTypeFlag = 0;
      // let salaryTypeValueFlag = 0;
      // commonSalaryList.forEach((x) => {
      //   if (x.salaryType) {
      //     arr.push('');
      //   } else {
      //     arr.push('类型不能为空');
      //   }
      //   if (x.amount) {
      //     arr2.push('');
      //   } else {
      //     arr2.push('金额不能为空');
      //   }
      // });
      // errorMessage = errorMessage.set('salaryType', arr);
      // errorMessage = errorMessage.set('salaryTypeValue', arr2);
      // commonSalaryList.forEach((x) => {
      //   if (!x.salaryType) {
      //     salaryTypeFlag++;
      //   }
      //   if (!x.amount) {
      //     salaryTypeValueFlag++;
      //   }
      // });
      // if (salaryTypeFlag === 0) {
      //   errorMessage = errorMessage.delete('salaryType');
      // }
      // if (salaryTypeValueFlag === 0) {
      //   errorMessage = errorMessage.delete('salaryTypeValue');
      // }
    }
    return errorMessage.size > 0 && errorMessage;
  };
  handleUser = (user) => {
    this.setState({
      user,
    });
  };

  removeErrorMessage = (key) => {
    let res = null,
      imr = this.state.errorMessage;
    // 同时清除 多个ErrorMessage处理
    if (Array.isArray(key)) {
      key.forEach((x) => {
        res = imr.delete(x);
        imr = res;
      });
      this.setState({
        errorMessage: res,
      });
    } else {
      this.setState({
        errorMessage: this.state.errorMessage.delete(key),
      });
    }
  };

  removeErrorMessageSalry = (key, index) => {
    let a = this.state.errorMessage.toJS();
    if (a[key]) {
      a[key][index] = '';
    }
    this.setState({
      errorMessage: Immutable.Map(a),
    });
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
  };

  withValueCap = (inputObj) => {
    const { value } = inputObj;
    if (value <= 100) return true;
    return false;
  };

  handleSubmitOffer = (e) => {
    e.preventDefault();
    const {
      signedDate,
      estimateOnboardDate,
      freeList,
      currency,
      rateUnitType,
      commonSalaryList,
      pageSectionArr,
      user,
      currencyGen,
      rateUnitTypeGen,
      versionsFlag,
      totalAmount,
      expenseRatio,
      FeeItemizations,
    } = this.state;
    const { application } = this.props;
    const offerForm = e.target;
    if (pageSectionArr.length === 0) {
      return;
    }
    // 分配比例校验
    let errorMessage;
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      const owner = this.$ref.state.owner.filter((c) => !!c.userId);

      errorMessage = ApplicationOfferForm.validateForm(
        offerForm,
        filteredApplicationCommissions,
        versionsFlag,
        commonSalaryList,
        pageSectionArr,
        owner ? owner.length > 0 : null
      );
    } else {
      errorMessage = ApplicationOfferForm.validateForm(
        offerForm,
        null,
        versionsFlag,
        commonSalaryList,
        pageSectionArr,
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
    const offer = {
      talentRecruitmentProcessId: application.getIn([
        'submitToClient',
        'talentRecruitmentProcessId',
      ]),
      signedDate: moment(signedDate).format('YYYY-MM-DD'),
      estimateOnboardDate: moment(estimateOnboardDate).format('YYYY-MM-DD'),
      note: offerForm.clientNote.value,
    };
    if (pageSectionArr.includes('DEFAULT_KPI_USERS')) {
      let userList = [];
      user.forEach((x) => {
        userList.push({
          userId: x.userId,
        });
      });
      offer.kpiUsers = userList;
    }
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      offer.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (pageSectionArr.includes('DEFAULT_FEE_CHARGE')) {
      offer.feeCharge = { rate: expenseRatio / 100, amount: totalAmount };
    }

    if (pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE')) {
      if (
        offerForm.agreedPayRate.value &&
        offerForm.agreedPayRate.value.trim()
      ) {
        offer.agreedPayRate = {
          currency,
          rateUnitType,
          agreedPayRate: offerForm.agreedPayRate.value,
        };
      }
    }
    if (pageSectionArr.includes('DEFAULT_ALL_PACKAGE')) {
      // 过滤掉type没填并且金额没填
      const filteredApplicationSalary = this.$refSalary.state.salaryList.filter(
        (c) => {
          if (c.amount === 0 && c.salaryType) {
            return c;
          }
          return c.amount && c.salaryType;
        }
      );
      (offer.salary = {
        currency: currencyGen,
        rateUnitType: rateUnitTypeGen,
      }),
        (offer.salaryPackages = filteredApplicationSalary);
    }

    console.log(offer);
    this.setState({
      checkingDuplication: true,
    });
    this.props.onSubmit(true);
    this.props
      .dispatch(newApplicationSubmitToOffer(offer))
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
        this.props.onSubmitToOffer(e);
      })
      .catch((err) => {
        this.setState({ checkingDuplication: false });
        this.props.onSubmit(false);
        this.props.dispatch(showErrorMessage(err));
      });
  };

  renderCommonCommission = (commission) => {
    const { errorMessage, commonSalaryList } = this.state;
    const index = commonSalaryList.indexOf(commission);
    let errorMessageArr = errorMessage.get('salaryType');
    let errorMessageArrValue = errorMessage.get('salaryTypeValue');
    let SalaryOptionList = lodash.cloneDeep(SalaryStructure);
    let SalaryTypeArr = [];
    commonSalaryList &&
      commonSalaryList.map((item) => {
        SalaryTypeArr.push(item.salaryType);
      });
    SalaryOptionList.map((item) => {
      if (SalaryTypeArr.includes(item.value)) {
        item.disabled = true;
      }
    });
    return (
      <div key={index} className="row expanded">
        {/* 1.薪资类型 */}
        <div className="small-5 columns">
          <FormReactSelectContainer
            errorMessage={errorMessageArr && errorMessageArr[index]}
          >
            <Select
              value={commission.salaryType}
              simpleValue
              options={SalaryOptionList}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              onBlur={() => {
                this.removeErrorMessageSalry('salaryType', index);
              }}
              onChange={(salaryType) => {
                commission.salaryType = salaryType || commission.salaryType;
                this.setState({
                  commonSalaryList: commonSalaryList.slice(),
                });
              }}
            />
          </FormReactSelectContainer>
          <input
            type="hidden"
            name="salaryType"
            value={commission.salaryType || ''}
          />
        </div>

        {/* 2.薪资金额 */}
        <div className="small-5 columns">
          {/* <FormInput
            name="commissions.amount"
            value={commission.amount || ''}
            onChange={(e) => {
              commission.amount = e.target.value;
              this.setState({
                commonSalaryList: commonSalaryList.slice(),
              })
            }}
            onBlur={() => { this.removeErrorMessageSalry('salaryTypeValue', index) }}
            type="number"
            min={0}
            errorMessage={
              errorMessageArrValue && errorMessageArrValue[index]
            }
          /> */}
          <FormReactSelectContainer
            label
            errorMessage={errorMessageArrValue && errorMessageArrValue[index]}
          >
            <NumberFormat
              thousandSeparator
              value={commission.amount || ''}
              placeholder={'请输入金额'}
              onValueChange={(values) => {
                commission.amount = values.value;
                this.setState({
                  commonSalaryList: commonSalaryList.slice(),
                });
              }}
              allowNegative={false}
              onBlur={() => {
                this.removeErrorMessageSalry('salaryTypeValue', index);
              }}
            />
          </FormReactSelectContainer>
          <input
            type="hidden"
            name="salaryTypeValue"
            value={commission.amount || ''}
          />
        </div>

        {/* 4.删除/新增一项 */}
        <div className="small-2 columns horizontal-layout align-self-top">
          {/* 删除 */}
          <IconButton
            size="small"
            disabled={commonSalaryList.length <= 1}
            onClick={() => {
              this.setState({
                commonSalaryList: commonSalaryList.filter(
                  (c) => c !== commission
                ),
              });
            }}
          >
            <Delete />
          </IconButton>

          {/* 新增 */}

          <IconButton
            size="small"
            disabled={
              commonSalaryList.length >= SalaryStructure.length ? true : false
            }
            onClick={() => {
              commonSalaryList.splice(index + 1, 0, {
                salaryType: null,
                amount: '',
              });
              this.setState({
                commonSalaryList: commonSalaryList.slice(),
              });
            }}
          >
            <Add />
          </IconButton>
        </div>
      </div>
    );
  };

  renderFreeCommission = (commission) => {
    const { errorMessage, freeList, currencyGen, totalAmount, amount } =
      this.state;
    const index = freeList.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        {/* 1.薪资类型 */}
        <div className="small-6 columns">
          <FormReactSelectContainer
            label={index < 1 ? '费用比率' : null}
            isRequired={index < 1 && true}
            errorMessage={errorMessage.get('amount')}
          >
            {/* <Select
              value={commission.feeChargeType}
              simpleValue
              options={chargeType}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              onBlur={() => this.removeErrorMessage('feeChargeType')}
              clearable={false}
              onChange={(feeChargeType) => {
                commission.feeChargeType =
                  feeChargeType || commission.feeChargeType;
                this.setState({
                  freeList: freeList.slice(),
                });
              }}
            /> */}
            <NumberFormat
              thousandSeparator
              value={amount}
              onValueChange={this.handleFTENumberChange('amount')}
              allowNegative={false}
              onBlur={() => this.removeErrorMessage('amount')}
              isAllowed={this.withValueCap}
            />
          </FormReactSelectContainer>
          <input type="hidden" name="amount" value={amount || ''} />
        </div>

        <div
          className={
            freeList.length <= 1
              ? 'small-6 row expanded'
              : 'small-5 row expanded'
          }
        >
          {/* <div className="small-6 columns">
            <FormReactSelectContainer
              label={index < 1 ? '可收费账单金额' : null}
              isRequired={index < 1 && true}
              errorMessage={errorMessage.get('currency')}
            >
              <Select
                labelKey={'label3'}
                clearable={false}
                simpleValue
                disabled
                options={currencyOptions}
                value={currencyGen}
                onChange={(currency) => {
                  commission.currency = currency || commission.currency;
                  this.setState({
                    freeList: freeList.slice(),
                  });
                }}
              />
            </FormReactSelectContainer>
          </div> */}
          <div className="columns">
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
              onBlur={() => this.removeErrorMessage('feeChargeTypeValue')}
              type="number"
              min={0}
             
            /> */}
            <FormReactSelectContainer
              label={index < 1 ? '可收费账单金额' : null}
              errorMessage={errorMessage.get('feeChargeTypeValue')}
            >
              <NumberFormat
                thousandSeparator
                value={totalAmount || ''}
                placeholder={'请输入金额'}
                // onValueChange={(values) => {
                //   commission.amount = values.value;
                //   this.setState({
                //     freeList: freeList.slice(),
                //   });
                // }}
                disabled={true}
                allowNegative={false}
                onBlur={() => this.removeErrorMessage('feeChargeTypeValue')}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="feeChargeTypeValue"
              value={commission.amount || ''}
            />
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

  handleDropDownChange = (key) => (value) => {
    this.setState({ [key]: value }, this._computeFullTimeGM);
  };

  render() {
    const { t, application } = this.props;
    const {
      note,
      errorMessage,
      currency,
      rateUnitType,
      signedDate,
      estimateOnboardDate,
      kpiUsers,
      commonSalaryList,
      freeList,
      pageSectionArr,
      user,
      currencyGen,
      rateUnitTypeGen,
      versionsFlag,
      amount,
      totalAmount,
      expenseRatio,
    } = this.state;
    if (pageSectionArr.length === 0) {
      return <Loading />;
    }
    return (
      <form onSubmit={this.handleSubmitOffer} id="newApplicationOfferForm">
        <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={'签订日期'}
              isRequired={true}
              errorMessage={errorMessage.get('signedDate')}
            >
              <DatePicker
                selected={signedDate}
                onChange={(signedDate) => this.setState({ signedDate })}
                onBlur={() => this.removeErrorMessage('signedDate')}
                showDisabledMonthNavigation
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="signedDate"
              value={signedDate ? signedDate : ''}
            />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={'预计入职时间'}
              isRequired={true}
              errorMessage={errorMessage.get('estimateOnboardDate')}
            >
              <DatePicker
                minDate={signedDate}
                selected={estimateOnboardDate}
                onChange={(estimateOnboardDate) =>
                  this.setState({ estimateOnboardDate })
                }
                onBlur={() => this.removeErrorMessage('estimateOnboardDate')}
                showDisabledMonthNavigation
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="estimateOnboardDate"
              value={estimateOnboardDate ? estimateOnboardDate : ''}
            />
          </div>
        </div>
        {pageSectionArr.includes('DEFAULT_KPI_USERS') ? (
          <div className="row expanded small-12">
            <div className="small-6 columns">
              <UserOption
                isRequired={true}
                label={'参与者'}
                errorMessage={errorMessage.get('kpiUser')}
                handleUser={this.handleUser}
                value={user}
                onBlur={() => this.removeErrorMessage('kpiUser')}
              />
              <input type="hidden" name="kpiUser" value={user || ''} />
            </div>
          </div>
        ) : null}

        {pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
          <>
            <EditCommisionForm
              key={'SubmitToOffer'}
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

        {pageSectionArr.includes('DEFAULT_NOTE_OPTIONAL') ? (
          <div className="row expanded small-12">
            <div className="small-12 columns">
              <FormTextArea
                errorMessage={errorMessage.get('note')}
                onFocus={() => this.removeErrorMessage('note')}
                isRequired={false}
                label={'备注'}
                name="clientNote"
                defaultValue={note || ''}
                rows="3"
                maxLength={100}
              />
            </div>
          </div>
        ) : null}

        {pageSectionArr.includes('DEFAULT_ALL_PACKAGE') ? (
          <FormTitle title={'薪资结构'} />
        ) : null}
        {pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
          <FormTitle title={'约定薪资信息'} />
        ) : null}
        {pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
          <div className="row expanded small-12">
            <div className="small-6 row expanded">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'币种/类型'}
                  errorMessage={errorMessage.get('currency')}
                >
                  <Select
                    labelKey={'label3'}
                    clearable={true}
                    simpleValue
                    options={currencyOptions}
                    value={currency}
                    onChange={this.handleDropDownChange('currency')}
                    onBlur={() => this.removeErrorMessage('currency')}
                  />
                </FormReactSelectContainer>
                <input type="hidden" name="currency" value={currency || ''} />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={<>&nbsp;</>}
                  errorMessage={errorMessage.get('rateUnitType')}
                >
                  <Select
                    labelKey={'label2'}
                    clearable={true}
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
            {pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'工资金额'}
                  errorMessage={errorMessage.get('agreedPayRate')}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={this.state.agreedPayRate}
                    onValueChange={this.handleNumberChange('agreedPayRate')}
                    onBlur={() => this.removeErrorMessage('agreedPayRate')}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  name="agreedPayRate"
                  value={this.state.agreedPayRate}
                  type="hidden"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {pageSectionArr.includes('DEFAULT_ALL_PACKAGE') ? (
          <div className="">
            <div className="small-3 row expanded">
              <div className="small-3 columns">
                <FormReactSelectContainer
                  label={'币种/类型'}
                  errorMessage={errorMessage.get('currencyGen')}
                  isRequired={true}
                >
                  <Select
                    labelKey={'label3'}
                    clearable={false}
                    simpleValue
                    options={currencyOptions}
                    value={currencyGen}
                    onChange={this.handleDropDownChange('currencyGen')}
                    onBlur={() => this.removeErrorMessage('currencyGen')}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="currencyGen"
                  value={currencyGen || ''}
                />
              </div>
              <div className="small-3 columns">
                <FormReactSelectContainer
                  label={<>&nbsp;</>}
                  errorMessage={errorMessage.get('rateUnitTypeGen')}
                >
                  <Select
                    labelKey={'label2'}
                    clearable={false}
                    simpleValue
                    options={payRateUnitTypes}
                    value={rateUnitTypeGen}
                    onChange={this.handleDropDownChange('rateUnitTypeGen')}
                    onBlur={() => this.removeErrorMessage('rateUnitTypeGen')}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="rateUnitTypeGen"
                  value={rateUnitTypeGen || ''}
                />
              </div>
            </div>
            {pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'工资金额'}
                  errorMessage={errorMessage.get('agreedPayRate')}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={this.state.agreedPayRate}
                    onValueChange={this.handleNumberChange('agreedPayRate')}
                    onBlur={() => this.removeErrorMessage('agreedPayRate')}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  name="agreedPayRate"
                  value={this.state.agreedPayRate}
                  type="hidden"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {pageSectionArr.includes('DEFAULT_ALL_PACKAGE') ? (
          <>
            <SalaryFormGen
              key={'offerAcceptSalary'}
              currency={currencyGen}
              onRef={(ref) => {
                this.$refSalary = ref;
              }}
              salaryList={this.state.commonSalaryList}
              _computeFullTimeGM={this._computeFullTimeGM}
            />
          </>
        ) : null}

        {pageSectionArr.includes('IPG_NOTE_REQUIRED') ? (
          <div className="row expanded small-12">
            <div className="small-12 columns">
              <FormTextArea
                errorMessage={errorMessage.get('note')}
                onFocus={() => this.removeErrorMessage('note')}
                isRequired={versionsFlag ? false : true}
                label={'备注'}
                name="clientNote"
                defaultValue={note || ''}
                rows="3"
                maxLength={100}
              />
            </div>
          </div>
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
                    onValueChange={this.handleFTENumberChange('expenseRatio')}
                    allowNegative={false}
                    onBlur={() => {
                      this.removeErrorMessage(['expenseRatio', 'totalAmount']);
                    }}
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
                    errorMessage={errorMessage.get('totalAmount')}
                  >
                    <NumberFormat
                      thousandSeparator
                      value={totalAmount || ''}
                      placeholder={'请输入金额'}
                      // onValueChange={(values) => {
                      //   commission.amount = values.value;
                      //   this.setState({
                      //     freeList: freeList.slice(),
                      //   });
                      // }}
                      disabled={true}
                      allowNegative={false}
                      onBlur={() => this.removeErrorMessage('totalAmount')}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="totalAmount"
                    value={totalAmount || ''}
                  />
                </div>
              </div>
            </div>
            {/* {freeList.map((commission) => {
              return this.renderFreeCommission(commission);
            })} */}
            <div
              style={{
                color: '#505050',
                fontSize: 14,
                marginTop: 10,
                marginBottom: 10,
              }}
            ></div>
          </>
        ) : null}
        <Dialog open={this.state.checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Submiting To Offer'}</Typography>
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {};
}

export default connect(mapStoreStateToProps)(ApplicationOfferForm);
