import React, { Component } from 'react';
import CompanyLogo from '../Companies/Form/CompanyLogo';
import { uploadAvatar } from '../../../apn-sdk/files';
import { industryList, staffSize } from '../../constants/formOptions';
import Select from 'react-select';
import FormInput from '../../components/particial/FormInput';
import FormTextArea from '../../components/particial/FormTextArea';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import Location from '../../components/Location';
import Divider from '@material-ui/core/Divider';
import PrimaryButton from '../../components/particial/PrimaryButton';
import Button from '@material-ui/core/Button';
import Immutable from 'immutable';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import AdminUserComponent from './adminUserComponent';
import { createTenant, putTenantAdmin } from '../../actions/tenantAdmin';

import { showErrorMessage } from '../../actions/index';
import { connect } from 'react-redux';
import MyDialog from '../../components/Dialog/myDialog';
import { isEmail } from '../../../utils';
import loadsh from 'lodash';
class TenantInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDialog: false,
      logo: this.props.tenantInfo ? this.props.tenantInfo.logo : null,
      name: this.props.tenantInfo ? this.props.tenantInfo.name : null,
      industry: this.props.tenantInfo ? this.props.tenantInfo.industry : null,
      website: this.props.tenantInfo ? this.props.tenantInfo.website : null,
      address:
        this.props.tenantInfo && this.props.tenantInfo.address
          ? this.props.tenantInfo.address.address
          : null,
      credit: this.props.tenantInfo
        ? this.props.tenantInfo.monthlyCredit
        : null,
      usedCredit: this.props.tenantInfo ? this.props.tenantInfo.usedCredit : 0,
      curLocation: this.props.tenantInfo ? this.props.tenantInfo.address : null,
      description: this.props.tenantInfo
        ? this.props.tenantInfo.description
        : null,
      foundedDate:
        this.props.tenantInfo && this.props.tenantInfo.foundedDate
          ? moment(this.props.tenantInfo.foundedDate)
          : null,
      creating: false,
      staffSizeType: this.props.tenantInfo
        ? this.props.tenantInfo.staffSizeType
        : null,
      status: this.props.tenantInfo ? this.props.tenantInfo.status : 1,
      errorMessage: Immutable.Map(),
      users: this.props.tenantInfo
        ? this.props.tenantInfo.admin
        : [{ firstName: null, lastName: null, email: null }],
      addCreditShow: false,
      creditDefaultVal: null,
      tenantEmail: this.props.tenantInfo
        ? this.props.tenantInfo.tenantEmail
        : null,
      tenantPhone: this.props.tenantInfo
        ? this.props.tenantInfo.tenantPhone
        : null,
      resetDate:
        moment(new Date()).add(1, 'M').format('MM') +
        '/' +
        '01' +
        '/' +
        moment(new Date()).format('YYYY'),

      bulkCredit: this.props.tenantInfo
        ? this.props.tenantInfo.bulkCredit
        : null,
      updateMonthlyCredit: this.props.tenantInfo
        ? this.props.tenantInfo.updateMonthlyCredit
        : null,
      addCredit: null,
    };
  }
  componentDidMount() {
    this.getCredit();
  }
  onNewImage = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
    let fileType = file.type;
    if (fileType.indexOf('image') === -1) {
      this.props.dispatch(
        showErrorMessage('The uploaded file must be a picture type')
      );
      return;
    } else {
      uploadAvatar(file).then((res) => {
        this.setState({
          logo: res.response.s3url,
        });
      });
    }
  };

  inputChangeHandler = (event) => {
    this.setState({
      name: event.target.value,
    });
  };

  changeIndustry = (val) => {
    this.setState({
      industry: val.value,
    });
  };
  setWebsite = (event) => {
    this.setState({
      website: event.target.value,
    });
  };
  setCredit = (event) => {
    console.log(event.target.value);
    this.setState({
      credit: event.target.value,
    });
  };
  setAddress = (event) => {
    this.setState({
      address: event.target.value,
    });
  };

  setCity = (city) => {
    if (!city) {
      this.setState({
        curLocation: null,
      });
    }
    this.setState({
      curLocation: city,
    });
  };
  setDescription = (e) => {
    this.setState({
      description: e.target.value,
    });
  };
  setStaffSize = (obj) => {
    this.setState({
      staffSizeType: obj.value,
    });
  };
  setFoundedDate = (time) => {
    this.setState({
      foundedDate: time,
    });
  };
  changeChecked = (event) => {
    let type = event.target.checked;
    if (type === false) {
      this.setState({
        status: 0,
      });
    } else {
      this.setState({
        status: 1,
      });
    }
  };
  _validateForm(t) {
    const {
      name,
      industry,
      credit,
      users,
      updateMonthlyCredit,
      bulkCredit,
      addCredit,
    } = this.state;
    const { tenantInfo } = this.props;
    let errorMessage = Immutable.Map();
    if (!name) {
      errorMessage = errorMessage.set(
        'tenantName',
        t('message:tenantNameIsRequired')
      );
    }
    if (users) {
      let firstNameList = users.map((item, index) => {
        return item.firstName;
      });
      let type = firstNameList.every((item, index) => {
        return item;
      });
      let lastNameList = users.map((item, index) => {
        return item.lastName;
      });
      let _type = lastNameList.every((item, index) => {
        return item;
      });
      let emailList = users.map((item, index) => {
        return item.email;
      });
      let _emailType = emailList.every((item, index) => {
        return item;
      });
      if (!type || !_type || !_emailType) {
        errorMessage = errorMessage.set(
          'adminOptions',
          t('message:adminOptionsIsRequired')
        );
      }
    }
    if (!industry) {
      errorMessage = errorMessage.set(
        'industry',
        t('message:industryIsRequired')
      );
    }
    if ((!tenantInfo && !credit) || credit === '') {
      errorMessage = errorMessage.set('credit', t('message:creditIsRequired'));
    }
    if (!tenantInfo && credit) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(credit);
      let type1 = r1.test(credit);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'credit',
          t('message:Creditmustbeapositiveinteger')
        );
      }
    }
    if (tenantInfo && !String(updateMonthlyCredit)) {
      errorMessage = errorMessage.set('credit', t('message:creditIsRequired'));
    }
    if (tenantInfo && updateMonthlyCredit) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(updateMonthlyCredit);
      let type1 = r1.test(updateMonthlyCredit);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'credit',
          t('message:Creditmustbeapositiveinteger')
        );
      }
    }

    if (!tenantInfo && bulkCredit) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(bulkCredit);
      let type1 = r1.test(bulkCredit);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'bulkCredit',
          t('message:bulkCreditmustbeapositiveinteger')
        );
      }
    }
    return errorMessage.size > 0 && errorMessage;
  }
  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  getCurLoaction = (obj) => {
    let data;
    let msg;
    if (obj.similarity === 'city') {
      data = {
        city: obj.city,
        province: obj.province,
        country: obj.country,
      };
      if (obj.city && obj.province && obj.country) {
        msg = obj.city + ', ' + obj.province + ', ' + obj.country;
      }
    } else if (obj.similarity === 'province') {
      data = {
        province: obj.province,
        country: obj.country,
      };
      if (obj.city && obj.province) {
        msg = obj.city + ', ' + obj.province;
      }
    } else {
      data = {
        country: obj.country,
      };
      if (obj.country) {
        msg = obj.country;
      }
    }
    return msg;
  };

  SaveTenant = () => {
    this.setState({
      creating: true,
    });
    const { t } = this.props;
    const {
      name,
      logo,
      status,
      industry,
      website,
      address,
      credit,
      curLocation,
      description,
      foundedDate,
      staffSizeType,
      users,
      bulkCredit,
      tenantEmail,
      tenantPhone,
      updateMonthlyCredit,
    } = this.state;
    let errorMessage = this._validateForm(t);
    if (errorMessage) {
      this.setState({ creating: false });
      return this.setState({ errorMessage });
    }
    let obj = {
      logo: logo,
      name: name,
      industry: industry,
      website: website,
      address: address,
      cityId: curLocation ? curLocation.cityId : null,
      monthlyCredit: Number(credit),
      bulkCredit: Number(bulkCredit),
      description: description,
      admin: users,
      foundedDate: foundedDate
        ? foundedDate.utc().format('YYYY-MM-DDTHH:mm:ss[Z]')
        : null,
      status: status,
      staffSizeType: staffSizeType,
      tenantEmail: tenantEmail,
      tenantPhone: tenantPhone,
      updateMonthlyCredit:
        Number(updateMonthlyCredit) === 0
          ? Number(credit)
          : Number(updateMonthlyCredit),
    };
    if (!this.props.tenantInfo) {
      this.props
        .dispatch(createTenant(obj))
        .then((res) => {
          console.log(res);
          if (res && res.id) {
            this.setState({
              creating: false,
            });
            this.props.history.push(`/tenantAdminPortal/detail/${res.id}`);
          }
        })
        .catch((err) => {
          this.props.dispatch(showErrorMessage(err));
          this.setState({
            creating: false,
          });
        });
    } else {
      obj.id = this.props.tenantInfo.id;
      obj.address = address ? address : null;
      obj.cityId = curLocation ? curLocation.cityId : null;
      this.props
        .dispatch(putTenantAdmin(obj))
        .then((res) => {
          if (res && res.id) {
            this.setState({
              creating: false,
            });
            this.props.history.push(`/tenantAdminPortal/detail/${res.id}`);
          }
        })
        .catch((err) => {
          this.props.dispatch(showErrorMessage(err));
          this.setState({
            creating: false,
          });
        });
    }
  };

  cancel = () => {
    if (this.props.tenantInfo) {
      this.props.history.push(
        `/tenantAdminPortal/detail/${this.props.tenantInfo.id}`
      );
    } else {
      this.props.history.push(`/tenantAdminPortal`);
    }
  };
  addAdmin = (obj) => {
    const { users } = this.state;
    let _users = loadsh.cloneDeep(users);
    _users.push(obj);
    this.setState({
      users: _users,
    });
  };
  deleteAdmin = (index) => {
    const { users } = this.state;
    // let _users = loadsh.cloneDeep(users);
    users.splice(index, 1);
    this.setState({
      users,
    });
  };
  setAdminLastName = (event, index) => {
    const { users } = this.state;
    let newVal = event.target.value;
    let _users = loadsh.cloneDeep(users);
    _users[index].lastName = newVal;
    this.setState({
      users: _users,
    });
  };
  setAdminFirstName = (event, index) => {
    const { users } = this.state;
    let newVal = event.target.value;
    let _users = loadsh.cloneDeep(users);
    _users[index].firstName = newVal;
    this.setState({
      users: _users,
    });
  };
  setEmail = (event, index) => {
    const { users } = this.state;
    let newVal = event.target.value;
    let _users = loadsh.cloneDeep(users);
    _users[index].email = newVal;
    this.setState({
      users: _users,
    });
  };

  setTenantEmail = (event) => {
    const { t } = this.props;
    let errorMessage = Immutable.Map();
    if (this.state.errorMessage && this.state.errorMessage.get('tenantEmail')) {
      this.removeErrorMsgHandler('tenantEmail');
    }
    if (event.target.value && !isEmail(event.target.value)) {
      errorMessage = errorMessage.set(
        'tenantEmail',
        t('message:tenantEmailIsInvalid')
      );
      this.setState({
        errorMessage,
      });
    }
    this.setState({
      tenantEmail: event.target.value,
    });
  };
  setTenantPhone = (event) => {
    this.setState({
      tenantPhone: event.target.value,
    });
  };
  getCredit = () => {
    const { tenantInfo } = this.props;
    const { credit } = this.state;
    let val;
    if (tenantInfo) {
      let remain = tenantInfo.usedCredit ? tenantInfo.usedCredit : 0;
      let _credit = credit
        ? credit - remain
        : tenantInfo.credit
        ? tenantInfo.credit - remain
        : 0;
      val = _credit + ' remaining ' + '(' + remain + ' used)';
    } else {
      val = this.state.credit;
    }
    this.setState({
      creditDefaultVal: val,
    });
  };

  addCredit = () => {
    this.removeErrorMsgHandler('setCredit');
    this.setState({
      addCreditShow: true,
    });
  };
  creditSumbit = () => {
    const { credit, errorMessage } = this.state;
    const { t } = this.props;
    if (errorMessage.size > 0 && errorMessage.get('setCredit')) {
      return;
    } else {
      this.getCredit();
      this.setState({
        addCreditShow: false,
      });
    }
  };
  setNewCredit = (e) => {
    const { credit } = this.state;
    const { t } = this.props;
    let errorMessage = Immutable.Map();
    let addNum = Number(e.target.value);
    let r1 = /^\+?[0-9][0-9]*$/;
    if (r1.test(e.target.value)) {
      let newCredit = credit + addNum;
      this.removeErrorMsgHandler('setCredit');
      this.setState({
        credit: newCredit,
      });
    } else {
      errorMessage = errorMessage.set(
        'setCredit',
        t('message:Creditmustbeapositiveinteger')
      );
      this.setState({ errorMessage });
    }
  };
  //获取CreditsUsage
  getMonthlyCreditsUsage = () => {
    const { tenantInfo } = this.props;
    let used = tenantInfo.monthlyUsedCredit ? tenantInfo.monthlyUsedCredit : 0;
    let _credit = tenantInfo.monthlyCredit ? tenantInfo.monthlyCredit : 0;
    return used + '/' + _credit;
  };
  //获取BulkCreditsUsage
  getBulkCreditsUsage = () => {
    const { tenantInfo } = this.props;
    const { bulkCredit } = this.state;
    let bulkUsed = tenantInfo.bulkUsedCredit ? tenantInfo.bulkUsedCredit : 0;
    let _bulkCredit = bulkCredit ? bulkCredit : 0;
    return bulkUsed + '/' + _bulkCredit;
  };
  addBulkCredit = (event) => {
    let errorMessage = Immutable.Map();
    const { t } = this.props;
    if (event.target.value) {
      let r = /^\+?[0-9][0-9]*$/;
      let type = r.test(event.target.value);
      if (!type) {
        errorMessage = errorMessage.set(
          'addCredit',
          t('message:Creditmustbeapositiveinteger')
        );
        this.setState({ errorMessage });
      } else {
        this.removeErrorMsgHandler('addCredit');
        this.setState({
          addCredit: Number(event.target.value),
        });
        // const { bulkCredit } = this.state;
        let addNum = Number(event.target.value);
        let _bulkCredit = loadsh.cloneDeep(this.props.tenantInfo.bulkCredit);

        let newBulkCredit = _bulkCredit + addNum;
        this.setState({
          bulkCredit: newBulkCredit,
        });
      }
    } else {
      let _bulkCredit = loadsh.cloneDeep(this.props.tenantInfo.bulkCredit);
      this.setState({
        bulkCredit: _bulkCredit,
      });
    }
  };
  setUpdateMonthlyCredit = (event) => {
    this.setState({
      updateMonthlyCredit: event.target.value,
    });
  };
  //提示弹窗
  confirm = () => {
    this.setState({
      confirmDialog: true,
    });
  };
  render() {
    const { t, tenantInfo } = this.props;
    const {
      errorMessage,
      users,
      addCreditShow,
      credit,
      creditDefaultVal,
      resetDate,
      confirmDialog,
      bulkCredit,
      updateMonthlyCredit,
    } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <CompanyLogo
          logoUrl={
            tenantInfo && tenantInfo.logo ? tenantInfo.logo : this.state.logo
          }
          onNewImage={this.onNewImage}
          t={t}
        />
        <section style={{ width: '65%', position: 'relative' }}>
          {tenantInfo && (
            <div
              style={{
                width: '120px',
                position: 'absolute',
                top: '-45px',
                right: '0px',
              }}
            >
              <FormControlLabel
                value="start"
                control={
                  <Switch
                    onChange={this.changeChecked}
                    checked={this.state.status === 1 ? true : false}
                    color="primary"
                  />
                }
                label="Active"
                labelPlacement="start"
              />
            </div>
          )}
          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                name="tenantName"
                label={t('field:tenantName')}
                defaultValue={
                  tenantInfo ? tenantInfo.name : this.state.tenantName
                }
                isRequired={true}
                onBlur={(event) => {
                  this.inputChangeHandler(event);
                  this.removeErrorMsgHandler('tenantName');
                }}
                errorMessage={
                  errorMessage && errorMessage.get('tenantName')
                    ? errorMessage.get('tenantName')
                    : null
                }
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={t('field:industry')}
                isRequired={true}
                errorMessage={
                  errorMessage && errorMessage.get('industry')
                    ? errorMessage.get('industry')
                    : null
                }
              >
                <Select
                  name="industrySelect"
                  value={this.state.industry}
                  onChange={(industry) => {
                    this.changeIndustry(industry);
                    this.removeErrorMsgHandler('industry');
                  }}
                  // simpleValue
                  valueKey={'value'}
                  labelKey={'label'}
                  options={industryList}
                  searchable
                  clearable={false}
                  autoBlur={true}
                />
              </FormReactSelectContainer>
            </div>
          </div>

          <AdminUserComponent
            admins={users}
            type={tenantInfo ? 1 : 2}
            addAdmin={(obj) => {
              this.addAdmin(obj);
            }}
            deleteAdmin={(index) => {
              this.deleteAdmin(index);
            }}
            setAdminLastName={(event, index) => {
              this.setAdminLastName(event, index);
            }}
            setAdminFirstName={(event, index) => {
              this.setAdminFirstName(event, index);
            }}
            setEmail={(event, index) => {
              this.setEmail(event, index);
            }}
            removeErrorMsgHandler={(str) => {
              this.removeErrorMsgHandler(str);
            }}
            errorMessage={
              errorMessage && errorMessage.get('adminOptions')
                ? errorMessage.get('adminOptions')
                : null
            }
          />
          {!tenantInfo ? (
            <div className="row expanded">
              <div className="small-3 columns">
                {/* <div style={{ flex: 1, width: '45%' }}> */}
                <FormInput
                  name="credit"
                  label={t('APN Pro Monthly Credits')}
                  toolTip={
                    'Total number of monthly credits for your entire organization.'
                  }
                  isRequired
                  disabled={tenantInfo}
                  defaultValue={
                    // tenantInfo ? tenantInfo.credit : this.state.credit
                    credit
                  }
                  placeholder={`Enter a number`}
                  onBlur={(event) => {
                    if (event.target.value) {
                      this.confirm();
                    }
                    this.setCredit(event);
                    this.removeErrorMsgHandler('credit');
                  }}
                  errorMessage={
                    errorMessage && errorMessage.get('credit')
                      ? errorMessage.get('credit')
                      : null
                  }
                />
                {/* </div> */}
              </div>
              <div className="small-3 columns" style={{ paddingTop: '21px' }}>
                <FormInput disabled defaultValue={resetDate} />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="bulkcredit"
                  label={t('APN Pro Bulk Credits ')}
                  toolTip={
                    'Total number of bulk credits for your entire organization.'
                  }
                  defaultValue={bulkCredit}
                  placeholder={`Enter a number`}
                  onBlur={(event) => {
                    if (event.target.value) {
                      this.setState({
                        bulkCredit: event.target.value,
                      });
                      this.removeErrorMsgHandler('bulkCredit');
                    }
                  }}
                  errorMessage={
                    errorMessage && errorMessage.get('bulkCredit')
                      ? errorMessage.get('bulkCredit')
                      : null
                  }
                />
              </div>
            </div>
          ) : (
            <>
              <div className="row expanded">
                <div className="small-3 columns">
                  {/* <div style={{ flex: 1, width: '45%' }}> */}
                  <FormInput
                    name="credit"
                    label={t('APN Pro Monthly Credits')}
                    toolTip={
                      'Total number of monthly credits for your entire organization.'
                    }
                    isRequired
                    defaultValue={
                      // tenantInfo ? tenantInfo.credit : this.state.credit
                      updateMonthlyCredit
                    }
                    placeholder={`Enter a number`}
                    onBlur={(event) => {
                      if (
                        event.target.value &&
                        Number(event.target.value) !==
                          tenantInfo.updateMonthlyCredit
                      ) {
                        this.confirm();
                        this.setUpdateMonthlyCredit(event);
                        this.removeErrorMsgHandler('credit');
                      }
                    }}
                    errorMessage={
                      errorMessage && errorMessage.get('credit')
                        ? errorMessage.get('credit')
                        : null
                    }
                  />
                  {/* </div> */}
                </div>
                <div className="small-3 columns" style={{ paddingTop: '21px' }}>
                  <FormInput disabled defaultValue={resetDate} />
                </div>
                <div className="small-6 columns">
                  <FormInput
                    disabled
                    label={t('Monthly Credits Usage')}
                    defaultValue={this.getMonthlyCreditsUsage()}
                  />
                </div>
              </div>
              <div className="row expanded">
                <div className="small-3 columns">
                  <FormInput
                    name="bulkcredit"
                    label={t('APN Pro Bulk Credits ')}
                    toolTip={
                      'Total number of bulk credits for your entire organization.'
                    }
                    disabled
                    value={bulkCredit}
                  />
                </div>
                <div className="small-3 columns">
                  <FormInput
                    label={t('Add Bulk Credits')}
                    placeholder={`Enter a number`}
                    onBlur={(event) => {
                      this.addBulkCredit(event);
                    }}
                    errorMessage={
                      errorMessage && errorMessage.get('addCredit')
                        ? errorMessage.get('addCredit')
                        : null
                    }
                  />
                </div>
                <div className="small-6 columns">
                  <FormInput
                    disabled
                    label={t('Bulk Credits Usage ')}
                    value={this.getBulkCreditsUsage()}
                  />
                </div>
              </div>
            </>
          )}
          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                name="address"
                label={t('field:address')}
                defaultValue={
                  tenantInfo && tenantInfo.address
                    ? tenantInfo.address.address
                    : this.state.address
                }
                onBlur={(event) => {
                  this.setAddress(event);
                }}
              />
            </div>
            <div className="small-6 columns">
              <div className="row expanded">
                <div
                  className="small-9 columns"
                  style={{
                    fontSize: '12px',
                    height: '16px',
                    padding: '0px',
                    fontFamily: 'Roboto',
                  }}
                >
                  {t('field:cityStateCountry')}
                </div>
              </div>
              <div className="row expanded" style={{ marginTop: '4px' }}>
                <div className="small-12 columns" style={{ padding: '0px' }}>
                  <Location
                    curLoaction={
                      tenantInfo && tenantInfo.address
                        ? this.getCurLoaction(tenantInfo.address)
                        : this.state.curLocation
                    }
                    city={
                      tenantInfo && tenantInfo.address
                        ? tenantInfo.address
                        : null
                    }
                    getLocation={(value) => {
                      this.setCity(value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="small-6 columns">
              <FormInput
                name="tenantEmail"
                label={t('field:email')}
                defaultValue={
                  tenantInfo ? tenantInfo.tenantEmail : this.state.tenantEmail
                }
                onBlur={(event) => {
                  this.setTenantEmail(event);
                }}
                errorMessage={
                  errorMessage && errorMessage.get('tenantEmail')
                    ? errorMessage.get('tenantEmail')
                    : null
                }
              />
            </div>
            <div className="small-6 columns">
              <FormInput
                name="phone"
                label={t('field:phone')}
                defaultValue={
                  tenantInfo ? tenantInfo.tenantPhone : this.state.phone
                }
                onBlur={(event) => {
                  this.setTenantPhone(event);
                }}
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:Founded')}>
                <DatePicker
                  // className={classes.fullWidth}
                  selected={this.state.foundedDate}
                  maxDate={moment(new Date())}
                  onChange={(foundedDate) => {
                    this.setFoundedDate(foundedDate);
                  }}
                  placeholderText="mm/dd/yyyy"
                />
              </FormReactSelectContainer>
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:Staff Size')}>
                <Select
                  name="Staff Size"
                  value={this.state.staffSizeType}
                  onChange={(staffSize) => this.setStaffSize(staffSize)}
                  options={staffSize}
                  valueKey={'value'}
                  labelKey={'label'}
                  autoBlur={true}
                  searchable={true}
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
            <div className="small-12 columns">
              <FormInput
                name="website"
                label={t('field:Company Website')}
                defaultValue={
                  tenantInfo ? tenantInfo.website : this.state.website
                }
                onBlur={(event) => {
                  this.setWebsite(event);
                }}
              />
            </div>
            <div className="small-12 columns">
              <FormTextArea
                name="description"
                label={t('field:description')}
                rows="3"
                maxLength={500}
                defaultValue={
                  tenantInfo && tenantInfo.description
                    ? tenantInfo.description
                    : this.state.description
                }
                onChange={(e) => {
                  this.setDescription(e);
                }}
              />
            </div>
          </div>
          <Divider />
          <div className="row expanded" style={{ marginTop: '10px' }}>
            <Button
              // variant="contained"
              color="primary"
              onClick={() => {
                this.cancel();
              }}
              style={{ marginRight: '10px' }}
            >
              Cancel
            </Button>
            <PrimaryButton
              type="Button"
              style={{ minWidth: 100 }}
              processing={this.state.creating}
              name="submit"
              onClick={() => {
                this.SaveTenant();
              }}
            >
              {tenantInfo ? t('action:save') : t('action:create')}
            </PrimaryButton>
          </div>
        </section>
        <MyDialog
          show={confirmDialog}
          modalTitle={`APN Pro Monthly Credits`}
          btnShow={true}
          SubmitBtnShow={true}
          SubmitBtnMsg={'Confirm'}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={false}
          CancelBtnMsg={'Cancel'}
          CancelBtnVariant={''}
          primary={() => {
            this.setState({
              confirmDialog: false,
            });
          }}
          handleClose={() => {
            this.setState({
              confirmDialog: false,
            });
          }}
        >
          <div>
            <label style={{ fontFamily: 'Roboto', fontSize: '14px' }}>
              {/* How many credits would you like to add?{' '} */}
              The new APN Pro monthly credits will be effective on the next
              credit reset date.
            </label>
            {/* <FormInput
              placeholder={`Enter a number`}
              onBlur={(e) => {
                this.setNewCredit(e);
              }}
              errorMessage={errorMessage && errorMessage.get('setCredit')}
            /> */}
          </div>
        </MyDialog>
      </div>
    );
  }
}

export default connect()(TenantInfo);
