import React from 'react';
import PropTypes from 'prop-types';
import Immutable, { set } from 'immutable';
import { updateUser, getTenantCredit } from '../../actions/tenantActions';
import { isEmail } from '../../../utils/index';

import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import FormInput from '../../components/particial/FormInput';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormTextArea from '../../components/particial/FormTextArea';
import { connect } from 'react-redux';
import { showErrorMessage } from '../../actions';
import { activationTypes } from '../../constants/formOptions';

class UpdateUserFormDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    // console.log('!!!!propsssss', props.userInfo.toJS());
    this.state = {
      errorMessage: Immutable.Map(),
      division: props.userInfo.get('divisionId') || '',
      divisionOptions: props.divisionList.toJS(),
      privilegeReport:
        props.userInfo.get('authorities') &&
        props.userInfo.get('authorities').includes(
          Immutable.Map({
            name: 'PRIVILEGE_REPORT',
          })
        ),
      cilentContract:
        props.userInfo.get('authorities') &&
        props.userInfo.get('authorities').includes(
          Immutable.Map({
            name: 'ROLE_CONTRACT',
          })
        ),
      creditDefaultVal: null,
      monthlyCredit: null,
      bulkCredit: null,
      loading: false,
      activationType: this.props.userInfo.get('creditEffectType')
        ? this.props.userInfo.get('creditEffectType')
        : 'INSTANT',
      canusedBulkCredit:
        this.props.availableBulkCredit +
        (props.userInfo.get('bulkCredit')
          ? props.userInfo.get('bulkCredit')
          : 0),
    };
  }

  _handleAddAuthority = () => {
    const oldAuthority = this.props.userInfo.toJS().authorities;
    const oldAuthoritySet = new Set(oldAuthority.map((ele) => ele.name));

    const setToArray = (set) => {
      return [...set].map((ele) => ({ name: ele }));
    };

    const privilegeReport = this.state.privilegeReport;
    const cilentContract = this.state.cilentContract;

    if (privilegeReport) {
      oldAuthoritySet.add('PRIVILEGE_REPORT');
    } else {
      oldAuthoritySet.delete('PRIVILEGE_REPORT');
    }

    if (cilentContract) {
      oldAuthoritySet.add('ROLE_CONTRACT');
    } else {
      oldAuthoritySet.delete('ROLE_CONTRACT');
    }

    return setToArray(oldAuthoritySet);
  };

  handleSubmit = (e) => {
    this.setState({
      loading: true,
    });
    e.preventDefault();
    const userForm = e.target;

    let errorMessage = this._validateForm(userForm);
    if (errorMessage) {
      return this.setState({ errorMessage, loading: false });
    }

    const user = {
      firstName: userForm.firstName.value,
      lastName: userForm.lastName.value,
      username: userForm.username.value,
      email: userForm.email.value,
      phone: userForm.phone.value,
      note: userForm.note.value,
      // monthlyCredit: this.state.monthlyCredit,
      creditEffectType: this.state.activationType,
      bulkCredit: this.state.bulkCredit
        ? this.state.bulkCredit
        : this.props.userInfo.get('bulkCredit'),
      divisionId: userForm.division.value
        ? parseInt(userForm.division.value, 10)
        : null,
      authorities: this._handleAddAuthority(),
      usedBulkCredit: this.props.userInfo.get('usedBulkCredit'),
      usedMonthlyCredit: this.props.userInfo.get('usedMonthlyCredit'),
    };
    if (this.state.activationType === 'NEXT_MONTH') {
      user.effectCredit = this.state.monthlyCredit
        ? Number(this.state.monthlyCredit)
        : this.props.userInfo.get('effectCredit');
      // user.monthlyCredit = this.props.userInfo.get('monthlyCredit')
    } else {
      user.monthlyCredit = this.state.monthlyCredit
        ? Number(this.state.monthlyCredit)
        : this.props.userInfo.get('monthlyCredit');
      // user.effectCredit = this.props.userInfo.get('effectCredit')
    }

    // console.log('!!!user', user);

    this.props
      .dispatch(updateUser(user, this.props.userInfo.get('id')))
      .then((res) => {
        if (res) {
          this.setState({
            loading: false,
          });
          this.props.onClose();
          this.props.dispatch(getTenantCredit(this.props.tenantId));
        }
      })
      .catch((error) => {
        this.props.dispatch(showErrorMessage(error));
        this.setState({
          loading: false,
        });
      });
    // .then(this.props.onClose);
  };

  _validateForm(userForm) {
    let errorMessage = Immutable.Map();
    const {
      availableCredit,
      availableBulkCredit,
      totalMonthlyCredit,
      nextMonthAvailableCredit,
      userInfo,
    } = this.props;
    const { monthlyCredit, bulkCredit, activationType, canusedBulkCredit } =
      this.state;
    let usedMonthlyCredit = userInfo.get('usedMonthlyCredit')
      ? userInfo.get('usedMonthlyCredit')
      : 0;
    let usedBulkCredit = userInfo.get('usedBulkCredit')
      ? userInfo.get('usedBulkCredit')
      : 0;
    if (!userForm.firstName.value) {
      errorMessage = errorMessage.set(
        'firstName',
        this.props.t('message:firstNameIsRequired')
      );
    }

    if (!userForm.lastName.value) {
      errorMessage = errorMessage.set(
        'lastName',
        this.props.t('message:lastNameIsRequired')
      );
    }
    if (!userForm.division.value) {
      errorMessage = errorMessage.set(
        'division',
        this.props.t('message:Office is required')
      );
    }
    if (!userForm.username.value) {
      errorMessage = errorMessage.set(
        'username',
        this.props.t('message:usernameIsRequired')
      );
    }
    if (availableCredit !== 0 && monthlyCredit) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(monthlyCredit);
      let type1 = r1.test(monthlyCredit);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'credit',
          this.props.t('message:Creditmustbeapositiveinteger')
        );
      }
    }
    if (monthlyCredit) {
      let canUsedCredits;
      if (activationType === 'NEXT_MONTH') {
        if (this.props.userInfo.get('effectCredit')) {
          canUsedCredits =
            nextMonthAvailableCredit + this.props.userInfo.get('effectCredit');
        } else {
          canUsedCredits =
            nextMonthAvailableCredit + this.props.userInfo.get('monthlyCredit');
        }
      } else {
        canUsedCredits =
          availableCredit + this.props.userInfo.get('monthlyCredit');
      }
      if (activationType === 'NEXT_MONTH' && monthlyCredit > canUsedCredits) {
        errorMessage = errorMessage.set(
          'credit',
          this.props.t('message:CreditError')
        );
      } else if (
        activationType === 'INSTANT' &&
        monthlyCredit > canUsedCredits
      ) {
        errorMessage = errorMessage.set(
          'credit',
          this.props.t('message:CreditError')
        );
      } else if (
        activationType === 'INSTANT' &&
        monthlyCredit < usedMonthlyCredit
      ) {
        errorMessage = errorMessage.set(
          'credit',
          this.props.t('message:useCreditError')
        );
      }
    }

    if (bulkCredit) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(bulkCredit);
      let type1 = r1.test(bulkCredit);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'bulkCredit',
          this.props.t('message:Creditmustbeapositiveinteger')
        );
      }
    }
    if (bulkCredit && bulkCredit > canusedBulkCredit) {
      errorMessage = errorMessage.set(
        'bulkCredit',
        this.props.t('message:CreditError')
      );
    }

    if (bulkCredit && bulkCredit < usedBulkCredit) {
      errorMessage = errorMessage.set(
        'bulkCredit',
        this.props.t('message:usedBulkCreditError')
      );
    }

    if (!userForm.email.value) {
      errorMessage = errorMessage.set(
        'email',
        this.props.t('message:emailIsRequired')
      );
    } else if (!isEmail(userForm.email.value)) {
      errorMessage = errorMessage.set(
        'email',
        this.props.t('message:emailIsInvalid')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleClose = () => {
    this.setState({ errorMessage: Immutable.Map(), division: '' });
    this.props.onClose();
  };

  handleReportAuthChange = (e) => {
    this.setState({ privilegeReport: e.target.checked });
  };

  handleContractAuthChange = (e) => {
    this.setState({ cilentContract: e.target.checked });
  };

  getdivision = () => {
    const { division, divisionOptions } = this.state;
    let selectDivision = divisionOptions.filter((item, index) => {
      return item.id === division;
    });
    if (selectDivision.length > 0) {
      return selectDivision[0];
    } else {
      return '';
    }
  };

  getMonthlyCreditUsage = () => {
    const { userInfo } = this.props;
    let monthlyCredit = userInfo.get('monthlyCredit')
      ? userInfo.get('monthlyCredit')
      : 0;
    let usedMonthlyCredit = userInfo.get('usedMonthlyCredit')
      ? userInfo.get('usedMonthlyCredit')
      : 0;
    return usedMonthlyCredit + '/' + monthlyCredit;
  };

  getBulkCreditUsag = () => {
    const { userInfo } = this.props;
    let bulkCredit = userInfo.get('bulkCredit')
      ? userInfo.get('bulkCredit')
      : 0;
    let usedBulkCredit = userInfo.get('usedBulkCredit')
      ? userInfo.get('usedBulkCredit')
      : 0;
    return usedBulkCredit + '/' + bulkCredit;
  };

  render() {
    const {
      errorMessage,
      monthlyCredit,
      bulkCredit,
      loading,
      canusedBulkCredit,
    } = this.state;
    const {
      t,
      onClose,
      userInfo,
      tenant,
      availableCredit,
      availableBulkCredit,
      totalMonthlyCredit,
      nextMonthAvailableCredit,
    } = this.props;
    // console.log('THis is the AUthority', userInfo.toJS());
    console.log(this.props.userInfo.toJS());
    console.log(this.state.activationType);
    return (
      <>
        <DialogTitle>{t('common:editUser')}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <div className="row expanded">
              <div className="small-6 columns">
                <FormInput
                  name="username"
                  label={t('field:tenantUsername')}
                  defaultValue={userInfo.get('username')}
                  isRequired
                  errorMessage={errorMessage.get('username')}
                  onBlur={() => this.removeErrorMessage('username')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="email"
                  label={t('field:email')}
                  defaultValue={userInfo.get('email')}
                  isRequired
                  errorMessage={errorMessage.get('email')}
                  onBlur={() => this.removeErrorMessage('email')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="firstName"
                  label={t('field:firstName')}
                  defaultValue={userInfo.get('firstName')}
                  isRequired
                  errorMessage={errorMessage.get('firstName')}
                  onBlur={() => this.removeErrorMessage('firstName')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="lastName"
                  label={t('field:lastName')}
                  defaultValue={userInfo.get('lastName')}
                  isRequired
                  errorMessage={errorMessage.get('lastName')}
                  onBlur={() => this.removeErrorMessage('lastName')}
                />
              </div>
              <div className="small-6 medium-6 columns">
                <FormInput
                  name="phone"
                  label={t('field:phone')}
                  defaultValue={userInfo.get('phone')}
                />
              </div>
              <div className="small-6 medium-6 columns">
                <FormReactSelectContainer
                  label={t('field:Office')}
                  isRequired
                  errorMessage={errorMessage.get('division')}
                >
                  <Select
                    valueKey="id"
                    labelKey="name"
                    options={this.state.divisionOptions}
                    value={this.getdivision()}
                    onChange={(division) => {
                      this.setState({ division });
                    }}
                    onBlur={() => {
                      this.removeErrorMessage('division');
                    }}
                    simpleValue
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="division"
                  value={this.state.division || ''}
                />
              </div>
            </div>
            {/* {availableCredit !== 0 && ( */}
            <div className="row expanded">
              {/* {this.state.activationType === 'NEXT_MONTH' ? ( */}
              <div className="small-4 columns">
                <FormInput
                  label={t('APN Pro Monthly Credits')}
                  toolTip={
                    'Total number of monthly credits for your entire organization.'
                  }
                  placeholder={`Enter a number`}
                  onBlur={(event) => {
                    if (event.target.value) {
                      this.setState({
                        monthlyCredit: event.target.value,
                      });
                    }
                    this.removeErrorMessage('credit');
                  }}
                  errorMessage={
                    errorMessage && errorMessage.get('credit')
                      ? errorMessage.get('credit')
                      : null
                  }
                />
              </div>
              {/* ) : (
                  <div className="small-4 columns" key="monthlyCredit">
                    <FormInput
                      label={t('APN Pro Monthly Credits')}
                      toolTip={
                        'Total number of monthly credits for your entire organization.'
                      }
                      defaultValue={this.props.userInfo.get('monthlyCredit')}
                      placeholder={`Enter a number`}
                      onBlur={(event) => {
                        this.setState({
                          monthlyCredit: event.target.value,
                        });
                        this.removeErrorMessage('credit');
                      }}
                      errorMessage={
                        errorMessage && errorMessage.get('credit')
                          ? errorMessage.get('credit')
                          : null
                      }
                    />
                  </div>
                )} */}
              <div className="small-3 columns">
                <FormReactSelectContainer label={t('field:Activation type')}>
                  <Select
                    valueKey="value"
                    labelKey="label"
                    options={activationTypes}
                    value={this.state.activationType}
                    onChange={(activationType) =>
                      this.setState({ activationType })
                    }
                    simpleValue
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="activationType"
                  value={this.state.activationType || ''}
                />
              </div>
              {this.state.activationType === 'NEXT_MONTH' ? (
                <div
                  className="small-5 columns"
                  key="monthlyCredit"
                  style={{ paddingTop: '21px' }}
                >
                  <FormInput
                    disabled
                    value={`${
                      this.props.userInfo.get('effectCredit') !== null &&
                      this.props.userInfo.get('effectCredit') >= 0
                        ? this.props.userInfo.get('effectCredit')
                        : this.props.userInfo.get('monthlyCredit')
                        ? this.props.userInfo.get('monthlyCredit')
                        : 0
                    } credits resets on ${moment(new Date())
                      .add(1, 'M')
                      .format('MM')}/01/${moment(new Date()).format('YYYY')}`}
                  />
                </div>
              ) : (
                <div
                  className="small-5 columns"
                  key="effectCredit"
                  style={{ paddingTop: '21px' }}
                >
                  <FormInput
                    disabled
                    value={`${
                      this.props.userInfo.get('monthlyCredit')
                        ? this.props.userInfo.get('monthlyCredit')
                        : 0
                    } credits resets on ${moment(new Date())
                      .add(1, 'M')
                      .format('MM')} /01/${moment(new Date()).format('YYYY')}`}
                  />
                </div>
              )}
              <span
                style={{
                  color: '#939393',
                  fontSize: '13px',
                  fontFamily: 'Roboto',
                  paddingLeft: '5px',
                }}
              >
                Tenant’s total availabe monthly credits:
                {this.state.activationType === 'NEXT_MONTH'
                  ? nextMonthAvailableCredit +
                    (this.props.userInfo.get('effectCredit') !== null &&
                    this.props.userInfo.get('effectCredit') >= 0
                      ? this.props.userInfo.get('effectCredit')
                      : this.props.userInfo.get('monthlyCredit')
                      ? this.props.userInfo.get('monthlyCredit')
                      : 0)
                  : availableCredit +
                    (this.props.userInfo.get('monthlyCredit')
                      ? this.props.userInfo.get('monthlyCredit')
                      : 0)}
              </span>
            </div>
            {/* )} */}

            <div className="row expanded">
              <div className="small-12 columns">
                <FormInput
                  label={'Monthly Credits Usage'}
                  disabled
                  defaultValue={this.getMonthlyCreditUsage()}
                />
              </div>
              <div className="small-12 columns">
                <FormInput
                  label={'APN Pro Bulk Credits '}
                  name="bulkCredit"
                  toolTip={
                    'Total number of bulk credits for your entire organization.'
                  }
                  defaultValue={
                    // tenantInfo ? tenantInfo.credit : this.state.credit
                    bulkCredit
                  }
                  onBlur={(event) => {
                    this.setState({
                      bulkCredit: event.target.value,
                    });
                    this.removeErrorMessage('bulkCredit');
                  }}
                  errorMessage={
                    errorMessage && errorMessage.get('bulkCredit')
                      ? errorMessage.get('bulkCredit')
                      : null
                  }
                />
                <span
                  style={{
                    color: '#939393',
                    fontSize: '13px',
                    fontFamily: 'Roboto',
                  }}
                >
                  Tenant’s total availabe bulk credits:{canusedBulkCredit}
                </span>
              </div>
              <div className="small-12 columns">
                <FormInput
                  label={'Bulk Credits Usage'}
                  disabled
                  defaultValue={this.getBulkCreditUsag()}
                />
              </div>
              <div className="small-4 columns">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.privilegeReport}
                      onChange={this.handleReportAuthChange}
                      color="primary"
                      name="privilegeReport"
                    />
                  }
                  label="Report privilege"
                />
              </div>
              <div className="small-4 columns">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.cilentContract}
                      onChange={this.handleContractAuthChange}
                      color="primary"
                      name="cilentContract"
                    />
                  }
                  label="Client Contract"
                />
              </div>
              <div className="small-12">
                <FormTextArea
                  label={t('field:note')}
                  name="note"
                  defaultValue={userInfo.get('note')}
                  rows="4"
                />
              </div>
              <input
                type="submit"
                id="submit-button"
                style={{ display: 'none' }}
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={onClose} size="small">
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            component="label"
            processing={loading}
            size="small"
            htmlFor="submit-button"
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

UpdateUserFormDialog.propTypes = {
  userInfo: PropTypes.instanceOf(Immutable.Map).isRequired,
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
UpdateUserFormDialog.defaultProps = {
  userInfo: Immutable.Map(),
};

const mapStateToProps = (state) => {
  let userId = state.controller.currentUser.get('tenantId');
  let tenant = state.model.tenants.get(String(userId));
  return {
    tenant: tenant,
  };
};

export default connect(mapStateToProps)(UpdateUserFormDialog);
