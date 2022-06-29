import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PrimaryButton from '../particial/PrimaryButton';
import InterviewForm from './form/interviewForm';
import ClearIcon from '@material-ui/icons/Clear';

class SubmitToInterview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      processing: false,
    };
  }

  onSubmitToInterview = (e) => {
    const { editFlag } = this.props;
    e.preventDefault();
    if (!editFlag) {
      this.props.changeActiveStep(3);
    }
    this.props.handleRequestClose();
  };

  onSubmit = (processing) => {
    this.setState({
      processing,
    });
  };

  render() {
    const { t, handleRequestClose, application } = this.props;
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
            {'面试'}
          </div>
          <ClearIcon onClick={handleRequestClose} fontSize="small" />
        </div>

        <Divider />
        <DialogContent>
          <InterviewForm
            t={t}
            application={application}
            onSubmitToInterview={this.onSubmitToInterview}
            onSubmit={this.onSubmit}
          />
        </DialogContent>

        <DialogActions>
          <div className="horizontal-layout">
            <PrimaryButton
              type="submit"
              form="newApplicationInterviewForm"
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

function mapStoreStateToProps(state) {
  //   const authorities = state.controller.currentUser.get('authorities');
  return {
    editFlag: state.controller.newCandidateJob.toJS().editFlag,
    // isLimitUser:
    //   !authorities ||
    //   authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    // selectID: state.controller.newCandidateJob.toJS().dialogSelectID,
    // searchFlag: state.controller.newCandidateJob.toJS().searchFlag,
  };
}

export default connect(mapStoreStateToProps)(SubmitToInterview);
