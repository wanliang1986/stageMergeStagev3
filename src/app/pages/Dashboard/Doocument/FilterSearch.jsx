import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import loadsh from 'lodash';
import PrimaryButton from '../../../components/particial/PotentialButton';

import Search from './components/Search';
import SaveDocumentDialog from './components/SaveDocumentDialog';
import { documentViweColumns } from '../../../../utils/documentViewSearch';
import { position } from 'dom-helpers';
import { forEach } from 'lodash';
import {
  newDeleteSearch,
  newSaveFiltersName,
  newInterfaceDeleteSearch,
  newDocumentSearch,
} from '../../../actions/newDocumentView';
import * as ActionTypes from '../../../constants/actionTypes';
import FormInput from '../../../components/particial/FormInput';
import {
  saveFilterDocument,
  deleteFilterCandidate,
  getFilterDocument,
} from '../../../../apn-sdk/documentDashboard';
import Dialog from '@material-ui/core/Dialog';

const styles = {
  search: {
    padding: '10px',
  },
  card: {
    padding: '7px 10px',
    background: '#FAFAFB',
  },
  flex: {
    display: 'flex !important',
    alignItems: 'center !important',
  },
  left_box: {
    width: '90%',
    '& .list_box': {
      display: 'flex !important',
      alignItems: 'center !important',
      width: '100%',
      flexWrap: 'wrap',
      minHeight: '25px',
      '& span:nth-last-child(1)': {
        borderRight: 'none !important',
      },
    },
    '& .search_filter': {
      padding: '5px 10px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '95%',
      lineHeight: '20px',
      '& .every': {
        marginBottom: '8px',
        marginRight: 10,
        maxWidth: '230px',
        '& .MuiChip-deleteIconSmall': {
          color: '#6E6E6E',
        },
      },
      '& .button': {
        display: 'inline-block',
        marginBottom: '5px',
        marginRight: 20,
        color: '#3398dc',
        fontSize: 14,
        cursor: 'pointer',
      },
    },
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
  box_btn: {
    width: '121px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  is_click: {
    color: '#3398dc !important',
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
  SaveStyle: {
    width: '360px',
    display: 'flex',
    padding: '20px',
    position: 'relative',
    minHeight: '114px',
    flexShrink: 0,
    borderRadius: '5px',
    flexDirection: 'column',
  },
};

const DeleteFilter = (props) => {
  const { getCancel, getDetele } = props;
  return (
    <Dialog open={props.DeleteFilterStatu}>
      <div style={{ width: '500px', padding: '27px' }}>
        <div
          style={{
            marginBottom: '20px',
            color: '#505050',
            fontSize: '16px',
            fontWeight: '500',
          }}
        >
          Delete Filter
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#505050',
            marginBottom: '20px',
          }}
        >
          Are you sure you want to delete this saved filter?
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '8px' }}>
            <PrimaryButton
              style={{
                border: 'solid 1px #3398dc',
              }}
              type="submit"
              fullWidth
              onClick={() => getCancel()}
            >
              Cancel
            </PrimaryButton>
          </div>
          <div>
            <PrimaryButton
              style={{
                background: '#3398dc',
                color: 'white',
                border: 'solid 1px #3398dc',
              }}
              type="submit"
              fullWidth
              onClick={() => getDetele()}
            >
              Delete
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
class FilterSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Newcolumns: [],
      isClick: null,
      type: null,
      open: false,
      anchorEl: null,
      savedOpen: false,
      filterStr: [],
      SaveFilterOpen: false,
      FilterNameValue: '',
      optionList: [],
      filtertDataList: [],
      DeleteFilterStatu: false,
      savedFilterData: null,
    };
  }
  componentDidMount() {
    let newRes = documentViweColumns;
    this.setState({
      Newcolumns: newRes,
    });
  }

  // 点击每个普通搜索
  handleClick = (item, e, type) => {
    console.log('item', item);
    this.setState({
      isClick: item.colName,
      type: item.type,
      open: true,
      anchorEl: e.currentTarget,
    });
  };
  // 关闭
  handleClose = () => {
    this.setState({
      open: false,
      isClick: null,
      SaveFilterOpen: false,
    });
  };
  getFil() {
    getFilterDocument().then((res) => {
      let niceArr = [];
      let stu;
      res.response.forEach((item) => {
        stu = JSON.parse(item.searchContent);
        niceArr.push({
          id: item.id,
          module: item.module,
          // searchContent: item.searchContent,
          searchContent: stu,
          searchGroup: item.searchGroup,
          searchName: item.searchName,
          searchType: item.searchType,
        });
      });
      console.log('niceArr', niceArr);
      // let yyArr = niceArr.slice(0, 1);
      this.setState({
        SavedFilterArr: niceArr,
      });
    });
  }
  getChangeSearch = (data) => {
    this.setState({
      SavedFilterArr: data,
    });
  };
  // search组件回传的参数
  openStatus = (data) => {
    console.log('我是回传的', data);
    this.setState({
      open: data,
      isClick: null,
    });
  };
  // saved Filters点击事件
  handleSaved = () => {
    this.setState(
      {
        savedOpen: true,
      },
      () => {
        this.getFil();
      }
    );
  };
  // 接收子组件传回来的弹框状态
  closeSaved = () => {
    this.setState({
      savedOpen: false,
    });
  };
  // 点击删除saved Filters中的button delete
  getDeleteData = (data) => {
    this.setState({
      DeleteFilterStatu: data.status,
      savedFilterData: data,
    });
  };
  getCancel = () => {
    this.setState({
      DeleteFilterStatu: false,
    });
  };
  getDetele = () => {
    const { savedFilterData, SavedFilterArr } = this.state;
    deleteFilterCandidate(savedFilterData.item.id).then((res) => {
      this.setState(
        {
          DeleteFilterStatu: false,
        },
        () => {
          let arrList = [...this.state.SavedFilterArr];
          arrList.forEach((item, index1) => {
            if (index1 == savedFilterData.index) {
              arrList.splice(savedFilterData.index, 1);
            }
          });
          this.setState({
            SavedFilterArr: arrList,
          });
        }
      );
    });
  };
  // 删除搜索条件
  handleDelete = (data, e) => {
    this.props.dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    let showList = loadsh.cloneDeep(this.props.searchShow);
    let interfaceDataList = loadsh.cloneDeep(
      this.props.searchinterfaceDataList
    );
    showList.forEach((item, index) => {
      if (data.filterGroup == item.key) {
        showList.splice(index, 1);
      }
    });
    interfaceDataList.search[0].condition.forEach((item2, index) => {
      if (data.filterGroup == item2.key) {
        interfaceDataList.search[0].condition.splice(index, 1);
      }
    });
    console.log('interfaceDataList', interfaceDataList);
    console.log('showList', showList);
    this.props.dispatch(newDocumentSearch(interfaceDataList));
    this.props.dispatch(newDeleteSearch(showList));
    this.props.dispatch(newInterfaceDeleteSearch(interfaceDataList));
  };
  // props改变
  componentWillReceiveProps(nextProps) {}
  //普通搜索拼接回显
  getChip = (filter) => {
    const chips = [];
    filter.length > 0 &&
      filter.forEach((item, index) => {
        if (item.key == 'employeeName') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Employee Name',
            label: `Employee Name : ${str}`,
          });
        }
        if (item.key == 'jobId') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Job ID',
            label: `Job ID : ${str}`,
          });
        }
        if (item.key == 'jobCode') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Job Code',
            label: `Job Code : ${str}`,
          });
        }
        if (item.key == 'assignedById') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: 'assignedById',
            key: 'Assigned By',
            label: `Assigned By : ${str}`,
          });
        }
        if (item.key == 'companyId') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: 'companyId',
            key: 'Company',
            label: `Company : ${str}`,
          });
        }
        if (item.key == 'startByUserId') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: 'startByUserId',
            key: 'Starts By User',
            label: `Starts By User : ${str}`,
          });
        }
        if (item.key == 'packageName') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: 'packageName',
            key: 'Package Name',
            label: `Package Name : ${str}`,
          });
        }
        if (item.key == 'department') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Department',
            label: `Department : ${str}`,
          });
        }
        if (item.key == 'documentName') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: 'documentName',
            key: 'Document Name',
            label: `Document Name : ${str}`,
          });
        }
        if (item.key == 'jobTitle') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.value}"`;
            } else {
              str += ` "${item2.value}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Job Title',
            label: `Job Title : ${str}`,
          });
        }
        if (item.key == 'packageStatus') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.label}"`;
            } else {
              str += ` "${item2.label}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Package Status',
            label: `Package Status : ${str}`,
          });
        }
        if (item.key == 'documentType') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.label}"`;
            } else {
              str += ` "${item2.label}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Document Type',
            label: `Document Type : ${str}`,
          });
        }
        if (item.key == 'documentStatus') {
          let str = '';
          item.values.map((item2, index2) => {
            if (index2 === item.values.length - 1) {
              str += ` "${item2.label}"`;
            } else {
              str += ` "${item2.label}"　or　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Document Status',
            label: `Document Status : ${str}`,
          });
        }
        if (item.key == 'startingOn') {
          let str = '';
          item.values.map((item2, index2) => {
            let d = new Date(item2.value * 1000);
            if (index2 === item.values.length - 1) {
              d =
                d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
              str += ` "${d}"`;
            } else {
              d =
                d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
              str += ` "${d}"　-　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Starting On',
            label: `Starting On : ${str}`,
          });
        }
        if (item.key == 'packageAssignedOn') {
          let str = '';
          item.values.map((item2, index2) => {
            let d = new Date(item2.value * 1000);
            if (index2 === item.values.length - 1) {
              d =
                d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
              str += ` "${d}"`;
            } else {
              d =
                d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
              str += ` "${d}"　-　`;
            }
          });
          chips.push({
            filterGroup: item.key,
            key: 'Package Assigned On',
            label: `PackageAssigned On : ${str}`,
          });
        }
      });
    return chips;
  };
  // Clear All事件
  handleClearAllAdvanced = () => {
    this.props.dispatch({
      type: ActionTypes.DOCUMENT_CLEAR_ALL,
    });
    this.props.dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    let interFaceList = loadsh.cloneDeep(this.props.searchinterfaceDataList);
    interFaceList.search[0].condition = [];

    this.props.dispatch({
      type: ActionTypes.DOCUMENT_INTERFACE_CLEAR_ALL,
      payload: interFaceList,
    });
    this.props.dispatch(newDocumentSearch(interFaceList));
  };
  // Save Filters事件
  handleSaveFilter = (e) => {
    let saveList = this.getChip(this.props.searchShow);
    let str = '';
    saveList.forEach((item) => {
      str += item.label.replace(/\s*/g, '') + ' , ';
    });
    this.setState({
      FilterNameValue: str,
      SaveFilterOpen: true,
      anchorEl: e.currentTarget,
    });
  };
  getFilterNameValue = (e) => {
    console.log(e.target.value);
    this.setState({
      FilterNameValue: e.target.value,
    });
  };
  // 保存save filters 操作
  handleSaveFilters = (e) => {
    let arr = [];
    arr = this.getChip(this.props.searchShow);

    let str = '';
    arr.forEach((item) => {
      str += JSON.stringify(item.label) + ',';
    });

    let mani = {
      arr: this.props.searchShow,
      name: str,
    };
    console.log('mani', mani);
    let obj = {
      searchContent: JSON.stringify(mani),
      // searchContent: JSON.stringify(this.props.searchinterfaceDataList),
      searchName: JSON.stringify(this.state.FilterNameValue.substring(0, 20)),
      searchGroup: JSON.stringify(this.props.searchinterfaceDataList),
      // searchGroup: JSON.stringify(str),
      searchType: 'BASE',
      module: 'DASHBOARD_DOCUMENT',
      // searchData: str,
    };
    // let objTo = {
    //   searchContent: JSON.stringify(this.props.searchShow),
    //   searchName: JSON.stringify(this.state.FilterNameValue),
    //   searchType: 'BASE',
    //   module: 'DASHBOARD_DOCUMENT',
    //   searchGroup: JSON.stringify(str),
    // };
    let filterArr = [];
    filterArr.push(obj);
    let a = filterArr.concat(this.props.objArr);

    saveFilterDocument(obj).then((res) => {
      console.log('res', res);
    });

    this.props.dispatch(newSaveFiltersName(a));
    this.handleClose();
  };
  render() {
    const { classes, searchShow, Newcolumns } = this.props;
    const {
      // Newcolumns,
      isClick,
      open,
      anchorEl,
      type,
      savedOpen,
      SaveFilterOpen,
      filtertDataList,
    } = this.state;
    let filterStrList = [];
    filterStrList = this.getChip(searchShow);
    return (
      <div style={{ ...styles.search }}>
        <Card variant="outlined" className={classes.card}>
          <div className={classes.flex}>
            <div className={classes.left_box}>
              <div className="list_box">
                {Newcolumns.map((item) => (
                  <span
                    key={item.colName}
                    onClick={(e) => this.handleClick(item, e, 'search')}
                    className={`${classes.search_list} ${classes.flex} ${
                      isClick == item.colName ? classes.is_click : ''
                    }`}
                  >
                    {item.colName.toLocaleString()}
                    {isClick == item.colName ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon />
                    )}
                  </span>
                ))}
              </div>
              {/* 普通搜素搜结果回显的气泡 */}
              <div className="search_filter">
                {filterStrList.length > 0 &&
                  filterStrList.map((item, index) => {
                    return (
                      <Tooltip
                        title={item.label}
                        key={item.label + index}
                        placement="top-end"
                      >
                        <Chip
                          style={{ maxWidth: '880px' }}
                          color="default"
                          size="small"
                          label={item.label}
                          onDelete={(e) => this.handleDelete(item, e)}
                          // 是否弹出回显气泡
                          // onClick={(e) => this.handleClickFilter(item, e, 'update')}
                          deleteIcon={<ClearIcon color="disabled" />}
                          className="every"
                        />
                      </Tooltip>
                    );
                  })}
                {filterStrList.length > 0 && (
                  <>
                    <span
                      className="button"
                      onClick={() => {
                        this.handleClearAllAdvanced();
                      }}
                    >
                      Clear All
                    </span>
                    <span className="button" onClick={this.handleSaveFilter}>
                      Save Filters
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className={classes.box_btn}>
              <Button
                style={{ width: '100%', height: 28 }}
                variant="outlined"
                color="primary"
                onClick={this.handleSaved}
              >
                Saved Filters
              </Button>
            </div>

            {/* 点击每个普通搜索的弹框 */}
            <Popover
              style={{ zIndex: 1300 }}
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
                nameStatus={'documentView'}
                openStatus={this.openStatus}
                type={type}
              />
            </Popover>

            {/* 点击Save Filters弹框(存储到过滤器) */}

            <Popover
              open={SaveFilterOpen}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              onClose={this.handleClose}
              anchorEl={anchorEl}
            >
              <div className={classes.SaveStyle}>
                <div>
                  <span>Filter Name</span>

                  <FormInput
                    onChange={(e) => this.getFilterNameValue(e)}
                    value={this.state.FilterNameValue.substring(0, 20)}
                    style={{ marginTop: '20px', marginBottom: '20px' }}
                    type="text"
                  />
                </div>
                <div>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={this.handleSaveFilters}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Popover>
          </div>
        </Card>
        <SaveDocumentDialog
          getDeleteData={this.getDeleteData}
          close={this.closeSaved}
          open={savedOpen}
          SavedFilterArr={this.state.SavedFilterArr}
          getChangeSearch={this.getChangeSearch}
        />
        <DeleteFilter
          getDetele={this.getDetele}
          getCancel={this.getCancel}
          DeleteFilterStatu={this.state.DeleteFilterStatu}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let searchShow = state.controller.documentView.toJS().searchDataList || [];
  let searchinterfaceDataList =
    state.controller.documentView.toJS().interfaceDataList || [];
  let objArr = state.controller.documentView.toJS().saveFiltersObj || [];
  return {
    searchShow,
    searchinterfaceDataList,
    objArr,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(FilterSearch));
