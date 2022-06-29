import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import loadsh from 'lodash';

import EmployeeNameInput from '../components/EmployeeNameInput';
import SelectCheckBoxInput from '../components/SelectCheckBoxInput';
import PickerInput from '../components/PickerInput';
import * as ActionTypes from '../../../../constants/actionTypes';
import { newPackSearch, newGetData } from '../../../../actions/newDocumentView';
import * as DocumentDataList from '../../../../../utils/documentViewSearch';
import { LocalDrinkSharp } from '@material-ui/icons';
import {
  getActivatedUsers,
  getTenantCompany,
  getDocuments,
  getPackages,
  searchDocument,
} from '../../../../../../src/apn-sdk/documentDashboard';
import { showErrorMessage } from '../../../../actions';
import { newPackageSearch } from '../../../../actions/newDocumentView';
const styles = {
  box: {
    width: '360px',
    minHeight: '114px',
    borderRadius: '5px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    flexShrink: 0,
    paddingBottom: 0,
  },
  fixed: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '30px',
    width: '348px',
    zIndex: 99,
    flexShrink: 0,
    marginBottom: 20,
  },
  button: {
    zIndex: 1,
    bottom: 15,
    flexShrink: 0,
    paddingLeft: 50,
    paddingRight: 50,
    width: 87,
    height: 32,
  },
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputDataList: [],
      optionList: [],
      companyId: [],
      documentNameId: [],
      packageNameId: [],
      assignedById: [],
      startsByUserId: [],
    };
  }
  componentDidMount() {
    const { type, dispatch } = this.props;
    console.log(this.props);

    if (type === 'documentType') {
      this.setState({
        optionList: DocumentDataList.documentTypeData,
      });
    } else if (type === 'documentStatus') {
      this.setState({
        optionList: DocumentDataList.documentStatusData,
      });
    } else if (type === 'packageStatus') {
      this.setState({
        optionList: DocumentDataList.PackageStatusData,
      });
    } else if (type === 'assignedById') {
      getActivatedUsers().then((res) => {
        let arr = [];
        let assignedByIds = [];
        res.response.forEach((item) => {
          arr.push({
            value: item.firstName + ' ' + item.lastName,
            label: item.firstName + ' ' + item.lastName,
            assignedByIds: item.id,
          });
        });
        console.log('assignedByIds', assignedByIds);
        this.setState({
          optionList: arr,
          assignedById: assignedByIds,
        });
      });
    } else if (type === 'startByUserId') {
      getActivatedUsers().then((res) => {
        let arr = [];
        let startsByUserIds = [];
        res.response.forEach((item) => {
          arr.push({
            value: item.firstName + ' ' + item.lastName,
            label: item.firstName + ' ' + item.lastName,
            startsByUserIds: item.id,
          });
        });
        this.setState({
          optionList: arr,
          startsByUserId: startsByUserIds,
        });
      });
    } else if (type === 'companyId') {
      getTenantCompany().then((res) => {
        let companyArr = [];
        let companyIds = [];
        res.response.forEach((item) => {
          companyArr.push({
            value: item.name,
            label: item.name,
            companyIds: item.id,
          });
        });
        this.setState({
          optionList: companyArr,
          companyId: companyIds,
        });
      });
    }
    //  else if (type === 'documentId') {
    //   getDocuments().then((res) => {
    //     let documentNameIds = [];
    //     let documentNameArr = [];
    //     res.response.forEach((item) => {
    //       documentNameArr.push({
    //         value: item.name,
    //         label: item.name,
    //         documentNameIds: item.id,
    //       });
    //     });
    //     this.setState({
    //       optionList: documentNameArr,
    //       documentNameId: documentNameIds,
    //     });
    //   });
    // } else if (type === 'packageId') {
    //   getPackages().then((res) => {
    //     let packagesNameArr = [];
    //     let packageNameIds = [];
    //     res.response.forEach((item) => {
    //       packagesNameArr.push({
    //         value: item.name,
    //         label: item.name,
    //         packageNameIds: item.id,
    //       });
    //     });
    //     this.setState({
    //       optionList: packagesNameArr,
    //       packageNameId: packageNameIds,
    //     });
    //   });
    // }
  }
  // 点击search
  handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { dispatch, type, inputData, interfaceData } = this.props;
    const { inputDataList, companyId } = this.state;
    let keyArr = [];
    // if (inputDataList.length === 0) {
    //   this.props.dispatch(showErrorMessage('Please enter your search content'));
    //   return;
    // }
    if (inputData?.length > 0) {
      inputData.forEach((item) => {
        keyArr.push(item.key);
      });
    }

    let dataInputArr = [];
    inputDataList.forEach((item) => {
      if (item.value !== '') {
        dataInputArr.push(item);
      }
    });
    if (!keyArr.includes(type) && inputDataList.length === 0) {
      this.props.dispatch(showErrorMessage('Please enter your search content'));
      return;
    }
    if (dataInputArr.length == 0) {
      this.props.dispatch(showErrorMessage('Please enter your search content'));
      return;
    }
    // 往redux存拼接好的页面渲染数据格式
    let dataArr = [];
    let value = inputDataList;
    let arr = [
      {
        key: type,
        values: [],
      },
    ];
    value.forEach((item) => {
      if (item.value !== '') {
        arr.forEach((item2) => {
          if (type == item2.key) {
            arr[0].values.push(item);
          }
        });
      }
    });
    dataArr = arr.concat(inputData);
    let hash = {};
    var newArr = dataArr.reduce((item, next) => {
      hash[next.key] ? '' : (hash[next.key] = true && item.push(next));
      return item;
    }, []);
    console.log('newArr', newArr);
    dispatch(newPackSearch(type, newArr));

    // 拼接查询条件
    let interfaceArr = [];
    let employeeName;
    let jobId;
    let jobCode;
    let assignedBy;
    let company;
    let startingOn;
    let startsByUser;
    let packageName;
    let department;
    let documentName;
    let jobTitle;
    let packageStatus;
    let documentStatus;
    let packageAssignedOn;
    let documentType;
    arr.forEach((item) => {
      if (item.key == 'employeeName') {
        employeeName = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'jobId') {
        jobId = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'jobCode') {
        jobCode = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'assignedById') {
        assignedBy = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'companyId') {
        company = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'startByUserId') {
        startsByUser = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'packageId') {
        packageName = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'department') {
        department = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'documentId') {
        documentName = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'jobTitle') {
        jobTitle = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'packageStatus') {
        packageStatus = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'documentStatus') {
        documentStatus = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'startingOn') {
        startingOn = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'packageAssignedOn') {
        packageAssignedOn = item.values.map((item) => {
          return item.value;
        });
      } else if (item.key == 'documentType') {
        documentType = item.values.map((item) => {
          return item.value;
        });
      }
    });
    let params = {
      search: [
        {
          relation: 'AND',
          condition: [],
        },
      ],
    };
    if (employeeName && type == 'employeeName') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: employeeName,
          relation: 'OR',
        },
      });
    }
    if (jobId && type == 'jobId') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: jobId,
          relation: 'OR',
        },
      });
    }
    if (jobCode && type == 'jobCode') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: jobCode,
          relation: 'OR',
        },
      });
    }
    if (assignedBy && type == 'assignedById') {
      let assignedByIdarr = [];
      arr.forEach((item3) => {
        item3.values.forEach((item4) => {
          assignedByIdarr.push(String(item4.assignedByIds));
        });
      });
      console.log(assignedByIdarr);
      params.search[0].condition.push({
        key: 'assignedById',
        value: {
          data: assignedByIdarr,
          relation: 'OR',
        },
      });
    }
    if (company && type == 'companyId') {
      let companyIdarr = [];
      arr.forEach((item3) => {
        item3.values.forEach((item4) => {
          companyIdarr.push(String(item4.companyIds));
        });
      });
      console.log(companyIdarr);
      params.search[0].condition.push({
        key: 'companyId',
        value: {
          data: companyIdarr,
          relation: 'OR',
        },
      });
    }
    if (startsByUser && type == 'startByUserId') {
      let startsByUserIdarr = [];
      arr.forEach((item3) => {
        item3.values.forEach((item4) => {
          startsByUserIdarr.push(String(item4.startsByUserIds));
        });
      });
      console.log(startsByUserIdarr);
      params.search[0].condition.push({
        key: 'startByUserId',
        value: {
          data: startsByUserIdarr,
          relation: 'OR',
        },
      });
    }
    if (packageName && type == 'packageId') {
      // let packageNamedarr = [];
      // arr.forEach((item3) => {
      //   item3.values.forEach((item4) => {
      //     packageNamedarr.push(String(item4.packageNameIds));
      //   });
      // });
      // console.log(packageNamedarr);
      params.search[0].condition.push({
        key: 'packageName',
        value: {
          data: packageName,
          relation: 'OR',
        },
      });
    }
    if (department && type == 'department') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: department,
          relation: 'OR',
        },
      });
    }
    if (documentName && type == 'documentId') {
      let documentNameIdArr = [];
      arr.forEach((item3) => {
        item3.values.forEach((item4) => {
          documentNameIdArr.push(String(item4.value));
        });
      });
      params.search[0].condition.push({
        key: 'documentName',
        value: {
          data: documentNameIdArr,
          relation: 'OR',
        },
      });
    }
    if (jobTitle && type == 'jobTitle') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: jobTitle,
          relation: 'OR',
        },
      });
    }
    if (packageStatus && type == 'packageStatus') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: packageStatus,
          relation: 'OR',
        },
      });
    }
    if (documentStatus && type == 'documentStatus') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: documentStatus,
          relation: 'OR',
        },
      });
    }
    if (startingOn && type == 'startingOn') {
      let startTime = startingOn[0] * 1000;
      let endTime = startingOn[1] * 1000 + 24 * 60 * 60 * 1000 - 1;
      params.search[0].condition.push({
        key: type,
        value: {
          data: String(startTime + '-' + endTime),
          relation: 'OR',
        },
      });
    }
    if (packageAssignedOn && type == 'packageAssignedOn') {
      let AssignedstartTime = packageAssignedOn[0] * 1000;
      let AssignedendTime =
        packageAssignedOn[1] * 1000 + 24 * 60 * 60 * 1000 - 1;
      params.search[0].condition.push({
        key: type,
        value: {
          data: String(AssignedstartTime + '-' + AssignedendTime),
          relation: 'OR',
        },
      });
    }
    if (documentType && type == 'documentType') {
      params.search[0].condition.push({
        key: type,
        value: {
          data: documentType,
          relation: 'OR',
        },
      });
    }

    params.search[0].condition =
      params &&
      params.search[0].condition.concat(
        interfaceData.search
          ? interfaceData.search.length > 0
            ? interfaceData.search[0].condition
            : []
          : []
      );
    let intefice = {};
    var inteficeArr = params.search[0].condition.reduce((item, next) => {
      intefice[next.key] ? '' : (intefice[next.key] = true && item.push(next));
      return item;
    }, []);
    params.search[0].condition = inteficeArr;
    if (interfaceData.pageNumber && interfaceData.pageSize) {
      params.pageNumber = interfaceData.pageNumber;
      params.pageSize = interfaceData.pageSize;
    } else {
      params.pageNumber = 1;
      params.pageSize = 25;
    }
    console.log('params', params);
    dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    dispatch({
      type: ActionTypes.PACKAGE_INTERFACE,
      payload: params,
    });

    dispatch(newPackageSearch(params));
    this.props.openStatus(false);
  };

  // 接收子组件传来的值
  handleAllData = (data, type) => {
    this.setState({
      inputDataList: data,
    });
  };
  // 接收下拉框select check的值
  handleSelectData = (data) => {
    console.log('data', data);
    this.setState({
      inputDataList: data,
    });
  };
  // 接收日期子组件传过来的值
  handlePickData = (data) => {
    this.setState({
      inputDataList: data,
    });
  };
  render() {
    const { classes, type, nameStatus } = this.props;
    const { optionList, companyId } = this.state;
    return (
      <React.Fragment>
        <div
          style={{ position: 'relative', zIndex: 1400 }}
          className={classes.box}
        >
          <div
            style={{ position: 'relative', zIndex: 1400 }}
            className={classes.fixed}
          >
            {type == 'employeeName' ||
            type == 'jobId' ||
            type == 'jobCode' ||
            type == 'jobTitle' ||
            type == 'packageId' ||
            type == 'documentId' ||
            type == 'department' ? (
              <EmployeeNameInput
                nameStatus={nameStatus}
                type={type}
                allData={this.handleAllData}
              />
            ) : null}
            {type == 'packageStatus' ||
            type == 'documentStatus' ||
            type == 'companyId' ||
            type == 'assignedById' ||
            type == 'startByUserId' ||
            type == 'documentType' ? (
              <SelectCheckBoxInput
                nameStatus={nameStatus}
                type={type}
                selectData={this.handleSelectData}
                optionList={optionList}
              />
            ) : null}
            {type == 'startingOn' || type == 'packageAssignedOn' ? (
              <PickerInput
                type={type}
                nameStatus={nameStatus}
                pickData={this.handlePickData}
              />
            ) : null}
          </div>

          <Button
            className={classes.button}
            onClick={this.handleSearch}
            variant="contained"
            color="primary"
          >
            Search
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    inputData: state.controller.documentView.toJS().packSearchDataList || [],
    interfaceData:
      state.controller.documentView.toJS().packInterfaceDataList || [],
  };
};
export default connect(mapStateToProps)(withStyles(styles)(Search));
