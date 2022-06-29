import React, { useEffect } from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import { getClientBriefList } from '../../actions/clientActions';
import { getNewOptions } from '../../actions/newSearchOptions';

import JobTabs from './List';
import NotFound from '../../components/NotFound';
import JobCreate from './Create';
import JobDetail from './Detail';
import Immutable from 'immutable';
import Loading from '../../components/particial/Loading';
import ForbiddenPage from './../../components/ForbiddenPage';
import { distSelect, distSelectZh } from '../../../apn-sdk/newSearch';
import * as ActionTypes from '../../constants/actionTypes';

function Jobs({
  dispatch,
  match,
  reloadKey,
  authorities,
  isLimitUser,
  briefUsers,
}) {
  // console.log('21sas', briefUsers);
  useEffect(() => {
    getDate();
    dispatch(getClientBriefList(0)).then(({ response }) => {
      const companyOptions = getCompanyOptions(response);
      dispatch({
        type: ActionTypes.REVEIVE_COMPANIES_OPTIONS,
        companiesOptions: companyOptions,
      });
    });
    dispatch(getClientBriefList(null)).then(({ response }) => {
      if (response) {
        const createCompanyOptions = getCreateCompanyOptions(response);
        dispatch(getNewOptions(['companyOptions', createCompanyOptions]));
      }
    });
  }, []);

  useEffect(() => {
    dispatch(getNewOptions(['allUserOptions', briefUsers]));
  }, [JSON.stringify(briefUsers)]);

  const getDate = () => {
    Promise.all([
      distSelect(38),
      distSelect(65),
      distSelect(1),
      distSelectZh(1),
    ]).then((res) => {
      dispatch(getNewOptions(['languagesOptions', res[0].response]));
      dispatch(getNewOptions(['degreeOptions', res[1].response]));
      dispatch(getNewOptions(['functionOptions', res[2].response]));
      // dispatch(getNewOptions(['allUserOptions', briefUsers]));
      dispatch(getNewOptions(['functionOptionsZh', res[3].response]));
    });
  };

  if (!authorities) {
    return <Loading />;
  }

  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={JobTabs} />
      <Route
        exact
        path={`${match.url}/create`}
        component={isLimitUser ? ForbiddenPage : JobCreate}
      />
      <Route exact path={`${match.url}/detail/:jobId`} component={JobDetail} />
      <Route exact path={`${match.url}/404`} component={NotFound} />
      <Route exact path={`${match.url}/nomatch`} component={NotFound} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  const authorities = state.controller.currentUser.get('authorities');

  return {
    authorities,
    reloadKey: state.controller.reload,
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
  };
}

const getCompanyOptions = (response) => {
  const companyOptions = response.map((item, index) => {
    return {
      value: item.id,
      label: item.name,
      industry: item.industry,
      disabled: !item.active,
    };
  });
  return companyOptions;
};

const getCreateCompanyOptions = (response) => {
  const companyOptions = response.map((item, index) => {
    return {
      value: item.id,
      label: item.name,
      industry: item.industry,
    };
  });
  return companyOptions;
};

export default connect(mapStateToProps)(Jobs);
