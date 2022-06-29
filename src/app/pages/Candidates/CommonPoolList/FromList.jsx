import React, { Component, useEffect, useState } from 'react';
import * as apnSDK from '../../../../apn-sdk';
import * as ActionTypes from '../../../constants/actionTypes';
import { render } from 'react-dom';
import Dialog from '@material-ui/core/Dialog';

import { withStyles } from '@material-ui/core';
import {} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, useHistory } from 'react-router-dom';
import lodash from 'lodash';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import clsx from 'clsx';
import AutoSizer from '../../../../lib/auto-sizer';
import {
  getCandidateColumns,
  getCandidateInitColumns,
  getCommonPoolColumns,
  saveCandidateColumns,
} from '../../../../apn-sdk';
import { showErrorMessage } from '../../../actions';
import {
  getCommonPoolSearchData,
  chagneSizePage,
  chagneSort,
  resetPage,
  commonPoolChagneSort,
  candidateGetAdvancedData,
  CommonPoolGeneralToo,
  commonPoolSize,
  commonPoolFlagSearch,
  commonPoolGetAdvancedData,
} from '../../../actions/newCandidate';
import Loading from '../../../components/particial/Loading';
import TablePagination from '@material-ui/core/TablePagination';
import SettingCell from '../newList/table/settingCell';
import CommonPoolSettingCell from './CommonPoolSettingCell';
import { commonPoolFilterSearch } from '../../../../utils/search';
import SortCell from '../newList/table/sortCell';
import CommonPoolCell from '../newList/table/commonPoolCell';
import ContactCell from '../newList/table/contact';
import CurrLocationCell from '../newList/table/currLocation';
import SalaryRangeCell from '../newList/table/salaryRange';
import PerferLocationCell from '../newList/table/preferLocation';
import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';
import ArrCell from '../newList/table/arrCell';
import { CandidateGetGeneral } from '../../../actions/commonPoolAction';
import table from '../newList/table';

