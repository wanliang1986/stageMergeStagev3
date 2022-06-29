import * as ActionTypes from '../constants/actionTypes';
import * as apnSDK from './../../apn-sdk/';
import {
  candidateFilterSearch,
  candidateRequestFilter,
  candidateRequestAdvincedFilter,
  commonPoolFilterSearch,
} from '../../utils/search';
import { normalize } from 'normalizr';
import { jobBasic, talentBasic } from './schemas';
import { indexOf } from 'lodash';

// table 排序特殊字段处理
const filterSort = (sort) => {
  let arr = [];
  let obj = {};
  Object.keys(sort).forEach((item) => {
    if (sort[item]) {
      obj = {
        direction: sort[item],
        property: item,
      };
    }
  });
  return obj;
};

export const getNewOptions = (payload) => {
  return {
    type: ActionTypes.CANDIDATE_OPTIONS,
    payload,
  };
};

export const changeSearchFlag = (payload) => {
  return {
    type: ActionTypes.NEW_CANDIDATE_SARCHFLAG,
    payload,
  };
};

// commonPool基本搜索
export const commonPoolGetSearchData = (jobId) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });

  let {
    basicSearch,
    page,
    size,
    sort,
    allOrMy,
    resume,
    commonPoolSelectListTo,
    defultStatus,
    commonPoolSelectList,
  } = getState().controller.newCandidateJob.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = commonPoolFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  let str = filterSort(sort);

  // 判断是否用条件查询
  let initFlag = null;
  if (requestData['and'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (allOrMy) {
    // my
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }
  if ((commonPoolSelectListTo ?? '') !== '') {
    // 循环数组拼接数据格式
    commonPoolSelectListTo.forEach((item) => {
      if (item === 'hasLinkedIn') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasValidEmail') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasPhone') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
    });
  }
  // requestData['and'].push({
  //   and: [
  //     {
  //       affiliations: ['all', 'user_' + id],
  //     },
  //   ],
  // });
  // console.log(requestData);

  return apnSDK
    .jobCommonPoolSearchSrot({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      initFlag,
      defultStatus,
      commonPoolSelectList,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.RECEIVE_TALENT_LIST,
          tab: 'es',
          normalizedData,
          total: response.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// 基本搜索
export const getSearchData = (jobId) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });

  let { basicSearch, page, size, sort, allOrMy, resume } =
    getState().controller.newCandidateJob.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = candidateFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  let str = filterSort(sort);

  // 判断是否用条件查询
  let initFlag = null;
  if (requestData['and'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (allOrMy) {
    // my
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  // requestData['and'].push({
  //   and: [
  //     {
  //       affiliations: ['all', 'user_' + id],
  //     },
  //   ],
  // });
  // console.log(requestData);

  return apnSDK
    .jobCandidateSearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.RECEIVE_TALENT_LIST,
          tab: 'es',
          normalizedData,
          total: response.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// commonPool中Saved Filters弹框中每列的Search查询
export const getCommonPoolSavedSearchData = (jobId) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });
  dispatch({
    type: ActionTypes.UN_SELECT_STATUS,
    payload: true,
  });
  let {
    basicSearch,
    page,
    size,
    sort,
    allOrMy,
    resume,
    commonPoolSelectList,
    commonPoolSelectListTo,
  } = getState().controller.newCandidateJob.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = commonPoolFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = null;
  // if (requestData.and.length === 0) {
  //   initialSearch = true;
  // } else {
  //   initialSearch = false;
  // }
  let str = filterSort(sort);

  if (allOrMy) {
    // my
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  // commonPoolSelectListTo是commonpool中第二个select中的数组
  if (commonPoolSelectListTo) {
    // 循环数组拼接数据格式
    commonPoolSelectListTo &&
      commonPoolSelectListTo.forEach((item) => {
        if (item === 'hasLinkedIn') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasValidEmail') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasPhone') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
      });
  }
  dispatch({
    type: ActionTypes.ORDER_STATES,
    payload: requestData,
  });
  // requestData['and'].push({
  //   and: [
  //     {
  //       affiliations: ['all', 'user_' + id],
  //     },
  //   ],
  // });
  // console.log(requestData);

  return apnSDK
    .commonPoolCurrencySearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.RECEIVE_TALENT_LIST,
          tab: 'es',
          normalizedData,
          total: response.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// commonPool普通搜索search
export const getCommonPoolSearchData =
  (jobId, value, index) => (dispatch, getState) => {
    console.log(value);

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RESETSORT,
      payload: true,
    });

    let {
      basicSearch,
      page,
      size,
      sort,
      allOrMy,
      resume,
      commonPoolSelectList,
      commonPoolSelectListTo,
    } = getState().controller.newCandidateJob.toJS();
    // let initialSearch = null;
    let { id } = getState().controller.currentUser.toJS();
    let { arr } = commonPoolFilterSearch(basicSearch);
    // if (arr.length !== 0 || value) {
    //   initialSearch = false;
    // } else {
    //   initialSearch = true;
    // }
    let requestData = candidateRequestFilter(arr);
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LOADING,
      payload: true,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
      payload: true,
    });

    //  dispatch({
    //   type: ActionTypes.UN_SELECT_STATUS,
    //   payload: true,
    // });
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LEVEL,
      payload: 'BASE',
    });

    let str = filterSort(sort);
    // commonPoolSelectListTo是commonpool中第二个select中的数组
    if (commonPoolSelectListTo) {
      // 循环数组拼接数据格式
      commonPoolSelectListTo &&
        commonPoolSelectListTo.forEach((item) => {
          if (item === 'hasLinkedIn') {
            requestData['and'].push({
              and: [
                {
                  [item]: true,
                },
              ],
            });
          }
          if (item === 'hasValidEmail') {
            requestData['and'].push({
              and: [
                {
                  [item]: true,
                },
              ],
            });
          }
          if (item === 'hasPhone') {
            requestData['and'].push({
              and: [
                {
                  [item]: true,
                },
              ],
            });
          }
        });
    }
    // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询

    // if (value) {
    //   initialSearch = false;
    // } else {
    //   initialSearch = true;
    // }
    if (allOrMy) {
      // my
      requestData['and'].push({
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      });
    }
    if (resume) {
      requestData['and'].push({
        and: [
          {
            hasResume: resume + '',
          },
        ],
      });
    }

    // requestData['and'].push({
    //   and: [
    //     {
    //       affiliations: ['all', 'user_' + id],
    //     },
    //   ],
    // });
    console.log(requestData);
    console.log(index);
    if (typeof value == 'undefined' || value == '') {
      if (
        requestData.and.length == 0 ||
        requestData.length == 0 ||
        value == 0 ||
        value == 'undefined'
      ) {
        dispatch({
          type: ActionTypes.UN_SELECT_STATUS,
          payload: false,
        });
        dispatch({
          type: ActionTypes.SELECT_TO_STATUS_EMPTY,
        });
        dispatch({
          type: ActionTypes.ORDER_STATES_DELETE,
        });
      } else {
        let requestDataArr = [];
        requestData.and.forEach((item, index) => {
          for (let key in item) {
            // if (key === 'and') {
            for (let _key in item[key][0]) {
              requestDataArr.push(_key);
            }
            // }
          }
        });
        console.log(requestDataArr);
        let filterData = [];
        requestDataArr.forEach((data) => {
          if (
            data !== 'hasLinkedIn' &&
            data !== 'hasValidEmail' &&
            data !== 'hasPhone'
          ) {
            filterData.push(data);
          }
        });
        console.log(filterData);

        if (filterData.length === 0) {
          dispatch({
            type: ActionTypes.UN_SELECT_STATUS,
            payload: false,
          });
          dispatch({
            type: ActionTypes.SELECT_TO_STATUS_EMPTY,
          });
          dispatch({
            type: ActionTypes.ORDER_STATES_DELETE,
          });
        } else {
          dispatch({
            type: ActionTypes.UN_SELECT_STATUS,
            payload: true,
          });
          dispatch({
            type: ActionTypes.ORDER_STATES,
            payload: requestData,
          });
        }
      }
    } else {
      dispatch({
        type: ActionTypes.UN_SELECT_STATUS,
        payload: true,
      });
      dispatch({
        type: ActionTypes.ORDER_STATES,
        payload: requestData,
      });
    }
    return apnSDK
      .commonPoolCurrencySearch({
        filter: requestData,
        page,
        size,
        sort: str,
        jobId,
        commonPoolSelectList,
        // initialSearch,
      })
      .then((res) => {
        if (res) {
          let { response, headers } = res;
          let arr = [];
          console.log('没转译前的', response);
          // response.forEach((item) => {
          //   item._id = encodeURIComponent(item._id);
          //   arr.push(item);
          // });
          console.log('转义过后的arr', arr);
          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
            payload: response,
          });

          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COUNT,
            payload: headers.get('Pagination-Count'),
          });
          const normalizedData = normalize(response, [talentBasic]);

          dispatch({
            type: ActionTypes.RECEIVE_TALENT_LIST,
            tab: 'es',
            normalizedData,
            total: response.length,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_LOADING,
          payload: false,
        });
      });
  };

