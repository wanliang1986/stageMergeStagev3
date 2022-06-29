import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux';
import NotFound from '../../components/NotFound';
import TimesheetCard from './timesheetCard';
import TimesheetSearch from './timesheetIframe';
function Reports({ match, reloadKey, authorities }) {
  return (
    <React.Fragment key={reloadKey}>
      <Route exact path={match.url} component={TimesheetCard} />
      <Route
        exact
        path={`${match.url}/Search/:talentId`}
        component={TimesheetSearch}
      />
      <Route exact path={`${match.url}/nomatch`} component={NotFound} />
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(Reports);
