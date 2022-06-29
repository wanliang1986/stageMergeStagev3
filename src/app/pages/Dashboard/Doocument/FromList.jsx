import React, { Component, useEffect, useState } from 'react';
// import * as apnSDK from '../../../../apn-sdk';
import * as ActionTypes from '../../../constants/actionTypes';
import { render } from 'react-dom';
import Dialog from '@material-ui/core/Dialog';
import { withStyles } from '@material-ui/core';
import {} from 'react-router-dom';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import TablePagination from '@material-ui/core/TablePagination';

import clsx from 'clsx';
import AutoSizer from '../../../../lib/auto-sizer';

import EmployeeNameCell from './EmployeeNameCell';
import DocumentTypeCell from './DocumentTypeCell';
import DocumentNameCell from './DocumentNameCell';
import DocStatusCell from './DocStatusCell';
import PackageAssignedOnCell from './PackageAssignedOnCell';
import PackageNameCell from './PackageNameCell';
import PackageStatusCell from './PackageStatusCell';

import StartingOnCell from './StartingOnCell';
import DocumentViewSettingCell from './DocumentViewSettingCell';
import SortCell from './SortCell';
import JobTitleCell from './JobTitleCell';
import JobIdCell from './JobIdCell';
import CompanyCell from './CompanyCell';
import JobCodeCell from './JobCodeCell';
import DepartmentCell from './DepartmentCell';
import StartByUserCell from './StartByUserCell';
import AssignedByCell from './AssignedByCell';

import loadsh, { keys } from 'lodash';
import Loading from '../../../components/particial/Loading';
import { DocumentViewData } from '../../../../utils/documentViewSearch';
import { newDocumentSearch } from '../../../actions/newDocumentView';
import {
  getDocumentColumns,
  getDefaultColumns,
  saveDocumentColumns,
} from '../../../../apn-sdk/documentDashboard';

const styles = {
  root: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};

const frameworkComponents = {
  EmployeeNameCell: EmployeeNameCell,
  JobIdCell: JobIdCell,
  CompanyCell: CompanyCell,
  DocumentTypeCell: DocumentTypeCell,
  DocumentNameCell: DocumentNameCell,
  DocStatusCell: DocStatusCell,
  PackageAssignedOnCell: PackageAssignedOnCell,
  PackageNameCell: PackageNameCell,
  PackageStatusCell: PackageStatusCell,
  StartingOnCell: StartingOnCell,
  DocumentViewSettingCell: DocumentViewSettingCell,
  SortCell: SortCell,
  JobTitleCell: JobTitleCell,
  JobCodeCell: JobCodeCell,
  DepartmentCell: DepartmentCell,
  StartByUserCell: StartByUserCell,
  AssignedByCell: AssignedByCell,
};

