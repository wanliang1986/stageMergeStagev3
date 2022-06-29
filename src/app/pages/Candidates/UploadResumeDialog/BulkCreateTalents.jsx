import React from 'react';
import { connect } from 'react-redux';
import { makeCancelable } from '../../../../utils';
import { asyncPool } from '../../../../utils/asyncPool';
import { withStyles } from '@material-ui/core';
import {
  createTalentWithParseResult,
  getParseData,
} from '../../../actions/talentActions';
import { getSearchData } from '../../../actions/newCandidate';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

import FinishedIcon from '@material-ui/icons/CheckCircle';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import { getParseRecordByIds } from '../../../selectors/parseRecordSelector';

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

class BulkCreateTalents extends React.Component {
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
    const { dispatch, parseRecords, t } = this.props;
    console.log('parseRecords', parseRecords);
    this.setState({
      progress: 0,
    });
    this.bulkTask = makeCancelable(
      asyncPool(1, parseRecords, (parseRecord, array) => {
        const fileName = parseRecord.get('originalFileName');

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
        const taskPromise = dispatch(getParseData(parseRecord.get('uuid')))
          .then((resume) => {
            console.log('resume:', resume);
            const hotList = parseRecord.get('hotList');
            return dispatch(
              createTalentWithParseResult(
                resume,
                parseRecord.get('id'),
                hotList && hotList.id
              )
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
      this.setState({
        finished: true,
        error: res.filter((r) => r.err),
        error2: res.filter((r) => r.err2),
        canceled: res.filter((r) => r.canceled),
      });
    });
  };

  handleStop = () => {
    this.setState({ canceling: true });
  };

  handleClose = (e) => {
    this.props.onClose();
  };

  render() {
    const { finished, canceling, currentFileName, progress, current } =
      this.state;
    const { t, classes, parseRecords } = this.props;
    console.log('progress', progress);
    const progressPst = Math.floor((progress / parseRecords.length) * 100);
    const progressBufferPst = Math.floor(
      ((progress + current) / parseRecords.length) * 100
    );

    return (
      <div className="vertical-layout" style={{ padding: 24, width: 500 }}>
        <Typography variant="h6" gutterBottom>
          {t('tab:Processing Resumes')} {`(${parseRecords.length} resumes)`}
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
                <Typography variant="subtitle2">{t('tab:Error')}</Typography>
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
              </div>
              <Divider />
              <div style={{ maxHeight: 300, overflow: 'auto' }}>
                {this.state.error.length > 0 && (
                  <div className={classes.message}>
                    <div className="flex-container align-center align-justify">
                      <Typography variant="subtitle2" gutterBottom>
                        Failed to get Parse Result (
                        {this.state.error.length.toLocaleString()})
                      </Typography>
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

const mapStateToProps =
  (state, { parseRecordIds }) =>
  () => {
    return {
      parseRecords: getParseRecordByIds(state, parseRecordIds),
    };
  };

export default connect(mapStateToProps)(withStyles(styles)(BulkCreateTalents));
