import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { upsertDivision } from '../../actions/divisionActions';
import * as ActionTypes from '../../constants/actionTypes';

import Select from 'react-select';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import FormInput from '../../components/particial/FormInput';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import { userCountryList } from '../../constants/formOptions';

class AddDivisionForm extends Component {
  constructor(props) {
    super();
    this.state = {
      errorMessage: Immutable.Map(),
      country: props.division.get('country'),
    };
  }
  componentDidMount() {
    console.log('AddDivisionForm componentDidMount');
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const divisionForm = e.target;
    const { t, dispatch, division, onClose } = this.props;
    let errorMessage = this._validateForm(divisionForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const newDivision = {
      name: divisionForm.name.value,
      address: divisionForm.addressLine.value,
      country: divisionForm.country.value,
      city: divisionForm.city.value,
      province: divisionForm.province.value,
      zipcode: divisionForm.zipcode.value,
    };

    dispatch(upsertDivision(newDivision, division.get('id')))
      .then(onClose)
      .catch((err) => {
        dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            type: 'error',
            message: err.message || err,
          },
        });
      });
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();

    if (!form.name.value) {
      errorMessage = errorMessage.set(
        'name',
        t('message:Division Name is required')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  removeErrorMessage = (key) =>
    this.setState({ errorMessage: this.state.errorMessage.delete(key) });

  handleClose = () => {
    this.props.onClose();
    this.setState({
      errorMessage: this.state.errorMessage.clear(),
    });
  };

  handleCountryChange = (country) => {
    country = country || this.state.country;
    this.setState({ country });
  };

  render() {
    const { errorMessage } = this.state;
    const { t, onClose, division } = this.props;
    return (
      <>
        <DialogTitle>
          {division.get('id')
            ? t('common:Edit Division')
            : t('common:Add Division')}
        </DialogTitle>

        <form
          id="divisionContactForm"
          onSubmit={this.handleSubmit}
          style={{ padding: '0 24px' }}
        >
          <div className="row expanded">
            <div className="small-12 columns">
              <FormInput
                name="name"
                label={t('field:name1')}
                defaultValue={division.get('name') || ''}
                isRequired={true}
                errorMessage={errorMessage.get('name')}
                onBlur={() => this.removeErrorMessage('name')}
              />
            </div>
          </div>

          <div className="row expanded">
            <div className="small-12 medium-8 columns">
              <FormInput
                name="addressLine"
                label={t('field:addressLine')}
                defaultValue={division.get('address') || ''}
              />
            </div>
            <div className="small-6 medium-4 columns">
              <FormInput
                name="city"
                label={t('field:city')}
                defaultValue={division.get('city') || ''}
              />
            </div>
            <div className="small-6 medium-4 columns">
              <FormInput
                name="province"
                label={t('field:province')}
                defaultValue={division.get('province') || ''}
              />
            </div>
            <div className="small-6 medium-4 columns">
              <FormReactSelectContainer label={t('field:country')}>
                <Select
                  value={this.state.country}
                  onChange={this.handleCountryChange}
                  simpleValue
                  options={userCountryList}
                  clearable={false}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="country"
                value={this.state.country || ''}
              />
            </div>
            <div className="small-6 medium-4 columns">
              <FormInput
                name="zipcode"
                label={t('field:zipcode')}
                defaultValue={division.get('zipcode') || ''}
              />
            </div>
          </div>
        </form>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={onClose} size="small">
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="divisionContactForm"
              size="small"
            >
              {division.get('id') ? t('action:save') : t('action:add')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </>
    );
  }
}

AddDivisionForm.propTypes = {
  division: PropTypes.instanceOf(Immutable.Map),
  onClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

AddDivisionForm.defaultProps = {
  division: Immutable.Map(),
};

export default AddDivisionForm;
