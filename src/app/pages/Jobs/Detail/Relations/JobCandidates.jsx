import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  sortList,
  getIndexList,
  getNewFilters,
} from '../../../../../utils/index';
import Immutable from 'immutable';
import applicationSelector from '../../../../selectors/applicationSelector';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import FilterIcon from '@material-ui/icons/FilterList';

import { newGetJobApplications } from '../../../../actions/jobActions';
import ApplicationTable from '../../../../components/Tables/ApplicationTable';
import ApplyCandidate from '../ApplyCandidates';
import { AssignCandidateIcon } from '../../../../components/Icons';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import DraggablePaperComponent from '../../../../components/particial/DraggablePaperComponent';

const columns = [
  {
    colName: 'name&email',
    colWidth: 160,
    flexGrow: 2,
    col: 'fullName',
    fixed: true,
    sortable: true,
    type: 'link',
  },
  {
    colName: 'status',
    colWidth: 200,
    flexGrow: 1,
    col: 'applicationStatus',
    type: 'enum',
    sortable: true,
  },
  // {
  //   colName: 'phone',
  //   colWidth: 140,
  //   flexGrow: 1,
  //   col: 'phone'
  // },

  {
    colName: 'Recruiter',
    colWidth: 130,
    flexGrow: 0,
    col: 'recruiterNames',
    type: 'recruiterNames',
    sortable: true,
  },
  {
    colName: 'score1',
    colWidth: 110,
    flexGrow: 0,
    col: 'score',
    type: 'score',
    sortable: true,
  },
  {
    colName: 'score2',
    colWidth: 120,
    flexGrow: 0,
    col: 'customScore',
    type: 'score',
    sortable: true,
  },

  {
    colName: 'lastUpdate',
    colWidth: 130,
    flexGrow: 0,
    col: 'lastModifiedDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'expectedSalary',
    colWidth: 140,
    flexGrow: 0,
    type: 'tooltip',
    col: 'expectedPayRate',
  },
  {
    colName: 'agreedPayRate',
    colWidth: 200,
    flexGrow: 0,
    type: 'payRate',
    col: 'agreedPayRate',
  },
  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
    type: 'tooltipList',
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    flexGrow: 2,
    col: 'title',
    type: 'tooltipList',
    sortable: true,
  },
];

const styles = {
  submitToAm: {
    backgroundColor: '#f5f5f5',
    padding: '0px 15px 0px 10px',
    flexShrink: 0,
    fontSize: 14,
    height: 30,
    textAlign: 'right',
    lineHeight: '30px',
    minWidth: 80,
    cursor: 'pointer',
  },
  submitToAmChecked: {
    backgroundColor: '#edf5ff',
    padding: '0px 15px 0px 10px',
    fontSize: 14,
    flexShrink: 0,
    color: '#3398dc',
    height: 30,
    textAlign: 'right',
    lineHeight: '30px',
    minWidth: 80,
    cursor: 'pointer',
  },
  yarrow: {
    backgroundColor: '#f5f5f5',
    position: 'relative',
    float: 'left',
    display: 'inline',
    width: '8px',
    height: 30,
  },
  ynext: {
    position: 'absolute',
    display: 'block',
    left: 0,
    top: '-3px',
    height: 0,
    width: 0,
    overflow: 'hidden',
    border: 'solid 10px transparent',
    borderWidth: '16px 10px',
    borderLeftColor: '#fff',
  },
  yprev: {
    position: 'absolute',
    display: 'block',
    left: 0,
    top: 0,
    height: 0,
    width: 0,
    overflow: 'hidden',
    border: 'solid 10px transparent',
    borderWidth: '13px 8px',
    borderLeftColor: '#f5f5f5',
  },
  ycurrent: {
    position: 'absolute',
    display: 'block',
    left: 0,
    top: 0,
    height: 0,
    width: 0,
    overflow: 'hidden',
    border: 'solid 10px transparent',
    borderWidth: '13px 8px',
    borderLeftColor: '#edf5ff',
  },
};

class JobCandidates extends React.PureComponent {
  constructor(props) {
    super();

    this.state = {
      open: false, // open candidate form,
      filteredApplicationIndex: props.applicationList.map(
        (value, index) => index
      ), //index of filteredList
      filters: Immutable.Map(),
      filterOpen: false,
      colSortDirs: {},
      type: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.applicationList.equals(this.props.applicationList)) {
      this.setState({
        filteredApplicationIndex: getIndexList(
          nextProps.applicationList,
          this.state.filters,
          this.state.colSortDirs
        ),
      });
    }
  }

  handleOpenApply = () => {
    this.setState({ open: true });
  };

