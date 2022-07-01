import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import PrimaryButton from '../particial/PrimaryButton';
import PerformanceForm from './form/offerAcceptForm';
import ClearIcon from '@material-ui/icons/Clear';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class SubmitToOffer extends React.Component {
  constructor(props) {
    super(props);
    //versionsFlag = true 为通用版本
    const versionsFlag = props.application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    this.state = {
      selected: Immutable.Set(),
      processing: false,
      versionsFlag: versionsFlag,
      feeItemizations: false,
    };
  }

  onSubmitToPerformance = (e) => {
    const { editFlag } = this.props;
    e.preventDefault();
    if (!editFlag) {
      this.props.changeActiveStep(5);
    }
    this.props.handleRequestClose();
    if (this.state.feeItemizations) {
      this.props.handOpenFee('feeOpenFte', true);
    }
  };

  onSubmit = (processing) => {
    this.setState({
      processing,
    });
  };

  render() {
    const { t, handleRequestClose, application, job, candidate } = this.props;
    const jobType = application.get('jobType');
    const { processing, versionsFlag } = this.state;

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
            {versionsFlag ? '业绩分配：' : '接受offer：'}
            {candidate.get('fullName') || 'N/A'}
          </div>
          <ClearIcon onClick={handleRequestClose} fontSize="small" />
        </div>

        <Divider />
        <DialogContent>
          <PerformanceForm
            t={t}
            application={application}
            job={job}
            candidate={candidate}
            onSubmit={this.onSubmit}
            onSubmitToPerformance={this.onSubmitToPerformance}
          />
        </DialogContent>

        <DialogActions style={{ justifyContent: 'space-between' }}>
          <div className="horizontal-layout">
            <PrimaryButton
              type="submit"
              form="newApplicationResultForm"
              processing={processing}
            >
              {'提交'}
            </PrimaryButton>
          </div>
          {!versionsFlag && jobType === 'FULL_TIME' ? (
            <div style={{ right: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={this.state.feeItemizations}
                    onChange={(e) =>
                      this.setState({ feeItemizations: e.target.checked })
                    }
                  />
                }
                label={'生成收费明细'}
              />
            </div>
          ) : (
            ''
          )}
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

export default connect(mapStoreStateToProps)(SubmitToOffer);