// sort排序后调用的基本搜索
export const getSearchDataSort = (jobId) => (dispatch, getState) => {
  let { basicSearch, page, size, sort, allOrMy, resume } =
    getState().controller.newCandidateJob.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = candidateFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  let str = filterSort(sort);
  // 判断是否用条件查询
  let initFlag = null;
  if (requestData['and'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (allOrMy) {
    // my
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  // requestData['and'].push({
  //   and: [
  //     {
  //       affiliations: ['all', 'user_' + id],
  //     },
  //   ],
  // });
  // console.log(requestData);

  return apnSDK
    .jobCandidateSearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.RECEIVE_TALENT_LIST,
          tab: 'es',
          normalizedData,
          total: response.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

//commonPool设置页数后的基本搜索
export const commonPoolDataSort = (jobId) => (dispatch, getState) => {
  let {
    basicSearch,
    page,
    size,
    sort,
    allOrMy,
    resume,
    commonPoolSelectList,
    commonPoolSelectListTo,
  } = getState().controller.newCandidateJob.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = commonPoolFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = null;
  // if (requestData.and.length === 0) {
  //   initialSearch = true;
  // } else {
  //   initialSearch = false;
  // }
  let str = filterSort(sort);

  // commonPoolSelectListTo是commonpool中第二个select中的数组
  if (commonPoolSelectListTo) {
    // 循环数组拼接数据格式
    commonPoolSelectListTo &&
      commonPoolSelectListTo.forEach((item) => {
        if (item === 'hasLinkedIn') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasValidEmail') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasPhone') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
      });
  }

  if (allOrMy) {
    // my
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  // requestData['and'].push({
  //   and: [
  //     {
  //       affiliations: ['all', 'user_' + id],
  //     },
  //   ],
  // });
  // console.log(requestData);

  return apnSDK
    .commonPoolCurrencySearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.RECEIVE_TALENT_LIST,
          tab: 'es',
          normalizedData,
          total: response.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

export const chagneSizePage =
  ({ page, size, jobId }) =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
      payload: {
        page,
        size,
      },
    });
    let { searchLevel } = getState().controller.newCandidateJob.toJS();
    if (searchLevel === 'BASE') {
      dispatch(getSearchDataSort(jobId));
    } else if (searchLevel === 'ADVANCED') {
      dispatch(candidateGetAdvancedData());
    } else if (searchLevel === 'GENERAL') {
      dispatch(CandidategetGeneralToo(false, jobId));
    }
  };

// 点击commonPool首页表格翻页
export const commonPoolSize =
  ({ page, size, jobId }) =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
      payload: {
        page,
        size,
      },
    });

    let { searchLevel } = getState().controller.newCandidateJob.toJS();
    if (searchLevel === 'BASE') {
      dispatch(commonPoolDataSort(jobId));
    } else if (searchLevel === 'ADVANCED') {
      dispatch(commonPoolGetAdvancedData());
    } else if (searchLevel === 'GENERAL') {
      dispatch(CommonPoolGeneralToo(false, jobId));
    }
  };

