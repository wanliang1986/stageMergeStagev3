import React, { Component } from 'react';
import { render } from 'react-dom';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import clsx from 'clsx';
import AutoSizer from '../../../../../lib/auto-sizer';
import {
  getColumns,
  getInitColumns,
  saveColumns,
} from '../../../../../apn-sdk';
import { showErrorMessage } from '../../../../actions';
import {
  getSearchData,
  chagneSizePage,
  chagneSort,
  resetSort,
  getMyOrAll,
  resetPage,
  getAdvancedData,
  getGeneralToo,
} from '../../../../actions/newSearchJobs';
import Loading from '../../../../components/particial/Loading';
import TablePagination from '@material-ui/core/TablePagination';
import StarCell from './starCell';
import SettingCell from './settingCell';
import PostingTimeCell from './postingTimeCell';
import LocationsCell from './LocationsCell';
import RequiredSkills from './RequiredSkills';
import PreferredSkills from './PreferredSkills';
import ExperienceYearRange from './ExperienceYearRange';
import TooltipsCell from './TooltipsCell';
import StatusCell from './StatusCell';
import SortCell from './sortCell';
import LinkCell from './linkCell';
import JobTypeCell from './jobTypeCell';

const styles = {
  root: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};

const frameworkComponents = {
  starCell: StarCell,
  settingCell: SettingCell,
  PostingTimeCell: PostingTimeCell,
  LocationsCell: LocationsCell,
  RequiredSkills: RequiredSkills,
  PreferredSkills: PreferredSkills,
  ExperienceYearRange: ExperienceYearRange,
  TooltipsCell: TooltipsCell,
  StatusCell: StatusCell,
  sortCell: SortCell,
  LinkCell: LinkCell,
  JobTypeCell: JobTypeCell,
};

const StatusCellStyle = {
  // paddingTop: '6px',
};

