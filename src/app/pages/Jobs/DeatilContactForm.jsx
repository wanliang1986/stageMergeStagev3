import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DatePicker from 'react-datepicker';
import * as apnSDK from '../../../apn-sdk/';
import FormInput from '../../components/particial/FormInput';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import Divider from '@material-ui/core/Divider';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Switch from '@material-ui/core/Switch';
import * as FormOptions from '../../constants/formOptions';
import Select from 'react-select';
import Immutable from 'immutable';
import Location from '../../components/jobLocation';
import MyDialog from '../../components/Dialog/myDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import JobTree from '../../components/jobTree';
import JobFunctionTree from '../../components/newCandidateTree';
import InfoIcon from '@material-ui/icons/Info';
import { isNum } from '../../../utils/search';
import JobDescription from './ipgJobPosting/JobDescriptionRich4';
import { jobType } from './ipgJobPosting/data';
import { getJob } from '../../actions/jobActions';
import { showErrorMessage } from '../../../app/actions/index';
import { withTranslation } from 'react-i18next';
const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
  checkboxLabel: {
    marginLeft: -8,
    whiteSpace: 'nowrap',
  },
  font: {
    color: '#505058',
    fontSize: 14,
    marginLeft: 4,
    opacity: '0.9',
  },
  requiredSkill: {
    flex: ' 0 0 50%',
    maxWidth: '50%',
    paddingRight: '0.25rem',
    paddingLeft: '0.25rem',
    '& .Select-arrow-zone': {
      display: 'none !important',
    },
  },
  preferedSkill: {
    flex: ' 0 0 50%',
    maxWidth: '50%',
    paddingRight: '0.25rem',
    paddingLeft: '0.25rem',
    '& .Select-arrow-zone': {
      display: 'none !important',
    },
  },
  autoBox: {
    '& .MuiFormControl-fullWidth': {
      borderColor: '#cc4b37 !important',
      backgroundColor: '#faedeb !important',
      border: '1px solid #cc4b37 !important',
    },
  },

  formRrror: {
    // marginTop: '-0.5rem',
    marginBottom: '1rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#cc4b37',
    marginTop: '3px',
  },
};