export const chagneSort = (sorts) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SORT,
    payload: {
      name: Object.keys(sorts)[0],
      value: Object.values(sorts)[0],
    },
  });

  let { searchLevel } = getState().controller.newCandidateJob.toJS();
  if (searchLevel === 'BASE') {
    dispatch(getSearchDataSort());
  } else if (searchLevel === 'ADVANCED') {
    dispatch(candidateGetAdvancedData());
  } else if (searchLevel === 'GENERAL') {
    dispatch(CandidategetGeneralToo());
  }
};

// commonPool 表格list列表排序
export const commonPoolChagneSort = (sorts) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SORT,
    payload: {
      name: Object.keys(sorts)[0],
      value: Object.values(sorts)[0],
    },
  });
  let { searchLevel } = getState().controller.newCandidateJob.toJS();
  if (searchLevel === 'BASE') {
    dispatch(getCommonPoolSearchDataSort());
  } else if (searchLevel === 'ADVANCED') {
    //ADVANCED代表高级搜索
    dispatch(commonPoolGetAdvancedData());
  } else if (searchLevel === 'GENERAL') {
    //GENERAL通用搜索
    dispatch(CommonPoolGeneralToo());
  }
};

// commonPool sort排序后调用的基本搜索
export const getCommonPoolSearchDataSort = (jobId) => (dispatch, getState) => {
  let {
    basicSearch,
    page,
    size,
    sort,
    allOrMy,
    resume,
    commonPoolSelectListTo,
    defultStatus,
    commonPoolSelectList,
  } = getState().controller.newCandidateJob.toJS();
  let { id } = getState().controller.currentUser.toJS();
  let { arr } = commonPoolFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = null;
  // if (requestData.and.length === 0) {
  //   initialSearch = true;
  // } else {
  //   initialSearch = false;
  // }
  let str = filterSort(sort);

  if (allOrMy) {
    // my
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  if ((commonPoolSelectListTo ?? '') !== '') {
    // 循环数组拼接数据格式
    commonPoolSelectListTo.forEach((item) => {
      if (item === 'hasLinkedIn') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasValidEmail') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasPhone') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
    });
  }
  return apnSDK
    .commonPoolCurrencySearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      defultStatus,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
        const normalizedData = normalize(response, [talentBasic]);

        dispatch({
          type: ActionTypes.RECEIVE_TALENT_LIST,
          tab: 'es',
          normalizedData,
          total: response.length,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

export const resetPage = () => (dispatch, getState) => {
  let { size } = getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  return;
};

export const candidateResetSearch = () => (dispatch, getState) => {
  let { size } = getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESUME,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESET_ADVANCED,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_COMONPOOL_RESETDATA,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_COUNT_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });
  // 清空commonPool下拉框搜索条件
  dispatch({
    type: ActionTypes.COMMON_SELECT_ONE_VALUE_EMPTY,
  });
  dispatch({
    type: ActionTypes.COMMON_SELECT_TO_VALUE_EMPTY,
  });
};

// clearAll 清除搜索
export const resetSearchValue = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESET_ADVANCED,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  let { basicSearch, size, page, sort, allOrMy, resume } =
    getState().controller.newCandidateJob.toJS();
  let { arr } = candidateFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  let { id } = getState().controller.currentUser.toJS();
  console.log(requestData);
  // 清除搜索后是无条件搜索；
  let initFlag = true;

  if (allOrMy) {
    // my
    let obj = {};
    // obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj }],
    };
  }

  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  // console.log(requestData)
  // requestData['and'].push({
  //   and: [
  //     {
  //       affiliations: ['all', 'user_' + id],
  //     },
  //   ],
  // });

  // if (JSON.stringify(requestData['and'][0]['and']) == '[]') {
  //   requestData['and'][0]['and'].shift();
  // }
  return apnSDK
    .jobCandidateSearch({ filter: requestData, page, size, initFlag })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// commonPool clearAll清除搜索
