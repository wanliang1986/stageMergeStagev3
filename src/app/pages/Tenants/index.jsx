import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import TenantTabs from './TenantTabs/index';
import NotFound from '../../components/NotFound';
import Immutable from 'immutable';
import Loading from '../../components/particial/Loading';
import ForbiddenPage from '../../components/ForbiddenPage';

function Tenants({ match, reloadKey, authorities, isLimitUser }) {
  if (!authorities) {
    return <Loading />;
  }
  if (isLimitUser) {
    return <ForbiddenPage />;
  }
  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={TenantTabs} />
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

export default connect(mapStateToProps)(Tenants);
