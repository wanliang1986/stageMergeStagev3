import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Immutable from 'immutable';
import emailBlastSelector from '../../selectors/emailBlastSelector';
import Portal from '@material-ui/core/Portal';
import { uploadAttachment } from '../../../apn-sdk/email';
import {
  sendEmailByList,
  // getMyEmailBlastList
} from '../../actions/emailAction';
import { ADD_MESSAGE } from '../../constants/actionTypes';
import { withStyles } from '@material-ui/core';
import dateFns from 'date-fns';

import { DatePicker } from 'rsuite';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import MuiSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

import PrimaryButton from '../particial/PrimaryButton';
import SecondaryButton from '../particial/SecondaryButton';
import RichTextEditor from './RichTextEditor';
import Attachment from './AttachmentBlast';
// import EmailField from './EmailField';

import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import FormInput from '../../components/particial/FormInput';
import templateSelector from '../../selectors/templateSelector';

import { tenantTemplateList } from '../../actions/templateAction';
import { upsertDraft } from '../../actions/emailAction';
import SaveAsTemplateDialog from '../../pages/EmailBlast/SaveAsTemplateDialog';
import { deleteDraft } from '../../actions/emailAction';
import Dialog from '@material-ui/core/Dialog';

const styles = (theme) => ({
  editor: {
    '& div.mce-edit-area': {
      marginTop: 40,
      position: 'relative',
    },
  },
  salutation: {
    position: 'absolute',
    top: -36,
    left: 12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  paper: {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // height: 300,
    padding: 12,
  },
  dateCalendarMenu: {
    zIndex: theme.zIndex.tooltip,
  },
  saveAs: {
    padding: '5px 8px',
    right: 24,
    position: 'absolute',
    marginRight: 8,
    border: 'solid 1px #3398dc',

    '&:hover': {
      backgroundColor: 'rgba(51, 152, 220, 0.15)',
    },
  },
});

class SendEmailToTalents extends React.Component {
  constructor(props) {
    super(props);
    const realContentIndex = props.toSend
      ? props.toSend.get('content').indexOf('<h6/>')
      : 5;
    this.state = {
      emailListIds: props.emailListIds,
      emailBlastOptions: props.emailBlastList.toJS(),
      selectedGreeting: props.toSend
        ? props.toSend.get('content').substring(4, realContentIndex)
        : ' ',
      subject: props.toSend ? props.toSend.get('subject') : '',
      body: props.toSend
        ? props.toSend.get('content').substring(realContentIndex + 5)
        : ``,
      sendingEmail: false,
      files: props.toSend ? props.toSend.get('attachments').toJS() : [],
      openSchedule: false,
      draftId: this.props.toSend ? this.props.toSend.get('id') : ``,

      openButtonGroup: false,
      openSaveAs: false,
      showAddTemplateDialog: false,
      uploadingAttachment: false,
      draftSuccess: false,
    };
    this.buttonRef = React.createRef();
    this.saveAsRef = React.createRef();
  }

  componentDidMount(): void {
    // this.props.dispatch(getMyEmailBlastList());
    this.setState({});
    this.props.dispatch(tenantTemplateList());
  }

  handleSendEmail = () => {
    const content = this.editor.getContent();

    if (!content) {
      this.setState({ schedule: null });

      return this.props.dispatch({
        type: ADD_MESSAGE,
        message: {
          message: 'Email content is empty',
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
      this.setState({ schedule: null });
      return this.props.dispatch({
        type: ADD_MESSAGE,
        message: {
          message: 'Attached file is too big.',
          type: 'error',
        },
      });
    }
    const { subject, files, emailListIds, schedule, selectedGreeting } =
      this.state;
    //set pending state
    this.setState({
      sendingEmail: true,
    });

    console.log('emailListIds', emailListIds);
    this.props
      .dispatch(
        sendEmailByList({
          emailListIds: emailListIds.split(','),
          subject: subject,
          content: `<h6>${selectedGreeting}<h6/>` + content,
          attachments: files.map((ele) => {
            return {
              name: ele.name,
              link: ele.link,
            };
          }),
          schedule: dateFns.getTime(schedule),
        })
      )
      .then((response) => {
        if (this.props.toSend) {
          this.props.dispatch(deleteDraft(this.props.toSend.get('id')));
        }

        this.props.onClose();
      })
      .catch(() => {
        this.setState({ sendingEmail: false });
      });
  };

  attachFileHandler = (e) => {
    const fileInput = e.target;
    console.log('fileInput', fileInput.files[0]);
    this.setState({ uploadingAttachment: true });
    uploadAttachment(fileInput.files[0])
      .then((res) => {
        console.log('res', res);
        this.setState({
          files: this.state.files.concat({
            name: fileInput.files[0].name,
            size: fileInput.files[0].size,
            link: res.response.s3url,
          }),
          uploadingAttachment: false,
        });
      })
      .then(() => (fileInput.value = ''));

    // this.setState({
    //   files: this.state.files.concat(Array.from(fileInput.files))
    // });
  };

  removeFileHandler = (file) => {
    const fileList = this.state.files.slice();
    fileList.splice(fileList.indexOf(file), 1);
    this.setState({ files: fileList });
  };

  handleTemplateChange = (selectedTemplate) => {
    if (!selectedTemplate) {
      return this.setState({
        selectedTemplate,
      });
    }
    const body = selectedTemplate.template || '';
    this.setState({
      selectedTemplate,
      subject: selectedTemplate.subject || '',
    });
    this.editor.setContent(body);
  };

  saveAsDraft = () => {
    console.log('???', this.props);
    const content = this.editor.getContent();
    let totalsize = 0;
    this.state.files.forEach((file) => {
      totalsize += file.size;
    });
    if (totalsize > 8388608) {
      // check attachment size
      this.setState({ schedule: null });
      return this.props.dispatch({
        type: ADD_MESSAGE,
        message: {
          message: 'Attached file is too big.',
          type: 'error',
        },
      });
    }
    const { subject, files, emailListIds, selectedGreeting, draftId } =
      this.state;
    const draft = {
      emailListIds: emailListIds.split(','),
      subject: subject,
      content: `<h6>${selectedGreeting}<h6/>` + content,
      attachments: files.map((ele) => {
        return {
          name: ele.name,
          link: ele.link,
        };
      }),
    };

    this.props.dispatch(upsertDraft(draft, draftId)).then(() => {
      this.setState({ openSaveAs: false, draftSuccess: true });
      // this.props.onClose();
    });
  };

  render() {
    const {
      emailListIds,
      emailBlastOptions,
      sendingEmail,
      openButtonGroup,
      openSaveAs,
      showAddTemplateDialog,
      uploadingAttachment,
    } = this.state;
    const { t, classes, templateList, fromDraft } = this.props;

    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">{t('common:sendEmailBlast')}</Typography>
        </DialogTitle>

        <DialogContent>
          <div className="apn-item-padding flex-child-auto flex-container flex-dir-column">
            <div>
              <FormReactSelectContainer label={t('common:recipients')}>
                <Select
                  multi
                  simpleValue
                  valueKey="id"
                  labelKey="name"
                  value={emailListIds}
                  options={emailBlastOptions}
                  onChange={(emailListIds) => this.setState({ emailListIds })}
                />
              </FormReactSelectContainer>
            </div>

            <div>
              <FormInput
                label={t('field:subject')}
                value={this.state.subject}
                onChange={(e) => this.setState({ subject: e.target.value })}
              />
            </div>

            <Attachment
              t={t}
              files={this.state.files}
              handleChange={this.attachFileHandler}
              handleDelete={this.removeFileHandler}
              uploadingAttachment={uploadingAttachment}
            />

            <div style={{ marginTop: '12px' }}>
              <FormReactSelectContainer label={t('common:templates')}>
                <Select
                  valueKey="id"
                  labelKey="title"
                  value={this.state.selectedTemplate}
                  options={templateList}
                  onChange={this.handleTemplateChange}
                />
              </FormReactSelectContainer>
            </div>
            <div style={{ position: 'relative' }}>
              <RichTextEditor
                initialValue={this.state.body}
                editorRef={(editor) => (this.editor = editor)}
                className={classes.editor}
                isEmailBlast
              />

              {this.editor && (
                <Portal container={this.editor.getContentAreaContainer()}>
                  <MuiSelect
                    value={this.state.selectedGreeting}
                    onChange={(e) =>
                      this.setState({ selectedGreeting: e.target.value })
                    }
                    displayEmpty
                    style={{
                      fontSize: 13,
                      paddingTop: 10,
                      position: 'absolute',
                    }}
                    MenuProps={{
                      MenuListProps: { dense: true },
                    }}
                    className={classes.salutation}
                  >
                    <MenuItem value={' '}>
                      <em>No Salutation</em>
                    </MenuItem>
                    <MenuItem value={`Hi {{name}}`}>{`Hi {{name}}`}</MenuItem>
                    <MenuItem
                      value={`Dear {{name}}`}
                    >{`Dear {{name}}`}</MenuItem>
                    <MenuItem
                      value={`Greetings {{name}}`}
                    >{`Greetings {{name}}`}</MenuItem>
                  </MuiSelect>
                </Portal>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="horizontal-layout align-middle">
            <SecondaryButton onClick={this.props.onClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <div className={classes.wrapper}>
              <ButtonGroup
                variant="contained"
                color="primary"
                ref={this.buttonRef}
                aria-label="split button"
                disabled={sendingEmail}
                disableElevation
              >
                <Button onClick={this.handleSendEmail}>
                  {t('action:send')}
                </Button>
                <Button
                  color="primary"
                  size="small"
                  aria-controls={
                    openButtonGroup ? 'split-button-menu' : undefined
                  }
                  aria-expanded={openButtonGroup ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={() =>
                    this.setState({ openButtonGroup: !openButtonGroup })
                  }
                >
                  {openButtonGroup ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </Button>
              </ButtonGroup>
              {sendingEmail && (
                <CircularProgress
                  size={24}
                  className={classes.buttonProgress}
                />
              )}
            </div>
            <Popper
              open={openButtonGroup}
              anchorEl={this.buttonRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener
                      onClickAway={() =>
                        this.setState({ openButtonGroup: false })
                      }
                    >
                      <MenuList id="split-button-menu" dense disablePadding>
                        <MenuItem
                          onClick={() =>
                            this.setState({
                              openSchedule: true,
                              openButtonGroup: false,
                              schedule: new Date(),
                            })
                          }
                        >
                          {t('action:scheduleSend')}
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Popper
              open={this.state.openSchedule}
              anchorEl={this.buttonRef.current}
              transition
              disablePortal
              placement="top-start"
            >
              {({ TransitionProps, placement }) => (
                <Fade
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper elevation={4}>
                    <ClickAwayListener
                      onClickAway={() =>
                        this.setState({ openSchedule: false, schedule: null })
                      }
                    >
                      <div className={classes.paper}>
                        <Typography>{t('common:ScheduleASendTime')}</Typography>
                        <div
                          style={{
                            marginLeft: -8,
                            marginRight: -8,
                            height: 280,
                            overflow: 'hidden',
                          }}
                        >
                          <DatePicker
                            inline
                            value={this.state.schedule}
                            disabledDate={(date) =>
                              dateFns.isBefore(
                                date,
                                dateFns.startOfDay(new Date())
                              ) ||
                              dateFns.isAfter(
                                date,
                                dateFns.addDays(
                                  dateFns.startOfDay(new Date()),
                                  3
                                )
                              )
                            }
                            format="YYYY-MM-DD HH:mm"
                            placement="topStart"
                            menuClassName={classes.dateCalendarMenu}
                            ranges={[]}
                            onSelect={(schedule) => this.setState({ schedule })}
                          />
                        </div>

                        <Typography
                          variant="caption"
                          color="primary"
                          gutterBottom
                        >
                          {
                            // this.state.schedule &&
                            dateFns.format(
                              this.state.schedule,
                              'Do MMM YYYY [at] hh:mm A'
                            )
                          }
                        </Typography>

                        <PrimaryButton
                          fullWidth
                          onClick={() =>
                            this.setState({ openSchedule: false }, () =>
                              this.handleSendEmail()
                            )
                          }
                        >
                          {t('action:scheduleSend')}
                        </PrimaryButton>
                      </div>
                    </ClickAwayListener>
                  </Paper>
                </Fade>
              )}
            </Popper>
          </div>

          {!fromDraft && (
            <>
              <Button
                color="primary"
                size="small"
                aria-controls={
                  openButtonGroup ? 'split-button-menu' : undefined
                }
                aria-expanded={openButtonGroup ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                className={classes.saveAs}
                ref={this.saveAsRef}
                onClick={() => this.setState({ openSaveAs: !openSaveAs })}
              >
                Save As
                {openSaveAs ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </Button>

              <Popper
                open={openSaveAs}
                anchorEl={this.saveAsRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener
                        onClickAway={() => this.setState({ openSaveAs: false })}
                      >
                        <MenuList id="split-button-menu" dense disablePadding>
                          <MenuItem onClick={this.saveAsDraft}>Draft</MenuItem>
                          <MenuItem
                            onClick={() =>
                              this.setState({
                                openSaveAs: false,
                                showAddTemplateDialog: true,
                              })
                            }
                          >
                            Template
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          )}

          {fromDraft && (
            <Button
              color="primary"
              className={classes.saveAs}
              onClick={this.saveAsDraft}
            >
              {t('action:save')}
            </Button>
          )}

          {showAddTemplateDialog && (
            <SaveAsTemplateDialog
              closeOuter={this.props.onClose}
              t={t}
              subject={this.state.subject}
              template={this.editor.getContent()}
              handleRequestClose={() =>
                this.setState({
                  showAddTemplateDialog: false,
                })
              }
            />
          )}

          <Dialog open={this.state.draftSuccess} fullWidth maxWidth="xs">
            <DialogTitle>{t('common:Draft Saved')}</DialogTitle>
            <DialogContent>
              Your draft has been saved, and will appear under "My Drafts".
            </DialogContent>
            <DialogActions>
              <div className="horizontal-layout">
                <PrimaryButton
                  onClick={() => this.setState({ draftSuccess: false })}
                >
                  {t('action:Close')}
                </PrimaryButton>
              </div>
            </DialogActions>
          </Dialog>
        </DialogActions>
      </React.Fragment>
    );
  }
}

SendEmailToTalents.propTypes = {
  onClose: PropTypes.func,
};

function mapStoreStateToProps(state) {
  return {
    templateList: templateSelector(state, 'Email_Blast').toJS(),
    emailBlastList: emailBlastSelector(state),
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(SendEmailToTalents)
);
