import React from 'react';
import { connect } from 'react-redux';
import { getOfferListByTalent } from '../../../../selectors/applicationSelector';
import { getJobTypeLabel } from '../../../../constants/formOptions';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import PrimaryButton from '../../../../components/particial/PrimaryButton';

class CheckOfferConflict extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.applicationList.size > 0,
    };
  }

  componentDidMount() {
    if (!this.state.open) {
      this.props.onClose();
    }
  }

  handleCloseDialog = () => this.setState({ open: false });

  render() {
    const { open } = this.state;
    const { applicationList, onClose, t } = this.props;
    if (applicationList.size > 0) {
      return (
        <Dialog
          open={open}
          fullWidth
          onExited={onClose}
          onClose={this.handleCloseDialog}
        >
          <DialogTitle>{t('common:statusConflict')}</DialogTitle>
          <DialogContent>
            {/* todo: i18n trans */}
            <Typography variant={'body2'} gutterBottom>
              The candidate has {applicationList.size} other in-progress job(s):
            </Typography>
            {applicationList.map((application) => {
              return (
                <Typography
                  key={application.get('id')}
                  variant={'body2'}
                  gutterBottom
                >
                  <Link
                    href={`/jobs/detail/${application.get('jobId')}`}
                    target="_blank"
                    rel="noopener"
                  >
                    {application.get('title')}(
                    {getJobTypeLabel(application.get('jobType'))} #
                    {application.get('jobId')})
                  </Link>
                </Typography>
              );
            })}
            <Typography variant={'body2'}>
              To avoid candidates accepting multiple offers , you can click the
              link to change the candidate’s job application status.
            </Typography>
          </DialogContent>
          <DialogActions>
            <PrimaryButton onClick={this.handleCloseDialog}>
              {t('action:confirm')}
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      );
    }
    return null;
  }
}

const mapStateToProps = (state, { start }) => {
  return {
    applicationList: getOfferListByTalent(
      state,
      start.get('talentId'),
      start.get('applicationId')
    ),
  };
};
export default connect(mapStateToProps)(CheckOfferConflict);
