import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import Loading from '../../components/particial/Loading';
import ForbiddenPage from '../../components/ForbiddenPage';
import { Route } from 'react-router';
import NotFound from '../../components/NotFound';
// import TemplateList from './TemplateList';
import List from './List';

function Templates({ match, reloadKey, authorities, isLimitUser }) {
  if (!authorities) {
    return <Loading />;
  }
  if (isLimitUser) {
    return <ForbiddenPage />;
  }
  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={List} />
      {/* <Route exact path={`${match.url}/test`} component={List} /> */}
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

export default connect(mapStateToProps)(Templates);
