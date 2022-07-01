import React from 'react';
import { withStyles } from '@material-ui/core';
import { push } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { connect } from 'react-redux';
import { parseResume, upsertParseRecord } from '../../../actions/talentActions';
import {
  getCandidatePreference,
  updateCandidatePreference,
} from './../../../actions/userActions';
import { showErrorMessage } from '../../../actions';

import BulkUploadResumes from '../UploadResumeDialog/BulkUploadResumes';
import Dialog from '@material-ui/core/Dialog';
import Loading from '../../../components/particial/Loading';
import DialogContent from '@material-ui/core/DialogContent';
import { CandidateTpye } from '../../../constants/formOptions';

const styles = (theme) => ({
  tooltip: {
    boxShadow: theme.shadows[2],
    backgroundColor: '#ffffff',
    padding: 0,
    maxWidth: 220,
  },
  loading: {
    '& .root': {
      padding: 0,
      height: '30px !important',
    },
    '& .MuiCircularProgress-root': {
      height: '30px !important',
      width: '30px !important',
    },
    '& .container-padding': {
      height: '30px !important',
    },
  },
});

class CreateCandidateButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: false,
      parsing: false,
      openCreate: false,
      resumeFiles: null,
    };
  }

  componentDidMount() {
    this.getColumns();
  }

  getColumns = () => {
    const { dispatch } = this.props;
    dispatch(getCandidatePreference());
  };
  _updateTalentCreationType = (creationTalentType) => {
    // console.log('_updateTalentCreationType', creationTalentType);
    // this.props.dispatch(
    //   updateCandidatePreference({ creationType: { creationTalentType } })
    // );
  };

  getRemainJobType = (data) => {
    if (data === CandidateTpye[0].value) {
      return (
        <Button
          size="small"
          color="primary"
          disableRipple
          style={{ minWidth: 150, borderColor: 'white' }}
        >
          <input
            key="resume"
            type="file"
            id="contained-button-fileFour"
            disabled={this.state.parsing}
            onChange={this.handleUploadResumeV2}
            style={{ display: 'none' }}
          />
          <label htmlFor="contained-button-fileFour">
            {'Upload with Resume'}
          </label>
        </Button>
      );
    } else if (data === CandidateTpye[1].value) {
      return (
        <Button
          size="small"
          color="primary"
          disableRipple
          style={{ minWidth: 150, borderColor: 'white' }}
          onClick={this.handleSkip}
        >
          {'Create without Resume'}
        </Button>
      );
    } else if (data === CandidateTpye[2].value) {
      return (
        <Button
          size="small"
          color="primary"
          disableRipple
          style={{ minWidth: 150, borderColor: 'white' }}
        >
          <input
            key="resume"
            type="file"
            id="contained-button-fileFive"
            multiple
            onChange={this.handleBulkUploadResumes}
            style={{ display: 'none' }}
          />
          <label htmlFor="contained-button-fileFive">
            {'Bulk Upload Resumes'}
          </label>
        </Button>
      );
    }
  };

  //新上传流程，上传简历只判断状态，parse-records接口只传输uuid，在新页面通过uuid进行查询
  handleUploadResumeV2 = (e) => {
    console.log(1);
    const { dispatch } = this.props;
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    if (resumeFile) {
      this.setState({ parsing: true });
      dispatch(parseResume(resumeFile))
        .then((resume) => {
          console.log(resume);
          if (!resume) {
            // failed to parse resume will redirect to talent create page
            return dispatch(push(`/candidates/create`));
          }
          if (resume.talentId) {
            // if resume is already exists, will redirect to that talent detail page
            // 返回结果如果含有talentId，说明简历已存在，直接跳转详情页面
            return dispatch(push(`/candidates/detail/${resume.talentId}`));
          }
          // create parseRecord for this resume, and remove after creating talent successfully.
          const note = JSON.stringify({
            other: 'Resume is not reviewed', // initial note
            single: true, // check if resume is bulk uploaded
          });
          //从返回结果中组数据parseRecord
          const parseRecord = {
            uuid: resume.uuid,
            originalFileName: resumeFile.name,
            type: 'RESUME',
            note,
          };
          return dispatch(upsertParseRecord(parseRecord)).then((response) => {
            // console.log(response);
            dispatch(
              push(`/candidates/review/${response.uuid}/${response.id}`)
            );
          });
        })
        .catch((err) => {
          this.setState({ parsing: false, parseResultProgress: null });
          dispatch(showErrorMessage(err));
        });
    }
    fileInput.value = '';
    this._updateTalentCreationType(CandidateTpye[0].value);
  };

  handleCancelCreate = () => {
    this.setState({ openCreate: false });
  };

  handleSkip = () => {
    console.log('handleSkip');
    this.props.dispatch(push('/candidates/create'));
    this._updateTalentCreationType(CandidateTpye[1].value);
  };

  handleBulkUploadResumes = (e) => {
    console.log('handleBulkUploadResumes', e);
    const fileInput = e.target;
    if (Array.from(fileInput.files).length > 10) {
      this.props.dispatch(
        showErrorMessage(
          'No more than 10 resumes can be uploaded at the same time'
        )
      );
      return;
    }
    this.setState(
      {
        openCreate: true,
        resumeFiles: Array.from(fileInput.files),
      },
      () => (fileInput.value = '')
    );
    this._updateTalentCreationType(CandidateTpye[2].value);
  };

  handleRetryFailedResumeUpload = (resumeFiles) => {
    this.setState({
      resumeFiles,
    });
  };

  render() {
    const { open, anchorEl, openCreate, resumeFiles } = this.state;
    const { t, classes, candidatePreference } = this.props;
    const showBtnType =
      candidatePreference.getIn(['creationType', 'creationTalentType']) ||
      CandidateTpye[0].value;
    console.log(showBtnType);
    return (
      <>
        <ButtonGroup
          disableElevation
          variant="contained"
          aria-label="split button"
          color="primary"
        >
          {this.getRemainJobType(showBtnType)}
          <Button
            color="primary"
            size="small"
            style={{ padding: '0 4px', minWidth: 0 }}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={(e) =>
              this.setState({
                anchorEl: e.currentTarget.parentElement,
                open: true,
              })
            }
          >
            <ArrowDropDownIcon fontSize="small" />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement={'bottom-start'}
        >
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps}>
              <Paper elevation={2}>
                <ClickAwayListener
                  onClickAway={() => this.setState({ open: false })}
                >
                  <MenuList dense disablePadding style={{ width: 200 }}>
                    <MenuItem>
                      <input
                        key="resume"
                        type="file"
                        id="contained-button-fileTwo"
                        disabled={this.state.parsing}
                        onChange={this.handleUploadResumeV2}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="contained-button-fileTwo">
                        {'Upload with Resume'}
                      </label>
                    </MenuItem>
                    <MenuItem onClick={this.handleSkip}>
                      {'Create without Resume'}
                    </MenuItem>
                    <MenuItem>
                      <input
                        key="resume"
                        type="file"
                        id="contained-button-fileThree"
                        multiple
                        onChange={this.handleBulkUploadResumes}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="contained-button-fileThree">
                        {'Bulk Upload Resumes'}
                      </label>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Dialog
          open={openCreate}
          maxWidth="md"
          PaperProps={{
            style: {
              overflow: 'visible',
            },
          }}
        >
          <BulkUploadResumes
            key={resumeFiles}
            resumeFiles={resumeFiles}
            t={t}
            dispatch={this.props.dispatch}
            onClose={this.handleCancelCreate}
            onRetry={this.handleRetryFailedResumeUpload}
          />
        </Dialog>
        <Dialog open={this.state.parsing}>
          <DialogContent>
            <Loading />
            {'Uploading...'}
          </DialogContent>
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    candidatePreference: state.preference.get('candidate'),
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(CreateCandidateButton)
);
