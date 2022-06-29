import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { getDBMyCandidateList } from '../../../actions/dashboard';
import {
  makeCancelable,
  // getIndexList,
  // sortList,
  getRanges,
} from '../../../../utils';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';

import { DateRangePicker } from 'rsuite';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';
import DashboardTable from '../Tables/DashboardTable';
import ApplicationGraph from './ApplicationGraph';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';

import CandidatesTable from '../Tables/CandidatesTable';

const styles = {
  root: {
    padding: '14px 24px',
  },
  container: {
    overflow: 'hidden',
    position: 'relative',
    //todo:control height from parent
    height: 240,
  },
  half: {
    flex: '0 0 720px',
    overflow: 'hidden',
    position: 'relative',
    height: 370,
    marginBottom: '20px',
  },
  graph: {
    flex: '0 0 580px',
    // marginTop: '46px',
    transform: 'translateY(66px)',
    overflow: 'hidden',
    position: 'relative',
    height: 350,
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
  columns: {
    padding: '0 8px',
    flex: 1,
  },
  checkboxes: {
    display: 'flex',
  },
};
let status = {
  recruiter: true,
  am: false,
  sourcer: false,
};

const columns = [
  {
    colName: 'name',
    colWidth: 120,
    col: 'fullName',
    type: 'candidateName',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 140,
    col: 'jobTitle',
    type: 'candidateJob',
    flexGrow: 1,
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'company',
    colWidth: 100,
    col: 'company',
    sortable: true,
    disableSearch: true,
  },

  {
    colName: 'status',
    colWidth: 200,
    col: 'status',
    type: 'enum',
    flexGrow: 1,
    sortable: true,
  },
  // {
  //   colName: 'Last Updated By',
  //   colWidth: 150,
  //   flexGrow: 1,
  //   col: 'latestActivityUpdatedBy',
  //   sortable: true
  // },
  {
    colName: 'Last Updated At',
    colWidth: 140,
    flexGrow: 1,
    col: 'lastModifiedDate',
    sortable: true,
    type: 'date',
    disableSearch: true,
  },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class MyDBCandidates extends React.Component {
  constructor(props) {
    super(props);
    // console.log('indec', props.myDBCandidates.toJS());
    this.state = {
      range: status.range || [
        dateFns.startOfWeek(new Date()),
        dateFns.endOfToday(),
      ],
      searching: true,
      dataAll: Immutable.List(),
      dataShow: Immutable.List(),
      colSortDirs: {},
      candidateCountData: {},

      syncDashboard: props.syncDashboard,
      recruiter: status.recruiter,
      am: status.am,
      sourcer: status.sourcer,
      filters: Immutable.Map(),
    };
    this.chart = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.task.cancel();
    status.recruiter = this.state.recruiter;
    status.am = this.state.am;
    status.sourcer = this.state.sourcer;
    status.period = this.state.period;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.syncDashboard !== prevProps.syncDashboard &&
      this.props.syncDashboard === true
    ) {
      this.fetchData();
    }
  }

  fetchData = () => {
    this.setState({ searching: true });
    const { range, recruiter, am, sourcer } = this.state;
    console.log('range', range);
    this.task = makeCancelable(
      this.props.dispatch(
        getDBMyCandidateList(
          Math.ceil(range[0].valueOf() / 1000),
          Math.ceil(range[1].valueOf() / 1000),
          recruiter,
          am,
          sourcer
        )
      )
    );
    this.task.promise.then((res) => {
      const dataAll = Immutable.fromJS(res);
      let dataShow = dataAll;
      this.state.filters.mapEntries(([k, v]) => {
        // console.log('ll',k,v);
        if (k === 'status') {
          dataShow = dataShow.filter((ele) => ele.get('status') === v);
        }
        if (k === 'fullName') {
          const reg = new RegExp(v, 'i');
          dataShow = dataShow.filter((ele) => reg.test(ele.get('fullName')));
        }
      });
      dataShow = sortData(dataShow, this.state.colSortDirs);
      this.setState({
        searching: false,
        dataAll,
        dataShow,
      });
    });
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range }, () => {
      status.range = this.state.range;
      this.fetchData();
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({
      colSortDirs: sort,
      dataShow: sortData(this.state.dataShow, sort),
    });
  };

  isMatch = (data, value, key) => {};

  onFilter = (input) => {
    let filters = this.state.filters;
    let col = input.name;
    let query = input.value;

    let dataShow = this.state.dataAll;

    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    // console.log('filters',filters.toJS(),query);
    filters.mapEntries(([k, v]) => {
      // console.log('ll',k,v);
      if (k === 'status') {
        dataShow = dataShow.filter((ele) => ele.get('status') === v);
      }
      if (k === 'fullName') {
        const reg = new RegExp(v, 'i');
        dataShow = dataShow.filter((ele) => reg.test(ele.get('fullName')));
      }
    });

    this.setState({
      dataShow,
      filters,
    });
  };

  handleChange = (name) => (event) => {
    const options = {};
    let count = 0;
    const recruiter = document.getElementById('recruiter').checked;
    const am = document.getElementById('am').checked;
    const sourcer = document.getElementById('sourcer').checked;
    if (recruiter) {
      options.recruiter = true;
      count++;
    } else {
      options.recruiter = false;
    }

    if (am) {
      options.am = true;
      count++;
    } else {
      options.am = false;
    }

    if (sourcer) {
      options.sourcer = false;
      count++;
    } else {
      options.sourcer = true;
    }
    console.log('count', count, name, options, options[name]);
    if (count === 0) {
      this.setState({ [name]: true });
      return;
    }

    this.setState(
      { [name]: event.target.checked, filters: Immutable.Map() },
      () => this.fetchData()
    );
  };

  render() {
    const { classes, t, i18n, myDBCandidates } = this.props;

    const isZH = i18n.language.match('zh');
    const { searching, colSortDirs, range, dataShow, recruiter, am, sourcer } =
      this.state;

    return (
      <Paper className={classes.root}>
        <div
          className="flex-container align-justify"
          style={{ marginBottom: 12 }}
        >
          <Typography variant="h6">{t('tab:myCandidates')}</Typography>
          <Link href="/candidates?tab=my">{t('tab:More')} </Link>
        </div>
        <div
          className="flex-container align-middle"
          style={{ marginBottom: 8 }}
        >
          <div style={{ marginRight: 20 }}>
            <FormReactSelectContainer>
              <DateRangePicker
                value={range}
                ranges={getRanges(t)}
                cleanable={false}
                toggleComponentClass={CustomToggleButton}
                size="md"
                style={{ height: 32 }}
                block
                onChange={this.handleDateRangeChange}
                placeholder={t('message:selectDateRange')}
                locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
              />
            </FormReactSelectContainer>
          </div>

          <FormControl component="fieldset">
            <div className={classes.checkboxes}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={recruiter}
                    onChange={this.handleChange('recruiter')}
                    id="recruiter"
                    value="recruiter"
                    color="primary"
                  />
                }
                label={t('tab:Recruiter')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={am}
                    onChange={this.handleChange('am')}
                    value="am"
                    id="am"
                    color="primary"
                  />
                }
                label={t('tab:AM')}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={sourcer}
                    onChange={this.handleChange('sourcer')}
                    value="sourcer"
                    id="sourcer"
                    color="primary"
                  />
                }
                label={t('tab:Sourcer')}
              />
            </div>
          </FormControl>
        </div>
        <Divider />
        <div className="flex-container align-justify">
          <div style={styles.half}>
            <DashboardTable
              data={dataShow}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              filterOpen={true}
              filters={this.state.filters}
              onFilter={this.onFilter}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              columns={columns}
              t={t}
            />
            {/* <CandidatesTable
              t={t}
              rowData={myDBCandidates.toJS()}

            /> */}
            {searching && <Loading style={styles.mask} />}
          </div>
          <div style={styles.graph}>
            <ApplicationGraph data={myDBCandidates} t={t} />
          </div>
        </div>
      </Paper>
    );
  }
}

