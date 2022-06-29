import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import FormInput from '../../particial/FormInput';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import Select from 'react-select';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import FormTextArea from '../../../components/particial/FormTextArea';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Tooltip from '@material-ui/core/Tooltip';
import Info from '@material-ui/icons/Info';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import Checkbox from '@material-ui/core/Checkbox';
import Immutable from 'immutable';
import { List } from 'immutable';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { levelList } from '../../../constants/formOptions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Attachment from '../../../pages/Companies/IndividualCompany/Attachment';
import { isEmail, formatBy2, makeCancelable } from '../../../../utils/index';

import PotentialServiceTypeSelect from '../../../pages/Companies/Form/PotentialServiceTypeSelect/PotentialServiceTypeSelect';
import '../../../pages/Companies/Form/PotentialServiceTypeSelect/index.css';
import { getUploadContractUrl } from '../../../../apn-sdk/client';
import { prospectUpgrade } from '../../../actions/clientActions';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import PrimaryButton from '../../particial/PrimaryButton';
import lodash from 'lodash';
import { withTranslation } from 'react-i18next';
const history = createBrowserHistory();
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0px',
      height: '32px',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: 12,
    },
    '& .MuiCheckbox-root': {
      padding: '9px 3px 9px 9px',
    },
    '& .MuiAutocomplete-input': {
      padding: '0 4px !important',
    },
  },
  signee: {
    marginBottom: '8px',
    '& fieldset': {
      borderRadius: '0px',
    },
    '& div.MuiOutlinedInput-root': {
      paddingTop: '0px',
      paddingBottom: '0px',
      height: '40px',
    },
    '& input': {
      fontSize: '12px',
      color: '#505050',
    },
  },
};

class RadioLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getLeadOwner = (option) => {
    let saleLeadOwner = option.saleLeadOwner;
    let salesLeadOwner = [];
    saleLeadOwner.forEach((item, index) => {
      let owner = item.firstName + '' + item.lastName;
      salesLeadOwner.push(owner);
    });
    return salesLeadOwner.join(',');
  };

  getServiceType = (option) => {
    let serviceTypes = option.serviceTypes;
    let serviceTypeList = [];
    serviceTypes.forEach((item, index) => {
      let type = item.value;
      serviceTypeList.push(type);
    });
    return serviceTypeList.join(',');
  };
  render() {
    const { option, salesLead } = this.props;
    return (
      <>
        <Typography variant="h7" gutterBottom>
          {this.props.t('tab:Sales Lead')}
          {option.index + 1}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {this.props.t('tab:Estimated Deal Time')}:{' '}
          {moment(option.estimatedDealTime).format('YYYY-MM-DD')}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Sales Lead Owner: {this.getLeadOwner(option)}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          Potential Service Type: {this.getServiceType(option)}
        </Typography>
      </>
    );
  }
}

