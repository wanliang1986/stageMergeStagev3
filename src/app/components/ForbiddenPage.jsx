import React from 'react';
import { withTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';

function ForbiddenPage({ t }) {
  return (
    <div className="flex-child-auto container-padding">
      <Typography variant="h5">
        {t('message:notAuthorizedToViewCurrentPage')}
      </Typography>
    </div>
  );
}

export default withTranslation(['message'])(ForbiddenPage);
