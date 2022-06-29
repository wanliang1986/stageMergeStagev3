import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Loading from '../../components/particial/Loading';
import ForbiddenPage from '../../components/ForbiddenPage';
import TenantAdminPortal from './TenantAdminPortal';
import TenantAdminCreate from './TenantAdminCreate';
import TenantDetails from './TenantDetails';

function TenantAdmin({ match, reloadKey }) {
  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={TenantAdminPortal} />
      <Route exact path={`${match.url}/create`} component={TenantAdminCreate} />
      <Route exact path={`${match.url}/detail/:id`} component={TenantDetails} />
      <Route
        exact
        path={`${match.url}/edit/:id`}
        component={TenantAdminCreate}
      />
      {/*<Route
        exact
        path={`${match.url}/clientEdit/:id`}
        component={CompanyEdition}
      />
      <Route path={`${match.url}/detail/:id/:type`} component={CompanyTabs} />
      <Route exact path={`${match.url}/404`} component={NotFound} />
      <Route exact path={`${match.url}/nomatch`} component={NotFound} /> */}
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    reloadKey: state.controller.reload,
  };
}

export default connect(mapStateToProps)(TenantAdmin);
