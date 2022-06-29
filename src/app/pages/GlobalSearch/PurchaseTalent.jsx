import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import CandidateDetails from './PurchaseSteps/CandidateDetails';
import Step2 from './PurchaseSteps/Step2';
import Step3 from './PurchaseSteps/Step3';

class PurchaseTalent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: props.step,
    };
  }

  handlePurchaseTalent = () => {
    this.setState({ step: this.state.step + 1 });
    console.log('buy talent');
  };

  cancelPurchaseTalent = () => {
    this.setState({ step: 0 });
  };

  render() {
    const {
      onCloseDetails,
      esId,
      t,
      credit,
      revealOutsideContactInfo,
      dispatch,
    } = this.props;
    const { step } = this.state;
    let title;
    if (step === 0) {
      title = 'Talent Profile';
    } else if (step === 1) {
      title = 'Purchase Talent Contact';
    } else {
      title = 'Purchase Success';
    }

    console.log('credit]]]', credit);
    return (
      <>
        <div style={{ height: 50, padding: 8 }}>
          <Typography variant="h6">{title}</Typography>
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <IconButton onClick={this.props.onCloseDetails}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <Divider />
        {esId && (
          <>
            {step === 0 && (
              <CandidateDetails
                key={esId}
                esId={esId}
                t={t}
                purchase={this.handlePurchaseTalent}
                dispatch={dispatch}
              />
            )}
            {step === 1 && (
              <Step2
                t={t}
                purchase={this.handlePurchaseTalent}
                cancelPurchase={this.cancelPurchaseTalent}
                credit={credit}
                esId={esId}
                onCloseDetails={this.props.step === 1 ? onCloseDetails : null}
                revealOutsideContactInfo={revealOutsideContactInfo}
                dispatch={dispatch}
              />
            )}
            {step === 2 && (
              <Step3
                credit={credit}
                cancelPurchase={this.cancelPurchaseTalent}
              />
            )}
          </>
        )}
      </>
    );
  }
}

PurchaseTalent.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  let monthlyCredit = state.controller.currentUser.get('monthlyCredit')
    ? state.controller.currentUser.get('monthlyCredit')
    : 0;
  let bulkCredit = state.controller.currentUser.get('bulkCredit')
    ? state.controller.currentUser.get('bulkCredit')
    : 0;
  let usedBulkCredit = state.controller.currentUser.get('usedBulkCredit')
    ? state.controller.currentUser.get('usedBulkCredit')
    : 0;
  let usedMonthlyCredit = state.controller.currentUser.get('usedMonthlyCredit')
    ? state.controller.currentUser.get('usedMonthlyCredit')
    : 0;
  let totalCredits =
    monthlyCredit - usedMonthlyCredit + (bulkCredit - usedBulkCredit);
  return {
    credit: totalCredits,
  };
};

export default connect(mapStateToProps)(PurchaseTalent);
