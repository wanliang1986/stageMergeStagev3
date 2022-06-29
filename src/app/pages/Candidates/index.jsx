import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import NotFound from '../../components/NotFound';
import CandidateList from './newList';
import CandidateCreate from './newCreate';
import CandidateReview from './Review';
import CandidateDetail from './newDetail';
import CandidateEdit from './newEdit';
import Loading from '../../components/particial/Loading';
import CommonPoolDetail from './CommonPoolList/CommonPoolDetail/index';

function Candidates({ match, reloadKey, authorities, isLimitUser }) {
  console.log('Candidates match', match.url);
  if (!authorities) {
    return <Loading />;
  }
  return (
    <React.Fragment key={reloadKey}>
      <Switch>
        <Route exact path={match.url} component={CandidateList} />
        <Route exact path={`${match.url}/create`} component={CandidateCreate} />
        <Route
          exact
          path={`${match.url}/review/:uuid/:recordId`}
          component={CandidateReview}
        />
        <Route
          exact
          path={`${match.url}/detail/:candidateId`}
          component={CandidateDetail}
        />
        <Route
          exact
          path={`${match.url}/edit/:candidateId`}
          component={CandidateEdit}
        />
        <Route
          exact
          path={`${match.url}/commonPoolList/commonPoolDetail/`}
          component={CommonPoolDetail}
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
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
  };
}
export default connect(mapStateToProps)(Candidates);
