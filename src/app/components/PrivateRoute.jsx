import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { Route, Redirect, withRouter } from 'react-router-dom';

const AsyncGlobalSearch = lazy(() => import('../pages/GlobalSearch'));

const PrivateRoute = ({ component: Component, loggedin, eSUser, ...rest }) => {
  // console.log(Component);
  return (
    <Route
      {...rest}
      render={props =>
        loggedin ? (
          eSUser ? (
            <AsyncGlobalSearch {...props} />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

function mapStoreStateToProps(state) {
  const authorities = state.controller.currentUser.get('authorities');
  return {
    loggedin: state.controller.loggedin,

    eSUser:
      authorities && authorities.includes(Immutable.Map({ name: 'ROLE_ES' }))
  };
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired
};
export default withRouter(connect(mapStoreStateToProps)(PrivateRoute));
