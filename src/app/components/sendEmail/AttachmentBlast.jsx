import React from 'react';
import PropTypes from 'prop-types';
import { getSize } from '../../../utils';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Clear from '@material-ui/icons/Clear';
import AttachIcon from '@material-ui/icons/AttachFile';
import SecondaryButton from '../particial/SecondaryButton';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  fileContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    paddingLeft: 4,
    marginBottom: 3,
    marginTop: 2,
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
    position: 'relative',
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
  },
};

class Attachment extends React.PureComponent {
  render() {
    const {
      t,
      classes,
      files,
      handleChange,
      handleDelete,
      handleClick,
      loadingResume,
      uploadingAttachment,
    } = this.props;
    return (
      <React.Fragment>
        <div style={{ height: 30 }} className={'flex-container align-middle'}>
          <SecondaryButton
            className={classes.attachButton}
            size="small"
            component="label"
            onChange={handleChange}
            disabled={uploadingAttachment}
          >
            <AttachIcon
              color={uploadingAttachment ? 'disabled' : 'primary'}
              className={classes.iconLeft}
            />
            {t('common:attachments')}
            {uploadingAttachment && (
              <CircularProgress
                size={24}
                thickness={5}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: -12,
                  marginLeft: -12,
                }}
              />
            )}
            <input
              key="files"
              type="file"
              multiple
              style={{ display: 'none' }}
            />
          </SecondaryButton>
          {handleClick && (
            <span style={{ transform: 'translateX(-1.2rem)' }}>|</span>
          )}
          {handleClick && (
            <SecondaryButton
              className={classes.attachButton}
              size="small"
              disabled={loadingResume}
              onClick={handleClick}
            >
              {t('common:attachmentResume')}
            </SecondaryButton>
          )}
        </div>

        <div className="flex-container" style={{ flexWrap: 'wrap' }}>
          {files.map((file, index) => {
            return (
              <div key={index} className={'columns small-12 medium-6 large-4'}>
                <div className={classes.fileContainer}>
                  <Typography variant="caption">
                    <span title={file.name} className={classes.fileName}>
                      {file.name}
                    </span>
                  </Typography>
                  <IconButton
                    className={classes.smallIconButton}
                    onClick={() => handleDelete(file)}
                  >
                    <Clear className={classes.smallIcon} />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </div>
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
