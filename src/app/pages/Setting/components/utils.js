// Signature Required枚举
const actionRequiredEnum = {
  0: 'MUST_BE_SIGNED_AND_RETURNED',
  1: 'READ_ONLY',
};

export const sortArray = (tabledata, columnKey) => {
  if (columnKey === 'lastModifiedDate') {
    tabledata.sort(function (x, y) {
      if (x[columnKey] > y[columnKey]) {
        return -1;
      }
      if (x[columnKey] < y[columnKey]) {
        return 1;
      }
      return 0;
    });
  } else if (columnKey === 'actionRequired' || columnKey === 'mandatory') {
    tabledata.sort(function (x, y) {
      const value1 = x[columnKey] === actionRequiredEnum[0];
      const value2 = y[columnKey] === actionRequiredEnum[0];
      if (value1 < value2) {
        return -1;
      }
      if (value1 > value2) {
        return 1;
      }
      return 0;
    });
  } else {
    // 按照ascII码排序
    tabledata.sort(function (x, y) {
      const valueA = x[columnKey];
      const valueB = y[columnKey];
      let sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (columnKey === 'name' || columnKey === 'lastModifiedBy') {
        sortVal = -valueA.localeCompare(valueB, 'zh-CN-u-co-pinyin');
      }
      return sortVal;
    });
  }

  return tabledata;
};
