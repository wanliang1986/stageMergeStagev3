import React, { Component } from 'react';
import memoizeOne from 'memoize-one';
import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { upsertapprover } from '../../../actions/clientActions';
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

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Moment from 'moment-timezone';
import { remove } from 'lodash';
import { showErrorMessage } from '../../../actions/index';
import { getClientContactList } from '../../../actions/clientActions';

class PortalContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      checked: null,
      receiveChecked: false,
      confirmValue: '',
      passwordValue: '',
      InactinveStatus: false,
      processing: false,
    };
  }
  // 表单submit事件
  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const portalContactForm = e.target;
    const { t, dispatch, handleRequestClose, client, showStatus, handleShow } =
      this.props;
    const { checked, receiveChecked } = this.state;

    if (checked) {
      return showStatus(true);
    }

    let errorMessage = this._validateForm(portalContactForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({
      processing: true,
    });
    let params = {
      contactId: client.get('id'),
      password: portalContactForm.ConfirmPassword.value || null,
      inactived: checked,
      received: receiveChecked,
    };
    dispatch(upsertapprover(params))
      .then((res) => {
        this.setState({
          processing: false,
        });
        dispatch(getClientContactList(this.props.companyId)).then((res) => {
          if (res) {
            handleShow(false);
          }
        });
      })
      .catch((err) => {
        this.setState({
          processing: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };
  // 表单验证
  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();
    if (form.Password.value.length !== 0) {
      if (form.Password.value.length < 6) {
        errorMessage = errorMessage.set(
          'Password',
          t('message:Please enter your password (6-16 characters)')
        );
      } else if (form.Password.value.length >= 6) {
        if (form.ConfirmPassword.value.length === 0) {
          errorMessage = errorMessage.set(
            'ConfirmPassword',
            t('message:Please enter your password (6-16 characters)')
          );
        } else if (form.ConfirmPassword.value.length < 6) {
          errorMessage = errorMessage.set(
            'ConfirmPassword',
            t('message:Please enter your password (6-16 characters)')
          );
        }
      }
    }

    if (form.ConfirmPassword.value.length !== 0) {
      if (form.Password.value !== form.ConfirmPassword.value) {
        errorMessage = errorMessage.set(
          'ConfirmPassword',
          t('message:The entered passwords are inconsistent')
        );
      }
    }

    return errorMessage.size > 0 && errorMessage;
  };
  // checkbox事件
  handleCheck = (e) => {
    this.setState(
      {
        checked: e.target.checked,
        InactinveStatus: e.target.checked,
        passwordValue: '',
        confirmValue: '',
        receiveChecked: false,
      },
      () => {
        this.removeErrorMessage('Password');
        this.removeErrorMessage('ConfirmPassword');
      }
    );
  };
  handleReceive = (e) => {
    this.setState({
      receiveChecked: e.target.checked,
      checked: false,
      InactinveStatus: false,
    });
  };
  getconfirmValue = (e) => {
    if (e.target.value === this.state.passwordValue) {
      this.removeErrorMessage('ConfirmPassword');
    }
    this.setState({
      confirmValue: e.target.value.replace(/[\u4e00-\u9fa5]/g, ''),
    });
  };
  getPasswordValue = (e) => {
    this.setState({
      passwordValue: e.target.value.replace(/[\u4e00-\u9fa5]/g, ''),
    });
  };
  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };
  componentDidMount() {
    this.setState(
      {
        receiveChecked: this.props.client.get('receiveEmail') || false,
        checked: this.props.client.get('inactived') || false,
      },
      () => {
        if (this.state.checked) {
          this.setState({
            InactinveStatus: true,
            passwordValue: '',
            confirmValue: '',
          });
        }
      }
    );
  }
  render() {
    const {
      errorMessage,
      checked,
      receiveChecked,
      confirmValue,
      passwordValue,
      InactinveStatus,
    } = this.state;
    const { t, client, handlePortalClose, ...props } = this.props;
    const { processing } = this.state;
    return (
      <div>
        <DialogTitle>Reset Portal Account</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id="portalContactForm">
            <div className="row flex-child-auto">
              <div className="small-6 columns">
                <FormInput
                  name="Password"
                  label={t('field:Password')}
                  errorMessage={errorMessage.get('Password')}
                  maxlength={16}
                  onChange={this.getPasswordValue}
                  value={passwordValue}
                  disabled={InactinveStatus}
                  onBlur={() => {
                    this.removeErrorMessage('Password');
                  }}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="ConfirmPassword"
                  label={t('field:Confirm Password')}
                  errorMessage={errorMessage.get('ConfirmPassword')}
                  maxlength={16}
                  onChange={this.getconfirmValue}
                  value={confirmValue}
                  disabled={InactinveStatus}
                  onBlur={() => {
                    this.removeErrorMessage('ConfirmPassword');
                  }}
                />
              </div>
            </div>

            <div className="row flex-child-auto">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
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
                <div>Inactivate</div>
              </div>
            </div>

            <div className="row flex-child-auto">
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                className="small-12 columns"
              >
                <div>
                  <Checkbox
                    checked={receiveChecked}
                    style={{ position: 'relative', left: '-12px' }}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                    onChange={(e) => this.handleReceive(e)}
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
            <SecondaryButton onClick={handlePortalClose}>
              cancel
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="portalContactForm"
              processing={processing}
            >
              Save
            </PrimaryButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}
PortalContactForm.propTypes = {
  client: PropTypes.instanceOf(Immutable.Map),
  companyEntity: PropTypes.instanceOf(Immutable.Map),
  handleRequestClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

PortalContactForm.defaultProps = {
  client: Immutable.Map(),
  companyEntity: Immutable.Map(),
};
const mapStateToProps = (state, { match, client }) => {
  const companyId = match.params.id;
  return {
    companyId,
  };
};
export default connect(mapStateToProps)(PortalContactForm);