export const commonPoolClearAll = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.SELECT_TO_STATUS_EMPTY,
  });
  dispatch({
    type: ActionTypes.ORDER_STATES_DELETE,
  });

  dispatch({
    type: ActionTypes.UN_SELECT_STATUS,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESET_ADVANCED,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  let {
    basicSearch,
    size,
    page,
    sort,
    allOrMy,
    resume,
    commonPoolSelectList,
    commonPoolSelectListTo,
  } = getState().controller.newCandidateJob.toJS();
  let { arr } = candidateFilterSearch(basicSearch);
  let requestData = candidateRequestFilter(arr);
  let { id } = getState().controller.currentUser.toJS();
  console.log(requestData);

  // commonPoolSelectListTo是commonpool中第二个select中的数组
  if (commonPoolSelectListTo) {
    // 循环数组拼接数据格式
    commonPoolSelectListTo &&
      commonPoolSelectListTo.forEach((item) => {
        if (item === 'hasLinkedIn') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasValidEmail') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasPhone') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
      });
  }
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = true;

  if (allOrMy) {
    let obj = {};
    obj['and'] = [
      {
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj }],
    };
  }

  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }
  return apnSDK
    .commonPoolCurrencySearch({
      filter: requestData,
      page,
      size,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

export const getNewSearch = (payload) => {
  return {
    type: ActionTypes.NEW_CANDIDATE_SEARCH,
    payload,
  };
};

export const changeSelectId = (payload) => {
  return {
    type: ActionTypes.NEW_CANDIDATE_SELECTID,
    payload,
  };
};

// candidate detail页面 add to a job 模糊搜索
export const dialogCommonSearch = (value, talentId) => (dispatch, getState) => {
  if (!value) {
    return;
  }
  let { id } = getState().controller.currentUser.toJS();

  let requestData = {
    and: [],
  };

  requestData['and'].push({
    or: [
      {
        and: [
          { or: [{ type: 'CONTRACT' }, { type: 'FULL_TIME' }] },
          { or: [{ status: 'OPEN' }, { status: 'REOPENED' }] },
        ],
      },
      { and: [{ or: [{ type: 'PAY_ROLL' }] }] },
    ],
  });

  requestData['and'].push({
    and: [
      {
        generalText: value,
      },
    ],
  });

  return apnSDK
    .getGeneralData({
      filter: requestData,
      page: 1,
      size: 600,
      module: 'CANDIDATE_ADD_TO_JOB',
      talentId,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_SELECT_OPTION,
          payload: response,
        });

        const normalizedData = normalize(response, [jobBasic]);
        dispatch({
          type: ActionTypes.RECEIVE_JOB_LIST,
          tab: 'myOpen',
          normalizedData,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const dialogSelectID = (payload) => {
  return {
    type: ActionTypes.NEW_CANDIDATE_SELECT_ID,
    payload,
  };
};
//
export const dialogClearSelectData = (payload) => {
  return {
    type: ActionTypes.NEW_CANDIDATE_SELECT_OPTION,
    payload,
  };
};

// candidate
export const deleteFilter = (payload) => (dispatch, getState) => {
  let { size } = getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_DELETE,
    payload,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });

  dispatch(getSearchData(payload.jobId));
};

//CommonPool删除filter搜索
export const commonDeleteFilter = (payload, index) => (dispatch, getState) => {
  console.log(index);
  let { size } = getState().controller.newCandidateJob.toJS();

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });
  dispatch({
    type: ActionTypes.UN_SELECT_STATUS,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_DELETE,
    payload,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  if (index.length === 0) {
    dispatch({
      type: ActionTypes.ORDER_STATES_DELETE,
    });
  }
  dispatch(getCommonPoolSearchData(payload.jobId, index.length));
};

export const setInFilter = (payload) => {
  return {
    type: ActionTypes.NEW_CANDIDATE_SETIN,
    payload,
  };
};

// 高级搜索调用
export const saveAdvancedFilterCandidate = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });

  let { size, sort, allOrMy, resume } =
    getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED,
    payload: value,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'ADVANCED',
  });
  let requestData = candidateRequestAdvincedFilter(value);
  let { id } = getState().controller.currentUser.toJS();

  let initFlag = null;
  if (requestData['or'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (allOrMy) {
    // my
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }
  console.log(requestData);
  if (resume) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj = {
      and: [
        {
          hasResume: resume + '',
        },
      ],
    };

    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }

  if (!requestData['and']) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    requestData = {
      and: [{ ...obj1 }],
    };
  }
  let str = filterSort(sort);
  console.log(requestData);
  return apnSDK
    .jobCandidateSearch({
      filter: requestData,
      page: 1,
      size,
      sort: str,
      initFlag,
    })
    .then((res) => {
      console.log(res);
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// candidate 全局通用搜索
export const CandidateGetGeneral = (value, jobId) => (dispatch, getState) => {
  let { size } = getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESET_ADVANCED,
    payload: false,
  });

  // dispatch({
  //   type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
  //   payload: true,
  // });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'GENERAL',
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL,
    payload: value,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  let { id } = getState().controller.currentUser.toJS();
  let { page, sort, allOrMy, resume } =
    getState().controller.newCandidateJob.toJS();

  if (value == '') {
    dispatch(getSearchData(jobId));
    return;
  }

  let initFlag = null;
  if (value) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  let requestData = {
    and: [],
  };

  requestData['and'].push({
    and: [
      {
        generalText: value,
      },
    ],
  });

  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  if (allOrMy) {
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }

  let str = filterSort(sort);

  return apnSDK
    .jobCandidateSearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// commonPool 全局通用搜索
export const CommonPoolGeneral = (value, jobId) => (dispatch, getState) => {
  let { size } = getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESET_ADVANCED,
    payload: false,
  });
  if (value === '') {
    dispatch({
      type: ActionTypes.UN_SELECT_STATUS,
      payload: false,
    });
    dispatch({
      type: ActionTypes.SELECT_TO_STATUS_EMPTY,
    });
    dispatch({
      type: ActionTypes.ORDER_STATES_DELETE,
    });
  } else {
    dispatch({
      type: ActionTypes.UN_SELECT_STATUS,
      payload: true,
    });
  }

  // dispatch({
  //   type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
  //   payload: true,
  // });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'GENERAL',
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL,
    payload: value,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  let { id } = getState().controller.currentUser.toJS();
  let {
    page,
    sort,
    allOrMy,
    resume,
    commonPoolSelectListTo,
    commonPoolSelectList,
  } = getState().controller.newCandidateJob.toJS();

  if (value == '') {
    dispatch(getCommonPoolSearchData(jobId, value));
    return;
  }

  let requestData = {
    and: [],
  };

  requestData['and'].push({
    and: [
      {
        generalText: value,
      },
    ],
  });
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = null;
  // if (!value) {
  //   initialSearch = true;
  // } else {
  //   initialSearch = false;
  // }
  if (resume) {
    requestData['and'].push({
      and: [
        {
          hasResume: resume + '',
        },
      ],
    });
  }

  if (allOrMy) {
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  }

  // commonPoolSelectListTo是commonpool中第二个select中的数组
  if ((commonPoolSelectListTo ?? '') !== '') {
    // 循环数组拼接数据格式
    commonPoolSelectListTo.forEach((item) => {
      if (item === 'hasLinkedIn') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasValidEmail') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasPhone') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
    });
  }
  dispatch({
    type: ActionTypes.ORDER_STATES,
    payload: requestData,
  });
  let str = filterSort(sort);

  return apnSDK
    .commonPoolCurrencySearch({
      filter: requestData,
      page,
      size,
      sort: str,
      jobId,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// commonPool高级搜索

export const commonPoolSaveAdvancedFilterCandidate =
  (value) => (dispatch, getState) => {
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RESETSORT,
      payload: true,
    });

    let {
      size,
      sort,
      allOrMy,
      resume,
      commonPoolSelectListTo,
      commonPoolSelectList,
    } = getState().controller.newCandidateJob.toJS();
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
      payload: {
        page: 1,
        size,
      },
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
      payload: false,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_ADVANCED,
      payload: value,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LOADING,
      payload: true,
    });
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LEVEL,
      payload: 'ADVANCED',
    });
    dispatch({
      type: ActionTypes.UN_SELECT_STATUS,
      payload: true,
    });
    let requestData = candidateRequestAdvincedFilter(value);
    let { id } = getState().controller.currentUser.toJS();

    // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
    // let initialSearch = null;
    // if (!value) {
    //   initialSearch = true;
    // } else {
    //   initialSearch = false;
    // }
    if (allOrMy) {
      // my
      let obj = {},
        obj1 = JSON.parse(JSON.stringify(requestData));
      obj['and'] = [
        {
          and: [
            {
              assignedUsers: {
                ANY: id + '',
              },
            },
          ],
        },
      ];
      requestData = {
        and: [{ ...obj1 }, { ...obj }],
      };
    }
    console.log(requestData);
    if (resume) {
      let obj = {},
        obj1 = JSON.parse(JSON.stringify(requestData));
      obj = {
        and: [
          {
            hasResume: resume + '',
          },
        ],
      };

      requestData = {
        and: [{ ...obj1 }, { ...obj }],
      };
    }

    if (!requestData['and']) {
      let obj = {},
        obj1 = JSON.parse(JSON.stringify(requestData));
      requestData = {
        and: [{ ...obj1 }],
      };
    }

    if ((commonPoolSelectListTo ?? '') !== '') {
      // 循环数组拼接数据格式
      commonPoolSelectListTo.forEach((item) => {
        if (item === 'hasLinkedIn') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasValidEmail') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasPhone') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
      });
    }
    dispatch({
      type: ActionTypes.ORDER_STATES,
      payload: requestData,
    });
    let str = filterSort(sort);
    console.log(requestData);
    return apnSDK
      .commonPoolCurrencySearch({
        filter: requestData,
        page: 1,
        size,
        sort: str,
        commonPoolSelectList,
        // initialSearch,
      })
      .then((res) => {
        console.log(res);
        if (res) {
          let { response, headers } = res;
          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
            payload: response,
          });

          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COUNT,
            payload: headers.get('Pagination-Count'),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_LOADING,
          payload: false,
        });
      });
  };

