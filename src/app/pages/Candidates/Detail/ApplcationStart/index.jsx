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
import {
  selectStartToOpen,
  selectConversionFTEToOpen,
  OpenOnboarding,
  selectExtensionToOpen,
} from '../../../../actions/startActions';
import { JOB_TYPES, USER_TYPES } from '../../../../constants/formOptions';
import dateFns from 'date-fns';

import Typography from '@material-ui/core/Typography';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import CheckOfferConflict from './CheckOfferConflict';
import StartStatus from './StartStatus';
import { isArray } from 'lodash';

import * as ActionTypes from '../../../../constants/actionTypes';

class ApplicationStart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openCheckOfferConflict: false,
      currentTabs: '',
    };
  }

  // componentDidMount() {
  //   const { dispatch, start } = this.props;
  //   this.fetchData();
  // }

  // fetchData = () => {
  //   const { dispatch, applicationId } = this.props;
  //   // if (!loaded[applicationId]) {
  //   dispatch(getApplicationCommissions(applicationId)).then(() => {
  //     // loaded[applicationId] = true;
  //   });
  //   // }
  // };

  handleOpenStart = () => {
    const { dispatch, start } = this.props;
    const hasOnboardingBtn = this.hasOnboardingBtn();
    if (start) {
      dispatch(selectStartToOpen(start, hasOnboardingBtn));
      dispatch(
        OpenOnboarding(
          start.get('applicationId'),
          'openStart',
          start,
          hasOnboardingBtn
        )
      );
      if (start.get('startType') === 'CONTRACT_EXTENSION') {
        dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'extension',
        });
      } else if (start.get('startType') === 'CONVERT_TO_FTE') {
        dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'conversionStart',
        });
      } else {
        dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'start',
        });
      }

      this.setState({
        openCheckOfferConflict: !start.get('id'),
        currentTabs: 'start',
      });
    }
  };

  handleOpenConversionStart = () => {
    const { dispatch, start } = this.props;
    const hasOnboardingBtn = this.hasOnboardingBtn();
    if (start) {
      dispatch(selectStartToOpen(start));
      dispatch({
        type: ActionTypes.TAB_SELECT,
        selectedTab: 'conversionStart',
      });
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
      dispatch(
        OpenOnboarding(
          start.get('applicationId'),
          'openOnboard',
          start,
          hasOnboardingBtn
        )
      );
      this.setState({ openCheckOfferConflict: true });
    }
  };

  handleCloseCheckOfferConflict = () => {
    this.setState({ openCheckOfferConflict: false });
  };

  handleOpenOnboarding = () => {
    const { dispatch, applicationId, start, starts } = this.props;
    const hasOnboardingBtn = this.hasOnboardingBtn();
    // const state = getState();
    // const startType = start.get('startType');
    // const applicationId = start.get('applicationId');

    const startList = starts
      .filter((s) => s.get('applicationId') === Number(applicationId))
      .sortBy((el) => el.get('id'));
    const extension = startList
      .filter((s) => s.get('startType') === 'CONTRACT_EXTENSION')
      .last();
    const conversionStart = startList
      .filter((s) => s.get('startType') === 'CONVERT_TO_FTE')
      .last();
    dispatch(selectExtensionToOpen(extension));
    dispatch(selectConversionFTEToOpen(conversionStart));
    dispatch(
      OpenOnboarding(applicationId, 'openOnboard', start, hasOnboardingBtn)
    );
    dispatch({
      type: ActionTypes.TAB_SELECT,
      selectedTab: 'Onboard',
    });
    // dispatch(
    //   OpenOnboarding(applicationId, 'openOnboard', start, hasOnboardingBtn)
    // );
    this.setState({ currentTabs: 'onboard' });
  };

  hasOnboardingBtn = () => {
    const {
      application,
      start,
      jobs,
      isAdmin,
      currentUserId,
      dispatch,
      applicationId,
    } = this.props;
    let isOnboard =
      application.get('status') == 'Started' ||
      application.get('status') == 'START_TERMINATED' ||
      application.get('status') == 'START_EXTENSION';
    //与职位相关的AM/DM/AC，Admin/Super User
    let jobId = start && start.get('jobId');
    let assignedUsers = jobs[jobId].assignedUsers;
    // let isCompanyClientAM = application.get('company')&&Boolean(application.get('company').toJS().isAm);
    let commissionList = start.get('startCommissions').toJS();
    let isCommissionAM =
      commissionList.length > 0 &&
      commissionList.some((item) => {
        return currentUserId == item.userId && item.userRole == 'AM';
      });
    let isJobAMDMAC =
      isAdmin ||
      (assignedUsers &&
        assignedUsers.length > 0 &&
        assignedUsers.some((item) => {
          return (
            currentUserId == item.userId &&
            (item.permission == 'AM' ||
              item.permission == 'DELIVERY_MANAGER' ||
              item.permission == 'AC')
          );
        })) ||
      isCommissionAM;
    let isoKJobType =
      application.get('jobType') == 'CONTRACT' ||
      application.get('jobType') == 'PAY_ROLL';
    let startType = start.get('startType');
    let isC2c = false;
    if (startType == 'CONVERT_TO_FTE') {
      isC2c = true;
    } else {
      let startContractRates =
        start.get('startContractRates') &&
        (isArray(start.get('startContractRates'))
          ? start.get('startContractRates')
          : start.get('startContractRates').toJS());
      if (startContractRates && startContractRates.length > 0) {
        isC2c =
          (startContractRates[0].taxBurdenRate &&
            startContractRates[0].taxBurdenRate.code.indexOf('C2C') == -1) ||
          (startContractRates[0].taxBurdenRate &&
            startContractRates[0].taxBurdenRate.code.indexOf('1099') == -1);
      }
    }

    if (isoKJobType && isC2c && isJobAMDMAC && isOnboard) {
      return true;
    }
    return false;
  };

  startAuthority = () => {
    const { application, start, jobs, isAdmin, currentUserId, dispatch } =
      this.props;
    let jobId = start && start.get('jobId');
    let assignedUsers = jobs[jobId].assignedUsers;
    // let isCompanyClientAM =application.get('company')&&Boolean(application.get('company').toJS().isAm);
    let isJobAM =
      assignedUsers &&
      assignedUsers.length > 0 &&
      assignedUsers.some((item) => {
        return currentUserId == item.userId && item.permission == 'AM';
      });

    if (isJobAM) {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const { openCheckOfferConflict, currentTabs } = this.state;
    const {
      start,
      canView,
      isAm,
      isOpen,
      hasActiveStart,
      conversionStartOpen,
      t,
    } = this.props;
    if (!start) {
      return null;
    }
    const startId = start.get('id');
    const startDate = new Date(start.get('startDate'));
    const hasOnboardingBtn = this.hasOnboardingBtn();
    const startAuthority = this.startAuthority();
    const isOpenFlag = isOpen && currentTabs === 'start';
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
            isOpen={isOpenFlag}
            canView={canView}
            isAm={isAm}
            hasActiveStart={hasActiveStart}
            onOpenStart={this.handleOpenStart}
            startAuthority={startAuthority}
          />
        )}

        {!startId && dateFns.isAfter(startDate, new Date()) && (
          <Typography color={'textSecondary'}>
            {'Start at '}
            {dateFns.format(new Date(start.get('startDate')), 'MM/DD/YYYY')}
          </Typography>
        )}
        <div className="flex-child-auto" />

        {hasOnboardingBtn ? (
          <PrimaryButton
            // disabled={!isAm || isOpen || dateFns.isAfter(startDate, new Date())}
            onClick={this.handleOpenOnboarding}
            size={'small'}
          >
            {'Onboarding'}
          </PrimaryButton>
        ) : null}

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
              style={{ marginLeft: '8px' }}
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
    const jobs = state.model.jobs.toJS();
    const isAdmin =
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
    const starts = state.relationModel.starts;
    return {
      jobs,
      start,
      isAdmin,
      currentUserId,
      isOpen:
        state.controller.currentStart.getIn(['start', 'applicationId']) ===
        applicationId,
      isAm: checkAM(start, currentUserId) || isAdmin,
      // isJobAMDMAC : checkJobAMDMAC(start,jobs) || isAdmin,
      canView: checkUserCanView(start, currentUserId) || isAdmin,
      hasActiveStart: getActiveStartListByTalent(state, candidateId).size,
      conversionStartOpen:
        state.controller.currentStart.getIn([
          'conversionStart',
          'applicationId',
        ]) === applicationId,
      starts,
    };
  };

  return mapStateToProps;
};

export default connect(makeMapStateToProps)(ApplicationStart);
