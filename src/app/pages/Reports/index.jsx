import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import NotFound from '../../components/NotFound';
import ReportList from './ReportList';
import ReportDetail from './ReportsDetail';
import Immutable from 'immutable';
import Loading from '../../components/particial/Loading';
import ForbiddenPage from '../../components/ForbiddenPage';

function Reports({ match, reloadKey, authorities }) {
  if (!authorities) {
    return <Loading />;
  }
  if (authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))) {
    return <ForbiddenPage />;
  }

  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={ReportList} />
      <Route
        exact
        path={`${match.url}/detail/:reportId`}
        component={ReportDetail}
      />
      <Route exact path={`${match.url}/nomatch`} component={NotFound} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  const authorities = state.controller.currentUser.get('authorities');

  return {
    authorities,
    reloadKey: state.controller.reload
  };
}
export default connect(mapStateToProps)(Reports);