  handleCloseApply = () => {
    const { jobId } = this.props;
    this.setState({ open: false });
    this.props.dispatch(newGetJobApplications(jobId));
  };

  onFilter = (input) => {
    let filters = getNewFilters(input, this.state.filters);
    if (filters)
      this.setState({
        filters,
        filteredApplicationIndex: getIndexList(
          this.props.applicationList,
          filters,
          this.state.colSortDirs
        ),
      });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.filteredApplicationIndex,
          this.props.applicationList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.applicationList, this.state.filters);

    this.setState({
      filteredApplicationIndex: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  filterData = (type) => {
    this.setState({
      type,
    });
  };

  render() {
    const {
      showAction,
      applicationList,
      notificationList,
      jobId,
      jobType,
      internal,
      classes,
      ...props
    } = this.props;
    if (!props.canEdit && internal) {
      return (
        <div>
          <Typography variant="h5" className=" container-padding">
            {props.t('message:privateToUser')}
          </Typography>
        </div>
      );
    }

    const {
      filteredApplicationIndex,
      open,
      filterOpen,
      colSortDirs,
      filters,
      type,
    } = this.state;

    const filteredJobActivityList = filteredApplicationIndex.map((index) =>
      applicationList.get(index)
    );
    let filteredJobActivityListTwo =
      filteredJobActivityList && filteredJobActivityList.toJS();
    let submitAmNum = 0;
    let submitClientNum = 0;
    let interviewNum = 0;
    let offerNum = 0;
    let onboardNum = 0;
    let eliminatedNum = 0;
    filteredJobActivityListTwo &&
      filteredJobActivityListTwo.map((item) => {
        if (item.status === 'Applied' || item.status === 'Qualified') {
          submitAmNum = submitAmNum + 1;
        } else if (
          item.status === 'Submitted' ||
          item.status === 'Shortlisted_By_Client'
        ) {
          submitClientNum = submitClientNum + 1;
        } else if (item.status === 'Interview') {
          interviewNum = interviewNum + 1;
        } else if (
          item.status === 'Offered' ||
          item.status === 'Offer_Accepted'
        ) {
          offerNum = offerNum + 1;
        } else if (
          item.status === 'Internal_Rejected' ||
          item.status === 'Client_Rejected' ||
          item.status === 'Offer_Rejected' ||
          item.status === 'Candidate_Quit' ||
          (item.status === 'START_FAIL_WARRANTY' && jobType === 'FULL_TIME') ||
          (item.status === 'START_TERMINATED' && jobType === 'CONTRACT')
        ) {
          eliminatedNum = eliminatedNum + 1;
        } else if (
          item.status === 'Started' ||
          item.status === 'START_EXTENSION'
        ) {
          onboardNum = onboardNum + 1;
        }
      });

    const newFilteredJobActivityList = type
      ? filteredJobActivityList.filter((application) => {
          if (type === 'Offered') {
            return (
              application.get('status') === 'Offered' ||
              application.get('status') === 'Offer_Accepted'
            );
          } else if (type === 'Offer_Rejected') {
            return (
              application.get('status') === 'Internal_Rejected' ||
              application.get('status') === 'Client_Rejected' ||
              application.get('status') === 'Offer_Rejected' ||
              application.get('status') === 'Candidate_Quit' ||
              (jobType === 'FULL_TIME'
                ? application.get('status') === 'START_FAIL_WARRANTY'
                : null) ||
              (jobType === 'CONTRACT'
                ? application.get('status') === 'START_TERMINATED'
                : null)
            );
          } else if (type === 'Applied') {
            return (
              application.get('status') === 'Applied' ||
              application.get('status') === 'Qualified'
            );
          } else if (type === 'Submitted') {
            return (
              application.get('status') === 'Submitted' ||
              application.get('status') === 'Shortlisted_By_Client'
            );
          } else if (type === 'Started') {
            return (
              application.get('status') === 'Started' ||
              application.get('status') === 'START_EXTENSION'
            );
          } else {
            return application.get('status') === type;
          }
        })
      : filteredJobActivityList;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        {applicationList.size === 0 ? (
          <div>
            <Typography variant="h5" className=" container-padding">
              {props.t('message:noJobApplication')}
            </Typography>
            {showAction && (
              <div className=" container-padding">
                <PrimaryButton onClick={this.handleOpenApply}>
                  {props.t('action:applyCandidate')}
                </PrimaryButton>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-child-auto flex-container flex-dir-column">
            {showAction && (
              <div>
                <div
                  className="flex-container align-middle item-padding"
                  style={{ height: 56 }}
                >
                  <IconButton onClick={this.handleOpenApply}>
                    <AssignCandidateIcon />
                  </IconButton>
                  {/* <IconButton
                    onClick={() => this.setState({ filterOpen: !filterOpen })}
                    color={filterOpen ? 'primary' : 'default'}
                  >
                    <FilterIcon />
                  </IconButton> */}
                </div>
                <div
                  style={{
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    overflowX: 'scroll',
                  }}
                >
                  <div
                    className={
                      !type ? classes.submitToAmChecked : classes.submitToAm
                    }
                    onClick={() => {
                      this.filterData('');
                    }}
                  >
                    {`${props.t('tab:All Candidates')} (${
                      filteredJobActivityList.size
                    })`}
                  </div>

                  <span className={classes.yarrow}>
                    <span className={classes.ynext}></span>
                    <span className={classes.yprev}></span>
                  </span>
                  {jobType === 'PAY_ROLL' ? null : (
                    <>
                      <div
                        className={
                          type === 'Applied'
                            ? classes.submitToAmChecked
                            : classes.submitToAm
                        }
                        onClick={() => {
                          this.filterData('Applied');
                        }}
                      >
                        {`${props.t('tab:submitted to am')} (${submitAmNum})`}
                      </div>

                      <span className={classes.yarrow}>
                        <span className={classes.ynext}></span>
                        <span className={classes.yprev}></span>
                      </span>

                      <div
                        className={
                          type === 'Submitted'
                            ? classes.submitToAmChecked
                            : classes.submitToAm
                        }
                        onClick={() => {
                          this.filterData('Submitted');
                        }}
                      >
                        {`${props.t(
                          'tab:submitted to client'
                        )} (${submitClientNum})`}
                      </div>

                      <span className={classes.yarrow}>
                        <span className={classes.ynext}></span>
                        <span className={classes.yprev}></span>
                      </span>

                      <div
                        className={
                          type === 'Interview'
                            ? classes.submitToAmChecked
                            : classes.submitToAm
                        }
                        onClick={() => {
                          this.filterData('Interview');
                        }}
                      >
                        {`${props.t('tab:interview')} (${interviewNum})`}
                      </div>

                      <span className={classes.yarrow}>
                        <span className={classes.ynext}></span>
                        <span className={classes.yprev}></span>
                      </span>
                    </>
                  )}

                  <div
                    className={
                      type === 'Offered'
                        ? classes.submitToAmChecked
                        : classes.submitToAm
                    }
                    onClick={() => {
                      this.filterData('Offered');
                    }}
                  >
                    {`${props.t('tab:offer')} (${offerNum})`}
                  </div>

                  <span className={classes.yarrow}>
                    <span className={classes.ynext}></span>
                    <span className={classes.yprev}></span>
                  </span>

                  <div
                    className={
                      type === 'Started'
                        ? classes.submitToAmChecked
                        : classes.submitToAm
                    }
                    onClick={() => {
                      this.filterData('Started');
                    }}
                  >
                    {`${props.t('tab:onboard')}  (${onboardNum})`}
                  </div>

                  {jobType === 'PAY_ROLL' ? null : (
                    <>
                      <span className={classes.yarrow}>
                        <span className={classes.ynext}></span>
                        <span className={classes.yprev}></span>
                      </span>

                      <div
                        className={
                          type === 'Offer_Rejected'
                            ? classes.submitToAmChecked
                            : classes.submitToAm
                        }
                        onClick={() => {
                          this.filterData('Offer_Rejected');
                        }}
                      >
                        {`${props.t('tab:eliminated')} (${eliminatedNum})`}
                      </div>
                    </>
                  )}
                </div>
                <Divider />
              </div>
            )}

            <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
              <ApplicationTable
                applicationList={newFilteredJobActivityList}
                filterOpen={filterOpen}
                filters={filters}
                onFilter={this.onFilter}
                colSortDirs={colSortDirs}
                onSortChange={this.onSortChange}
                columns={columns}
                t={props.t}
                mode={'jobCandidatesSelect'}
              />
            </div>
          </div>
        )}

        <Dialog
          open={open}
          fullWidth
          maxWidth="md"
          disableEnforceFocus
          PaperComponent={DraggablePaperComponent}
        >
          <ApplyCandidate
            jobId={jobId}
            t={props.t}
            handleRequestClose={this.handleCloseApply}
          />
        </Dialog>
      </div>
    );
  }
}

JobCandidates.propTypes = {
  jobId: PropTypes.string.isRequired,
  notificationList: PropTypes.instanceOf(Immutable.List),
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state, { jobId }) {
  return {
    applicationList: applicationSelector(state, jobId),
    showAction: state.router.location.pathname.search('/jobs/detail') === 0,
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(JobCandidates));
