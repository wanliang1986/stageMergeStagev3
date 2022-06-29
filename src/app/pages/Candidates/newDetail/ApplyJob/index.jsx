import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { getApplicationsByTalentId } from '../../../../actions/talentActions';
import memoizeOne from 'memoize-one';

import { Prompt } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import SecondaryButton from '../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../components/particial/PrimaryButton';

import JobTable from './AppliedJobTable';
import SearchBox from './SearchJobBox';
import Loading from '../../../../components/particial/Loading';
import AddApplicationForm from '../../../../components/applications/forms/AddApplicationForm';

class ApplyJob extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      stepIndex: 0,

      processing: false,
      maxWidth: 1300,
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    const { dispatch, candidate, isTalentDetail } = this.props;
    !isTalentDetail && dispatch(getApplicationsByTalentId(candidate.get('id')));
  };

  handleNext = () => {
    this.setState({ stepIndex: 1, maxWidth: 960 });
  };

  handlePrev = () => {
    this.setState({ stepIndex: 0, maxWidth: 1300 });
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (!selected.includes(id)) {
      this.setState({ selected: Immutable.Set([id]) });
    }
  };

  beforeApply = () => {
    this.setState({ processing: true });
  };

  afterApply = (newApplication, sendEmail) => {
    if (newApplication) {
      this.props.handleRequestClose();
    } else {
      this.setState({ processing: false });
    }
  };

  handleMaxWidth = (maxWidth) => {
    this.setState({
      maxWidth,
    });
  };

  render() {
    const {
      handleRequestClose,
      talentId,
      t,
      isTalentDetail,
      searchFlag,
      selectID,
      candidate,
    } = this.props;

    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{
          overflow: 'hidden',
          width: 'calc(100vw - 96px)',
          maxWidth: this.state.maxWidth,
        }}
      >
        {this.state.stepIndex === 0 && (
          <Prompt
            message={(location) => t('message:prompt') + location.pathname}
          />
        )}

        <div
          id="draggable-dialog-title"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 16,
            marginLeft: 15,
            marginBottom: 15,
          }}
        >
          <div style={{ color: '#505050', fontSize: 16, fontWeight: 600 }}>
            {'Apply to job: '}
            {candidate.get('fullName')}
          </div>
          <div />
        </div>

        {this.state.stepIndex === 0 ? (
          <React.Fragment>
            <div style={{ padding: '0px 25px' }}>
              <SearchBox talentId={talentId} />
            </div>
            <div
              className="flex-child-auto"
              style={{ height: 900, overflow: 'auto', padding: '0px 25px' }}
            >
              <JobTable candidateId={candidate && candidate.get('id')} />
            </div>
            <Divider />
          </React.Fragment>
        ) : (
          <DialogContent>
            <AddApplicationForm
              talentId={talentId}
              jobId={selectID}
              t={t}
              onSubmit={this.beforeApply}
              onSubmitSuccess={this.afterApply}
              isTalentDetail={isTalentDetail}
              handleMaxWidth={this.handleMaxWidth}
            />
          </DialogContent>
        )}
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleRequestClose}>
              {t('action:cancel')}
            </SecondaryButton>
            {this.state.stepIndex === 0 && (
              <PrimaryButton disabled={!searchFlag} onClick={this.handleNext}>
                {t('action:next')}
              </PrimaryButton>
            )}
            {this.state.stepIndex === 1 && (
              <SecondaryButton onClick={this.handlePrev}>
                {t('action:back')}
              </SecondaryButton>
            )}

            {this.state.stepIndex === 1 && (
              <PrimaryButton
                disabled={!selectID}
                processing={this.state.processing}
                type="submit"
                form="applicationForm"
              >
                {t('action:save')}
              </PrimaryButton>
            )}
          </div>
        </DialogActions>
      </div>
    );
  }
}

ApplyJob.propTypes = {
  talentId: PropTypes.number.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
};
// const getJobList = makeGetJobList();

function mapStoreStateToProps(state) {
  const authorities = state.controller.currentUser.get('authorities');
  return {
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
    selectID: state.controller.newCandidateJob.toJS().dialogSelectID,
    searchFlag: state.controller.newCandidateJob.toJS().searchFlag,
  };
}

export default withTranslation(['action', 'message'])(
  connect(mapStoreStateToProps)(ApplyJob)
);
