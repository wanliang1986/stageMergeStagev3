import React, { Component } from 'react';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../components/particial/FormInput';
import Select from 'react-select';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { connect } from 'react-redux';
import PotentialServiceTypeSelect from './PotentialServiceTypeSelect/PotentialServiceTypeSelect';
import TeamMember from '../Form/TeamMember/TeamMember';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';
import lodash from 'lodash';

class BDInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bdCommission:
        (props.companyInfo &&
          this.setBdCommissionFullName(
            props.companyInfo.businessDevelopmentOwner
          )) ||
        '',
      ownerCommission:
        (props.companyInfo &&
          this.setownersFullName(props.companyInfo.salesLeadsOwner)) ||
        '',
      serviceTypeSelect: props.companyInfo.companyServiceTypes,
      accountManager: [],
      value: '',
    };
  }

  componentDidMount() {
    if (this.props.companyInfo.accountManagers) {
      let newAccountManager = this.checkedMember(
        this.props.companyInfo.accountManagers
      );
      this.setState({
        accountManager: newAccountManager,
      });
    }
  }

  setBdCommissionFullName = (bd) => {
    let newBd = bd.map((item, index) => {
      return {
        ...item,
      };
    });
    return newBd;
  };

  setownersFullName = (owner) => {
    let owners = owner.map((item, index) => {
      return {
        ...item,
      };
    });
    if (owners.length > 0) {
      return owners;
    } else {
      return (owners = [{}]);
    }
  };

  sendServiceType = (checkedList) => {
    console.log(checkedList);
    let checkedId = [];
    checkedList.forEach((item, index) => {
      checkedId.push(item.id);
    });
    this.setState({
      serviceTypeSelect: checkedId,
    });
    // this.props.removeErrorMsgHandler('ServiceType');
    this.props.setServiceType(checkedId);
  };

  delete = (data, filtedData, type, index) => {
    if (type === 'DBOwner') {
      let newBdCommission = lodash.cloneDeep(this.state.bdCommission);
      newBdCommission.splice(index, 1);
      this.setState({
        bdCommission: newBdCommission,
      });
      this.props.setBdCommission(newBdCommission);
    } else {
      let newOwnerCommission = JSON.parse(
        JSON.stringify(this.state.ownerCommission)
      );
      newOwnerCommission.splice(index, 1);
      this.setState({
        ownerCommission: newOwnerCommission,
      });
      this.props.ownerCommission(newOwnerCommission);
    }
  };

  setCommissions = (type) => {
    const { bdCommission, ownerCommission } = this.state;

    let filtedData = [];
    if (type === 'DBOwner') {
      filtedData = bdCommission;
    } else {
      filtedData = ownerCommission;
    }

    return (
      <div style={{ flex: 3 }}>
        {filtedData.map((data, index) => {
          return this.renderCommission(data, filtedData.length, type, index);
        })}
      </div>
    );
  };
  setName = (user, filtedData, index, type) => {
    if (!user.userId) {
      user.userId = user.id;
      user.contribution = 0;
    }
    let _user = {
      userId: user.userId,
      fullName: user.fullName,
      salesLeadRoleType:
        type === 'DBOwner' ? 'BUSINESS_DEVELOPMENT' : 'SALES_LEAD_OWNER',
      contribution: 0,
    };
    filtedData[index] = _user;
    if (type === 'DBOwner') {
      this.setState({
        bdCommission: filtedData,
      });
      // this.props.removeErrorMsgHandler('bDOwner');
      this.props.setBdCommission(this.state.bdCommission);
    } else {
      this.setState({
        ownerCommission: filtedData,
      });
      // this.props.removeErrorMsgHandler('salesLeadOwner');
      this.props.ownerCommission(this.state.ownerCommission);
    }
  };

  setpercentage = (num, filtedData, index, type) => {
    if (type === 'DBOwner') {
      let newBdCommission = lodash.cloneDeep(this.state.bdCommission);
      newBdCommission[index].contribution = Number(num);
      this.setState({
        bdCommission: newBdCommission,
      });
      // this.props.removeErrorMsgHandler('bDOwnerContribution');
      // this.props.removeErrorMsgHandler('ServiceTypeValidate');
      this.props.setBdCommission(newBdCommission);
    } else {
      let newOwnerCommission = JSON.parse(
        JSON.stringify(this.state.ownerCommission)
      );
      newOwnerCommission[index].contribution = Number(num);
      this.setState({
        ownerCommission: newOwnerCommission,
      });
      // this.props.removeErrorMsgHandler('salesLeadOwnerContribution');
      // this.props.removeErrorMsgHandler('ServiceTypeValidate');
      this.props.ownerCommission(newOwnerCommission);
    }
  };
  renderCommission = (data, size, type, index) => {
    const { bdCommission, ownerCommission, edit, user } = this.state;
    const {
      userList,
      percentageError,
      ownerError,
      salesLeadIndex,
      errorMessage,
    } = this.props;

    let filtedData = [];
    let stateKey = '';
    if (type === 'DBOwner') {
      filtedData = bdCommission;
      stateKey = 'DBOwnerData';
    } else {
      filtedData = ownerCommission;
      stateKey = 'salesLeadOwnerData';
    }

    const hasError = (arr, index) => {
      let _arr = arr.filter((_item, _index) => {
        return _item.salesLeadIndex === index && _item.errorMessage === true;
      });
      if (_arr.length > 0) {
        return true;
      }
      return false;
    };

    return (
      <>
        <div className="row expanded" key={data.fullName}>
          {/* 1.选择用户 */}
          <div className="small-6 columns">
            <FormReactSelectContainer
              errorMessage={
                errorMessage &&
                errorMessage.get('ownerError') &&
                hasError(ownerError, salesLeadIndex)
              }
            >
              <Select
                labelKey="fullName"
                valueKey="fullName"
                value={data.fullName}
                onChange={(user) => {
                  this.setName(user, filtedData, index, type);
                }}
                // simpleValue
                options={userList.toJS()}
                autoBlur
                clearable={false}
                // isLoading={}
              />
            </FormReactSelectContainer>
          </div>

          {/* 2.分配比例 */}
          <div className="small-5 columns">
            <FormInput
              name="commissions.commissionPct"
              value={data ? data.contribution : 0}
              onChange={(e) => {
                let num = Number(e.target.value);
                this.setpercentage(num, filtedData, index, type);
              }}
              type="number"
              min={0}
              max={100}
              step={5}
              errorMessage={
                errorMessage &&
                errorMessage.get('percentageError') &&
                this.hasError(percentageError, salesLeadIndex)
              }
            />
          </div>
          {/* 3.删除/新增一项 */}
          <div className="small-1 columns horizontal-layout align-self-top">
            {/* 新增 */}
            {index === 0 ? (
              <IconButton
                disabled={edit}
                size="small"
                onClick={() => {
                  filtedData.push({
                    contribution: 0,
                  });
                  this.setState({
                    [stateKey]: filtedData.slice(),
                  });
                  if (type === 'DBOwner') {
                    this.props.setBdCommission(filtedData);
                  } else {
                    this.props.ownerCommission(filtedData);
                  }
                }}
              >
                {/* 新增 */}
                <AddCircleIcon />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                disabled={edit || size <= 1}
                onClick={() => {
                  if (size > 1)
                    // this.setState({
                    //     [stateKey]: filtedData.filter((c) =>c !== data),
                    // });
                    this.delete(data, filtedData, type, index);
                }}
              >
                <Delete />
              </IconButton>
            )}
          </div>
        </div>
      </>
    );
  };

  checkedMember = (companyInfo) => {
    if (companyInfo) {
      let newcheckedMember = companyInfo.map((item, index) => {
        return {
          ...item,
        };
      });
      return newcheckedMember;
    } else {
      return null;
    }
  };
  handleCheck = (user) => {
    let newAccountManager = JSON.parse(
      JSON.stringify(this.state.accountManager)
    );
    console.log(this.state.accountManager);
    let userIndex = null;
    if (newAccountManager.length > 0) {
      if (
        newAccountManager.some((item, index) => {
          if (item.userId === user.get('id')) {
            userIndex = index;
            return true;
          }
        })
      ) {
        newAccountManager.splice(userIndex, 1);
      } else {
        let _user = {
          userId: user.get('id'),
          fullName: user.get('fullName'),
          salesLeadRoleType: 'ACCOUNT_MANAGER',
        };
        newAccountManager.push(_user);
      }
    } else {
      let _user = {
        userId: user.get('id'),
        fullName: user.get('fullName'),
        salesLeadRoleType: 'ACCOUNT_MANAGER',
      };
      newAccountManager.push(_user);
    }

    // newAccountManager.push(user.toJS());
    this.setState({
      accountManager: newAccountManager,
    });
    this.props.removeErrorMsgHandler('accountManager');
    this.props.setAccountManager(newAccountManager);
  };

  hasError = (arr, index) => {
    let _arr = arr.filter((_item, _index) => {
      return _item.salesLeadIndex === index && _item.errorMessage === true;
    });
    if (_arr.length > 0) {
      return true;
    }
    return false;
  };

  render() {
    const {
      companyInfo,
      serviceTypeTree,
      userList,
      errorMessage,
      serviceTypeError,
      accountManagerError,
      salesLeadIndex,
      t,
    } = this.props;
    const { value, serviceTypeSelect } = this.state;
    return (
      <>
        <div className="row expanded">
          <div className="small-6 columns">
            <PotentialServiceTypeSelect
              t={t}
              data={serviceTypeTree}
              width={'100%'}
              value={value}
              selected={serviceTypeSelect}
              sendServiceType={(checkedList) => {
                this.sendServiceType(checkedList);
              }}
              errorMessage={errorMessage}
              serviceTypeError={serviceTypeError}
              salesLeadIndex={salesLeadIndex}
            />
            {errorMessage &&
            errorMessage.get('serviceType') &&
            this.hasError(serviceTypeError, salesLeadIndex) ? (
              <span
                style={{
                  color: '#cc4b37',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto',
                }}
              >
                {errorMessage.get('serviceType')}
              </span>
            ) : null}
          </div>
          <div className="small-6 columns">
            <TeamMember
              label={t('field:accountManager')}
              checkedMember={this.state.accountManager}
              accountManagerError={accountManagerError}
              salesLeadIndex={salesLeadIndex}
              errorMessage={errorMessage}
              teamMember={userList}
              handleCheck={(user) => {
                this.handleCheck(user);
              }}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label="BD Owner"
              isRequired
            ></FormReactSelectContainer>
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              isRequired
              label={`BD Owner Contribution%`}
              icon={
                <Tooltip
                  title={
                    'Please make sure all BD Owner Contribution% add up to 50%'
                  }
                  arrow
                  placement="top-end"
                >
                  <Info />
                </Tooltip>
              }
            ></FormReactSelectContainer>
          </div>
        </div>
        {this.setCommissions('DBOwner')}

        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label="Sales Lead Owner"
              isRequired
            ></FormReactSelectContainer>
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              isRequired
              label="Sales Lead Owner Contribution%"
              icon={
                <Tooltip
                  title={
                    'Please make sure all Sales Lead Owner Contribution% add up to 50%'
                  }
                  arrow
                  placement="top-end"
                >
                  <Info />
                </Tooltip>
              }
            ></FormReactSelectContainer>
          </div>
        </div>
        {this.setCommissions('Sales Lead Owner')}
      </>
    );
  }
}

export default BDInformation;