// 通用搜索(初始化调用)
export const CandidategetGeneralToo =
  (sortFlag, jobId) => (dispatch, getState) => {
    if (sortFlag) {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_RESETSORT,
        payload: true,
      });
    }
    let { page, size, sort, general, allOrMy, resume } =
      getState().controller.newCandidateJob.toJS();
    let { id } = getState().controller.currentUser.toJS();

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LOADING,
      payload: true,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LEVEL,
      payload: 'GENERAL',
    });
    let str = filterSort(sort);
    if (general == '') {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
        payload: {
          page,
          size,
        },
      });
      dispatch(getSearchData(jobId));
      return;
    }
    let initFlag = null;
    if (general) {
      initFlag = false;
    } else {
      initFlag = true;
    }

    let requestData = {
      and: [],
    };

    if (allOrMy) {
      requestData['and'].push({
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      });
    }

    if (resume) {
      requestData['and'].push({
        and: [
          {
            hasResume: resume + '',
          },
        ],
      });
    }

    requestData['and'].push({
      and: [
        {
          generalText: general,
        },
      ],
    });

    return apnSDK
      .jobCandidateSearch({
        filter: requestData,
        page,
        size,
        sort: str,
        jobId,
        initFlag,
      })
      .then((res) => {
        if (res) {
          let { response, headers } = res;
          dispatch({
            type: ActionTypes.NEW_CANDIDATE_DATA,
            payload: response,
          });

          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COUNT,
            payload: headers.get('Pagination-Count'),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_LOADING,
          payload: false,
        });
      });
  };

