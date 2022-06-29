import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { Route } from 'react-router';

import NotFound from '../../components/NotFound';
import Loading from '../../components/particial/Loading';
import PrivateRoute from '../../components/PrivateRoute';
import FinanceTabs from './List';
import Invoice from './Invoice';
import Commission from './Commission';

function Finance({ match, reloadKey, authorities, isAdmin }) {
  // console.log(authorities);
  if (!authorities) {
    return <Loading />;
  }

  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={FinanceTabs} />
      <PrivateRoute path={`${match.url}/invoices`} component={Invoice} />
      <PrivateRoute path={`${match.url}/commissions`} component={Commission} />
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
    isAdmin:
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))
  };
}
export default connect(mapStateToProps)(Finance);
