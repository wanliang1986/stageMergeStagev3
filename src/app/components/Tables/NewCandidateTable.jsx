import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { AssignJobIcon } from './../Icons';

const defaultColDef = {
  // width: 150,
  editable: false, //是否开启单元格编辑,true开启，false关闭
  //   filter: 'agTextColumnFilter',
  //   floatingFilter: true, //是否单独出现搜索框
  resizable: true,
};

const columns = [
  {
    colName: 'Name',
    column: 'fullName',
    colWidth: 250,
    flexGrow: 3,
    type: 'nameCell',
  },
  {
    colName: 'Company',
    column: 'company',
    colWidth: 170,
    flexGrow: 3,
    type: 'companyCell',
  },
  {
    colName: 'Job Title',
    column: 'title',
    colWidth: 160,
    flexGrow: 3,
    type: 'jobTitleCell',
  },
  {
    colName: 'Skills',
    column: 'skills',
    colWidth: 200,
    flexGrow: 3,
    type: 'skillsCell',
  },
  // {
  //   colName: 'AI Score',
  //   column: 'score',
  //   colWidth: '60',
  //   flexGrow: 1,
  // },
];

const styles = {
  root: {
    width: '100%',
    height: '90%',
    padding: '10px',
  },
  // headerCell: {
  //   '.ag-theme-alpine &.ag-header-cell': {
  //     padding: '0',
  //   },
  // },
};

const CompanyCell = ({ data }) => {
  let pastExperiences = data.currentExperiences;
  let companyList =
    pastExperiences &&
    pastExperiences.map((item, index) => {
      return item.companyName;
    });
  let company = Array.from(new Set(companyList)).join(',');
  if (data) {
    return (
      <Tooltip title={company} arrow placement="top">
        <div>{company}</div>
      </Tooltip>
    );
  }
};

const NameCell = ({ data }) => {
  console.log(data);
  let fullName = data.fullName;
  let id = data.id;
  if (data) {
    return <Link to={`/candidates/detail/${id}`}>{fullName}</Link>;
  }
};

const JobTitleCell = ({ data }) => {
  console.log(data);
  let pastExperiences = data.currentExperiences;
  let titleList =
    pastExperiences &&
    pastExperiences.map((item, index) => {
      return item.title;
    });
  let title = Array.from(new Set(titleList)).join(',');
  return (
    <Tooltip title={title} arrow placement="top">
      <div>{title}</div>
    </Tooltip>
  );
};

const SkillsCell = ({ data }) => {
  let _skills =
    data.skills &&
    data.skills.map((item, index) => {
      return item.skillName;
    });
  let allSkills = Array.from(new Set(_skills)).join(',');
  return (
    <Tooltip title={allSkills} arrow placement="top">
      <div>{allSkills}</div>
    </Tooltip>
  );
};

const ApplyJobBtnCell = ({ data, onApply }) => {
  return (
    <IconButton color="primary" onClick={() => onApply(data.id)} size={'small'}>
      <AssignJobIcon />
    </IconButton>
  );
};

const frameworkComponents = {
  companyCell: CompanyCell,
  jobTitleCell: JobTitleCell,
  nameCell: NameCell,
  skillsCell: SkillsCell,
  applyJobBtnCell: ApplyJobBtnCell,
};

class NewCandidateTable extends Component {
  render() {
    const { classes, talentsList } = this.props;
    return (
      <div className={classes.root}>
        <div
          className="ag-theme-alpine"
          style={{ height: '100%', width: '100%' }}
        >
          <AgGridReact
            defaultColDef={defaultColDef}
            rowData={talentsList.toJS()}
            frameworkComponents={frameworkComponents}
            suppressDragLeaveHidesColumns={true}
            onGridReady={this.onGridReady}
            applyColumnDefOrder={true}
            suppressLoadingOverlay={true}
            pagination={true}
            paginationPageSize={15}
            overlayNoRowsTemplate={'<span style="padding: 10px;"></span>'}
          >
            {columns.map((item, index) => {
              return (
                <AgGridColumn
                  key={index}
                  field={item.column}
                  headerName={item.colName}
                  width={item.colWidth}
                  minWidth={item.colWidth}
                  // flex={item.flexGrow}
                  // resizable={true}
                  cellRenderer={item.type}
                />
              );
            })}
            {/*{this.props.onApply && (*/}
            {/*  <AgGridColumn*/}
            {/*    suppressMovable={false}*/}
            {/*    width="50"*/}
            {/*    pinned="right"*/}
            {/*    cellRenderer="applyJobBtnCell"*/}
            {/*    cellRendererParams={{*/}
            {/*      onApply: this.props.onApply*/}
            {/*    }}*/}
            {/*    resizable={false}*/}
            {/*    cellStyle={{ padding: '0 10px' }}*/}
            {/*  />*/}
            {/*)}*/}
            <AgGridColumn suppressMovable={false} flex={1} resizable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  let talentsList = state.model.jobTalentPool;
  return {
    talentsList: talentsList,
  };
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(NewCandidateTable)
);
