import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import StatusCell from '../../pages/Dashboard/Tables/CandidatesCell/StatusCell';
import SettingCell from './TableCell/SettingCell';
import CandidateNoteCell from './TableCell/CandidateNoteCell';
import CurrentStatusNoteCell from './TableCell/CurrentStatusNoteCell';
import SettingsIcon from '@material-ui/icons/Settings';
import TablePagination from '@material-ui/core/TablePagination';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import * as ActionTypes from '../../constants/actionTypes';
import Tooltip from '@material-ui/core/Tooltip';
const defaultColDef = {
  // width: 150,
  editable: false, //是否开启单元格编辑,true开启，false关闭
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true, //是否单独出现搜索框
  resizable: true,
};
const NameLinkCell = ({ data }) => {
  return (
    <>
      <Link to={`/candidates/detail/${data.talentId}`}>
        {data.candidateName}
      </Link>
    </>
  );
};
const JobLinkCell = ({ data }) => {
  return (
    <>
      <Link to={`/jobs/detail/${data.jobId}`}>{data.jobTitle}</Link>
    </>
  );
};

const LastUpDateCell = ({ data }) => {
  let date = moment(data.lastUpdate).format('YYYY-MM-DD');
  return <>{date}</>;
};

const LocationCell = ({ data }) => {
  let locationList = data.jobLocation;
  let arr = [];
  locationList &&
    locationList.forEach((item, index) => {
      if (item.location) {
        arr.push(item.location);
      } else {
        let address = `${item.city} ${item.city ? ',' : ''} ${item.province} ${
          item.province ? ',' : ''
        } ${item.country}`;
        arr.push(address);
      }
    });
  let html = Array.from(new Set(arr)).join(',');
  return (
    <Tooltip
      title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>}
      arrow
      placement="top"
    >
      <span>{html}</span>
    </Tooltip>
  );
};

const EmailCell = ({ data }) => {
  let html = data.email && data.email.length > 0 && data.email.join(', ');
  return (
    <Tooltip
      title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>}
      arrow
      placement="left-start"
    >
      <span>{html}</span>
    </Tooltip>
  );
};

const SkillsCell = ({ data }) => {
  let skills =
    data.jobSkill &&
    data.jobSkill.map((item, index) => {
      return item.skillName;
    });
  console.log(skills);
  let html = Array.from(new Set(skills)).join(',');
  return (
    <Tooltip
      title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>}
      arrow
      placement="left-start"
    >
      <span>{html}</span>
    </Tooltip>
  );
};

const frameworkComponents = {
  statusCell: StatusCell,
  nameLinkCell: NameLinkCell,
  JobLinkCell: JobLinkCell,
  lastUpDateCell: LastUpDateCell,
  candidateNoteCell: CandidateNoteCell,
  currentStatusNoteCell: CurrentStatusNoteCell,
  setting: SettingCell,
  locationCell: LocationCell,
  emailCell: EmailCell,
  skillsCell: SkillsCell,
};

