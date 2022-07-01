import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PrimaryButton from '../particial/PrimaryButton';
import BoardForm from './form/boardForm';
import BoardFormPayroll from './form/boardFormPayroll';

import ClearIcon from '@material-ui/icons/Clear';

class SubmitToBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      processing: false,
    };
  }

  onSubmitToOnboard = (e) => {
    const { editFlag } = this.props;
    e.preventDefault();
    if (!editFlag) {
      this.props.changeActiveStep(6);
    }
    this.props.handleRequestClose();
  };

  onSubmitToOnboardPayroll = (e) => {
    const { editFlag } = this.props;
    e.preventDefault();
    if (!editFlag) {
      this.props.changeActiveStep(2);
    }
    this.props.handleRequestClose();
  };

  onSubmit = (processing) => {
    this.setState({
      processing,
    });
  };

  render() {
    const { t, handleRequestClose, application, job, candidate } = this.props;
    //versionsFlag = true 为通用版本
    const versionsFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    const { processing } = this.state;
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column vertical-layout"
        style={{ overflow: 'hidden' }}
      >
        <div
          id="draggable-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            marginLeft: 15,
            marginBottom: 15,
            paddingRight: 20,
          }}
        >
          <div style={{ color: '#505050', fontSize: 16, fontWeight: 600 }}>
            {'入职'}
          </div>
          <ClearIcon onClick={handleRequestClose} fontSize="small" />
        </div>

        <Divider />
        <DialogContent>
          {application.get('jobType') === 'PAY_ROLL' && !versionsFlag ? (
            <BoardFormPayroll
              t={t}
              application={application}
              job={job}
              candidate={candidate}
              onSubmit={this.onSubmit}
              onSubmitToOnboard={this.onSubmitToOnboardPayroll}
            />
          ) : (
            <BoardForm
              t={t}
              application={application}
              job={job}
              candidate={candidate}
              onSubmit={this.onSubmit}
              onSubmitToOnboard={this.onSubmitToOnboard}
            />
          )}
        </DialogContent>

        <DialogActions>
          <div className="horizontal-layout">
            <PrimaryButton
              type="submit"
              form="newApplicationBoardForm"
              processing={processing}
            >
              {'提交'}
            </PrimaryButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}
// const getJobList = makeGetJobList();

function mapStoreStateToProps(state, { application }) {
  //   const authorities = state.controller.currentUser.get('authorities');
  return {
    job: state.model.jobs.get(String(application.get('jobId'))),
    candidate: state.model.talents.get(String(application.get('talentId'))),
    editFlag: state.controller.newCandidateJob.toJS().editFlag,
    // isLimitUser:
    //   !authorities ||
    //   authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    // selectID: state.controller.newCandidateJob.toJS().dialogSelectID,
    // searchFlag: state.controller.newCandidateJob.toJS().searchFlag,
  };
}

export default connect(mapStoreStateToProps)(SubmitToBoard);