const styles = {
  root: {
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
};

const DefaultCell = ({ data, colId }) => {
  if (data[colId] === null || data[colId][0] === null) {
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
      {data.createdDate ? moment(data.createdDate).format('L HH:mm') : ''}
    </div>
  );
};

const CreatedByCell = ({ data }) => {
  return (
    <div>
      {data.CREATED_BY_NAME && data.CREATED_BY_NAME.length > 0
        ? data.CREATED_BY_NAME[0]
        : ''}
    </div>
  );
};

const frameworkComponents = {
  settingCell: SettingCell,
  sortCell: SortCell,
  CommonPoolCell: CommonPoolCell,
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
  commonPoolSettingCell: CommonPoolSettingCell,
};

const StatusCellStyle = {
  paddingTop: '0px',
};

// LinkeIn余额充足弹框
const LinkedInDialog = (props) => {
  const {
    setshowregister,
    moneyData,
    useListdata,
    purchaseSuccess,
    updateStar,
    unLockClick,
    showStatu,
    ChildSorryClick,
  } = props;
  const [open, setOpen] = useState(true);
  // 计算剩余金额
  const remainingAmount =
    moneyData.monthlyCredit +
    moneyData.bulkCredit -
    moneyData.usedBulkCredit -
    moneyData.usedMonthlyCredit;
  // 点击unlock购买
  const setUnlock = () => {
    let obj = {
      emailStatus: useListdata.emailStatus,
      profileId: useListdata._id,
    };
    return apnSDK
      .commonPoolAddUnlock(obj)
      .then((res) => {
        if (res) {
          let { response } = res;
          setOpen(false);
          unLockClick(response);
          showStatu(false);
        }
      })
      .catch((err) => {
        ChildSorryClick(true);
      });
  };
  return (
    <div>
      <Dialog open={open}>
        <div
          style={{ width: 421, height: 183, padding: '26px 24px 14px 24px' }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#505050',
              fontWeight: 500,
              marginBottom: '12px',
            }}
          >
            Use Credit to Unlock Talent Contact
          </div>
          <div style={{ fontSize: 14, color: '#505050', marginBottom: '12px' }}>
            1 Credit{' '}
          </div>
          <div style={{ fontSize: 14, color: '#3398dc', marginBottom: '22px' }}>
            Credit balance: {remainingAmount}Credit
          </div>
          <span
            style={{
              width: '107px',
              height: '33px',
              lineHeight: '33px',
              borderRadius: '4px',
              border: 'solid 1px #3398dc',
              display: 'inline-block',
              textAlign: 'center',
              color: '#3398dc',
              marginRight: '8px',
              cursor: 'pointer',
            }}
            onClick={() => setshowregister(false)}
          >
            Cancel
          </span>
          <span
            style={{
              width: '107px',
              height: '33px',
              lineHeight: '33px',
              borderRadius: '4px',
              border: 'solid 1px #3398dc',
              display: 'inline-block',
              textAlign: 'center',
              color: '#fff',
              background: '#3398dc',
              cursor: 'pointer',
            }}
            onClick={() => setUnlock()}
          >
            Unlock
          </span>
        </div>
      </Dialog>
    </div>
  );
};
// 余额不足提示框
const LinkedInSorryDialog = (props) => {
  const { setClose, useListdata } = props;
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Dialog open={open}>
        <div
          style={{ width: 421, height: 200, padding: '26px 24px 14px 24px' }}
        >
          <div
            style={{
              fontSize: 16,
              color: '#505050',
              fontWeight: 500,
              marginBottom: '12px',
            }}
          >
            You don't have enough credit to unlock talent contact
          </div>
          <div style={{ fontSize: 14, color: '#3398dc', marginBottom: '22px' }}>
            Credit balance: 0 Credit
          </div>
          <div style={{ fontSize: 14, color: '#505050', marginBottom: '12px' }}>
            Please contact the administrator to get more credit
          </div>
          <span
            style={{
              width: '107px',
              height: '33px',
              lineHeight: '33px',
              borderRadius: '4px',
              border: 'solid 1px #3398dc',
              display: 'inline-block',
              textAlign: 'center',
              color: '#fff',
              background: '#3398dc',
              cursor: 'pointer',
            }}
            onClick={() => setClose(false)}
          >
            Close
          </span>
        </div>
      </Dialog>
    </div>
  );
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
      NewData: null,
      rowData: null,
      headerList: [],
      searchLevel: 'BASE',
      page: 0,
      size: 25,
      count: props.count,
      autoFlag: false,
      sortList: [],
      chekInStatu: false,
      sorryStatu: false,
      moneyData: {},
      useListdata: {},
      poolList: [],
      nullData: [],
      newHeight:
        props.count * 1 >= 10 || props.count * 1 === 0
          ? 502
          : 502 - 42 * (10 - props.count * 1),
      getRowNodeId: function (data) {
        return data._id;
      },
      orderStatusOpen: false,
    };
  }

  componentDidMount() {
    this.getColumns();
  }
  updateStar = (data, flag) => {
    console.log('1111111111data', data);
    let rowNode = this.gridApi.getRowNode(data._id);
    data.purchased = true;
    rowNode.setData(data);
  };
  //获取header数据
  getColumns = () => {
    const { dispatch, pages } = this.props;
    // let type = 'CANDIDATE';
    let type = 'COMMON_POOL';

    getCandidateColumns(type)
      .then(({ response }) => {
        let { itemSortAll, pageSize } = response;
        pageSize &&
          this.props.dispatch({
            type: 'NEW_CANDIDATE_PAGESIZE',
            payload: {
              page: pages,
              size: pageSize,
            },
          });
        if (itemSortAll) {
          console.log('response', response);
          let list = JSON.parse(response.itemSortAll);
          console.log('list', list);
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
    getCommonPoolColumns()
      .then(({ response }) => {
        let sortParams = {};
        let list = [];
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
      this.props.dispatch(getCommonPoolSearchData());
    } else if (this.props.searchLevel == 'ADVANCED') {
      this.props.dispatch(commonPoolGetAdvancedData());
    } else {
      this.props.dispatch(CommonPoolGeneralToo());
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
    if (prevProps.tableData !== this.state.NewData) {
      this.setState({
        NewData: prevProps.tableData,
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
  // 点击linkedin图标从子组件传回来的数据
  handleChkeInIcon = (getData) => {
    console.log('getData', getData);
    this.setState({
      chekInStatu: getData,
    });
  };
  // 余额不足时
  sorryDate = (data) => {
    this.setState({
      sorryStatu: data,
    });
  };
  // 子组件中返回的余额
  useMoney = (data) => {
    this.setState({
      moneyData: data,
    });
  };
  useData = (data) => {
    this.setState({
      useListdata: data,
    });
  };

  // 点击排序按钮
  onChangeSort = (columnKey, sortDir) => {
    const {
      orderStatus,
      unSelectStatus,
      commonPoolSelectListTo,
      filterArrLength,
      general,
    } = this.props;
    console.log(general);
    // if (general === '') {
    //   this.setState({
    //     orderStatusOpen: true,
    //   });
    //   setTimeout(() => {
    //     this.setState({
    //       orderStatusOpen: false,
    //     });
    //   }, 2000);
    //   return;
    // }
    if (
      orderStatus && orderStatus.and
        ? orderStatus.and.length === 0
        : orderStatus.length === 0 && !unSelectStatus
    ) {
      this.setState({
        orderStatusOpen: true,
      });
      setTimeout(() => {
        this.setState({
          orderStatusOpen: false,
        });
      }, 2000);
    } else {
      if (
        commonPoolSelectListTo.length === 0 &&
        !unSelectStatus &&
        orderStatus
      ) {
        if (
          orderStatus.and
            ? orderStatus.and.length === 0
            : orderStatus.length === 0
        ) {
          this.setState({
            orderStatusOpen: true,
          });
          setTimeout(() => {
            this.setState({
              orderStatusOpen: false,
            });
          }, 2000);
        } else {
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
              this.props.dispatch(
                commonPoolChagneSort({ [columnKey]: sortDir })
              );
            }
          );
        }
      } else {
        let reg = /^.{3,20}$/;
        if (
          !reg.test(general) && orderStatus && orderStatus.and
            ? orderStatus.and.length === 0
            : orderStatus.length === 0
        ) {
          this.setState({
            orderStatusOpen: true,
          });
          setTimeout(() => {
            this.setState({
              orderStatusOpen: false,
            });
          }, 2000);
        } else {
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
              this.props.dispatch(
                commonPoolChagneSort({ [columnKey]: sortDir })
              );
            }
          );
        }
      }
    }
    // }
    // if (
    //   orderStatus.and.length === 0 &&
    //   !unSelectStatus &&
    //   commonPoolSelectListTo.length === 0
    // ) {
    //   this.setState({
    //     orderStatusOpen: true,
    //   });
    //   setTimeout(() => {
    //     this.setState({
    //       orderStatusOpen: false,
    //     });
    //   }, 2000);
    // } else {
    //   console.log(columnKey, sortDir);
    //   let headerList = [...this.state.headerList];
    //   headerList.map((item) => {
    //     item.sort = null;
    //     if (item.colId == columnKey) {
    //       item.sort = sortDir;
    //     }
    //   });
    //   this.setState(
    //     {
    //       headerList,
    //       sortList: headerList,
    //     },
    //     () => {
    //       this.props.dispatch(commonPoolChagneSort({ [columnKey]: sortDir }));
    //     }
    //   );
    // }
  };
  //保存用户columns设置
  saveColumns = (data) => {
    let list = JSON.parse(JSON.stringify(data)).map((_item) => {
      delete _item.sort;
      return _item;
    });

    let obj = {
      itemSortAll: JSON.stringify(list),
      module: 'COMMON_POOL',
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
  // 点击翻页
  handleChange = (e, nextPage) => {
    let obj = {
      page: nextPage * 1 + 1,
      size: this.state.size,
    };
    this.setState({
      page: nextPage,
    });
    this.props.dispatch(commonPoolSize(obj));
  };
  // 设置页数
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
          module: 'COMMON_POOL',
        });
      }
    );
    this.props.dispatch(resetPage());
    this.props.dispatch(commonPoolSize(obj));
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
  setshowregister = () => {
    this.setState({
      chekInStatu: false,
    });
  };
  // 余额不足提示框子组件传来的状态
  setClose = () => {
    this.setState({
      sorryStatu: false,
    });
  };
  showStatu = () => {
    this.setState({
      chekInStatu: false,
    });
  };
  unLockClick = () => {
    this.props.dispatch(
      CandidateGetGeneral(
        '',
        '',
        'select',
        this.props.dropStatu,
        this.props.newValue
      )
    );
  };
  // purchaseSuccess = (data) => {
  //   console.log('data', data);
  //   console.log('tableData=========', this.props.tableData);
  //   if (data) {
  //     this.props.dispatch({
  //       type: 'NEW_CANDIDATE_RESTEDATA',
  //     });
  //   }
  // };
  ChildSorryClick = (data) => {
    this.setState({
      chekInStatu: false,
      sorryStatu: true,
    });
  };
  render() {
    const {
      classes,
      loading,
      tableData,
      YesNoSearch,
      commonPoolSelectList,
      commonPoolSelectListTo,
    } = this.props;
    console.log('history', this.props);
    const {
      headerList,
      sortParams,
      count,
      page,
      size,
      newHeight,
      chekInStatu,
      sorryStatu,
      NewData,
      orderStatusOpen,
    } = this.state;
    console.log('headerList', headerList);
    console.log('loading', loading);
    console.log('tableData', tableData);
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
              {/* 点击领英图标后的弹出框 */}
              {chekInStatu && (
                <LinkedInDialog
                  moneyData={this.state.moneyData}
                  useListdata={this.state.useListdata}
                  setshowregister={this.setshowregister}
                  history={this.props.history}
                  purchaseSuccess={this.purchaseSuccess}
                  updateStar={this.updateStar}
                  unLockClick={this.unLockClick}
                  showStatu={this.showStatu}
                  ChildSorryClick={this.ChildSorryClick}
                />
              )}
              {/* 余额不足时的提示框 */}
              {sorryStatu && <LinkedInSorryDialog setClose={this.setClose} />}
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
                  getRowNodeId={this.state.getRowNodeId}
                >
                  {headerList.map((item) => {
                    if (item.colId == 'checkbox') {
                      // return (
                      //   <AgGridColumn
                      //     width={60}
                      //     key={item.colId}
                      //     colId={item.colId}
                      //     headerName=""
                      //     field=""
                      //     headerCheckboxSelection={true}
                      //     checkboxSelection={true}
                      //     pinned="left"
                      //     suppressMovable={true}
                      //     lockPosition={true}
                      //   />
                      // );
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
                          cellRenderer="CommonPoolCell"
                          cellStyle={StatusCellStyle}
                          headerComponent={'sortCell'}
                          cellRendererParams={{
                            params: item,
                            getData: this.handleChkeInIcon,
                            useMoney: this.useMoney,
                            useData: this.useData,
                            sorryDate: this.sorryDate,
                          }}
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
                    headerComponent={'commonPoolSettingCell'}
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
              {/* <Snackbar open={orderStatusOpen} autoHideDuration={6000}>
                <Alert severity="warning" sx={{ width: '100%' }}>
                  You will be able to sort results after filtering!
                </Alert>
              </Snackbar> */}
              <Snackbar
                open={orderStatusOpen}
                message={'You will be able to sort results after filtering.'}
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
    tableData: state.controller.newCandidateJob.toJS().commonTableData,
    newValue: state.controller.newCandidateJob.toJS().commonPoolSelectListTo,
    searchLevel: state.controller.newCandidateJob.toJS().searchLevel,
    count: state.controller.newCandidateJob.toJS().count * 1,
    pages: state.controller.newCandidateJob.toJS().page * 1,
    loading: state.controller.newCandidateJob.toJS().loading,
    sizes: state.controller.newCandidateJob.toJS().size * 1,
    sort: state.controller.newCandidateJob.toJS().sort,
    dropStatu: state.controller.newCandidateJob.toJS().defultStatus,
    // dropStatu: state.controller.newCandidateJob.toJS().commonPoolDefultStatus,

    orderStatus: state.controller.newCandidateJob.toJS().orderStatus,
    unSelectStatus: state.controller.newCandidateJob.toJS().unSelectStatus,
    commonPoolSelectListTo:
      state.controller.newCandidateJob.toJS().selectToStatus,
    filterArrLength: state.controller.newCandidateJob.toJS().filterArrIndex,
    general: state.controller.newCandidateJob.toJS().general,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(candidateAllTable));
