import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import PrimaryButton from '../particial/PrimaryButton';
import OfferForm from './form/offerForm';
import ClearIcon from '@material-ui/icons/Clear';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

class SubmitToOffer extends React.Component {
  constructor(props) {
    super(props);
    const { application } = this.props;
    //versionsFlag = true 为通用版本
    const versionsFlag = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .some((x) => {
        return x.nodeType === 'COMMISSION';
      });
    this.state = {
      selected: Immutable.Set(),
      processing: false,
      feeItemizations: false,
      versionsFlag: versionsFlag,
    };
  }

  onSubmitToOffer = (e) => {
    const { editFlag } = this.props;
    e.preventDefault();
    if (!editFlag) {
      this.props.changeActiveStep(4);
    }
    this.props.handleRequestClose();
    if (this.state.feeItemizations) {
      this.props.handOpenFee('feeOpen', true);
    }
  };

  componentDidMount() {
    // 获取当前流程页面配置section
    // getApplicationPageSection('SUBMIT_TO_JOB', application.get('jobType')).then(
    //   ({ response }) => {
    //     this.setState({
    //       pageSectionArr: this.filterArrItem(response),
    //     });
    //   }
    // );
  }

  onSubmit = (processing) => {
    this.setState({
      processing,
    });
  };

  render() {
    const { t, handleRequestClose, application } = this.props;
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
            {'Offer'}
          </div>
          <ClearIcon onClick={handleRequestClose} fontSize="small" />
        </div>

        <Divider />
        <DialogContent>
          <OfferForm
            t={t}
            application={application}
            onSubmitToOffer={this.onSubmitToOffer}
            onSubmit={this.onSubmit}
          />
        </DialogContent>

        <DialogActions style={{ justifyContent: 'space-between' }}>
          <div className="horizontal-layout">
            <PrimaryButton
              type="submit"
              form="newApplicationOfferForm"
              processing={processing}
            >
              {'提交'}
            </PrimaryButton>
          </div>
          {versionsFlag ? (
            <div>
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

export default connect(mapStoreStateToProps)(SubmitToOffer);
