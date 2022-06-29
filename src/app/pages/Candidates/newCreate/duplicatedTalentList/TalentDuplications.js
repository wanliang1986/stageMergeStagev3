import React from 'react';
import { Prompt } from 'react-router-dom';
import { Trans } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import TalentInfoCard from './TalentInfoCard';
import PrimaryButton from '../../../../components/particial/PrimaryButton';

class DuplicatedTalentList extends React.Component {
  render() {
    const { onClose, open, talentList, t } = this.props;
    console.log(talentList);
    if (!talentList) {
      return null;
    }
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <Prompt
          message={(location) => t('message:prompt') + location.pathname}
        />
        <DialogTitle id="alert-dialog-title">
          {t('message:Candidate Information Already Exist')}
        </DialogTitle>
        <DialogContent className="vertical-layout" style={{ paddingTop: 0 }}>
          <Typography variant="body2" color="textSecondary">
            <Trans i18nKey="message:xDuplicatedResult">
              we found <span>{{ number: talentList.length }}</span> candidates
            </Trans>
          </Typography>
          {talentList.map((talent) => {
            return <TalentInfoCard key={talent.id} talent={talent} />;
          })}
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={onClose}>{t('action:confirm')}</PrimaryButton>
        </DialogActions>
      </Dialog>
    );
  }
}

export default DuplicatedTalentList;