const _jobType = jobType.map((opt) => {
  return {
    ...opt,
    disabled: opt.value === 'FULL_TIME' ? true : false,
  };
});
let clientLoaded = false;
class JobBasicForm extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this._getStateFromProps(props);
  }

  _getStateFromProps = (props, state = {}) => {
    console.log('debug:::', props);
    let freshExperFlag = false;
    if (props.job.get('experienceYearRange')) {
      props.job.get('experienceYearRange').toJS().lte === 0
        ? (freshExperFlag = true)
        : (freshExperFlag = false);
    }

    return {
      billMinValue: state.billRange
        ? state.billRange
        : props.job.get('billRange')
        ? props.job.get('billRange').toJS().gte
        : null,
      billMaxValue: state.billRange
        ? state.billRange
        : props.job.get('billRange')
        ? props.job.get('billRange').toJS().lte
        : null,
      minValue: state.salaryRange
        ? state.salaryRange
        : props.job.get('salaryRange')
        ? props.job.get('salaryRange').toJS().gte
        : null,
      maxValue: state.salaryRange
        ? state.salaryRange
        : props.job.get('salaryRange')
        ? props.job.get('salaryRange').toJS().lte
        : null,
      minYear: state.experienceYearRange
        ? state.experienceYearRange
        : props.job.get('experienceYearRange')
        ? props.job.get('experienceYearRange').toJS().gte
        : null,
      maxYear: state.experienceYearRange
        ? state.experienceYearRange
        : props.job.get('experienceYearRange')
        ? props.job.get('experienceYearRange').toJS().lte
        : null,
      startDate:
        state.startDate ||
        (props.job.get('startDate') &&
          moment(props.job.get('startDate').split('T')[0])),
      endDate:
        state.endDate ||
        (props.job.get('endDate') &&
          moment(props.job.get('endDate').split('T')[0])),
      status: state.status || props.job.get('status') || 'OPEN',
      jobType: state.jobType || props.job.get('jobType') || 'FULL_TIME',
      priority: state.priority || props.job.get('priority'),
      billRateUnitType: state.billRateUnitType || props.job.get('payType'),
      payRateUnitType:
        state.payRateUnitType || props.job.get('payRateUnitType') || 'HOURLY',
      company:
        state.company || props.job.get('company')
          ? props.job.get('company').toJS().name
          : null,
      companyId:
        state.companyId || props.job.get('company')
          ? props.job.get('company').toJS().id
          : null,
      ratecurrency: state.ratecurrency || props.job.get('currency') || 'USD',
      clientcontact:
        state.clientcontact || props.job.get('clientContactCategory') || '',

      companyIndustry:
        state.companyIndustry || props.job.get('company')
          ? props.job.get('company').toJS().industry
          : null,
      clientcontactname:
        state.clientcontactname || props.job.get('clientContactName')
          ? props.job.get('clientContactName').toJS().id
          : null,
      skills:
        state.skills || props.job.get('requiredSkills')
          ? props.job.get('requiredSkills').toJS()
          : [],
      switchFlag: state.switchFlag || props.job.get('visible') || false,
      switchFlagTwo: state.switchFlagTwo || freshExperFlag || false,
      locationList:
        state.locationList || props.job.get('locations')
          ? props.job.get('locations').toJS()
          : [],
      assignList:
        state.assignList || props.job.get('assignedUsers')
          ? props.job.get('assignedUsers').toJS()
          : [],
      open: state.open || false,
      additionalOne:
        state.additionalOne || !!!props.job.get('minimumDegreeLevel'),
      additionalTwo:
        state.additionalTwo || !!!props.job.get('experienceYearRange'),
      additionalThree:
        state.additionalThree || !!!props.job.get('requiredLanguages'),
      additionalFour:
        state.additionalFour || !!!props.job.get('preferredLanguages'),
      additionalFive:
        state.additionalFive || !!!props.job.get('preferredSkills'),
      keywordsOptions: state.keywordsOptions || [],
      jobCheckedList: state.jobCheckedList || [],
      jobList: state.jobList || [],
      groupUserList: state.groupUserList || [],
      clientContactNameList: state.clientContactNameList || [],
      assignedAmUser: state.assignedAmUser || '',
      assignedTeamList: state.assignedTeamList || [],
      assignedTeam: state.assignedTeam || '',
      assignedTeamDialogUser: state.assignedTeamDialogUser || [],
      degreeList: state.degreeList || [],
      languageList: state.languageList || [],
      degreeValue: state.degreeValue || '',
      reLanguageCheckedList: state.reLanguageCheckedList || [],
      preLanguageCheckedList: state.preLanguageCheckedList || [],
      PreferredSkills:
        state.PreferredSkills || props.job.get('preferredSkills')
          ? props.job.get('preferredSkills').toJS()
          : [],
      clientcontactUsername:
        state.clientcontactUsername || props.job.get('clientContactName')
          ? props.job.get('clientContactName').toJS().name
          : null,
      // minYear: state.minYear || props.job.get('leastExperienceYear') || '',
      // maxYear: state.maxYear || props.job.get('mostExperienceYear') || '',
      confirmOpen: state.confirmOpen || false,
      openings: state.openings,
      allowSubmit: state.allowSubmit,
      prosecArr: state.prosecArr || [],
      ipgJobStatus: state.ipgJobStatus || props.job.get('ipgJobStatus'),
      ipgOpen: state.ipgOpen || false,
      ipgPost: state.ipgPost || props.job.get('ipgJobStatus') === 'OPEN',
      ipgJobType: state.ipgJobType || props.job.get('jobType'),
      ipgJd: state.ipgJd || props.job.get('ipgJobDescription'),
      // 判断ipg Jd是否为空
      ipgJdEmpty: false,
      ipgJobId: null,
    };
  };

  componentDidMount() {
    //console.timeEnd('job form');
    // this.fetchClientList();
    this.fetchJobList();
    this.fetchBriefUsersList();
    this.fetchProjectTeamList();
    this.fetchDegreeList();
    this.fetchLanguageList();
    if (this.state.companyId) {
      apnSDK.getClientContactByCompanyId(this.state.companyId).then((res) => {
        console.log(res);
        res.response &&
          res.response.map((item) => {
            //label和value是方便select组件展示
            item.label = item.name;
            item.value = item.id;
            item.disabled = !item.active;
          });
        this.setState({ clientContactNameList: res.response });
      });
    }
    //set IpgJd（没有编辑权限时 不需要curl api 查看ipgjob 不然报错 此处优化）
    if (this.props.canEdit) {
      if (this.state.ipgJobStatus === 'OPEN') {
        apnSDK
          .getJd_Ipg(this.props.job.get('id'))
          .then((res) => {
            if (res.status === 200) {
              const body = JSON.parse(res.response.body);
              this.setState({
                ipgJd: body.jdText,
                ipgJobType: body.type,
                ipgJobId: body.id,
              });
            }
          })
          .catch((err) => {
            this.props.dispatch(showErrorMessage(err));
            throw err;
          });
      } else {
        this.setState({
          ipgJd: this.props.job.get('publicDesc'),
        });
      }
    }
  }

  fetchJobList = () => {
    apnSDK.getJobFunction().then((res) => {
      let arr = this.props.job.get('jobFunctions');
      this.setState({
        jobList: res.response,
        jobCheckedList: arr ? arr.toJS() : [],
      });
    });
  };
  fetchDegreeList = () => {
    apnSDK.getAllDegree().then((res) => {
      let arr = this.props.job.get('minimumDegreeLevel');
      if (typeof arr != 'string' && arr) {
        arr = arr.toJS()[0];
      }
      this.setState({
        degreeList: res.response,
        // degreeValue: arr ? arr.toJS()[0] : null,
        degreeValue: arr,
      });
    });
  };
  fetchLanguageList = () => {
    apnSDK.getAllLanguages().then((res) => {
      let arr = this.props.job.get('requiredLanguages');
      let add = this.props.job.get('preferredLanguages');
      this.setState({
        languageList: res.response,
        reLanguageCheckedList: arr ? arr.toJS() : [],
        preLanguageCheckedList: add ? add.toJS() : [],
      });
    });
  };
  fetchProjectTeamList = () => {
    apnSDK.getAllProjectTeam().then((res) => {
      console.log(res);
      res.response &&
        res.response.map((item) => {
          item.label = item.name;
          item.value = item.id;
        });
      this.setState({ assignedTeamList: res.response });
    });
  };

  fetchBriefUsersList = () => {
    let briefUsers = this.props.briefUsers;
    let resList = [];
    briefUsers.map((item) => {
      item.label = item.fullName;
      item.value = item.id;
      item.disabled = !item.activated;
      resList.push(item);
    });
    this.setState({ groupUserList: resList });
  };

  // fetchClientList = () => {
  //   const { dispatch, isLimitUser } = this.props;
  //   if (!isLimitUser) {
  //     dispatch(getCompanyList(2)).then((res) => {
  //       console.log(res);
  //       res.clients &&
  //         this.setState({
  //           prosecArr: res.clients,
  //         });
  //     });
  //   }
  // };

  handleStartDateChange = (startDate) => {
    this.setState({ startDate });
  };

  handleEndDateChange = (endDate) => {
    this.setState({ endDate });
  };

  addLocation = () => {
    let arr = [...this.state.locationList];
    arr.push({
      id: new Date().getTime(),
      addressLine: '',
      city: '',
      country: '',
      province: '',
      location: '',
    });
    this.setState({
      locationList: arr,
    });
  };
  addAssigned = () => {
    let arr = [...this.state.assignList];
    arr.push({
      firstName: '',
      lastName: '',
      permission: '',
      userId: '',
      username: '',
    });
    this.setState({
      assignList: arr,
    });
  };
  handleSwitch = () => {
    if (!this.state.switchFlag) {
      this.setState({
        confirmOpen: true,
      });
    } else {
      this.setState({
        switchFlag: !this.state.switchFlag,
      });
    }
  };
  // 清空groupuser数据
  cancelAssignedUser = () => {
    let arr = [...this.state.assignList];
    this.setState({
      switchFlag: !this.state.switchFlag,
    });
    arr.splice(1);
    this.setState({
      assignList: arr,
    });
    this.handleConfirmClose();
  };
  handleConfirmClose = () => {
    this.setState({
      confirmOpen: false,
    });
  };
  handleSwitchTwo = () => {
    if (!this.state.switchFlagTwo) {
      this.setState({
        minYear: '',
        maxYear: 0,
      });
    } else {
      this.setState({
        minYear: '',
        maxYear: '',
      });
    }
    this.setState({
      switchFlagTwo: !this.state.switchFlagTwo,
    });
    this.props.removeErrorMsgHandler('Years of Experience');
  };
  showMyDialog = () => {
    this.setState({
      open: true,
    });
  };
  handleClose = () => {
    this.setState({
      open: false,
      assignedTeamDialogUser: [],
    });
  };
  deleteSingleLocation = (index) => {
    console.log(index);
    let arr = [...this.state.locationList];
    arr.splice(index, 1);
    console.log(index, arr);
    this.setState({
      locationList: arr,
    });
  };
  deleteGroupUser = (index) => {
    let arr = [...this.state.assignList];
    arr.splice(index, 1);
    this.setState({
      assignList: arr,
    });
    this.props.removeErrorMsgHandler('assignedUsers');
  };
  deleteDialogUser = (index) => {
    let arr = [...this.state.assignedTeamDialogUser];
    arr.splice(index, 1);
    this.setState({
      assignedTeamDialogUser: arr,
    });
  };
  handleCompanyChange = (company) => {
    let handText = { ...company };
    if (company.industry === null || company.industry === '') {
      handText.industry = 'NODATA';
    }
    this.setState({
      company: company.label,
      companyId: company.value,
      companyIndustry: handText.industry,
    });
    apnSDK.getClientContactByCompanyId(company.value).then((res) => {
      console.log(res);
      res.response &&
        res.response.map((item) => {
          //label和value是方便select组件展示
          item.label = item.name;
          item.value = item.id;
          item.disabled = !item.active;
        });
      this.setState({
        clientContactNameList: res.response,
        clientcontactname: '',
      });
    });
  };
  handleContactChange = (clientcontact) => {
    console.log(clientcontact);
    this.setState({ clientcontact });
  };
  // 后台需要contact name的id和name所以多了循环，其他的地方同理
  handleContactNameChange = (clientcontactname) => {
    this.setState({ clientcontactname });
    let arr = [...this.state.clientContactNameList];
    let str = '';
    arr.map((item) => {
      if (item.id === clientcontactname) {
        str = item.name;
      }
    });
    this.setState({ clientcontactUsername: str });
  };
  // 获取location里的数据，后台需要除id外4个值
  getSingleLocation = (data, index) => {
    let arr = [...this.state.locationList];
    console.log(data);
    if (data.show) {
      //属于下拉选择的
      arr[index].addressLine = null;
      arr[index].city = data.city;
      arr[index].province = data.province;
      arr[index].country = data.country;
      arr[index].location = null;
    } else {
      arr[index].addressLine = null;
      arr[index].city = null;
      arr[index].province = null;
      arr[index].country = null;
      arr[index].location = data.trim();
    }

    this.setState({ locationList: arr });
    console.log(arr);
    if (this.props.removeErrorMsgHandler)
      this.props.removeErrorMsgHandler('location');
  };
  // 以下三个是groupuser的方法
  changeGroupUser = (data, index) => {
    let arr = [...this.state.assignList];
    arr[index].permission = data.value;
    this.setState({ assignList: arr });
    this.props.removeErrorMsgHandler('assignedUsers');
  };
  changeGroupUserTwo = (data, index) => {
    let arr = [...this.state.assignList];
    arr[index].firstName = data.firstName;
    arr[index].lastName = data.lastName;
    arr[index].userId = data.id;
    arr[index].username = data.username;
    this.setState({ assignList: arr });
    this.props.removeErrorMsgHandler('assignedUsers');
  };
  changeDialogUserDivisied = (data, index) => {
    console.log(data, index);
    let arr = [...this.state.assignedTeamDialogUser];
    arr[index].permission = data;
    this.setState({ assignedTeamDialogUser: arr });
  };
  changeAssignedTeam = (data) => {
    this.setState({ assignedTeam: data });
    console.log(data);
    apnSDK.getAllProjectTeamUserByID(data).then((res) => {
      res.response &&
        res.response.map((item) => {
          item.label = item.username;
          item.value = item.id;
          item.permission = '';
          item.userId = item.id;
        });
      this.setState({ assignedTeamDialogUser: res.response });
    });
  };
  insertToGroupUser = () => {
    let arr = [...this.state.assignedTeamDialogUser];
    let assignList = [...this.state.assignList];
    let ssr = assignList.concat(arr);
    console.log(ssr);
    this.setState({
      assignList: ssr,
    });
    this.handleClose();
  };
  handleJobFunctionChange = (jobCheckedList) => {
    let serviceType = jobCheckedList.map((job) => Number(job));
    this.setState({
      jobCheckedList: serviceType,
    });
    this.props.removeErrorMsgHandler('jobfunction');
  };

  changeSetSkills = (skills) => {
    let arr = [];
    let add = this.state.skills ? [...this.state.skills] : [];
    arr = skills && skills.split(',').map((skill) => ({ skillName: skill }));
    arr = arr && arr.filter((item) => Number.isNaN(Number(item.skillName)));
    arr &&
      arr.map((item) => {
        add &&
          add.map((ele) => {
            if (item.skillName === ele.skillName) {
              if (ele.score) {
                item.score = ele.score || 0;
              }
              if (ele.dummy_key) {
                item.dummy_key = ele.dummy_key;
              }
            }
          });
      });
    console.log(arr);
    this.setState({ skills: arr });
  };
  changeRequireSkills = (skills) => {
    let arr = [];
    let add = this.state.PreferredSkills ? [...this.state.PreferredSkills] : [];
    arr = skills && skills.split(',').map((skill) => ({ skillName: skill }));
    arr = arr && arr.filter((item) => Number.isNaN(Number(item.skillName)));
    arr &&
      arr.map((item) => {
        add &&
          add.map((ele) => {
            if (item.skillName === ele.skillName) {
              if (ele.score) {
                item.score = ele.score || 0;
              }
              if (ele.dummy_key) {
                item.dummy_key = ele.dummy_key;
              }
            }
          });
      });
    this.setState({ PreferredSkills: arr });
  };

  // additional information里的对应方法
  handleReLanguageChange = (CheckedList) => {
    let serviceType = [];
    CheckedList.forEach((item) => {
      serviceType.push(item * 1);
    });
    this.setState({
      reLanguageCheckedList: serviceType,
    });
  };
  // additional information里的对应方法
  handlePreLanguageChange = (CheckedList) => {
    let serviceType = [];
    CheckedList.forEach((item) => {
      serviceType.push(item * 1);
    });
    this.setState({
      preLanguageCheckedList: serviceType,
    });
  };
  // Pay Rate最小值
  handMinValue = (e) => {
    let number = e.target.value;
    if (number && number.indexOf('-') !== -1) {
      this.setState({
        minValue: 0,
      });
    } else {
      this.setState({
        minValue: e.target.value,
      });
    }
    if (number.length > 9) {
      this.setState({
        minValue: this.state.minValue,
      });
    }
    this.props.removeErrorMsgHandler('payRate');
  };
  // Pay Rate最大值
  handMaxValue = (e) => {
    let number = e.target.value;
    if (number && number.indexOf('-') !== -1) {
      this.setState({
        maxValue: 0,
      });
    } else {
      this.setState({
        maxValue: e.target.value,
      });
    }
    if (number.length > 9) {
      this.setState({
        maxValue: this.state.maxValue,
      });
    }
    this.props.removeErrorMsgHandler('payRate');
  };
  // Bill Rate最小值
  handBillMinValue = (e) => {
    let number = e.target.value;
    if (number && number.indexOf('-') !== -1) {
      this.setState({
        billMinValue: 0,
      });
    } else {
      this.setState({
        billMinValue: e.target.value,
      });
    }
    if (number.length > 9) {
      this.setState({
        billMinValue: this.state.billMinValue,
      });
    }
    this.props.removeErrorMsgHandler('billRate');
  };
  // Bill Rate最大值
  handBillMaxValue = (e) => {
    let number = e.target.value;
    if (number && number.indexOf('-') !== -1) {
      this.setState({
        billMaxValue: 0,
      });
    } else {
      this.setState({
        billMaxValue: e.target.value,
      });
    }
    if (number.length > 9) {
      this.setState({
        billMaxValue: this.state.billMaxValue,
      });
    }
    this.props.removeErrorMsgHandler('billRate');
  };
  changeOpening = (e) => {
    let number = isNum(e.target.value, 4);
    this.setState({ openings: number });
  };
  changeAllowSubmit = (e) => {
    let number = isNum(e.target.value, 4);
    console.log(number);
    this.setState({ allowSubmit: number });
  };
  changeMinYear = (e) => {
    let number = isNum(e.target.value, 2);
    this.setState({ minYear: number });
    this.props.removeErrorMsgHandler('Years of Experience');
  };
  changeMaxYear = (e) => {
    let number = isNum(e.target.value, 2);
    if (number !== '0') {
      this.setState({ maxYear: number });
    }
    this.props.removeErrorMsgHandler('Years of Experience');
  };

  handleIpgCheck = (e) => {
    console.log(e);
    //Close Job
    if (this.state.ipgPost && this.state.ipgJobStatus === 'OPEN') {
      this.setState({
        ipgPost: false,
        ipgOpen: true,
      });
    }
    //Cancel create
    else if (this.state.ipgPost && this.state.ipgJobStatus !== 'OPEN') {
      this.setState({
        ipgPost: false,
      });
    } else {
      this.setState({
        ipgOpen: e.target.checked,
      });
    }
  };
  //Open Edit Details
  handleIpgOpen = () => {
    this.setState({
      ipgOpen: true,
    });
  };

  handleCancel = () => {
    this.setState({
      ipgOpen: false,
    });
  };

  handleCancelClose = () => {
    this.setState({
      ipgOpen: false,
      ipgPost: true,
      ipgJobStatus: 'OPEN',
    });
  };

  handleIpgJobTypeChange = (e) => {
    this.setState({
      ipgJobType: e,
    });
    this.props.setIpgJobType(e);
  };

  handleipgJdChange = (Jd) => {
    this.setState({
      ipgJd: Jd,
      ipgJdEmpty: false,
    });
  };

  handleConfirmIpg = () => {
    if (
      this.state.ipgJd ===
      '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>'
    ) {
      console.log('ipg jd 为空');
      this.setState({
        ipgJdEmpty: true,
      });
    } else {
      this.setState({
        ipgOpen: false,
        ipgPost: true,
        // ipgJobStatus: 'OPEN',
        ipgJdEmpty: false,
      });
    }
  };

  handleCloseJob = () => {
    this.setState({
      ipgPost: false,
      ipgOpen: false,
    });
    const jobId = this.props.job.get('id');
    apnSDK
      .closeJob_Ipg(jobId)
      .then((res) => {
        console.log(res);
        this.setState({
          ipgJobStatus: 'CLOSED',
        });
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        throw err;
      });
  };

  handleViewDetail = () => {
    const ipgJobUrl = `https://www.intelliprogroup.com/jobDetail?id=${this.state.ipgJobId}`;
    window.open(ipgJobUrl);
  };

  // 判断一下job类型 来控制Post on IPG website的disbled
  jugdeJobStatus = () => {
    const jobStatus = this.props.job.get('status');
    switch (jobStatus) {
      case 'OPEN':
      case 'REOPENED':
        return false;
      default:
        return true;
    }
  };

  render() {
    // console.time('job form');
    const {
      t,
      i18n,
      classes,
      disabled,
      job,
      errorMessage,
      companyOptions,
      isLimitUser,
      removeErrorMsgHandler,
      functionOptions,
      functionOptionsZh,
      language,
      degreeOptions,
      languagesOptions,
    } = this.props;
    const { companyId } = this.state;
    // const { companyOptions } = getCompanyOptions(
    //   companiesList
    // );
    return (
      <div>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              name="title"
              label={t('field:jobTitle')}
              defaultValue={job.get('title')}
              isRequired={true}
              disabled={disabled}
              errorMessage={errorMessage ? errorMessage.get('title') : null}
              onBlur={() => {
                if (removeErrorMsgHandler) removeErrorMsgHandler('title');
              }}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              name="openings"
              label={t('field:openings')}
              defaultValue={job.get('openings')}
              isRequired={true}
              disabled={disabled}
              value={this.state.openings}
              onChange={this.changeOpening}
              errorMessage={errorMessage ? errorMessage.get('openings') : null}
              onBlur={() => {
                if (removeErrorMsgHandler) removeErrorMsgHandler('openings');
              }}
            />
          </div>
          <div className="small-3 columns">
            <FormInput
              name="maxSubmissions"
              label={t('field:maxSubmissions')}
              defaultValue={job.get('maxSubmissions')}
              value={this.state.allowSubmit}
              onChange={this.changeAllowSubmit}
              placeholder={t('tab:Enter a number')}
              disabled={disabled}
            />
          </div>
          <div className="small-3 columns">
            <FormInput
              name="jobCode"
              label={t('field:code')}
              defaultValue={job.get('code')}
              disabled={disabled}
              errorMessage={errorMessage ? errorMessage.get('jobCode') : null}
              onBlur={() => {
                if (removeErrorMsgHandler) removeErrorMsgHandler('jobCode');
              }}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:company')}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('company') : null}
            >
              <Select
                options={companyOptions}
                value={this.state.companyId}
                onChange={this.handleCompanyChange}
                onBlur={() => {
                  if (removeErrorMsgHandler) removeErrorMsgHandler('company');
                }}
                disabled={disabled}
                noResultsText={''}
                autoBlur={true}
                clearable={false}
                openOnFocus={true}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="company"
              value={this.state.company || ''}
            />
            <input
              type="hidden"
              name="companyId"
              value={this.state.companyId || ''}
            />
            <input
              type="hidden"
              name="companyIndustry"
              value={this.state.companyIndustry || ''}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="department"
              label={t('field:department')}
              defaultValue={job.get('department')}
              disabled={disabled}
              errorMessage={
                errorMessage ? errorMessage.get('department') : null
              }
              onBlur={() => {
                if (removeErrorMsgHandler) removeErrorMsgHandler('department');
              }}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <div className="row expanded">
              <div className="columns" style={{ paddingLeft: 0 }}>
                <FormReactSelectContainer
                  label={t('field:clientContact')}
                  isRequired={true}
                  errorMessage={
                    errorMessage ? errorMessage.get('clientcontact') : null
                  }
                >
                  <Select
                    options={FormOptions.contactCategoryList}
                    value={this.state.clientcontact}
                    onChange={this.handleContactChange}
                    onBlur={() => {
                      if (removeErrorMsgHandler)
                        removeErrorMsgHandler('clientcontact');
                    }}
                    simpleValue
                    disabled={disabled}
                    placeholder={t('tab:select')}
                    noResultsText={''}
                    autoBlur={true}
                    clearable={false}
                    openOnFocus={true}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="clientcontact"
                  value={this.state.clientcontact || ''}
                />
              </div>
              <div className="columns" style={{ paddingRight: 0 }}>
                <FormReactSelectContainer
                  label="&nbsp;"
                  errorMessage={
                    errorMessage ? errorMessage.get('clientcontactname') : null
                  }
                >
                  <Select
                    options={this.state.clientContactNameList}
                    value={this.state.clientcontactname}
                    onChange={this.handleContactNameChange}
                    onBlur={() => {
                      if (removeErrorMsgHandler)
                        removeErrorMsgHandler('clientcontactname');
                    }}
                    simpleValue
                    disabled={disabled}
                    noResultsText={''}
                    placeholder="Select name"
                    autoBlur={true}
                    clearable={false}
                    openOnFocus={true}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="clientcontactid"
                  value={this.state.clientcontactname || ''}
                />
                <input
                  type="hidden"
                  name="clientcontactname"
                  value={this.state.clientcontactUsername || ''}
                />
              </div>
            </div>
          </div>
          <div className="small-6 columns" style={{ position: 'relative' }}>
            {disabled ? null : (
              <p
                style={{
                  position: 'absolute',
                  right: '6px',
                  color: '#3398dc',
                  cursor: 'pointer',
                }}
                onClick={this.addLocation}
              >
                {t('tab:Add')}
              </p>
            )}

            <span style={{ fontSize: '0.75em' }}>{t('field:location')}</span>
            <span style={{ color: '#CC4B37' }}> *</span>
            <input
              type="hidden"
              name="location"
              value={
                this.state.locationList &&
                JSON.stringify(this.state.locationList)
              }
            />
            {this.state.locationList.map((item, index) => {
              let addressLine = null;
              if (item.city) {
                addressLine = item.city;
              }
              if (item.province) {
                if (item.city) {
                  addressLine = addressLine + ', ' + item.province;
                } else {
                  addressLine = item.province;
                }
              }
              if (item.country) {
                addressLine = addressLine + ', ' + item.country;
              }
              return (
                <div className="row expanded" key={item.id}>
                  <div className={index === 0 ? 'small-12' : 'small-11'}>
                    <div
                      className={
                        errorMessage.get('location') ? classes.autoBox : ''
                      }
                    >
                      <Location
                        getLocation={(data) => {
                          this.getSingleLocation(data, index);
                        }}
                        city={addressLine || item.location}
                        disabled={disabled}
                      />
                    </div>
                  </div>
                  {index === 0 ? null : (
                    <DeleteIcon
                      style={{
                        marginTop: 4,
                        color: '#8e8e8e',
                        cursor: 'pointer',
                      }}
                      onClick={
                        disabled
                          ? null
                          : () => {
                              this.deleteSingleLocation(index);
                            }
                      }
                    />
                  )}
                </div>
              );
            })}
            <span
              style={{
                color: '#CC4B37',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            >
              {errorMessage ? errorMessage.get('location') : null}
            </span>
          </div>
        </div>

        <div className="row expanded">
          <div className="small-3 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:startDate')} name="startDate" />
              }
              maxDate={this.state.endDate && moment(this.state.endDate)}
              className={classes.fullWidth}
              disabled={disabled}
              selected={this.state.startDate}
              onChange={this.handleStartDateChange}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="startDate"
              type="hidden"
              value={
                this.state.startDate
                  ? this.state.startDate.format('YYYY-MM-DD')
                  : ''
              }
              disabled={disabled}
            />
          </div>

          <div className="small-3 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:endDate')} name="endDate" />
              }
              minDate={moment(this.state.startDate)}
              // minDate={this.state.startDate || moment()}
              // maxDate={moment().add(1, "years")}
              disabled={disabled}
              className={classes.fullWidth}
              selected={this.state.endDate}
              onChange={this.handleEndDateChange}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="endDate"
              type="hidden"
              value={
                this.state.endDate
                  ? this.state.endDate.format('YYYY-MM-DD')
                  : ''
              }
              disabled={disabled}
            />
          </div>

          <div className="small-3 columns">
            <FormReactSelectContainer
              label={t('field:Rate Currency')}
              isRequired={true}
            >
              <Select
                labelKey="label2"
                options={FormOptions.currency}
                value={this.state.ratecurrency}
                onChange={(ratecurrency) => this.setState({ ratecurrency })}
                disabled={disabled}
                simpleValue
                noResultsText={''}
                autoBlur={true}
                clearable={false}
                openOnFocus={true}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="ratecurrency"
              value={this.state.ratecurrency || ''}
            />
          </div>
          <div className="small-3 columns">
            <FormReactSelectContainer
              label={t('tab:Unit Type')}
              isRequired={true}
              errorMessage={
                errorMessage ? errorMessage.get('billRateUnitType') : null
              }
            >
              <Select
                value={this.state.billRateUnitType}
                onChange={(billRateUnitType) =>
                  this.setState({ billRateUnitType })
                }
                simpleValue
                options={FormOptions.payRateUnitTypes}
                autoBlur={true}
                searchable={false}
                clearable={false}
                disabled={disabled}
                onBlur={() => {
                  if (removeErrorMsgHandler)
                    removeErrorMsgHandler('billRateUnitType');
                }}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="billRateUnitType"
              value={this.state.billRateUnitType}
            />
          </div>
        </div>
        <div className="row expanded small-collapse">
          <div className="small-6 columns">
            <div className="row expanded">
              <div className=" columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('billRateFrom')}
                  label={t('field:Bill Rate')}
                  name="billRateFrom"
                  type="number"
                  placeholder={t('field:Min')}
                  defaultValue={job.get('billRateFrom')}
                  disabled={disabled}
                  value={this.state.billMinValue}
                  onChange={this.handBillMinValue}
                  errorMessage={
                    errorMessage ? errorMessage.get('billRate') : null
                  }
                  onBlur={() => {
                    if (removeErrorMsgHandler)
                      removeErrorMsgHandler('billRate');
                  }}
                />
              </div>
              <div>
                <div style={{ paddingTop: 21, lineHeight: '32px' }}>-</div>
              </div>
              <div className=" columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('billRateTo')}
                  label="&nbsp;"
                  name="billRateTo"
                  type="number"
                  placeholder={t('field:Max')}
                  defaultValue={job.get('billRateTo')}
                  disabled={disabled}
                  value={this.state.billMaxValue}
                  onChange={this.handBillMaxValue}
                  errorMessage={
                    errorMessage ? errorMessage.get('billRate') : null
                  }
                  onBlur={() => {
                    if (removeErrorMsgHandler)
                      removeErrorMsgHandler('billRate');
                  }}
                />
              </div>
            </div>
          </div>
          <div className="small-6 columns">
            <div className="row expanded">
              <div className="columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('payRateFrom')}
                  label={t('field:payRate')}
                  name="payRateFrom"
                  type="number"
                  placeholder={t('field:Min')}
                  disabled={disabled}
                  value={this.state.minValue}
                  onChange={this.handMinValue}
                  errorMessage={
                    errorMessage ? errorMessage.get('payRate') : null
                  }
                  onBlur={() => {
                    if (removeErrorMsgHandler) removeErrorMsgHandler('payRate');
                  }}
                />
              </div>
              <div>
                <div style={{ paddingTop: 21, lineHeight: '32px' }}>-</div>
              </div>
              <div className="columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('payRateTo')}
                  label="&nbsp;"
                  name="payRateTo"
                  type="number"
                  placeholder={t('field:Max')}
                  disabled={disabled}
                  value={this.state.maxValue}
                  onChange={this.handMaxValue}
                  errorMessage={
                    errorMessage ? errorMessage.get('payRate') : null
                  }
                  onBlur={() => {
                    if (removeErrorMsgHandler) removeErrorMsgHandler('payRate');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <span style={{ fontSize: '0.75em' }}>{t('field:jobfunction')}</span>
            <span style={{ color: '#CC4B37' }}> *</span>
            <div
              className={errorMessage.get('jobfunction') ? classes.autoBox : ''}
            >
              <JobFunctionTree
                jobData={language ? functionOptions : functionOptionsZh}
                selected={this.state.jobCheckedList}
                sendServiceType={this.handleJobFunctionChange}
                disabled={disabled}
              />
            </div>
            <input
              type="hidden"
              name="jobfunction"
              value={
                this.state.jobCheckedList &&
                JSON.stringify(this.state.jobCheckedList)
              }
            />
            <span
              style={{
                color: '#CC4B37',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              {errorMessage ? errorMessage.get('jobfunction') : null}
            </span>
          </div>
          <div className={classes.requiredSkill}>
            <FormReactSelectContainer
              label={t('field:requiredskills')}
              isRequired={true}
              errorMessage={
                errorMessage ? errorMessage.get('mustSkills') : null
              }
            >
              <Select.Creatable
                valueKey="skillName"
                labelKey="skillName"
                value={this.state.skills}
                multi
                simpleValue
                disabled={disabled}
                placeholder={t('tab:Required Skills')}
                onChange={(skills) => {
                  this.changeSetSkills(skills);
                }}
                promptTextCreator={(label) =>
                  `${t('field:skillsCreat')} "${label}"`
                }
                noResultsText={false}
                onBlur={() => {
                  if (removeErrorMsgHandler)
                    removeErrorMsgHandler('mustSkills');
                }}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="requiredskills"
              value={this.state.skills && JSON.stringify(this.state.skills)}
            />
          </div>
        </div>
        <div className="row expanded" style={{ position: 'relative' }}>
          {disabled ? null : (
            <div style={{ position: 'absolute', right: '-4px', top: '-10px' }}>
              {t('tab:Only visible to you')}
              <Switch
                checked={this.state.switchFlag}
                onChange={this.handleSwitch}
                color="primary"
                name="checkedB"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          )}

          <input
            type="hidden"
            name="assignedUsers"
            value={
              this.state.assignList && JSON.stringify(this.state.assignList)
            }
          />
          <input
            type="hidden"
            name="visible"
            value={
              this.state.switchFlag && JSON.stringify(this.state.switchFlag)
            }
          />
          {this.state.assignList &&
            this.state.assignList.map((item, index) => {
              return (
                <div className="row expanded small-12" key={index}>
                  <div className="small-6 columns">
                    <FormReactSelectContainer
                      label={index === 0 ? t('field:assignedgroup') : null}
                      isRequired={index === 0 ? true : false}
                      errorMessage={
                        errorMessage
                          ? errorMessage.get('AssignedGroupUser')
                          : null
                      }
                    >
                      <Select
                        options={FormOptions.jobUserRoles}
                        value={item.permission}
                        onChange={(data) => {
                          this.changeGroupUser(data, index);
                        }}
                        disabled={this.state.switchFlag || disabled}
                        noResultsText={''}
                        autoBlur={true}
                        clearable={false}
                        openOnFocus={true}
                      />
                    </FormReactSelectContainer>
                  </div>
                  <div className="small-5 columns">
                    <FormReactSelectContainer
                      label={index === 0 ? '.' : null}
                      errorMessage={
                        errorMessage
                          ? errorMessage.get('AssignedGroupUser')
                          : null
                      }
                    >
                      <Select
                        options={this.state.groupUserList}
                        value={item.userId}
                        onChange={(data) => {
                          this.changeGroupUserTwo(data, index);
                        }}
                        disabled={this.state.switchFlag || disabled}
                        noResultsText={''}
                        autoBlur={true}
                        clearable={false}
                        openOnFocus={true}
                      />
                    </FormReactSelectContainer>
                  </div>
                  {index === 0 ? (
                    <div className="small-1 columns">
                      <AddCircleIcon
                        style={{ marginTop: 25, color: '#8e8e8e' }}
                        onClick={
                          this.state.switchFlag || disabled
                            ? null
                            : this.addAssigned
                        }
                      />
                    </div>
                  ) : (
                    <div className="small-1 columns">
                      <DeleteIcon
                        style={{ marginTop: 4, color: '#8e8e8e' }}
                        onClick={
                          disabled
                            ? null
                            : () => {
                                this.deleteGroupUser(index);
                              }
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          <div>
            <p
              style={{
                color: '#CC4B37',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            >
              {errorMessage ? errorMessage.get('assignedUsers') : null}
            </p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {disabled ? null : (
                <p
                  style={{
                    color: '#3398dc',
                    fontSize: 14,
                    cursor: 'pointer',
                    marginRight: 6,
                  }}
                  onClick={
                    this.state.switchFlag || disabled ? null : this.showMyDialog
                  }
                >
                  {t('tab:Add user from program team')}
                </p>
              )}
              {/* <InfoIcon color="disabled" fontSize="small" /> */}
            </div>
          </div>
          {/* ipg job posting*/}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      onChange={this.handleIpgCheck}
                    />
                  }
                  label={t('tab:Post on IPG website')}
                  name="ipgPost"
                  disabled={disabled || this.jugdeJobStatus()}
                  checked={this.state.ipgPost}
                  value={this.state.ipgPost}
                />
              </FormGroup>
              {this.state.ipgPost && !disabled ? (
                <span
                  style={{ color: '#3398dc', cursor: 'pointer' }}
                  onClick={this.handleIpgOpen}
                >
                  {this.state.ipgJobStatus === 'CLOSED' ||
                  this.state.ipgJobStatus === 'NO_PUBLISHED'
                    ? t('tab:Edit Details')
                    : t('tab:View Job Details')}
                </span>
              ) : null}
            </div>
            <input type="hidden" name="ipgJd" value={this.state.ipgJd} />
            <input
              type="hidden"
              name="ipgJobStatus"
              value={this.state.ipgJobStatus}
            />
          </div>
        </div>
        <Divider />
        <p
          style={{
            color: '#505058',
            fontSize: 16,
            lineHeight: '19px',
            marginTop: '15px',
          }}
        >
          {t('tab:Additional Information')}
        </p>
        <p
          style={{
            color: '#939393',
            fontSize: 13,
            lineHeight: '15px',
            marginBottom: '16px',
          }}
        >
          {t('tab:moreInformation')}
        </p>
        <div className="row expanded" style={{ display: 'felx' }}>
          {this.state.additionalOne ? null : (
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:Degree Requirement')}>
                <Select
                  options={degreeOptions}
                  value={this.state.degreeValue}
                  onChange={(degreeValue) => this.setState({ degreeValue })}
                  simpleValue
                  noResultsText={''}
                  autoBlur={true}
                  clearable={false}
                  openOnFocus={true}
                  disabled={disabled}
                  placeholder={t('tab:select')}
                />
              </FormReactSelectContainer>
            </div>
          )}
          {this.state.additionalTwo ? null : (
            <div className="small-6 columns">
              <div className="row expanded" style={{ position: 'relative' }}>
                <div
                  style={{ position: 'absolute', right: '-4px', top: '-10px' }}
                >
                  {t('tab:Fresh Graduates')}
                  <Switch
                    checked={this.state.switchFlagTwo}
                    onChange={disabled ? null : this.handleSwitchTwo}
                    color="primary"
                    name="checkedA"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
                <div className=" columns">
                  <FormInput
                    label={t('field:Years of Experience')}
                    defaultValue={job.get('leastExperienceYear')}
                    name="minYear"
                    placeholder={t('tab:Min Year')}
                    value={this.state.minYear}
                    onChange={(e) => {
                      this.changeMinYear(e);
                    }}
                    errorMessage={
                      errorMessage
                        ? errorMessage.get('Years of Experience')
                        : null
                    }
                    onBlur={() => {
                      if (removeErrorMsgHandler)
                        removeErrorMsgHandler('Years of Experience');
                    }}
                    disabled={this.state.switchFlagTwo || disabled}
                  />
                </div>
                <div>
                  <div style={{ paddingTop: 21, lineHeight: '32px' }}>-</div>
                </div>
                <div className=" columns">
                  <FormInput
                    label="&nbsp;"
                    name="maxYear"
                    defaultValue={job.get('mostExperienceYear')}
                    placeholder={t('tab:Max Year')}
                    value={this.state.maxYear}
                    onChange={(e) => {
                      this.changeMaxYear(e);
                    }}
                    errorMessage={
                      errorMessage
                        ? errorMessage.get('Years of Experience')
                        : null
                    }
                    onBlur={() => {
                      if (removeErrorMsgHandler)
                        removeErrorMsgHandler('Years of Experience');
                    }}
                    disabled={this.state.switchFlagTwo || disabled}
                  />
                </div>
              </div>
            </div>
          )}
          {this.state.additionalThree ? null : (
            <div className="small-6 columns">
              <span>{t('field:Required Languages')}</span>
              <JobTree
                jobData={languagesOptions}
                selected={this.state.reLanguageCheckedList}
                sendServiceType={this.handleReLanguageChange}
                disabled={disabled}
                show={true}
              />
            </div>
          )}
          {this.state.additionalFour ? null : (
            <div className="small-6 columns">
              <span>{t('field:Preferred Languages')}</span>
              <JobTree
                jobData={languagesOptions}
                selected={this.state.preLanguageCheckedList}
                sendServiceType={this.handlePreLanguageChange}
                disabled={disabled}
                show={true}
              />
            </div>
          )}
          {this.state.additionalFive ? null : (
            <div className={classes.preferedSkill}>
              <FormReactSelectContainer
                label={t('field:Preferred Skills')}
                errorMessage={
                  errorMessage ? errorMessage.get('preferredSkills') : null
                }
              >
                <Select.Creatable
                  valueKey="skillName"
                  labelKey="skillName"
                  value={this.state.PreferredSkills}
                  disabled={disabled}
                  multi
                  simpleValue
                  placeholder={t('field:Preferred Skills')}
                  onChange={(PreferredSkills) => {
                    this.changeRequireSkills(PreferredSkills);
                  }}
                  promptTextCreator={(label) =>
                    `${t('field:skillsCreat')} "${label}"`
                  }
                  onBlur={() => {
                    if (removeErrorMsgHandler)
                      removeErrorMsgHandler('preferredSkills');
                  }}
                  noResultsText={false}
                />
              </FormReactSelectContainer>
            </div>
          )}
        </div>
        <div
          className="row expanded"
          style={{ display: 'felx', alignItems: 'center' }}
        >
          <input
            type="hidden"
            name="degreeValue"
            value={this.state.degreeValue || ''}
          />
          <input
            type="hidden"
            name="requiredLanguages"
            value={
              this.state.reLanguageCheckedList &&
              JSON.stringify(this.state.reLanguageCheckedList)
            }
          />
          <input
            type="hidden"
            name="preferredLanguages"
            value={
              this.state.preLanguageCheckedList &&
              JSON.stringify(this.state.preLanguageCheckedList)
            }
          />
          <input
            type="hidden"
            name="preferredSkills"
            value={
              this.state.PreferredSkills &&
              JSON.stringify(this.state.PreferredSkills)
            }
          />
          <input type="hidden" name="minYears" value={this.state.minYear} />
          <input type="hidden" name="maxYears" value={this.state.maxYear} />
          <input
            type="hidden"
            name="switchFlagTwo"
            value={
              this.state.switchFlagTwo &&
              JSON.stringify(this.state.switchFlagTwo)
            }
          />
          {this.state.additionalOne ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={
                disabled
                  ? null
                  : () => {
                      this.setState({ additionalOne: false });
                    }
              }
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>{t('field:Degree Requirement')}</p>
            </div>
          ) : null}
          {this.state.additionalTwo ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={
                disabled
                  ? null
                  : () => {
                      this.setState({ additionalTwo: false }, () => {
                        console.log(this.state);
                      });
                    }
              }
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>{t('field:Years of Experience')}</p>
            </div>
          ) : null}
          {this.state.additionalThree ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={
                disabled
                  ? null
                  : () => {
                      this.setState({ additionalThree: false });
                    }
              }
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>{t('field:Required Languages')}</p>
            </div>
          ) : null}
          {this.state.additionalFour ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={
                disabled
                  ? null
                  : () => {
                      this.setState({ additionalFour: false });
                    }
              }
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>{t('field:Preferred Languages')}</p>
            </div>
          ) : null}
          {this.state.additionalFive ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={
                disabled
                  ? null
                  : () => {
                      this.setState({ additionalFive: false });
                    }
              }
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>{t('field:Preferred Skills')}</p>
            </div>
          ) : null}
        </div>

        <MyDialog
          show={this.state.open}
          modalTitle={t('tab:Add Assigned User')}
          CancelBtnMsg={t('tab:Cancel')}
          SubmitBtnMsg={t('tab:Confirm')}
          CancelBtnShow={true}
          SubmitBtnShow={true}
          handleClose={this.handleClose}
          primary={this.insertToGroupUser}
        >
          <div style={{ width: 667, minHeight: 559 }}>
            <FormReactSelectContainer label={t('field:Select a program team')}>
              <Select
                options={this.state.assignedTeamList}
                value={this.state.assignedTeam}
                onChange={this.changeAssignedTeam}
                placeholder={t('tab:Select a program team')}
                simpleValue
                noResultsText={''}
                autoBlur={true}
                clearable={false}
                openOnFocus={true}
              />
            </FormReactSelectContainer>
            <span style={{ color: '#505050', fontSize: 14, marginTop: 18 }}>
              {t('tab:Assigned User')}
            </span>
            {this.state.assignedTeamDialogUser &&
              this.state.assignedTeamDialogUser.map((item, index) => {
                return (
                  <div className="row expanded" key={index}>
                    <div className="small-6 columns">
                      <FormReactSelectContainer label="">
                        <Select
                          options={FormOptions.jobUserRoles}
                          value={item.permission}
                          onChange={(data) => {
                            this.changeDialogUserDivisied(data, index);
                          }}
                          simpleValue
                          noResultsText={''}
                          autoBlur={true}
                          clearable={false}
                          openOnFocus={true}
                        />
                      </FormReactSelectContainer>
                    </div>
                    <div className="small-5 columns">
                      <FormReactSelectContainer label="">
                        <Select
                          options={this.state.assignedTeamDialogUser}
                          value={item.userId}
                          simpleValue
                          disabled
                          noResultsText={''}
                          autoBlur={true}
                          clearable={false}
                          openOnFocus={true}
                        />
                      </FormReactSelectContainer>
                    </div>
                    <div
                      className="small-1 columns"
                      onClick={() => {
                        this.deleteDialogUser(index);
                      }}
                    >
                      <DeleteIcon style={{ marginTop: 4, color: '#8e8e8e' }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </MyDialog>
        <MyDialog
          show={this.state.confirmOpen}
          modalTitle={t('tab:Assigned User')}
          CancelBtnMsg={t('tab:Cancel')}
          SubmitBtnMsg={t('tab:Confirm')}
          CancelBtnShow={true}
          SubmitBtnShow={true}
          handleClose={this.handleConfirmClose}
          primary={this.cancelAssignedUser}
        >
          <p style={{ width: 400, height: 40 }}>
            {t('tab:Are you sure to empty Assigned Group/User')}
          </p>
        </MyDialog>

        {/* ipg job posting review and close*/}
        <MyDialog
          show={this.state.ipgOpen}
          modalTitle={
            this.state.ipgJobStatus === 'OPEN'
              ? this.state.ipgPost
                ? t('tab:Views Posted Job')
                : t('tab:Delete Posted Job')
              : t('tab:Post Job')
          }
          CancelBtnMsg={t('tab:Cancel')}
          SubmitBtnMsg={t('tab:Confirm')}
          CancelBtnShow={false}
          SubmitBtnShow={false}
          ipgCreate={this.state.ipgJobStatus !== 'OPEN'}
          ipgViewDetail={
            this.state.ipgPost && this.state.ipgJobStatus === 'OPEN'
          }
          ipgDelete={!this.state.ipgPost && this.state.ipgJobStatus === 'OPEN'}
          handleCancel={this.handleCancel}
          handleConfirm={this.handleConfirmIpg}
          handleCloseJob={this.handleCloseJob}
          handleCancelClose={this.handleCancelClose}
          handleViewDetail={this.handleViewDetail}
          //解决Editor组件search & replace input 无法获取焦点的bug
          disableEnforceFocus={true}
        >
          <div>
            <div>
              {/* {this.state.ipgJobStatus === 'OPEN' && (
                <p style={{ color: '#505050' }}>
                  In order to edit posted job, you need to uncheck the checkbox
                  to take down this job posting and then reselect it.
                </p>
              )} */}
              {this.state.ipgJobStatus !== 'OPEN' && (
                <p style={{ color: '#505050' }}>
                  {t(
                    'tab:Please enter job type and job description. It will show on IPG website'
                  )}
                </p>
              )}
              <FormReactSelectContainer
                label={t('tab:Job Type')}
                isRequired={true}
              >
                <Select
                  disabled={disabled || this.state.ipgJobStatus === 'OPEN'}
                  options={_jobType}
                  value={this.state.ipgJobType}
                  onChange={this.handleIpgJobTypeChange}
                  onBlur={() => {
                    if (removeErrorMsgHandler)
                      removeErrorMsgHandler('clientcontact');
                  }}
                  simpleValue
                  placeholder={t('tab:select')}
                  noResultsText={''}
                  autoBlur={true}
                  clearable={false}
                  openOnFocus={true}
                />
              </FormReactSelectContainer>
            </div>
          </div>
          <div>
            <div
              className="flex-child-auto flex-container flex-dir-column"
              style={{ overflow: 'inherit', width: 600 }}
            >
              <FormReactSelectContainer
                label={t('tab:Public Job Description')}
                isRequired={true}
              >
                {this.state.ipgJdEmpty && (
                  <p className={classes.formRrror}>
                    {t('message:Public Job Description is required')}
                  </p>
                )}
                <JobDescription
                  ipgJobStatus={this.state.ipgJobStatus}
                  disabled={disabled}
                  job={job}
                  t={t}
                  name="ipgJd"
                  onChange={this.handleipgJdChange}
                  value={this.state.ipgJd}
                  lang={i18n.language}
                />
              </FormReactSelectContainer>
            </div>
          </div>
        </MyDialog>
      </div>
    );
  }
}

const mapStateToProps = (state, { job }) => {
  const authorities = state.controller.currentUser.get('authorities');

  return {
    companyOptions: state.model.companiesOptions.toJS(),
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
    functionOptionsZh:
      state.controller.newSearchOptions.toJS().functionOptionsZh,
    functionOptions: state.controller.newSearchOptions.toJS().functionOptions,
    degreeOptions: state.controller.newSearchOptions.toJS().degreeOptions,
    languagesOptions: state.controller.newSearchOptions.toJS().languagesOptions,
    language: state.controller.language,
  };
};

export default withTranslation(['action', 'message', 'field', 'tab'])(
  connect(mapStateToProps)(withStyles(styles)(JobBasicForm))
);