// commonPool通用搜索(初始化调用)
export const CommonPoolGeneralToo =
  (sortFlag, jobId) => (dispatch, getState) => {
    if (sortFlag) {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_RESETSORT,
        payload: true,
      });
    }
    let {
      page,
      size,
      sort,
      general,
      allOrMy,
      resume,
      commonPoolSelectListTo,
      defultStatus,
      commonPoolSelectList,
    } = getState().controller.newCandidateJob.toJS();
    let { id } = getState().controller.currentUser.toJS();
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LOADING,
      payload: true,
    });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LEVEL,
      payload: 'GENERAL',
    });

    let str = filterSort(sort);
    if (general == '') {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
        payload: {
          page,
          size,
        },
      });
      dispatch(commonPoolGetSearchData(jobId));
      return;
    }

    let requestData = {
      and: [],
    };

    if (allOrMy) {
      requestData['and'].push({
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      });
    }

    if (resume) {
      requestData['and'].push({
        and: [
          {
            hasResume: resume + '',
          },
        ],
      });
    }

    requestData['and'].push({
      and: [
        {
          generalText: general,
        },
      ],
    });
    // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
    // let initialSearch = null;
    // if (requestData.and.length === 0) {
    //   initialSearch = true;
    // } else {
    //   initialSearch = false;
    // }
    if ((commonPoolSelectListTo ?? '') !== '') {
      // 循环数组拼接数据格式
      commonPoolSelectListTo.forEach((item) => {
        if (item === 'hasLinkedIn') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasValidEmail') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
        if (item === 'hasPhone') {
          requestData['and'].push({
            and: [
              {
                [item]: true,
              },
            ],
          });
        }
      });
    }

    return apnSDK
      .commonPoolCurrencySearch({
        filter: requestData,
        page,
        size,
        sort: str,
        jobId,
        defultStatus,
        commonPoolSelectList,
        // initialSearch,
      })
      .then((res) => {
        if (res) {
          let { response, headers } = res;
          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
            payload: response,
          });

          dispatch({
            type: ActionTypes.NEW_CANDIDATE_COUNT,
            payload: headers.get('Pagination-Count'),
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_LOADING,
          payload: false,
        });
      });
  };

