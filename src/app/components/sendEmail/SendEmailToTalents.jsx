import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { sendEmailToTalents } from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../particial/PrimaryButton';
import SecondaryButton from '../particial/SecondaryButton';
import RichTextEditor from './RichTextEditor';
import Attachment from './Attachment';
import EmailField from './EmailField';
import Recipient from './Recipient';

const styles = {
  root: {
    '& div.mce-edit-area': {
      marginTop: 50,
    },
  },
};

class SendEmailToTalents extends React.PureComponent {
  state = {
    bcc: this.props.emails || getEmailFromTalent(this.props.talentList),
    subject: '',
    body: ``,
    sendingEmail: false,
    files: [],
  };

  handleSendEmail = (e) => {
    const body = this.editor.getContent();
    console.log(body);

    if (!this.state.bcc) {
      return this.props.dispatch({
        type: ADD_MESSAGE,
        message: {
          message: 'To is required.',
          type: 'error',
        },
      });
    }
    if (!body) {
      return this.props.dispatch({
        type: ADD_MESSAGE,
        message: {
          message: 'Email body is empty',
          type: 'error',
        },
      });
    }
    let totalsize = 0;
    this.state.files.forEach((file) => {
      totalsize += file.size;
    });
    if (totalsize > 8388608) {
      // check attachment size
      return this.props.dispatch({
        type: ADD_MESSAGE,
        message: {
          message: 'Attached file is too big.',
          type: 'error',
        },
      });
    }
    const { subject, bcc, files } = this.state;
    //set pending state
    this.setState({
      sendingEmail: true,
    });
    this.props
      .dispatch(sendEmailToTalents(bcc, subject, body, files))
      .then((response) => {
        this.props.onClose();
      })
      .catch(() => {
        this.setState({ sendingEmail: false });
      });
  };

  attachFileHandler = (e) => {
    const fileInput = e.target;
    this.setState({
      files: this.state.files.concat(Array.from(fileInput.files)),
    });
    fileInput.value = '';
  };

  removeFileHandler = (file) => {
    const fileList = this.state.files.slice();
    fileList.splice(fileList.indexOf(file), 1);
    this.setState({ files: fileList });
  };

  handleFiledChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">
            {t('common:Email to Candidates')}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <div className="apn-item-padding flex-child-auto flex-container flex-dir-column">
            <Recipient
              value={this.state.bcc}
              name="bcc"
              handleChange={this.handleFiledChange}
              label={t('common:bcc')}
            />

            <EmailField
              value={this.state.subject}
              name="subject"
              handleChange={this.handleFiledChange}
              label={t('common:subject')}
            />

            <Attachment
              t={t}
              files={this.state.files}
              handleChange={this.attachFileHandler}
              handleDelete={this.removeFileHandler}
            />

            <RichTextEditor
              initialValue={this.state.body}
              editorRef={(editor) => (this.editor = editor)}
              // className={classes.root}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={this.props.onClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              processing={this.state.sendingEmail}
              onClick={this.handleSendEmail}
            >
              {t('action:send')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </React.Fragment>
    );
  }
}

SendEmailToTalents.propTypes = {
  onClose: PropTypes.func,
  talentList: PropTypes.instanceOf(Immutable.List).isRequired,
};

SendEmailToTalents.defaultProps = {
  onClose: () => {},
  talentList: Immutable.List(),
};

export default withStyles(styles)(SendEmailToTalents);

function getEmailFromTalent(talentList) {
  return talentList
    .filter((talent) => !!talent.get('email'))
    .map((talent) => talent.get('email'))
    .join(',');
}
