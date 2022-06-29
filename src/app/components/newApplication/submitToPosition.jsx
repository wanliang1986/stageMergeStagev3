import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { Prompt } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import SecondaryButton from '../particial/SecondaryButton';
import PrimaryButton from '../particial/PrimaryButton';
import PositionForm from './form/positionForm';
import ClearIcon from '@material-ui/icons/Clear';
import { dialogSelectID, changeSearchFlag } from '../../actions/newCandidate';
import { getAssignedUserArray } from '../../selectors/userSelector';
class SubmitToPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      processing: false,
    };
  }

  onSubmitToPosition = (e) => {
    e.preventDefault();
    this.props.handleRequestClose();
    // 清空submit to job弹出框里的下拉框内容和选中的jobID以及提交至job的页面配置信息
    this.props.dispatch(dialogSelectID(null));
    this.props.dispatch({
      type: 'NEW_CANDIDATE_SELECT_OPTION',
      payload: [],
    });
    this.props.dispatch({
      type: 'APPLICATION_POSITION_SECTION',
      payload: [],
    });
  };

  onSubmit = (processing) => {
    this.setState({
      processing,
    });
  };

  render() {
    const { t, handleRequestClose, talent, newCandidateJob, currentUserId } =
      this.props;
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
            {'推荐至职位'}
          </div>
          <ClearIcon onClick={this.onSubmitToPosition} fontSize="small" />
        </div>

        <Divider />
        <DialogContent>
          <PositionForm
            t={t}
            talent={talent}
            onSubmit={this.onSubmit}
            onSubmitToPosition={this.onSubmitToPosition}
            {...this.props}
          />
        </DialogContent>

        <DialogActions>
          <div className="horizontal-layout">
            <PrimaryButton
              type="submit"
              form="newApplicationPositionForm"
              processing={processing}
              disabled={!newCandidateJob.dialogSelectID}
              // onClick={this.onSubmitToPosition}
            >
              {'确定'}
            </PrimaryButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}
// const getJobList = makeGetJobList();

function mapStoreStateToProps(state, { talentId, jobId }) {
  //   const authorities = state.controller.currentUser.get('authorities');
  return {
    talent: state.model.talents.get(String(talentId)),
    newCandidateJob: state.controller.newCandidateJob.toJS(),
    currentUserId: state.controller.currentUser.get('id'),
    // isLimitUser:
    //   !authorities ||
    //   authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    // selectID: state.controller.newCandidateJob.toJS().dialogSelectID,
    // searchFlag: state.controller.newCandidateJob.toJS().searchFlag,
    // recruiterList: getAssignedUserArray(state, jobId),
  };
}

export default connect(mapStoreStateToProps)(SubmitToPosition);
