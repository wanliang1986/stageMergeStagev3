import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Immutable from 'immutable';
import AmReportTable from '../../../components/Tables/AmReportTable';

import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';
import { getIndexList, sortList } from '../../../../utils';
import AmReportDropDown from '../../../components/AmReportDropDown';

import {
  getAmReport,
  getHrInfo,
  amReportDown,
} from '../../../actions/clientActions';
import { connect } from 'react-redux';
import { AMJobType } from '../../../constants/formOptions';
import Loading from '../../../components/particial/Loading';
import PotentialButton from '../../../components/particial/PotentialButton';
const styles = {
  root: {
    padding: '15px',
  },
  title: {
    width: '100%',
    height: '50px',
    backgroundColor: '#efefef',
    lineHeight: '50px',
    padding: '0px 10px',
    fontSize: '20px',
  },
  count: {
    width: '100%',
    height: '80px',
  },
  fontSty: {
    fontSize: '13px',
    color: '#939393',
  },
  tableBox: {
    height: '400px',
  },
};

const columns = [
  {
    colName: 'Candidate Name',
    colWidth: 180,
    col: 'fullName',
    type: 'name',
    fixed: true,
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'Applied Job Title',
    colWidth: 180,
    col: 'jobTitle',
    type: 'jobTitle',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'Current Status',
    colWidth: 180,
    col: 'activityStatus',
    type: 'enum',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'Interview Info',
    colWidth: 200,
    col: 'interviewInfo',
    type: 'info',
    flexGrow: 1,
    sortable: true,
  },
  {
    colName: 'Submitted Date',
    colWidth: 150,
    col: 'submitDate',
    type: 'date',
    flexGrow: 1,
    disableSearch: true,
    sortable: true,
  },
  {
    colName: 'Aging Days',
    colWidth: 150,
    col: 'agingDays',
    type: 'agingDays',
    flexGrow: 1,
    tooltip: true,
    disableSearch: true,
    sortable: true,
  },
  {
    colName: 'Highlighted Experience',
    colWidth: 220,
    col: 'highlightedExperience',
    flexGrow: 1,
    type: 'Experience',
    sortable: true,
  },
  {
    colName: 'AM Updates',
    colWidth: 150,
    col: 'note',
    type: 'updates',
    flexGrow: 1,
    sortable: true,
  },
];
let status = { filters: Immutable.Map(), filterOpen: true };

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class AmReport extends Component {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);
    this.state = {
      jobType: null,
      candidate: null,
      filters: status.filters || Immutable.Map(),
      contactList: [],
      summary: null,
      jobDataList: Immutable.List(),
      filterOpen: status.filterOpen,
      filteredIndex: getIndexList(
        this.props.jobData,
        status.filters,
        status.colSortDirs
      ),
      downloading: false,
    };
  }

  componentWillUnmount() {
    clearTimeout(this.fTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  componentDidMount() {
    this.fetchData();
  }

  static getDerivedStateFromProps(props, state) {
    const filteredIndex = getIndexList(
      props.jobData,
      state.filters,
      state.colSortDirs
    );
    if (!filteredIndex.equals(state.filteredIndex)) {
      return { filteredIndex };
    }
    return null;
  }

  fetchData = () => {
    let params = {
      candidate: this.state.candidate,
      jobType: this.state.jobType,
      companyId: this.props.company.get('id'),
    };
    this.props.dispatch(getAmReport(params)).then((res) => {
      if (res) {
        this.setState({
          summary: Immutable.Map(res.response.summary),
        });
      }
    });

    this.props.dispatch(getHrInfo(this.props.company.get('id'))).then((res) => {
      if (res && res.response) {
        let list = this.setHrList(res.response);
        this.setState({
          contactList: list,
        });
      }
    });
  };

  setHrList = (arr) => {
    let list = [];
    arr.forEach((item, index) => {
      let obj = {
        value: item.hmId,
        label: item.name,
      };
      list.push(obj);
    });
    return list;
  };

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if ((filters.get(col) || '') === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }
    this.setState({
      filters,
      filteredIndex: getIndexList(
        this.props.jobData,
        filters,
        this.state.colSortDirs
      ),
    });
  };
  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;
    filteredIndex = sortDir
      ? sortList(
          this.state.filteredIndex,
          this.props.jobData,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.jobData, this.state.filters);

    this.setState({
      filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  downLoad = () => {
    this.setState({
      downloading: true,
    });
    this.props
      .dispatch(amReportDown(this.props.company.get('id')))
      .then((res) => {
        this.setState({
          downloading: false,
        });
      });
  };

  jobTypeSelected = (arr) => {
    if (arr.indexOf('All') > -1 || arr.length === 0) {
      this.setState(
        {
          jobType: null,
        },
        () => {
          this.fetchData();
        }
      );
    } else {
      this.setState(
        {
          jobType: arr,
        },
        () => {
          this.fetchData();
        }
      );
    }
  };

  contactSelect = (arr) => {
    if (arr.indexOf('All') !== -1 || arr.length === 0) {
      this.setState(
        {
          candidate: null,
        },
        () => {
          this.fetchData();
        }
      );
    } else {
      this.setState(
        {
          candidate: arr,
        },
        () => {
          this.fetchData();
        }
      );
    }
  };

  render() {
    const { classes, company, jobData, t } = this.props;
    const {
      filters,
      filterOpen,
      colSortDirs,
      summary,
      filteredIndex,
      contactList,
      downloading,
    } = this.state;
    const companyId = company.get('id');
    const amReportList = filteredIndex.map((index) => jobData.get(index));
    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Paper variant="outlined">
              <div className={classes.title}>
                {t('tab:Summary')} - {company.get('name')}
              </div>
              <Divider />
              <div className={classes.count}>
                {summary ? (
                  <Grid container>
                    <Grid item xs={1} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}> {t('tab:Active Jobs')}</p>
                      <h5>
                        {summary && summary.get('activeJob')
                          ? summary.get('activeJob')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:Weekly New Candidates')}
                      </p>
                      <h5>
                        {summary && summary.get('newCandidate')
                          ? summary.get('newCandidate')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:Active Candidates')}
                      </p>
                      <h5>
                        {summary && summary.get('activeCandidate')
                          ? summary.get('activeCandidate')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:Total Candidates')}
                      </p>
                      <h5>
                        {summary && summary.get('totalCandidate')
                          ? summary.get('totalCandidate')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:Total Offers by Clients')}
                      </p>
                      <h5>
                        {summary && summary.get('totalOffersByClient')
                          ? summary.get('totalOffersByClient')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:Total Offers Accepted')}
                      </p>
                      <h5>
                        {summary && summary.get('totalOfferAccepted')
                          ? summary.get('totalOfferAccepted')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={1} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:Total On Boarded')}
                      </p>
                      <h5>
                        {summary && summary.get('totalOnBoard')
                          ? summary.get('totalOnBoard')
                          : 0}
                      </h5>
                    </Grid>
                  </Grid>
                ) : (
                  <Loading />
                )}
              </div>
            </Paper>
          </Grid>
          <Grid item xs={2} style={{ textAlign: 'right' }}>
            <PotentialButton
              processing={downloading}
              onClick={() => {
                this.downLoad();
              }}
            >
              {t('tab:Download')}
            </PotentialButton>
            {/* <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                this.downLoad();
              }}
            >
              Download
            </Button> */}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <AmReportDropDown
              label={t('tab:Job Type')}
              options={AMJobType}
              selected={(arr) => {
                this.jobTypeSelected(arr);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <AmReportDropDown
              label={t('tab:Contact')}
              options={contactList}
              selected={(arr) => {
                this.contactSelect(arr);
              }}
            />
          </Grid>
        </Grid>
        <div className={classes.tableBox}>
          {amReportList && (
            <AmReportTable
              jobData={amReportList}
              companyId={companyId}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              filters={filters}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              fetchData={this.fetchData}
              t={t}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  const jobData = state.model.amReport;
  return {
    jobData: jobData,
  };
};
export default connect(mapStoreStateToProps)(withStyles(styles)(AmReport));
