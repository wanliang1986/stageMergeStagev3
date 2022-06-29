import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
  isEmail,
  formatBy2,
  makeCancelable,
  formatUserName,
} from '../../../../utils';

import {
  upsertClientContact,
  addCommonPooltoCompany,
} from '../../../actions/clientActions';
import * as FormOptions from '../../../constants/formOptions';
import { showErrorMessage } from '../../../actions';
import { getActiveUserList } from '../../../selectors/userSelector';
import memoizeOne from 'memoize-one';
import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormTextArea from '../../../components/particial/FormTextArea';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import AddressDropDown from '../../../pages/Candidates/CommonPoolList/CommonPoolDetail/AddressDropDown';
import Button from '@material-ui/core/Button';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Moment from 'moment-timezone';
import { getCLientContactAddress } from '../../../actions/clientActions';
import { withStyles } from '@material-ui/core';
const styles = {
  // select: {
  //     '& .SelectMenuOuter': {
  //         width: '500px'
  //     }
  // }
};

class AddCompanyContactsTemplate extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMessage: Immutable.Map(),
      //   relationshipRating: props.client.get('relationshipRating') || '',
      //   accountManager:
      //     props.client.get('accountManagerId') ||
      //     props.currentUser.get('id') ||
      //     '',
      //   active:
      //     props.client && props.client.get('id')
      //       ? props.client.get('active')
      //       : true,
      //   country: props.client.get('country') || '',

      //   loadingUsers: true,
      processing: false,
      ContactCategory: null,
      lastContactDate: null,
      comments: null,
      profile: null,
      phone: null,
      wechat: null,
      otherCategory: null,
      title: null,
      department: null,
      businessGroup: null,
      businessUnit: null,
      company: null,
      addressList: null,
      addressValue: '',
      addSuccessMseesge: false,
    };
  }

  // componentDidMount() {
  //   this.userTask = makeCancelable(this.props.dispatch(getAllUsers()));
  //   this.userTask.promise.then(() => this.setState({ loadingUsers: false }));
  // }

  componentDidMount() {
    console.log(this.props.contact);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const clientForm = e.target;
    const { t, dispatch, handleClose } = this.props;
    let errorMessage = this._validateForm(clientForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true });
    const client = {
      active: true,
      esId: this.props.contact.esId,
      addressId: this.state.addressId,
      firstName: clientForm.FirstName.value,
      lastName: clientForm.LastName.value,
      companyEntityId: this.state.company.value,
      title: clientForm.title.value,
      departmentTier1: clientForm.department && clientForm.department.value,
      email: clientForm.email ? clientForm.email.value.trim() : null,
      phone:
        clientForm.phone && clientForm.phone.value !== ''
          ? clientForm.phone.value
          : null,
      wechat:
        clientForm.WeChat && clientForm.WeChat.value !== ''
          ? clientForm.WeChat.value
          : null,
      contactCategory: this.state.ContactCategory,
      profile: clientForm.LinkedInProfile
        ? clientForm.LinkedInProfile.value
        : this.state.profile,
      otherCategory: clientForm.otherCategory && clientForm.otherCategory.value,
      lastContactDate: this.state.lastContactDate
        ? Moment(this.state.lastContactDate).utc().format()
        : null,
      businessGroup: clientForm.businessGroup && clientForm.businessGroup.value,
      businessUnit: clientForm.businessUnit && clientForm.businessUnit.value,
      comments: clientForm.comments
        ? clientForm.comments.value
        : this.state.comments,
    };
    console.log(client);
    dispatch(addCommonPooltoCompany(client))
      .then((res) => {
        handleClose(true);
        this.setState({
          addSuccessMseesge: true,
        });
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm = (form, t) => {
    const { company, addressId } = this.state;
    let errorMessage = Immutable.Map();
    if (!form.FirstName.value) {
      errorMessage = errorMessage.set(
        'firstName',
        t('message:FirstNameIsRequired')
      );
    }
    if (!form.LastName.value) {
      errorMessage = errorMessage.set(
        'lastName',
        t('message:LastNameIsRequired')
      );
    }
    if (!form.contactCategory.value) {
      errorMessage = errorMessage.set(
        'contactCategory',
        t('message:contactCategoryIsRequired')
      );
    }
    if (form.contactCategory.value === 'OTHER' && !form.otherCategory.value) {
      errorMessage = errorMessage.set(
        'otherCategory',
        t('message:otherCategoryIsRequired')
      );
    }

    if (!company) {
      errorMessage = errorMessage.set(
        'company',
        t('message:companyIsRequired')
      );
    }

    if (!addressId) {
      errorMessage = errorMessage.set(
        'address',
        t('message:addressIsRequired')
      );
    }

    if (form.LinkedInProfile.value && form.LinkedInProfile.value !== '') {
      const isLinkedin =
        /(?:https?:\/\/)?(?:(?:www|[a-z]{2})\.)?linkedin\.com\/(?:in|talent\/profile|public-profile\/in|chatin\/wnc\/in|mwlite\/in)\/([^^/ :?？=—*&!！`$)(）（<>©|}{@#]{3,900})/i;
      if (!isLinkedin.test(form.LinkedInProfile.value)) {
        errorMessage = errorMessage.set('profile', t('message:linkedinError'));
      }
    }

    if (form.WeChat.value && form.WeChat.value !== '') {
      const isWechat =
        /^[a-z_-][a-z0-9_-]{5,19}$|^[\d+(-][-\d+\s\/)(*.·]{8,25}$|https:\/\/wechat-qrcode.s3.[-\w]*.amazonaws.com\/\w*/i;
      if (!isWechat.test(form.WeChat.value)) {
        errorMessage = errorMessage.set('wechat', t('message:wechatError'));
      }
    }

    // if (!form.title.value) {
    //   errorMessage = errorMessage.set('title', t('message:titleIsRequired'));
    // }
    if (form.phone.value && form.phone.value !== '') {
      let regName = /^([\d+(-][-\d+\s\/)(*.·]{8,25}(\s*ext\s*\d{3,})?)$/i;
      if (!regName.test(form.phone.value)) {
        errorMessage = errorMessage.set('phone', t('message:phoneFormatError'));
      }
    }
    if (form.email.value && !isEmail(form.email.value.trim())) {
      errorMessage = errorMessage.set('email', t('message:emailIsInvalid'));
    }
    if (!form.email.value) {
      errorMessage = errorMessage.set('email', t('message:emailIsRequired'));
    }
    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };
  getAddressId = (id, value) => {
    this.setState({
      addressId: id,
      addressValue: value,
    });
  };
  activeChecked = () => {
    this.setState({
      active: !this.state.active,
    });
  };
  getEmail = () => {
    const { contact } = this.props;
    let email =
      contact &&
      contact.contacts.filter((item, index) => {
        return item.type === 'EMAIL';
      });
    if (email.length > 0) {
      return email[0].contact;
    }
    return null;
  };
  getPhone = () => {
    const { contact } = this.props;
    let phone =
      contact &&
      contact.contacts.filter((item, index) => {
        return item.type === 'PHONE';
      });
    if (phone.length > 0) {
      return phone[0].contact;
    }
    return null;
  };
  getLinkedIn = () => {
    const { contact } = this.props;
    let linkedIn =
      contact &&
      contact.contacts.filter((item, index) => {
        return item.type === 'LINKEDIN';
      });
    if (linkedIn.length > 0) {
      return linkedIn[0].details;
    }
    return null;
  };
  getWeChat = () => {
    const { contact } = this.props;
    let wechat =
      contact &&
      contact.contacts.filter((item, index) => {
        return item.type === 'WECHAT';
      });
    if (wechat.length > 0) {
      return wechat[0].contact;
    }
    return null;
  };

  setCompany = (company) => {
    this.setState({
      company: company,
      addressList: null,
      addressId: null,
    });

    if (company) {
      this.props
        .dispatch(getCLientContactAddress(company.value))
        .then((res) => {
          if (res) {
            this.setState({
              addressList: res.response,
            });
          }
        });
    }
    if (this.state.addressValue) {
      this.$Child.handleInputChange('', '', 'clear');
      console.log(this.$Child);
    }
  };
  render() {
    const { errorMessage, processing, addAddressDialog, comments } = this.state;
    const {
      classes,
      t,
      client,
      userList,
      company,
      handleClose,
      users,
      requiredType,
      companyId,
      companyType,
      contact,
      companiesOptions,
      ...props
    } = this.props;
    return (
      <div>
        <DialogTitle>{'Add to “Company-Contact”'}</DialogTitle>
        <DialogContent>
          <form
            id="clientContactForm"
            className="row"
            onSubmit={this.handleSubmit}
          >
            <div className="row flex-child-auto">
              <div className="small-3 columns">
                <FormInput
                  name="FirstName"
                  label={t('field:firstName')}
                  defaultValue={contact.firstName}
                  isRequired={true}
                  onBlur={() => this.removeErrorMessage('firstName')}
                  errorMessage={errorMessage.get('firstName')}
                  maxlength={200}
                />
              </div>
              <div className="small-3 columns">
                <FormInput
                  name="LastName"
                  label={t('field:LastName')}
                  defaultValue={contact.lastName}
                  isRequired={true}
                  onBlur={() => this.removeErrorMessage('lastName')}
                  errorMessage={errorMessage.get('lastName')}
                  maxlength={200}
                />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={t('field:Contact Category')}
                  isRequired
                  errorMessage={errorMessage.get('contactCategory')}
                >
                  <Select
                    value={this.state.ContactCategory}
                    onChange={(ContactCategory) => {
                      console.log(ContactCategory);
                      this.setState({
                        ContactCategory: ContactCategory
                          ? ContactCategory.value
                          : null,
                      });
                      this.removeErrorMessage('contactCategory');
                    }}
                    valueKey={'value'}
                    labelKey={'label'}
                    options={FormOptions.ContactCategory}
                    autoBlur={true}
                    placeholder={this.props.t('tab:select')}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="contactCategory"
                  value={this.state.ContactCategory}
                />
                {this.state.ContactCategory === 'OTHER' ? (
                  <FormInput
                    name="otherCategory"
                    defaultValue={this.state.otherCategory}
                    placeholder={'Please provide a category '}
                    onBlur={() => this.removeErrorMessage('otherCategory')}
                    errorMessage={errorMessage.get('otherCategory')}
                    onChange={(e) => {
                      this.setState({ otherCategory: e.target.value });
                    }}
                  />
                ) : null}
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="title"
                  label={t('field:title')}
                  defaultValue={this.state.title}
                  maxlength={200}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="department"
                  label={t('field:Department')}
                  defaultValue={this.state.department}
                  maxlength={200}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="businessGroup"
                  label={t('field:Business Group')}
                  defaultValue={this.state.businessGroup}
                  maxlength={200}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="businessUnit"
                  label={t('field:Business Unit')}
                  defaultValue={this.state.businessUnit}
                  maxlength={200}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6  columns">
                <FormInput
                  name="email"
                  label={t('field:email')}
                  defaultValue={this.getEmail()}
                  isRequired={true}
                  errorMessage={errorMessage.get('email')}
                  onBlur={() => this.removeErrorMessage('email')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="phone"
                  label={t('field:phone')}
                  defaultValue={this.getPhone()}
                  onBlur={() => this.removeErrorMessage('phone')}
                  errorMessage={errorMessage.get('phone')}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6  columns">
                <FormInput
                  name="LinkedInProfile"
                  label={t('field:LinkedIn Profile')}
                  onChange={(e) => {
                    this.setState({
                      profile: e.target.value,
                    });
                  }}
                  defaultValue={this.getLinkedIn()}
                  errorMessage={errorMessage.get('profile')}
                  onBlur={() => this.removeErrorMessage('profile')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="WeChat"
                  label={t('field:wechat')}
                  defaultValue={this.getWeChat()}
                  errorMessage={errorMessage.get('wechat')}
                  onBlur={() => this.removeErrorMessage('wechat')}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-12 columns">
                <FormReactSelectContainer
                  label={t('field:Company')}
                  isRequired
                  errorMessage={errorMessage.get('company')}
                >
                  <Select
                    // className={classes.select}
                    value={this.state.company}
                    onChange={(company) => {
                      this.removeErrorMessage('company');
                      this.setCompany(company);
                    }}
                    valueKey={'value'}
                    labelKey={'label'}
                    // simpleValue
                    options={companiesOptions}
                    autoBlur={true}
                    placeholder={this.props.t('tab:select')}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="company"
                  value={this.state.company ? this.state.company.value : null}
                />
              </div>
              <div className="small-12 columns">
                <div>
                  <div
                    style={
                      errorMessage.get('address')
                        ? { fontSize: '12px', float: 'left', color: '#cc4b37' }
                        : { fontSize: '12px', float: 'left' }
                    }
                  >
                    {this.props.t('tab:Address')}
                    <span style={{ color: 'red' }}>*</span>
                  </div>
                </div>
                <AddressDropDown
                  onRef={(ref) => {
                    this.$Child = ref;
                  }}
                  addressList={this.state.addressList}
                  addressValue={this.state.addressValue}
                  {...props}
                  getAddressId={(id, value) => {
                    this.removeErrorMessage('address');
                    this.getAddressId(id, value);
                  }}
                  errorMessage={errorMessage}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    color: '#cc4b37',
                  }}
                >
                  {errorMessage && errorMessage.get('address')}
                </span>
              </div>
              <div className="small-12 columns" style={{ marginTop: '8px' }}>
                <FormReactSelectContainer
                  label={t('field:Last Contacted Date')}
                >
                  <DatePicker
                    selected={this.state.lastContactDate}
                    onChange={(lastContactDate) => {
                      this.setState({
                        lastContactDate,
                      });
                    }}
                    placeholderText="mm/dd/yyyy"
                  />
                </FormReactSelectContainer>
              </div>
              <div className="small-12 columns">
                <FormTextArea
                  name="Remark"
                  label={t('field:Remark')}
                  defaultValue={comments}
                  onChange={(e) => {
                    this.setState({
                      comments: e.target.value,
                    });
                  }}
                  rows="3"
                  placeholder={comments}
                  maxLength={2000}
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton
              onClick={() => {
                handleClose(false);
              }}
            >
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="clientContactForm"
              processing={processing}
            >
              {/* {client.get('id') ? t('action:save') : t('action:add')} */}
              {t('action:save')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const companiesOptions = state.controller.newSearchOptions
    .get('companyOptions')
    .map((item, index) => {
      return {
        ...item,
        label: `${nameFilter(item.label)} ${
          item.country ? '-' + item.country : ''
        } ${
          filterIndustry(item.industry)
            ? '-' + filterIndustry(item.industry)
            : ''
        }`,
      };
    });
  return {
    companiesOptions,
  };
};

const filterIndustry = (value) => {
  let label = FormOptions.industryList.filter((item, index) => {
    return item.value === value;
  });
  if (label.length > 0) {
    return label[0].label;
  }
  return null;
};

const nameFilter = (value) => {
  let length = value.length;
  let str;
  if (length > 60) {
    str = value.substr(0, 60) + '...';
  } else {
    str = value;
  }
  return str;
};

export default connect(mapStateToProps)(
  withStyles(styles)(AddCompanyContactsTemplate)
);
