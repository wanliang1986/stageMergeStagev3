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
import InternalDropDown from '../../../components/InternalReportDropDown';

import {
  getInternalReport,
  InternalReportDown,
} from '../../../actions/clientActions';
import { connect } from 'react-redux';
import { AMJobType } from '../../../constants/formOptions';
import Loading from '../../../components/particial/Loading';
import PotentialButton from '../../../components/particial/PotentialButton';
import { getAllTenantUserList } from '../../../selectors/userSelector';

const userRole = [
  { label: 'Recruiter', value: 'RECRUITER' },
  { label: 'Sourcer', value: 'SOURCER' },
];
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
    colName: 'Recruiter',
    colWidth: 150,
    col: 'recruiter',
    type: 'names',
    flexGrow: 1,
    // disableSearch: true,
    sortable: true,
  },
  {
    colName: 'Sourcer',
    colWidth: 220,
    col: 'sourcer',
    flexGrow: 1,
    type: 'names',
    sortable: true,
  },
];
let status = { filters: Immutable.Map(), filterOpen: true };

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class InternalPerformanceReport extends Component {
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

      selectedUser: { fullName: 'All', id: 'All' },
      selectedUserId: props._userList
        .map((item, index) => {
          return item.get('id');
        })
        .toJS(),
      selectedUserRole: null,
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
      candidate: this.state.selectedUserId,
      jobType: this.state.jobType,
      companyId: this.props.company.get('id'),
      userRole: this.state.selectedUserRole
        ? this.state.selectedUserRole.value
        : null,
    };
    this.props.dispatch(getInternalReport(params)).then((res) => {
      if (res) {
        this.setState({
          summary: Immutable.Map(res.response.summary),
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
    let params = {
      candidate: this.state.selectedUserId,
      jobType: this.state.jobType,
      companyId: this.props.company.get('id'),
      userRole: this.state.selectedUserRole
        ? this.state.selectedUserRole.value
        : null,
    };
    this.props.dispatch(InternalReportDown(params)).then((res) => {
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

  selectedUser = (user) => {
    const { _userList } = this.props;
    if (user.id === 'All') {
      let selectedUserId = _userList.map((item, index) => {
        return item.get('id');
      });
      this.setState(
        {
          selectedUser: user,
          selectedUserId: selectedUserId,
          selectedUserRole: null,
        },
        () => {
          this.fetchData();
        }
      );
    } else {
      let selectedUserId = [user.id];
      this.setState(
        {
          selectedUser: user,
          selectedUserId: selectedUserId,
        },
        () => {
          if (this.state.selectedUserRole) {
            this.fetchData();
          }
        }
      );
    }
  };

  selectedUserRole = (role) => {
    this.setState(
      {
        selectedUserRole: role,
      },
      () => {
        this.fetchData();
      }
    );
  };

  render() {
    const { classes, company, jobData, t, userList } = this.props;
    const {
      filters,
      filterOpen,
      colSortDirs,
      summary,
      filteredIndex,
      contactList,
      downloading,
      selectedUser,
      selectedUserRole,
      selectedUserId,
    } = this.state;
    const companyId = company.get('id');
    const amReportList = filteredIndex.map((index) => jobData.get(index));
    return (
      <div className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Paper variant="outlined">
              <div className={classes.title}>
                {t('tab:Summary')}{' '}
                {selectedUserId.length === 1 && selectedUserRole
                  ? `- ${selectedUser.fullName} (${selectedUserRole.label})`
                  : ''}
              </div>
              <Divider />
              <div className={classes.count}>
                {summary ? (
                  <Grid container>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>{t('tab:Submission')} </p>
                      <h5>
                        {summary && summary.get('submitToAm')
                          ? summary.get('submitToAm')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:submitted to client')}
                      </p>
                      <h5>
                        {summary && summary.get('submitToClient')
                          ? summary.get('submitToClient')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>{t('tab:interview')}</p>
                      <h5>
                        {summary && summary.get('interview')
                          ? summary.get('interview')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:offered by client')}
                      </p>
                      <h5>
                        {summary && summary.get('offerByClient')
                          ? summary.get('offerByClient')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>
                        {t('tab:offer accepted')}
                      </p>
                      <h5>
                        {summary && summary.get('offerAccept')
                          ? summary.get('offerAccept')
                          : 0}
                      </h5>
                    </Grid>
                    <Grid item xs={2} style={{ padding: '10px' }}>
                      <p className={classes.fontSty}>{t('tab:on boarded')}</p>
                      <h5>
                        {summary && summary.get('onBoard')
                          ? summary.get('onBoard')
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
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <InternalDropDown
              label={t('tab:Job Type')}
              options={AMJobType}
              selected={(arr) => {
                this.jobTypeSelected(arr);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <FormReactSelectContainer label={'User Name'}>
              <Select
                options={userList.toJS()}
                value={selectedUser}
                valueKey={'id'}
                labelKey={'fullName'}
                autoBlur={true}
                searchable={true}
                clearable={false}
                onChange={(user) => {
                  this.selectedUser(user);
                }}
              />
            </FormReactSelectContainer>
          </Grid>
          {selectedUserId.length === 1 && (
            <Grid item xs={2}>
              <FormReactSelectContainer label={'User Role'}>
                <Select
                  options={userRole}
                  value={selectedUserRole}
                  valueKey={'label'}
                  labelKey={'label'}
                  autoBlur={true}
                  searchable={true}
                  clearable={false}
                  onChange={(role) => {
                    this.selectedUserRole(role);
                  }}
                />
              </FormReactSelectContainer>
            </Grid>
          )}
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
              type={1}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  const jobData = state.model.internalReport;
  return {
    jobData: jobData,
    userList: getAllTenantUserList(state).unshift({
      fullName: 'All',
      id: 'All',
    }),
    _userList: getAllTenantUserList(state),
  };
};
export default connect(mapStoreStateToProps)(
  withStyles(styles)(InternalPerformanceReport)
);
