import React from 'react';
import { makeCancelable } from '../../../../utils';
import { asyncPool } from '../../../../utils/asyncPool';
import {
  createTalentWithParseResult,
  bulkParseResume,
  upsertParseRecord,
} from '../../../actions/talentActions';

import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import { Prompt } from 'react-router';

class UploadResumes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      error: [],
      finished: false,
      canceled: false,
      current: 0,
    };
    this.tasks = [];
  }

  componentDidMount() {
    this.upload();
  }

  componentWillUnmount() {
    this.bulkTask && this.bulkTask.cancel();
    this.unmounted = true;
    this.tasks.forEach((task) => task.cancel());
  }

  upload = () => {
    const { onFinish, resumeFiles, dispatch, hotListId, t } = this.props;
    window.onbeforeunload = () =>
      'You have unsaved changes, are you sure you want to leave?';

    this.bulkTask = makeCancelable(
      asyncPool(1, resumeFiles, (resumeFile, array) => {
        if (this.state.canceled) {
          return Promise.resolve('canceled');
        }
        const fileName = resumeFile.name;
        this.setState({
          current: this.state.current + 1,
          currentFileName: fileName,
        });
        const taskPromise = dispatch(bulkParseResume(resumeFile))
          .then((resume) => {
            const note = JSON.stringify({ other: 'Resume is not reviewed' });
            const parseRecord = {
              originalFileName: resume.name,
              uuid: resume.uuid,
              type: 'RESUME',
              note,
            };
            return dispatch(upsertParseRecord(parseRecord)).then((response) => {
              return dispatch(
                createTalentWithParseResult(resume, response.id, hotListId)
              ).then(() => {
                return {
                  fileName,
                };
              });
            });
          })
          .catch((err) => {
            return {
              fileName,
              err,
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
      this.setState({ finished: true, error: res.filter((r) => r.err) });
      onFinish();
      window.onbeforeunload = null;
    });
  };

  handleStop = () => {
    // this.canceled = true;
    this.setState({ canceled: true });
    window.onbeforeunload = null;
  };

  render() {
    const { finished, canceled, currentFileName, progress, current } =
      this.state;
    const { t, resumeFiles, onClose } = this.props;
    const progressPst = Math.floor((progress / resumeFiles.length) * 100);
    const progressBufferPst = Math.floor(
      ((progress + current) / resumeFiles.length) * 100
    );
    return (
      <div className="vertical-layout" style={{ padding: 24, width: 500 }}>
        {!finished && (
          <Prompt
            message={(location) =>
              'You have unsaved changes, are you sure you want to leave?'
            }
          />
        )}
        <Typography variant="h6" gutterBottom>
          Processing Resumes {`(${resumeFiles.length} resumes)`}
        </Typography>

        <div>
          <Typography variant="subtitle2">{currentFileName}</Typography>
          <div className="flex-container align-middle" style={{ height: 24 }}>
            <LinearProgress
              className="flex-child-auto"
              variant={finished ? 'determinate' : 'buffer'}
              value={progressPst}
              valueBuffer={progressBufferPst}
            />
            <Typography variant="subtitle2" color="primary">
              {progressPst}%
            </Typography>
          </div>
        </div>

        {finished && this.state.error.length > 0 && (
          <div>
            <div className="flex-container" style={{ marginLeft: 30 }}>
              <Typography variant="subtitle2" color="secondary">
                {this.state.error.length} &nbsp;
              </Typography>
              <Typography variant="subtitle2">Error</Typography>
            </div>
            <Typography variant="body2">
              {this.state.error.map(({ fileName }) => `${fileName}`).join(', ')}
              &nbsp;&nbsp; failed
            </Typography>
            <Typography variant="body2">
              On "Error Resumes" page, click on each pending resume to edit the
              profile and finish creating candidates.
            </Typography>
          </div>
        )}
        <div className="horizontal-layout">
          {finished ? (
            <PrimaryButton onClick={onClose} style={{ width: 100 }}>
              {t('action:close')}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={this.handleStop} style={{ width: 100 }}>
              {canceled ? 'Canceling' : t('action:cancel')}
            </PrimaryButton>
          )}
        </div>
      </div>
    );
  }
}

export default UploadResumes;
