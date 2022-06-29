import React from 'react';
import { makeCancelable } from '../../../../utils';
import { asyncPool } from '../../../../utils/asyncPool';
import { exportJson } from '../../../../utils/sheet';
import { withStyles } from '@material-ui/core';
import {
  createTalentWithParseResult,
  bulkParseResume,
  upsertParseRecord,
} from '../../../actions/talentActions';
import { getSearchData } from '../../../actions/newCandidate';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import FinishedIcon from '@material-ui/icons/CheckCircle';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import PotentialButton from '../../../components/particial/PotentialButton';

const styles = {
  root: {},
  messageContainer: {
    border: '1px solid lightgray',
    borderRadius: 2,
    overflow: 'hidden',
  },
  messageTitle: {
    padding: 8,
    background: 'rgba(0,0,0,.02)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    padding: 8,
    '&:not(:last-child)': {
      borderBottom: '1px solid lightgray',
    },
  },
};

class BulkUploadResumes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      current: 0,

      error: [],
      error2: [],
      canceled: [],

      finished: false,
      canceling: false,
    };
    this.tasks = [];
  }

  componentDidMount() {
    this.upload();
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.bulkTask && this.bulkTask.cancel();
    this.tasks.forEach((task) => task.cancel());
  }

  upload = () => {
    const { resumeFiles, dispatch, t } = this.props;
    console.log('resumeFiles', resumeFiles);
    this.setState({
      progress: 0,
    });
    this.bulkTask = makeCancelable(
      asyncPool(1, resumeFiles, (resumeFile, array) => {
        const fileName = resumeFile.name;

        if (this.state.canceling) {
          return Promise.resolve({
            fileName,
            canceled: { message: 'canceled' },
          });
        }

        this.setState({
          current: this.state.current + 1,
          currentFileName: fileName,
        });

        const taskPromise = dispatch(bulkParseResume(resumeFile, 1))
          .then((resume) => {
            console.log('resume:', resume);
            //{
            //         name: parseOutputCache.name,
            //         talentId: parseOutputCache.talentId, // duplicated resume
            //         s3Link: parseOutputCache.s3Link,
            //         photoUrl: parseOutputCache.photoUrl,
            //         text: parseOutputCache.data && JSON.parse(parseOutputCache.data).text,
            //         uuid: parseOutputCache.uuid,
            //         parserOutput: parseOutputCache.data,
            //       };
            const note = JSON.stringify({ other: 'Resume is not reviewed' });
            const parseRecord = {
              originalFileName: resume.name,
              uuid: resume.uuid,
              type: 'RESUME',
              note,
            };

            return dispatch(upsertParseRecord(parseRecord)).then((response) => {
              return dispatch(
                createTalentWithParseResult(resume, response.id)
              ).then(
                () => {
                  dispatch(getSearchData());
                  return {
                    fileName,
                  };
                },
                (err2) => {
                  return {
                    fileName,
                    err2,
                  };
                }
              );
            });
          })
          .catch((err) => {
            return {
              fileName,
              err,
              resumeFile,
            };
          });

        const task = makeCancelable(taskPromise);
        this.tasks.push(task);
        if (this.unmounted) {
          task.cancel();
        }
        return task.promise.then(
          (response) => {
            this.setState({
              progress: this.state.progress + 1,
              current: this.state.current - 1,
            });
            return response;
          },
          (err) => {
            return {
              fileName,
              err,
            };
          }
        );
      })
    );

    this.bulkTask.promise.then((res) => {
      console.log(res);
      this.setState({
        finished: true,
        error: res.filter((r) => r.err),
        error2: res.filter((r) => r.err2),
        canceled: res.filter((r) => r.canceled),
      });
    });
  };

  handleRetryFailedResume = (e) => {
    const { onRetry } = this.props;
    const { error } = this.state;
    onRetry(error.map(({ resumeFile }) => resumeFile));
    this.upload();
  };

  handleStop = () => {
    this.setState({ canceling: true });
  };

  handleClose = (e) => {
    this.props.onClose();
  };

  handleExportExceptionDetails = (e) => {
    const { error, error2, canceled } = this.state;
    const dataList = [];
    error.forEach(({ fileName, err }) => {
      dataList.push({
        'File Name': fileName,
        'Exception Details': err.fieldErrors
          ? err.fieldErrors[err.fieldErrors.length - 1].message
          : err.message || JSON.stringify(err),
      });
    });
    error2.forEach(({ fileName, err2 }) => {
      dataList.push({
        'File Name': fileName,
        'Exception Details': err2.fieldErrors
          ? err2.fieldErrors[err2.fieldErrors.length - 1].message
          : err2.message || JSON.stringify(err2),
      });
    });
    canceled.forEach(({ fileName, canceled }) => {
      dataList.push({
        'File Name': fileName,
        'Exception Details': canceled.message,
      });
    });
    exportJson(dataList, {
      headers: [
        {
          name: 'File Name',
          width: 60,
        },
        {
          name: 'Exception Details',
          width: 18,
        },
      ],
      fileName: `Exception Details of Bulk Upload Resumes`,
    });
  };

  render() {
    const { finished, canceling, currentFileName, progress, current } =
      this.state;
    const { t, classes, resumeFiles } = this.props;
    console.log('progress', progress);
    console.log('resumeFiles', resumeFiles);
    const progressPst = Math.floor((progress / resumeFiles.length) * 100);
    const progressBufferPst = Math.floor(
      ((progress + current) / resumeFiles.length) * 100
    );

    return (
      <div className="vertical-layout" style={{ padding: 24, width: 500 }}>
        <Typography variant="h6" gutterBottom>
          {t('tab:Processing Resumes')} {`(${resumeFiles.length} resumes)`}
        </Typography>

        <div>
          <Typography variant="subtitle2">{currentFileName}</Typography>
          <div className="flex-container align-middle" style={{ height: 24 }}>
            <LinearProgress
              className="flex-child-auto"
              variant={finished ? 'determinate' : 'buffer'}
              value={progressPst}
              valueBuffer={progressBufferPst}
              style={{ marginRight: 8 }}
            />
            <Typography variant="subtitle2" color="primary">
              {progressPst}%
            </Typography>

            {progressPst === 100 && (
              <FinishedIcon fontSize="large" htmlColor="#37c771" />
            )}

            {finished && (
              <div className="flex-container" style={{ marginLeft: 30 }}>
                <Typography variant="subtitle2" color="secondary">
                  {this.state.error.length + this.state.error2.length} &nbsp;
                </Typography>
                <Typography variant="subtitle2"> {t('tab:Error')}</Typography>
              </div>
            )}
          </div>
        </div>

        {finished &&
          (this.state.error.length > 0 ||
            this.state.error2.length > 0 ||
            this.state.canceled.length > 0) && (
            <div className={classes.messageContainer}>
              <div className={classes.messageTitle}>
                <Typography variant="subtitle2">
                  {t('tab:Exception Details')}
                </Typography>
                <PotentialButton
                  onClick={this.handleExportExceptionDetails}
                  size="small"
                >
                  {t('action:Export')}
                </PotentialButton>
              </div>
              <Divider />
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {this.state.error.length > 0 && (
                  <div className={classes.message}>
                    <div className="flex-container align-center align-justify">
                      <Typography variant="subtitle2" gutterBottom>
                        Failed to upload (
                        {this.state.error.length.toLocaleString()})
                      </Typography>
                      <PotentialButton
                        size="small"
                        onClick={this.handleRetryFailedResume}
                      >
                        Retry
                      </PotentialButton>
                    </div>

                    {this.state.error.map(({ fileName }, index) => (
                      <Typography key={index} variant="body2">
                        {fileName}
                      </Typography>
                    ))}
                  </div>
                )}
                {this.state.error2.length > 0 && (
                  <div className={classes.message}>
                    <div className="flex-container align-center align-justify">
                      <Typography variant="subtitle2" gutterBottom>
                        {t('tab:Failed to create talent')}(
                        {this.state.error2.length.toLocaleString()})
                      </Typography>
                    </div>

                    {this.state.error2.map(({ fileName }, index) => (
                      <Typography key={index} variant="body2" gutterBottom>
                        {fileName}
                      </Typography>
                    ))}
                    <Typography variant="body2" color="textSecondary">
                      {t('tab:ErrorResumes')}
                    </Typography>
                  </div>
                )}

                {this.state.canceled.length > 0 && (
                  <div className={classes.message}>
                    <div className="flex-container align-center align-justify">
                      <Typography variant="subtitle2" gutterBottom>
                        Canceled ({this.state.canceled.length.toLocaleString()})
                      </Typography>
                    </div>

                    {this.state.canceled.map(({ fileName }, index) => (
                      <Typography key={index} variant="body2" gutterBottom>
                        {fileName}
                      </Typography>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        {finished ? (
          <PrimaryButton onClick={this.handleClose}>
            {t('action:close')}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={this.handleStop} style={{ width: 100 }}>
            {canceling ? t('action:canceling') : t('action:cancel')}
          </PrimaryButton>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(BulkUploadResumes);
