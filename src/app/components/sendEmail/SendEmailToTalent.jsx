import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { sendEmail } from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import Mustache from 'mustache';
import { tenantTemplateList } from '../../actions/templateAction';
import {
  formatUserName,
  getAgreedPayRateLabel,
  getLocationLabel,
} from '../../../utils/index';
import templateSelector from '../../selectors/templateSelector';

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

class SendEmailToTalent extends React.PureComponent {
  constructor(props) {
    super(props);
    const talentContacts = props.talent && props.talent.get('contacts');
    const talentEmails =
      talentContacts &&
      talentContacts.filter((c) => c.get('type') === CONTACT_TYPES.Email);
    this.state = {
      from: props.user.get('email'),
      to: talentEmails
        ? talentEmails.map((c) => c.get('contact')).join(',')
        : '',
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
      .then((response) => {
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
    const { job, user, talent, talentEducations, tenant, owner, application } =
      this.props;
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
    const view = {
      COMPANYNAME: job.get('companyName') || job.getIn(['company', 'name']),
      JOBTITLE: job.get('title'),
      JOBCITY: job.get('city'),
      JOBSTATE: job.get('province'),
      JOBDESCRIPTION: job.get('jdText'),
      CANDIDATEFIRSTNAME: talent.get('firstName'),
      CANDIDATELASTNAME: talent.get('lastName'),
      CANDIDATESCHOOL: talentSchool,
      CANDIDATECOMPANY: talentCompany,
      CANDIDATETITLE: talentTitle,
      CANDIDATEEMAIL: (talentEmail && talentEmail.get('contact')) || ' ',
      CANDIDATEPHONE: (talentPhone && talentPhone.get('contact')) || ' ',
      CANDIDATECITY: talentCity || ' ',
      CANDIDATESTATE: talentProvince || ' ',
      CANDIDATELOCATION: getLocationLabel(location) || ' ',
      USERFIRSTNAME: user.get('firstName') || ' ',
      USERLASTNAME: user.get('lastName') || ' ',
      JOBOWNER: formatUserName(owner),
      USEREMAIL: user.get('email'),
      USERPHONE: user.get('phone'),
      USERCOMPANY: tenant.get('name'),
      AGREEDPAYRATE: getAgreedPayRateLabel(application['agreedPayRate']),
      MONTHDURATION:
        job.get('endDate') && job.get('startDate')
          ? moment(job.get('endDate').split('T')[0])
              .add(1, 'days')
              .diff(moment(job.get('startDate').split('T')[0]), 'months')
          : null,
    };
    const body = Mustache.render(selectedTemplate.get('template') || '', view);
    this.setState({
      selectedTemplate,
      subject: Mustache.render(selectedTemplate.get('subject') || '', view),
    });
    this.editor.setContent(body);
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
    const { t, templateList, talent } = this.props;
    const toName = formatUserName(talent) || talent.get('fullName');
    console.log('email loaded!!!');
    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">
            {t('common:Send Email to Candidate')} <b>{toName}</b>
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

SendEmailToTalent.propTypes = {
  onClose: PropTypes.func,
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
};

SendEmailToTalent.defaultProps = {
  application: {},
};

function mapStoreStateToProps(
  state,
  { application: { talentId, jobId, resumeId } }
) {
  const job = state.model.jobs.get(String(jobId));
  const user = state.controller.currentUser;
  return {
    templateList: templateSelector(state, 'Activities_Candidate_Interview'),
    user,
    tenant: state.model.tenants.get(String(user.get('tenantId'))),
    talent: state.model.talents.get(String(talentId)),
    job,
    resume: state.model.talentResumes.get(String(resumeId)),
  };
}

export default connect(mapStoreStateToProps)(SendEmailToTalent);
