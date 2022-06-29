import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import {
  upsertapprover,
  getClientContactList,
} from '../../../actions/clientActions';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import FormTextArea from '../../../components/particial/FormTextArea';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import AddressDropDown from '../../../components/AddressDropDown';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import { connect } from 'react-redux';
import { showErrorMessage } from '../../../actions';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Moment from 'moment-timezone';

class ApproverFrom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      checked: false,
      processing: false,
    };
  }
  // 表单submit事件
  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const approverForm = e.target;
    const { t, dispatch, handleRequestClose, client, handleRequestShow } =
      this.props;
    const { checked } = this.state;
    let errorMessage = this._validateForm(approverForm, t);

    if (errorMessage) {
      if (
        errorMessage.get('FirstName') ||
        errorMessage.get('LastName') ||
        errorMessage.get('ContactCategory') ||
        errorMessage.get('Email') ||
        errorMessage.get('ZipCode') ||
        errorMessage.get('WorkingAddress') ||
        errorMessage.get('Title')
      ) {
        this.props.dispatch(
          showErrorMessage(
            'Please go to edit page to finish all the mandatory fields'
          )
        );
      }
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true });
    let params = {
      contactId: client.get('id'),
      password: approverForm.ConfirmPassword.value,
      inactived: false,
      received: checked,
    };
    dispatch(upsertapprover(params))
      .then((res) => {
        this.setState({ processing: false });
        this.props
          .dispatch(getClientContactList(this.props.companyId))
          .then(({ response }) => {
            if (res) {
              handleRequestShow(false);
            }
          });
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };
  // 表单验证
  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();
    if (!form.FirstName.value) {
      errorMessage = errorMessage.set(
        'FirstName',
        t('message:First Name IsRequired')
      );
    }
    if (!form.LastName.value) {
      errorMessage = errorMessage.set(
        'LastName',
        t('message:Last Name IsRequired')
      );
    }
    if (!form.ContactCategory.value) {
      errorMessage = errorMessage.set(
        'ContactCategory',
        t('message:Contact Category IsRequired')
      );
    }
    if (!form.Title.value) {
      errorMessage = errorMessage.set('Title', t('message:Title IsRequired'));
    }
    if (!form.Email.value) {
      errorMessage = errorMessage.set('Email', t('message:Email IsRequired'));
    }
    if (!form.ZipCode.value) {
      errorMessage = errorMessage.set(
        'ZipCode',
        t('message:Zip Code IsRequired')
      );
    }
    if (!form.WorkingAddress.value) {
      errorMessage = errorMessage.set(
        'WorkingAddress',
        t('message:Working Address Is Required')
      );
    }
    if (!form.ConfirmPassword.value) {
      errorMessage = errorMessage.set(
        'ConfirmPassword',
        t('message:Confirm Password IsRequired')
      );
    }
    if (!form.Password.value) {
      errorMessage = errorMessage.set(
        'Password',
        t('message:Password IsRequired')
      );
    }
    if (form.ConfirmPassword.value.length < 6) {
      errorMessage = errorMessage.set(
        'ConfirmPassword',
        t('message:Please enter your password (6-16 characters)')
      );
    }
    if (form.Password.value.length < 6) {
      errorMessage = errorMessage.set(
        'Password',
        t('message:Please enter your password (6-16 characters)')
      );
    }
    if (form.ConfirmPassword.value !== form.Password.value) {
      errorMessage = errorMessage.set(
        'ConfirmPassword',
        t('message:The password is entered incorrectly twice')
      );
    }
    return errorMessage.size > 0 && errorMessage;
  };
  // checkbox事件
  handleCheck = (e) => {
    this.setState({
      checked: e.target.checked,
    });
  };
  passChange = (e) => {
    if (e.target.value.length >= 6) {
      this.removeErrorMessage('Password');
    }
    this.setState({
      passValue: e.target.value.replace(/[\u4e00-\u9fa5]/g, ''),
    });
  };
  confirmChange = (e) => {
    if (e.target.value.length >= 6) {
      this.removeErrorMessage('ConfirmPassword');
    }
    this.setState({
      conPassValue: e.target.value.replace(/[\u4e00-\u9fa5]/g, ''),
    });
  };
  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };
  render() {
    const { errorMessage, checked, processing } = this.state;
    const { t, client, handleAppRequestClose, ...props } = this.props;
    return (
      <div>
        <DialogTitle>Timesheet Approver</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id="ApproverContactForm">
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="FirstName"
                  label={t('field:FirstName')}
                  defaultValue={client.get('firstName')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('FirstName')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="LastName"
                  label={t('field:LastName')}
                  defaultValue={client.get('lastName')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('LastName')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
            </div>

            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="ContactCategory"
                  label={t('field:ContactCategory')}
                  defaultValue={client.get('contactCategory')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('ContactCategory')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="Title"
                  label={t('field:Title')}
                  defaultValue={client.get('title')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('Title')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
            </div>

            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="Email"
                  label={t('field:Email')}
                  defaultValue={client.get('email')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('Email')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="Password"
                  // label={'Password'}
                  label={t('field:Password')}
                  // defaultValue={client.get('name')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('Password')}
                  errorMessage={errorMessage.get('Password')}
                  maxlength={16}
                  onChange={(e) => this.passChange(e)}
                  value={this.state.passValue}
                />
              </div>
            </div>

            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="ZipCode"
                  label={t('field:ZipCode')}
                  defaultValue={client.get('zipcode')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('ZipCode')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="ConfirmPassword"
                  label={t('field:Confirm Password')}
                  defaultValue={client.get('ConfirmPassword')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('ConfirmPassword')}
                  maxlength={16}
                  onChange={(e) => this.confirmChange(e)}
                  value={this.state.conPassValue}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-12 columns">
                <FormInput
                  name="WorkingAddress"
                  label={'Working Address'}
                  // label={t('field:FirstName')}
                  defaultValue={client.get('address')}
                  isRequired={true}
                  // onBlur={() => this.removeErrorMessage('name')}
                  errorMessage={errorMessage.get('WorkingAddress')}
                  maxlength={200}
                  disabled={true}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div
                style={{ display: 'flex', justifyContent: 'space-between' }}
                className="small-12 columns"
              >
                <div>
                  <Checkbox
                    checked={checked}
                    style={{ position: 'relative', left: '-12px' }}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    onChange={(e) => this.handleCheck(e)}
                  />
                </div>
                <div>
                  Receive email notifications when Timesheets or Expenses are
                  submitted for my approval.
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleAppRequestClose}>
              cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="ApproverContactForm"
              processing={processing}
            >
              Register
            </PrimaryButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}
ApproverFrom.propTypes = {
  client: PropTypes.instanceOf(Immutable.Map),
  companyEntity: PropTypes.instanceOf(Immutable.Map),
  handleRequestClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

ApproverFrom.defaultProps = {
  client: Immutable.Map(),
  companyEntity: Immutable.Map(),
};
const mapStateToProps = (state, { match, client }) => {
  const companyId = match.params.id;
  return {
    companyId,
  };
};
export default connect(mapStateToProps)(ApproverFrom);