class jobAllTable extends Component {
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
      NewData: null,
      headerList: [],
      searchLevel: 'BASE',
      page: 0,
      size: 10,
      count: props.count,
      autoFlag: false,
      sortList: [],
      newHeight:
        props.count * 1 >= 10 || props.count * 1 == 0
          ? 502
          : 502 - 42 * (10 - props.count * 1),
      getRowNodeId: function (data) {
        return data.id;
      },
    };
  }

  componentDidMount() {
    this.props.dispatch(getMyOrAll(true));
    this.getColumns();
  }
  //获取header数据
  getColumns = () => {
    const { dispatch, pages } = this.props;
    console.log(pages);
    getColumns()
      .then(({ response }) => {
        let { itemSort, pageSize } = response;
        pageSize &&
          this.props.dispatch({
            type: 'NEW_SEARCH_JOB_PAGESIZE',
            payload: {
              page: pages,
              size: pageSize,
            },
          });
        if (itemSort) {
          let list = JSON.parse(response.itemSort);
          this.setState(
            {
              headerList: list,
              autoFlag: true,
            },
            () => {
              this.getTableData();
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
    getInitColumns()
      .then(({ response }) => {
        let sortParams = {};
        let list = [
          { showFlag: true, label: '', width: 60, colId: 'favoriteFlag' },
        ];
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
        this.setState(
          {
            headerList: list,
            sortParams,
          },
          () => {
            this.getTableData();
          }
        );
      })
      .catch((err) => this.props.dispatch(showErrorMessage(err)));
  };

  getTableData = () => {
    if (this.props.searchLevel === 'BASE') {
      this.props.dispatch(getSearchData());
    } else if (this.props.searchLevel === 'ADVANCED') {
      this.props.dispatch(getAdvancedData());
    } else {
      this.props.dispatch(getGeneralToo());
    }
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  updateStar = (id, flag) => {
    let rowNode = this.gridApi.getRowNode(id);
    rowNode.setDataValue('favoriteFlag', flag);
  };

  updateStatus = (id, flag) => {
    let rowNode = this.gridApi.getRowNode(id);
    rowNode.setDataValue('status', flag);
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
    if (prevProps.tableData !== this.state.NewData) {
      this.setState({
        NewData: prevProps.tableData,
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pages - 1 != this.state.page) {
      console.log(nextProps.pages, this.state.page);
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
    let list = JSON.parse(JSON.stringify(data)).map((_item) => {
      delete _item.sort;
      return _item;
    });
    let obj = {
      itemSort: JSON.stringify(list),
      module: 'JOB',
    };
    saveColumns(obj).then(({ response }) => {
      console.log('saveColumns ----OK');
    });
  };

  onDragStopped = (params) => {
    let list = params.api.getColumnDefs();
    let { sortList } = this.state;

    let orderList = [];
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

    let newRes = orderList.filter((item) => {
      return item.colId !== 'blank';
    });
    sortList.forEach((item) => {
      newRes.forEach((_item) => {
        if (item.colId == _item.colId) {
          _item.sort = item.sort;
        }
      });
    });
    this.setState(
      {
        headerList: newRes,
      },
      () => {
        this.saveColumns(newRes);
      }
    );
  };

  handleChange = (e, nextPage) => {
    console.log(nextPage);
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
      page: this.state.page * 1 + 1,
      size: e.target.value,
    };
    this.setState(
      {
        size: e.target.value,
      },
      () => {
        saveColumns({
          pageSize: e.target.value,
          module: 'JOB',
        });
      }
    );
    this.props.dispatch(resetPage());
    this.props.dispatch(chagneSizePage(obj));
  };

  render() {
    const { classes, loading, tableData } = this.props;
    const { headerList, sortParams, count, page, size, newHeight, NewData } =
      this.state;
    if (loading) {
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
              <div
                style={{
                  height: height - 52 < tableHeight ? height - 52 : tableHeight,
                }}
              >
                <AgGridReact
                  defaultColDef={this.state.defaultColDef}
                  rowData={NewData}
                  onGridReady={this.onGridReady}
                  frameworkComponents={frameworkComponents}
                  onDragStopped={this.onDragStopped}
                  onFirstDataRendered={this.onFirstDataRendered}
                  suppressDragLeaveHidesColumns={true}
                  getRowNodeId={this.state.getRowNodeId}
                >
                  {headerList.map((item) => {
                    {
                      if (
                        item.colId == 'start' ||
                        item.colId == 'favoriteFlag'
                      ) {
                        return (
                          <AgGridColumn
                            colId={'favoriteFlag'}
                            field={'favoriteFlag'}
                            key={item.label}
                            headerName={item.label}
                            width={item.width}
                            hide={!item.showFlag}
                            resizable={true}
                            sortable={item.sortFlag}
                            unSortIcon={item.sortFlag}
                            headerTooltip={item.label}
                            cellRenderer="starCell"
                            cellRendererParams={{ updateStar: this.updateStar }}
                            suppressMovable={true}
                            lockPosition={true}
                          />
                        );
                      } else if (item.colId == 'postingTime') {
                        return (
                          <AgGridColumn
                            colId={item.colId}
                            key={item.label}
                            headerName={item.label}
                            width={item.width}
                            hide={!item.showFlag}
                            resizable={true}
                            sortable={item.sortFlag}
                            unSortIcon={item.sortFlag}
                            headerTooltip={item.label}
                            cellRenderer="PostingTimeCell"
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'locations') {
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
                            cellRenderer="LocationsCell"
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'requiredSkills') {
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
                            cellRenderer="RequiredSkills"
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'preferredSkills') {
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
                            cellRenderer="PreferredSkills"
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'experienceYearRange') {
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
                            cellRenderer="ExperienceYearRange"
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (
                        item.colId == 'jobFunctions' ||
                        item.colId == 'preferredLanguages' ||
                        item.colId == 'requiredLanguages'
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
                            cellRenderer="TooltipsCell"
                            cellRendererParams={{ tipKey: item.column }}
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'status') {
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
                            cellRenderer="StatusCell"
                            cellRendererParams={{
                              updateStatus: this.updateStatus,
                            }}
                            cellStyle={StatusCellStyle}
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'companyName') {
                        return (
                          <AgGridColumn
                            field={item.column}
                            colId={item.colId}
                            key={item.label}
                            headerName={item.label}
                            columnName="company"
                            width={item.width}
                            hide={!item.showFlag}
                            sortable={item.sortFlag}
                            unSortIcon={item.sortFlag}
                            resizable={true}
                            headerTooltip={item.label}
                            cellRenderer="LinkCell"
                            cellStyle={StatusCellStyle}
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'title') {
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
                            cellRenderer="LinkCell"
                            cellStyle={StatusCellStyle}
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else if (item.colId == 'type') {
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
                            cellRenderer="JobTypeCell"
                            cellStyle={StatusCellStyle}
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                          />
                        );
                      } else {
                        return (
                          <AgGridColumn
                            field={item.column}
                            colId={item.colId}
                            key={item.label}
                            headerName={item.label}
                            sortable={item.sortFlag}
                            width={item.width}
                            hide={!item.showFlag}
                            headerComponent={'sortCell'}
                            headerComponentParams={{
                              params: item,
                              onChangeSort: this.onChangeSort,
                            }}
                            resizable={true}
                            headerTooltip={item.label}
                          />
                        );
                      }
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
                    suppressMovable={false}
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

              <TablePagination
                component="div"
                count={count > 600 ? 600 : count}
                page={page}
                rowsPerPage={size}
                onChangePage={this.handleChange}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </div>
          );
        }}
      </AutoSizer>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    tableData: state.controller.newSearchJobs.toJS().tableData,
    searchLevel: state.controller.newSearchJobs.toJS().searchLevel,
    count: state.controller.newSearchJobs.toJS().count * 1,
    sizes: state.controller.newSearchJobs.toJS().size * 1,
    pages: state.controller.newSearchJobs.toJS().page * 1,
    pageReset: state.controller.newSearchJobs.toJS().pageReset,
    loading: state.controller.newSearchJobs.toJS().loading,
    sort: state.controller.newSearchJobs.toJS().sort,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(jobAllTable));
