import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';

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
import MyTooltip from '../../components/MyTooltip/myTooltip';
import JobTree from '../../components/jobTree';
import JobFunctionTree from '../../components/newCandidateTree';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import { isNum } from '../../../utils/search';
import ToolInfor from './toolTip';
import { getJobTypeLabel, JOB_TYPES } from '../../constants/formOptions';
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
};

class JobBasicForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this._getStateFromProps(props);
  }

  componentDidMount() {
    console.timeEnd('job form');
    // this.fetchClientList();
    this.fetchJobList();
    this.fetchBriefUsersList();
    this.fetchProjectTeamList();
    this.fetchDegreeList();
    this.fetchLanguageList();
  }

  fetchJobList = () => {
    apnSDK.getJobFunction().then((res) => {
      this.setState({ jobList: res.response });
    });
  };
  fetchDegreeList = () => {
    apnSDK.getAllDegree().then((res) => {
      this.setState({ degreeList: res.response });
    });
  };
  fetchLanguageList = () => {
    apnSDK.getAllLanguages().then((res) => {
      console.log(res);
      this.setState({ languageList: res.response });
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
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.fetchBriefUsersList();
  }

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

  _getStateFromProps = (props, state = {}) => {
    let locationArr = [];
    props.job.get('locations') &&
      props.job.get('locations').map((item, index) => {
        locationArr.push({
          id: index + 1,
          addressLine: '',
          city: '',
          country: '',
          province: '',
          location: item.location,
        });
      });
    return {
      startDate:
        state.startDate ||
        (props.job.get('startDate') && moment(props.job.get('startDate'))),
      endDate:
        state.endDate ||
        (props.job.get('endDate') && moment(props.job.get('endDate'))),
      billRateUnitType:
        state.billRateUnitType || props.job.get('billRateUnitType') || 'YEARLY',
      minValue:
        state.minValue || props.job.get('salaryRange')
          ? props.job.get('salaryRange').gte
          : null,
      maxValue:
        state.maxValue || props.job.get('salaryRange')
          ? props.job.get('salaryRange').lte
          : null,
      company: state.company || props.job.get('company') || null,
      companyId: state.companyId || props.job.get('companyId'),
      companyIndustry:
        state.companyIndustry || props.job.get('companyIndustry'),
      clientcontact: state.clientcontact || props.job.get('clientcontact'),
      clientcontactname: state.clientcontactname || {},
      skills: state.skills || props.job.get('skills') || null,
      switchFlag: state.switchFlag || false,
      switchFlagTwo: state.switchFlagTwo || false,
      assignedDisabled: state.assignedDisabled || false,
      locationList:
        state.locationList || locationArr.length > 0
          ? locationArr
          : [
              {
                addressLine: '',
                city: '',
                country: '',
                province: '',
                location: '',
              },
            ],
      assignList: state.assignList || [
        {
          firstName: props.currentUserFirstName,
          lastName: props.currentUserLastName,
          permission: 'AM',
          userId: props.currentUserId,
          username: props.currentUserUsername,
        },
      ],
      ratecurrency: state.ratecurrency || 'USD',
      open: state.open || false,
      additionalOne:
        state.additionalOne || props.job.get('minimumDegreeLevel')
          ? false
          : true,
      additionalTwo:
        state.additionalTwo || props.job.get('experienceYearRange')
          ? false
          : true,
      additionalThree:
        state.additionalThree || props.job.get('requiredLanguages')
          ? false
          : true,
      additionalFour: state.additionalFour || true,
      additionalFive:
        state.additionalFive || props.job.get('preferredSkills') ? false : true,
      jobCheckedList:
        state.jobCheckedList || props.job.get('jobFunctions') || [],
      jobList: state.jobList || [],
      groupUserList: state.groupUserList || [],
      clientContactNameList: state.clientContactNameList || [],
      assignedAmUser: state.assignedAmUser || '',
      assignedTeamList: state.assignedTeamList || [],
      assignedTeam: state.assignedTeam || '',
      assignedTeamDialogUser: state.assignedTeamDialogUser || [],
      degreeList: state.degreeList || [],
      languageList: state.languageList || [],
      degreeValue: state.degreeValue || props.job.get('minimumDegreeLevel'),
      reLanguageCheckedList:
        state.reLanguageCheckedList || props.job.get('requiredLanguages') || [],
      preLanguageCheckedList: state.preLanguageCheckedList || [],
      PreferredSkills:
        state.PreferredSkills || props.job.get('preferredSkills') || '',
      clientcontactUsername: state.clientcontactUsername || '',
      minYear:
        state.minYear || props.job.get('experienceYearRange')
          ? props.job.get('experienceYearRange').gte
          : '',
      maxYear:
        state.maxYear || props.job.get('experienceYearRange')
          ? props.job.get('experienceYearRange').lte
          : '',
      confirmOpen: state.confirmOpen || false,
      openings: state.openings || props.job.get('openings'),
      allowSubmit: state.allowSubmit,
      prosecArr: state.prosecArr || [],
    };
  };

  handleStartDateChange = (startDate) => {
    this.setState({ startDate });
  };
  handleEndDateChange = (endDate) => {
    this.setState({ endDate });
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
  // jobfunction对应方法，目前只是获取到选中id，良哥tree组件，还有点问题，需要继续看一下,ui显示问题
  handleJobFunctionChange = (jobCheckedList) => {
    let serviceType = jobCheckedList.map((job) => Number(job));
    this.setState({
      jobCheckedList: serviceType,
    });
    if (this.props.removeErrorMsgHandler)
      this.props.removeErrorMsgHandler('jobfunction');
  };
  // additional information里的对应方法
  handleReLanguageChange = (CheckedList) => {
    console.log(CheckedList);
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
    console.log(CheckedList);
    let serviceType = [];
    CheckedList.forEach((item) => {
      serviceType.push(item * 1);
    });
    this.setState({
      preLanguageCheckedList: serviceType,
    });
  };
  //company对应的方法,后台需要对应名字和id
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
        clientcontactUsername: '',
      });
    });
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
    console.log(arr);
  };
  addAssigned = () => {
    console.log(this.state);
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
  // 清空Group/User
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
    console.log(this.state);
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
    this.setState(
      {
        locationList: arr,
      },
      () => {
        console.log(this.state);
      }
    );
    console.log(arr);
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
    console.log('data', data);
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
  changeSetSkills = (skills) => {
    let arr = [];
    let add = this.state.skills ? [...this.state.skills] : [];
    arr =
      skills.trim() && skills.split(',').map((skill) => ({ skillName: skill }));
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
    arr =
      skills.trim() && skills.split(',').map((skill) => ({ skillName: skill }));
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
        maxValue: 1,
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
    console.log('number', number);

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
    console.log(number);
    if (number !== '0') {
      this.setState({ maxYear: number });
    }
    this.props.removeErrorMsgHandler('Years of Experience');
  };
  render() {
    console.time('job form');
    const {
      t,
      classes,
      disabled,
      job,
      errorMessage,
      companyOptions,
      isLimitUser,
      removeErrorMsgHandler,
    } = this.props;
    // console.log(job, clientList);
    // const { companyOptions } = getCompanyOptions(
    //   companiesList
    // );
    let AmValue = false;
    this.state.assignedTeamDialogUser &&
      this.state.assignedTeamDialogUser.map((item) => {
        if (item.resOne === 'Owner') {
          AmValue = true;
          this.setState({ assignedAmUser: item.resTwo });
        }
      });
    return (
      <div>
        <div
          style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}
        >
          <p style={{ color: '#777777', fontSize: 16, marginRight: 10 }}>
            Create Job: {getJobTypeLabel(JOB_TYPES.Contract)}
          </p>
          <MyTooltip title={<ToolInfor />}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                borderLeft: '0.5px solid #dee0e3',
                paddingLeft: 10,
              }}
            >
              <InfoIcon color="disabled" fontSize="small" />
              <span style={{ color: '#777777', fontSize: 13 }}>
                AM Checklist
              </span>
            </div>
          </MyTooltip>
        </div>

        <div className="row expanded">
          <div className="small-12 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              name="title"
              label={t('field:jobTitle')}
              defaultValue={job.get('title')}
              isRequired={true}
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
              isRequired={true}
              value={this.state.openings}
              onChange={this.changeOpening}
              placeholder="Enter a number"
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
              value={this.state.allowSubmit}
              onChange={(e) => {
                this.changeAllowSubmit(e);
              }}
              placeholder="Enter a number"
            />
          </div>
          <div className="small-3 columns">
            <FormInput
              name="jobCode"
              label={t('field:code')}
              placeholder="Enter a number"
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
              defaultValue={job.get('department') || ''}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 row">
            <div className="columns">
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
                  placeholder="Select category"
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
            <div className="columns">
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
          <div className="small-6 columns" style={{ position: 'relative' }}>
            <p
              style={{
                position: 'absolute',
                right: '6px',
                color: '#3398dc',
                cursor: 'pointer',
              }}
              onClick={this.addLocation}
            >
              Add
            </p>
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
                addressLine = addressLine + ', ' + item.province;
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
                      onClick={() => {
                        this.deleteSingleLocation(index);
                      }}
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
            />
          </div>

          <div className="small-6 row">
            <div className="columns">
              <FormReactSelectContainer
                label={t('field:ratecurrency')}
                isRequired={true}
              >
                <Select
                  labelKey={'label2'}
                  options={FormOptions.currency}
                  value={this.state.ratecurrency}
                  onChange={(ratecurrency) => this.setState({ ratecurrency })}
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
            <div className="columns">
              <FormReactSelectContainer label="Unit Type" isRequired={true}>
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
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="billRateUnitType"
                value={this.state.billRateUnitType}
              />
            </div>
          </div>
        </div>
        <div className="row expanded small-collapse">
          <div className="small-6 columns">
            <div className="row expanded">
              <div className=" columns">
                <FormInput
                  label={t('field:billRate')}
                  name="billRateFrom"
                  placeholder="Min"
                  type="number"
                  min="0"
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
                  label="&nbsp;"
                  name="billRateTo"
                  placeholder="Max"
                  type="number"
                  min={this.state.billMinValue || 0}
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
                  label={t('field:payRate')}
                  name="payRateFrom"
                  placeholder="Min"
                  type="number"
                  min="0"
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
                  label="&nbsp;"
                  name="payRateTo"
                  placeholder="Max"
                  type="number"
                  min={this.state.minValue || 0}
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
                jobData={this.state.jobList}
                selected={this.state.jobCheckedList}
                sendServiceType={this.handleJobFunctionChange}
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
                placeholder="Required Skills"
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
          <div style={{ position: 'absolute', right: '-4px', top: '-10px' }}>
            Only visible to you
            <Switch
              checked={this.state.switchFlag}
              onChange={this.handleSwitch}
              color="primary"
              name="checkedB"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          </div>
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
                        disabled={this.state.switchFlag}
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
                        disabled={this.state.switchFlag}
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
                          this.state.switchFlag ? null : this.addAssigned
                        }
                      />
                    </div>
                  ) : (
                    <div className="small-1 columns">
                      <DeleteIcon
                        style={{ marginTop: 4, color: '#8e8e8e' }}
                        onClick={() => {
                          this.deleteGroupUser(index);
                        }}
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
              {this.state.switchFlag ? null : (
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
                  Add user from program team
                </p>
              )}

              {/* <InfoIcon color="disabled" fontSize="small" /> */}
            </div>
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
          Additional Information
        </p>
        <p
          style={{
            color: '#939393',
            fontSize: 13,
            lineHeight: '15px',
            marginBottom: '16px',
          }}
        >
          Filling in more job information can get more accurate candidate
          recommendation.
        </p>
        <div className="row expanded" style={{ display: 'felx' }}>
          {this.state.additionalOne ? null : (
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:Degree Requirement')}>
                <Select
                  options={this.state.degreeList}
                  value={this.state.degreeValue}
                  onChange={(degreeValue) => this.setState({ degreeValue })}
                  simpleValue
                  noResultsText={''}
                  autoBlur={true}
                  clearable={true}
                  openOnFocus={true}
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
                  Fresh Graduates
                  <Switch
                    checked={this.state.switchFlagTwo}
                    onChange={this.handleSwitchTwo}
                    color="primary"
                    name="checkedA"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                </div>
                <div className=" columns">
                  <FormInput
                    label={t('field:Years of Experience')}
                    name="minYear"
                    placeholder="Min Year"
                    value={this.state.minYear}
                    onChange={(e) => {
                      this.changeMinYear(e);
                    }}
                    disabled={this.state.switchFlagTwo}
                  />
                </div>
                <div>
                  <div style={{ paddingTop: 21, lineHeight: '32px' }}>-</div>
                </div>
                <div className=" columns">
                  <FormInput
                    label="&nbsp;"
                    name="maxYear"
                    placeholder="Max Year"
                    value={this.state.maxYear}
                    onChange={(e) => {
                      this.changeMaxYear(e);
                    }}
                    disabled={this.state.switchFlagTwo}
                  />
                </div>
              </div>
              <span
                style={{
                  color: '#CC4B37',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                }}
              >
                {errorMessage ? errorMessage.get('Years of Experience') : null}
              </span>
            </div>
          )}
          {this.state.additionalThree ? null : (
            <div className="small-6 columns">
              <span style={{ fontSize: 12 }}>
                {t('field:Required Languages')}
              </span>
              <JobTree
                jobData={this.state.languageList}
                selected={this.state.reLanguageCheckedList}
                sendServiceType={this.handleReLanguageChange}
                show={true}
              />
            </div>
          )}
          {this.state.additionalFour ? null : (
            <div className="small-6 columns">
              <span style={{ fontSize: 12 }}>
                {t('field:Preferred Languages')}
              </span>
              <JobTree
                jobData={this.state.languageList}
                selected={this.state.preLanguageCheckedList}
                sendServiceType={this.handlePreLanguageChange}
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
                  multi
                  simpleValue
                  placeholder="Preferred Skills"
                  onChange={(PreferredSkills) => {
                    this.changeRequireSkills(PreferredSkills);
                  }}
                  promptTextCreator={(label) =>
                    `${t('field:skillsCreat')} "${label}"`
                  }
                  noResultsText={false}
                  onBlur={() => {
                    if (removeErrorMsgHandler)
                      removeErrorMsgHandler('preferredSkills');
                  }}
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
          <input
            type="hidden"
            name="switchFlagTwo"
            value={
              this.state.switchFlagTwo &&
              JSON.stringify(this.state.switchFlagTwo)
            }
          />
          <input type="hidden" name="minYears" value={this.state.minYear} />
          <input type="hidden" name="maxYears" value={this.state.maxYear} />
          {this.state.additionalOne ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={() => {
                this.setState({ additionalOne: false });
              }}
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>Degree Requirement</p>
            </div>
          ) : null}
          {this.state.additionalTwo ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={() => {
                this.setState({ additionalTwo: false });
              }}
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>Years of Experience</p>
            </div>
          ) : null}
          {this.state.additionalThree ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={() => {
                this.setState({ additionalThree: false });
              }}
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>Required Languages</p>
            </div>
          ) : null}
          {this.state.additionalFour ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={() => {
                this.setState({ additionalFour: false });
              }}
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>Preferred Languages</p>
            </div>
          ) : null}
          {this.state.additionalFive ? (
            <div
              className="small-4 columns"
              style={{ display: 'flex', marginBottom: 13, cursor: 'pointer' }}
              onClick={() => {
                this.setState({ additionalFive: false });
              }}
            >
              <AddCircleIcon style={{ color: '#8e8e8e' }} fontSize="small" />
              <p className={classes.font}>Preferred Skills</p>
            </div>
          ) : null}
        </div>

        <MyDialog
          show={this.state.open}
          modalTitle={'Add Assigned User'}
          CancelBtnMsg={'Cancel'}
          SubmitBtnMsg={'Confirm'}
          SubmitBtnShow={true}
          CancelBtnShow={true}
          handleClose={this.handleClose}
          primary={this.insertToGroupUser}
        >
          <div style={{ width: 667, minHeight: 559 }}>
            <FormReactSelectContainer label={t('field:Select a program team')}>
              <Select
                options={this.state.assignedTeamList}
                value={this.state.assignedTeam}
                onChange={this.changeAssignedTeam}
                placeholder="Select a program team"
                simpleValue
                noResultsText={''}
                autoBlur={true}
                clearable={false}
                openOnFocus={true}
              />
            </FormReactSelectContainer>
            <span style={{ color: '#505050', fontSize: 14, marginTop: 18 }}>
              Assigned User
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
                          disabled
                          simpleValue
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
          modalTitle={'Assigned User'}
          CancelBtnMsg={'Cancel'}
          SubmitBtnMsg={'Confirm'}
          CancelBtnShow={true}
          SubmitBtnShow={true}
          handleClose={this.handleConfirmClose}
          primary={this.cancelAssignedUser}
        >
          <p style={{ width: 400, height: 40 }}>
            Are you sure to empty Assigned Group/User？
          </p>
        </MyDialog>
      </div>
    );
  }
}

const mapStateToProps = (state, { job }) => {
  const authorities = state.controller.currentUser.get('authorities');
  const currentUserId = state.controller.currentUser.get('id');
  const currentUserFirstName = state.controller.currentUser.get('firstName');
  const currentUserLastName = state.controller.currentUser.get('lastName');
  const currentUserUsername = state.controller.currentUser.get('username');
  return {
    companyOptions: state.model.companiesOptions.toJS(),
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    currentUserId: currentUserId,
    currentUserFirstName: currentUserFirstName,
    currentUserLastName: currentUserLastName,
    currentUserUsername: currentUserUsername,
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
};
export default connect(mapStateToProps)(withStyles(styles)(JobBasicForm));
