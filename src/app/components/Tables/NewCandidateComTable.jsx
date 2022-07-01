import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { connect } from 'react-redux';
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
    colName: 'Name',
    column: 'fullName',
    colWidth: 200,
    flexGrow: 3,
    type: 'fullNameCell',
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
  //   colWidth: 90,
  //   flexGrow: 3,
  // },
];

const styles = {
  root: {
    width: '100%',
    height: '90%',
    padding: '10px',
  },
};

const CompanyCell = ({ data }) => {
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
  const { fullNameClick, data } = props;
  return (
    <div style={{ color: '#1879c4' }} onClick={() => fullNameClick(data)}>
      {data.fullName}
    </div>
  );
};

const frameworkComponents = {
  companyCell: CompanyCell,
  jobTitleCell: JobTitleCell,
  skillsCell: SkillsCell,
  fullNameCell: FullNameCell,
};

class NewCandidateComTable extends Component {
  // 子组件中返回的点击name跳转方法
  fullNameClick = (data) => {
    // purchased为true是购买，反之是没购买，talentId存在是已添加到candidates，反之则无
    if (data.purchased) {
      if (data.talentId && data.talentId) {
        this.props.history.push(`/candidates/detail/${data.talentId}`);
      } else {
        this.props.history.push(
          `/candidates/commonPoolList/commonPoolDetail?id=${data.esId}`
        );
      }
    }
    if (!data.purchased) {
      let dataId = data.esId;
      this.props.history.push(
        `/candidates/commonPoolList/commonPoolDetail?id=${dataId}`
      );
    }
  };
  componentWillMount() {
    sessionStorage.clear();
  }
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
            rowData={talentsList && talentsList.toJS()}
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
              if (item.type === 'fullNameCell') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    width={item.colWidth}
                    minWidth={item.colWidth}
                    cellRenderer={'fullNameCell'}
                    cellRendererParams={{
                      fullNameClick: this.fullNameClick,
                    }}
                  />
                );
              } else if (item.type === 'companyCell') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    width={item.colWidth}
                    minWidth={item.colWidth}
                    // flex={item.flexGrow}
                    // resizable={true}
                    cellRenderer={'companyCell'}
                    cellRendererParams={{}}
                  />
                );
              } else if (item.type === 'jobTitleCell') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    width={item.colWidth}
                    minWidth={item.colWidth}
                    // flex={item.flexGrow}
                    // resizable={true}
                    cellRenderer={'jobTitleCell'}
                    cellRendererParams={{}}
                  />
                );
              } else if (item.type === 'skillsCell') {
                return (
                  <AgGridColumn
                    key={index}
                    field={item.column}
                    headerName={item.colName}
                    width={item.colWidth}
                    minWidth={item.colWidth}
                    // flex={item.flexGrow}
                    // resizable={true}
                    cellRenderer={'skillsCell'}
                    cellRendererParams={{}}
                  />
                );
              }
            })}
            <AgGridColumn suppressMovable={false} flex={1} resizable={false} />
          </AgGridReact>
        </div>
      </div>
    );
  }
}

export default connect()(withStyles(styles)(NewCandidateComTable));