// 高级搜索条件回显搜索(初始化调用)
export const candidateGetAdvancedData = (sortFlag) => (dispatch, getState) => {
  if (sortFlag) {
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RESETSORT,
      payload: true,
    });
  }
  let { advancedFilter, size, page, sort, allOrMy, resume } =
    getState().controller.newCandidateJob.toJS();
  let requestData = candidateRequestAdvincedFilter(advancedFilter);
  let { id } = getState().controller.currentUser.toJS();

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page,
      size,
    },
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'ADVANCED',
  });

  let str = filterSort(sort);

  let initFlag = null;
  if (requestData['or'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (allOrMy) {
    // my
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }
  console.log(requestData);
  if (resume) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj = {
      and: [
        {
          hasResume: resume + '',
        },
      ],
    };

    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }

  if (!requestData['and']) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    requestData = {
      and: [{ ...obj1 }],
    };
  } else {
    // requestData['and'].push({
    //   affiliations: ['all', 'user_' + id],
    // });
  }

  return apnSDK
    .jobCandidateSearch({
      filter: requestData,
      page,
      size,
      sort: str,
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// commonPool高级搜索条件回显搜索(初始化调用)
export const commonPoolGetAdvancedData = (sortFlag) => (dispatch, getState) => {
  if (sortFlag) {
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RESETSORT,
      payload: true,
    });
  }
  let {
    advancedFilter,
    size,
    page,
    sort,
    allOrMy,
    resume,
    commonPoolSelectListTo,
    defultStatus,
    commonPoolSelectList,
  } = getState().controller.newCandidateJob.toJS();
  let requestData = candidateRequestAdvincedFilter(advancedFilter);
  let { id } = getState().controller.currentUser.toJS();

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page,
      size,
    },
  });
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'ADVANCED',
  });
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = null;
  // if (requestData.or.length === 0) {
  //   initialSearch = true;
  // } else {
  //   initialSearch = false;
  // }
  let str = filterSort(sort);
  if (allOrMy) {
    // my
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }
  console.log(requestData);
  if (resume) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj = {
      and: [
        {
          hasResume: resume + '',
        },
      ],
    };

    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }

  if (!requestData['and']) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    requestData = {
      and: [{ ...obj1 }],
    };
  } else {
    // requestData['and'].push({
    //   affiliations: ['all', 'user_' + id],
    // });
  }

  if ((commonPoolSelectListTo ?? '') !== '') {
    // 循环数组拼接数据格式
    commonPoolSelectListTo.forEach((item) => {
      if (item === 'hasLinkedIn') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasValidEmail') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasPhone') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
    });
  }
  dispatch({
    type: ActionTypes.ORDER_STATES,
    payload: requestData,
  });
  return apnSDK
    .jobCommonPoolSearchSrot({
      filter: requestData,
      page,
      size,
      sort: str,
      defultStatus,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_DATA,
          payload: response,
        });
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

// all or my
export const candidateGetMyOrAll = (check) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_MYORALL,
    payload: check,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESTEDATA,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });
};

