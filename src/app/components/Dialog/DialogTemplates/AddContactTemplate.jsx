import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormTextArea from '../../particial/FormTextArea';
import FormInput from '../../particial/FormInput';
import Button from '@material-ui/core/Button';
import DatePicker from 'react-datepicker';
import * as FormOptions from '../../../constants/formOptions';
import Select from 'react-select';
import Immutable from 'immutable';
import { isEmail } from '../../../../utils';

const styles = {
  root: {
    width: '495px',
    minHeight: '600px',
  },
};

class AddContactTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.contact ? props.contact.name : null,
      contactCategory: props.contact ? props.contact.contactCategory : null,
      otherCategory: props.contact ? props.contact.otherCategory : null,
      title: props.contact ? props.contact.title : null,
      department: props.contact ? props.contact.departmentTier1 : null,
      businessGroup: props.contact ? props.contact.businessGroup : null,
      businessUnit: props.contact ? props.contact.businessUnit : null,
      email: props.contact ? props.contact.email : null,
      phone: props.contact ? props.contact.phone : null,
      linkedinProfile: props.contact ? props.contact.linkedinProfile : null,
      wechat: props.contact ? props.contact.wechat : null,
      lastContactDate: props.contact ? props.contact.lastContactDate : null,
      remark: props.contact ? props.contact.remark : null,
      errorMessage: Immutable.Map(),
    };
  }
  sendContactForm = () => {
    let errorMessage = this._validateForm(this.props.t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    let obj = {
      name: this.state.name,
      contactCategory: this.state.contactCategory,
      otherCategory: this.state.otherCategory,
      title: this.state.title,
      department: this.state.department,
      businessGroup: this.state.businessGroup,
      businessUnit: this.state.businessUnit,
      email: this.state.email,
      phone: this.state.phone,
      linkedinProfile: this.state.linkedinProfile,
      wechat: this.state.wechat,
      lastContactDate: this.state.lastContactDate,
      remark: this.state.remark,
    };
    this.props.sendContact(obj);
  };
  _validateForm = (t) => {
    let errorMessage = Immutable.Map();

    if (!this.state.name) {
      errorMessage = errorMessage.set('name', t('message:fullNameIsRequired'));
    }

    if (this.state.email && !isEmail(this.state.email.trim())) {
      errorMessage = errorMessage.set('email', t('message:emailIsInvalid'));
    }
    if (!this.state.email) {
      errorMessage = errorMessage.set('email', t('message:emailIsRequired'));
    }
    if (!this.state.phone) {
      errorMessage = errorMessage.set('phone', t('message:phoneIsRequired'));
    }
    // else {
    //   if (this.state.phone.length > 11) {
    //     errorMessage = errorMessage.set('phone', t('message:phoneLengthLimit'));
    //   }
    //   let regName = /^[0-9]+.?[0-9]*$/;
    //   if (!regName.test(this.state.phone)) {
    //     errorMessage = errorMessage.set('phone', t('message:phoneFormatError'));
    //   }
    // }
    if (!this.state.contactCategory) {
      errorMessage = errorMessage.set(
        'contactCategory',
        t('message:contactCategoryIsRequired')
      );
    }
    if (this.state.contactCategory === 'OTHER' && !this.state.otherCategory) {
      errorMessage = errorMessage.set(
        'otherCategory',
        t('message:otherCategoryIsRequired')
      );
    }
    return errorMessage.size > 0 && errorMessage;
  };
  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };
  render() {
    const { classes, t } = this.props;
    const {
      name,
      contactCategory,
      otherCategory,
      title,
      department,
      businessGroup,
      businessUnit,
      email,
      phone,
      profile,
      wechat,
      lastContactedDate,
      comments,
      errorMessage,
    } = this.state;
    return (
      <div className={classes.root}>
        <div className="row flex-child-auto">
          <div className="small-6 columns">
            <FormInput
              name="name"
              label={t('field:name')}
              autoComplete="true"
              defaultValue={name}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('name') : null}
              onChange={(e) => {
                this.setState({ name: e.target.value });
              }}
              onBlur={() => this.removeErrorMessage('name')}
            />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:Contact Category')}
              isRequired={true}
              errorMessage={
                errorMessage ? errorMessage.get('contactCategory') : null
              }
            >
              <Select
                name="contactCategory"
                valuekey={'value'}
                labelkey={'label'}
                value={contactCategory}
                onChange={(contactCategory) => {
                  this.setState({ contactCategory: contactCategory.value });
                }}
                // simpleValue
                options={FormOptions.ContactCategory}
                autoBlur={true}
              />
            </FormReactSelectContainer>
            {contactCategory === 'OTHER' ? (
              <FormInput
                name="otherCategory"
                value={otherCategory}
                placeholder={'Please provide a category '}
                onChange={(e) => {
                  this.setState({ otherCategory: e.target.value });
                }}
                errorMessage={errorMessage.get('otherCategory')}
                onBlur={() => this.removeErrorMessage('otherCategory')}
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
              autoComplete="true"
              onChange={(e) => {
                this.setState({ title: e.target.value });
              }}
              defaultValue={title}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="department"
              label={t('field:Department')}
              autoComplete="true"
              onChange={(e) => {
                this.setState({ department: e.target.value });
              }}
              defaultValue={department}
            />
          </div>
        </div>
        <div className="row flex-child-auto">
          <div className="small-6 columns">
            <FormInput
              name="businessGroup"
              label={t('field:Business Group')}
              autoComplete="true"
              onChange={(e) => {
                this.setState({ businessGroup: e.target.value });
              }}
              defaultValue={businessGroup}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="businessUnit"
              label={t('field:Business Unit')}
              autoComplete="true"
              onChange={(e) => {
                this.setState({ businessUnit: e.target.value });
              }}
              defaultValue={businessUnit}
            />
          </div>
        </div>
        <div className="row flex-child-auto">
          <div className="small-6  columns">
            <FormInput
              name="email"
              label={t('field:email')}
              defaultValue={email}
              autoComplete="true"
              isRequired={true}
              onChange={(e) => {
                e.preventDefault();
                this.setState({ email: e.target.value });
              }}
              errorMessage={errorMessage ? errorMessage.get('email') : null}
              onBlur={() => this.removeErrorMessage('email')}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="phone"
              label={t('field:phone')}
              autoComplete="true"
              defaultValue={phone}
              isRequired={true}
              onChange={(e) => {
                this.setState({ phone: e.target.value });
              }}
              errorMessage={errorMessage ? errorMessage.get('phone') : null}
              onBlur={() => this.removeErrorMessage('phone')}
            />
          </div>
        </div>
        <div className="row flex-child-auto">
          <div className="small-6  columns">
            <FormInput
              name="LinkedIn Profile"
              label={t('field:LinkedIn Profile')}
              autoComplete="true"
              onChange={(e) => {
                console.log(e.target.value);
                this.setState({
                  profile: e.target.value !== '' ? e.target.value : null,
                });
              }}
              defaultValue={profile}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="WeChat"
              label={t('field:WeChat')}
              autoComplete="true"
              onChange={(e) => {
                this.setState({
                  wechat: e.target.value !== '' ? e.target.value : null,
                });
              }}
              defaultValue={wechat}
            />
          </div>
        </div>
        <div className="row flex-child-auto">
          <div className="small-12 columns">
            <FormReactSelectContainer label={t('field:Last Contacted Date')}>
              <DatePicker
                selected={lastContactedDate}
                onChange={(lastContactedDate) => {
                  this.setState({
                    lastContactedDate: lastContactedDate,
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
                console.log(e.target.value);
                this.setState({ comments: e.target.value });
              }}
              rows="5"
              placeholder={''}
            />
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button
            color="primary"
            onClick={() => {
              this.props.handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: '20px' }}
            onClick={() => {
              this.sendContactForm();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AddContactTemplate);
