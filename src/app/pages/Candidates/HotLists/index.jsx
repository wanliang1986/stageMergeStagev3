import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import HotListList from './List';
import HotlistTalents from './HotlistTalents';
import Loading from '../../../components/particial/Loading';
import ForbiddenPage from '../../../components/ForbiddenPage';

function HotLists({ match, authorities, isLimitUser, hotListId, ...props }) {
  // console.log(authorities);
  if (!authorities) {
    return <Loading />;
  }
  if (isLimitUser) {
    return <ForbiddenPage />;
  }

  if (hotListId) {
    return <HotlistTalents hotListId={hotListId} {...props} />;
  }

  return <HotListList {...props} />;
}

function mapStateToProps(state, { location }) {
  const searchParams = new URLSearchParams(location.search);
  const authorities = state.controller.currentUser.get('authorities');

  return {
    hotListId: searchParams.get('hotlist'),
    authorities,
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' }))
  };
}

export default connect(mapStateToProps)(HotLists);
