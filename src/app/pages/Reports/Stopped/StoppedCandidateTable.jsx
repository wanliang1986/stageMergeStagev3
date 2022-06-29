import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

import { sortList, getIndexList } from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import Loading from '../../../components/particial/Loading';

import { styles, StoppedCandidateColumns as columns } from '../params';

class StoppedCandidateTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataList: props.dataList,
      filteredIndex: getIndexList(props.dataList),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.dataList.equals(state.dataList)) {
      return {
        dataList: props.dataList,
        filteredIndex: getIndexList(props.dataList),
      };
    }
    return null;
  }

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

  render() {
    const { t, title, timeRange, classes, handleClickStoppedCandidateCount } =
      this.props;
    const { loading, dataList, filteredIndex, colSortDirs } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <Typography variant="subtitle1" style={{ margin: '10px' }}>
            {t('tab:Status stayed at')} "{t(`tab:${title.toLowerCase()}`)}"
            {t('tab:formore than')}
            {t(`tab:${timeRange}`)}.
          </Typography>
        </div>

        <Divider />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            handleClickStoppedCandidateCount={handleClickStoppedCandidateCount}
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
      </Paper>
    );
  }
}

export default connect()(withStyles(styles)(StoppedCandidateTable));
