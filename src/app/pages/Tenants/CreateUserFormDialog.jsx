import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
// import withStyles from 'material-ui-next/styles/withStyles';
import { updateUser, getTenantCredit } from '../../actions/tenantActions';
import { isEmail } from '../../../utils/index';

import Checkbox from '@material-ui/core/Checkbox';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Select from 'react-select';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import FormInput from '../../components/particial/FormInput';
import FormTextArea from '../../components/particial/FormTextArea';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import { connect } from 'react-redux';
import { showErrorMessage } from '../../actions';

const authorityOptions = [
  {
    value: 'ROLE_LIMIT_USER',
    label: 'field:limitedUser',
  },
  {
    value: 'ROLE_USER',
    label: 'field:user',
  },
  {
    value: 'ROLE_TENANT_ADMIN',
    label: 'field:superuser',
  },
];

class CreateUserFormDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      division: '',
      divisionOptions: props.divisionList.toJS(),
      resetDate:
        `${props.t('tab:resets on')}` +
        moment(new Date()).add(1, 'M').format('MM') +
        '/' +
        '01' +
        '/' +
        moment(new Date()).format('YYYY'),
      loading: false,
    };
  }

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

    const authorities = [];
    userForm.authorities.forEach((checkbox) => {
      if (checkbox.checked) {
        authorities.push({ name: checkbox.value });
      }
    });

    const user = {
      firstName: userForm.firstName.value,
      lastName: userForm.lastName.value,
      username: userForm.username.value,
      email: userForm.email.value,
      // password: userForm.password.value,
      phone: userForm.phone.value,
      note: userForm.note.value,
      monthlyCredit:
        userForm.credits && userForm.credits.value
          ? Number(userForm.credits.value)
          : 0,
      authorities,
      activated: true,
      divisionId: userForm.division.value
        ? parseInt(userForm.division.value, 10)
        : null,
      bulkCredit: userForm.bulkCredit.value
        ? Number(userForm.bulkCredit.value)
        : 0,
    };

    this.props
      .dispatch(updateUser(user))
      .then((res) => {
        if (res.id) {
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
  };

  _validateForm(userForm) {
    const { availableCredit, availableBulkCredit } = this.props;
    let errorMessage = Immutable.Map();

    if (!userForm.firstName.value) {
      errorMessage = errorMessage.set(
        'firstName',
        this.props.t('message:firstNameIsRequired')
      );
    }

    if (!userForm.division.value) {
      errorMessage = errorMessage.set(
        'division',
        this.props.t('message:Office is required')
      );
    }

    if (!userForm.lastName.value) {
      errorMessage = errorMessage.set(
        'lastName',
        this.props.t('message:lastNameIsRequired')
      );
    }
    if (!userForm.username.value) {
      errorMessage = errorMessage.set(
        'username',
        this.props.t('message:usernameIsRequired')
      );
    }
    // if (availableCredit!==0&&!userForm.credits.value) {
    //   errorMessage = errorMessage.set(
    //     'credit',
    //     this.props.t('message:creditIsRequired')
    //   );
    // }

    if (availableCredit !== 0 && userForm.credits.value) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(userForm.credits.value);
      let type1 = r1.test(userForm.credits.value);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'credit',
          this.props.t('message:Creditmustbeapositiveinteger')
        );
      }
    }

    if (
      availableCredit !== 0 &&
      userForm.credits.value &&
      Number(userForm.credits.value) > availableCredit
    ) {
      errorMessage = errorMessage.set(
        'credit',
        this.props.t('message:CreditError')
      );
    }

    if (userForm.bulkCredit.value) {
      let r = /^\+?[0-9][0-9]*$/;
      let r1 = /^[0-9]+.?[0-9]*$/;
      let type = r.test(userForm.bulkCredit.value);
      let type1 = r1.test(userForm.bulkCredit.value);
      if (!type || !type1) {
        errorMessage = errorMessage.set(
          'bulkCredit',
          this.props.t('message:Creditmustbeapositiveinteger')
        );
      }
    }

    if (Number(userForm.bulkCredit.value) > availableBulkCredit) {
      errorMessage = errorMessage.set(
        'bulkCredit',
        this.props.t('message:CreditError')
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

  render() {
    const { errorMessage, resetDate, loading } = this.state;
    const { t, onClose, tenant, availableCredit, availableBulkCredit } =
      this.props;

    return (
      <>
        <DialogTitle>{t('common:addUser')}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={this.handleSubmit}
            className="row"
            ref={this.userForm}
          >
            <div className="row flex-child-auto">
              <div className="small-12 medium-6 columns">
                <FormInput
                  label={t('field:tenantUsername')}
                  name="username"
                  isRequired
                  errorMessage={errorMessage.get('username')}
                  onBlur={() => this.removeErrorMessage('username')}
                />
              </div>
              <div className="small-12 medium-6 columns">
                <FormInput
                  name="email"
                  label={t('field:email')}
                  errorMessage={errorMessage.get('email')}
                  onBlur={() => this.removeErrorMessage('email')}
                  isRequired
                />
              </div>
            </div>

            <div className="row flex-child-auto">
              <div className="small-12 medium-6 columns">
                <FormInput
                  name="firstName"
                  label={t('field:firstName')}
                  isRequired
                  errorMessage={errorMessage.get('firstName')}
                  onBlur={() => this.removeErrorMessage('firstName')}
                />
              </div>
              <div className="small-12 medium-6 columns">
                <FormInput
                  label={t('field:lastName')}
                  name="lastName"
                  isRequired
                  errorMessage={errorMessage.get('lastName')}
                  onBlur={() => this.removeErrorMessage('lastName')}
                />
              </div>
            </div>
            <div className="row flex-child-auto">
              <div className="small-12  medium-6 columns">
                <FormInput name="phone" label={t('field:phone')} />
              </div>
              <div className="small-12 medium-6 columns">
                <FormReactSelectContainer
                  label={t('field:Office')}
                  isRequired
                  errorMessage={errorMessage.get('division')}
                >
                  <Select
                    valueKey="id"
                    labelKey="name"
                    options={this.state.divisionOptions}
                    value={this.state.division}
                    onChange={(division) => this.setState({ division })}
                    onBlur={() => this.removeErrorMessage('division')}
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
            {/* <div className="small-12 medium-6 columns">
              <FormReactSelectContainer
                label={t('field:Office')}
                isRequired
                errorMessage={errorMessage.get('division')}
                onBlur={() => this.removeErrorMessage('division')}
              >
                <Select
                  valueKey="id"
                  labelKey="name"
                  options={this.state.divisionOptions}
                  value={this.state.division}
                  onChange={division => this.setState({ division })}
                  simpleValue
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="division"
                value={this.state.division || ''}
              />
            </div> */}
            {/* {availableCredit !== 0 && ( */}
            <div className="row flex-child-auto">
              <div className="small-6 medium-6 columns">
                <FormInput
                  label={t('APN Pro Monthly Credits')}
                  placeholder={t('tab:Enter a number')}
                  toolTip={t('tab:TotalTip1')}
                  name="credits"
                  errorMessage={errorMessage.get('credit')}
                  onBlur={() => this.removeErrorMessage('credit')}
                />
              </div>
              <div
                className="small-6 medium-6 columns"
                style={{ paddingTop: '21px' }}
              >
                <FormInput disabled defaultValue={resetDate} />
              </div>
              <span
                style={{
                  fontFamily: 'Roboto',
                  fontSize: '13px',
                  color: '#939393',
                  paddingLeft: '5px',
                }}
              >
                {t('tab:Tenant’s total availabe monthly credits')}
                {availableCredit}
              </span>
            </div>
            {/* )} */}
            <div className="small-12">
              <FormInput
                label={t('APN Pro Bulk Credits')}
                placeholder={t('tab:Enter a number')}
                toolTip={t('tab:TotalTip2')}
                name="bulkCredit"
                onBlur={() => {
                  this.removeErrorMessage('bulkCredit');
                }}
                errorMessage={errorMessage.get('bulkCredit')}
              />
              <span
                style={{
                  fontFamily: 'Roboto',
                  fontSize: '13px',
                  color: '#939393',
                }}
              >
                {t('tab:Tenant’s total availabe bulk credits')}
                {availableBulkCredit}
              </span>
            </div>
            <div className="small-12">
              <div className="foundation">
                <label>{t('field:tenantAuthority')}</label>
              </div>
              <FormGroup row>
                {authorityOptions.map((authority, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        name="authorities"
                        defaultChecked={authority.value === 'ROLE_USER'}
                        value={authority.value}
                        color="primary"
                      />
                    }
                    label={t(authority.label)}
                  />
                ))}
              </FormGroup>
              <div className="foundation">
                {errorMessage.get('authority') && (
                  <span className="form-error is-visible">
                    {errorMessage.get('authority')}
                  </span>
                )}
              </div>
            </div>
            <div className="small-12">
              <FormTextArea label={t('field:note')} name="note" rows="4" />
            </div>
            <input
              type="submit"
              id="submit-button"
              style={{ display: 'none' }}
            />
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
            {t('action:add')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

CreateUserFormDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  divisionList: PropTypes.instanceOf(Immutable.List).isRequired,
};

CreateUserFormDialog.defaultProps = {
  divisionList: Immutable.List(),
};

const mapStateToProps = (state) => {
  let userId = state.controller.currentUser.get('tenantId');
  let tenant = state.model.tenants.get(String(userId));
  return {
    tenant: tenant,
  };
};

export default connect(mapStateToProps)(CreateUserFormDialog);
