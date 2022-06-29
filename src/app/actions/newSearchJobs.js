import * as ActionTypes from '../constants/actionTypes';
import { searchAudience } from '../../apn-sdk/client';
import { normalize } from 'normalizr';
import * as apnSDK from './../../apn-sdk/';
import {
  filterSearch,
  requestFilter,
  requestAdvincedFilter,
} from '../../utils/search';
import { getJob } from './jobActions';

import { esJob } from './schemas';

const filterSort = (sort) => {
  let obj = {};
  Object.keys(sort).forEach((item) => {
    let property = item;
    if (sort[item]) {
      if (item === 'id') property = '_id';
      obj = {
        direction: sort[item],
        property,
      };
    }
  });
  return obj;
};

export const getNewSearch = (payload) => {
  return {
    type: ActionTypes.NEW_SEARCH_JOB,
    payload,
  };
};

export const resetPage = () => (dispatch, getState) => {
  let { size } = getState().controller.newSearchJobs.toJS();
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  return;
};

export const getCurrentPageModel = (value) => (dispatch) => {
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGEMODEL,
    payload: value,
  });
};

export const resetSearch = () => (dispatch, getState) => {
  let { size } = getState().controller.newSearchJobs.toJS();
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_FAVORITE,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_ADVINCED_RESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_GENERAL,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'BASE',
  });
  return;
};

// 基本搜索
export const deleteFilter = (payload) => (dispatch, getState) => {
  let { size } = getState().controller.newSearchJobs.toJS();
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'BASE',
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_DELETE,
    payload,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  dispatch(getSearchData());
  return;
};

// clearAll
export const resetFilter = (payload) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_ADVANCED,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'BASE',
  });

  let { basicSearch, size, page, sort, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();
  let { arr } = filterSearch(basicSearch);
  let requestData = requestFilter(arr);
  let { id } = getState().controller.currentUser.toJS();

  // 清除条件调用搜索是无条件搜索
  let initFlag = true;

  if (isFavorite && allOrMy) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      },
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
  } else if (isFavorite) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  } else if (allOrMy) {
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

  if (!allOrMy) {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
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

  // if (JSON.stringify(requestData['and'][0]['and']) == '[]') {
  //   requestData['and'][0]['and'].shift();
  // }

  return apnSDK
    .jobSearch({ filter: requestData, page, size, initFlag })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_DATACOUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

export const setInFilter = (payload) => {
  return {
    type: ActionTypes.NEW_SEARCH_JOB_SETIN,
    payload,
  };
};

// 高级搜索调用
export const saveAdvancedFilter = (value) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload: true,
  });
  let { size, sort, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_GENERAL,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_ADVANCED,
    payload: value,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'ADVANCED',
  });
  let requestData = requestAdvincedFilter(value);
  // 判断是否有条件查询
  let initFlag = null;
  if (requestData['or'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  let { id } = getState().controller.currentUser.toJS();
  if (isFavorite && allOrMy) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      },
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
  } else if (isFavorite) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  } else if (allOrMy) {
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
  if (!requestData['and']) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    requestData = {
      and: [{ ...obj1 }],
    };
  }
  if (!allOrMy) {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
        },
      ],
    });
  }
  // } else {
  //   requestData['and'].push({
  //     affiliations: ['all', 'user_' + id],
  //   });
  // }

  let str = filterSort(sort);

  return apnSDK
    .jobSearch({
      filter: requestData,
      page: 1,
      size,
      sort: str,
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_DATACOUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

// 高级搜索(初始化回显)
export const getAdvancedData = (sortFlag) => (dispatch, getState) => {
  if (sortFlag) {
    dispatch({
      type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
      payload: true,
    });
  }
  let { advancedFilter, size, page, sort, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();
  let requestData = requestAdvincedFilter(advancedFilter);
  let { id } = getState().controller.currentUser.toJS();

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page,
      size,
    },
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_GENERAL,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'ADVANCED',
  });

  let str = filterSort(sort);
  // 判断是否有条件查询
  let initFlag = null;
  if (requestData['or'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }
  if (isFavorite && allOrMy) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      },
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
  } else if (isFavorite) {
    let obj = {},
      obj1 = JSON.parse(JSON.stringify(requestData));
    obj['and'] = [
      {
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      },
    ];
    requestData = {
      and: [{ ...obj1 }, { ...obj }],
    };
  } else if (allOrMy) {
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
  if (!allOrMy) {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
        },
      ],
    });
  }
  return apnSDK
    .jobSearch({ filter: requestData, page, size, sort: str, initFlag })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_DATACOUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      console.log(advancedFilter);
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

