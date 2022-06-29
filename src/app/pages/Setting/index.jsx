import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import Documents from './Documents/DocumentList';
import PackageList from './Packages/PackageList';
import Esignature from './Esignature';
import PackageDetail from './PackageDetail';

import Loading from '../../components/particial/Loading';
import NotFound from '../../components/NotFound';
import PrivateRoute from '../../components/PrivateRoute';

function Setting({ match, reloadKey, authorities, isLimitUser }) {
  //   if (!authorities) {
  //     return <Loading />;
  //   }
  return (
    <React.Fragment key={reloadKey}>
      <Switch>
        <Route exact path={`${match.url}/document`} component={Documents} />
        <Route exact path={`${match.url}/package`} component={PackageList} />
        <Route exact path={`${match.url}/esignature`} component={Esignature} />
        <PrivateRoute
          path={`${match.url}/package/packageDetail`}
          component={PackageDetail}
        />
        <Route exact path={`${match.url}/404`} component={NotFound} />
        <Route exact path={`${match.url}/nomatch`} component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}

export default connect()(Setting);
