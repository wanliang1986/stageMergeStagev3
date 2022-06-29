import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import {
  makeCancelable,
  sortList,
  getIndexList,
} from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getCurrentJobsAndTalents } from '../../../../apn-sdk';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import { styles, CurrentJobSAndCandidatesColumns as columns } from '../params';
import JobListDetail from './JobListDetail';
import TalentListDetail from './TalentListDetail';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import Loading from '../../../components/particial/Loading';
import PrimaryButton from '../../../components/particial/PrimaryButton';

class StoppedJob extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      loading: true,
      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.task.cancel();
  }

  fetchData = () => {
    this.task = makeCancelable(getCurrentJobsAndTalents());
    this.task.promise
      .then((res) => {
        const dataList = Immutable.fromJS(res);
        let filteredIndex = getIndexList(dataList);
        this.setState({ dataList, loading: false, filteredIndex });
      })
      .catch((reason) => {
        if (!reason.isCanceled) {
          this.setState({ loading: false });
        }
      });
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    const preIndex = filteredIndex;

    let indexList;
    indexList = sortDir
      ? sortList(preIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleCloseDialog = () => {
    this.setState({
      openJobList: null,
      openTalentList: null,
    });
  };

  handleClickJobCount = ({ jobIds, userName }) => {
    this.setState({ openJobList: { jobIds, userName } });
  };
  handleClickTalentCount = ({ talentIds, userName }) => {
    this.setState({ openTalentList: { talentIds, userName } });
  };

  render() {
    const { t, classes } = this.props;
    const {
      dataList,
      loading,
      filteredIndex,
      colSortDirs,
      openJobList,
      openTalentList,
    } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    if (!dataList) {
      return <Loading />;
    }
    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <Typography variant="h6" style={{ margin: '10px' }}>
            Current Jobs and Candidates
          </Typography>
          {/*<Typography variant="subtitle1" style={{ margin: '10px' }}>*/}
          {/*  No activities during the past three months.*/}
          {/*</Typography>*/}
        </div>

        <Divider />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            handleClickCurrentJobCount={this.handleClickJobCount}
            handleClickCurrentTalentCount={this.handleClickTalentCount}
          />
          {loading && (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          )}
        </div>

        <Dialog
          open={!!(openJobList || openTalentList)}
          onClose={this.handleCloseDialog}
          fullWidth
          maxWidth="md"
        >
          {openJobList && <JobListDetail t={t} {...openJobList} />}
          {openTalentList && <TalentListDetail t={t} {...openTalentList} />}
          <Divider style={{ marginBottom: 8 }} />
          <DialogActions>
            <PrimaryButton
              // style={{ margin: '20px' }}
              onClick={this.handleCloseDialog}
              color="primary"
              variant="contained"
            >
              {t('action:close')}
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

StoppedJob.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(connect()(withStyles(styles)(StoppedJob)));