// candidates with Resume
export const getResume = (check) => (dispatch, getState) => {
  let { size } = getState().controller.newCandidateJob.toJS();

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESUME,
    payload: check,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });

  let { searchLevel } = getState().controller.newCandidateJob.toJS();
  if (searchLevel === 'BASE') {
    dispatch(getSearchData());
  } else if (searchLevel === 'ADVANCED') {
    dispatch(candidateGetAdvancedData(true));
  } else if (searchLevel === 'GENERAL') {
    dispatch(CandidategetGeneralToo(true));
  }
};

// 高级搜索验证 闪烁修正
export const upDateStopFlag = (flag) => (dispatch) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_STOPFLAG,
    payload: flag,
  });
};

// commonPool详情页点击unlock购买

// export const addUnlock = (esId) => (dispatch) => {
//   return apnSDK
//     .commonPoolAddUnlock({ esId })
//     .then((res) => {
//       if (res) {
//         let { response } = res;
//         dispatch({
//           type: ActionTypes.CREDIT_TRAN_SACTION_ID,
//           payload: response.id,
//         })
//         // 请求成功的时候调用查询用户余额接口
//         return apnSDK.getUserAccount()
//         .then((res) => {
//           console.log('查询余额成功后的res======',res)
//           console.log('查询余额成功后的res======',res.response)
//           if(res) {
//             let { response } = res;
//             dispatch({
//               type: ActionTypes.QUERY_BALANCE,
//               payload: response
//             })
//             // 成功时重新查询详情数据
//             return apnSDK.getCommonDetail(encodeURIComponent(esId))
//             .then((res) => {
//               console.log('重新查询详情数据成功后的res======',res)
//               if(res) {
//                 let { response } = res;
//                 dispatch({
//                   type: ActionTypes.COMMON_POOL_DETAIL,
//                   payload: response,
//                 });
//               }
//             })
//           }
//         })
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     })
// }

// commonPool点击+号，添加到candidates
export const addCandidatesData = (data) => (dispatch) => {
  return apnSDK
    .commonPoolAddCandidates(data)
    .then((res) => {
      if (res) {
        console.log('我是添加candidates的接口', res);
        // let { response } = res;
        // dispatch({
        //   type: ActionTypes.CREDIT_TRAN_SACTION_ID,
        //   payload: response.id,
        // })
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// commonPool的save Filter点击search重新搜索
// 高级搜索调用
export const saveAdvancedFilterCommonPool = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_RESETSORT,
    payload: true,
  });
  dispatch({
    type: ActionTypes.UN_SELECT_STATUS,
    payload: true,
  });
  let {
    size,
    sort,
    allOrMy,
    resume,
    commonPoolSelectList,
    commonPoolSelectListTo,
  } = getState().controller.newCandidateJob.toJS();
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_ADVANCED,
    payload: value,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'ADVANCED',
  });
  dispatch({
    type: ActionTypes.UN_SELECT_STATUS,
    payload: true,
  });
  let requestData = candidateRequestAdvincedFilter(value);
  let { id } = getState().controller.currentUser.toJS();
  // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
  // let initialSearch = null;
  // if (requestData.or.length === 0) {
  //   initialSearch = true;
  // } else {
  //   initialSearch = false;
  // }
  if (allOrMy) {
    // my
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            assignedUsers: {
              ANY: id + '',
            },
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }
  console.log(requestData);
  if (resume) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj = {
      and: [
        {
          hasResume: resume + '',
        },
      ],
    };

    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  }

  if (!requestData['and']) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    requestData = {
      and: [{ ...obj1 }],
    };
  }

  // commonPoolSelectListTo是commonpool中第二个select中的数组
  if ((commonPoolSelectListTo ?? '') !== '') {
    // 循环数组拼接数据格式
    commonPoolSelectListTo.forEach((item) => {
      if (item === 'hasLinkedIn') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasValidEmail') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
      if (item === 'hasPhone') {
        requestData['and'].push({
          and: [
            {
              [item]: true,
            },
          ],
        });
      }
    });
  }
  dispatch({
    type: ActionTypes.ORDER_STATES,
    payload: requestData,
  });
  let str = filterSort(sort);
  console.log(requestData);
  return apnSDK
    .commonPoolCurrencySearch({
      filter: requestData,
      page: 1,
      size,
      sort: str,
      commonPoolSelectList,
      // initialSearch,
    })
    .then((res) => {
      console.log(res);
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COMONPOOL_DATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_CANDIDATE_COUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_CANDIDATE_LOADING,
        payload: false,
      });
    });
};

export const candidateCurrentPageModel = (value) => (dispatch) => {
  dispatch({
    type: ActionTypes.NEW_CANDIDATE_PAGEMODEL,
    payload: value,
  });
};
