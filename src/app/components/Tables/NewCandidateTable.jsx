import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { AgGridReact, AgGridColumn } from '@ag-grid-community/react';
import { ViewportRowModelModule } from '@ag-grid-enterprise/viewport-row-model';
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

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '10px',
  },
};

const CompanyCell = ({ data }) => {
  if (data) {
    let pastExperiences = data.currentExperiences;
    let companyList =
      pastExperiences &&
      pastExperiences.map((item, index) => {
        return item.companyName;
      });
    let company = Array.from(new Set(companyList)).join(',');
    return (
      <Tooltip title={company} arrow placement="top">
        <div>{company}</div>
      </Tooltip>
    );
  }
};

const NameCell = ({ data }) => {
  if (data) {
    let fullName = data.fullName;
    let id = data.id;
    return <Link to={`/candidates/detail/${id}`}>{fullName}</Link>;
  }
};

const JobTitleCell = ({ data }) => {
  if (!data) {
    return '';
  }
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
  if (!data) {
    return '';
  }
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

const ApplyJobBtnCell = (params) => {
  if (!params.data) {
    return '';
  }
  // console.log(params);
  return (
    <IconButton
      color="primary"
      onClick={() => params.onApply(params.data.id)}
      size={'small'}
    >
      <AssignJobIcon />
    </IconButton>
  );
};

const columns = [
  {
    headerName: 'Name',
    field: 'fullName',
    minWidth: 200,
    cellRenderer: NameCell,
  },
  {
    headerName: 'Company',
    field: 'company',
    minWidth: 170,
    cellRenderer: CompanyCell,
  },
  {
    headerName: 'Job Title',
    field: 'title',
    minWidth: 160,
    cellRenderer: JobTitleCell,
  },
  {
    headerName: 'Skills',
    field: 'skills',
    minWidth: 200,
    cellRenderer: SkillsCell,
  },
  // {
  //   headerName: 'AI Score',
  //   field: 'score',
  //   width: '60',
  // },

  // {
  //   headerName: ' ',
  //   width: 60,
  //   resizable: false,
  //   suppressMovable: false,
  //   cellRenderer: ApplyJobBtnCell,
  //   cellStyle: { padding: '0 10px' },
  // },
];

class NewCandidateTable extends Component {
  modules = [ViewportRowModelModule];
  defaultColDef = {
    ...defaultColDef,
    cellRendererParams: { onApply: this.props.onApply },
  };

  viewportDatasource = {
    init: (params) => {
      this.viewportDatasource.params = params;
      setTimeout(() => {
        this.viewportDatasource.params.setRowCount(this.props.talentsList.size);
      }, 20);
    },
    setViewportRange: (firstRow, lastRow) => {
      // console.log(firstRow, lastRow);
      const rowData = this.props.talentsList
        .toJS()
        .slice(firstRow, lastRow + 1)
        .reduce((res, value, index) => {
          res[index + firstRow] = value;
          return res;
        }, {});
      // console.log(rowData);
      this.viewportDatasource.params.setRowData(rowData, true);
    },
  };

  handleGridReady = (params) => {
    params.api.setViewportDatasource(this.viewportDatasource);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.talentsList !== this.props.talentsList) {
      this.viewportDatasource.params.setRowCount(this.props.talentsList.size);
    }
  }

  render() {
    const { classes, pageSize } = this.props;
    return (
      <div className={classes.root}>
        <div
          className="ag-theme-alpine"
          style={{ height: '100%', width: '100%' }}
        >
          <AgGridReact
            modules={this.modules}
            columnDefs={columns}
            defaultColDef={this.defaultColDef}
            suppressDragLeaveHidesColumns={true}
            onGridReady={this.handleGridReady}
            suppressLoadingOverlay={true}
            pagination={true}
            paginationPageSize={pageSize}
            rowSelection={'multiple'}
            rowModelType={'viewport'}
            viewportRowModelPageSize={1}
            viewportRowModelBufferSize={0}
          />
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
