import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import clsx from 'clsx';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { getApplicationPositionListByTalent } from '../../../selectors/applicationSelector';
import moment from 'moment-timezone';
import { jobStatus } from '../../../constants/formOptions';
import { Link } from 'react-router-dom';

const styles = {
  root: {
    // overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
    '& .ag-react-container': {
      width: '100%',
    },
  },
};

const AMCell = ({ data }) => {
  let assignedUsersArr = data.assignedUsers;
  let AM = null;
  assignedUsersArr &&
    assignedUsersArr.map((item) => {
      if (item.permission === 'AM') {
        AM = item.username;
      }
    });
  return <div>{AM}</div>;
};

const RecuiterCell = ({ data }) => {
  let assignedUsersArr = data.assignedUsers;
  let Recuiter = null;
  assignedUsersArr &&
    assignedUsersArr.map((item) => {
      if (item.permission === 'RECRUITER') {
        Recuiter = item.username;
      }
    });
  return <div>{Recuiter || 'N/A'}</div>;
};

const ApplicationStatusCell = ({ data }) => {
  const getColor = () => {
    let status = data.jobStatus;
    switch (status) {
      case 'OPEN':
        return '#3398DC';
        break;
      case 'REOPENED':
        return '#21B66E';
        break;
      case 'FILLED':
        return '#F56D50';
        break;
      case 'CLOSED':
      case 'CANCELLED':
        return '#BDBDBD';
        break;
      case 'ONHOLD':
        return '#FDAB29';
        break;
      default:
        return '#3398DC';
        break;
    }
  };
  const jobStatusLabel = (value) => {
    let status = null;
    jobStatus.map((item) => {
      if (item.value === value) {
        status = item.label;
      }
    });
    return status;
  };
  if (data.jobStatus === 'NO_STATUS') {
    return <div>{''}</div>;
  }
  return (
    <div
      style={{
        borderRadius: '10.5px',
        color: '#fff',
        backgroundColor: getColor(),
        textAlign: 'center',
        width: 100,
        height: 30,
        lineHeight: '30px',
        marginTop: 5,
      }}
    >
      {jobStatusLabel(data.jobStatus)}
    </div>
  );
};

const ApplicationIdCell = ({ data }) => {
  return <div>{'# ' + data.jobId}</div>;
};

const ApplicationTitleCell = ({ data }) => {
  return (
    <Link className="job-link" to={`/jobs/detail/${data.jobId}`}>
      {data.title}
    </Link>
  );
};

const StartDateCell = ({ data }) => {
  return <div>{moment(data.createdDate).format('YYYY-MM-DD')}</div>;
};

const LastDateCell = ({ data }) => {
  return (
    <div>{moment(data.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss')}</div>
  );
};

const frameworkComponents = {
  amCell: AMCell,
  recuiterCell: RecuiterCell,
  applicationStatusCell: ApplicationStatusCell,
  applicationIdCell: ApplicationIdCell,
  startDateCell: StartDateCell,
  lastDateCell: LastDateCell,
  applicationTitleCell: ApplicationTitleCell,
};
class PositionOtherTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultColDef: {
        resizable: true,
      },
      headerList: [
        {
          label: '职位ID',
          colId: 'jobId',
          column: 'jobId',
          width: 100,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: '职位名称',
          colId: 'title',
          column: 'title',
          width: 150,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: '客户经理',
          colId: 'assignedUsersAM',
          column: 'assignedUsersAM',
          width: 150,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: '招聘专员',
          colId: 'assignedUsersRecuiter',
          column: 'assignedUsersRecuiter',
          width: 150,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: '职位状态',
          colId: 'jobStatus',
          column: 'jobStatus',
          width: 150,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: '开始日期',
          colId: 'createdDate',
          column: 'createdDate',
          width: 140,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: '最近更新',
          colId: 'lastModifiedDate',
          column: 'lastModifiedDate',
          width: 200,
          showFlag: true,
          sortFlag: false,
        },
      ],
      autoFlag: false,
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onFirstDataRendered = (params) => {
    let { autoFlag } = this.state;
    if (!autoFlag) {
      this.setState(
        {
          autoFlag: true,
        },
        () => params.api.sizeColumnsToFit()
      );
    }
  };

  render() {
    const { classes, jobList } = this.props;
    const { headerList } = this.state;
    console.log('dsadsa', jobList.toJS());
    return (
      <div className={clsx('ag-theme-alpine', classes.root)}>
        <div style={{ height: 300 }}>
          <AgGridReact
            defaultColDef={this.state.defaultColDef}
            rowData={jobList && jobList.toJS()}
            onGridReady={this.onGridReady}
            frameworkComponents={frameworkComponents}
            onFirstDataRendered={this.onFirstDataRendered}
            suppressDragLeaveHidesColumns={true}
            applyColumnDefOrder={true}
            suppressLoadingOverlay={true}
            autoSizePadding={5}
          >
            {headerList.map((item, index) => {
              if (item.colId === 'assignedUsersAM') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="amCell"
                  ></AgGridColumn>
                );
              } else if (item.colId === 'assignedUsersRecuiter') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="recuiterCell"
                  ></AgGridColumn>
                );
              } else if (item.colId === 'jobId') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="applicationIdCell"
                  ></AgGridColumn>
                );
              } else if (item.colId === 'jobStatus') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="applicationStatusCell"
                  ></AgGridColumn>
                );
              } else if (item.colId === 'createdDate') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="startDateCell"
                  ></AgGridColumn>
                );
              } else if (item.colId === 'lastModifiedDate') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="lastDateCell"
                  ></AgGridColumn>
                );
              } else if (item.colId === 'title') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.label}
                    width={item.width}
                    resizable={true}
                    cellRenderer="applicationTitleCell"
                  ></AgGridColumn>
                );
              } else {
                return (
                  <AgGridColumn
                    field={item.column}
                    colId={item.colId}
                    key={item.colId}
                    headerName={item.label}
                    headerTooltip={item.label}
                    width={item.width}
                    hide={!item.showFlag}
                    sortable={item.sortFlag}
                    unSortIcon={item.sortFlag}
                    resizable={true}
                  />
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
  let _jobList = getApplicationPositionListByTalent(state, candidateId);
  let jobs = _jobList.filter((item, index) => {
    return item && item.get('id');
  });
  return {
    jobList: jobs,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(PositionOtherTable));
