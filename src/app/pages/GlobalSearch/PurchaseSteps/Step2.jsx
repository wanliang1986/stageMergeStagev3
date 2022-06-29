import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { showErrorMessage } from '../../../actions/index';
import * as apnSDK from '../../../../apn-sdk/globalSearch';
import { getCurrentUser } from '../../../actions/userActions';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PotentialButton from '../../../components/particial/PotentialButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import NextSecondaryButton from '../../../components/particial/SecondaryButton';
import { CONTACT_TYPES } from '../../../constants/formOptions';

class Step2 extends Component {
  reduceCredit = (esId) => {
    apnSDK.purchaseTalent(esId).then(
      (res) => this._fetchCandidateDetails(esId),
      (err) => this.props.dispatch(showErrorMessage(err))
    );

    this.props.purchase();
  };

  _fetchCandidateDetails = (esId) => {
    const { dispatch, revealOutsideContactInfo } = this.props;
    return apnSDK
      .getGlobalCandidateDetails(esId)
      .then(({ response }) => {
        console.log('in detail', response);
        // update user credit
        dispatch(getCurrentUser());

        // update parent data
        let emailContact = response.contacts.find(
          (c) => c.type === CONTACT_TYPES.Email
        );
        let phoneContact = response.contacts.find(
          (c) => c.type === CONTACT_TYPES.Phone
        );
        revealOutsideContactInfo(
          esId,
          emailContact && emailContact.contact,
          phoneContact && phoneContact.contact
        );
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
      });
  };

  render() {
    const { t, cancelPurchase, credit, onCloseDetails, esId } = this.props;
    return (
      <div style={{ padding: '10px', position: 'relative', height: '100%' }}>
        <Typography>
          You will be charged 1 <span style={{ color: '#3498DB' }}>credit</span>{' '}
          if we find the talent's contact in our database. Do you want to
          proceed?
        </Typography>
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <NextSecondaryButton
            type="button"
            name="preview"
            onClick={onCloseDetails ? onCloseDetails : cancelPurchase}
          >
            {t('cancel')}
          </NextSecondaryButton>

          <PrimaryButton
            type="submit"
            style={{ minWidth: 120, marginLeft: '15px' }}
            // disabled={this.state.creating}
            onClick={() => this.reduceCredit(esId)}
            name="submit"
          >
            {t('purchase')}
          </PrimaryButton>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: 0,
            right: 0,
            textAlign: 'right',
          }}
        >
          <Divider style={{ marginBottom: 20 }} />
          <PotentialButton style={{ marginRight: '20px' }} type="button">
            {`You have ${credit} credit`}
          </PotentialButton>
        </div>
      </div>
    );
  }
}

Step2.propTypes = {
  dispatch: PropTypes.func.isRequired,
  revealOutsideContactInfo: PropTypes.func.isRequired,
};

export default Step2;
