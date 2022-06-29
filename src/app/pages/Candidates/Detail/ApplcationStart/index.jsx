import React from 'react';
import moment from 'moment-timezone';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import {
  makeGetStartByApplicationId,
  makeGetPreStartByApplicationId,
  getActiveStartListByTalent,
} from '../../../../selectors/startSelector';
import { getApplicationCommissions } from '../../../../actions/applicationActions';
import {
  selectStartToOpen,
  selectConversionFTEToOpen,
} from '../../../../actions/startActions';
import { JOB_TYPES, USER_TYPES } from '../../../../constants/formOptions';
import dateFns from 'date-fns';

import Typography from '@material-ui/core/Typography';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import CheckOfferConflict from './CheckOfferConflict';
import StartStatus from './StartStatus';

const loaded = {};

class ApplicationStart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCheckOfferConflict: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { dispatch, applicationId } = this.props;
    // if (!loaded[applicationId]) {
    dispatch(getApplicationCommissions(applicationId)).then(() => {
      // loaded[applicationId] = true;
    });
    // }
  };

  handleOpenStart = () => {
    const { dispatch, start } = this.props;
    if (start) {
      dispatch(selectStartToOpen(start));
      this.setState({ openCheckOfferConflict: !start.get('id') });
    }
  };
  handleOpenConversionStart = () => {
    const { dispatch, start } = this.props;
    if (start) {
      dispatch(selectStartToOpen(start));
      const terminationDate = start.getIn(['termination', 'terminationDate']);
      const newStartDate = moment(terminationDate)
        .add(1, 'days')
        .format('YYYY-MM-DD');
      dispatch(
        selectConversionFTEToOpen(
          start
            .remove('id')
            .set('positionType', JOB_TYPES.FullTime)
            .set(
              'startFteRate',
              Immutable.Map({
                rateUnitType: 'YEARLY',
                currency: start.getIn(['startContractRates', 0, 'currency']),
              })
            )
            .set('startDate', newStartDate)
        )
      );
      this.setState({ openCheckOfferConflict: true });
    }
  };

  handleCloseCheckOfferConflict = () => {
    this.setState({ openCheckOfferConflict: false });
  };

  render() {
    const { openCheckOfferConflict } = this.state;
    const {
      start,
      canView,
      isAm,
      isOpen,
      hasActiveStart,
      conversionStartOpen,
      t,
    } = this.props;
    console.log('hasActiveStart', hasActiveStart);
    if (!start) {
      return null;
    }
    const startId = start.get('id');
    const startDate = new Date(start.get('startDate'));

    return (
      <div
        onClick={(e) => {
          // e.preventDefault();
          e.stopPropagation();
        }}
        className="flex-container align-middle"
        style={{ marginTop: 8 }}
      >
        {openCheckOfferConflict && (
          <CheckOfferConflict
            start={start}
            t={t}
            onClose={this.handleCloseCheckOfferConflict}
          />
        )}
        {startId && (
          <StartStatus
            t={t}
            start={start}
            isOpen={isOpen}
            canView={canView}
            isAm={isAm}
            hasActiveStart={hasActiveStart}
            onOpenStart={this.handleOpenStart}
          />
        )}

        {!startId && dateFns.isAfter(startDate, new Date()) && (
          <Typography color={'textSecondary'}>
            {'Start at '}
            {dateFns.format(new Date(start.get('startDate')), 'MM/DD/YYYY')}
          </Typography>
        )}
        <div className="flex-child-auto" />
        {!startId && !hasActiveStart && (
          <PrimaryButton
            disabled={!isAm || isOpen || dateFns.isAfter(startDate, new Date())}
            onClick={this.handleOpenStart}
            size={'small'}
          >
            {'Start'}
          </PrimaryButton>
        )}
        {start.getIn(['termination', 'reason']) === 'CONVERTED_TO_FTE' &&
          start.getIn(['termination', 'convertToFteFeeStatus']) ===
            'HAS_CONVERSION_FEE' &&
          moment().isAfter(
            moment(start.getIn(['termination', 'terminationDate'])).add(
              1,
              'days'
            )
          ) &&
          start.get('positionType') !== JOB_TYPES.Payrolling && (
            <PrimaryButton
              disabled={!isAm || hasActiveStart || conversionStartOpen}
              onClick={this.handleOpenConversionStart}
              size={'small'}
            >
              {'Conversion Start'}
            </PrimaryButton>
          )}
      </div>
    );
  }
}

ApplicationStart.propTypes = {
  applicationId: PropTypes.number.isRequired,
};

const makeMapStateToProps = () => {
  const getStartByApplicationId = makeGetStartByApplicationId();
  const getPreStartByApplicationId = makeGetPreStartByApplicationId();
  const checkAM = memoizeOne((start, currentUserId) => {
    return !!(
      start &&
      start.get('startCommissions') &&
      start.get('startCommissions').find((c) => {
        return (
          c.get('userId') === currentUserId &&
          c.get('userRole') === USER_TYPES.AM
        );
      })
    );
  });
  const checkUserCanView = memoizeOne((start, currentUserId) => {
    return !!(
      start &&
      start.get('startCommissions') &&
      start.get('startCommissions').find((c) => {
        return (
          c.get('userId') === currentUserId
          // && c.get('userRole') === USER_TYPES.AM
        );
      })
    );
  });
  const mapStateToProps = (state, { applicationId, candidateId }) => {
    const currentUserId = state.controller.currentUser.get('id');
    const start =
      getStartByApplicationId(state, applicationId) ||
      getPreStartByApplicationId(state, applicationId);
    const authorities = state.controller.currentUser.get('authorities');
    const isAdmin =
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
    return {
      start,
      isOpen:
        state.controller.currentStart.getIn(['start', 'applicationId']) ===
        applicationId,
      isAm: checkAM(start, currentUserId) || isAdmin,
      canView: checkUserCanView(start, currentUserId) || isAdmin,
      hasActiveStart: getActiveStartListByTalent(state, candidateId).size,
      conversionStartOpen:
        state.controller.currentStart.getIn([
          'conversionStart',
          'applicationId',
        ]) === applicationId,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ApplicationStart);
