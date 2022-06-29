import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { sendEmailToJobUsers } from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import { addJobNote } from '../../actions/jobActions';

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

class SendEmail extends React.PureComponent {
  constructor(props) {
    super(props);
    const { job, userRelationList } = props;
    const { subject, body } = this._getInitialContent(job);
    const to = userRelationList.map((user) => user.get('email')).join(',');
    this.state = {
      to,
      subject,
      body,
      sendingEmail: false,
      files: [],
    };
  }

  handleSendEmail = (e) => {
    const body = this.editor.getContent();
    console.log(body);

    if (!this.state.to) {
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
    const { subject, to, files } = this.state;
    //set pending state
    this.setState({
      sendingEmail: true,
    });
    this.props
      .dispatch(sendEmailToJobUsers(to, subject, body, files))
      .then(() => {
        let jobId = this.props.job.get('id');

        //compose the plain text from the body html
        let temp = document.createElement('div');
        temp.innerHTML = body;
        let text = temp.textContent || temp.innerText || '';

        let note = {
          title: subject,
          note: text.substr(0, 500),
          priority: 'NORMAL',
          jobId,
        };
        this.props.dispatch(addJobNote(note, jobId));
      })
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

  _getInitialContent(job) {
    const jobCode = job
      ? `<a href="${
          window.location.origin + '/jobs/detail/' + job.get('id')
        }">${job.get('code') || job.get('id')}</a>`
      : '';
    const jobTitle = job ? job.get('title') : '';
    const body = `<p><strong>Regarding Job #</strong>${jobCode}</p>
            <p><strong>Job Title:</strong> ${jobTitle}</p>`;
    const subject =
      'Job # ' +
      (job
        ? (job.get('code') || job.get('id')) + ' (' + job.get('title') + ')'
        : '');
    return {
      body,
      subject,
    };
  }

  handleFiledChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { t } = this.props;
    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">{t('common:Email to Users')}</Typography>
        </DialogTitle>
        <DialogContent>
          <div className="apn-item-padding flex-child-auto flex-container flex-dir-column">
            <Recipient
              value={this.state.to}
              name="to"
              handleChange={this.handleFiledChange}
              label={t('common:to')}
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
              onChange={this.handleEditorChange}
              editorRef={(editor) => (this.editor = editor)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout align-middle">
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

SendEmail.propTypes = {
  t: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  userRelationList: PropTypes.instanceOf(Immutable.List).isRequired,
  job: PropTypes.instanceOf(Immutable.Map).isRequired,
};

export default SendEmail;
