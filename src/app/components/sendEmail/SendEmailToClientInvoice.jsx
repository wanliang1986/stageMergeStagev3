import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { sendEmail } from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import { tenantTemplateList } from '../../actions/templateAction';
import { getClientContact } from '../../actions/clientActions';

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
import templateSelector from '../../selectors/templateSelector';
import MenuItem from '@material-ui/core/MenuItem';
import Mustache from 'mustache';

class SendEmail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      from: props.user.get('email'),
      to: (props.client && props.client.get('email')) || '',
      cc: props.user.get('email') || '',
      subject: '',
      body: '',
      sendingEmail: false,
      files: props.invoiceFile ? [props.invoiceFile] : [],
      selectedTemplate: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS
  ): void {
    if (this.props.client && !this.props.client.equals(prevProps.client)) {
      this.setState({
        to: (this.props.client && this.props.client.get('email')) || '',
      });
    }
  }

  fetchData() {
    const { dispatch, invoice } = this.props;
    dispatch(tenantTemplateList());
    dispatch(getClientContact(invoice.get('clientContactId')));
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
    const { user, invoice } = this.props;
    const view = {
      COMPANYNAME: invoice.get('customerName'),
      JOBTITLE: invoice.get('jobTitle'),
      CANDIDATEFULLNAME: invoice.get('talentName'),
      USERFIRSTNAME: user.get('firstName') || ' ',
      USERLASTNAME: user.get('lastName') || ' ',
    };
    const body = Mustache.render(selectedTemplate.get('template') || '', view);
    this.setState({
      selectedTemplate,
      subject:
        Mustache.render(selectedTemplate.get('subject') || '', view) ||
        this.state.subject,
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
    const { t, invoice, templateList } = this.props;
    if (!invoice) {
      return null;
    }
    // console.log(invoiceFile);
    return (
      <React.Fragment>
        <DialogTitle disableTypography>
          <Typography variant="h5">{t('common:Send Invoice')}</Typography>
        </DialogTitle>
        <DialogContent className="flex-container">
          <div className="flex-child-auto flex-container flex-dir-column">
            {templateList.size > 0 && (
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
            )}

            {/*todo refine async load options*/}
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
  invoice: PropTypes.instanceOf(Immutable.Map).isRequired,
  // templateList: PropTypes.instanceOf(Immutable.List).isRequired,
};

function mapStoreStateToProps(state, { invoice }) {
  const clientContactId = invoice.get('clientContactId');
  return {
    templateList: templateSelector(state, 'Invoice_Email'),
    user: state.controller.currentUser,
    client: clientContactId && state.model.clients.get(String(clientContactId)),
  };
}

export default connect(mapStoreStateToProps)(SendEmail);
