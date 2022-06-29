import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import DatePicker from 'react-datepicker-4';
import FormTextArea from '../../particial/FormTextArea';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import SendEmail from './sendEmailToClient';
import FormInput from '../../particial/FormInput';
import UserOption from '../component/userOption';
import {
  currency as currencyOptions,
  USER_TYPES,
  payRateUnitTypes,
  userTypeForCommission as userTypeOptions,
} from '../../../constants/formOptions';
import { newApplicationSubmitToClient } from '../../../actions/applicationActions';
import FormTitle from '../component/formTitle';
import {
  getApplicationPageSection,
  updateDashboardApplStatus,
} from '../../../../apn-sdk/newApplication';
import { getUserOpiton } from '../../../../apn-sdk/user';
import { showErrorMessage } from '../../../actions';
import moment from 'moment-timezone';
import CommisionForm from '../component/CommisionForm';
import Loading from '../../particial/Loading';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const styles = {
  rootForm: {
    '& .react-datepicker-popper': {
      zIndex: 10,
    },
  },
  textfield: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > div': {
      width: '100%',
    },
  },

  inputWrapper: {
    borderRadius: 0,
    paddingLeft: 8,
    border: `1px solid #cacaca`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    '&.Mui-focused': {
      borderColor: `#8a8a8a`,
      boxShadow: `0 0 5px #cacaca`,
      transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    },
  },
};

class ApplicationClientForm extends React.Component {
  constructor(props) {
    super(props);
    const { application } = this.props;
    //versionsFlag = true 为通用版本
    const versionsFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    const AgreedPayRate = application.get('agreedPayRate');
    // let str = moment(application.getIn(['submitToClient', 'submitTime']));
    // console.log(str.utc().format('YYYY-MM-DD HH:mm:ss'));
    this.state = {
      note: application.getIn(['submitToClient', 'note']) || '',
      submitTime: application.getIn(['submitToClient', 'submitTime'])
        ? new Date(
            moment(application.getIn(['submitToClient', 'submitTime']))
              .utc()
              .format('YYYY-MM-DD HH:mm:ss')
          )
        : null,
      kpiUser: null,
      errorMessage: Immutable.Map(),
      currency: AgreedPayRate ? AgreedPayRate.get('currency') : null,
      rateUnitType: AgreedPayRate ? AgreedPayRate.get('rateUnitType') : null,
      agreedPayRate: AgreedPayRate ? AgreedPayRate.get('agreedPayRate') : '',
      uploading: false,

      fetching: true,
      applicationCommissions: [],
      owner: [],
      userOption: [],
      user: application.get('kpiUsers') && application.get('kpiUsers').toJS(),
      submitUser: null,
      canEdit: true,
      loadingSourcer: false,
      pageSectionArr: [],
      checkingDuplication: false,
      id: application.getIn(['submitToClient', 'id']) || null,
    };
  }

  componentDidMount() {
    const { dispatch, application } = this.props;
    // 获取当前流程页面配置section
    getApplicationPageSection(
      'SUBMIT_TO_CLIENT',
      application.get('jobType')
    ).then(({ response }) => {
      this.setState({
        pageSectionArr: this.filterArrItem(response),
      });
    });
  }

  filterArrItem = (arr) => {
    let newArr = [];
    arr.map((item) => {
      newArr.push(item.nodePageSection);
    });
    return newArr;
  };

  handleDateChange = (key) => (value) => {
    this.setState({
      [key]: value ? value.format('YYYY-MM-DDTHH:mm:[00][Z]') : null,
    });
  };

  handleUser = (user) => {
    this.setState({
      user,
    });
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  static validateForm = (basicForm, commissions, pageSectionArr, hasOwner) => {
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
      if (!hasOwner) {
        if (sum + 1 * 10 !== 100) {
          errorMessage = errorMessage.set('commissions', '用户分配比例错误');
        }
      } else {
        if (sum + hasOwner * 10 !== 100) {
          errorMessage = errorMessage.set('commissions', '用户分配比例错误');
        }
      }

      if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
        errorMessage = errorMessage.set(
          'commissions',
          '每一项分配比例应该大于0'
        );
      }
    }
    if (basicForm.clientNote && basicForm.clientNote.value.length > 5000) {
      errorMessage = errorMessage.set('note', '备注不能大于5000长度');
    }
    // 普通版note 不验证非空
    if (pageSectionArr.includes('IPG_NOTE_REQUIRED')) {
      if (basicForm.clientNote && !basicForm.clientNote.value) {
        errorMessage = errorMessage.set('note', '备注不能为空');
      }
    }

    if (basicForm.submitTime && !basicForm.submitTime.value) {
      errorMessage = errorMessage.set('submitTime', '推荐时间不能为空');
    }

