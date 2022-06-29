import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { sendEmailToAM } from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import Mustache from 'mustache';
import { tenantTemplateList } from '../../actions/templateAction';
import templateSelector from '../../selectors/templateSelector';
import { getResume } from '../../../apn-sdk';
import { getAgreedPayRateLabel } from '../../../utils';

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
    this.state = {
      to: (props.am && props.am.get('email')) || '',
      cc: props.user.get('email') || '',
      subject: '',
      body: props.body || '',
      files: [],
      selectedTemplate: '',

      sendingEmail: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { dispatch } = this.props;
    dispatch(tenantTemplateList());
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
    const { to, subject, cc, files } = this.state;
    //set pending state
    this.setState({
      sendingEmail: true,
    });
    this.props
      .dispatch(sendEmailToAM(to, cc, subject, body, files))
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
    const { job, user, talent, am, application } = this.props;
    const talentContacts = talent.get('contacts');
    const talentEmail =
      talentContacts &&
      talentContacts.find((c) => c.get('type') === CONTACT_TYPES.Email);
    const talentPhone =
      talentContacts &&
      talentContacts.find((c) => c.get('type') === CONTACT_TYPES.Phone);
    const talentSchool = talent.getIn(['educations', 0, 'collegeName']) || ' ';
    const talentCompany = talent.getIn(['experiences', 0, 'company']) || ' ';
    const talentTitle = talent.getIn(['experiences', 0, 'title']) || ' ';
    const location =
      talent.get('currentLocation') || talent.getIn(['preferredLocations', 0]);

    const talentCity = location
      ? location.get('city') ||
        location.get('location') ||
        location.get('addressLine')
      : ' ';
    const talentProvince = location
      ? location.get('province') ||
        location.get('location') ||
        location.get('addressLine')
      : ' ';
    // console.log(job.toJS());
    const view = {
      COMPANYNAME: job.get('companyName') || job.getIn(['company', 'name']),
      JOBTITLE: job.get('title'),
      JOBID: job.get('id'),
      JOBCODE: job.get('code'),
      JOBLINK: `${window.location.origin}/jobs/detail/${job.get('id')}`,
      CANDIDATEFIRSTNAME: talent.get('firstName'),
      CANDIDATELASTNAME: talent.get('lastName'),
      CANDIDATEEMAIL: (talentEmail && talentEmail.get('contact')) || ' ',
      CANDIDATEPHONE: (talentPhone && talentPhone.get('contact')) || ' ',
      CANDIDATESCHOOL: talentSchool,
      CANDIDATECOMPANY: talentCompany,
      CANDIDATETITLE: talentTitle,
      CANDIDATECITY: talentCity,
      CANDIDATESTATE: talentProvince,
      USERFIRSTNAME: user.get('firstName') || ' ',
      USERLASTNAME: user.get('lastName') || ' ',
      JOBOWNER: am.get('fullName'),
      AGREEDPAYRATE: getAgreedPayRateLabel(application['agreedPayRate']),
      MONTHDURATION:
        job.get('endDate') && job.get('startDate')
          ? moment(job.get('endDate')).diff(
              moment(job.get('startDate')),
              'months'
            )
          : null,
    };
    const body = Mustache.render(selectedTemplate.get('template') || '', view);
    // const body = selectedTemplate.get('template') || '';
    this.setState({
      selectedTemplate,
      subject: Mustache.render(selectedTemplate.get('subject') || '', view),
    });
    this.editor.setContent(body);
  };

  attachSelectedResume = () => {
    this.setState({ loadingResume: true });
    getResume(this.props.resume).then((resumeFile) => {
      const fileList = this.state.files.slice();
      fileList.push(resumeFile);
      this.setState({ files: fileList, loadingResume: false });
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
    const { t, templateList, am } = this.props;

    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">
            {t('common:Send Email to')} <b>{am ? am.get('fullName') : ''}</b>
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
              loadingResume={this.state.loadingResume}
            />

            <RichTextEditor
              initialValue={this.state.body}
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
              {t('action:send') /*t('action:add')*/}
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
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
  application: PropTypes.object.isRequired,
};

function mapStoreStateToProps(
  state,
  { application: { talentId, jobId, resumeId, applicationCommissions, memo } }
) {
  const job = state.model.jobs.get(String(jobId));
  const am = applicationCommissions.find((c) => c.userRole === 'AM');
  return {
    templateList: templateSelector(
      state,
      'Activities_Candidate_Internal_Submittal'
    ),
    user: state.controller.currentUser,
    talent: state.model.talents.get(String(talentId)),
    job,
    resume: state.model.talentResumes.get(String(resumeId)),
    am: am && state.model.users.get(String(am.userId)),
    body: `<p>${(memo || '')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .split('\n')
      .join('</p><p>')}</p>`,
  };
}

export default connect(mapStoreStateToProps)(SendEmail);
