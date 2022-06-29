import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
import { commonAIRecommendedJobList } from '../../../../actions/jobActions';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import moment from 'moment-timezone';
import Loading from '../../../../components/particial/Loading';
import { getRecommendations } from '../../../../selectors/jobSelectors';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import { Alert } from '@material-ui/lab';
import { showErrorMessage } from '../../../../actions/index';

const defaultColDef = {
  // width: 150,
  editable: false, //是否开启单元格编辑,true开启，false关闭
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true, //是否单独出现搜索框
  resizable: true,
};

const columns = [
  {
    colName: 'Job Title',
    column: 'title',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
  },
  {
    colName: 'Company',
    column: 'companyName',
    colWidth: 200,
    flexGrow: 3,
    col: 'companyName',
  },
  {
    colName: 'Job ID',
    column: 'id',
    colWidth: 200,
    flexGrow: 3,
    col: 'id',
  },
  // {
  //   colName: 'AI Score',
  //   column: 'score',
  //   colWidth: 200,
  //   flexGrow: 3,
  //   col: 'score',
  // },
  {
    colName: 'Posting Date',
    column: 'postingTime',
    colWidth: 200,
    flexGrow: 3,
    col: 'postingTime',
  },
  {
    colName: 'Skills',
    column: 'skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'skills',
  },
];

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '10px',
    '& .MuiSnackbar-root .MuiPaper-root': {
      backgroundColor: 'red',
      color: 'white',
    },
  },
};

const SkillsCell = ({ data }) => {
  let preferredSkills = [];
  let requiredSkills = [];
  if (data.requiredSkills) {
    requiredSkills = data.requiredSkills.map((item, index) => {
      return item.skillName;
    });
  }
  if (data.preferredSkills) {
    preferredSkills = data.preferredSkills.map((item, index) => {
      return item.skillName;
    });
  }
  let allSkills = requiredSkills.concat(
    preferredSkills.filter((item) => {
      return requiredSkills.indexOf(item) < 0;
    })
  );
  return (
    <Tooltip
      title={Array.from(new Set(allSkills)).join(',')}
      arrow
      placement="top"
    >
      <div>{Array.from(new Set(allSkills)).join(',')}</div>
    </Tooltip>
  );
};

const PostingTimeCell = ({ data }) => {
  let _data = data.postingTime;
  return <>{moment(_data).format('L')}</>;
};

const ScoreCell = ({ data }) => {
  let _score = data && data.score && Math.round(data.score);
  return (
    <div>
      <div
        style={
          _score >= 60
            ? {
                height: '20px',
                lineHeight: '20px',
                margin: '10px',
                backgroundColor: '#62C477',
                color: 'white',
                borderRadius: '25px',
                textAlign: 'center',
              }
            : {
                height: '20px',
                margin: '10px',
                lineHeight: '20px',
                backgroundColor: '#9E9E9E',
                color: 'white',
                borderRadius: '25px',
                textAlign: 'center',
              }
        }
      >
        {_score}
      </div>
    </div>
  );
};

const JobTitleCell = ({ data }) => {
  let jobId = data.id;
  return (
    <>
      <Link className="job-link" to={`/jobs/detail/${jobId}`}>
        {data.title}
      </Link>
    </>
  );
};

const frameworkComponents = {
  skillsCell: SkillsCell,
  postingTimeCell: PostingTimeCell,
  scoreCell: ScoreCell,
  jobTitleCell: JobTitleCell,
};

