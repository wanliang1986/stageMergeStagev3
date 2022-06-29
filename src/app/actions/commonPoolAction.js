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
// commonPool select
export const getSearchData =
  (jobId, selectStatus, defultStatus, newValue, commonPoolSelectList) =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RESETSORT,
      payload: true,
    });

    let {
      basicSearch,
      advancedFilter,
      general,
      searchLevel,
      page,
      size,
      sort,
      allOrMy,
      resume,
      commonPoolSelectListTo,
    } = getState().controller.newCandidateJob.toJS();
    let { id } = getState().controller.currentUser.toJS();
    let { arr } = commonPoolFilterSearch(basicSearch);
    let requestData;
    if (searchLevel === 'BASE') {
      requestData = candidateRequestFilter(arr);
    } else if (searchLevel === 'ADVANCED') {
      requestData = candidateRequestAdvincedFilter(advancedFilter);
      requestData.and = requestData.or;
      delete requestData.or;
    } else if (searchLevel === 'GENERAL') {
      requestData = {
        and: [],
      };

      requestData['and'].push({
        and: [
          {
            generalText: general,
          },
        ],
      });
    }

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LOADING,
      payload: true,
    });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_ADVANCED_RESET,
    //   payload: true,
    // });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
    // });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_LEVEL,
    //   payload: 'BASE',
    // });
    // 查询列表接口参数增加 initialSearch ，必填参数 true ：是初始查询 false ： 不是初始查询
    let initialSearch = null;
    if (requestData.and.length === 0) {
      initialSearch = true;
    } else {
      initialSearch = false;
    }
    let str = filterSort(sort);
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
    let commonPoolType = selectStatus === 'select' ? newValue : null;
    return apnSDK
      .jobCommonPoolSearch({
        filter: requestData,
        page,
        size,
        sort: str,
        jobId,
        commonPoolType,
        defultStatus,
        commonPoolSelectList,
        initialSearch,
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
  return apnSDK
    .jobCandidateSearch({ filter: requestData, page, size, sort: str, jobId })
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
    type: ActionTypes.NEW_CANDIDATE_GENERAL_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
  });

  dispatch({
    type: ActionTypes.NEW_CANDIDATE_LEVEL,
    payload: 'BASE',
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
    .jobCandidateSearch({ filter: requestData, page, size })
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
      size: 1000,
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

// commonPool select搜索
// 如果value有值，则不使用jobid    selectStatus为了区分是否从common pool中选中的select
export const CandidateGetGeneral =
  (value, jobId, commonPoolSelect, defultStatus, newValue) =>
  (dispatch, getState) => {
    let { page, size, commonPoolSelectList } =
      getState().controller.newCandidateJob.toJS();
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_RESETSORT,
      payload: true,
    });
    dispatch({
      type: ActionTypes.NEW_CANDIDATE_LOADING,
      payload: true,
    });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_SEARCH_RESET,
    //   payload: false,
    // });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_RESET_ADVANCED,
    //   payload: false,
    // });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_LEVEL,
    //   payload: 'GENERAL',
    // });

    // dispatch({
    //   type: ActionTypes.NEW_CANDIDATE_GENERAL,
    //   payload: value,
    // });

    dispatch({
      type: ActionTypes.NEW_CANDIDATE_PAGESIZE,
      payload: {
        page: 1,
        size,
      },
    });

    let { id } = getState().controller.currentUser.toJS();
    let { sort, allOrMy, resume } =
      getState().controller.newCandidateJob.toJS();
    // 这个value是通用搜索的时候才会用到，反之其他时候都为空
    if (!value) {
      dispatch(
        getSearchData(
          jobId,
          commonPoolSelect,
          defultStatus,
          newValue,
          commonPoolSelectList
        )
      );
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
      .commonPoolCurrencySearch({
        filter: requestData,
        page,
        size,
        sort: str,
        jobId,
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
      .jobCandidateSearch({ filter: requestData, page, size, sort: str, jobId })
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
    .jobCandidateSearch({ filter: requestData, page, size, sort: str })
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
