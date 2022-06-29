import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { sendEmail } from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import Mustache from 'mustache';
import { tenantTemplateList } from '../../actions/templateAction';
import templateSelector from '../../selectors/templateSelector';
import { getResume } from '../../../apn-sdk';
import { getAgreedPayRateLabel, getLocationLabel } from '../../../utils';

import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../particial/PrimaryButton';
import SecondaryButton from '../particial/SecondaryButton';
import RichTextEditor from './RichTextEditor';
import Attachment from './Attachment';
import EmailField from './EmailField';
import Recipient from './Recipient';
import { CONTACT_TYPES } from '../../constants/formOptions';
import moment from 'moment-timezone';

class SendEmail extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    console.log(props.hiringManager);
    this.state = {
      from: props.user.get('email'),
      // to: (props.hiringManager && props.hiringManager.get('email')) || '',
      to:
        (props.application && props.application.job.clientContactEmails) || '',
      cc: props.user.get('email') || '',
      bcc: '',
      subject: '',
      body: '',
      sendingEmail: false,
      files: [],
      selectedTemplate: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.dispatch(tenantTemplateList());
  }

  handleSendEmail = (e) => {
    const body = this.editor.getContent();
    // console.log(body);
    if (this.state.sendingEmail) {
      return;
    }

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
    const { from, to, subject, cc, bcc, files } = this.state;
    //set pending state
    this.setState({
      sendingEmail: true,
    });
    this.props
      .dispatch(sendEmail(from, to, cc, bcc, subject, body, files))
      .then(() => {
        this.props.onClose();
      })
      .catch(() => {
        this.setState({ sendingEmail: false });
      });
  };

  handleTemplateChange = (key, selectedTemplate) => {
    if (!selectedTemplate) {
      return this.setState({
        selectedTemplate,
      });
    }
    const { job, user, talent, application } = this.props;
    const talentEmail = talent
      .get('contacts')
      .find((c) => c.get('type') === CONTACT_TYPES.Email);
    const talentPhone = talent
      .get('contacts')
      .find((c) => c.get('type') === CONTACT_TYPES.Phone);
    const talentSchool = talent.getIn(['educations', 0, 'collegeName']) || ' ';
    const talentCompany = talent.getIn(['experiences', 0, 'company']) || ' ';
    const talentTitle = talent.getIn(['experiences', 0, 'title']) || ' ';
    const location = talent.get('currentLocation');
    const talentCity = location && location.get('city');
    const talentProvince = location && location.get('province');
    const talentLocation = getLocationLabel(location);
    const view = {
      COMPANYNAME: job.get('companyName') || job.getIn(['company', 'name']),
      JOBTITLE: job.get('title'),
      CANDIDATEFIRSTNAME: talent.get('firstName'),
      CANDIDATELASTNAME: talent.get('lastName'),
      CANDIDATEEMAIL: (talentEmail && talentEmail.get('contact')) || ' ',
      CANDIDATEPHONE: (talentPhone && talentPhone.get('contact')) || ' ',
      CANDIDATESCHOOL: talentSchool,
      CANDIDATECOMPANY: talentCompany,
      CANDIDATETITLE: talentTitle,
      CANDIDATECITY: talentCity || ' ',
      CANDIDATESTATE: talentProvince || ' ',
      CANDIDATELOCATION: talentLocation || ' ',
      USERFIRSTNAME: user.get('firstName') || ' ',
      USERLASTNAME: user.get('lastName') || ' ',
      AGREEDPAYRATE: getAgreedPayRateLabel(application['agreedPayRate']),
      MONTHDURATION:
        job.get('endDate') && job.get('startDate')
          ? moment(job.get('endDate').split('T')[0])
              .add(1, 'days')
              .diff(moment(job.get('startDate').split('T')[0]), 'months')
          : null,
      // JOBOWNER: formatUserName(owner)
    };
    const body = Mustache.render(selectedTemplate.get('template') || '', view);
    this.setState({
      selectedTemplate,
      subject: Mustache.render(selectedTemplate.get('subject') || '', view),
    });
    this.editor.setContent(body);
  };

  attachSelectedResume = () => {
    getResume(this.props.resume).then((resumeFile) => {
      const fileList = this.state.files.slice();
      fileList.push(resumeFile);
      this.setState({ files: fileList });
    });
  };

  attachFileHandler = (e) => {
    const fileInput = e.target;
    console.log(fileInput.value);
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
    const { t, templateList, hiringManager } = this.props;
    const toName = hiringManager && hiringManager.get('name');

    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">
            {t('common:send email to client contact')} <b>{toName}</b>
          </Typography>
        </DialogTitle>

        <DialogContent>
          <div className="apn-item-padding flex-child-auto flex-container flex-dir-column">
            <EmailField
              value={this.state.selectedTemplate}
              name="selectedTemplate"
              handleChange={this.handleTemplateChange}
              label={t('common:templates')}
              placeholder={t('message:select')}
              select
            >
              {templateList.map((template) => (
                <MenuItem key={template.get('id')} value={template}>
                  {template.get('title')}
                </MenuItem>
              ))}
            </EmailField>

            <Recipient
              value={this.state.to}
              name="to"
              handleChange={this.handleFiledChange}
              label={t('common:to')}
            />

            <Recipient
              value={this.state.cc}
              name="cc"
              handleChange={this.handleFiledChange}
              label={t('common:cc')}
            />

            {/*<Recipient*/}
            {/*  value={this.state.bcc}*/}
            {/*  name="bcc"*/}
            {/*  handleChange={this.handleFiledChange}*/}
            {/*  label={t('common:bcc')}*/}
            {/*/>*/}

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
              handleClick={this.attachSelectedResume}
            />

            <RichTextEditor
              initialValue=""
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
  onClose: PropTypes.func,
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
  application: PropTypes.object.isRequired,
};

function mapStoreStateToProps(
  state,
  { application: { talentId, jobId, resumeId } }
) {
  const job = state.model.jobs.get(String(jobId));
  const hiringManager = state.model.clients.get(
    String(job.get('hiringManagerId'))
  );
  return {
    templateList: templateSelector(state, 'Activities_Contact_Interview'),
    user: state.controller.currentUser,
    talent: state.model.talents.get(String(talentId)),
    job,
    resume: state.model.talentResumes.get(String(resumeId)),
    hiringManager,
  };
}

export default connect(mapStoreStateToProps)(SendEmail);
