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
  getClientContactList,
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
import AddressDropDown from '../../../components/AddressDropDown';
import Button from '@material-ui/core/Button';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Moment from 'moment-timezone';

class AddClientContactForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMessage: Immutable.Map(),
      relationshipRating: props.client.get('relationshipRating') || '',
      accountManager:
        props.client.get('accountManagerId') ||
        props.currentUser.get('id') ||
        '',
      active:
        props.client && props.client.get('id')
          ? props.client.get('active')
          : true,
      country: props.client.get('country') || '',

      loadingUsers: true,
      processing: false,
      ContactCategory: props.client.get('contactCategory') || null,
      lastContactDate: props.client.get('lastContactDate')
        ? Moment(props.client.get('lastContactDate'))
        : '',

      addAddressDialog: false,
      addressId: props.client.get('addressId') || null,
      comments: props.client.get('comments') || null,
      profile: null,
      phone: null,
      wechat: null,
      addressValue: props.client.get('address') || '',
      addressStatus: false,
      endData: moment().endOf('day'),
    };
  }

  // componentDidMount() {
  //   this.userTask = makeCancelable(this.props.dispatch(getAllUsers()));
  //   this.userTask.promise.then(() => this.setState({ loadingUsers: false }));
  // }

  handleSubmit = (e) => {
    e.preventDefault();
    const clientForm = e.target;
    const { t, dispatch, handleRequestClose } = this.props;

    let errorMessage = this._validateForm(clientForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    if (this.state.addressValue == '') {
      return this.setState({
        addressStatus: true,
      });
    } else {
      this.setState({
        addressStatus: false,
      });
    }
    const client = {
      esId: this.props.client.get('esId') || null,
      address: this.state.addressValue,
      active: this.state.active,
      addressId: this.state.addressId,
      name: clientForm.name.value + clientForm.LastName.value,
      firstName: clientForm.name.value,
      lastName: clientForm.LastName.value,
      zipcode: clientForm.zipCode.value,
      companyEntityId: this.props.companyId,
      // company: clientForm.company.value,
      title: clientForm.title.value,
      departmentTier1: clientForm.department && clientForm.department.value,
      // departmentTier2: clientForm.departmentTier2.value,
      // departmentTier3: clientForm.departmentTier3.value,
      // department: clientForm.department && clientForm.department.value,
      email: clientForm.email ? clientForm.email.value.trim() : null,
      phone:
        clientForm.phone && clientForm.phone.value !== ''
          ? clientForm.phone.value
          : null,
      wechat:
        clientForm.WeChat && clientForm.WeChat.value !== ''
          ? clientForm.WeChat.value
          : null,
      // accountManagerId:
      //   clientForm.accountManager && clientForm.accountManager.value,
      // relationshipRating:
      //   clientForm.relationshipRating && clientForm.relationshipRating.value,
      // comments,

      // addressLine: clientForm.addressLine.value,
      // country: clientForm.country.value,
      // city: clientForm.city.value,
      // province: clientForm.province.value,
      // zipcode: clientForm.zipcode.value,
      contactCategory: this.state.ContactCategory,
      // clientForm.contactCategory &&clientForm.contactCategory.value,
      profile: clientForm.LinkedInProfile
        ? clientForm.LinkedInProfile.value
        : this.state.profile,
      otherCategory: clientForm.otherCategory && clientForm.otherCategory.value,
      lastContactDate: this.state.lastContactDate
        ? Moment(this.state.lastContactDate).utc().format()
        : '',
      businessGroup: clientForm.businessGroup && clientForm.businessGroup.value,
      businessUnit: clientForm.businessUnit && clientForm.businessUnit.value,
      comments: clientForm.comments
        ? clientForm.comments.value
        : this.state.comments,
    };
    let aprID = this.props.client.get('approverId');

    if (!this.state.active && aprID) {
      this.props.getActiveStatu(!this.state.active);
      this.props.getClientData(client);
      return;
    }
    this.setState({ processing: true });
    dispatch(upsertClientContact(client, this.props.client.get('id')))
      .then((res) => {
        this.props
          .dispatch(getClientContactList(this.props.companyId))
          .then((response) => {
            if (res) {
              this.props.handleRequestClose();
            }
          });
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();
    if (!form.name.value) {
      errorMessage = errorMessage.set('name', t('message:firstNameIsRequired'));
    }
    if (!form.LastName.value) {
      errorMessage = errorMessage.set(
        'LastName',
        t('message:lastNameIsRequired')
      );
    }
    if (!this.state.ContactCategory) {
      errorMessage = errorMessage.set(
        'contactCategory',
        t('message:contactCategoryIsRequired')
      );
    }
    if (this.state.ContactCategory === 'OTHER' && !form.otherCategory.value) {
      errorMessage = errorMessage.set(
        'otherCategory',
        t('message:otherCategoryIsRequired')
      );
    }
    if (!form.title.value) {
      errorMessage = errorMessage.set('title', t('message:titleIsRequired'));
    }
    if (!form.phone.value) {
      errorMessage = errorMessage.set('phone', t('message:phoneIsRequired'));
    } else if (form.phone.value && form.phone.value !== '') {
      let regName = /^([\d+(-][-\d+\s\/)(*.·]{8,25}(\s*ext\s*\d{3,})?)$/i;
      if (!regName.test(form.phone.value)) {
        errorMessage = errorMessage.set('phone', t('message:phoneFormatError'));
      }
    }
    if (!form.zipCode.value) {
      errorMessage = errorMessage.set(
        'zipCode',
        t('message:Zip Code Is Required')
      );
    } else {
      let regCode = /^[0-9]*$/;
      if (!regCode.test(form.zipCode.value)) {
        errorMessage = errorMessage.set(
          'zipCode',
          t('message:Please enter a digital zip code')
        );
      }
    }
    // if (!form.title.value) {
    //   errorMessage = errorMessage.set('title', t('message:titleIsRequired'));
    // }
    // if (form.phone.value) {
    //   if (form.phone.value.length > 11) {
    //     errorMessage = errorMessage.set('phone', t('message:phoneLengthLimit'));
    //   }
    //   let regName = /^[0-9]+.?[0-9]*$/;
    //   if (!regName.test(form.phone.value)) {
    //     errorMessage = errorMessage.set('phone', t('message:phoneFormatError'));
    //   }
    // }
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
    // if (form.phone.value && form.phone.value !== '') {
    //   let regName = /^([\d+(-][-\d+\s\/)(*.·]{8,25}(\s*ext\s*\d{3,})?)$/i;
    //   if (!regName.test(form.phone.value)) {
    //     errorMessage = errorMessage.set('phone', t('message:phoneFormatError'));
    //   }
    // }
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
    console.log('id', id);
    console.log('value', value);

    this.setState({
      addressId: id,
      addressValue: value,
    });
  };
  // cityId = (id) => {
  //   this.setState({
  //     addressId: id,
  //   });
  // };
  activeChecked = () => {
    this.setState({
      active: !this.state.active,
    });
  };

  render() {
    const {
      errorMessage,
      processing,
      addAddressDialog,
      comments,
      addressStatus,
    } = this.state;
    const {
      t,
      client,
      userList,
      company,
      handleRequestClose,
      users,
      requiredType,
      companyId,
      companyType,
      ...props
    } = this.props;
    // let comments = getComments(client.get('comments'), users);
    return (
      <div>
        <DialogTitle>
          {client.get('id')
            ? t('common:Edit Contact')
            : t('common:Create Contact')}
          {client.get('id') ? (
            <FormControlLabel
              style={{ position: 'absolute', right: '20px' }}
              value="start"
              control={
                <Switch
                  color="primary"
                  size="small"
                  checked={this.state.active}
                  onChange={() => {
                    this.activeChecked();
                  }}
                />
              }
              label={t('common:Active')}
              labelPlacement="start"
            />
          ) : (
            ''
          )}
        </DialogTitle>
        <DialogContent>
          <form
            id="clientContactForm"
            className="row"
            onSubmit={this.handleSubmit}
          >
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="name"
                  label={t('field:First Name')}
                  defaultValue={client.get('firstName')}
                  isRequired={true}
                  onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('name')}
                  maxLength={200}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="LastName"
                  label={t('field:Last Name')}
                  defaultValue={client.get('lastName')}
                  isRequired={true}
                  onBlur={() => this.removeErrorMessage('LastName')}
                  errorMessage={errorMessage.get('LastName')}
                  maxlength={200}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={t('field:Contact Category')}
                  isRequired
                  errorMessage={errorMessage.get('contactCategory')}
                >
                  <Select
                    value={this.state.ContactCategory}
                    onChange={(ContactCategory) => {
                      this.setState({
                        ContactCategory: ContactCategory
                          ? ContactCategory.value
                          : null,
                      });
                      this.removeErrorMessage('contactCategory');
                    }}
                    valueKey={'value'}
                    labelKey={'label'}
                    // simpleValue
                    options={FormOptions.ContactCategory}
                    autoBlur={true}
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
                    defaultValue={client.get('otherCategory')}
                    placeholder={'Please provide a category '}
                    onBlur={() => this.removeErrorMessage('otherCategory')}
                    errorMessage={errorMessage.get('otherCategory')}
                    onChange={(e) => {
                      this.setState({ otherCategory: e.target.value });
                    }}
                  />
                ) : (
                  ''
                )}
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="title"
                  label={t('field:title')}
                  defaultValue={client.get('title')}
                  maxLength={200}
                  isRequired={true}
                  onBlur={() => this.removeErrorMessage('title')}
                  errorMessage={errorMessage.get('title')}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="businessGroup"
                  label={t('field:Business Group')}
                  defaultValue={client.get('businessGroup')}
                  maxLength={200}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="businessUnit"
                  label={t('field:Business Unit')}
                  defaultValue={client.get('businessUnit')}
                  maxLength={200}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="department"
                  label={t('field:Department')}
                  defaultValue={client.get('departmentTier1')}
                  maxlength={200}
                />
              </div>
              <div className="small-6  columns">
                <FormInput
                  name="LinkedInProfile"
                  label={t('field:LinkedIn Profile')}
                  onChange={(e) => {
                    this.setState({
                      profile: e.target.value,
                    });
                  }}
                  defaultValue={client.get('profile') || ''}
                  errorMessage={errorMessage.get('profile')}
                  onBlur={() => this.removeErrorMessage('profile')}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6  columns">
                <FormInput
                  name="email"
                  label={t('field:email')}
                  defaultValue={client.get('email') || ''}
                  isRequired={true}
                  errorMessage={errorMessage.get('email')}
                  onBlur={() => this.removeErrorMessage('email')}
                />
              </div>
              <div className="small-6 columns">
                {requiredType === '0' ? (
                  <FormInput
                    name="phone"
                    label={t('field:phone')}
                    defaultValue={client.get('phone') || null}
                    isRequired={true}
                    onBlur={() => this.removeErrorMessage('phone')}
                    errorMessage={errorMessage.get('phone')}
                  />
                ) : (
                  <FormInput
                    name="phone"
                    label={t('field:phone')}
                    isRequired={true}
                    defaultValue={client.get('phone') || null}
                    onBlur={() => this.removeErrorMessage('phone')}
                    errorMessage={errorMessage.get('phone')}
                  />
                )}
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="zipCode"
                  label={t('field:Zip Code')}
                  defaultValue={client.get('zipcode') || null}
                  errorMessage={errorMessage.get('zipCode')}
                  onBlur={() => this.removeErrorMessage('zipCode')}
                  isRequired={true}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="WeChat"
                  label={t('field:wechat')}
                  defaultValue={client.get('wechat') || null}
                  errorMessage={errorMessage.get('wechat')}
                  onBlur={() => this.removeErrorMessage('wechat')}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              {/* {props.addressShow ? ( */}
              <div className="small-12 columns">
                <div>
                  <div style={{ fontSize: '12px', float: 'left' }}>
                    Working Address
                    <span style={{ color: 'red', marginLeft: '5px' }}>*</span>
                  </div>
                  <div style={{ float: 'right' }}>
                    <Button
                      style={{ fontSize: '12px', padding: '0px' }}
                      color="primary"
                      onClick={() => {
                        this.props.addAddress();
                      }}
                    >
                      {t('tab:Add Address')}
                    </Button>
                  </div>
                </div>
                <AddressDropDown
                  // cityId={this.cityId}
                  companyId={companyId}
                  companyType={companyType}
                  addressValue={this.state.addressValue}
                  client={client}
                  {...props}
                  getAddressId={(id, value) => {
                    this.getAddressId(id, value);
                  }}
                />
                {addressStatus ? (
                  <div
                    style={{
                      color: '#cc4b37',
                      marginTop: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Working Address is required
                  </div>
                ) : null}
              </div>
              {/* ) : (
                ''
              )} */}
              <div className="small-12 columns" style={{ marginTop: '8px' }}>
                <FormReactSelectContainer
                  label={t('field:Last Contacted Date')}
                >
                  <DatePicker
                    maxDate={moment(this.state.endData)}
                    selected={this.state.lastContactDate}
                    onChange={(lastContactDate) => {
                      let dataTime = moment().endOf('day').format('x'); //当天时间23：59：59时间戳
                      //当前选取的时间戳
                      let endTime = moment(lastContactDate)
                        .endOf('day')
                        .format('x');
                      if (Number(endTime) <= Number(dataTime)) {
                        this.setState({
                          lastContactDate,
                        });
                      }
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
                  rows="5"
                  placeholder={comments}
                  maxLength={2000}
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleRequestClose}>
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

AddClientContactForm.propTypes = {
  client: PropTypes.instanceOf(Immutable.Map),
  companyEntity: PropTypes.instanceOf(Immutable.Map),
  handleRequestClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

AddClientContactForm.defaultProps = {
  client: Immutable.Map(),
  companyEntity: Immutable.Map(),
};

const mapStateToProps = (state, { match, client }) => {
  const companyId = match.params.id;
  const companyType = match.params.type;
  return {
    companyId: companyId,
    companyType: companyType,
    users: state.model.users,
    userList: getActiveUserList(
      state,
      client && client.get('accountManagerId')
    ),
    currentUser: state.controller.currentUser,
  };
};

export default connect(mapStateToProps)(AddClientContactForm);

const getComments = memoizeOne((commentsJSON, users) => {
  let comments = [];
  try {
    comments = (commentsJSON && JSON.parse(commentsJSON)) || [];
  } catch (e) {}
  comments.sort((a, b) => (a.time < b.time) - (a.time > b.time));
  console.log(users);
  return comments.reduce((res, comment) => {
    const user = users.get(String(comment.userId));
    res += `${formatBy2(comment.time, formatUserName(user))}\n${
      comment.content
    }\n\n`;
    return res;
  }, '');
});
