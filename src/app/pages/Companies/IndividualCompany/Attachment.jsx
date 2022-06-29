import React from 'react';
import PropTypes from 'prop-types';
import { getSize } from '../../../../utils';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Clear from '@material-ui/icons/Clear';
import AttachIcon from '@material-ui/icons/AttachFile';
import SecondaryButton from '../../../components/particial/SecondaryButton';

const styles = {
  fileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    paddingLeft: '4px',
    marginBottom: 3,
    marginTop: '10px',
    '&>:first-child': {
      overflow: 'hidden',
      display: 'flex',
      flex: '1 1 auto',
    },
  },
  fileName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 300,
    marginRight: 4,
    whiteSpace: 'nowrap',
  },
  iconLeft: {
    marginLeft: -8,
    marginRight: 8,
  },
  smallIcon: {
    fontSize: 20,
  },
  smallIconButton: {
    padding: 4,
  },

  attachButton: {
    transform: 'scale(.75)',
    fontSize: 18,
    transformOrigin: '0',
    paddingLeft: '0px',
  },
};

class Attachment extends React.PureComponent {
  render() {
    const {
      t,
      classes,
      file,
      handleChange,
      handleDelete,
      uploading,
    } = this.props;
    // console.log('attach', file);
    return (
      <React.Fragment>
        {!file && (
          <div
            style={{ height: 33, marginTop: -6, paddingLeft: '4px' }}
            className={'flex-container align-middle'}
          >
            <SecondaryButton
              className={classes.attachButton}
              size="small"
              component="label"
              onChange={handleChange}
            >
              <AttachIcon color="primary" className={classes.iconLeft} />
              {t('common:attachment')}
              <input
                key="files"
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
              />
            </SecondaryButton>
          </div>
        )}

        {file && (
          <div
            className="flex-container"
            style={{ flexWrap: 'wrap', marginTop: -6 }}
          >
            <div className={'columns'} style={{ paddingLeft: 0 }}>
              <div className={classes.fileContainer}>
                <Typography variant="caption">
                  <span title={file.name} className={classes.fileName}>
                    {file.name}
                  </span>
                  ({getSize(file.size, 0)})
                </Typography>
                <div className="flex-container align-middle">
                  {uploading && (
                    <Typography variant="caption">uploading...</Typography>
                  )}
                  <IconButton
                    className={classes.smallIconButton}
                    onClick={() => handleDelete(file)}
                  >
                    <Clear className={classes.smallIcon} />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

Attachment.propTypes = {
  t: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default withStyles(styles)(Attachment);
