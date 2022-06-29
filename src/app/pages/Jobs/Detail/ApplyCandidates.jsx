import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { normalize } from 'normalizr';
import clsx from 'clsx';
import {
  candidateFilterSearch,
  candidateRequestFilter,
} from '../../../../utils/search';
import { withStyles } from '@material-ui/core/styles';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TablePagination from '@material-ui/core/TablePagination';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';
import Popover from '@material-ui/core/Popover';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import AddApplicationForm from '../../../components/applications/forms/AddApplicationForm';
import Loading from '../../../components/particial/Loading';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import { talentBasic } from '../../../actions/schemas';
import * as ActionTypes from '../../../constants/actionTypes';
import {
  getCandidateInitColumns,
  getCandidateColumns,
  saveCandidateColumns,
} from '../../../../apn-sdk';
import { distSelect, distSelectZh } from '../../../../apn-sdk/newSearch';

import { showErrorMessage } from '../../../actions';
import {
  getNewOptions,
  getSearchData,
  chagneSizePage,
  resetPage,
  CandidateGetGeneral,
  deleteFilter,
  candidateGetMyOrAll,
  candidateResetSearch,
} from '../../../actions/newCandidate';

import SortCell from '../List/jobListTable/sortCell';
import SettingCell from '../List/jobListTable/settingCell';
import { columns1, columns2 } from '../../../../utils/newCandidate';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import loadsh from 'lodash';
import Search from '../../Candidates/newList/search/candidateSearch';
import SalaryRangeCell from '../../Candidates/newList/table/salaryRange';
import ArrCell from '../../Candidates/newList/table/arrCell';
import CurrLocationCell from '../../Candidates/newList/table/currLocation';
import PerferLocationCell from '../../Candidates/newList/table/preferLocation';
import ContactCell from '../../Candidates/newList/table/contact';

const styles = {
  loadingBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
  show: {
    color: '#3398dc',
    marginLeft: 10,
    display: 'inline-block',
    width: '94px',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: 14,
  },
  flex: {
    height: 40,
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    '& .MuiInputBase-root': {
      marginBottom: '0px !important',
    },
  },
  flexs: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  search_list: {
    padding: ' 0 10px',
    borderRight: '2px solid #cecece',
    minWidth: '40px',
    maxWidth: '200px',
    height: '20px',
    marginBottom: '7px',
    marginTop: '7px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  is_click: {
    color: '#3398dc !important',
  },
  iconStyle: {
    verticalAlign: 'middle',
    color: '#a0a0a0',
    cursor: 'pointer',
  },
  list_box: {
    display: 'flex !important',
    alignItems: 'center !important',
    width: '100%',
    flexWrap: 'wrap',
    minHeight: '25px',
    '& span:nth-last-child(1)': {
      borderRight: 'none !important',
    },
    '& .every': {
      marginBottom: '8px',
      marginRight: 10,
      maxWidth: '230px',
      '& .MuiChip-deleteIconSmall': {
        color: '#6E6E6E',
      },
    },
  },
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
      {data.createBy && data.createBy.length > 0 ? data.createBy[0] : 'N/A'}
    </div>
  );
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

const DefaultCell = ({ data, colId }) => {
  return (
    <div>
      <Tooltip
        title={
          <span style={{ whiteSpace: 'pre-line' }}>
            {data[colId] ? data[colId].toString() : ''}
          </span>
        }
        arrow
        placement="top"
      >
        <span>
          {data[colId] && Array.isArray(data[colId])
            ? data[colId][0]
            : data[colId]}
        </span>
      </Tooltip>
    </div>
  );
};

const frameworkComponents = {
  sortCell: SortCell,
  settingCell: SettingCell,
  contactCell: ContactCell,
  salaryRangeCell: SalaryRangeCell,
  dateCell: DateCell,
  createdByCell: CreatedByCell,
  arrCell: ArrCell,
  currLocationCell: CurrLocationCell,
  perferLocationCell: PerferLocationCell,
  experienceCell: ExperienceCell,
  defaultCell: DefaultCell,
};

class ApplyTalent extends Component {
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
      size: 10,
      count: props.count,
      autoFlag: false,
      showFilter: false,
      isClick: null,
      anchorEl: null,
      open: false,
      params: null,