// 基本搜索
export const getSearchData = () => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload: true,
  });

  let { basicSearch, page, size, sort, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = filterSearch(basicSearch);
  let requestData = requestFilter(arr);
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_ADVINCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_GENERAL,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'BASE',
  });

  let str = filterSort(sort);

  // 判断是否有查询条件
  let initFlag = null;
  if (requestData['and'] && requestData['and'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (isFavorite && allOrMy) {
    requestData['and'].push({
      and: [
        {
          favoriteUserIds: id + '',
        },
      ],
    });
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  } else if (isFavorite) {
    if (requestData['and'].length > 0) {
      requestData['and'].push({
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      });
    } else {
      requestData['and'] = [];
      requestData['and'].push({
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      });
    }
  } else if (allOrMy) {
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
  if (!allOrMy) {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
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
  // if (requestData.and.length == 0) {
  //   requestData = {}
  // }
  return apnSDK
    .jobSearch({ filter: requestData, page, size, sort: str, initFlag })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_DATACOUNT,
          payload: headers.get('Pagination-Count'),
        });

        const normalizedData = normalize(response, [esJob]);
        dispatch({
          type: ActionTypes.RECEIVE_JOB_LIST,
          tab: 'es',
          normalizedData,
        });
      }
    })
    .catch((err) => {
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

// 基本搜索(sort排序后调用)
export const getSearchDataSort = () => (dispatch, getState) => {
  let { basicSearch, page, size, sort, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();
  let { id } = getState().controller.currentUser.toJS();

  let { arr } = filterSearch(basicSearch);
  let requestData = requestFilter(arr);

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_ADVINCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_GENERAL,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'BASE',
  });

  let str = filterSort(sort);

  // 判断是否有查询条件
  let initFlag = null;
  if (requestData['and'] && requestData['and'].length) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (isFavorite && allOrMy) {
    requestData['and'].push({
      and: [
        {
          favoriteUserIds: id + '',
        },
      ],
    });
    requestData['and'].push({
      and: [
        {
          assignedUsers: {
            ANY: id + '',
          },
        },
      ],
    });
  } else if (isFavorite) {
    if (requestData['and'].length > 0) {
      requestData['and'].push({
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      });
    } else {
      requestData['and'] = [];
      requestData['and'].push({
        and: [
          {
            favoriteUserIds: id + '',
          },
        ],
      });
    }
  } else if (allOrMy) {
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
  if (!allOrMy) {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
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
  // if (requestData.and.length == 0) {
  //   requestData = {}
  // }
  return apnSDK
    .jobSearch({ filter: requestData, page, size, sort: str, initFlag })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });

        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_DATACOUNT,
          payload: headers.get('Pagination-Count'),
        });

        const normalizedData = normalize(response, [esJob]);
        dispatch({
          type: ActionTypes.RECEIVE_JOB_LIST,
          tab: 'es',
          normalizedData,
        });
      }
    })
    .catch((err) => {
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

// 通用搜索
export const getGeneral = (value) => (dispatch, getState) => {
  let { size } = getState().controller.newSearchJobs.toJS();
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
    payload: false,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_RESET_ADVANCED,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_ADVINCED_RESET,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'GENERAL',
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_GENERAL,
    payload: value,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });

  let { id } = getState().controller.currentUser.toJS();
  let { page, sort, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();
  if (value == '') {
    dispatch(getSearchData());
    return;
  }

  let requestData = {
    and: [],
  };
  let initFlag = null;

  // 判断是否有条件搜索
  if (value) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  if (isFavorite) {
    requestData['and'].push({
      and: [
        {
          favoriteUserIds: id + '',
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
  } else {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
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

  requestData['and'].push({
    and: [
      {
        generalText: value,
      },
    ],
  });

  let str = filterSort(sort);

  return apnSDK
    .getGeneralData({
      filter: requestData,
      page,
      size,
      sort: str,
      module: 'JOB',
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response, headers } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_DATACOUNT,
          payload: headers.get('Pagination-Count'),
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

// 通用搜索(初始化回显)
export const getGeneralToo = (sortFlag) => (dispatch, getState) => {
  if (sortFlag) {
    dispatch({
      type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
      payload: true,
    });
  }
  let { page, size, sort, general, isFavorite, allOrMy } =
    getState().controller.newSearchJobs.toJS();
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LEVEL,
    payload: 'GENERAL',
  });

  let str = filterSort(sort);

  let { id } = getState().controller.currentUser.toJS();
  if (general == '') {
    dispatch({
      type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
      payload: {
        page,
        size,
      },
    });
    dispatch(getSearchData());
    return;
  }

  let initFlag = null;
  // 判断是否有条件搜索
  if (general) {
    initFlag = false;
  } else {
    initFlag = true;
  }

  let requestData = {
    and: [],
  };

  if (isFavorite) {
    requestData['and'].push({
      and: [
        {
          favoriteUserIds: id + '',
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

  if (!allOrMy) {
    requestData['and'].push({
      or: [
        {
          type: 'CONTRACT',
        },
        {
          type: 'FULL_TIME',
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
    .getGeneralData({
      filter: requestData,
      page,
      size,
      sort: str,
      module: 'JOB',
      initFlag,
    })
    .then((res) => {
      if (res) {
        let { response } = res;
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_GETDATA,
          payload: response,
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      if (err?.message) {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      }
    })
    .finally(() => {
      dispatch({
        type: ActionTypes.NEW_SEARCH_JOB_LOADING,
        payload: false,
      });
    });
};

export const getSaveFilter = (value) => (dispatch, getState) => {};

// 分页改变
export const chagneSizePage =
  ({ page, size }) =>
  (dispatch, getState) => {
    dispatch({
      type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
      payload: {
        page,
        size,
      },
    });

    let { sort, searchLevel, count } =
      getState().controller.newSearchJobs.toJS();
    if (searchLevel == 'BASE') {
      dispatch(getSearchDataSort());
    } else if (searchLevel == 'ADVANCED') {
      dispatch(getAdvancedData());
    } else if (searchLevel == 'GENERAL') {
      dispatch(getGeneralToo());
    }
  };

// 排序改变
export const chagneSort = (sorts) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload: true,
  });
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT,
    payload: {
      name: Object.keys(sorts)[0],
      value: Object.values(sorts)[0],
    },
  });
  let { searchLevel } = getState().controller.newSearchJobs.toJS();

  if (searchLevel == 'BASE') {
    dispatch(getSearchDataSort());
  } else if (searchLevel == 'ADVANCED') {
    dispatch(getAdvancedData());
  } else if (searchLevel == 'GENERAL') {
    dispatch(getGeneralToo());
  }
};

export const resetSort = (payload) => {
  return {
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload,
  };
};

// favorite
export const getFavorite = (check) => (dispatch, getState) => {
  let { size } = getState().controller.newSearchJobs.toJS();

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_FAVORITE,
    payload: check,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_PAGESIZE,
    payload: {
      page: 1,
      size,
    },
  });
  let { searchLevel } = getState().controller.newSearchJobs.toJS();

  if (searchLevel == 'BASE') {
    dispatch(getSearchData());
  } else if (searchLevel == 'ADVANCED') {
    dispatch(getAdvancedData(true));
  } else if (searchLevel == 'GENERAL') {
    dispatch(getGeneralToo(true));
  }
};

// all or my
export const getMyOrAll = (check) => (dispatch, getState) => {
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_MYORALL,
    payload: check,
  });

  // dispatch({
  //   type: ActionTypes.NEW_SEARCH_JOB_FAVORITE,
  //   payload: false,
  // });

  // dispatch({
  //   type: ActionTypes.NEW_SEARCH_JOB_ADVINCED_RESET,
  //   payload: false,
  // });
  // dispatch({
  //   type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
  //   payload: false,
  // });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_SORT_RESET,
    payload: true,
  });

  // dispatch({
  //   type: ActionTypes.NEW_SEARCH_JOB_RESET_BASE,
  //   payload: false,
  // });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_DATARESET,
    payload: false,
  });

  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_LOADING,
    payload: true,
  });
};

// 状态改变
export const changeStatus =
  (id, status, flag = false) =>
  (dispatch, getState) => {
    let { searchLevel } = getState().controller.newSearchJobs.toJS();

    dispatch({
      type: ActionTypes.NEW_SEARCH_JOB_LOADING,
      payload: true,
    });

    return apnSDK
      .changeStatus(id, status)
      .then((res) => {
        if (flag) {
          dispatch(getJob(id));
        }
        // if (searchLevel == 'BASE') {
        //   dispatch(getSearchData());
        // } else if (searchLevel == 'ADVANCED') {
        //   dispatch(getAdvancedData());
        // } else if (searchLevel == 'GENERAL') {
        //   dispatch(getGeneralToo());
        // }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispatch({
          type: ActionTypes.NEW_SEARCH_JOB_LOADING,
          payload: false,
        });
      });
  };

// 高级搜索验证 闪烁修正
export const upDateStopFlag = (flag) => (dispatch) => {
  console.log(flag);
  dispatch({
    type: ActionTypes.NEW_SEARCH_JOB_STOPFLAG,
    payload: flag,
  });
};
