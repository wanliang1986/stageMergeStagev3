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

import * as ActionTypes from '../../constants/actionTypes';

function Jobs({ dispatch, match, reloadKey, authorities, isLimitUser }) {
  // console.log(authorities);
  useEffect(() => {
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