class PipelineList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10,
      page: 0,
      newColumns: [],
      gridApi: null,
    };
  }

  componentDidMount() {
    this.setState({
      newColumns: this.props.columns,
    });
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      newColumns: nextProps.columns,
    });
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
    this.props.setPageNum(newPage);
  };

  handleChangeRowsPerPage = (event) => {
    console.log(event.target.value);
    this.setState(
      {
        rowsPerPage: parseInt(event.target.value, 10),
        page: 0,
      },
      () => {
        this.props.setPageSize(this.state.rowsPerPage);
      }
    );
  };

  onChangeSetting = (data) => {
    this.props.dispatch({
      type: ActionTypes.RECEIVE_PIPELINE_TEMPLATE,
      template: data,
    });
  };

  onDragStopped = (params) => {
    let list = params.api.getColumnDefs();
    let orderList = [];
    list.map((item) => {
      if (!item.headerComponent) {
        orderList.push({
          id: item.id,
          showFlag: item.hide ? false : true,
          labelCn: item.headerName,
          sortFlag: item.sortable,
          column: item.field,
          value: item.id,
          checked: false,
        });
      }
    });
    this.props.dispatch({
      type: ActionTypes.RECEIVE_PIPELINE_TEMPLATE,
      template: orderList,
    });
  };

  render() {
    const { rowData, columns, pageSize, pageNum, totalItems, t } = this.props;
    const { rowsPerPage, page, newColumns } = this.state;
    console.log(columns);
    return (
      <div
        className="ag-theme-alpine"
        style={{ height: '100%', width: '100%' }}
      >
        <AgGridReact
          defaultColDef={defaultColDef}
          rowData={rowData}
          frameworkComponents={frameworkComponents}
          suppressDragLeaveHidesColumns={true}
          onDragStopped={this.onDragStopped}
          onGridReady={this.onGridReady}
          applyColumnDefOrder={true}
          suppressLoadingOverlay={true}
          autoSizePadding={5}
        >
          {columns.length > 0 &&
            columns.map((item, index) => {
              {
                if (item.column === 'candidateName') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="150"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="nameLinkCell"
                    ></AgGridColumn>
                  );
                } else if (item.column === 'status') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="statusCell"
                      cellRendererParams={{
                        props: this.props,
                      }}
                    ></AgGridColumn>
                  );
                } else if (item.column === 'jobLocation') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="locationCell"
                      cellRendererParams={{
                        props: this.props,
                      }}
                    ></AgGridColumn>
                  );
                } else if (item.column === 'email') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="emailCell"
                      cellRendererParams={{
                        props: this.props,
                      }}
                    ></AgGridColumn>
                  );
                } else if (item.column === 'jobTitle') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="150"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="JobLinkCell"
                    ></AgGridColumn>
                  );
                } else if (item.column === 'lastUpdate') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="180"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="lastUpDateCell"
                    ></AgGridColumn>
                  );
                } else if (item.column === 'candidateNote') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="candidateNoteCell"
                      cellRendererParams={{
                        props: this.props,
                      }}
                    ></AgGridColumn>
                  );
                } else if (item.column === 'currentStatusNote') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="currentStatusNoteCell"
                      cellRendererParams={{
                        props: this.props,
                      }}
                    ></AgGridColumn>
                  );
                } else if (item.column === 'jobSkill') {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                      cellRenderer="skillsCell"
                      cellRendererParams={{
                        props: this.props,
                      }}
                    ></AgGridColumn>
                  );
                } else {
                  return (
                    <AgGridColumn
                      key={index}
                      id={item.id}
                      value={item.id}
                      field={item.column}
                      headerName={item.labelCn}
                      hide={!item.showFlag}
                      // flex={1}
                      minWidth="200"
                      sortable={item.sortFlag}
                      unSortIcon={item.sortFlag}
                      resizable={true}
                    ></AgGridColumn>
                  );
                }
              }
            })}
          <AgGridColumn
            // flex={1}
            suppressMovable={false}
            headerComponent="setting"
            headerComponentParams={{
              onChangeSetting: this.onChangeSetting,
            }}
            width="60"
            pinned="right"
            t={t}
          ></AgGridColumn>
        </AgGridReact>
        <div style={{ textAlign: 'right' }}>
          <TablePagination
            component="div"
            count={totalItems}
            page={pageNum ? pageNum - 1 : page}
            onChangePage={(e, newPage) => {
              this.handleChangePage(e, newPage);
            }}
            rowsPerPage={pageSize ? pageSize : rowsPerPage}
            onChangeRowsPerPage={(e) => {
              this.handleChangeRowsPerPage(e);
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  let columns = state.controller.pipelineTemplate;
  return {
    columns: columns,
  };
};

export default connect(mapStoreStateToProps)(PipelineList);
