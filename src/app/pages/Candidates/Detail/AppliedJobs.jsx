import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import moment from 'moment-timezone';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
// import { getApplicationsByTalentId } from '../../../actions/talentActions';
import { getApplicationJobListByTalent } from '../../../selectors/applicationSelector';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

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
    column: 'company',
    colWidth: 200,
    flexGrow: 3,
    col: 'company',
  },
  {
    colName: 'Job ID',
    column: 'id',
    colWidth: 200,
    flexGrow: 3,
    col: 'id',
  },
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
    height: '90%',
    padding: '10px',
  },
};

const CompanyCell = ({ data }) => {
  console.log(data);
  if (data) {
    let companyName = data.company && data.company.name;
    let companyNameTwo = data.companyName;
    return <>{companyName || companyNameTwo}</>;
  }
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

const ScoreCell = ({ data }) => {
  let _score = data.score && Math.round(data.score);

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

const SkillsCell = ({ data }) => {
  let preferredSkills = [];
  let requiredSkills = [];
  if (data.requiredSkills && typeof data.requiredSkills === 'object') {
    requiredSkills = data.requiredSkills.map((item, index) => {
      return item.skillName;
    });
  }
  if (data.preferredSkills && typeof data.preferredSkills === 'object') {
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

const frameworkComponents = {
  companyCell: CompanyCell,
  scoreCell: ScoreCell,
  jobTitleCell: JobTitleCell,
  skillsCell: SkillsCell,
  postingTimeCell: PostingTimeCell,
};

class AppliedJobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowData: [],
    };
  }
  // componentDidMount() {
  //   const { candidateId, dispatch } = this.props;
  //   console.log(123);
  //   dispatch(getApplicationsByTalentId(candidateId))
  //     .then((status) => {
  //       console.log(status);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }
  render() {
    const { classes, jobList } = this.props;
    return (
      <div className={classes.root}>
        <div
          className="ag-theme-alpine"
          style={{ height: '100%', width: '100%' }}
        >
          <AgGridReact
            defaultColDef={defaultColDef}
            rowData={jobList && jobList.toJS()}
            frameworkComponents={frameworkComponents}
            suppressDragLeaveHidesColumns={true}
            onGridReady={this.onGridReady}
            applyColumnDefOrder={true}
            suppressLoadingOverlay={true}
            autoSizePadding={5}
            pagination={true}
            paginationPageSize={15}
          >
            {columns.map((item, index) => {
              if (item.col === 'company') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    minWidth="150"
                    resizable={true}
                    cellRenderer="companyCell"
                  ></AgGridColumn>
                );
              }
              // else if (item.col === 'score') {
              //   return (
              //     <AgGridColumn
              //       key={index}
              //       field={item.column}
              //       headerName={item.colName}
              //       minWidth="150"
              //       resizable={true}
              //       cellRenderer="scoreCell"
              //     ></AgGridColumn>
              //   );
              // }
              else if (item.col === 'title') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    minWidth="150"
                    resizable={true}
                    cellRenderer="jobTitleCell"
                  ></AgGridColumn>
                );
              } else if (item.col === 'postingTime') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    minWidth="150"
                    resizable={true}
                    cellRenderer="postingTimeCell"
                  ></AgGridColumn>
                );
              } else if (item.col === 'skills') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    minWidth="150"
                    resizable={true}
                    cellRenderer="skillsCell"
                  ></AgGridColumn>
                );
              } else {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    // flex={1}
                    minWidth="200"
                    resizable={true}
                  ></AgGridColumn>
                );
              }
            })}
          </AgGridReact>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { candidateId }) => {
  let _jobList = getApplicationJobListByTalent(state, candidateId);
  let jobs = _jobList.filter((item, index) => {
    return item && item.get('id');
  });
  return {
    jobList: jobs,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(AppliedJobs));
