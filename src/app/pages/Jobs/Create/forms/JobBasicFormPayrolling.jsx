import React from 'react';
import { connect } from 'react-redux';
// import { getAllClientList } from '../../../../actions/clientActions';
// import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { getActiveClientList } from '../../../../selectors/clientSelector';
import memoizeOne from 'memoize-one';
import { getCompanyList } from '../../../../actions/clientActions';
import DatePicker from 'react-datepicker';

import FormInput from '../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import * as FormOptions from '../../../../constants/formOptions';
import Select from 'react-select';
import Immutable from 'immutable';
import Location from '../../../../components/jobLocation';
import * as apnSDK from '../../../../../apn-sdk/';
import { getClientCompanyOptionsArray } from '../../../../selectors/companySelector';
import { getClientContactByCompanyId } from '../../../../../apn-sdk/';

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
  autoBox: {
    '& .MuiFormControl-fullWidth': {
      borderColor: '#cc4b37 !important',
      backgroundColor: '#faedeb !important',
      border: '1px solid #cc4b37 !important',
    },
  },
};
let clientLoaded = false;
class JobBasicForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this._getStateFromProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.job !== this.props.job ||
      nextProps.disabled !== this.props.disabled
    ) {
      this.setState(this._getStateFromProps(nextProps, this.state));
    }
    this.fetchBriefUsersList();
  }

  _getStateFromProps = (props, state = {}) => {
    let locationArr = [];
    props.job.get('locations') &&
      props.job
        .get('locations')
        .toJS()
        .map((item, index) => {
          locationArr.push({
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
      status: state.status || props.job.get('status') || 'OPEN',
      jobType: state.jobType || props.job.get('jobType') || 'FULL_TIME',
      expLevels:
        state.expLevels ||
        (props.job.get('expLevels')
          ? props.job.get('expLevels').toSet().join(',')
          : ''),
      billRateUnitType:
        state.billRateUnitType || props.job.get('billRateUnitType') || 'HOURLY',
      payRateUnitType:
        state.payRateUnitType || props.job.get('payRateUnitType') || 'HOURLY',
      company: state.company || props.job.get('company') || null,
      companyId: state.companyId || props.job.get('companyId'),
      hiringManagerId:
        state.hiringManagerId || props.job.get('hiringManagerId'),
      hrId: state.hrId || props.job.get('hrId'),
      divisionId: state.divisionId || props.job.get('divisionId'),
      country: state.country || props.job.get('country'),
      companyIndustry:
        state.companyIndustry || props.job.get('companyIndustry'),
      clientcontact: state.clientcontact || props.job.get('clientcontact'),
      clientcontactname: state.clientcontactname || {},
      location:
        state.location || locationArr.length > 0
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
      groupUserList: state.groupUserList || [],
      clientContactNameList: state.clientContactNameList || [],
      assignedAmUser: state.assignedAmUser || '',
      prosecArr: state.prosecArr || [],
    };
  };

  componentDidMount() {
    // console.timeEnd('job form');
    // this.fetchClientList();
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

  handleContactChange = (clientcontact) => {
    console.log(clientcontact);
    this.setState({ clientcontact });
  };
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
  getLocation = (data) => {
    let str = [{}];
    if (data.show) {
      str[0].addressLine = null;
      str[0].city = data.city;
      str[0].province = data.province;
      str[0].country = data.country;
      str[0].location = null;
    } else {
      str[0].addressLine = null;
      str[0].city = null;
      str[0].province = null;
      str[0].country = null;
      str[0].location = data.trim();
    }
    this.setState({ location: str });
    if (this.props.removeErrorMsgHandler)
      this.props.removeErrorMsgHandler('location');
  };
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
  deleteGroupUser = (index) => {
    let arr = [...this.state.assignList];
    arr.splice(index, 1);
    this.setState({
      assignList: arr,
    });
    this.props.removeErrorMsgHandler('assignedUsers');
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

  render() {
    //console.time('job form');
    const {
      t,
      classes,
      disabled,
      job,
      errorMessage,
      companyOptions,
      removeErrorMsgHandler,
    } = this.props;
    const { companyId } = this.state;
    // const { companyOptions } = getCompanyOptions(companiesList);
    return (
      <div>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormInput
              name="title"
              label={t('field:jobTitle')}
              defaultValue={job.get('title')}
              disabled={disabled}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('title') : null}
              onBlur={() => {
                if (removeErrorMsgHandler) removeErrorMsgHandler('title');
              }}
            />
          </div>
        </div>
        <div>
          <input type="hidden" name="code" defaultValue={job.get('code')} />
          <input type="hidden" name="status" value={this.state.status || ''} />
          <input
            type="hidden"
            name="billRateFrom"
            defaultValue={job.get('billRateFrom')}
          />
          <input
            type="hidden"
            name="billRateTo"
            defaultValue={job.get('billRateTo')}
          />
          <input
            type="hidden"
            name="payRateFrom"
            defaultValue={job.get('payRateFrom')}
          />
          <input
            type="hidden"
            name="payRateTo"
            defaultValue={job.get('payRateTo')}
          />
          <input
            type="hidden"
            name="maxSubmissions"
            defaultValue={job.get('maxSubmissions')}
          />
          <input
            type="hidden"
            name="openings"
            defaultValue={job.get('openings')}
          />
          <input
            type="hidden"
            name="expLevels"
            value={this.state.expLevels || ''}
          />
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
          <div className="small-6 columns">
            <span>{t('field:location')}</span>
            <span style={{ color: '#CC4B37' }}> *</span>
            {/* {this.state.location.length === 0 ? (
              <Location
                getLocation={this.getLocation}
                city={this.state.location}
              />
            ) : null} */}

            <input
              type="hidden"
              name="location"
              value={this.state.location && JSON.stringify(this.state.location)}
            />
            {this.state.location.map((item, index) => {
              return (
                <div className="row expanded" key={item.id}>
                  <div
                    className={
                      index === 0 ? 'small-12 columns' : 'small-11 columns'
                    }
                  >
                    <div
                      className={
                        errorMessage.get('location') ? classes.autoBox : ''
                      }
                    >
                      <Location
                        getLocation={this.getLocation}
                        city={item.location}
                      />
                    </div>
                  </div>
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
          <input
            type="hidden"
            name="assignedUsers"
            value={
              this.state.assignList && JSON.stringify(this.state.assignList)
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
                        onClick={this.addAssigned}
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
          <p
            style={{
              color: '#CC4B37',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            {errorMessage ? errorMessage.get('assignedUsers') : null}
          </p>
        </div>
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
    // companyOptions: getClientCompanyOptionsArray(state, job.get('id')),
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

// const getCompanyOptions = memoizeOne((companiesList) => {
//   const companyOptions = Object.keys(companiesList.toJS()).map((v) =>({
//       value: parseInt(v, 10),
//       label: companiesList.toJS()[v].name,
//       industry: companiesList.toJS()[v].industry,
//     }));
//   return {
//     companyOptions,
//   };
// });