    if (basicForm.currency && basicForm.rateUnitType) {
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
      } else if (basicForm.kpiUser && !basicForm.kpiUser.value) {
        errorMessage = errorMessage.set('kpiUser', '参与者不能为空');
      }
    }

    return errorMessage.size > 0 && errorMessage;
  };

  handleSubmitClient = (e) => {
    e.preventDefault();
    const { application } = this.props;
    const {
      currency,
      rateUnitType,
      submitTime,
      pageSectionArr,
      user,
      submitUser,
      id,
      versionsFlag,
    } = this.state;
    const clientForm = e.target;
    if (pageSectionArr.length === 0) {
      return;
    }

    // 分配比例校验
    let errorMessage;
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      // 过滤applicationCommissions
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      const owner = this.$ref.state.owner.filter((c) => !!c.userId);
      console.log('sda1', owner);
      errorMessage = ApplicationClientForm.validateForm(
        clientForm,
        filteredApplicationCommissions,
        pageSectionArr,
        owner.length > 0
      );
    } else {
      errorMessage = ApplicationClientForm.validateForm(
        clientForm,
        null,
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
    const client = {
      talentRecruitmentProcessId: application.getIn([
        'submitToJob',
        'talentRecruitmentProcessId',
      ]),
      submitTime: moment(submitTime).format('YYYY-MM-DDTHH:mm:[00][Z]'),
      // submitTime: submitTime,
      note: clientForm.clientNote.value,
    };
    if (pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE')) {
      if (
        clientForm.agreedPayRate.value &&
        clientForm.agreedPayRate.value.trim()
      ) {
        client.agreedPayRate = {
          currency,
          rateUnitType,
          agreedPayRate: clientForm.agreedPayRate.value,
        };
      }
    }
    if (pageSectionArr.includes('DEFAULT_KPI_USERS')) {
      let userList = [];
      user.map((x) => {
        userList.push({
          userId: x.userId,
        });
      });
      client.kpiUsers = userList;
    }
    if (pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE')) {
      const filteredApplicationCommissions =
        this.$ref.state.applicationCommissions.filter((c) => !!c.userId);
      client.ipgKpiUsers = filteredApplicationCommissions;
    }
    if (id) {
      client.id = id;
    }
    console.log(client);
    // this.props.onSubmit(true);
    this.setState({
      checkingDuplication: true,
    });
    this.props
      .dispatch(newApplicationSubmitToClient(client))
      .then((newApplication) => {
        // dispatch(
        //   updateDashboardApplStatus(newApplication.id, newApplication.status)
        // );
        this.props.dispatch({ type: 'UPDATE_DB_DATA' });
        this.setState({
          checkingDuplication: false,
        });
        this.props.onSubmitToClient(e);
      })
      .catch((err) => {
        this.setState({ checkingDuplication: false });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  handleDropDownChange = (key) => (value) => {
    this.setState({ [key]: value });
  };

  handleNumberChange = (key) => (values) => {
    this.setState({ [key]: values.value });
  };

  render() {
    const { t, classes, application } = this.props;
    const {
      note,
      errorMessage,
      submitTime,
      currency,
      kpiUser,
      rateUnitType,
      applicationCommissions,
      pageSectionArr,
      agreedPayRate,
      submitUser,
      user,
    } = this.state;
    if (pageSectionArr.length === 0) {
      return <Loading />;
    }
    return (
      <form
        onSubmit={this.handleSubmitClient}
        id="newApplicationClientForm"
        className={classes.rootForm}
      >
        <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={'推荐时间'}
              isRequired={true}
              errorMessage={errorMessage.get('submitTime')}
            >
              <DatePicker
                selected={submitTime}
                onChange={(submitTime) => {
                  this.setState({ submitTime });
                }}
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy hh:mm aa"
                showTimeInput
                onBlur={() => this.removeErrorMessage('submitTime')}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="submitTime" value={submitTime || ''} />
          </div>

          {/* 普通版本定制section */}
          {pageSectionArr.includes('DEFAULT_KPI_USERS') ? (
            <>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'参与者'}
                  isRequired={true}
                ></FormReactSelectContainer>
                {/* <Select labelKey={'label2'} clearable={false} simpleValue /> */}
                <UserOption
                  errorMessage={errorMessage.get('kpiUser')}
                  handleUser={this.handleUser}
                  value={user}
                />
                <input type="hidden" name="kpiUser" value={user || ''} />
              </div>
            </>
          ) : null}
        </div>

        {/* IPG定制setion */}
        {pageSectionArr.includes('IPG_KPI_USER_WITH_USER_ROLE') ? (
          <>
            <CommisionForm
              key={'SubmitToClient'}
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

        {pageSectionArr.includes('IPG_CONTRACT_AGREED_PAY_RATE') ? (
          <>
            <FormTitle title={'约定薪资信息'} />
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
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={'工资金额'}
                  errorMessage={errorMessage.get('agreedPayRate')}
                >
                  <NumberFormat
                    thousandSeparator
                    prefix={currencyLabels[currency]}
                    value={agreedPayRate}
                    onValueChange={this.handleNumberChange('agreedPayRate')}
                    onBlur={() => this.removeErrorMessage('agreedPayRate')}
                    allowNegative={false}
                  />
                </FormReactSelectContainer>
                <input
                  name="agreedPayRate"
                  value={agreedPayRate}
                  type="hidden"
                />
              </div>
            </div>
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

        <div className="row expanded small-12" style={{ marginTop: 10 }}>
          <div className="small-12 columns">
            <SendEmail t={t} />
          </div>
        </div>
        <Dialog open={this.state.checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Submiting To Client'}</Typography>
          </DialogContent>
        </Dialog>
      </form>
    );
  }
}

const mapStoreStateToProps = (state, { application }) => {
  // const clientContactId = invoice.get('clientContactId');
  return {};
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(ApplicationClientForm)
);