class AIRecommendations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      pageStatus: false,
      errorMessage: '',
      loading: false,
      open: true,
      responseObj: {},
    };
  }

  componentDidMount() {
    const { telentId } = this.props;

    if (telentId) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    setInterval(() => {
      clearTimeout(this.task);
    }, 2000);
  }

  fetchData = () => {
    const { telentId, dispatch, errorMessage } = this.props;
    const { page } = this.state;
    this.setState({
      loading: true,
    });
    let encodeTelentId = telentId;
    dispatch(commonAIRecommendedJobList(encodeTelentId, page))
      .then((response) => {
        this.setState({
          responseObj: response,
        });
        switch (response.status) {
          case 'STARTED':
          case 'ON_GOING':
            if (!this.unmounted) {
              this.task = setTimeout(() => {
                clearTimeout(this.task);
                this.fetchData();
              }, 1000);
            }
            break;
          case null:
            this.setState({
              loading: false,
              errorMessage: 'RECOMMEN_DATION_DATA_CANNOT_BE_NULL',
            });
            this.task = setTimeout(() => {
              this.setState({
                open: false,
              });
            }, 2000);
            break;
          case 'ERROR':
          case 'UNABLE_TO_RECOMMEND':
            this.setState({
              loading: false,
              errorMessage: 'UNABLE_TO_RECOMMEND',
            });
            break;
          case 'FINISHED':
            if (response.jobs.length === 0) {
              this.setState({
                loading: false,
                errorMessage: 'NO_RECOMMEND',
              });
            } else {
              this.setState({
                loading: false,
              });
            }
            break;
        }
      })
      .catch((err) => {
        if (err.code === 406) {
          this.setState({
            loading: false,
            errorMessage: 'UNABLE_TO_RECOMMEND',
          });
        } else if (err.code === 404) {
          if (!this.unmounted) {
            this.task = setTimeout(() => {
              if (this.props.selectedTab !== 'AIRecommendations') {
                clearTimeout(this.task);
                return;
              }
              this.fetchData();
            }, 1000);
          }
        } else {
          this.setState({
            loading: false,
          });
          this.props.dispatch(showErrorMessage(err));
        }
      });
  };

  render() {
    const { classes, telentId, jobList, t } = this.props;
    const { loading, errorMessage, open, responseObj } = this.state;
    if (loading) {
      return <Loading></Loading>;
    }
    // 剔除redux数据中的undefined
    const jobListFilter = jobList.toJS().filter((item) => {
      return !!item;
    });
    return (
      <div className={classes.root} id="AItable">
        {jobList && jobList.size > 0 ? (
          <div
            className="ag-theme-alpine"
            style={{ height: '100%', width: '100%' }}
          >
            <AgGridReact
              defaultColDef={defaultColDef}
              rowData={jobListFilter}
              frameworkComponents={frameworkComponents}
              suppressDragLeaveHidesColumns={true}
              onGridReady={this.onGridReady}
              applyColumnDefOrder={true}
              suppressLoadingOverlay={true}
              autoSizePadding={5}
              pagination={true}
              paginationPageSize={15}
              overlayNoRowsTemplate={'<span style="padding: 10px;"></span>'}
            >
              {columns.map((item, index) => {
                if (item.col === 'skills') {
                  return (
                    <AgGridColumn
                      key={index}
                      field={item.column}
                      headerName={item.colName}
                      minWidth="100"
                      resizable={true}
                      cellRenderer="skillsCell"
                    ></AgGridColumn>
                  );
                } else if (item.col === 'postingTime') {
                  return (
                    <AgGridColumn
                      key={index}
                      field={item.column}
                      headerName={item.colName}
                      minWidth="100"
                      resizable={true}
                      cellRenderer="postingTimeCell"
                    ></AgGridColumn>
                  );
                } else if (item.col === 'score') {
                  return (
                    <AgGridColumn
                      key={index}
                      field={item.column}
                      headerName={item.colName}
                      minWidth="100"
                      resizable={true}
                      cellRenderer="scoreCell"
                    ></AgGridColumn>
                  );
                } else if (item.col === 'title') {
                  return (
                    <AgGridColumn
                      key={index}
                      field={item.column}
                      headerName={item.colName}
                      minWidth="100"
                      resizable={true}
                      cellRenderer="jobTitleCell"
                    ></AgGridColumn>
                  );
                } else {
                  return (
                    <AgGridColumn
                      key={index}
                      field={item.column}
                      headerName={item.colName}
                      // flex={1}
                      minWidth="100"
                      resizable={true}
                    ></AgGridColumn>
                  );
                }
              })}
            </AgGridReact>
          </div>
        ) : (
          <div className={'container-padding'}>
            <Alert severity="info" style={{ border: 'solid 1px #3398db' }}>
              {errorMessage
                ? getMessage(errorMessage, telentId, t)
                : t('message:noRecommendedJobs')}
            </Alert>
          </div>
        )}
        {responseObj && responseObj.status === null ? (
          <Snackbar open={open} message="Recommendation data cannot be null" />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state, { telentId }) => {
  return {
    jobList: getRecommendations(state, telentId) || Immutable.List(),
    aiDetailesId: state.controller.newCandidateJob.toJS(),
  };
};

const getMessage = (message, telentId, t) => {
  if (message === 'UNABLE_TO_RECOMMEND') {
    return (
      <>
        <div style={{ color: '#157fc5', fontSize: '15px' }}>
          {t('message:No results found')}
        </div>
        <div>
          {/* {`Please add `}
          {' talent title '} */}
          {/* <Link to={`/candidates/edit/${telentId}`}>{' talent title '}</Link> */}
          {/* {' or '}
          {' skills '} */}
          {/* <Link to={`/candidates/edit/${telentId}`}>{' skills '}</Link> */}
          {'The result will be updated once there is a suitable job.'}
        </div>
      </>
    );
  } else if (message === 'NO_RECOMMEND') {
    return (
      <>
        <div style={{ color: '#157fc5', fontSize: '15px' }}>
          {t('message:No results found')}
        </div>
        <div
          style={{ color: '#157fc5', fontSize: '15px' }}
        >{`The result will be updated once there is a suitable job.`}</div>
      </>
    );
  }
  return message;
};

export default connect(mapStateToProps)(withStyles(styles)(AIRecommendations));
