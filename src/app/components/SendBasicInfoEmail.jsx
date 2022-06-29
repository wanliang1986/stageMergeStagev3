import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import AttachmentIcon from '@material-ui/icons/Attachment';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Clear from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Mustache from 'mustache';
import Recipient from '../../app/components/sendEmail/Recipient';
import EmailField from '../../app/components/sendEmail/EmailField';
import RichTextEditor from '../../app/components/sendEmail/RichTextEditor';
import FormReactSelectContainer from '../../app/components/particial/FormReactSelectContainer';
import SecondaryButton from '../../app/components/particial/SecondaryButton';
import Loading from './particial/Loading';
import PrimaryButton from '../components/particial/PrimaryButton';

import { cloneDeep } from 'lodash';
import { CONTACT_TYPES } from '../constants/formOptions';
import { formatUserName, getAgreedPayRateLabel } from '../../utils/index';
const styles = (theme) => ({
  warp: {
    '& .MuiDialog-paperWidthSm': {
      maxWidth: '1000px',
    },
    '& .MuiInputBase-input': {
      height: '22px',
    },
  },
  formControl: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: '10px',
  },
  label: {
    marginRight: 10,
    fontSize: 13,
    minWidth: 65,
    fontWeight: 500,
    textAlign: 'right',
  },
  textField: {
    fontSize: 14,
    border: '1px solid #cacaca',
    paddingLeft: 8,
    transition: 'box-shadow 0.5s, border-color 0.25s ease-in-out',
    '&:focus': {
      borderColor: '#8a8a8a',
      boxShadow: '0 0 5px #cacaca',
      background: 'transparent',
    },
  },
  textField: {
    fontSize: 14,
    border: '1px solid #cacaca',
    paddingLeft: 8,
    transition: 'box-shadow 0.5s, border-color 0.25s ease-in-out',
    '&:focus': {
      borderColor: '#8a8a8a',
      boxShadow: '0 0 5px #cacaca',
      background: 'transparent',
    },
  },
  attachButton: {
    transform: 'scale(.75)',
    fontSize: 18,
    transformOrigin: '0',
  },
  iconLeft: {
    marginLeft: -8,
    marginRight: 8,
    position: 'relative',
  },
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
  smallIcon: {
    fontSize: 20,
  },
  smallIconButton: {
    padding: 4,
  },
});

class SendBasicInfoEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendingEmail: false,
      files: [],
      options: [],
      templatesValue: '',
      addressValue: '',
      subjectValue: '',
      body: '',
      ccStatus: false,
      bccStatus: false,
      ccValue: '',
      ccOption: [],
      bccValue: '',
      bccOption: [],
      pending: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      addressValue: nextProps.emailObj.to,
      options: [
        {
          value: nextProps.emailObj.to,
          label: nextProps.emailObj.to,
          className: 'Select-create-option-placeholder',
        },
      ],
      // subjectValue: nextProps.emailObj.subject,
      body: nextProps.emailObj.htmlContents,
    });
  }
  _getInitialContent() {
    const { emailObj } = this.props;
    let me = this;
    this.setState({
      addressValue: emailObj.to,
      options: [
        {
          value: emailObj.to,
          label: emailObj.to,
          className: 'Select-create-option-placeholder',
        },
      ],
      subjectValue: emailObj.subject,
      body: emailObj.htmlContents,
    });
  }

  componentDidMount() {
    this._getInitialContent();
  }

  // To中的change事件
  handleChange(v) {
    this.setState({
      addressValue: v,
    });
  }
  // CC中的change事件
  handleccValueChange(v) {
    this.setState({
      ccValue: v,
    });
  }
  // BCC的change事件
  handlebccValueChange(v) {
    this.setState({
      bccValue: v,
    });
  }
  // Templates的change事件
  handleTemplatesChange(val) {
    const { emailObj } = this.props;
    const { prevSelectTemplate } = this.state;
    let selectTemplateList = emailObj.templatesOptions.filter((item) => {
      return item.id == val;
    });
    let subject =
      selectTemplateList.length > 0 && selectTemplateList[0].subject;
    let selectTemplate =
      selectTemplateList.length > 0 && selectTemplateList[0].template;
    let selectHtml = this.getSelectHtml(selectTemplate);
    let subjectHtml = this.getSelectHtml(subject);
    let body = cloneDeep(this.state.body);
    let html = '';
    if (prevSelectTemplate == selectHtml) {
      return;
    } else {
      body = body.replace(selectHtml, '');
      html = selectHtml + body;
    }
    this.setState({
      subjectValue: subjectHtml,
      body: html,
      prevSelectTemplate: selectTemplate,
      templatesValue: val,
    });
  }

  //模板转换
  getSelectHtml = (template) => {
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
    const view = {
      COMPANYNAME: job.get('companyName') || job.getIn(['company', 'name']),
      JOBTITLE: job.get('title'),
      JOBID: job.get('id'),
      JOBCODE: job.get('code'),
      JOBLINK: `${window.location.origin}/jobs/detail/${job.get('id')}`,
      JOBCITY: job.get('city'),
      JOBSTATE: job.get('province'),
      JOBDESCRIPTION: job.get('jdText'),
      CANDIDATEFULLNAME: talent.get('fullName'),
      CANDIDATEFIRSTNAME: talent.get('firstName'),
      CANDIDATELASTNAME: talent.get('lastName'),
      CANDIDATESCHOOL: talentSchool,
      CANDIDATECOMPANY: talentCompany,
      CANDIDATETITLE: talentTitle,
      CANDIDATEEMAIL: (talentEmail && talentEmail.get('contact')) || ' ',
      CANDIDATEPHONE: (talentPhone && talentPhone.get('contact')) || ' ',
      CANDIDATECITY: talentCity,
      CANDIDATESTATE: talentProvince,
      USERFIRSTNAME: user.get('firstName') || ' ',
      USERLASTNAME: user.get('lastName') || ' ',
      JOBOWNER: owner.get('fullName'),
      USEREMAIL: user.get('email'),
      USERPHONE: user.get('phone'),
      USERCOMPANY: tenant.get('name'),
      AGREEDPAYRATE: getAgreedPayRateLabel(application['agreedPayRate']),
      MONTHDURATION:
        job.get('endDate') && job.get('startDate')
          ? moment(job.get('endDate')).diff(
              moment(job.get('startDate')),
              'months'
            )
          : null,
    };
    const body = Mustache.render(template || '', view);
    return body;
  };

  // subject的change事件
  handlesubjectValueChange(val) {
    this.setState({
      subjectValue: val.target.value,
    });
  }
  // 上传附件
  handleFilesChange(e) {
    const fileInput = e.target;
    console.log(Array.from(fileInput.files));

    this.setState(
      {
        files: this.state.files.concat(Array.from(fileInput.files)),
      },
      () => {
        console.log('state', this.state);
      }
    );
  }
  // 删除当前上传的附件
  handleDelete(file) {
    const fileList = this.state.files.slice();
    fileList.splice(fileList.indexOf(file), 1);
    this.setState({ files: fileList });
  }
  // 点击CC
  handleCC() {
    this.setState({
      ccStatus: true,
    });
  }
  // 点击BCC
  handleBCC() {
    this.setState({
      bccStatus: true,
    });
  }
  // 点击发送邮件
  SendEmail() {
    const { getSendEmail } = this.props;
    const body = this.editor.getContent();
    let objData = {
      Tovalue: this.state.addressValue || null,
      ccValue: this.state.ccValue || null,
      bccValue: this.state.bccValue || null,
      subjectValue: this.state.subjectValue || null,
      body: body,
      files: this.state.files || [],
    };
    getSendEmail(objData);
  }

  handleEditorChange = (e) => {
    let html = e.level.content;
    this.setState({
      body: html,
    });
  };
  render() {
    const { classes, emailObj, getShutDown, templatesOptions, talent } =
      this.props;
    const {
      templatesValue,
      addressValue,
      subjectValue,
      ccStatus,
      bccStatus,
      ccValue,
      bccValue,
    } = this.state;
    return (
      <Dialog className={classes.warp} open={true}>
        <div>
          <React.Fragment>
            <DialogTitle disableTypography id="draggable-dialog-title">
              <Typography variant="h5">{`${emailObj.title} ${
                talent && talent.get('fullName')
              }`}</Typography>
            </DialogTitle>

            <DialogContent>
              <div className="apn-item-padding flex-child-auto flex-container flex-dir-column">
                <FormControl className={classes.formControl}>
                  <label className={classes.label} htmlFor={''}>
                    To
                  </label>
                  <div className="flex-child-auto">
                    <Select.Creatable
                      value={addressValue}
                      options={this.state.options}
                      multi
                      simpleValue
                      onChange={(v) => this.handleChange(v)}
                      // promptTextCreator={label => null}
                      promptTextCreator={(label) => `add "${label}"`}
                      noResultsText={false}
                      placeholder={'Please Enter Email Address'}
                      arrowRenderer={null}
                      tabSelectsValue={false}
                    />
                  </div>
                  {!ccStatus && (
                    <div
                      style={{
                        borderRadius: '4px',
                        marginLeft: '10px',
                        backgroundColor: '#3398dc',
                        width: '45px',
                        height: '37px',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'white',
                      }}
                      onClick={() => this.handleCC()}
                    >
                      CC
                    </div>
                  )}

                  {!bccStatus && (
                    <div
                      style={{
                        borderRadius: '4px',
                        marginLeft: '10px',
                        backgroundColor: '#3398dc',
                        width: '45px',
                        height: '37px',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'white',
                      }}
                      onClick={() => this.handleBCC()}
                    >
                      BCC
                    </div>
                  )}
                </FormControl>
                {ccStatus && (
                  <FormControl className={classes.formControl}>
                    <label className={classes.label} htmlFor={''}>
                      CC
                    </label>
                    <div className="flex-child-auto">
                      <Select.Creatable
                        value={ccValue}
                        options={this.state.ccOption}
                        multi
                        simpleValue
                        onChange={(v) => this.handleccValueChange(v)}
                        // promptTextCreator={label => null}
                        promptTextCreator={(label) => `add "${label}"`}
                        noResultsText={false}
                        placeholder={'Please Enter Email Address'}
                        arrowRenderer={null}
                        tabSelectsValue={false}
                      />
                    </div>
                  </FormControl>
                )}
                {bccStatus && (
                  <FormControl className={classes.formControl}>
                    <label className={classes.label} htmlFor={''}>
                      BCC
                    </label>
                    <div className="flex-child-auto">
                      <Select.Creatable
                        value={bccValue}
                        options={this.state.bccOption}
                        multi
                        simpleValue
                        onChange={(v) => this.handlebccValueChange(v)}
                        // promptTextCreator={label => null}
                        promptTextCreator={(label) => `add "${label}"`}
                        noResultsText={false}
                        placeholder={'Please Enter Email Address'}
                        arrowRenderer={null}
                        tabSelectsValue={false}
                      />
                    </div>
                  </FormControl>
                )}
                <FormControl className={classes.formControl}>
                  <label className={classes.label} htmlFor={''}>
                    Templates
                  </label>
                  <div className="flex-child-auto">
                    <Select
                      name="Templates"
                      value={templatesValue}
                      onChange={(val) => {
                        this.handleTemplatesChange(val);
                      }}
                      valueKey={'id'}
                      labelKey={'title'}
                      simpleValue
                      options={emailObj.templatesOptions}
                      searchable
                      clearable={false}
                      autoBlur={true}
                      placeholder="Please select"
                    />
                  </div>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <label className={classes.label} htmlFor={''}>
                    Subject
                  </label>
                  <div className="flex-child-auto">
                    <Input
                      value={subjectValue}
                      onChange={(val) => this.handlesubjectValueChange(val)}
                      classes={{ input: classes.textField }}
                      className={classes.textFieldContainer}
                      fullWidth
                      disableUnderline
                      placeholder={'Please Enter Subject'}
                    />
                  </div>
                  <div
                    style={{
                      borderRadius: '4px',
                      marginLeft: '10px',
                      backgroundColor: '#3398dc',
                      width: '45px',
                      height: '37px',
                      textAlign: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      top: '9px',
                      cursor: 'pointer',
                    }}
                  >
                    <SecondaryButton
                      className={classes.attachButton}
                      size="small"
                      component="label"
                      onChange={(e) => this.handleFilesChange(e)}
                    >
                      <AttachmentIcon
                        style={{
                          color: 'white',
                          position: 'relative',
                          left: '10px',
                          fontSize: '30px',
                        }}
                      />

                      <input
                        key="files"
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                      />
                    </SecondaryButton>
                  </div>
                </FormControl>
                <div className="flex-container" style={{ flexWrap: 'wrap' }}>
                  {this.state.files.map((file, index) => {
                    return (
                      <div
                        key={index}
                        className={'columns small-12 medium-6 large-4'}
                      >
                        <div className={classes.fileContainer}>
                          <Typography variant="caption">
                            <span
                              title={file.name}
                              className={classes.fileName}
                            >
                              {file.name}
                            </span>
                          </Typography>
                          <IconButton
                            className={classes.smallIconButton}
                            onClick={() => this.handleDelete(file)}
                          >
                            <Clear className={classes.smallIcon} />
                          </IconButton>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <RichTextEditor
                  initialValue={this.state.body}
                  onChange={this.handleEditorChange}
                  editorRef={(editor) => (this.editor = editor)}
                />
              </div>
              <div
                style={{
                  marginTop: '15px',
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {/* <span
                  style={{
                    width: '107px',
                    height: '33px',
                    lineHeight: '33px',
                    borderRadius: '4px',
                    border: 'solid 1px #3398dc',
                    display: 'inline-block',
                    textAlign: 'center',
                    color: '#3398dc',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => getShutDown(false)}
                >
                  Cancel
                </span> */}
                <div style={{ marginRight: '8px' }}>
                  <PrimaryButton
                    style={{
                      background: 'white',
                      color: '#3398dc',
                      border: 'solid 1px #3398dc',
                    }}
                    type="submit"
                    fullWidth
                    onClick={() => getShutDown(false)}
                  >
                    Cancel
                  </PrimaryButton>
                </div>
                <div>
                  <PrimaryButton
                    style={{
                      border: 'solid 1px #3398dc',
                    }}
                    processing={this.props.emailObj.pending}
                    type="submit"
                    fullWidth
                    onClick={() => this.SendEmail()}
                  >
                    Send Email
                  </PrimaryButton>
                </div>
                {/* <span
                  style={{
                    width: '107px',
                    height: '33px',
                    lineHeight: '33px',
                    borderRadius: '4px',
                    border: 'solid 1px #3398dc',
                    display: 'inline-block',
                    textAlign: 'center',
                    color: '#fff',
                    background: '#3398dc',
                    cursor: 'pointer',
                  }}
                  onClick={() => this.SendEmail()}
                >
                  Send Email
                </span> */}
              </div>
            </DialogContent>
          </React.Fragment>
        </div>
      </Dialog>
    );
  }
}
function mapStoreStateToProps(state, { application }) {
  const talentId = application.get('talentId');
  const jobId = application.get('jobId');
  const resumeId = application.get('resumeId');

  const job = state.model.jobs.get(String(jobId));
  const user = state.controller.currentUser;
  let applicationCommissions = application.get('applicationCommissions').toJS();
  const ower = applicationCommissions.find((c) => c.userRole === 'AM');
  const users = state.model.users;
  const owner = ower && users.get(String(ower.userId));
  return {
    user,
    owner: owner,
    tenant: state.model.tenants.get(String(user.get('tenantId'))),
    talent: state.model.talents.get(String(talentId)),
    job,
    talentId,
    jobId,
    resumeId,
    resume: state.model.talentResumes.get(String(resumeId)),
  };
}
export default connect(mapStoreStateToProps)(
  withStyles(styles)(SendBasicInfoEmail)
);
