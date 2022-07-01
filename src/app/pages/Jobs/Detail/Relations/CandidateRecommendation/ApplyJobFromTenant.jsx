import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
  getTalent,
  getResumesByTalentId,
} from '../../../../../actions/talentActions';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import AddApplicationForm from '../../../../../components/applications/forms/AddApplicationForm';

class ApplyJobFromApplication extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selected: Immutable.Set(),
      stepIndex: 0,

      processing: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { dispatch, talentId } = this.props;
    dispatch(getTalent(talentId));
    dispatch(getResumesByTalentId(talentId));
  }

  beforeApply = () => {
    this.setState({ processing: true });
  };

  afterApply = (newApplication) => {
    if (newApplication) {
      this.props.handleRequestClose();
    } else {
      this.setState({ processing: false });
    }
  };

  render() {
    const { handleRequestClose, t, talentId, jobId, talent } = this.props;
    if (!talent) {
      return null;
    }
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <DialogTitle>{t('common:applyCandidates')}</DialogTitle>

        <DialogContent>
          <AddApplicationForm
            talentId={talentId}
            jobId={jobId}
            t={t}
            isJobDetail
            onSubmit={this.beforeApply}
            onSubmitSuccess={this.afterApply}
          />
        </DialogContent>

        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleRequestClose}>
              {t('action:cancel')}
            </SecondaryButton>

            <PrimaryButton
              processing={this.state.processing}
              type="submit"
              form="applicationForm"
            >
              {t('action:save')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </div>
    );
  }
}

ApplyJobFromApplication.propTypes = {
  handleRequestClose: PropTypes.func.isRequired,
  talentId: PropTypes.number.isRequired,
};

function mapStoreStateToProps(state, { talentId }) {
  return {
    talent: state.model.talents.get(String(talentId)),
  };
}

export default connect(mapStoreStateToProps)(ApplyJobFromApplication);
