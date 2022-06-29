import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import lodash from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import { getTenantUserArray } from '../../../../../selectors/userSelector';
import { connect } from 'react-redux';

const styles = {
  root: {
    '& .MuiGrid-spacing-xs-3 > .MuiGrid-item': {
      padding: '5px',
    },
  },
};

// const userList = [
//   { id: 111, name: '111' },
//   { id: 2, name: '222' },
// ];

const userRole = [
  {
    value: 'AM',
    label: 'AM',
    disabled: false,
  },
  {
    value: 'RECRUITER',
    label: 'Recruiter',
    disabled: true,
  },
  {
    value: 'SOURCER',
    label: 'Sourcer',
    disabled: true,
  },
  {
    value: 'AC',
    label: 'Account Coordinator',
    disabled: true,
  },
  { value: 'DELIVERY_MANAGER', label: 'DM', disabled: true },
  {
    value: 'OWNER',
    label: 'Owner',
    disabled: true,
  },
];

class AssignedUserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssignedUserList: this.props.userInfo,
      AmUserList: [{}],
      otherList: [{}],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.userInfo) !== JSON.stringify(this.props.userInfo)
    ) {
      this._setBillInfoState(nextProps.userInfo);
    }
  }
  componentDidMount() {
    this._setBillInfoState(this.props.userInfo);
  }
  _setBillInfoState = (userInfo) => {
    this.setState(
      {
        AssignedUserList: userInfo,
      },
      () => {
        const { AssignedUserList } = this.state;
        let _amuserList =
          AssignedUserList &&
          AssignedUserList.filter((item, index) => {
            return item.userRole === 'AM';
          });
        let _otherList =
          AssignedUserList &&
          AssignedUserList.filter((item, index) => {
            return item.userRole !== 'AM';
          });
        this.setState({
          AmUserList: _amuserList,
          otherList: _otherList,
        });
      }
    );
  };
  addAm = () => {
    const { AmUserList } = this.state;
    let _amuserList = lodash.cloneDeep(AmUserList);
    let obj = {
      userRole: 'AM',
    };
    _amuserList.push(obj);
    this.setState({
      AmUserList: _amuserList,
    });
  };
  deletdAm = (index) => {
    const { AmUserList } = this.state;
    let _amuserList = lodash.cloneDeep(AmUserList);
    _amuserList.splice(index, 1);
    this.setState({
      AmUserList: _amuserList,
    });
  };
  changeName = (value, index) => {
    const { AmUserList } = this.state;
    let _amuserList = lodash.cloneDeep(AmUserList);
    _amuserList[index].userId = value.id;
    _amuserList[index].fullName = value.fullName;
    this.setState({
      AmUserList: _amuserList,
    });
  };
  changeSplit = (e, index) => {
    const { AmUserList } = this.state;
    let _amuserList = lodash.cloneDeep(AmUserList);
    _amuserList[index].percentage = e.target.value;
    this.setState({
      AmUserList: _amuserList,
    });
  };
  render() {
    const { AssignedUserList, AmUserList, otherList } = this.state;
    const { t, classes, pageType, errorMessage, userList, index, editType } =
      this.props;
    return (
      <div className={classes.root} key={`userInfo_${index}`}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <span style={{ fontSize: '0.75em' }}>
              {t('field:userRole')}
              <label
                style={{
                  fontSize: '12px',
                  color: 'red',
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                }}
              >
                *
              </label>
            </span>
          </Grid>
          <Grid item xs={3}>
            <span style={{ fontSize: '0.75em' }}>
              {t('field:userName')}{' '}
              <label
                style={{
                  fontSize: '12px',
                  color: 'red',
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                }}
              >
                *
              </label>
            </span>
          </Grid>
          <Grid item xs={3}>
            <span style={{ fontSize: '0.75em' }}>
              {t('field:commissionSplit')}{' '}
              <label
                style={{
                  fontSize: '12px',
                  color: 'red',
                  verticalAlign: 'middle',
                  marginLeft: '2px',
                }}
              >
                *
              </label>
            </span>
          </Grid>
        </Grid>
        {AmUserList &&
          AmUserList.map((item, index) => {
            return (
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <FormReactSelectContainer>
                    <Select
                      searchable
                      value={item.userRole}
                      valueKey={'value'}
                      labelKey={'label'}
                      options={userRole}
                      clearable={false}
                      autoBlur={true}
                      disabled={pageType === 'history' || !editType}
                    />
                  </FormReactSelectContainer>
                </Grid>
                <Grid item xs={3}>
                  <FormReactSelectContainer>
                    <Select
                      searchable
                      value={item.userId}
                      valueKey={'id'}
                      labelKey={'fullName'}
                      options={userList}
                      clearable={false}
                      autoBlur={true}
                      onChange={(value) => {
                        this.changeName(value, index);
                      }}
                      onFocus={() =>
                        this.props.removeErrorMsgHandler('assignedUser')
                      }
                      disabled={pageType === 'history' || !editType}
                    />
                  </FormReactSelectContainer>
                </Grid>
                <Grid item xs={3}>
                  <FormInput
                    name="Split"
                    value={item.percentage && item.percentage}
                    disabled={pageType === 'history' || !editType}
                    onChange={(e) => {
                      this.changeSplit(e, index);
                    }}
                    onBlur={() =>
                      this.props.removeErrorMsgHandler('assignedUser')
                    }
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    aria-label="delete"
                    style={{ paddingTop: '5px' }}
                    disabled={pageType === 'history' || !editType}
                    onClick={() => {
                      this.addAm();
                    }}
                  >
                    <AddIcon style={{ color: '#3598dc' }} />
                  </IconButton>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    aria-label="delete"
                    style={{ paddingTop: '5px' }}
                    disabled={pageType === 'history' || AmUserList.length === 1}
                    onClick={() => {
                      this.deletdAm(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
                <div
                  style={{
                    margin: '-15px 0px 10px 0px',
                    fontSize: '12px',
                    paddingLeft: '5px',
                    color: '#cc4b37',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage && errorMessage.get('assignedUser')}
                </div>
              </Grid>
            );
          })}
        {otherList &&
          otherList.map((item, index) => {
            return (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <FormReactSelectContainer>
                      <Select
                        searchable
                        value={item.userRole}
                        valueKey={'value'}
                        labelKey={'label'}
                        options={userRole}
                        clearable={false}
                        autoBlur={true}
                        disabled
                      />
                    </FormReactSelectContainer>
                  </Grid>
                  <Grid item xs={3}>
                    <FormReactSelectContainer>
                      <Select
                        searchable
                        value={item.userId}
                        valueKey={'id'}
                        labelKey={'fullName'}
                        options={userList}
                        clearable={false}
                        autoBlur={true}
                        disabled
                      />
                    </FormReactSelectContainer>
                  </Grid>
                  <Grid item xs={3}>
                    <FormInput value={item.percentage} disabled />
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      aria-label="delete"
                      style={{ paddingTop: '5px' }}
                      disabled
                    >
                      <AddIcon disabled />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton
                      aria-label="delete"
                      style={{ paddingTop: '5px' }}
                      disabled
                    >
                      <DeleteIcon disabled />
                    </IconButton>
                  </Grid>
                </Grid>
              </>
            );
          })}

        <input
          name="AmUserList"
          type="hidden"
          value={AmUserList && JSON.stringify(AmUserList)}
          form="billinforForm"
        />
        <input
          name="otherList"
          type="hidden"
          value={otherList && JSON.stringify(otherList)}
          form="billinforForm"
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userList: getTenantUserArray(state),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(AssignedUserForm));
