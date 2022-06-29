import React, { Fragment } from 'react';
import Paper from '@material-ui/core/Paper';
import PrimaryButton from '../../particial/PrimaryButton';

import ResumeFrame from '../../particial/ResumeFrame/LoadableResumeFrame';
import DialogActions from '@material-ui/core/DialogActions';
const ViewResumeInAddActivity = (props) => {
  const { t, close, resume } = props;
  return (
    <Paper
      style={{
        // maxHeight: 'calc(100% - 64px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <div className="flex-child-auto" style={{ height: 600 }}>
        <ResumeFrame resume={resume} />
      </div>

      <div className="container-padding">
        <PrimaryButton onClick={close}>{t('action:back')}</PrimaryButton>
      </div>
    </Paper>
  );
};

export default ViewResumeInAddActivity;
