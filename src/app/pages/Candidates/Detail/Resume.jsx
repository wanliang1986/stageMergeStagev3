import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withTranslation, Trans } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  getResumesByTalentId,
  addResume,
  removeResume,
} from '../../../actions/talentActions';
import { uploadResumeOnly } from '../../../actions/talentActions';

import talentResumeSelector from '../../../selectors/talentResumeSelector';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import { resumeSourceTypes } from '../../../constants/formOptions';
import { externalUrl, makeCancelable } from '../../../../utils';
import { showErrorMessage } from '../../../actions';

import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import DownloadIcon from '@material-ui/icons/CloudDownload';
import DeleteIcon from '@material-ui/icons/Delete';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import ResumeFrame from '../../../components/particial/ResumeFrame/LoadableResumeFrame';
import AlertDialog from '../../../components/particial/AlertDialog';
import Loading from '../../../components/particial/Loading';

const styles = {
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  menu: {
    width: 200,
  },
};

const anchorOrigin = { vertical: 'top', horizontal: 'left' };
const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

class Resume extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedResumeIndex: 0,
      pending: false,
      addingResume: false,
      parsing: false,
      uploadedResume: '',

      handleRemoveResume: null,
    };
  }

  componentDidMount() {
    const { isLimitUser, dispatch, candidateId } = this.props;
    if (isLimitUser) {
      dispatch(getResumesByTalentId(candidateId));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.selectedResumeIndex > this.props.resumes.size - 1) {
      this.setState({ selectedResumeIndex: this.props.resumes.size - 1 });
    }
  }

  handleResumeUpload = (e) => {
    console.log(1);
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    if (resumeFile) {
      fileInput.value = '';
      this.setState({ parsing: true });
      this.props
        .dispatch(uploadResumeOnly(resumeFile))
        .then((response) => {
          this.setState({ uploadedResume: response, parsing: false });
        })
        .catch((err) => {
          this.setState({ parsing: false }, () =>
            this.props.dispatch(showErrorMessage(err))
          );
        });
    }
  };

  handleResumeAdd = (e) => {
    e.preventDefault();
    const sourceType = e.target.sourceType.value;
    let resume = this.state.uploadedResume;
    resume.talentId = this.props.candidateId;
    resume.sourceType = sourceType;
    this.setState({ addingResume: true });
    this.props
      .dispatch(addResume(resume))
      .then(() => this.setState({ uploadedResume: '', addingResume: false }));
  };

  handleResumeRemove = () => {
    const { resumes, dispatch } = this.props;
    this.setState({
      handleRemoveResume: () => {
        this.setState({ pending: true });
        dispatch(
          removeResume(resumes.getIn([this.state.selectedResumeIndex, 'id']))
        ).then(this.handleCancelRemoveResume, this.handleCancelRemoveResume);
      },
    });
  };

  handleCancelRemoveResume = () => {
    this.setState({ handleRemoveResume: null, pending: false });
  };

  downloadResume = () => {
    const { resumes } = this.props;
    const { selectedResumeIndex } = this.state;
    const resume = resumes.get(selectedResumeIndex);
    fetch(externalUrl(resume.get('s3Link'), true))
      .then(_handleResponseToBlob)
      .then(({ response }) => {
        handleDownload(response, resume.get('name'));
      });
  };

  render() {
    const { t, classes, canEdit, resumes, loadingResume } = this.props;
    const {
      handleRemoveResume,
      selectedResumeIndex,
      uploadedResume,
    } = this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        {canEdit && (
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56, flexShrink: 0 }}
          >
            <div
              className="item-padding"
              ref={(el) => (this.uploadResume = el)}
            >
              <PrimaryButton
                disabled={!canEdit}
                processing={this.state.parsing}
                component="label"
                onChange={this.handleResumeUpload}
                style={{ whiteSpace: 'nowrap' }}
              >
                {t('action:uploadResume')}
                <input
                  key="resume"
                  type="file"
                  disabled={!canEdit}
                  style={{ display: 'none' }}
                />
              </PrimaryButton>
            </div>

            {!!resumes.size && (
              <React.Fragment>
                <div
                  className={'flex-child-auto'}
                  style={{ overflow: 'hidden' }}
                >
                  <TextField
                    select
                    fullWidth
                    value={selectedResumeIndex}
                    onChange={(e) =>
                      this.setState({ selectedResumeIndex: e.target.value })
                    }
                    SelectProps={{
                      MenuProps: {
                        className: classes.menu,
                        MenuListProps: {
                          dense: true,
                          disablePadding: true,
                        },
                      },
                    }}
                  >
                    {resumes.map((resume, index) => (
                      <MenuItem
                        key={resume.get('id')}
                        title={resume.get('name')}
                        value={index}
                      >
                        <Typography noWrap>
                          {`${moment(resume.get('createdDate')).format(
                            'L'
                          )} - ${resume.get('sourceType')} - ${
                            resume.get('name') || ''
                          }`}
                        </Typography>
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className={'flex-container'}>
                  <Tooltip title={t('action:download')} disableFocusListener>
                    <IconButton onClick={this.downloadResume}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>

                  {canEdit && (
                    <Tooltip title={t('action:delete')} disableFocusListener>
                      <IconButton
                        tooltip={t('action:delete')}
                        onClick={this.handleResumeRemove}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </React.Fragment>
            )}
          </div>
        )}
        <Divider />
        {resumes.size > 0 && resumes.get(selectedResumeIndex) ? (
          <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
            <ResumeFrame resume={resumes.get(selectedResumeIndex)} />
          </div>
        ) : loadingResume ? (
          <Loading />
        ) : (
          <div className="container-padding">
            <Typography variant="h5">{t('message:noResume')}</Typography>
          </div>
        )}

        <Popover
          open={Boolean(uploadedResume)}
          anchorEl={this.uploadResume}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
        >
          <form
            className="container-padding"
            style={{ width: 336 }}
            onSubmit={this.handleResumeAdd}
          >
            <TextField
              name="name"
              type="text"
              label={t('field:fileName')}
              fullWidth
              value={uploadedResume && uploadedResume.name}
            />
            <TextField
              select
              name="sourceType"
              label={t('field:sourceType')}
              fullWidth
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              {resumeSourceTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
            <div className="horizontal-layout">
              <SecondaryButton
                onClick={() => this.setState({ uploadedResume: '' })}
              >
                {t('action:cancel')}
              </SecondaryButton>
              <PrimaryButton processing={this.state.addingResume} type="submit">
                {t('action:save')}
              </PrimaryButton>
            </div>
          </form>
        </Popover>

        <AlertDialog
          onOK={handleRemoveResume}
          onCancel={this.handleCancelRemoveResume}
          title={t('common:deleteResume')}
          content={
            <Trans i18nKey="message:removeResumeAlert" parent="p">
              Are you sure you want to delete resume
              <strong style={{ fontStyle: 'italic' }}>
                {{
                  resume: resumes.getIn([selectedResumeIndex, 'name']),
                }}
              </strong>
              ?
            </Trans>
          }
          okLabel={t('action:delete')}
          cancelLabel={t('action:cancel')}
        />
      </div>
    );
  }
}

Resume.propTypes = {
  resumes: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStateToProps = (state, { candidateId }) => {
  return {
    resumes: talentResumeSelector(state, candidateId),
  };
};
export default withTranslation(['action', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(Resume))
);

function _handleResponseToBlob(response) {
  if (!response.ok) {
    return response
      .text()
      .then((text) => {
        return Promise.reject({
          status: response.status,
          message: text,
        });
      })
      .catch((err) => {
        throw response.status;
      });
  }
  return response
    .blob()
    .then((blob) => {
      return {
        response: blob,
      };
    })
    .catch((err) => {
      return 'OK';
    });
}

const handleDownload = (response, filename) => {
  console.log(response);

  const linkElement = document.createElement('a');
  try {
    const blob = new Blob([response], { type: response.type });
    const url = window.URL.createObjectURL(blob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (ex) {
    console.log(ex);
  }
};
