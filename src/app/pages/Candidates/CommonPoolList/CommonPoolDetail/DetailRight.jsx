import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import AlRecommendations from './AlRecommendations';

// tabs: 'AIRecommendations','appliedJobs','resume', 'start','extension', 'conversionStart'
class CandidateDetailRight extends React.Component {
  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { telentId, t } = this.props;
    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <Tabs indicatorColor="primary" textColor="primary">
          <div
            style={{
              width: '204px',
              textAlign: 'center',
              height: '100%',
              lineHeight: '47px',
              borderBottom: '3px solid #3598dc',
              color: '#3598dc',
              fontSize: '14px',
            }}
          >
            AI Recommendations
          </div>
        </Tabs>

        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{ overflow: 'auto' }}
        >
          <AlRecommendations t={t} telentId={telentId} />
        </div>
      </Paper>
    );
  }
}

CandidateDetailRight.propTypes = {
  t: PropTypes.func.isRequired,
  candidate: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = (state) => {};

export default connect(mapStateToProps)(CandidateDetailRight);
