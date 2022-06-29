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

import { upsertClientContact } from '../../../actions/clientActions';
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
    };
  }

  // componentDidMount() {
  //   this.userTask = makeCancelable(this.props.dispatch(getAllUsers()));
  //   this.userTask.promise.then(() => this.setState({ loadingUsers: false }));
  // }

  handleSubmit = (e) => {
    e.preventDefault();

    const clientForm = e.target;
    const { t, dispatch, handleRequestClose, companyId } = this.props;
    let errorMessage = this._validateForm(clientForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true });
    const client = {
      name: clientForm.name.value,
      companyId: companyId,
      title: clientForm.title.value,
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
      department: clientForm.department && clientForm.department.value,
      active: this.state.active,
      businessGroup: clientForm.businessGroup && clientForm.businessGroup.value,
      businessUnit: clientForm.businessUnit && clientForm.businessUnit.value,
      companyAddressId: this.state.addressId,
      linkedinProfile: clientForm.profile
        ? clientForm.profile.value
        : this.state.profile,
      lastContactDate: this.state.lastContactDate
        ? this.state.lastContactDate.utc().format()
        : '',
      tenantId: this.props.companyId,
      otherCategory: clientForm.otherCategory && clientForm.otherCategory.value,
      remark: clientForm.comments
        ? clientForm.comments.value
        : this.state.comments,
    };

    dispatch(upsertClientContact(client, this.props.client.get('id')))
      .then((res) => {
        this.props.handleRequestClose();
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();
    if (!form.name.value) {
      errorMessage = errorMessage.set('name', t('message:fullNameIsRequired'));
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
    console.log(id);
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
  render() {
    const { errorMessage, processing, addAddressDialog, comments } = this.state;
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
              label="Active"
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
                  label={t('field:name')}
                  defaultValue={client.get('name')}
                  isRequired={true}
                  onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('name')}
                  maxLength={200}
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
            </div>
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="title"
                  label={t('field:title')}
                  defaultValue={client.get('title')}
                  maxLength={200}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="department"
                  label={t('field:Department')}
                  defaultValue={client.get('departmentTier1')}
                  maxLength={200}
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
                    defaultValue={client.get('phone') || null}
                    onBlur={() => this.removeErrorMessage('phone')}
                    errorMessage={errorMessage.get('phone')}
                  />
                )}
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
                  defaultValue={client.get('profile') || ''}
                  errorMessage={errorMessage.get('profile')}
                  onBlur={() => this.removeErrorMessage('profile')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="WeChat"
                  label={t('field:WeChat')}
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
                  <div style={{ fontSize: '12px', float: 'left' }}>Address</div>
                  <div style={{ float: 'right' }}>
                    <Button
                      style={{ fontSize: '12px', padding: '0px' }}
                      color="primary"
                      onClick={() => {
                        this.props.addAddress();
                      }}
                    >
                      Add Address
                    </Button>
                  </div>
                </div>
                <AddressDropDown
                  companyId={companyId}
                  companyType={companyType}
                  addressValue={this.state.addressValue}
                  client={client}
                  {...props}
                  getAddressId={(id, value) => {
                    this.getAddressId(id, value);
                  }}
                />
              </div>
              {/* ) : (
                ''
              )} */}
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
                    maxDate={moment(new Date())}
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