      sortList: [],
      tableData: props.tableData || [],
      columns: columns1,
      columnsShow: false,
      filterStr: [],
      stepIndex: 0,
      processing: false,
      gridApi: null,
      gridColumnApi: null,
      selected: null,
      general: null,
    };
  }

  handleCancel = () => {
    this.props.handleRequestClose();
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'NEW_CANDIDATE_SEARCH_RESET',
    });
    this.getColumns();
    this.getSelectOptions();
    this.getCandidatesData();
  }

  componentWillReceiveProps(nextProps) {
    let arr = [];
    let { searchStr, searchStrAdvanced, advancedFilter, types } = nextProps;
    if (types === 'BASE') {
      this.setState({
        arrs: [],
      });
      arr = searchStr.split(',').map((item) => {
        return item.replace(/\./g, '.');
      });
      if (arr.length >= 1) {
        arr.pop();
      }
    }
    this.setState({
      filterStr: arr,
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pages - 1 !== this.state.page) {
      this.setState({
        page: nextProps.pages - 1,
      });
    }
    if (nextProps.sizes !== this.state.size && nextProps.sizes) {
      this.setState({
        size: nextProps.sizes - 0,
      });
    }
    if (nextProps.general !== this.state.general)
      this.setState({
        general: nextProps.general,
      });
  }

  componentWillMount() {
    let arr = [];
    let { searchStr, searchStrAdvanced, advancedFilter, types } = this.props;
    this.setState({
      arrs: [],
    });
    arr = searchStr.split(',').map((item) => {
      return item.replace(/\./g, ',');
    });
    if (arr.length >= 1) {
      arr.pop();
    }
    this.setState({
      filterStr: arr,
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'NEW_CANDIDATE_SEARCH_RESET',
    });
  }

  //获取header数据
  getColumns = () => {
    const { dispatch } = this.props;
    let type = 'JOB_PICK_CANDIDATE';
    getCandidateColumns(type)
      .then(({ response }) => {
        if (response.itemSortAll) {
          let list = JSON.parse(response.itemSortAll);
          this.setState(
            {
              headerList: list,
              autoFlag: true,
            },
            () => {
              // this.props.dispatch(getSearchData());
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
            width: 60,
            colId: 'checkbox',
          },
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
            // this.props.dispatch(getSearchData());
            // this.gridApi.sizeColumnsToFit()
          }
        );
      })
      .catch((err) => this.props.dispatch(showErrorMessage(err)));
  };

  handleShow = () => {
    let show = this.state.showFilter;
    this.setState({
      showFilter: !show,
    });
  };

  getSelectOptions = () => {
    Promise.all([
      distSelect(1),
      distSelect(38),
      distSelect(65),
      distSelect(92),
      distSelect(117),
      distSelectZh(1),
      distSelectZh(117),
    ]).then((res) => {
      let briefUsers = this.props.briefUsers;
      this.props.dispatch(getNewOptions(['jobFounctionList', res[0].response]));
      this.props.dispatch(getNewOptions(['languageList', res[1].response]));
      this.props.dispatch(getNewOptions(['degreeList', res[2].response]));
      this.props.dispatch(getNewOptions(['workAuthList', res[3].response]));
      this.props.dispatch(getNewOptions(['industryList', res[4].response]));
      this.props.dispatch(
        getNewOptions(['jobFounctionListZh', res[5].response])
      );
      this.props.dispatch(getNewOptions(['industryListZh', res[6].response]));
      this.props.dispatch(getNewOptions(['allUserOptions', briefUsers]));
    });
  };

  getCandidatesData = () => {
    this.props.dispatch(candidateGetMyOrAll(false));
    this.props.dispatch(candidateResetSearch());
    this.props.dispatch(getSearchData(this.props.jobId));
  };

  handleClick = (item, e, type) => {
    this.setState({
      isClick: item.colName,
      anchorEl: e.currentTarget,
      open: true,
      params: item,
      type,
    });
  };

  setNewColumns = () => {
    let newColumns = [...columns1, ...columns2];
    this.setState({
      columns: newColumns,
      columnsShow: true,
    });
  };

  // 关闭
  handleClose = () => {
    this.setState({
      open: false,
      isClick: null,
    });
  };

  removeColumns = () => {
    const { columns } = this.state;
    let _columns = loadsh.cloneDeep(columns);
    let newColumns = _columns.filter(
      (x) => !columns2.some((item) => x.col === item.col)
    );
    this.setState({
      columns: newColumns,
      columnsShow: false,
    });
  };

  handlePageChange = (e, nextPage) => {
    // console.log(e, nextPage);
    let obj = {
      page: nextPage * 1 + 1,
      size: this.state.size,
      jobId: this.props.jobId,
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
      jobId: this.props.jobId,
    };
    this.setState({
      size: e.target.value,
    });
    this.props.dispatch(resetPage());
    this.props.dispatch(chagneSizePage(obj));
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.dispatch(resetPage());
      this.props.dispatch(
        CandidateGetGeneral(e.target.value, this.props.jobId)
      );
    }
  };

  handleDelete = (data, e) => {
    const { columns } = this.state;

    // 因为degrees hight school 字段和下面方式有冲突  所以暂时写个判断
    let flag = 'Degrees';
    if (data.indexOf(flag) > -1) {
      let res = columns.filter((item) => {
        return item.colName === 'Degrees';
      })[0];
      this.props.dispatch(
        deleteFilter({ type: res.field, jobId: this.props.jobId })
      );
      // console.log('--------------删除filter接口调用');
    } else {
      let items = columns.filter((item) => {
        return data.indexOf(item.colName) > -1;
      })[0];
      // console.log(items);
      this.props.dispatch(
        deleteFilter({ type: items.field, jobId: this.props.jobId })
      );
      // console.log('--------------删除filter接口调用');
    }
  };

  onChangeSetting = (arr) => {
    this.setState(
      {
        headerList: arr,
      },
      () => {
        this.saveColumns(arr);
      }
    );
  };

  handleNext = () => {
    this.setState(({ stepIndex }) => ({ stepIndex: stepIndex + 1 }));
  };

  handlePrev = () => {
    const { tableData } = this.props;
    this.setState(({ stepIndex }) => ({
      stepIndex: stepIndex - 1,
      selected: null,
    }));
    const normalizedData = normalize(tableData, [talentBasic]);

    this.props.dispatch({
      type: ActionTypes.RECEIVE_TALENT_LIST,
      tab: 'es',
      normalizedData,
    });
  };

  beforeApply = () => {
    this.setState({ processing: true });
  };

  afterApply = (newApplication) => {
    if (newApplication) {
      this.props.handleRequestClose();
    } else {
      this.setState({ processing: false });
    }
  };

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onSelectionChanged = () => {
    let selectedRows = this.gridApi.getSelectedRows();
    let ids = selectedRows.map((item, index) => {
      return item.id;
    });

    if (selectedRows.length) {
      this.setState({
        processing: false,
        selected: selectedRows[0]._id,
      });
    } else {
      this.setState({
        selected: null,
      });
    }
  };

  //保存用户columns设置
  saveColumns = (data) => {
    let obj = {
      itemSortAll: JSON.stringify(data),
      module: 'JOB_PICK_CANDIDATE',
    };
    saveCandidateColumns(obj).then(({ response }) => {
      // console.log('saveColumns ----OK');
    });
  };

  ////拖动columns保存顺序
  onDragStopped = (params) => {
    let list = params.api.getColumnDefs();
    let { sortList } = this.state;

    let orderList = [];
    list.map((item) => {
      if (item.colId !== 'setting') {
        orderList.push({
          colId: item.colId,
          showFlag: !item.hide,
          label: item.headerName,
          sortFlag: item.sortable,
          width: item.width,
          column: item.field,
        });
      }
    });
    sortList.forEach((item) => {
      orderList.forEach((_item) => {
        if (item.colId === _item.colId) {
          _item.sort = item.sort;
        }
      });
    });
    // console.log(sortList);
    this.setState(
      {
        headerList: orderList,
      },
      () => {
        this.saveColumns(orderList);
      }
    );
  };

  /////

  render() {
    const { t, classes, loading, tableData, count, jobId } = this.props;
    const {
      isClick,
      anchorEl,
      headerList,
      showFilter,
      params,
      size,
      page,
      open,
      type,
      columnsShow,
      filterStr,
      columns,
      selected,
      general,
    } = this.state;
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column "
        style={{ overflow: 'hidden' }}
      >
        <DialogTitle>{t('common:applyCandidates')}</DialogTitle>

        {this.state.stepIndex === 0 ? (
          <div
            style={{
              height: 520,
              overflow: 'hidden',
              padding: '0 23px 0 23px',
              overflowY: 'scroll',
            }}
            className={clsx('ag-theme-alpine')}
          >
            <div className={classes.flex}>
              <OutlinedInput
                // onChange={this.handleChange}
                onKeyDown={this.onKeyDown}
                style={{
                  height: 32,
                  width: 219,
                  background: '#edf5ff',
                  marginTop: 2,
                  marginBottom: 15,
                }}
                value={general}
                onChange={(e) => {
                  this.setState({
                    general: e.target.value,
                  });
                }}
                size="small"
                variant="outlined"
                placeholder={this.props.t('tab:Search Candidates')}
                startAdornment={
                  <InputAdornment color="disabled" position="start">
                    <SearchIcon style={{ fontSize: 18 }} />
                  </InputAdornment>
                }
              />
              <span onClick={this.handleShow} style={{ ...styles.show }}>
                {showFilter
                  ? this.props?.t('tab:Hide Filters')
                  : this.props?.t('tab:Show Filters')}
              </span>
            </div>
            {showFilter ? (
              <div className={classes.list_box}>
                {columns.map((item) => (
                  <span
                    key={item.colName}
                    onClick={(e) => this.handleClick(item, e, 'search')}
                    className={`${classes.search_list} ${classes.flexs} ${
                      isClick === item.colName ? classes.is_click : ''
                    }`}
                  >
                    {item.colName.toLocaleString()}
                    {isClick === item.colName ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )}
                  </span>
                ))}
                <span>
                  {!columnsShow ? (
                    <AddIcon
                      className={classes.iconStyle}
                      onClick={() => {
                        this.setNewColumns();
                      }}
                    />
                  ) : (
                    <RemoveIcon
                      className={classes.iconStyle}
                      onClick={() => {
                        this.removeColumns();
                      }}
                    />
                  )}
                </span>
              </div>
            ) : (
              <> </>
            )}
            <div className={classes.list_box}>
              {filterStr.map((item, index) => (
                <Tooltip title={item} key={item + index} placement="top-end">
                  <Chip
                    color="default"
                    size="small"
                    label={item}
                    onDelete={(e) => this.handleDelete(item, e)}
                    // 是否弹出回显气泡
                    // onClick={(e) => this.handleClickFilter(item, e, 'update')}
                    deleteIcon={<ClearIcon color="disabled" />}
                    className="every"
                  />
                </Tooltip>
              ))}
            </div>

            {loading ? (
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
            ) : (
              <div
                style={{
                  height: showFilter ? 340 : 400,
                  overflow: 'hidden',
                  // padding: '0 10px 0 10px'
                }}
              >
                <AgGridReact
                  rowData={tableData}
                  onGridReady={this.onGridReady}
                  frameworkComponents={frameworkComponents}
                  onDragStopped={this.onDragStopped}
                  onFirstDataRendered={this.onFirstDataRendered}
                  suppressDragLeaveHidesColumns={true}
                  onSelectionChanged={this.onSelectionChanged}
                >
                  {headerList.map((item) => {
                    if (item.colId === 'checkbox') {
                      return (
                        <AgGridColumn
                          width={60}
                          key={item.colId}
                          colId={item.colId}
                          headerName=""
                          field=""
                          headerCheckboxSelection={false}
                          checkboxSelection={true}
                          lockPosition={true}
                          pinned="left"
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
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="currLocationCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          suppressMovable={false}
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
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="perferLocationCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          suppressMovable={false}
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
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="salaryRangeCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                        />
                      );
                    } else if (
                      item.colId === 'phones' ||
                      item.colId === 'emails' ||
                      item.colId === 'industries' ||
                      item.colId === 'jobFunctions' ||
                      item.colId === 'languages' ||
                      item.colId === 'skills'
                    ) {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          resizable={true}
                          headerTooltip={item.label}
                          cellRenderer="contactCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          suppressMovable={false}
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
                          cellRenderer="experienceCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          suppressMovable={false}
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
                          cellRenderer="dateCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          suppressMovable={false}
                        />
                      );
                    } else if (item.colId === 'createdBy') {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          cellRenderer="createdByCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          suppressMovable={false}
                        />
                      );
                    } else if (
                      item.colId === 'am' ||
                      item.colId === 'dm' ||
                      item.colId === 'school' ||
                      item.colId === 'degrees' ||
                      item.colId === 'major' ||
                      item.colId === 'recruiter' ||
                      item.colId === 'owner'
                    ) {
                      return (
                        <AgGridColumn
                          field={item.column}
                          colId={item.colId}
                          key={item.label}
                          headerName={item.label}
                          width={item.width}
                          hide={!item.showFlag}
                          cellRenderer="arrCell"
                          headerComponentParams={{
                            params: item,
                            onChangeSort: this.onChangeSort,
                          }}
                          resizable={true}
                          headerTooltip={item.label}
                          suppressMovable={false}
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
                        />
                      );
                    }
                  })}
                  <AgGridColumn
                    resizable={true}
                    // headerTooltip={item.label}
                    width="60"
                    colId={'setting'}
                    headerComponent={'settingCell'}
                    headerComponentParams={{
                      headerList: headerList,
                      onChangeSetting: this.onChangeSetting,
                    }}
                    pinned="right"
                  />
                </AgGridReact>
              </div>
            )}

            <TablePagination
              component="div"
              count={count > 600 ? 600 : count}
              page={page}
              rowsPerPage={size}
              onPageChange={this.handlePageChange}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
            />
          </div>
        ) : (
          <DialogContent>
            <AddApplicationForm
              talentId={selected}
              jobId={jobId}
              t={t}
              onSubmit={this.beforeApply}
              onSubmitSuccess={this.afterApply}
              isJobDetail={true}
            />
          </DialogContent>
        )}

        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={this.handleCancel}>
              {t('action:cancel')}
            </SecondaryButton>
            {/* <PrimaryButton onClick={this.submit}>{t('action:submit')}</PrimaryButton> */}
            {/* <PrimaryButton onClick={this.handleNext}>{t('action:submit')}</PrimaryButton> */}

            {this.state.stepIndex === 0 ? (
              <PrimaryButton
                processing={this.state.processing}
                onClick={this.handleNext}
                disabled={!selected}
              >
                {t('action:next')}
              </PrimaryButton>
            ) : (
              <SecondaryButton onClick={this.handlePrev}>
                {t('action:prev')}
              </SecondaryButton>
            )}

            {this.state.stepIndex === 1 && (
              <PrimaryButton
                // disabled={filteredSelected.size === 0}
                processing={this.state.processing}
                type="submit"
                form="applicationForm"
              >
                {t('action:apply')}
              </PrimaryButton>
            )}
          </div>
        </DialogActions>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Search
            jobId={jobId}
            handleClose={this.handleClose}
            params={params}
            type={type}
          />
        </Popover>
      </div>
    );
  }
}

ApplyTalent.propTypes = {
  jobId: PropTypes.string.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state, { jobId }) {
  //to list all including the applied candidates
  const basicSearch = state.controller.newCandidateJob.toJS().basicSearch;
  const { arr, strShow } = candidateFilterSearch(basicSearch);
  const requestData = candidateRequestFilter(arr);
  return {
    requestData,
    tableData: state.controller.newCandidateJob.toJS().tableData,
    count: state.controller.newCandidateJob.toJS().count * 1,
    pages: state.controller.newCandidateJob.toJS().page * 1,
    sizes: state.controller.newCandidateJob.toJS().size * 1,
    searchStr: strShow,
    types: state.controller.newCandidateJob.toJS().searchLevel,
    loading: state.controller.newCandidateJob.toJS().loading,
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
    general: state.controller.newCandidateJob.toJS().general,
  };
}

export default connect(mapStoreStateToProps)(withStyles(styles)(ApplyTalent));
