import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';

import EmailList from './List';
import Details from './Details';
import Immutable from 'immutable';
import Loading from './../../components/particial/Loading';
import ForbiddenPage from './../../components/ForbiddenPage';

function EmailBlast({ match, reloadKey, authorities, isLimitUser }) {
  // console.log(authorities);
  if (!authorities) {
    return <Loading />;
  }
  if (isLimitUser) {
    return <ForbiddenPage />;
  }

  return (
    <React.Fragment key={reloadKey}>
      <Route
        exact
        path={`${match.url}/detail/:emailBlastId`}
        component={Details}
      />
      <Route exact path={match.url} component={EmailList} />
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
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))
  };
}

export default connect(mapStateToProps)(EmailBlast);
