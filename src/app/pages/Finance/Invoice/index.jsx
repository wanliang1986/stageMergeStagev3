import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import NotFound from '../../../components/NotFound';
import InvoiceCreate from './Create';
import InvoiceDetail from './Detail';
// import InvoiceList from './List';
import Loading from '../../../components/particial/Loading';
import ForbiddenPage from '../../../components/ForbiddenPage';

function Invoices({ match, reloadKey, authorities, isAdmin }) {
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
            <Redirect to={{ pathname: `/finance`, search: '?tab=invoices' }} />
          )}
        />
        {/*<Route exact path={match.url} component={InvoiceList} />*/}
        <Route
          exact
          path={`${match.url}/create/:type`}
          component={InvoiceCreate}
        />
        <Route
          exact
          path={`${match.url}/detail/:invoiceNo`}
          component={InvoiceDetail}
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

export default connect(mapStateToProps)(Invoices);
