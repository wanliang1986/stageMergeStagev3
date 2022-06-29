import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';

import Loading from '../../../components/particial/Loading';
import ForbiddenPage from '../../../components/ForbiddenPage';
import NotFound from '../../../components/NotFound';

import CommissionsByProject from './List/CommissionsByProject';
import CommissionsByRecruiters from './List/CommissionsByRecruiters';

function Commissions({ match, reloadKey, authorities, isAdmin }) {
  if (!authorities) {
    return <Loading />;
  }
  if (!isAdmin) {
    return <ForbiddenPage />;
  }
  return (
    <React.Fragment key={reloadKey}>
      <Switch>
        <Route
          exact
          path={match.url}
          render={() => (
            <Redirect
              to={{ pathname: `/finance`, search: '?tab=commissions' }}
            />
          )}
        />
        <Route
          exact
          path={`${match.url}/project`}
          component={CommissionsByProject}
        />
        <Route
          exact
          path={`${match.url}/recruiter`}
          component={CommissionsByRecruiters}
        />

        <Route exact path={`${match.url}/404`} component={NotFound} />
        <Route exact path={`${match.url}/nomatch`} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  const authorities = state.controller.currentUser.get('authorities');

  return {
    authorities,
    reloadKey: state.controller.reload,
    isAdmin:
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
  };
}

export default connect(mapStateToProps)(Commissions);
