import React, { Component } from 'react';
import CompanyLogo from '../../Companies/Form/CompanyLogo';
import { uploadAvatar } from '../../../../apn-sdk/files';
import { industryList, staffSize } from '../../../constants/formOptions';
import Select from 'react-select';
import FormInput from '../../../components/particial/FormInput';
import FormTextArea from '../../../components/particial/FormTextArea';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import Location from '../../../components/Location';
import Divider from '@material-ui/core/Divider';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import Button from '@material-ui/core/Button';
import Immutable from 'immutable';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { createTenant, putTenantAdmin } from '../../../actions/tenantAdmin';

import { showErrorMessage } from '../../../actions/index';
import { connect } from 'react-redux';
import loadsh from 'lodash';
class NewCompanyEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logo: this.props.tenantInfo ? this.props.tenantInfo.logo : null,
      name: this.props.tenantInfo ? this.props.tenantInfo.name : null,
      adminFirstName: this.props.tenantInfo
        ? this.props.tenantInfo.adminFirstName
        : null,
      adminLastName: this.props.tenantInfo
        ? this.props.tenantInfo.adminLastName
        : null,
      adminEmail: this.props.tenantInfo ? this.props.tenantInfo.email : null,
      industry: this.props.tenantInfo ? this.props.tenantInfo.industry : null,
      website: this.props.tenantInfo ? this.props.tenantInfo.website : null,
      address:
        this.props.tenantInfo && this.props.tenantInfo.address
          ? this.props.tenantInfo.address.address
          : null,
      monthlyCredit: this.props.tenantInfo
        ? this.props.tenantInfo.monthlyCredit
        : null,
      bulkCredit: this.props.tenantInfo
        ? this.props.tenantInfo.bulkCredit
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
      updateMonthlyCredit: this.props.tenantInfo
        ? this.props.tenantInfo.updateMonthlyCredit
        : null,
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
  setTenantEmail = (event) => {
    this.setState({
      tenantEmail: event.target.value,
    });
  };
  setTenantPhone = (event) => {
    this.setState({
      tenantPhone: event.target.value,
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
      adminFirstName,
      adminLastName,
      adminEmail,
      industry,
      credit,
      users,
    } = this.state;
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
      tenantEmail,
      tenantPhone,
      monthlyCredit,
      bulkCredit,
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
      monthlyCredit: Number(monthlyCredit),
      bulkCredit: Number(bulkCredit),
      updateMonthlyCredit: updateMonthlyCredit,
      description: description,
      admin: users,
      foundedDate: foundedDate
        ? foundedDate.format('YYYY-MM-DDTHH:mm:ss[Z]')
        : null,
      status: status,
      staffSizeType: staffSizeType,
      tenantEmail: tenantEmail,
      tenantPhone: tenantPhone,
    };
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
          this.props.fetchData();
          this.props.closedEdit();
        }
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({
          creating: false,
        });
      });
  };

  cancel = () => {
    this.props.closedEdit();
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
    let _users = loadsh.cloneDeep(users);
    _users.splice(index, 1);
    this.setState({
      users: _users,
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
  render() {
    const { t, tenantInfo } = this.props;
    const { errorMessage, users, addCreditShow, creditDefaultVal } = this.state;
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
          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                name="tenantName"
                label={t('tab:Tenant Name')}
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
          <div className="row expanded">
            <div className="small-12 columns">
              <FormInput
                name="website "
                label={t('field:website')}
                defaultValue={
                  tenantInfo ? tenantInfo.website : this.state.website
                }
                onBlur={(event) => {
                  this.setWebsite(event);
                }}
              />
            </div>
            <div className="small-6 columns">
              <FormInput
                name="address"
                label={t('tab:address')}
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
                  {this.props.t('tab:City/State/Country')}
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
                name="email"
                label={t('field:email')}
                defaultValue={this.state.tenantEmail}
                onBlur={(event) => {
                  this.setTenantEmail(event);
                }}
              />
            </div>
            <div className="small-6 columns">
              <FormInput
                name="phone"
                label={t('field:phone')}
                defaultValue={this.state.tenantPhone}
                onBlur={(event) => {
                  this.setTenantPhone(event);
                }}
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('tab:Founded')}>
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
              <FormReactSelectContainer label={t('tab:Staff Size')}>
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
              {t('action:cancel')}
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
      </div>
    );
  }
}

export default connect()(NewCompanyEdit);
