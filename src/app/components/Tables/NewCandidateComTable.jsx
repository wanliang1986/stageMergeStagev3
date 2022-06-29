import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
// import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { AgGridReact } from '@ag-grid-community/react';
import { ViewportRowModelModule } from '@ag-grid-enterprise/viewport-row-model';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { Link } from 'react-router-dom';

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
  if (!data) {
    return '';
  }
  let companyList = [];
  let compantTitle = [];
  let filterList = [];
  // currentExperiences多条数据的时候，取出所有companyName不等于null的数据
  if (data.currentExperiences && data.currentExperiences.length > 1) {
    data.currentExperiences &&
      data.currentExperiences.forEach((item) => {
        if (item.companyName !== null) {
          companyList.push(item.companyName);
          compantTitle.push(item.companyName); //取出所有浮层框展示的currentExperience title数据
        }
      });
    data.pastExperiences &&
      data.pastExperiences.forEach((item) => {
        if (item.companyName !== null) {
          compantTitle.push(item.companyName); //取出所有浮层框展示的pastExperiences title数据
        }
      });
    // 取出需要展示的第一条数据
    filterList.push(companyList[0]);
  } else if (data.currentExperiences && data.currentExperiences.length === 1) {
    data.currentExperiences &&
      data.currentExperiences.forEach((item) => {
        if (item.companyName !== null) {
          filterList.push(item.companyName);
          compantTitle.push(item.companyName); //取出所有浮层框展示的数据
        }
      });
    data.pastExperiences &&
      data.pastExperiences.forEach((item) => {
        if (item.companyName !== null) {
          compantTitle.push(item.companyName); //取出所有浮层框展示的pastExperiences title数据
        }
      });
  }
  // 如果为currentExperiences为空，则取pastExperiences
  if (filterList.length === 0) {
    // pastExperiences多条数据的时候，取出第一个用于展示
    if (data.pastExperiences && data.pastExperiences.length > 1) {
      data.pastExperiences &&
        data.pastExperiences.forEach((item) => {
          if (item.companyName !== null) {
            companyList.push(item.companyName);
            compantTitle.push(item.companyName); //取出所有浮层框展示的数据
          }
        });
      // 取出第一条数据进行展示
      filterList.push(companyList[0]);
    } else if (data.pastExperiences && data.pastExperiences.length === 1) {
      data.pastExperiences &&
        data.pastExperiences.forEach((item) => {
          if (item.companyName !== null) {
            filterList.push(item.companyName);
            compantTitle.push(item.companyName); //取出所有浮层框展示的数据
          }
        });
    }
  }
  let company = Array.from(new Set(filterList)).join(',');
  let filterTitleList = Array.from(new Set(compantTitle)).join(' , '); //浮层框数据去重

  if (data) {
    return (
      <Tooltip title={filterTitleList} arrow placement="top">
        <div>{company}</div>
      </Tooltip>
    );
  }
};

const JobTitleCell = ({ data }) => {
  if (!data) {
    return '';
  }
  let jobToolTipTitle = [];
  let titleList = [];
  let filterList = [];
  // currentExperiences多条数据的时候，取出所有title不等于null的数据
  if (data.currentExperiences && data.currentExperiences.length > 1) {
    data.currentExperiences &&
      data.currentExperiences.forEach((item) => {
        if (item.title !== null) {
          titleList.push(item.title);
          jobToolTipTitle.push(item.title); //取出所有浮层框展示的currentExperience title数据
        }
      });
    data.pastExperiences &&
      data.pastExperiences.forEach((item) => {
        if (item.title !== null) {
          jobToolTipTitle.push(item.title); //取出所有浮层框展示的pastExperiences title数据
        }
      });
    // 取出需要展示的第一条数据
    filterList.push(titleList[0]);
  } else if (data.currentExperiences && data.currentExperiences.length === 1) {
    data.currentExperiences &&
      data.currentExperiences.forEach((item) => {
        if (item.title !== null) {
          filterList.push(item.title);
          jobToolTipTitle.push(item.title); //取出所有浮层框展示的数据
        }
      });
    data.pastExperiences &&
      data.pastExperiences.forEach((item) => {
        if (item.title !== null) {
          jobToolTipTitle.push(item.title); //取出所有浮层框展示的pastExperiences title数据
        }
      });
  }
  // 如果为currentExperiences为空，则取pastExperiences
  if (filterList.length === 0) {
    // pastExperiences多条数据的时候，取出第一个用于展示
    if (data.pastExperiences && data.pastExperiences.length > 1) {
      data.pastExperiences &&
        data.pastExperiences.forEach((item) => {
          if (item.title !== null) {
            titleList.push(item.title);
            jobToolTipTitle.push(item.title); //取出所有浮层框展示的数据
          }
        });
      // 取出第一条数据进行展示
      filterList.push(titleList[0]);
    } else if (data.pastExperiences && data.pastExperiences.length === 1) {
      data.pastExperiences &&
        data.pastExperiences.forEach((item) => {
          if (item.title !== null) {
            filterList.push(item.title);
            jobToolTipTitle.push(item.title); //取出所有浮层框展示的数据
          }
        });
    }
  }
  let title = Array.from(new Set(filterList)).join(','); //展示
  let filterJobToolTipTitle = Array.from(new Set(jobToolTipTitle)).join(' , '); //浮层提示

  return (
    <Tooltip title={filterJobToolTipTitle} arrow placement="top">
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

const FullNameCell = (props) => {
  const { data } = props;
  if (!data) {
    return '';
  }
  if (data.purchased && data.talentId) {
    return (
      <Link to={`/candidates/detail/${data.talentId}`}>{data.fullName}</Link>
    );
  } else {
    return (
      <Link to={`/candidates/commonPoolList/commonPoolDetail?id=${data.esId}`}>
        {data.fullName}
      </Link>
    );
  }
};

const columns = [
  {
    headerName: 'Name',
    field: 'fullName',
    minWidth: 200,
    cellRenderer: FullNameCell,
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
  //   width: 90,
  // },
];

class NewCandidateComTable extends Component {
  //static modules reference
  modules = [ViewportRowModelModule];

  //datasource
  viewportDatasource = {
    init: (params) => {
      this.viewportDatasource.params = params;
      this.viewportDatasource.params.setRowCount(this.props.talentsList.size);
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
      this.viewportDatasource.params.setRowData(rowData);
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
            defaultColDef={defaultColDef}
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

export default connect()(withStyles(styles)(NewCandidateComTable));