class UpgradeClientSecond extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      value: '',
      file: '',
      fileName: '',
      s3Key: null,
      uploadingFile: false,
      addressList: [
        {
          address: '11',
          address2: null,
          addressType: 'CLIENT_CONTACT',
          city: null,
          cityId: null,
          companyAddressType: 'OTHER',
          companyId: null,
          country: null,
          id: 5,
          language: null,
          province: null,
        },
        {
          address: '22',
          address2: null,
          addressType: 'CLIENT_CONTACT',
          city: null,
          cityId: null,
          companyAddressType: 'OTHER',
          companyId: null,
          country: null,
          id: 5,
          language: null,
          province: null,
        },
      ],
      saleLead: null,
      bdCommission: [],
      ownerCommission: [],
      clientLevel: null,
      user: null,
      accountManager: [],
      serviceTypeSelect: null,
      name: null,
      percentage: 0,
      endDate: null,
      startDate: null,
      note: '',
      signnes: null,
      creating: false,
    };
  }

  handleChange = (event, option) => {
    let saleLeadOwner = option.saleLeadOwner.map((item, index) => {
      return {
        ...item,
        fullName: item.firstName + ' ' + item.lastName,
        percentage: 0,
        userId: item.id,
      };
    });
    let newBdCommission = [];
    newBdCommission.push(saleLeadOwner[0]);
    let selected = [];
    option.serviceTypes.forEach((item, index) => {
      selected.push(item.id);
    });

    this.setState({
      value: `Sales Lead ${option.index + 1}`,
      saleLead: option,
      bdCommission: newBdCommission,
      ownerCommission: saleLeadOwner,
      serviceTypeSelect: selected,
    });
    this.removeErrorMessage('salesLead');
  };

  setName = (user, filtedData, index, type) => {
    if (!user.userId) {
      user.userId = user.id;
      user.percentage = 0;
    }
    filtedData[index] = user;
    if (type === 'DBOwner') {
      this.setState({
        bdCommission: filtedData,
      });
    } else {
      this.setState({
        ownerCommission: filtedData,
      });
    }
  };

  setpercentage = (num, filtedData, index, type) => {
    if (type === 'DBOwner') {
      let newBdCommission = lodash.cloneDeep(this.state.bdCommission);
      newBdCommission[index].percentage = Number(num);
      this.setState({
        bdCommission: newBdCommission,
      });
    } else {
      let newOwnerCommission = JSON.parse(
        JSON.stringify(this.state.ownerCommission)
      );
      newOwnerCommission[index].percentage = Number(num);
      this.setState({
        ownerCommission: newOwnerCommission,
      });
    }
  };

  delete = (data, filtedData, type, index) => {
    if (type === 'DBOwner') {
      let newBdCommission = lodash.cloneDeep(this.state.bdCommission);
      newBdCommission.splice(index, 1);
      this.setState({
        bdCommission: newBdCommission,
      });
    } else {
      let newOwnerCommission = JSON.parse(
        JSON.stringify(this.state.ownerCommission)
      );
      newOwnerCommission.splice(index, 1);
      this.setState({
        ownerCommission: newOwnerCommission,
      });
    }
  };

  setCommissions = (type) => {
    const { bdCommission, ownerCommission } = this.state;
    let filtedData = [];
    if (type === 'DBOwner') {
      filtedData = bdCommission;
    } else {
      if (ownerCommission.length > 0) {
        filtedData = ownerCommission;
      } else {
        filtedData = [{}];
      }
    }

    return (
      <div style={{ flex: 3 }}>
        {filtedData.map((data, index) => {
          return this.renderCommission(data, filtedData.length, type, index);
        })}
      </div>
    );
  };
  renderCommission = (data, size, type, index) => {
    const { errorMessage, bdCommission, ownerCommission, edit, user } =
      this.state;
    let filtedData = [];
    let stateKey = '';
    if (type === 'DBOwner') {
      filtedData = bdCommission;
      stateKey = 'DBOwnerData';
    } else {
      filtedData = ownerCommission;
      stateKey = 'salesLeadOwnerData';
    }

    return (
      <div className="row expanded">
        {/* 1.选择用户 */}
        <div className="small-6 columns">
          <FormReactSelectContainer>
            <Select
              labelKey="fullName"
              valueKey="fullName"
              value={data ? data.fullName : ''}
              onChange={(user) => {
                this.setName(user, filtedData, index, type);
              }}
              // simpleValue
              options={this.props.userList}
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
            value={data ? data.percentage : ''}
            onChange={(e) => {
              let num = Number(e.target.value);
              this.setpercentage(num, filtedData, index, type);
            }}
            type="number"
            min={0}
            max={100}
            step={5}
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
                filtedData.push({ percentage: 0 });
                this.setState({
                  [stateKey]: filtedData.slice(),
                });
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
                if (size > 1) {
                  this.delete(data, filtedData, type, index);
                }
              }}
            >
              <Delete />
            </IconButton>
          )}
        </div>
      </div>
    );
  };

  attachFileHandler = (e) => {
    const fileInput = e.target;
    // console.log(fileInput.value, fileInput.files[0]);
    this.setState({ file: fileInput.files[0], uploadingFile: true });

    if (this.fileTask) {
      //cancel pre upload
      this.fileTask.cancel();
    }
    const file = fileInput.files[0];
    this.removeErrorMessage('s3key');
    this.setState({ fileName: file.name });
    this.fileTask = makeCancelable(
      getUploadContractUrl().then(({ message }) => {
        console.log(
          'message',
          message,
          file.name,
          encodeURIComponent(file.name)
        );
        return fetch(message, {
          method: 'PUT',
          headers: {
            'Content-Disposition': `filename="${encodeURIComponent(
              file.name
            )}"`,
          },
          body: file,
        }).then(() => {
          console.log('????', new URL(message).pathname.replace('/', ''));
          return new URL(message).pathname.replace('/', '');
        });
      })
    );
    this.fileTask.promise
      .then((s3Key) => {
        // if (this.removeErrorMessage) {
        //   this.removeErrorMessage('attachement');
        // }
        console.log('[contract]', s3Key);
        this.setState({ s3Key, uploadingFile: false });
      })
      .catch((err) => {
        // if (err.error === 'invalid_token') {
        //   return _retry(url, config, token.refresh_token).then(
        //     _handleResponseToJson
        //   );
        // }
        // throw err;
        // this.setState({
        //   uploadingFile: false,
        // });
        console.log(err);
      });

    fileInput.value = '';
  };

  removeFileHandler = (file) => {
    this.setState({ file: '', s3Key: null });
  };

  getServiceType = (checkedList) => {
    let serviceType = [];
    checkedList.forEach((item, index) => {
      serviceType.push(item.id);
    });
    let newServiceTypeSelect = checkedList.map((item, index) => {
      // serviceType.push(item.id);
      return {
        id: item.id,
        label: item.label,
        parentId: item.parentId,
      };
    });
    this.setState({
      serviceTypeSelect: newServiceTypeSelect,
      serviceType: serviceType,
    });
  };

  // setSignee=(user)=>{
  //   this.setState({
  //     signeeSelect:user,
  //     signees:
  //   })
  // }

  onchangeHandler = (value) => {
    console.log('!!!!!!', value);
    let newSignnes = [];
    value.forEach((item, index) => {
      newSignnes.push(item.id);
    });
    // const selectedSignees = value.map(ele => ele.id);
    this.setState({ selectedSignees: value, signnes: newSignnes });
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  setAm = (accountManager) => {
    console.log(accountManager);
    let newAm = lodash.cloneDeep(this.state.accountManager);
    newAm.push(accountManager.id);
    this.setState({
      accountManager: newAm,
    });
  };

  _validateForm(t) {
    let errorMessage = Immutable.Map();

    if (this.state.accountManager.length === 0) {
      errorMessage = errorMessage.set(
        'accountManager',
        t('message:accountManagerIsRequired')
      );
    }
    if (!this.state.clientLevel) {
      errorMessage = errorMessage.set('level', t('message:levelIsRequired'));
    }
    if (!this.state.saleLead) {
      errorMessage = errorMessage.set(
        'salesLead',
        t('message:salesLeadIsRequired')
      );
    }

    if (
      this.state.saleLead &&
      (!this.state.serviceTypeSelect ||
        this.state.serviceTypeSelect.length === 0)
    ) {
      errorMessage = errorMessage.set(
        'serviceType',
        t('message:serviceTypeIsRequired')
      );
    }
    if (!this.state.name && this.props.upgradeClientType === '1') {
      errorMessage = errorMessage.set(
        'contractName',
        t('message:contractNameIsRequired')
      );
    }
    if (this.props.upgradeClientType === '1' && !this.state.s3Key) {
      errorMessage = errorMessage.set('s3key', t('message:fileIsRequired'));
    }
    if (
      (!this.state.signnes && this.props.upgradeClientType === '1') ||
      (this.state.signnes &&
        this.state.signnes.length === 0 &&
        this.props.upgradeClientType === '1')
    ) {
      errorMessage = errorMessage.set('signee', t('message:SignneIsRequired'));
    }
    if (!this.state.startDate && this.props.upgradeClientType === '1') {
      errorMessage = errorMessage.set(
        'startDate',
        t('message:startDateIsRequired')
      );
    }

    if (!this.state.note) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (
      this.state.bdCommission.length !== 0 &&
      this.state.ownerCommission.length !== 0
    ) {
      let ownersValidate = this.setOwnersErrorMessage(
        this.state.ownerCommission
      );
      let bdValidate = this.setBdCommissionErrorMessage(
        this.state.bdCommission
      );
      if (ownersValidate.hasOwners) {
        errorMessage = errorMessage.set(
          'salesLeadOwner',
          t('message:salesLeadOwnerIsRequired')
        );
      } else if (ownersValidate.ownersPercentage > 50) {
        errorMessage = errorMessage.set(
          'salesLeadOwnerContribution',
          t('message:salesLeadOwnerContributionIsRequired')
        );
      } else if (bdValidate.hasbds) {
        errorMessage = errorMessage.set(
          'bDOwner',
          t('message:bDOwnerIsRequired')
        );
      } else if (bdValidate.bdPercentage > 50) {
        errorMessage = errorMessage.set(
          'bDOwnerContribution',
          t('message:bDOwnerContributionIsRequired')
        );
      } else if (
        bdValidate.bdPercentage + ownersValidate.ownersPercentage !==
        100
      ) {
        errorMessage = errorMessage.set(
          'ServiceTypeValidate',
          t('message:ServiceTypeValidateIsRequired')
        );
      }
    }
    return errorMessage.size > 0 && errorMessage;
  }

  setOwnersErrorMessage = (owners) => {
    let ownersPercentage = 0;
    let hasOwners = owners.some((item, index) => {
      return !item.userId;
    });
    owners.forEach((item, index) => {
      ownersPercentage += item.percentage;
    });
    return {
      hasOwners,
      ownersPercentage,
    };
  };

  setBdCommissionErrorMessage = (bd) => {
    let bdPercentage = 0;
    let hasbds = bd.some((item, index) => {
      return !item.userId;
    });
    bd.forEach((item, index) => {
      console.log(item);
      bdPercentage += item.percentage;
    });
    console.log(bdPercentage);
    return {
      hasbds,
      bdPercentage,
    };
  };

  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };
  Sumbit = () => {
    this.setState({
      creating: true,
    });
    const { t } = this.props;
    let errorMessage = this._validateForm(t);
    if (errorMessage) {
      this.setState({ creating: false });
      return this.setState({ errorMessage });
    }
    let obj = {
      accountManager: this.state.accountManager,
      clientLevel: this.state.clientLevel,
      bdCommission: this.state.bdCommission,
      prospectId: this.props.companyId,
      salesLeadId: this.state.saleLead.id,
      ownerCommission: this.state.ownerCommission,
      serviceType: this.state.serviceType
        ? this.state.serviceType
        : this.state.serviceTypeSelect,
      contract: {
        endDate: this.state.endDate,
        fileName: this.state.fileName,
        name: this.state.name,
        note: this.state.note,
        s3Key: this.state.s3Key,
        startDate: this.state.startDate,
        signees: this.state.signnes,
      },
    };
    this.props.dispatch(prospectUpgrade(obj)).then((res) => {
      if (res) {
        this.setState({
          creating: false,
        });
        history.replace(`/companies/detail/${this.props.companyId}/0`);
        this.props.handleClose();
        window.location.reload();
      } else {
        this.setState({
          creating: false,
        });
      }
    });
  };

  handleCheck = (user) => {
    console.log(user);
    let newAccountManager = JSON.parse(
      JSON.stringify(this.state.accountManager)
    );
    let userIndex = null;
    if (
      newAccountManager.some((item, index) => {
        if (item.id === user.id) {
          userIndex = index;
          return true;
        }
      })
    ) {
      newAccountManager.splice(userIndex, 1);
    } else {
      newAccountManager.push(user);
    }
    this.setState({
      accountManager: newAccountManager,
    });
  };

  checkedMember = (am) => {
    if (am) {
      let newcheckedMember = am.map((item, index) => {
        return {
          ...item,
          fullName: item.firstName + ' ' + item.lastName,
        };
      });
      return newcheckedMember;
    } else {
      return null;
    }
  };

  setCheckName = (am) => {
    if (am) {
      let newcheckedMember = am.map((item, index) => {
        return {
          ...item,
          fullName: item.firstName + ' ' + item.lastName,
        };
      });
      let names = [];
      newcheckedMember.forEach((item, index) => {
        names.push(item.fullName);
      });
      return names;
    } else {
      return [];
    }
  };

  render() {
    // upgradeClientType   1: with contract  2：without contract
    const {
      classes,
      upgradeClientType,
      userList,
      salesLead,
      t,
      serviceTypeTree,
    } = this.props;
    const {
      addressList,
      value,
      roleTestData,
      roleTestData2,
      uploadingFile,
      file,
      errorMessage,
      accountManager,
      creating,
    } = this.state;
    // let newSalesLead = salesLead.filter((item,index)=>{
    //   return item.accountProgress!==1
    // })
    // newSalesLead.forEach((item,index)=>{
    //   item.index=index
    // })

    return (
      <section style={{ minWidth: 480 }} className={classes.root}>
        {uploadingFile && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 2,
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <CircularProgress size={60} style={{ marginTop: '-40px' }} />
            Uploading Contract File
          </div>
        )}
        {/* 1 row */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              isRequired
              label={
                <div
                  // className="flex-container"
                  style={{ display: 'inline-block' }}
                >
                  <span>{'Client Level'}</span>
                </div>
              }
              icon={
                <Tooltip title={'Client Level'} arrow placement="top">
                  <Info fontSize="small" color="disabled" />
                </Tooltip>
              }
              errorMessage={
                errorMessage && errorMessage.get('level')
                  ? errorMessage.get('level')
                  : null
              }
            >
              <Select
                name="ClientLevel"
                options={levelList}
                valueKey={'value'}
                labelKey={'label'}
                onChange={(clientLevel) =>
                  this.setState({ clientLevel: clientLevel.value })
                }
                value={this.state.clientLevel ? this.state.clientLevel : ''}
                onFocus={() => {
                  this.removeErrorMsgHandler('level');
                }}
                clearable={false}
              />
            </FormReactSelectContainer>
            <input type="hidden" name="ClientLevel" value="" />
          </div>
          <div className="small-6 columns">
            {/* <TeamMember
              label={`Account Manager`}
              checkedMember={this.checkedMember(accountManager)}
              teamMember={userlist}
              handleCheck={(user) => {
                this.handleCheck(user);
                this.removeErrorMsgHandler('accountManager');
              }}
            /> */}

            {/* <span
              style={{
                color: '#cc4b37',
                fontSize: '0.75em',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('accountManager')
                ? errorMessage.get('accountManager')
                : null}
            </span> */}
            <FormReactSelectContainer
              label={`Account Manager`}
              isRequired
              errorMessage={errorMessage.get('accountManager')}
            >
              <Select
                closeMenuOnSelect={false}
                clearable={false}
                value={accountManager}
                options={userList}
                valueKey={'fullName'}
                labelKey={'fullName'}
                multi
                onChange={(accountManager) => {
                  this.setState({ accountManager });
                  this.removeErrorMsgHandler('accountManager');
                }}
              />
            </FormReactSelectContainer>
          </div>
        </div>
        {/* 2 row */}
        <div className="row expanded">
          <div className="small-12 columns">
            <label
              style={
                errorMessage && errorMessage.get('salesLead')
                  ? { fontSize: '12px', color: '#cc4b37' }
                  : { fontSize: '12px' }
              }
            >
              {t('tab:Sales Lead')} <span style={{ color: '#cc4b37' }}>*</span>
            </label>
            <Autocomplete
              id="checkboxes-tags-demo"
              options={salesLead ? salesLead : []}
              disableCloseOnSelect
              disableClearable
              getOptionLabel={(option) => value}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={value}
                      onChange={(e) => {
                        this.handleChange(e, option);
                      }}
                    >
                      <FormControlLabel
                        value={`${t('tab:Sales Lead')} ${option.index + 1}`}
                        control={<Radio color="primary" />}
                        label={
                          <RadioLabel
                            option={option}
                            salesLead={salesLead}
                            t={this.props.t}
                          />
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  fullWidth
                  label=""
                  variant="outlined"
                  style={
                    errorMessage && errorMessage.get('salesLead')
                      ? {
                          border: '1px solid #cc4b37',
                          backgroundColor: '#faedeb',
                        }
                      : {}
                  }
                />
              )}
            />
            <span
              style={{
                color: '#cc4b37',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('salesLead')
                ? errorMessage.get('salesLead')
                : null}
            </span>
          </div>
        </div>
        {/* Mark */}
        {this.state.value ? (
          <>
            <FormControlLabel
              control={
                <Checkbox
                  icon={<CheckBoxIcon fontSize="small" />}
                  checkedIcon={<CheckBoxIcon fontSize="small" />}
                  checked={true}
                  name="checkedI"
                  color="default"
                />
              }
              label="Mark “Sales Lead 1” account progress as finished (100%)."
            />
            <div className="row expanded">
              <div className="small-12 columns">
                <PotentialServiceTypeSelect
                  t={t}
                  data={serviceTypeTree}
                  width={'100%'}
                  // value={value}
                  selected={this.state.serviceTypeSelect}
                  sendServiceType={(checkedList) => {
                    this.removeErrorMsgHandler('serviceType');
                    this.getServiceType(checkedList);
                  }}
                  errorMessage={errorMessage}
                  salesLeadIndex={0}
                  serviceTypeError={[
                    {
                      salesLeadIndex: 0,
                      errorMessage: errorMessage.get('serviceType')
                        ? true
                        : false,
                    },
                  ]}
                  // getMsg={(list, msg) => {
                  //   this.getMsg(list, msg);
                  // }}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage && errorMessage.get('serviceType')
                    ? errorMessage.get('serviceType')
                    : null}
                </span>
              </div>
            </div>
            {/* 2.1 添加sales lead 后的比例分成 */}
            {/*DBOwner Commissions label  */}
            <div className="row expanded" style={{ marginTop: '10px' }}>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label="BD Owner"
                  isRequired
                ></FormReactSelectContainer>
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  isRequired
                  label="BD Owner Contribution%"
                  icon={
                    <Tooltip
                      title={t(
                        'common:Please make sure all BD Owner Contribution% add up to 50%'
                      )}
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

            {/* Sales Lead Owner Commissions label */}
            <div className="row expanded">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={this.props.t('tab:Sales Lead Owner')}
                  isRequired
                ></FormReactSelectContainer>
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  isRequired
                  label="Sales Lead Owner Contribution%"
                  icon={
                    <Tooltip
                      title={t(
                        'common:Please make sure all Sales Lead Owner Contribution% add up to 50%'
                      )}
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
            <span
              style={{
                color: '#cc4b37',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('salesLeadOwner')
                ? errorMessage.get('salesLeadOwner')
                : null}
            </span>
            <span
              style={{
                color: '#cc4b37',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('salesLeadOwnerContribution')
                ? errorMessage.get('salesLeadOwnerContribution')
                : null}
            </span>
            <span
              style={{
                color: '#cc4b37',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('bDOwner')
                ? errorMessage.get('bDOwner')
                : null}
            </span>
            <span
              style={{
                color: '#cc4b37',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('bDOwnerContribution')
                ? errorMessage.get('bDOwnerContribution')
                : null}
            </span>
            <span
              style={{
                color: '#cc4b37',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {errorMessage && errorMessage.get('ServiceTypeValidate')
                ? errorMessage.get('ServiceTypeValidate')
                : null}
            </span>
          </>
        ) : (
          ''
        )}
        {/* 3 row */}
        {upgradeClientType === '1' ? (
          <>
            <div className="row expanded">
              <div className="small-12 columns">
                <FormInput
                  name="ServiceContractName"
                  label={t('field:Service Contract Name')}
                  isRequired
                  errorMessage={
                    errorMessage && errorMessage.get('contractName')
                      ? errorMessage.get('contractName')
                      : null
                  }
                  value={this.state.name}
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                  }}
                  onFocus={() => {
                    this.removeErrorMsgHandler('contractName');
                  }}
                  value={this.state.name}
                />
                <input type="hidden" name="ServiceContractName" value="" />
              </div>
            </div>

            <div className="row expanded">
              <div className="small-12 columns">
                <label
                  style={
                    errorMessage && errorMessage.get('s3key')
                      ? { color: '#cc4b37', fontSize: '12px' }
                      : { fontSize: '12px' }
                  }
                >
                  {'Attach Service Contract'}
                  <span style={{ color: '#cc4b37' }}>*</span>
                </label>
                <Attachment
                  t={t}
                  file={file}
                  handleChange={this.attachFileHandler}
                  handleDelete={this.removeFileHandler}
                  uploading={uploadingFile}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('s3key') : null}
                </span>
              </div>
            </div>

            {/* 5 row */}
            <div className="row expanded">
              <div className="small-12 columns">
                {/* <div className="small-12 columns"> */}
                <label
                  style={
                    errorMessage && errorMessage.get('signee')
                      ? { color: '#cc4b37', fontSize: '12px' }
                      : { fontSize: '12px' }
                  }
                >
                  {t('field:signee')}{' '}
                  <span style={{ color: '#cc4b37' }}>*</span>
                </label>
                <Autocomplete
                  multiple
                  options={userList}
                  disableCloseOnSelect
                  value={this.state.selectedSignees}
                  onChange={(e, value) => {
                    this.onchangeHandler(value);
                  }}
                  onFocus={() => {
                    if (this.removeErrorMessage) {
                      this.removeErrorMessage('signee');
                    }
                  }}
                  getOptionLabel={(option) => option.fullName}
                  renderOption={(option, { selected }) => {
                    return (
                      <React.Fragment>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                          color="primary"
                        />
                        {option.fullName}
                      </React.Fragment>
                    );
                  }}
                  className={classes.signee}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label=""
                      placeholder=""
                      fullWidth
                      style={
                        errorMessage && errorMessage.get('signee')
                          ? {
                              border: '1px solid #cc4b37',
                              backgroundColor: '#faedeb',
                            }
                          : {}
                      }
                    />
                  )}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {errorMessage ? errorMessage.get('signee') : null}
                </span>
                {/* </div> */}
              </div>
            </div>

            {/* 6 row */}
            <div className="row expanded">
              <div className="small-6 columns">
                <DatePicker
                  selected={
                    this.state.startDate ? moment(this.state.startDate) : ''
                  }
                  maxDate={moment(this.state.endDate)}
                  customInput={
                    <FormInput
                      label={'Starts From'}
                      isRequired
                      errorMessage={errorMessage.get('startDate')}
                    />
                  }
                  onChange={(date) => {
                    this.setState({
                      startDate: date.toJSON(),
                    });
                    this.removeErrorMessage('startDate');
                  }}
                  placeholderText="mm/dd/yyyy"
                />
                <input type="hidden" name="StartsFrom" value="" />
              </div>
              <div className="small-6 columns">
                <DatePicker
                  selected={
                    this.state.endDate ? moment(this.state.endDate) : ''
                  }
                  minDate={moment(this.state.startDate)}
                  customInput={
                    <FormInput
                      label={'Ends On'}
                      errorMessage={errorMessage.get('EndDate')}
                    />
                  }
                  onChange={(date) => {
                    this.setState({
                      endDate: date.toJSON(),
                    });
                  }}
                  placeholderText="mm/dd/yyyy"
                />

                <input type="hidden" name="EndsOn" value="" />
              </div>
            </div>
          </>
        ) : (
          ''
        )}
        {/* 7 row */}
        <div className="row expanded">
          <div className="small-12 columns">
            <FormTextArea
              isRequired
              label={this.props.t('tab:Fee Type and Note')}
              errorMessage={
                errorMessage && errorMessage.get('note')
                  ? errorMessage.get('note')
                  : null
              }
              name="Fee Type and Note"
              value={this.state.note}
              onChange={(e) => {
                this.setState({ note: e.target.value });
              }}
              onFocus={() => {
                this.removeErrorMessage('note');
              }}
              rows={4}
            />
          </div>
        </div>
        <div className="row expanded">
          {/* <div className="small-12 columns"> */}
          <Button
            color="primary"
            onClick={() => {
              this.props.handleClose();
            }}
          >
            {t('tab:Cancel')}
          </Button>

          <PrimaryButton
            type="button"
            style={{ minWidth: 100 }}
            processing={creating}
            name="submit"
            onClick={() => {
              this.Sumbit();
            }}
          >
            {t('tab:Submit')}
          </PrimaryButton>
          {/* </div> */}
        </div>
      </section>
    );
  }
}

const mapStoreStateToProps = (state, props) => {
  const serviceTypeTree = state.model.serviceTypeTree.tree;
  return { serviceTypeTree };
};

export default withTranslation('tab')(
  connect(mapStoreStateToProps)(withStyles(styles)(UpgradeClientSecond))
);
