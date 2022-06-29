import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import * as apnSDK from '../../../apn-sdk/';
import FormInput from '../../components/particial/FormInput';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import * as FormOptions from '../../constants/formOptions';
import Select from 'react-select';
import Immutable from 'immutable';
import Location from '../../components/jobLocation';
import DeleteIcon from '@material-ui/icons/Delete';

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

  _getStateFromProps = (props, state = {}) => {
    return {
      status: state.status || props.job.get('status') || 'OPEN',
      priority: state.priority || props.job.get('priority'),
      company:
        state.company || props.job.get('company')
          ? props.job.get('company').toJS().name
          : null,
      companyId:
        state.companyId || props.job.get('company')
          ? props.job.get('company').toJS().id
          : null,
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
      locationList:
        state.locationList || props.job.get('locations')
          ? props.job.get('locations').toJS()
          : [],
      assignList:
        state.assignList || props.job.get('assignedUsers')
          ? props.job.get('assignedUsers').toJS()
          : [],
      groupUserList: state.groupUserList || [],
      clientContactNameList: state.clientContactNameList || [],
      assignedAmUser: state.assignedAmUser || '',
      assignedTeamList: state.assignedTeamList || [],
      assignedTeam: state.assignedTeam || '',
      assignedTeamDialogUser: state.assignedTeamDialogUser || [],
      clientcontactUsername:
        state.clientcontactUsername || props.job.get('clientContactName')
          ? props.job.get('clientContactName').toJS().name
          : null,
      prosecArr: state.prosecArr || [],
    };
  };

  componentDidMount() {
    console.timeEnd('job form');
    // this.fetchClientList();
    this.fetchBriefUsersList();
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
  }

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

  deleteGroupUser = (index) => {
    let arr = [...this.state.assignList];
    arr.splice(index, 1);
    this.setState({
      assignList: arr,
    });
    this.props.removeErrorMsgHandler('assignedUsers');
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
    if (data.show) {
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
    const { companyId } = this.state;
    // const {companyOptions } = getCompanyOptions(companiesList);
    this.state.assignedTeamDialogUser &&
      this.state.assignedTeamDialogUser.map((item) => {
        if (item.resOne === 'Owner') {
          this.setState({ assignedAmUser: item.resTwo });
        }
      });
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
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <div className="row expanded">
              <div className=" columns">
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
          <div className="small-6 columns">
            <span>{t('field:location')}</span>
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
                        getLocation={(data) => {
                          this.getSingleLocation(data, index);
                        }}
                        city={addressLine || item.location}
                        disabled={disabled}
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
                      isRequired={index === 0}
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
                        onClick={disabled ? null : this.addAssigned}
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

  return {
    companyOptions: state.model.companiesOptions.toJS(),
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
};
export default connect(mapStateToProps)(withStyles(styles)(JobBasicForm));
