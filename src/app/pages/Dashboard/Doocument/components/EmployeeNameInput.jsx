import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';

import { withStyles } from '@material-ui/core/styles';
// import * as ActionTypes from '../constants/actionTypes';
import * as ActionTypes from '../../../../constants/actionTypes';
import FormInput from '../../../../components/particial/FormInput';

const styles = {
  root: {
    display: 'flex',
  },
  svg: {
    cursor: 'pointer',
    fontSize: '21px',
    color: '#c3c3c3',
    marginLeft: 15,
    marginTop: 5,
  },
};

class EmployeeNameInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [
        {
          value: '',
        },
      ],
      value: '',
      arrStatus: false,
    };
  }
  // 点击添加input
  handleAdd = () => {
    const { dispatch } = this.props;
    let obj = {
      value: '',
    };
    let inputArr = [...this.state.arr];
    inputArr.push(obj);
    if (inputArr.length > 1) {
      this.setState({
        arr: inputArr,
        arrStatus: true,
      });
      dispatch({
        type: ActionTypes.COMPONENT_STATUS,
        payload: true,
      });
    }
    this.props.allData(inputArr);
  };
  componentDidMount() {
    const { packageValueList, documentValueList, type, nameStatus, dispatch } =
      this.props;

    if (nameStatus === 'documentView') {
      if (documentValueList.length == 0) {
        dispatch({
          type: ActionTypes.COMPONENT_STATUS,
          payload: false,
        });
      }
      let arr = [];
      documentValueList.forEach((item) => {
        arr.push(item.key);
        if (item.key === type) {
          this.setState(
            {
              arr: item.values,
            },
            () => {
              this.props.allData(this.state.arr, type);
            }
          );
          if (item.values.length == 0 || item.values.length == 1) {
            dispatch({
              type: ActionTypes.COMPONENT_STATUS,
              payload: false,
            });
          }
          if (item.values.length > 1) {
            dispatch({
              type: ActionTypes.COMPONENT_STATUS,
              payload: true,
            });
          }
        }
        if (item.key != type) {
          dispatch({
            type: ActionTypes.COMPONENT_STATUS,
            payload: false,
          });
        }
      });
      if (arr.includes(type)) {
        documentValueList.forEach((item1, index1) => {
          if (item1.key == type) {
            if (item1.values.length > 1) {
              dispatch({
                type: ActionTypes.COMPONENT_STATUS,
                payload: true,
              });
            }
          }
        });
      }
    } else if (nameStatus === 'packageView') {
      if (packageValueList.length == 0) {
        dispatch({
          type: ActionTypes.COMPONENT_STATUS,
          payload: false,
        });
      }
      let packageArr = [];
      packageValueList.forEach((item) => {
        packageArr.push(item.key);
        if (item.key === type) {
          this.setState(
            {
              arr: item.values,
            },
            () => {
              this.props.allData(this.state.arr, type);
            }
          );
          if (item.values.length == 0 || item.values.length == 1) {
            dispatch({
              type: ActionTypes.COMPONENT_STATUS,
              payload: false,
            });
          }
          if (item.values.length > 1) {
            dispatch({
              type: ActionTypes.COMPONENT_STATUS,
              payload: true,
            });
          }
        }
        if (item.key != type) {
          dispatch({
            type: ActionTypes.COMPONENT_STATUS,
            payload: false,
          });
        }
      });
      if (packageArr.includes(type)) {
        packageValueList.forEach((item1, index1) => {
          if (item1.key == type) {
            if (item1.values.length > 1) {
              dispatch({
                type: ActionTypes.COMPONENT_STATUS,
                payload: true,
              });
            }
          }
        });
      }
    }
  }

  // 点击删除input
  handleRemove = (index) => {
    const { type, dispatch } = this.props;
    let inputArr = [...this.state.arr];
    inputArr.splice(index, 1);
    this.setState({
      arr: inputArr,
    });
    if (inputArr.length < 2) {
      this.setState({
        arrStatus: false,
      });
      dispatch({
        type: ActionTypes.COMPONENT_STATUS,
        payload: false,
      });
    }
    this.props.allData(inputArr);
  };
  // change事件
  fetchValue = (item, index, e) => {
    const { type } = this.props;
    let arrList = [...this.state.arr];
    if (type == 'jobId') {
      arrList[index].value = e.target.value.replace(/[^\d]/g, '');
    } else {
      arrList[index].value = e.target.value;
    }

    this.setState({
      arr: arrList,
    });
    let arrSplicList = [];
    arrList.forEach((item, index) => {
      if (item.value !== '') {
        arrSplicList.push(item);
      }
    });
    console.log(arrList);
    console.log(arrSplicList);
    this.props.allData(arrSplicList, type); //填好的选项回传到父组件
  };
  render() {
    const { classes, arrStatus } = this.props;
    const { arr, value } = this.state;
    return (
      <div>
        {arr.map((item, index) => {
          return (
            <>
              <div className={classes.root}>
                <FormInput
                  onChange={(e) => this.fetchValue(item, index, e)}
                  value={item.value}
                  style={{ width: '256px' }}
                  type="text"
                />

                {index == 0 ? (
                  <>
                    <AddCircleIcon
                      onClick={this.handleAdd}
                      className={classes.svg}
                      color="disabled"
                    />
                    {arrStatus ? (
                      <RemoveCircleIcon
                        onClick={() => this.handleRemove(index)}
                        className={classes.svg}
                        color="disabled"
                      />
                    ) : null}
                  </>
                ) : (
                  <RemoveCircleIcon
                    onClick={() => this.handleRemove(index)}
                    className={classes.svg}
                    color="disabled"
                  />
                )}
                {/* {index > 0 && arrStatus ? (
                  <RemoveCircleIcon
                    onClick={() => this.handleRemove(index)}
                    className={classes.svg}
                    color="disabled"
                  />
                ) : null} */}
              </div>
            </>
          );
        })}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let documentValueList =
    state.controller.documentView.toJS().searchDataList || [];
  let packageValueList =
    state.controller.documentView.toJS().packSearchDataList || [];
  let arrStatus = state.controller.documentView.toJS().componentStatus;
  return {
    documentValueList,
    packageValueList,
    arrStatus,
  };
};
export default connect(mapStateToProps)(withStyles(styles)(EmployeeNameInput));