MyDBCandidates.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    myDBCandidates: state.model.dashboard.toList(),
    //   applicationList: applicationSelector(state, applicationId)
  };
};

export default connect(mapStateToProps)(withStyles(styles)(MyDBCandidates));

const applicationStatus = {
  Applied: 1,
  Qualified: 2,
  Internal_Rejected: 3,
  Called_Candidate: 4,
  Meet_Candidate_In_Person: 5,
  Submitted: 6,
  Client_Rejected: 7,
  Interview: 8,
  Shortlisted_By_Client: 9,

  Offered: 10,
  Offer_Rejected: 11,
  Offer_Accepted: 12,
  Started: 13,
  Candidate_Quit: 14,
};

function sortData(data, sort) {
  sort = Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['id'];

  if (sort[0] === 'status') {
    return data.sortBy(
      (myCandidate) => myCandidate.get(sort[0]),
      (a, b) => {
        if (sort[1] === 'ASC') {
          return applicationStatus[a] - applicationStatus[b];
        } else {
          return applicationStatus[b] - applicationStatus[a];
        }
      }
    );
  } else {
    return data.sortBy(
      (myCandidate) => myCandidate.get(sort[0]),
      (a, b) => {
        if (a < b) {
          return -((sort[1] === 'ASC') - 0.5);
        }
        if (a > b) {
          return (sort[1] === 'ASC') - 0.5;
        }
        if (a === b) {
          return 0;
        }
      }
    );
  }
}