const StatusCellStyle = {
  paddingTop: '0px',
};
class DocumentFrom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      size: 25,
      headerList: [],
      sortList: [],
    };
  }

  componentDidMount() {
    this.getColumns();
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(this.state);
    console.log(nextProps);
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
  // 获取自定义配置
  getColumns = () => {
    const { interfaceDataList } = this.props;

    let type = 'DASHBOARD_DOCUMENT';
    getDocumentColumns(type).then(({ response }) => {
      console.log('response', response);
      let { itemSortAll } = response;
      if (itemSortAll) {
        let list = JSON.parse(response.itemSortAll);

        if (interfaceDataList?.sort?.property) {
          list.forEach((item) => {
            if (item.colId === interfaceDataList.sort.property) {
              item.sort = interfaceDataList.sort.direction;
            }
          });
        }
        console.log('list', list);
        this.setState({
          headerList: list,
          autoFlag: true,
        });
      } else {
        this.getColumn();
      }
    });
  };
  //用户初次进入没有进行过设置。获取字典数据
  getColumn = () => {
    getDefaultColumns().then(({ response }) => {
      console.log('默认response', response);
      let list = [];
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
      console.log('list', list);
      this.setState({
        headerList: list,
      });
    });
  };
  // 点击排序按钮
  onChangeSort = (columnKey, sortDir) => {
    const { interfaceDataList, dispatch } = this.props;
    dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    console.log(columnKey, sortDir);

    let headerList = loadsh.cloneDeep(this.state.headerList);
    let interList = loadsh.cloneDeep(interfaceDataList);
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
        console.log(this.state);
      }
    );
    let obj = {
      direction: sortDir,
      property: columnKey,
    };
    if (sortDir !== null) {
      interList.sort = obj;
    } else {
      Object.keys(interList || {}).forEach((item) => {
        if (item === 'sort') {
          delete interList[item];
        }
      });
    }
    console.log(interList);
    dispatch({
      type: ActionTypes.DOCUMENT_INTERFACE,
      payload: interList,
    });
    dispatch(newDocumentSearch(interList));
  };
  //保存用户columns设置
  saveColumns = (data) => {
    let list = JSON.parse(JSON.stringify(data)).map((_item) => {
      delete _item.sort;
      return _item;
    });

    let obj = {
      itemSortAll: JSON.stringify(list),
      module: 'DASHBOARD_DOCUMENT',
    };
    saveDocumentColumns(obj).then(({ response }) => {
      console.log('saveColumns ----OK');
    });
  };
  // 点击翻页
  handleChange = (e, nextPage) => {
    const { interfaceDataList, dispatch } = this.props;
    let interList = loadsh.cloneDeep(interfaceDataList);
    dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    console.log('nextPage', nextPage);
    console.log(this.state);

    this.setState({
      page: nextPage,
    });
    interList.pageNumber = nextPage * 1 + 1;
    interList.pageSize = this.state.size;
    dispatch({
      type: ActionTypes.DOCUMENT_INTERFACE,
      payload: interList,
    });
    dispatch(newDocumentSearch(interList));
  };
  // 设置size条数
  handleChangeRowsPerPage = (e) => {
    const { interfaceDataList, dispatch } = this.props;
    let interList = loadsh.cloneDeep(interfaceDataList);
    dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });

    console.log(e.target.value);
    this.setState({
      size: e.target.value,
    });
    interList.pageSize = e.target.value;
    interList.pageNumber = 1;
    dispatch({
      type: ActionTypes.DOCUMENT_INTERFACE,
      payload: interList,
    });
    dispatch(newDocumentSearch(interList));
  };
  // 设置按钮子组件save事件
  onChangeSetting = (data) => {
    console.log('data', data);
    this.setState(
      {
        headerList: data,
      },
      () => {
        this.saveColumns(data);
      }
    );
  };
  // 拖拽表头
  onDragStopped = (params) => {
    const { dispatch } = this.props;
    let list = params.api.getColumnDefs();
    let { sortList } = this.state;
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

    this.setState({
      headerList: newRes,
    });
    let obj = {
      itemSortAll: JSON.stringify(newRes),
      module: 'DASHBOARD_DOCUMENT',
    };
    saveDocumentColumns(obj).then(({ response }) => {
      console.log('saveColumns ----OK');
    });
  };
  render() {
    const { classes, loading, documentViewFromData, count, FromDataList } =
      this.props;
    const { size, headerList, page } = this.state;
    console.log('headerList', headerList);
    if (loading && documentViewFromData) {
      return (
        <div
          className={'flex-container flex-dir-column'}
          ss
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
    const tableHeight = size * 42 + 51 + 8;
    return (
      <>
        {FromDataList && FromDataList.length > 0 ? (
          <AutoSizer>
            {({ width, height }) => {
              height = height > 300 ? height : 300;
              return (
                <div
                  className={clsx('ag-theme-alpine', classes.root)}
                  style={{ width, height }}
                >
                  <div
                    style={{
                      height:
                        height - 52 < tableHeight ? height - 52 : tableHeight,
                    }}
                  >
                    <AgGridReact
                      rowData={documentViewFromData}
                      frameworkComponents={frameworkComponents}
                      onDragStopped={this.onDragStopped}
                      suppressDragLeaveHidesColumns={true}
                      suppressRowClickSelection={true}
                      rowSelection={'multiple'}
                    >
                      {headerList.map((item) => {
                        if (item.colId === 'employeeName') {
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
                              cellRenderer="EmployeeNameCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'jobId') {
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
                              cellRenderer="JobIdCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'company') {
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
                              cellRenderer="CompanyCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'documentType') {
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
                              cellRenderer="DocumentTypeCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'documentName') {
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
                              cellRenderer="DocumentNameCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'documentStatus') {
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
                              cellRenderer="DocStatusCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'packageAssignedOn') {
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
                              cellRenderer="PackageAssignedOnCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'packageName') {
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
                              cellRenderer="PackageNameCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'packageStatus') {
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
                              cellRenderer="PackageStatusCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'startingOn') {
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
                              cellRenderer="StartingOnCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'jobTitle') {
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
                              cellRenderer="JobTitleCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'jobCode') {
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
                              cellRenderer="JobCodeCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'department') {
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
                              cellRenderer="DepartmentCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'startByUser') {
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
                              cellRenderer="StartByUserCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        } else if (item.colId === 'assignedBy') {
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
                              cellRenderer="AssignedByCell"
                              cellStyle={StatusCellStyle}
                              headerComponent={'SortCell'}
                              cellRendererParams={{
                                params: item,
                                // getData: this.handleChkeInIcon,
                                // useMoney: this.useMoney,
                                // useData: this.useData,
                                // sorryDate: this.sorryDate,
                              }}
                              headerComponentParams={{
                                params: item,
                                onChangeSort: this.onChangeSort,
                              }}
                            />
                          );
                        }
                      })}
                      <AgGridColumn
                        flex={1}
                        suppressMovable={true}
                        colId={'blank'}
                      />
                      <AgGridColumn
                        suppressMovable={true}
                        colId={'setting'}
                        headerComponent={'DocumentViewSettingCell'}
                        headerComponentParams={{
                          headerList: headerList,
                          onChangeSetting: this.onChangeSetting,
                        }}
                        width="60"
                        pinned="right"
                      />
                    </AgGridReact>
                  </div>
                  {/* 翻页-设置显示多少条数据 */}
                  <TablePagination
                    component="div"
                    count={count > 600 ? 600 : count}
                    page={page}
                    rowsPerPage={size}
                    onPageChange={this.handleChange}
                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                  />
                </div>
              );
            }}
          </AutoSizer>
        ) : (
          <div
            className="flex-child-auto"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '24px',
                  color: '#9B9B9B',
                }}
              >
                No search result
              </div>
              <div
                style={{
                  fontSize: '24px',
                  color: '#9B9B9B',
                }}
              >
                Please apply filters above to complete search
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  let loading = state.controller.documentView.toJS().loading;
  let documentViewFromData =
    state.controller.documentView.toJS().documentViewFromData || [];
  let interfaceDataList =
    state.controller.documentView.toJS().interfaceDataList || [];
  let count = state.controller.documentView.toJS().count * 1;
  let pages =
    (state.controller.documentView.toJS().interfaceDataList &&
      state.controller.documentView.toJS().interfaceDataList.pageNumber * 1) ||
    null;
  let sizes =
    state.controller.documentView.toJS().interfaceDataList &&
    state.controller.documentView.toJS().interfaceDataList.pageSize;
  let FromDataList = state.controller.documentView.toJS().searchDataList;
  return {
    documentViewFromData,
    loading,
    interfaceDataList,
    count,
    sizes,
    pages,
    FromDataList,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(DocumentFrom));
