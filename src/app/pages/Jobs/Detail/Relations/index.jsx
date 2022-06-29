/**
 * Created by chenghui on 6/16/17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import jobNoteSelector from '../../../../selectors/jobNoteSelector';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';

import JobCandidates from './JobCandidates';
import PayrollingCandidates from './PayrollingCandidates';
import JobNotes from './JobNotes';
import CandidateRecommendation from './CandidateRecommendation';
import { JOB_TYPES } from '../../../../constants/formOptions';

const disableRecommendationStatus = ['FILLED', 'CLOSED', 'CANCELLED', 'ONHOLD'];
class JobRelations extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: null, // 'jobCandidates', 'jobNotes', 'candidateRecommendation'
      flag: true,
    };
  }
  componentDidMount() {
    const { job } = this.props;
    const hideCandidateRecommendation =
      job.get('jobType') === JOB_TYPES.Payrolling ||
      disableRecommendationStatus.includes(job.get('status'));
    if (hideCandidateRecommendation) {
      this.setState({
        selectedTab: 'payrollingCandidates',
      });
    } else {
      this.setState({
        selectedTab: 'jobCandidates',
      });
    }
  }

  tabsClickHandler = (e, selectedTab) => {
    this.setState({ selectedTab });
  };

  changeTableSize = () => {
    if (this.state.flag) {
      this.props.dispatch({
        type: 'none_TABLE',
      });
    } else {
      this.props.dispatch({
        type: 'big_TABLE',
      });
    }
    this.setState({
      flag: !this.state.flag,
    });
  };

  render() {
    const { selectedTab } = this.state;
    const { job, jobId, t, canEdit, noteCount } = this.props;
    const hideCandidateRecommendation =
      job.get('jobType') === JOB_TYPES.Payrolling ||
      disableRecommendationStatus.includes(job.get('status'));
    const jobType = job.get('jobType') || job.get('type');

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden', position: 'relative' }}
      >
        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          variant="scrollable"
        >
          {!hideCandidateRecommendation ? (
            <Tab
              label={t('tab:candidates')}
              value={'jobCandidates'}
              style={{ marginRight: 0 }}
            />
          ) : (
            <Tab
              label={t('tab:candidates')}
              value={'payrollingCandidates'}
              style={{ marginRight: 0 }}
            />
          )}
          {!hideCandidateRecommendation && (
            <Tab
              label={t('tab:candidateRecommendation')}
              value={'candidateRecommendation'}
              style={{ marginRight: 0 }}
            />
          )}
          <Tab
            label={t('tab:notes') + `(${noteCount})`}
            value={'jobNotes'}
            style={{ marginRight: 0 }}
          />
        </Tabs>

        <div
          style={{
            position: 'absolute',
            right: 10,
            top: 5,
            transform: 'rotate(45deg)',
            cursor: 'pointer',
          }}
          onClick={this.changeTableSize}
        >
          {this.state.flag ? (
            <UnfoldMoreIcon fontSize="large" style={{ color: '#939393' }} />
          ) : (
            <UnfoldLessIcon fontSize="large" style={{ color: '#939393' }} />
          )}
        </div>

        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{ overflow: 'hidden' }}
        >
          {selectedTab === 'jobCandidates' && (
            <JobCandidates
              jobId={jobId}
              jobType={jobType}
              t={t}
              canEdit={canEdit}
              internal={job.get('internal')}
            />
          )}
          {selectedTab === 'payrollingCandidates' && (
            <PayrollingCandidates
              jobId={jobId}
              jobType={jobType}
              t={t}
              canEdit={canEdit}
              internal={job.get('internal')}
            />
          )}

          {selectedTab === 'candidateRecommendation' && (
            <CandidateRecommendation
              {...this.props}
              jobId={jobId}
              t={t}
              canEdit={canEdit}
            />
          )}

          {selectedTab === 'jobNotes' && (
            <JobNotes
              notes={job.get('notes')}
              jobId={jobId}
              t={t}
              canEdit={canEdit}
            />
          )}
        </div>
      </Paper>
    );
  }
}

JobRelations.propTypes = {
  jobId: PropTypes.string.isRequired,
  job: PropTypes.object,
  canEdit: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state, { jobId }) {
  return {
    noteCount: jobNoteSelector(state, jobId).size,
  };
}

export default connect(mapStoreStateToProps)(JobRelations);
