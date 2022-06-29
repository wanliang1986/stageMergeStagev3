import React from 'react';
import { connect } from 'react-redux';
import { upsertTemplate } from '../../../actions/templateAction';
import Immutable from 'immutable';
import { showErrorMessage } from '../../../actions';
import { sendTestEmail } from '../../../actions/emailAction';

import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import FormInput from '../../../components/particial/FormInput';
import EmailEditor from '../../../components/particial/ReactEmailEditor';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import PotentialButton from '../../../components/particial/PotentialButton';
import SaveAsTemplateDialog from '../../EmailBlast/SaveAsTemplateDialog';
// import sampleData from './sample.json';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.template.get('title') || '',
      errorMessage: Immutable.Map(),
      updating: false,
      showAddTemplateDialog: false,
      sending: false,
    };
    this.lastFocused = null;
    this.value = props.template.get('template') || '';
    this.emailEditorRef = React.createRef(null);
  }

  componentDidMount() {
    console.log(this.emailEditorRef.current);
    if (this.emailEditorRef.current.editor) {
      this.onLoad();
    }
  }

  saveDesign = () => {
    const { dispatch, template } = this.props;
    this.emailEditorRef.current.editor.saveDesign((design) => {
      console.log('saveDesign', design);
      const newTemplate = {
        isRichText: true,
        title: this.state.title,
        template: JSON.stringify(design),
        type: 'Email_Merge_Contacts', //templateForm.type.value
      };
      this.setState({ updating: true });
      dispatch(upsertTemplate(newTemplate, template.get('id')))
        // .then(onClose);
        .catch((err) => dispatch(showErrorMessage(err)))
        .finally(() => this.setState({ updating: false }));
    });
  };

  exportHtml = () => {
    this.emailEditorRef.current.editor.exportHtml((data) => {
      const { html, chunks } = data;

      // console.log('exportHtml', html);
      this.setState({ showAddTemplateDialog: true, chunks });
    });
  };

  handleSendTestEmail = (e) => {
    e.preventDefault();
    this.setState({ sending: true });
    this.emailEditorRef.current.editor.exportHtml((data) => {
      const { chunks, html } = data;
      const { dispatch } = this.props;
      // console.log(html);
      dispatch(sendTestEmail(this.state.title, this.getContent(chunks)))
        .then(() => this.setState({ sending: false }))
        .catch((err) => {
          dispatch(showErrorMessage(err));
          this.setState({ sending: false });
        });
    });
  };

  onLoad = () => {
    let sample;
    try {
      sample = JSON.parse(this.props.template.get('template'));
    } catch (e) {}
    console.log(sample);

    if (this.emailEditorRef.current && sample) {
      this.emailEditorRef.current.editor.loadDesign(sample);
    }
  };

  getContent = ({ fonts, css, body }) => {
    return `<head>${
      fonts
        ? fonts
            .map(
              (font) => `<link rel="stylesheet" href="${font.url}" media="all">`
            )
            .join(' ')
        : ''
    }<style>${css}</style></head>${body}`;
  };

  render() {
    const { title, updating, sending, showAddTemplateDialog } = this.state;
    const { onClose, t, currentUser } = this.props;

    return (
      <>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6">
              {t('common:View/Edit Design')}&nbsp;
            </Typography>
            <FormInput
              name="title"
              placeholder={t('tab:title')}
              value={title}
              onChange={(e) => this.setState({ title: e.target.value })}
              style={{ margin: 0 }}
            />
            <div className="flex-child-auto" />
            <div className="horizontal-layout">
              <PrimaryButton onClick={this.saveDesign} processing={updating}>
                {t('common:Save Design')}
              </PrimaryButton>
              <PrimaryButton onClick={this.exportHtml}>
                {t('common:Export as Template')}
              </PrimaryButton>
              <PrimaryButton
                onClick={this.handleSendTestEmail}
                processing={sending}
              >
                {t('common:Send Test Email')}
              </PrimaryButton>

              <PotentialButton onClick={onClose}>
                {t('action:close')}
              </PotentialButton>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent
          className="flex-container flex-dir-column"
          style={{ padding: 0 }}
        >
          <div
            className="columns flex-child-auto flex-container"
            style={{
              height: 900,
              overflow: 'hidden',
              flex: '1 1 auto',
              marginTop: 4,
            }}
          >
            <EmailEditor
              ref={this.emailEditorRef}
              onLoad={this.onLoad}
              // projectId={1071}
              options={{
                local: 'zh-CN',
                projectId: 15663, // 15663 is our own project, other projects with full features from unlayer: 0 , 167
                user: {
                  // used for image uploads,
                  id: `apn-${currentUser.get('tenantId')}`,
                  // id: `emaily-ai-${currentUser.get('id')}`,
                  // need back end return signature
                  // signature:
                  //   '94cae6932902a309f551251b47cd1e619f16c5994783fac41afec49a07d4d9ee'
                },
                mergeTags: {
                  name: {
                    name: 'Name',
                    value: '{{name}}',
                  },
                },
                // customJS: '/customTools/customTool1.js',
              }}
              tools={{
                social: {
                  enabled: true,
                },
              }}
            />
          </div>
        </DialogContent>

        {showAddTemplateDialog && (
          <SaveAsTemplateDialog
            t={t}
            subject={this.state.subject}
            template={this.getContent(this.state.chunks)}
            handleRequestClose={() =>
              this.setState({
                showAddTemplateDialog: false,
              })
            }
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.controller.currentUser,
  };
};
export default connect(mapStateToProps)(Example);
