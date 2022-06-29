import React, { Component } from 'react';
import { render } from 'react-dom';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import lodash from 'lodash';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import clsx from 'clsx';
import AutoSizer from '../../../../../lib/auto-sizer';
import {
  getCandidateColumns,
  getCandidateInitColumns,
  saveCandidateColumns,
} from '../../../../../apn-sdk';
import { showErrorMessage } from '../../../../actions';
import {
  getSearchData,
  chagneSizePage,
  chagneSort,
  resetPage,
  candidateGetMyOrAll,
  candidateGetAdvancedData,
  CandidategetGeneralToo,
} from '../../../../actions/newCandidate';
import Loading from '../../../../components/particial/Loading';
import TablePagination from '@material-ui/core/TablePagination';
import SettingCell from './settingCell';
import SortCell from './sortCell';
import NameCell from './nameCell';
import ContactCell from './contact';
import CurrLocationCell from './currLocation';
import SalaryRangeCell from './salaryRange';
import PerferLocationCell from './preferLocation';
import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';
import ArrCell from './arrCell';
const styles = {
  root: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};

const DefaultCell = ({ data, colId }) => {
  if (data[colId] === null) {
    return (
      <div>
        <Tooltip
          title={<span style={{ whiteSpace: 'pre-line' }}>N/A</span>}
          arrow
          placement="top"
        >
          <span>N/A</span>
        </Tooltip>
      </div>
    );
  } else {
    return (
      <div>
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {data[colId] ? data[colId].toString() : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span>{data[colId] ? data[colId][0] : 'N/A'} </span>
        </Tooltip>
      </div>
    );
  }
};
const CandidateIdCell = ({ data }) => {
  return <div>{'#' + data._id}</div>;
};

const ExperienceCell = ({ data }) => {
  let exp = '';
  if (data.experienceYears === null) {
    exp = 'no experience';
  } else if (data.experienceYears === 0) {
    exp = 'less than 1 year';
  } else {
    exp = data.experienceYears + ' year';
  }
  return <div>{exp}</div>;
};

const DateCell = ({ data }) => {
  return (
    <div>
      {data.createdDate ? moment(data.createdDate).format('L HH:mm') : 'N/A'}
    </div>
  );
};

const CreatedByCell = ({ data }) => {
  return (
    <div>
      {data.CREATED_BY_NAME && data.CREATED_BY_NAME.length > 0
        ? data.CREATED_BY_NAME[0]
        : 'N/A'}
    </div>
  );
};

const frameworkComponents = {
  settingCell: SettingCell,
  sortCell: SortCell,
  nameCell: NameCell,
  contactCell: ContactCell,
  currLocationCell: CurrLocationCell,
  salaryRangeCell: SalaryRangeCell,
  perferLocationCell: PerferLocationCell,
  experienceCell: ExperienceCell,
  candidateIdCell: CandidateIdCell,
  defaultCell: DefaultCell,
  dateCell: DateCell,
  createdByCell: CreatedByCell,
  arrCell: ArrCell,
};

const StatusCellStyle = {
  paddingTop: '0px',
};

class candidateAllTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultColDef: {
        resizable: true,
        tooltipValueGetter: (params) => {
          return params.label;
        },
      },
      rowData: null,
      headerList: [],
      searchLevel: 'BASE',
      page: 0,
      size: 25,
      count: props.count,
      autoFlag: false,
      sortList: [],
      newHeight:
        props.count * 1 >= 10 || props.count * 1 === 0
          ? 502
          : 502 - 42 * (10 - props.count * 1),
    };
  }

  componentDidMount() {
    this.getColumns();
  }
  //获取header数据
  getColumns = () => {
    const { dispatch, pages } = this.props;
    let type = 'CANDIDATE';
    getCandidateColumns(type)
      .then(({ response }) => {
        let { itemSortAll, pageSize } = response;
        // pageSize &&
        //   this.props.dispatch({
        //     type: 'NEW_CANDIDATE_PAGESIZE',
        //     payload: {
        //       page: pages,
        //       size: pageSize,
        //     },
        //   });
        if (itemSortAll) {
          console.log(response);
          let list = JSON.parse(response.itemSortAll);
          console.log(list);
          this.setState(
            {
              headerList: list,
              autoFlag: true,
            },
            () => {
              this.candidateGetTableData();
            }
          );
        } else {
          this.getInitColumns();
        }
      })
      .catch((err) => this.props.dispatch(showErrorMessage(err)));
  };

  //用户初次进入没有进行过设置。获取字典数据
  getInitColumns = () => {
    const { dispatch } = this.props;
    getCandidateInitColumns()
      .then(({ response }) => {
        let sortParams = {};
        let list = [
          {
            showFlag: true,
            label: '',
            colId: 'checkbox',
            width: 60,
          },
        ];
        console.log(response);
        response.map((item) => {
          let obj = {
            showFlag: item.showFlag,
            label: item.label,
            sortFlag: item.sortFlag,
            colId: item.column,
            column: item.column,
          };
          if (item.sortFlag) {
            obj.sort = null;
          }
          list.push(obj);
        });
        // list.push({ showFlag: true, label: '', width: 60, colId: 'setting' });
        console.log(list);
        this.setState(
          {
            headerList: list,
            sortParams,
          },
          () => {
            this.candidateGetTableData();
            // this.gridApi.sizeColumnsToFit()
          }
        );
      })
      .catch((err) => this.props.dispatch(showErrorMessage(err)));
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  candidateGetTableData = () => {
    if (this.props.searchLevel == 'BASE') {
      this.props.dispatch(getSearchData());
    } else if (this.props.searchLevel == 'ADVANCED') {
      this.props.dispatch(candidateGetAdvancedData());
    } else {
      this.props.dispatch(CandidategetGeneralToo());
    }
  };

  onFirstDataRendered = (params) => {
    let { autoFlag } = this.state;
    if (!autoFlag) {
      params.api.sizeColumnsToFit();
      this.setState({
        autoFlag: true,
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.searchLevel != this.state.searchLevel) {
      this.setState({
        searchLevel: prevProps.searchLevel,
      });
    }
    if (prevProps.count != this.state.count) {
      this.setState({
        count: prevProps.count,
        newHeight:
          prevProps.count * 1 >= 10 || prevProps.count * 1 == 0
            ? 502
            : 502 - 42 * (10 - prevProps.count * 1),
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pages - 1 != this.state.page) {
      this.setState({
        page: nextProps.pages - 1,
      });
    }

    console.log(nextProps);
  }

  onChangeSetting = (data) => {
    this.setState(
      {
        headerList: data,
      },
      () => {
        this.saveColumns(data);
      }
    );
  };

  onChangeSort = (columnKey, sortDir) => {
    console.log(columnKey, sortDir);
    let headerList = [...this.state.headerList];
    headerList.map((item) => {
      item.sort = null;
      if (item.colId == columnKey) {
        item.sort = sortDir;
      }
    });
    this.setState(
      {
        headerList,
        sortList: headerList,
      },
      () => {
        this.props.dispatch(chagneSort({ [columnKey]: sortDir }));
      }
    );
  };
  //保存用户columns设置
  saveColumns = (data) => {
    // let orderList = [];
    // data.map((item) => {
    //   orderList.push({
    //     colId: item.colId,
    //     showFlag: item.hide ? false : true,
    //     label: item.headerName,
    //     sortFlag: item.sortable,
    //     width: item.width,
    //     column: item.field,
    //   });
    // });
    let list = JSON.parse(JSON.stringify(data)).map((_item) => {
      delete _item.sort;
      return _item;
    });

    let obj = {
      itemSortAll: JSON.stringify(list),
      module: 'CANDIDATE',
    };
    saveCandidateColumns(obj).then(({ response }) => {
      console.log('saveColumns ----OK');
    });
  };

  onDragStopped = (params) => {
    let list = params.api.getColumnDefs();
    let { sortList } = this.state;
    // console.log(this.getwidth)
    // console.log(params.columnApi.columnController.bodyWidth)
    let orderList = [];
    let newSetting = [];
    list.map((item) => {
      if (item.colId !== 'setting') {
        orderList.push({
          colId: item.colId,
          showFlag: item.hide ? false : true,
          label: item.headerName,
          sortFlag: item.sortable,
          width: item.width,
          column: item.field,
        });
      }
    });
    // list.map((item) => {
    //   if (item.colId !== 'setting') {
    //     newSetting.push({
    //       colId: item.colId,
    //       showFlag: item.hide ? false : true,
    //       label: item.headerName,
    //       sortFlag: item.sortable,
    //       width: item.width,
    //       column: item.field,
    //     });
    //   }
    // });

    // let newblank = orderList.filter((item) => {
    //   return item.colId == 'blank'
    // })

    let newRes = orderList.filter((item) => {
      return item.colId !== 'blank';
    });
    // console.log(newRes)
    sortList.forEach((item) => {
      newRes.forEach((_item) => {
        if (item.colId == _item.colId) {
          _item.sort = item.sort;
        }
      });
    });
    // let newRes1 = orderList.filter((item) => {
    //   return !isNaN(item.colId)
    // })

    // let res = newRes.concat(newRes1[0])
    // console.log(orderList)
    // console.log(res)
    // newRes.push(newres1[0])
    // this.saveColumns(newRes)
    this.setState(
      {
        headerList: newRes,
      },
      () => {
        this.saveColumns(newRes);
      }
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pages - 1 != this.state.page) {
      this.setState({
        page: nextProps.pages - 1,
      });
    }
    if (nextProps.sizes != this.state.size && nextProps.sizes) {
      this.setState({
        size: nextProps.sizes - 0,
      });
    }
    let headerList = [...this.state.headerList];
    if (JSON.stringify(nextProps.sort) == '{}') {
      headerList.map((item) => {
        item.sort = null;
      });
      this.setState({
        headerList,
      });
    }
  }

  handleChange = (e, nextPage) => {
    let obj = {
      page: nextPage * 1 + 1,
      size: this.state.size,
    };
    this.setState({
      page: nextPage,
    });
    this.props.dispatch(chagneSizePage(obj));
  };

  handleChangeRowsPerPage = (e) => {
    let obj = {
      page: 1,
      size: e.target.value,
    };
    console.log(e.target.value);
    this.setState(
      {
        size: e.target.value,
      },
      () => {
        saveCandidateColumns({
          pageSize: e.target.value,
          module: 'CANDIDATE',
        });
      }
    );
    this.props.dispatch(resetPage());
    this.props.dispatch(chagneSizePage(obj));
  };

  onSelectionChanged = () => {
    let selectedRows = this.gridApi.getSelectedRows();
    let ids = selectedRows.map((item, index) => {
      return item._id;
    });
    let emails = selectedRows
      .map((item, index) => {
        if (item.emails) {
          return item.emails;
        }
      })
      .flat()
      .join(',');
    this.props.getSelected(ids, emails);
  };

  render() {
    const { classes, loading, tableData } = this.props;
    const { headerList, sortParams, count, page, size, newHeight } = this.state;
    if (loading && tableData) {
      return (
        <div
          className={'flex-container flex-dir-column'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            backgroundColor: 'rgba(240,240,240,.5)',
          }}
        >
          <Loading />
        </div>
      );
    }
    const tableHeight = size * 42 + 51 + 8; // rowCount(size) * rowHeight + headerHeight + scrollBarHeight,
    // rowCount(size) can be replaced by tableData.length
    return (
      <AutoSizer>
        {({ width, height }) => {
          height = height > 300 ? height : 300; //set minHeight
          return (
            <div
              className={clsx('ag-theme-alpine', classes.root)}
              style={{ width, height }} // root element should be set height and width
            >
              {/* 52 is height of pagination*/}
              <div
                style={{
                  height: height - 52 < tableHeight ? height - 52 : tableHeight,
                }}
              >
                <AgGridReact
                  ref={(ele) => (this.getwidth = ele)}
                  defaultColDef={this.state.defaultColDef}
                  rowData={tableData}
                  onGridReady={this.onGridReady}
                  frameworkComponents={frameworkComponents}
                  onDragStopped={this.onDragStopped}
                  onFirstDataRendered={this.onFirstDataRendered}
                  suppressDragLeaveHidesColumns={true}
                  suppressRowClickSelection={true}
                  onSelectionChanged={this.onSelectionChanged}
                  rowSelection={'multiple'}
                >
                  {headerList.map((item) => {
                    if (item.colId == 'checkbox') {
                      return (
                        <AgGridColumn
                          width={60}
                          key={item.colId}
                          colId={item.colId}
                          headerName=""
                          field=""
                          headerCheckboxSelection={true}
                          checkboxSelection={true}
                          pinned="left"
                          suppressMovable={true}
                          lockPosition={true}
                        />
                      );
                    } else if (item.colId === 'fullName') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          unSortIcon={item.sortFlag}
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="nameCell"
                          cellStyle={StatusCellStyle}
                          headerComponent={'sortCell'}
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          // suppressMovable={false}
                        />
                      );
                    } else if (
                      item.colId === 'phones' ||
                      item.colId === 'emails' ||
                      item.colId === 'industries' ||
                      item.colId === 'jobFunctions' ||
                      item.colId === 'languages' ||
                      item.colId === 'skills' ||
                      item.colId === 'workAuthorization'
                    ) {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          unSortIcon={item.sortFlag}
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="contactCell"
                          cellStyle={StatusCellStyle}
                          headerComponent={'sortCell'}
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          // suppressMovable={false}
                        />
                      );
                    } else if (item.colId === 'currentLocation') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          unSortIcon={item.sortFlag}
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="currLocationCell"
                          cellStyle={StatusCellStyle}
                          headerComponent={'sortCell'}
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          // suppressMovable={false}
                        />
                      );
                    } else if (
                      item.colId === 'currentSalary' ||
                      item.colId === 'preferredSalary'
                    ) {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          unSortIcon={item.sortFlag}
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="salaryRangeCell"
                          cellStyle={StatusCellStyle}
                          headerComponent={'sortCell'}
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          // suppressMovable={false}
                        />
                      );
                    } else if (item.colId === 'preferredLocations') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          unSortIcon={item.sortFlag}
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="perferLocationCell"
                          cellStyle={StatusCellStyle}
                          headerComponent={'sortCell'}
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          // suppressMovable={false}
                        />
                      );
                    } else if (item.colId === 'experienceYears') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          headerComponent={'sortCell'}
                          cellRenderer="experienceCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          // suppressMovable={false}
                        />
                      );
                    } else if (item.colId === '_id') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          headerComponent={'sortCell'}
                          cellRenderer="candidateIdCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          // suppressMovable={false}
                        />
                      );
                    } else if (item.colId === 'createdDate') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          headerComponent={'sortCell'}
                          cellRenderer="dateCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          // suppressMovable={false}
                        />
                      );
                    } else if (
                      item.colId === 'AM_NAMES' ||
                      item.colId === 'DM_NAMES' ||
                      item.colId === 'school' ||
                      item.colId === 'degrees' ||
                      item.colId === 'major' ||
                      item.colId === 'RECRUITER_NAMES' ||
                      item.colId === 'OWNER_NAMES'
                    ) {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          headerComponent={'sortCell'}
                          cellRenderer="arrCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          // suppressMovable={false}
                        />
                      );
                    } else if (item.colId === 'CREATED_BY_NAME') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          headerComponent={'sortCell'}
                          cellRenderer="createdByCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          // suppressMovable={false}
                        />
                      );
                    } else {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          sortable={item.sortFlag}
                          headerComponent={'sortCell'}
                          cellRenderer="defaultCell"
                          cellRendererParams={{
                            colId: item.colId,
                          }}
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          // suppressMovable={false}
                        />
                      );
                    }
                  })}
                  <AgGridColumn
                    flex={1}
                    // pinned="right"
                    suppressMovable={true}
                    colId={'blank'}
                    // lockPosition={true}
                    // suppressDragLeaveHidesColumns={true}
                  />
                  <AgGridColumn
                    suppressMovable={true}
                    colId={'setting'}
                    headerComponent={'settingCell'}
                    headerComponentParams={{
                      headerList: headerList,
                      onChangeSetting: this.onChangeSetting,
                    }}
                    width="60"
                    pinned="right"
                  />
                </AgGridReact>
              </div>

              {/*{count > 0 && (*/}
              <TablePagination
                component="div"
                count={count > 600 ? 600 : count}
                page={page}
                rowsPerPage={size}
                onPageChange={this.handleChange}
                onRowsPerPageChange={this.handleChangeRowsPerPage}
              />
              {/*)}*/}
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    tableData: state.controller.newCandidateJob.toJS().tableData,
    searchLevel: state.controller.newCandidateJob.toJS().searchLevel,
    count: state.controller.newCandidateJob.toJS().count * 1,
    pages: state.controller.newCandidateJob.toJS().page * 1,
    loading: state.controller.newCandidateJob.toJS().loading,
    sizes: state.controller.newCandidateJob.toJS().size * 1,
    sort: state.controller.newCandidateJob.toJS().sort,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(candidateAllTable));
