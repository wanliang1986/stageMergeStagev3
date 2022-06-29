import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import loadsh, { keys } from 'lodash';

import * as ActionTypes from '../../../../constants/actionTypes';
import {
  getPackageFilterDocument,
  deleteFilterCandidate,
  getFilterSearchPackage,
} from '../../../../../apn-sdk/documentDashboard';
import { newPackageSearch } from '../../../../actions/newDocumentView';
const styles = {
  searchInput: {
    height: 32,
    width: 269,
    background: '#fff',
    marginBottom: '12px',
  },
  no_data: {
    minHeight: '100px',
  },
  dialogs: {
    '& .MuiPaper-root': {
      maxWidth: '800px !important',
      width: 800,
      borderRadius: 0,
    },
    '& .list': {
      marginBottom: '12px',
      '& .no_data': {
        width: '100%',
      },
    },
    '& .btn': {
      width: 107,
      height: 33,
    },
  },
  Accordion: {
    maxWidth: '100% !important',
    width: '100% !important',
    '& .dialog_content': {
      paddingTop: '17px',
      paddingBottom: '17px',
    },
    '& .content': {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      '& .MuiChip-sizeSmall': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '& .MuiChip-label': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '& .and': {
        margin: '0 5px',
      },
    },
  },
  header: {
    minHeight: '45px !important',
    height: '50px',
    background: '#FAFAFB',
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '95%',
      '& .MuiTypography-root': {
        width: '74%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '16px',
        fontWeight: 550,
        color: '#505050',
      },
    },
    '& .MuiAccordionSummary-root': {
      paddingLeft: '5px',
    },
    '& .actions': {
      width: '23%',
      display: 'flex',
      justifyContent: 'space-between',
      '& span': {
        color: '#4EA5DF',
        fontSize: '14px',
        fontWeight: 550,
      },
    },
  },
};
function showChip(str, type) {
  if (type == 'BASE') {
    // let strArr = JSON.parse(str);
    // let arr = [];
    // strArr.forEach((item) => {
    //   item.values.forEach((item2) => {
    //     arr.push({
    //       key: item.key,
    //       value: item2.value,
    //     });
    //   });
    // });
    // console.log('arr', arr);

    str = str.name ? str.name.replace(/","]/g, '""]').substr(1) : null;
    let arr = str ? str.replace(/\\/g, '').split(',') : null;
    if (arr && arr.length >= 1) {
      arr.pop();
    }
    return arr;
  } else {
    let showStr = JSON.parse(str);
    let arr = [];
    showStr.forEach((item) => {
      arr = arr.concat(item[1].split(','), 'or');
    });
    arr = arr.filter((item) => {
      return item != '';
    });
    arr.pop();

    return arr;
  }
}
class SaveDocumentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [],
      open: false,
    };
  }
  // 查询保存的列表
  // getFil() {
  //   getPackageFilterDocument().then((res) => {
  //     console.log('res', res);
  //     let niceArr = [];
  //     let stu;
  //     res.response.forEach((item) => {
  //       stu = JSON.parse(item.searchContent);
  //       niceArr.push({
  //         id: item.id,
  //         module: item.module,
  //         // searchContent: item.searchContent,
  //         searchContent: stu,
  //         searchGroup: item.searchGroup,
  //         searchName: item.searchName,
  //         searchType: item.searchType,
  //       });
  //     });
  //     console.log('niceArr', niceArr);
  //     // let yyArr = niceArr.slice(0, 1);
  //     this.setState({
  //       arr: niceArr,
  //     });
  //   });
  // }
  componentDidMount() {}
  // 传给父组件(关闭弹窗状态)
  handleClose = () => {
    this.props.close(false);
  };
  // 监听父组件传过来的props是否发生变化
  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps.savePackageFiltersObj);
    // this.getFil();
    this.setState({
      open: nextProps.open,
      // arr: nextProps.savePackageFiltersObj,
      // arr: this.props.filtertDataList,
    });
  }
  // 每一行数据的search事件
  handleSearch = (e, item, index) => {
    const { dispatch, interfaceData } = this.props;
    dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    console.log(e, item);
    console.log(JSON.parse(item.searchGroup));
    let params = JSON.parse(item.searchGroup);

    dispatch({
      type: ActionTypes.DOCUMENT_PACKAGE_REGULAR_SEARCH,
      payload: item.searchContent.arr,
    });
    dispatch({
      type: ActionTypes.PACKAGE_INTERFACE,
      payload: params,
    });
    if (interfaceData.pageNumber && interfaceData.pageSize) {
      params.pageNumber = interfaceData.pageNumber;
      params.pageSize = interfaceData.pageSize;
    } else {
      params.pageNumber = 1;
      params.pageSize = 25;
    }
    dispatch(newPackageSearch(params));
    this.props.close(false);
  };
  // 每一行数据的delete事件
  handleDelete = (e, item, index) => {
    const { dispatch } = this.props;
    e.stopPropagation();
    let params = {
      item,
      status: true,
      arrList: this.state.arr,
      index,
    };
    this.props.getDeleteData(params);
    // let arrList = loadsh.cloneDeep(this.state.arr);
    // arrList.forEach((item, index1) => {
    //   if (index1 == index) {
    //     arrList.splice(index, 1);
    //   }
    // });
    // this.setState({
    //   arr: arrList,
    // });
    // let id = item.id;
    // deleteFilterCandidate(id).then((res) => {
    //   console.log('res', res);
    // });
    // console.log('arrList', arrList);
  };
  handleChange = (e) => {
    console.log('e', e.target.value);
    let value = e.target.value;
    getFilterSearchPackage(value).then((res) => {
      console.log('res', res);
      let list = res.response;
      list.forEach((item) => {
        item.searchContent = JSON.parse(item.searchContent);
      });
      this.setState(
        {
          arr: list,
        },
        () => {
          this.props.getChangeSearch(list);
        }
      );
    });
  };
  render() {
    const { classes, SavedFilterArr } = this.props;
    const { open, arr } = this.state;
    console.log('arr', arr);
    return (
      <>
        <Dialog
          onClose={this.handleClose}
          className={classes.dialogs}
          open={open}
        >
          <DialogTitle className="title" id="responsive-dialog-title">
            {'Saved Filters'}
          </DialogTitle>
          <DialogContent>
            <OutlinedInput
              onChange={this.handleChange}
              className={classes.searchInput}
              size="small"
              variant="outlined"
              placeholder="Search filter name, keywords..."
              startAdornment={
                <InputAdornment color="disabled" position="start">
                  <SearchIcon style={{ fontSize: 18 }} />
                </InputAdornment>
              }
            />
            {SavedFilterArr && SavedFilterArr.length == 0 && (
              <div className={classes.no_data}></div>
            )}
            {SavedFilterArr && SavedFilterArr.length > 0
              ? SavedFilterArr.map((item, index) => (
                  <div className="list" key={item.createdDate || index}>
                    <Accordion className={classes.Accordion}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        className={classes.header}
                      >
                        <Typography>{item.searchName}</Typography>
                        <div className="actions">
                          <span
                            onClick={(e) => this.handleSearch(e, item, index)}
                          >
                            Search
                          </span>
                          <span
                            onClick={(e) => this.handleDelete(e, item, index)}
                          >
                            Delete
                          </span>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails className="dialog_content">
                        <div className="content">
                          {showChip(item['searchContent'], 'BASE').map(
                            (items, indexs) => {
                              return (
                                <div style={{ marginTop: '5px' }} key={indexs}>
                                  <Tooltip title={items} placement="top-end">
                                    <Chip
                                      color="default"
                                      size="small"
                                      label={items}
                                      className="every"
                                    />
                                  </Tooltip>

                                  {showChip(item['searchContent'], 'BASE')
                                    .length -
                                    1 !=
                                  indexs ? (
                                    <span className="and">and</span>
                                  ) : (
                                    <span className="and">;</span>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))
              : null}
          </DialogContent>
          <DialogActions className="action">
            <Button
              className="btn"
              autoFocus
              onClick={this.handleClose}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  let savePackageFiltersObj =
    state.controller.documentView.toJS().savePackageFiltersObj || [];
  return {
    savePackageFiltersObj,
    interfaceData: state.controller.documentView.toJS().interfaceDataList || [],
  };
};
export default connect(mapStateToProps)(withStyles(styles)(SaveDocumentDialog));
