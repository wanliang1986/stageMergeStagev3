import { push } from 'connected-react-router';
import { forEach } from 'lodash';
import moment from 'moment';
import store from '../app/store/index';
import { getCompanyListForWeeklyNewOffer } from '../apn-sdk';
import {
  currency as currencyOptions,
  GeneralType,
  payRateUnitTypes,
} from '../app/constants/formOptions';

export const jobRequestEnum = {
  JOB: 'JOB',
  CANDIDATE: 'CANDIDATE',
  COMPANY: 'COMPANY',
  JOB_PICK_CANDIDATE: 'JOB_PICK_CANDIDATE',
  COMMON_POOL: 'COMMON_POOL',
};

// job基础搜索数据展示处理
export const filterSearch = (data) => {
  let language = store.getState().controller.language;
  let arr = [],
    strBox = [],
    strShow = '';
  // 搜索条件展示
  Object.keys(data).forEach((item) => {
    let str = '';
    let obj = {};
    if (!!data[item]) {
      if (Array.isArray(data[item]) && data[item].length == 0) return;

      if (item == 'requiredLanguages' && data[item][1].length == 0) return;
      if (item == 'preferredLanguages' && data[item][1].length == 0) return;
      switch (item) {
        case 'title':
        case 'code':
        case '_id':
        case 'department':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'companyId':
          if (data[item].length == 0) break;
          if (data[item]) {
            obj = {
              label: '"' + data[item][0]['label'] + '"',
              value: data[item][0],
            };
          }
          break;
        case 'requiredLanguages':
        case 'preferredLanguages':
          // data[item][0]
          data[item][1].forEach((items, index) => {
            if (data[item][1].length > 1 && data[item][1].length - 1 != index) {
              str +=
                '"' +
                (language ? items.label : items.labelCn) +
                '" ' +
                data[item][0];
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item][1],
            label: str,
            andOr: data[item][0],
          };
          break;
        case 'assignedUsers':
          if (data[item].role && data[item].userId) {
            if (data[item].userId) {
              str +=
                '"' +
                data[item]['option1']['fullName'] +
                '" and "' +
                data[item]['option2']['label'];
            } else {
              str += '"' + data[item]['option2']['label'] + '"';
            }
          } else {
            if (data[item].role) {
              str += '"' + data[item]['option2']['label'] + '""';
            } else {
              str += '"' + data[item]['option1']['fullName'] + '"';
            }
          }
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'postingTime':
          data[item].from &&
            (str += '"' + moment(data[item].from).format('YYYY-MM-DD') + '"');
          if (data[item].from && data[item].to) str += ' to ';
          data[item].to &&
            (str += '"' + moment(data[item].to).format('YYYY-MM-DD') + '"');
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'requiredSkill':
        case 'preferredSkill':
          if (data[item][1].length == 0) return;
          data[item][1].forEach((items, index) => {
            if (data[item][1].length > 1 && data[item][1].length - 1 != index) {
              str += '"' + items.skillName + '"' + data[item][0];
            } else {
              str += '"' + items.skillName + '"';
            }
          });
          obj = {
            value: data[item][1],
            label: str,
            andOr: data[item][0],
          };
          break;
        case 'jobFunctions':
          // 默认or
          let arrs = [],
            resultArr = [];
          data[item]['option'].forEach((items) => {
            if (items.children) {
              items.children.forEach((ite) => {
                if (ite.children) {
                  ite.children.forEach((val) => {
                    resultArr.push(val);
                  });
                } else {
                  resultArr.push(ite);
                }
              });
            } else {
              resultArr.push(items);
            }
          });
          data[item]['value'].forEach((items) => {
            // if (items.id == ar)
            resultArr.forEach((ite) => {
              if (ite.id == items) {
                arrs.push(ite);
              }
            });
          });

          arrs.forEach((items, index) => {
            if (arrs.length > 1 && arrs.length - 1 != index) {
              str += '"' + (language ? items.label : items.labelCn) + '"or';
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item]['value'],
            label: str,
            andOr: 'or',
          };

          break;
        case 'status':
        case 'type':
          if (data[item].length == 0) break;
          data[item].forEach((items, index) => {
            if (data[item].length - 1 != index) {
              str += '"' + items.label + '"' + 'or';
            } else {
              str += '"' + items.label + '"';
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'published':
          if (data[item].length == 0) break;
          data[item].forEach((items, index) => {
            if (data[item].length - 1 != index) {
              str += '"' + items.label + '"' + 'or';
            } else {
              str += '"' + items.label + '"';
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'locations':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'minimumDegreeLevel':
          data[item].forEach((items, index) => {
            if (data[item].length - 1 != index) {
              str += '"' + items.label + '" or';
            } else {
              str += '"' + items.label + '"';
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'Rate/Salary':
          GeneralType.forEach((items) => {
            if (items.value === data[item]['type'])
              str += '"' + items.label + '.';
          });
          currencyOptions.forEach((items) => {
            if (items.value === data[item]['currency'])
              str += items.label2 + '.';
          });
          payRateUnitTypes.forEach((items) => {
            if (items.value === data[item]['time']) str += items.label + '.';
          });
          if (data[item]['money']['min'] && data[item]['money']['max']) {
            str +=
              '"' +
              data[item]['money']['min'] +
              ' - ' +
              data[item]['money']['max'] +
              '"';
          }
          if (!data[item]['money']['min'] && data[item]['money']['max']) {
            str += '"' + 'min' + ' - ' + data[item]['money']['max'] + '"';
          }
          if (data[item]['money']['min'] && !data[item]['money']['max']) {
            str += '"' + data[item]['money']['min'] + ' - ' + 'max' + '"';
          }
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'experienceYearRange':
          if (data[item].open) {
            str += '"' + 'min' + '" - "' + data[item].lte + '"';
          } else {
            if (data[item].gte && data[item].lte) {
              str += '"' + data[item].gte + '" - "' + data[item].lte + '"';
            }
            if (!data[item].gte && data[item].lte) {
              str += '"' + 'min' + '" - "' + data[item].lte + '"';
            }
            if (data[item].gte && !data[item].lte) {
              str += '"' + data[item].gte + '" - "' + 'max' + '"';
            }
          }

          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'Salary':
          break;

        default:
          break;
      }
      columns.forEach((items) => {
        if (items.field == item) {
          obj.colName = items.colName;
          obj.name = items.field;
          obj.field = items.field;
        }
      });
      strShow += obj.colName + ': ' + obj.label + ',';
      arr.push(obj);
      strBox.push(strShow);
    }
  });

  return {
    arr,
    strShow,
    strBox,
  };
};

// 薪资单位转换
const transfromMoney = {
  Y: 1,
  M: 12,
  W: 50,
  D: 250,
  H: 2000,
};

// job基础搜索数据处理
export const requestFilter = (data) => {
  let arr = [],
    questData = {
      and: [],
    };
  data.forEach((item) => {
    let obj = {},
      valueArr = [],
      key = '';
    switch (item.field) {
      case 'title':
      case 'code':
      case '_id':
      case 'department':
        valueArr.push({
          [item.field]: item.value,
        });
        obj.and = valueArr;
        questData['and'].push(obj);
        break;
      case 'companyId':
        valueArr.push({
          [item.field]: item['value']['value'] + '',
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'requiredLanguages':
      case 'preferredLanguages':
        if (item.andOr == 'and') {
          item.value.forEach((items, index) => {
            valueArr.push({
              [item.field]: '@@' + items.id + '##',
            });
          });
        } else {
          let arr = [];
          item.value.forEach((items, index) => {
            if (index == 0 && item.value['length'] != 1) {
              arr.push('@@' + items.id);
            } else if (index == item.value['length'] - 1 && index != 0) {
              arr.push(items.id + '##');
            } else if (item.value['length'] == 1) {
              arr.push('@@' + items.id + '##');
            } else {
              arr.push(items.id + '');
            }
          });
          valueArr.push({
            [item.field]: arr,
          });
        }
        obj = {
          [item.andOr]: valueArr,
        };
        questData['and'].push(obj);
        break;
      case 'assignedUsers':
        let keys = item['value']['role'];
        valueArr.push({
          assignedUsers: {
            [keys]: item['value']['userId'] + '',
          },
        });
        obj.and = valueArr;
        questData['and'].push(obj);
        break;
      case 'postingTime':
        let time = {};
        if (item['value'].from)
          time.gte = moment(item['value'].from).format('YYYY-MM-DD');
        if (item['value'].to)
          time.lte = moment(item['value'].to).format('YYYY-MM-DD');
        questData['and'].push({
          and: [
            {
              postingTime: time,
            },
          ],
        });
        break;
      case 'requiredSkill':
        item['value'].forEach((item) => {
          valueArr.push({
            requiredSkill: item.skillName,
          });
        });
        questData['and'].push({
          [item['andOr']]: valueArr,
        });
        break;
      case 'preferredSkill':
        item['value'].forEach((item) => {
          valueArr.push({
            preferredSkill: item.skillName,
          });
        });
        questData['and'].push({
          [item['andOr']]: valueArr,
        });
        break;
      case 'status':
        item['value'].forEach((item) => {
          valueArr.push({
            status: item.value,
          });
        });
        obj = {
          or: valueArr,
        };
        questData['and'].push(obj);
        break;
      case 'type':
        item['value'].forEach((item) => {
          valueArr.push({
            type: item.value,
          });
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'published':
        item['value'].forEach((item) => {
          valueArr.push({
            published: item.value,
          });
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'locations':
        item['value'].forEach((item) => {
          if (typeof item == 'object') {
            valueArr.push({
              city: item.city,
              country: item.country,
              province: item.province,
            });
          } else {
            valueArr.push({
              location: item,
            });
          }
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'minimumDegreeLevel':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items.id);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items.id + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items.id + '##');
          } else {
            valueArr.push(items.id + '');
          }
        });

        obj.or = [
          {
            minimumDegreeLevel: valueArr,
          },
        ];
        questData['and'].push(obj);
        break;
      case 'experienceYearRange':
        if (item['value'].gte == '' && item['value'].lte === 0) {
          valueArr.push({
            experienceYearRange: {
              lte: item['value'].lte * 1,
            },
          });
        }
        if (item['value'].gte != '' && item['value'].lte != '') {
          valueArr.push({
            experienceYearRange: {
              gte: item['value'].gte * 1,
              lte: item['value'].lte * 1,
            },
          });
        } else if (item['value'].gte == '' && item['value'].lte != '') {
          valueArr.push({
            experienceYearRange: {
              lte: item['value'].lte * 1,
            },
          });
        } else if (item['value'].gte != '' && item['value'].lte == '') {
          valueArr.push({
            experienceYearRange: {
              gte: item['value'].gte * 1,
            },
          });
        }
        console.log(valueArr);
        obj.and = valueArr;
        questData['and'].push(obj);
        break;
      case 'jobFunctions':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });

        obj.or = [
          {
            jobFunctions: valueArr,
          },
        ];
        questData['and'].push(obj);
        break;
      case 'Rate/Salary':
        let unitMoney = transfromMoney[item['value']['time'][0]];
        let type = null;
        if (item['value']['type'] == 'Salary') {
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          type = 'FULL_TIME';
        } else if (item['value']['type'] == 'Bill') {
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualBill: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualBill: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualBill: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          type = 'CONTRACT';
        } else if (item['value']['type'] == 'Pay') {
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          type = 'CONTRACT';
        }

        questData['and'].push(obj);
        questData['and'].push({
          or: [
            {
              type,
            },
          ],
        });
        break;
      default:
        break;
    }
  });
  return questData;
};

// job高级搜索条件组装
export const filterAdvinced = (data) => {
  let arr = [],
    questData = [];
  let key = Object.keys(data)[0];
  data[Object.keys(data)[0]].forEach((item) => {
    let obj = {},
      valueArr = [],
      keys = null;
    switch (item['value1']) {
      case 'title':
      case 'code':
      case 'department':
        valueArr.push({
          [item.value1]: item.value,
        });
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;

      case 'companyId':
        keys = item['andOr'];
        // 多选
        item['value'][0].forEach((items) => {
          valueArr.push({
            [item.value1]: items['value'] + '',
          });
        });
        obj = {
          [keys]: valueArr,
        };
        questData.push(obj);
        break;
      case 'requiredLanguages':
      case 'preferredLanguages':
        keys = item['andOr'];
        if (item.andOr == 'and') {
          item['value'][0].forEach((items, index) => {
            valueArr.push({
              [item.value1]: '@@' + items.id + '##',
            });
          });
        } else {
          let arr = [];
          item['value'][0].forEach((items, index) => {
            if (index == 0 && item.value[0]['length'] != 1) {
              arr.push('@@' + items.id);
            } else if (index == item.value[0]['length'] - 1 && index != 0) {
              arr.push(items.id + '##');
            } else if (item.value[0]['length'] == 1) {
              arr.push('@@' + items.id + '##');
            } else {
              arr.push(items.id + '');
            }
          });
          valueArr.push({
            [item.value1]: arr,
          });
        }
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;
      case 'assignedUsers':
        keys = item['value']['role'];
        valueArr.push({
          assignedUsers: {
            [keys]: item['value']['userId'] + '',
          },
        });
        obj.and = valueArr;
        questData.push(obj);
        break;
      case 'postingTime':
        let time = {};
        if (item['value'].from)
          time.gte = moment(item['value'].from).format('YYYY-MM-DD');
        if (item['value'].to)
          time.lte = moment(item['value'].to).format('YYYY-MM-DD');

        questData.push({
          and: [
            {
              postingTime: time,
            },
          ],
        });
        break;
      case 'requiredSkill':
      case 'preferredSkill':
        keys = item['andOr'];
        item['value'].forEach((items) => {
          valueArr.push({
            [item.value1]: items.skillName,
          });
        });
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;
      case 'status':
      case 'type':
      case 'published':
        item['value'].forEach((items) => {
          valueArr.push({
            [item.value1]: items.value,
          });
        });
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;
      case 'locations':
        item['value'].forEach((item) => {
          if (typeof item == 'object') {
            valueArr.push({
              city: item.city,
              country: item.country,
              province: item.province,
            });
          } else {
            valueArr.push({
              location: item,
            });
          }
        });
        obj.or = valueArr;
        questData.push(obj);
        break;
      case 'minimumDegreeLevel':
        item['value'].forEach((item) => {
          valueArr.push({
            minimumDegreeLevel: '@@' + item.value + '##',
          });
        });
        obj.or = valueArr;
        questData.push(obj);
        break;
      case 'experienceYearRange':
        if (item['value'].gte && item['value'].lte) {
          valueArr.push({
            experienceYearRange: {
              lte: item['value'].lte * 1,
              gte: item['value'].gte * 1,
            },
          });
        } else if (item['value'].gte) {
          valueArr.push({
            experienceYearRange: {
              gte: item['value'].gte * 1,
            },
          });
        } else if (item['value'].lte) {
          valueArr.push({
            experienceYearRange: {
              lte: item['value'].lte * 1,
            },
          });
        }
        obj.and = valueArr;
        questData.push(obj);
        break;
      case 'jobFunctions':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });

        obj.or = [
          {
            jobFunctions: valueArr,
          },
        ];
        questData.push(obj);
        break;
      case 'Rate/Salary':
        let unitMoney = transfromMoney[item['value']['time'][0]];
        if (item['value']['type'] == 'Salary') {
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
        } else if (item['value']['type'] == 'Bill') {
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualBill: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualBill: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualBill: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
        } else if (item['value']['type'] == 'Pay') {
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
              },
            ];
          }
        }

        questData.push(obj);
        break;
      case '':

      default:
        break;
    }
  });
  return {
    [key]: questData,
  };
};

// job高级搜索条件展示
export const showAdvincedFilter = (data) => {
  let language = store.getState().controller.language;
  let arr = [],
    questData = [],
    strBox = [],
    strShow = '';
  let obj = {};
  let key = Object.keys(data)[0];
  data[Object.keys(data)[0]].forEach((item) => {
    let str = '';
    let obj = {},
      valueArr = [],
      keys = null;
    switch (item['value1']) {
      case 'title':
      case 'code':
      case 'department':
        obj = {
          value: item['value'],
          label: '"' + item['value'] + '"',
        };
        break;
      case 'companyId':
        if (item['value'][0].length == 0) break;
        item['value'][0].forEach((items, index) => {
          str += '"' + items['label'] + '"';
          if (index != item['value'][0].length - 1) str += item['andOr'];
        });
        obj = {
          label: str,
          value: item['value'],
          andOr: item['andOr'],
        };
        break;
      case 'requiredLanguages':
      case 'preferredLanguages':
        item['value'][0].forEach((items, index) => {
          if (
            item['value'][0].length > 1 &&
            item['value'][0].length - 1 != index
          ) {
            str +=
              '"' +
              (language ? items.label : items.labelCn) +
              '" ' +
              item['andOr'];
          } else {
            str += '"' + (language ? items.label : items.labelCn) + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
          andOr: item['andOr'],
        };
        break;
      case 'assignedUsers':
        if (item['value']['role'] && item['value']['userId']) {
          if (item['value']['userId']) {
            str +=
              '"' +
              item['value']['option1']['fullName'] +
              '" and "' +
              item['value']['option2']['label'];
          } else {
            str += '"' + item['value']['option2']['label'] + '"';
          }
        } else {
          if (item['value'].role) {
            str += '"' + item['value']['option2']['label'] + '"';
          } else {
            str += '"' + item['value']['option1']['fullName'] + '"';
          }
        }
        obj = {
          value: item['value'],
          label: str,
          andOr: item['value']['andOr'],
        };
        break;
      case 'postingTime':
        item['value'].from &&
          (str += '"' + moment(item['value'].from).format('YYYY-MM-DD') + '"');
        if (item['value'].from && item['value'].to) str += ' to ';
        item['value'].to &&
          (str += '"' + moment(item['value'].to).format('YYYY-MM-DD') + '"');
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'requiredSkill':
      case 'preferredSkill':
        if (item['value'].length == 0) return;
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            str += '"' + items.skillName + '"' + item['andOr'];
          } else {
            str += '"' + items.skillName + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
          andOr: item['andOr'],
        };
        break;
      case 'jobFunctions':
        // 默认or
        let arrs = [],
          resultArr = [];
        JSON.parse(JSON.stringify(item['values'])).forEach((items) => {
          if (items.children) {
            items.children.forEach((ite) => {
              if (ite.children) {
                ite.children.forEach((val) => {
                  resultArr.push(val);
                });
              } else {
                resultArr.push(ite);
              }
            });
          } else {
            resultArr.push(items);
          }
        });
        item['value'].forEach((items) => {
          resultArr.forEach((ite) => {
            if (ite.id == items) {
              arrs.push(ite);
            }
          });
        });

        arrs.forEach((items, index) => {
          if (arrs.length > 1 && arrs.length - 1 != index) {
            str += '"' + (language ? items.label : items.labelCn) + '"or';
          } else {
            str += '"' + (language ? items.label : items.labelCn) + '"';
          }
        });
        obj = {
          value: arrs,
          label: str,
          andOr: item['andOr'],
        };

        break;
      case 'status':
      case 'type':
      case 'published':
        if (item['value'].length == 0) break;
        item['value'].forEach((items, index) => {
          if (item['value'].length - 1 != index) {
            str += '"' + items.label + '"' + 'or';
          } else {
            str += '"' + items.label + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'locations':
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
            } else {
              str += '"' + items + '"' + 'or';
            }
          } else {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"';
            } else {
              str += '"' + items + '"';
            }
          }
          obj = {
            value: item['value'],
            label: str,
          };
        });
        break;
      case 'minimumDegreeLevel':
        item['value'].forEach((items, index) => {
          if (item['value'].length - 1 != index) {
            str += '"' + items.label + '" or';
          } else {
            str += '"' + items.label + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'Rate/Salary':
        GeneralType.forEach((items) => {
          if (items.value === item['value']['type'])
            str += '"' + items.label + '.';
        });
        currencyOptions.forEach((items) => {
          if (items.value === item['value']['currency'])
            str += items.label2 + '.';
        });
        payRateUnitTypes.forEach((items) => {
          if (items.value === item['value']['time']) str += items.label + '.';
        });
        if (item['value']['money']['min'] && item['value']['money']['max']) {
          str +=
            '"' +
            item['value']['money']['min'] +
            ' - ' +
            item['value']['money']['max'] +
            '"';
        }
        if (!item['value']['money']['min'] && item['value']['money']['max']) {
          str += '"' + 'min' + ' - ' + item['value']['money']['max'] + '"';
        }
        if (item['value']['money']['min'] && !item['value']['money']['max']) {
          str += '"' + item['value']['money']['min'] + ' - ' + 'max' + '"';
        }

        obj = {
          value: data[item],
          label: str,
        };
        break;
      case 'experienceYearRange':
        if (item['value']['gte'] && item['value']['lte']) {
          str +=
            '"' + item['value']['gte'] + ' - ' + item['value']['lte'] + '"';
        } else if (item['value']['gte']) {
          str += '"' + item['value']['gte'] + ' - ' + 'max' + '"';
        } else if (item['value']['lte']) {
          str += '"' + 'min' + ' - ' + item['value']['lte'] + '"';
        }
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      default:
        break;
    }
    columns.forEach((items) => {
      if (items.field == item['value1']) {
        obj.colName = items.colName;
        obj.name = items.field;
        obj.field = items.field;
      }
    });
    strShow += obj.colName + ': ' + obj.label + ',';
    arr.push(obj);
    strBox.push(strShow);
  });
  return strShow;
};

// job高级搜索条件展示
export const getAdvincedFilter = (data) => {
  if (JSON.stringify(data) == '{}') return { showStr: [] };
  let strArr = [];
  data.forEach((item) => {
    let key = Object.keys(item)[0];
    strArr.push([key, showAdvincedFilter(item)]);
  });
  return {
    showStr: strArr,
  };
};

// candidata 高级搜索条件
export const candidateGetAdvincedFilter = (data) => {
  if (JSON.stringify(data) == '{}') return { showStr: [] };
  let strArr = [];
  data.forEach((item) => {
    let key = Object.keys(item)[0];
    strArr.push([key, CandidateShowAdvincedFilter(item)]);
  });
  return {
    showStr: strArr,
  };
};

// 高级搜索数据处理
export const requestAdvincedFilter = (data) => {
  let arr = [];
  data instanceof Array &&
    data.forEach((item) => {
      arr.push(filterAdvinced(item));
    });
  return {
    or: arr,
  };
};

// 高级搜索数据处理
export const candidateRequestAdvincedFilter = (data) => {
  let arr = [];
  data instanceof Array &&
    data.forEach((item) => {
      arr.push(candidateFilterAdvinced(item));
    });
  return {
    or: arr,
  };
};

export const isRequired = (data, value) => {
  switch (data['field']) {
    case 'assignedUsers':
      if (!value['userId']) {
        return {
          isRequire: true,
          msg: ['fullName is required.', ''],
        };
      } else if (!value['role']) {
        return {
          isRequire: true,
          msg: ['', 'Role is required.'],
        };
      } else {
        return {
          isRequire: false,
        };
      }
      break;
    case 'experience':
    case 'experienceYearRange':
      if (!value['open']) {
        if (value['gte'] && value['lte']) {
          if (value['gte'] * 1 > value['lte'] * 1) {
            return {
              isRequire: true,
              msg: ['', 'Years is error.'],
            };
          } else {
            return {
              isRequire: false,
            };
          }
        } else {
          if (value['gte'] == '' && value['lte'] == '') {
            return {
              isRequire: true,
              msg: ['Years is required.'],
            };
          } else {
            return {
              isRequire: false,
            };
          }
        }
      } else {
        return {
          isRequire: false,
        };
      }
      break;

    case 'Rate/Salary':
    case 'currentSalary':
    case 'preferredSalary':
      let reg = /^[0-9]+.?[0-9]*$/;

      if (!value['money']['min'] && !value['money']['max']) {
        return {
          msg: ['money is required.'],
          isRequire: true,
        };
      } else if (
        value['money']['min'] &&
        value['money']['max'] &&
        value['money']['min'] * 1 > value['money']['max'] * 1
      ) {
        return {
          isRequire: true,
          msg: ['', 'money is error.'],
        };
      } else {
        return {
          isRequire: false,
        };
      }
      break;

    default:
      return {
        isRequire: false,
      };
      break;
  }
};

// candidate基础搜索验证
export const isRequired2 = (data, value) => {
  let res = [];
  let Newmsg = [];
  switch (data['field']) {
    // case 'email':
    //   value.forEach((item) => {
    //     res.push(isEmails.test(item))
    //   })
    //   res.forEach((val) => {
    //     if (val == false) {
    //       Newmsg.push('Email is error.')
    //     } else {
    //       Newmsg.push('')
    //     }
    //   })
    //   if (res.indexOf(false) > -1) {
    //     return {
    //       isRequire: true,
    //       msg: Newmsg,
    //     };
    //   } else {
    //     return {
    //       isRequire: false,
    //     };
    //   }
    //   break;
    // case 'phone':
    //   value.forEach((item) => {
    //     res.push(isPhones.test(item))
    //   })
    //   res.forEach((val) => {
    //     if (val == false) {
    //       Newmsg.push('Phone is error.')
    //     } else {
    //       Newmsg.push('')
    //     }
    //   })

    //   if (res.indexOf(false) > -1) {
    //     return {
    //       isRequire: true,
    //       msg: Newmsg,
    //     };
    //   } else {
    //     return {
    //       isRequire: false,
    //     };
    //   }
    //   break;
    case 'assignedUsers':
      if (!value['userId']) {
        return {
          isRequire: true,
          msg: ['fullName is required.', ''],
        };
      } else if (!value['role']) {
        return {
          isRequire: true,
          msg: ['', 'Role is required.'],
        };
      } else {
        return {
          isRequire: false,
        };
      }
      break;
    case 'experience':
      if (!value['open']) {
        if (value['gte'] && value['lte']) {
          if (value['gte'] * 1 > value['lte'] * 1) {
            return {
              isRequire: true,
              msg: ['', 'Years is error.'],
            };
          } else {
            return {
              isRequire: false,
            };
          }
        } else {
          if (value['gte'] == '' && value['lte'] == '') {
            return {
              isRequire: true,
              msg: ['Years is required.'],
            };
          } else {
            return {
              isRequire: false,
            };
          }
        }
      } else {
        return {
          isRequire: false,
        };
      }
      break;
    case 'currentSalary':
    case 'preferredSalary':
      if (value['open']) {
        if (!value['money']['min'] && !value['money']['max']) {
          return {
            msg: ['money is required.'],
            isRequire: true,
          };
        } else if (
          value['money']['min'] &&
          value['money']['max'] &&
          value['money']['min'] * 1 > value['money']['max'] * 1
        ) {
          return {
            isRequire: true,
            msg: ['', 'money is error.'],
          };
        } else {
          return {
            isRequire: false,
          };
        }
      } else {
        if (!value['money']['number']) {
          1;
          return {
            msg: ['money is required.'],
            isRequire: true,
          };
        } else {
          return {
            isRequire: false,
          };
        }
      }

      break;
    case 'Company':
      console.log(value);
      if (!value[1]) {
        return {
          msg: ['company name is required.'],
          isRequire: true,
        };
      } else {
        return {
          isRequire: false,
        };
      }
      break;
    default:
      return {
        isRequire: false,
      };
      break;
  }
};

// 高级搜索单组字段验证
export const checkEvery = (data) => {
  let isSearch = true;
  // if (item['colName'])
  switch (data['value1']) {
    case 'title':
      if (data['value'] == '') {
        data['errorMsg'] = ['Title is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'code':
      if (data['value'] == '') {
        data['errorMsg'] = ['Code is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'department':
      if (data['value'] == '') {
        data['errorMsg'] = ['Department is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'companyId':
      if (!data['value'][0]['length']) {
        data['errorMsg'] = ['Company is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'requiredLanguages':
    case 'preferredLanguages':
      if (JSON.stringify(data['value'][0]) == '[]') {
        data['errorMsg'] = ['Languages is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'assignedUsers':
      data['errorMsg'] = [];
      if (!data['value']['userId']) {
        data['errorMsg'].push('User is required');
        isSearch = false;
      } else {
        data['errorMsg'].push('');
      }
      if (!data['value']['role']) {
        data['errorMsg'].push('Role is required');
        isSearch = false;
      } else {
        data['errorMsg'].push('');
      }
      if (data['value']['userId'] && data['value']['role']) {
        data['errorMsg'] = ['', ''];
      }
      break;
    case 'postingTime':
      if (data['value'].from === null && data['value'].to === null) {
        data['errorMsg'] = 'Date is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'requiredSkill':
      if (JSON.stringify(data['value']) == '[]') {
        data['errorMsg'] = 'Skill is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'preferredSkill':
      if (JSON.stringify(data['value']) == '[]') {
        data['errorMsg'] = 'Skill is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'jobFunctions':
      if (data['value'] == '') {
        data['errorMsg'] = 'Job Function is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'status':
      if (JSON.stringify(data['value']) == '[]') {
        data['errorMsg'] = 'Job Status is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'type':
      if (JSON.stringify(data['value']) == '[]') {
        data['errorMsg'] = 'Job Type is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'locations':
      let stringValue = JSON.stringify(data['value'][0]);
      if (stringValue == 'null' || stringValue == undefined) {
        data['errorMsg'] = 'Location is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'minimumDegreeLevel':
      if (JSON.stringify(data['value']) == '[]') {
        data['errorMsg'] = 'Degree is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'Rate/Salary':
      if (!data['value']['money']['min'] && !data['value']['money']['max']) {
        data['errorMsg'] = ['Salary is required', ''];
        isSearch = false;
      } else if (
        data['value']['money']['min'] &&
        data['value']['money']['max'] &&
        data['value']['money']['min'] * 1 > data['value']['money']['max'] * 1
      ) {
        data['errorMsg'] = ['', 'Salary is error'];
        isSearch = false;
      } else {
        data['errorMsg'] = ['', ''];
      }
      break;
    case 'experienceYearRange':
      if (!data['value']['gte'] && !data['value']['lte']) {
        data['errorMsg'] = ['Experience is required', 'Experience is required'];
        isSearch = false;
      } else if (
        data['value']['gte'] &&
        data['value']['lte'] &&
        data['value']['gte'] * 1 > data['value']['lte'] * 1
      ) {
        data['errorMsg'] = ['', 'Experience is error'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'published':
      if (data['value']?.length === 0) {
        data['errorMsg'] = ['Job Posting Status is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    default:
      break;
  }
  if (!data['value1']) {
    data['errorTitle'] = 'Column Name is required';
    isSearch = false;
  } else {
    data['errorTitle'] = '';
  }
  return {
    result: data,
    isSearch,
  };
};

// candidate高级搜索单组字段验证
export const candidateCheckEvery = (data) => {
  let isSearch = true;
  let stringValue = null;
  // if (item['colName'])
  let res = [];
  let Newmsg = [];
  switch (data['value1']) {
    case 'name':
      stringValue = JSON.stringify(data['value'][0]);
      typeof stringValue;
      if (stringValue == 'null' || stringValue == undefined) {
        data['errorMsg'] = 'Name is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'email':
      data['value'] &&
        data['value'].forEach((item) => {
          res.push(isEmails.test(item));
        });
      res.forEach((val) => {
        if (val == false) {
          Newmsg.push('Email is required.');
        } else {
          Newmsg.push('');
        }
      });
      if (res.indexOf(false) > -1) {
        data['errorMsg'] = Newmsg;
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'phone':
      data['value'] &&
        data['value'].forEach((item) => {
          res.push(isPhones.test(item));
        });
      res.forEach((val) => {
        if (val == false) {
          Newmsg.push('Phone is required.');
        } else {
          Newmsg.push('');
        }
      });
      if (res.indexOf(false) > -1) {
        data['errorMsg'] = Newmsg;
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'industries':
      if (data['value'] == '') {
        data['errorMsg'] = ['Industries is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;

    case 'jobFunctions':
      if (data['value'] == '') {
        data['errorMsg'] = ['Job Function is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'currentLocation':
      if (data['value'] == '') {
        data['errorMsg'] = ['Current Location is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'languages':
      if (JSON.stringify(data['value'][0]) == '[]') {
        data['errorMsg'] = ['Languages is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'workAuthorization':
      if (data['value'] == '') {
        data['errorMsg'] = ['Work Authorization is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'currentJobTitle':
      if (data['value'] == '') {
        data['errorMsg'] = ['Current Job Title is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'currentCompany':
      if (data['value'] == '') {
        data['errorMsg'] = ['Current Company is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'skills':
      if (JSON.stringify(data['value']) == '[]') {
        data['errorMsg'] = 'Skill is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'jobFunctions':
      if (data['value'] == '') {
        data['errorMsg'] = 'Job Function is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'preferredLocation':
      stringValue = JSON.stringify(data['value'][0]);
      // if (!data['value'][0]) {
      if (stringValue == 'null' || stringValue == undefined) {
        data['errorMsg'] = 'Preferred Locations is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'preferredSalary':
    case 'currentSalary':
      if (!data['value']['money']['min'] && !data['value']['money']['max']) {
        data['errorMsg'] = ['Salary is required', ''];
        isSearch = false;
      } else if (
        data['value']['money']['min'] &&
        data['value']['money']['max'] &&
        data['value']['money']['min'] * 1 > data['value']['money']['max'] * 1
      ) {
        data['errorMsg'] = ['', 'Salary is error'];
        isSearch = false;
      } else {
        data['errorMsg'] = ['', ''];
      }
      break;
    case 'experience':
      if (!data['value']['gte'] && !data['value']['lte']) {
        data['errorMsg'] = ['Experience is required', 'Experience is required'];
        isSearch = false;
      } else if (
        data['value']['gte'] &&
        data['value']['lte'] &&
        data['value']['gte'] * 1 > data['value']['lte'] * 1
      ) {
        data['errorMsg'] = ['', 'Experience is error'];
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'School':
      stringValue = JSON.stringify(data['value'][0]);
      if (stringValue == 'null' || stringValue == undefined) {
        data['errorMsg'] = 'School is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'major':
      stringValue = JSON.stringify(data['value'][0]);
      if (stringValue == 'null' || stringValue == undefined) {
        data['errorMsg'] = 'Major is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'degrees':
      if (data['value'] == '') {
        data['errorMsg'] = 'Degrees is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'createBy':
      if (data['value'] == '') {
        data['errorMsg'] = 'CreateBy is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;

    case 'recruiter':
      if (data['value'] == '') {
        data['errorMsg'] = 'Recruiter is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;

    case 'candidateId':
      if (data['value'] == '') {
        data['errorMsg'] = ['Candidate ID is required'];
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;

    case 'dateOfCreation':
      if (data['value'].from === null && data['value'].to === null) {
        data['errorMsg'] = 'Date is required';
        isSearch = false;
      } else {
        data['errorMsg'] = '';
      }
      break;
    case 'owner':
      if (data['value'] == '') {
        data['errorMsg'] = 'Owner is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    case 'dm':
      if (data['value'] == '') {
        data['errorMsg'] = 'DM is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;

    case 'am':
      if (data['value'] == '') {
        data['errorMsg'] = 'AM is required';
        isSearch = false;
      } else {
        data['errorMsg'] = [''];
      }
      break;
    default:
      break;
  }
  if (!data['value1']) {
    data['errorTitle'] = 'Column Name is required';
    isSearch = false;
  } else {
    data['errorTitle'] = '';
  }
  return {
    result: data,
    isSearch,
  };
};

// 高级查询输入验证
export const isRequiredAdvanced = (data) => {
  let arr = [];
  let isOk = true;
  data.forEach((item) => {
    let obj = {};
    Object.keys(item).forEach((items) => {
      let arrs = [];
      item[items].forEach((item) => {
        let { result, isSearch } = checkEvery(item);
        if (!isSearch) isOk = isSearch;
        delete result['options'];
        arrs.push(result);
      });
      obj = {
        [items]: arrs,
      };
    });
    arr.push(obj);
  });
  return {
    data: arr,
    isOk,
  };
};

// 高级查询输入验证
export const candidateIsRequiredAdvanced = (data) => {
  let arr = [];
  let isOk = true;
  data.forEach((item) => {
    let obj = {};
    Object.keys(item).forEach((items) => {
      let arrs = [];
      item[items].forEach((item) => {
        let { result, isSearch } = candidateCheckEvery(item);
        if (!isSearch) isOk = isSearch;
        delete result['options'];
        arrs.push(result);
      });
      obj = {
        [items]: arrs,
      };
    });
    arr.push(obj);
  });
  return {
    data: arr,
    isOk,
  };
};

export const columns = [
  {
    colName: 'Job Title',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'title',
    placeholder: 'Enter a job title',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'companyId',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Assigned User',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'doubleSelect',
    field: 'assignedUsers',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Job ID',
    colWidth: 200,
    flexGrow: 3,
    col: '_id',
    fixed: true,
    sortable: true,
    type: 'input',
    field: '_id',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Posting Date',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'time',
    field: 'postingTime',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Status',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'status',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Job Types',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'type',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Location',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'locations',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Degree Requirement',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'minimumDegreeLevel',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Years of Experience',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'dbNumber',
    field: 'experienceYearRange',
    andOr: 'na',
    changeAndOr: false,
  },
  {
    colName: 'Job Code',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'number',
    field: 'code',
    placeholder: 'Enter a job code',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Required Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'requiredLanguages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Required Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'requiredSkill',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Preferred Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'preferredLanguages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Preferred Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'preferredSkill',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Job Function',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'tree',
    field: 'jobFunctions',
    andOr: 'or',
    changeAndOr: false,
  },
  // {
  //   colName: 'Rate Currency',
  //   colWidth: 200,
  //   flexGrow: 3,
  //   col: 'title',
  //   fixed: true,
  //   sortable: true,
  //   type: 'select',
  //   field: 'currency',
  // },
  {
    colName: 'Rate/Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'rateSalary',
    field: 'Rate/Salary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Department',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'department',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Job Posting Status',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'published',
    andOr: 'or',
    changeAndOr: false,
  },
];

export const isNum = (str, length) => {
  let value = str.replace(/[^\d]/g, '');
  if (value.length > length) value = value.slice(0, length);
  return value;
};
export const isSymbol = (str) => {
  let value = str.replace(/[,]/g, '');
  return value;
};

const isPhones = /^[\s\S]*.*[^\s][\s\S]*$/;
const isEmails = /^[\s\S]*.*[^\s][\s\S]*$/;

export const isEn = (str) => {
  let value = str.replace(/[\u4E00-\u9FA5\+,]/g, '');
  return value;
};

export const isPhone = (str) => {
  let value = str.replace(/[^\+\d]/g, '');
  return value;
};

const isChinese = (str) => {
  if (/^[\u3220-\uFA29]+$/.test(str)) {
    return true;
  } else {
    return false;
  }
};

// candidate基础搜索数据展示
export const candidateFilterSearch = (data) => {
  let language = store.getState().controller.language;
  let arr = [],
    strBox = [],
    strShow = '';
  // 搜索条件展示
  Object.keys(data).forEach((item) => {
    let str = '';
    let obj = {};
    if (!!data[item]) {
      if (Array.isArray(data[item]) && data[item].length == 0) return;
      if (item == 'languages' && data[item][1].length == 0) return;
      // if (item == 'currentSalary') return
      switch (item) {
        case 'name':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'email':
        case 'phone':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'industries':
          // 默认or
          let arrs = [],
            resultArr = [];
          data[item]['option'].forEach((items) => {
            if (items.children) {
              items.children.forEach((ite) => {
                resultArr.push(ite);
              });
            } else {
              resultArr.push(items);
            }
          });
          data[item]['value'].forEach((items) => {
            // if (items.id == ar)
            resultArr.forEach((ite) => {
              if (ite.id == items) {
                arrs.push(ite);
              }
            });
          });

          arrs.forEach((items, index) => {
            if (arrs.length > 1 && arrs.length - 1 != index) {
              str += '"' + (language ? items.label : items.labelCn) + '"or';
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item]['value'],
            label: str,
            andOr: 'or',
          };

          break;
        case 'currentLocation':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'languages':
          data[item][1].forEach((items, index) => {
            if (data[item][1].length > 1 && data[item][1].length - 1 != index) {
              str +=
                '"' +
                (language ? items.label : items.labelCn) +
                '" ' +
                data[item][0];
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item][1],
            label: str,
            andOr: data[item][0],
          };
          break;
        case 'currentSalary':
        case 'preferredSalary':
          currencyOptions.forEach((items) => {
            if (items.value === data[item]['currency'])
              str += items.label2 + '.';
          });
          payRateUnitTypes.forEach((items) => {
            if (items.value === data[item]['time']) str += items.label + '.';
          });

          if (data[item]['open']) {
            if (data[item]['money']['min'] === data[item]['money']['max']) {
              str += '"' + data[item]['money']['max'] + '"';
            } else {
              if (data[item]['money']['min'] && data[item]['money']['max']) {
                str +=
                  '"' +
                  data[item]['money']['min'] +
                  ' - ' +
                  data[item]['money']['max'] +
                  '"';
              }
              if (data[item]['money']['min'] && !data[item]['money']['max']) {
                str += '"' + data[item]['money']['min'] + ' - ' + 'max' + '"';
              }
              if (!data[item]['money']['min'] && data[item]['money']['max']) {
                str += '"' + 'min' + ' - ' + data[item]['money']['max'] + '"';
              }
            }
          } else {
            if (data[item]['money']['number']) {
              str += '"' + data[item]['money']['number'] + '"';
            }
          }

          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'workAuthorization':
        case 'jobFunctions':
          // 默认or
          let arrs1 = [],
            resultArr1 = [];
          data[item]['option'].forEach((items) => {
            if (items.children) {
              items.children.forEach((ite) => {
                if (ite.children) {
                  ite.children.forEach((val) => {
                    resultArr1.push(val);
                  });
                } else {
                  resultArr1.push(ite);
                }
              });
            } else {
              resultArr1.push(items);
            }
          });
          data[item]['value'].forEach((items) => {
            // if (items.id == ar)
            resultArr1.forEach((ite) => {
              if (ite.id == items) {
                arrs1.push(ite);
              }
            });
          });

          arrs1.forEach((items, index) => {
            if (arrs1.length > 1 && arrs1.length - 1 != index) {
              str += '"' + (language ? items.label : items.labelCn) + '"or';
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item]['value'],
            label: str,
            andOr: 'or',
          };

          break;
        case 'experience':
          if (data[item].open == true) {
            str += '"' + 'min' + '" - "' + data[item].lte + '"';
          } else {
            if (data[item].gte && data[item].lte) {
              str = '"' + data[item].gte + '" - "' + data[item].lte + '"';
            } else if (!data[item].gte && data[item].lte) {
              str = '"' + 'min' + '" - "' + data[item].lte + '"';
            } else if (data[item].gte && !data[item].lte) {
              str = '"' + data[item].gte + '" - "' + 'max' + '"';
            }
          }
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'currentJobTitle':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'currentCompany':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'skills':
          if (data[item][1].length == 0) return;
          data[item][1].forEach((items, index) => {
            if (data[item][1].length > 1 && data[item][1].length - 1 != index) {
              str += '"' + items.skillName + '"' + data[item][0];
            } else {
              str += '"' + items.skillName + '"';
            }
          });
          obj = {
            value: data[item][1],
            label: str,
            andOr: data[item][0],
          };
          break;
        case 'degrees':
          data[item].forEach((items, index) => {
            if (data[item].length - 1 != index) {
              str += '"' + items.label + '" or';
            } else {
              str += '"' + items.label + '"';
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'candidateId':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'preferredLocation':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
        case 'dateOfCreation':
          data[item].from &&
            (str += '"' + moment(data[item].from).format('YYYY-MM-DD') + '"');
          if (data[item].from && data[item].to) str += ' to ';
          data[item].to &&
            (str += '"' + moment(data[item].to).format('YYYY-MM-DD') + '"');
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'School':
        case 'major':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'am':
        case 'dm':
        case 'createBy':
        case 'recruiter':
        case 'owner':
          data[item].forEach((items, index) => {
            if (isChinese(items.firstName)) {
              if (data[item].length - 1 != index) {
                str += '"' + items.lastName + ' ' + items.firstName + '" or';
              } else {
                str += '"' + items.lastName + ' ' + items.firstName + '"';
              }
            } else {
              if (data[item].length - 1 != index) {
                str += '"' + items.firstName + ' ' + items.lastName + '" or';
              } else {
                str += '"' + items.firstName + ' ' + items.lastName + '"';
              }
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;

        default:
          break;
      }

      candidateColumns.forEach((items) => {
        if (items.field == item) {
          obj.colName = items.colName;
          obj.name = items.field;
          obj.field = items.field;
        }
      });
      strShow += obj.colName + ': ' + obj.label + ',';
      strBox.push(strShow);
      arr.push(obj);
    }
  });
  return {
    arr,
    strShow,
    strBox,
  };
};
// candidate基本搜索数据处理
export const candidateRequestFilter = (data) => {
  let arr = [],
    questData = {
      and: [],
    };

  data.forEach((item) => {
    let obj = {},
      valueArr = [],
      keys = '',
      res = [];
    switch (item.field) {
      case 'name':
        item.value &&
          item.value.forEach((item) => {
            let box = { fullName: '' };
            box.fullName = item;
            res.push(box);
          });
        obj.or = res;
        questData['and'].push(obj);
        break;
      case 'email':
        item.value &&
          item.value.forEach((item) => {
            let box = { emails: '' };
            box.emails = item;
            res.push(box);
          });
        obj.or = res;
        questData['and'].push(obj);
        break;
      case 'phone':
        item.value &&
          item.value.forEach((item) => {
            let box = { phones: '' };
            box.phones = item;
            res.push(box);
          });
        obj.or = res;
        questData['and'].push(obj);
        break;
      case 'industries':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });
        obj.or = [
          {
            industries: valueArr,
          },
        ];
        questData['and'].push(obj);
        break;
      case 'jobFunctions':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });

        obj.or = [
          {
            jobFunctions: valueArr,
          },
        ];

        questData['and'].push(obj);
        break;
      case 'currentLocation':
        item['value'].forEach((item) => {
          if (typeof item == 'object') {
            valueArr.push({
              city: item.city,
              country: item.country,
              province: item.province,
            });
          } else {
            valueArr.push({
              location: item,
            });
          }
        });
        obj.or = valueArr;

        questData['and'].push(obj);
        break;
      case 'languages':
        if (item.andOr == 'and') {
          item.value.forEach((items, index) => {
            valueArr.push({
              [item.field]: '@@' + items.id + '##',
            });
          });
        } else {
          let arr = [];
          item.value.forEach((items, index) => {
            if (index == 0 && item.value['length'] != 1) {
              arr.push('@@' + items.id);
            } else if (index == item.value['length'] - 1 && index != 0) {
              arr.push(items.id + '##');
            } else if (item.value['length'] == 1) {
              arr.push('@@' + items.id + '##');
            } else {
              arr.push(items.id + '');
            }
          });
          valueArr.push({
            [item.field]: arr,
          });
        }
        obj = {
          [item.andOr]: valueArr,
        };
        questData['and'].push(obj);
        break;
      case 'currentSalary':
        let unitMoney = transfromMoney[item['value']['time'][0]];
        if (item['value']['open']) {
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
                searchMode: 'CURRENT',
                // minimumOverlapRatio: 0.1,
                // scalingFactor: 10000
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  lte: item['value']['money']['max'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
                searchMode: 'CURRENT',
                // minimumOverlapRatio: 0.1,
                // scalingFactor: 10000
              },
            ];
          }
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney,
                },
                currency: item['value']['currency'],
                searchMode: 'CURRENT',
                // minimumOverlapRatio: 0.1,
                // scalingFactor: 10000
              },
            ];
          }
        } else {
          obj.and = [
            {
              annualSalary: {
                gte: item['value']['money']['number'] * 1 * unitMoney,
                lte: item['value']['money']['number'] * 1 * unitMoney,
              },
              currency: item['value']['currency'],
              searchMode: 'CURRENT',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }

        questData['and'].push(obj);
        break;
      case 'workAuthorization':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });

        obj.or = [
          {
            tenantLabels: valueArr,
          },
        ];
        questData['and'].push(obj);
        break;

      case 'experience':
        if (item['value'].gte != '' && item['value'].lte != '') {
          valueArr.push({
            experienceYears: {
              gte: item['value'].gte * 1,
              lte: item['value'].lte * 1,
            },
          });
        } else if (item['value'].gte == '' && item['value'].lte != '') {
          valueArr.push({
            experienceYears: {
              lte: item['value'].lte * 1,
            },
          });
        } else if (item['value'].gte != '' && item['value'].lte == '') {
          valueArr.push({
            experienceYears: {
              gte: item['value'].gte * 1,
            },
          });
        }
        obj.and = valueArr;
        questData['and'].push(obj);
        break;
      case 'currentJobTitle':
        valueArr.push({
          searchMode: 'CURRENT',
          title: item.value,
        });
        obj.and = valueArr;
        questData['and'].push(obj);
        break;
      case 'currentCompany':
        valueArr.push({
          companyName: item['value'],
          searchMode: 'CURRENT',
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'skills':
        item['value'].forEach((item) => {
          valueArr.push({
            skill: item.skillName,
          });
        });
        questData['and'].push({
          [item['andOr']]: valueArr,
        });
        break;
      case 'degrees':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items.id);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items.id + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items.id + '##');
          } else {
            valueArr.push(items.id + '');
          }
        });

        obj.or = [
          {
            degrees: valueArr,
          },
        ];
        questData['and'].push(obj);
        break;
      case 'preferredSalary':
        let unitMoney2 = transfromMoney[item['value']['time'][0]];
        if (item['value']['open']) {
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney2,
                  lte: item['value']['money']['max'] * 1 * unitMoney2,
                },
                currency: item['value']['currency'],
                searchMode: 'PREFERRED',
                // minimumOverlapRatio: 0.1,
                // scalingFactor: 10000
              },
            ];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  lte: item['value']['money']['max'] * 1 * unitMoney2,
                },
                currency: item['value']['currency'],
                searchMode: 'PREFERRED',
                // minimumOverlapRatio: 0.1,
                // scalingFactor: 10000
              },
            ];
          }
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            obj.and = [
              {
                annualSalary: {
                  gte: item['value']['money']['min'] * 1 * unitMoney2,
                },
                currency: item['value']['currency'],
                searchMode: 'PREFERRED',
                // minimumOverlapRatio: 0.1,
                // scalingFactor: 10000
              },
            ];
          }
        } else {
          obj.and = [
            {
              annualSalary: {
                gte: item['value']['money']['number'] * unitMoney2 * 1,
                lte: item['value']['money']['number'] * unitMoney2 * 1,
              },
              currency: item['value']['currency'],
              searchMode: 'PREFERRED',
            },
          ];
        }

        questData['and'].push(obj);
        break;
      case 'preferredLocation':
        item['value'].forEach((item) => {
          if (typeof item == 'object') {
            valueArr.push({
              city: item.city,
              country: item.country,
              province: item.province,
              searchMode: 'PREFERRED',
            });
          } else {
            valueArr.push({
              location: item,
              searchMode: 'PREFERRED',
            });
          }
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'dateOfCreation':
        let time = {};
        if (item['value'].from)
          time.gte = moment(item['value'].from).format('YYYY-MM-DD');
        if (item['value'].to)
          time.lte = moment(item['value'].to).format('YYYY-MM-DD');
        questData['and'].push({
          and: [
            {
              createdDate: time,
            },
          ],
        });
        break;
      case 'candidateId':
        valueArr.push({
          _id: item.value,
        });
        obj.or = valueArr;
        questData['and'].push(obj);
        break;
      case 'School':
        item.value &&
          item.value.forEach((item) => {
            let box = { collegeName: '' };
            box.collegeName = item;
            res.push(box);
          });
        obj.or = res;
        questData['and'].push(obj);
        break;
      case 'major':
        item.value &&
          item.value.forEach((item) => {
            let box = { major: '', searchMode: 'ALL' };
            box.major = item;
            res.push(box);
          });
        obj.or = res;
        questData['and'].push(obj);
        break;
      case 'am':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              AM: valueArr,
            },
          },
        ];
        questData['and'].push(obj);
        break;
      case 'dm':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              DM: valueArr,
            },
          },
        ];
        questData['and'].push(obj);
        break;
      case 'owner':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });
        obj.or = [
          {
            assignedUsers: {
              OWNER: valueArr,
            },
          },
        ];
        questData['and'].push(obj);
        break;
      case 'recruiter':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              RECRUITER: valueArr,
            },
          },
        ];
        questData['and'].push(obj);
        break;

      case 'createBy':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              CREATED_BY: valueArr,
            },
          },
        ];
        questData['and'].push(obj);
        break;
      case 'assignedUsers':
        let keys = item['value']['role'];
        valueArr.push({
          assignedUsers: {
            [keys]: item['value']['userId'] + '',
          },
        });
        obj.and = valueArr;
        questData['and'].push(obj);
        break;
      case 'Company':
        console.log(item['value']);
        if (item['value'] && item['value'][0] === 'Current') {
          obj.and = [
            {
              companyName: item['value'] && item['value'][1],
              searchMode: 'CURRENT',
            },
          ];
        } else {
          obj.and = [
            {
              companyName: item['value'] && item['value'][1],
              searchMode: 'CURRENT_AND_PAST',
            },
          ];
        }
        questData['and'].push(obj);
        console.log(item['value']);
        break;
      default:
        break;
    }
  });
  return questData;
};

// candidate高级搜索条件组装
export const candidateFilterAdvinced = (data) => {
  let arr = [],
    questData = [];
  let key = Object.keys(data)[0];
  data[Object.keys(data)[0]].forEach((item) => {
    let obj = {},
      valueArr = [],
      keys = null,
      res = [];
    switch (item['value1']) {
      case 'name':
        item.value &&
          item.value.forEach((item) => {
            let box = { fullName: '' };
            box.fullName = item;
            res.push(box);
          });
        obj = {
          [item.andOr]: res,
        };
        questData.push(obj);
        break;
      case 'email':
        item.value &&
          item.value.forEach((item) => {
            let box = { emails: '' };
            box.emails = item;
            res.push(box);
          });
        obj = {
          [item.andOr]: res,
        };
        questData.push(obj);
        break;
      case 'phone':
        item.value &&
          item.value.forEach((item) => {
            let box = { phones: '' };
            box.phones = item;
            res.push(box);
          });
        obj = {
          [item.andOr]: res,
        };
        questData.push(obj);
        break;
      case 'industries':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });
        obj.or = [
          {
            industries: valueArr,
          },
        ];
        questData.push(obj);
        break;
      case 'jobFunctions':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });

        obj.or = [
          {
            jobFunctions: valueArr,
          },
        ];

        questData.push(obj);
        break;
      case 'currentLocation':
        item['value'].forEach((item) => {
          if (typeof item == 'object') {
            valueArr.push({
              city: item.city,
              country: item.country,
              province: item.province,
            });
          } else {
            valueArr.push({
              location: item,
            });
          }
        });
        obj.or = valueArr;
        questData.push(obj);
        break;
      case 'languages':
        keys = item['andOr'];
        if (item.andOr == 'and') {
          item['value'][0].forEach((items, index) => {
            valueArr.push({
              [item.value1]: '@@' + items.id + '##',
            });
          });
        } else {
          let arr = [];
          item['value'][0].forEach((items, index) => {
            if (index == 0 && item.value[0]['length'] != 1) {
              arr.push('@@' + items.id);
            } else if (index == item.value[0]['length'] - 1 && index != 0) {
              arr.push(items.id + '##');
            } else if (item.value[0]['length'] == 1) {
              arr.push('@@' + items.id + '##');
            } else {
              arr.push(items.id + '');
            }
          });
          valueArr.push({
            [item.value1]: arr,
          });
        }
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;
      case 'currentSalary':
        let unitMoney = transfromMoney[item['value']['time'][0]];
        if (item['value']['money']['min'] && item['value']['money']['max']) {
          obj.and = [
            {
              annualSalary: {
                gte: item['value']['money']['min'] * 1 * unitMoney,
                lte: item['value']['money']['max'] * 1 * unitMoney,
              },
              currency: item['value']['currency'],
              searchMode: 'CURRENT',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }
        if (item['value']['money']['min'] && !item['value']['money']['max']) {
          obj.and = [
            {
              annualSalary: {
                gte: item['value']['money']['min'] * 1 * unitMoney,
              },
              currency: item['value']['currency'],
              searchMode: 'CURRENT',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }
        if (!item['value']['money']['min'] && item['value']['money']['max']) {
          obj.and = [
            {
              annualSalary: {
                lte: item['value']['money']['max'] * 1 * unitMoney,
              },
              currency: item['value']['currency'],
              searchMode: 'CURRENT',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }
        questData.push(obj);
        break;
      case 'workAuthorization':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items + '##');
          } else {
            valueArr.push(items + '');
          }
        });
        obj.or = [
          {
            tenantLabels: valueArr,
          },
        ];

        questData.push(obj);
        break;
      case 'experience':
        if (item['value'].gte && item['value'].lte) {
          valueArr.push({
            experienceYears: {
              gte: item['value'].gte * 1,
              lte: item['value'].lte * 1,
            },
          });
        } else if (item['value'].gte) {
          valueArr.push({
            experienceYears: {
              gte: item['value'].gte * 1,
            },
          });
        } else if (item['value'].lte) {
          valueArr.push({
            experienceYears: {
              lte: item['value'].lte * 1,
            },
          });
        }
        obj.and = valueArr;
        questData.push(obj);
        break;
      case 'currentJobTitle':
        valueArr.push({
          searchMode: 'CURRENT',
          title: item.value,
        });
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;
      case 'currentCompany':
        valueArr.push({
          companyName: item['value'],
          searchMode: 'CURRENT',
        });
        obj = {
          [item.andOr]: valueArr,
        };
        questData.push(obj);
        break;
      case 'skills':
        keys = item['andOr'];
        item['value'].forEach((item) => {
          valueArr.push({
            skill: item.skillName,
          });
        });
        questData.push({
          [keys]: valueArr,
        });
        break;
      case 'degrees':
        item['value'].forEach((items, index) => {
          if (index == 0 && item['value']['length'] != 1) {
            valueArr.push('@@' + items.id);
          } else if (index == item['value']['length'] - 1 && index != 0) {
            valueArr.push(items.id + '##');
          } else if (item['value']['length'] == 1) {
            valueArr.push('@@' + items.id + '##');
          } else {
            valueArr.push(items.id + '');
          }
        });

        obj.or = [
          {
            degrees: valueArr,
          },
        ];
        questData.push(obj);
        break;
      case 'preferredSalary':
        let unitMoney2 = transfromMoney[item['value']['time'][0]];
        if (item['value']['money']['min'] && item['value']['money']['max']) {
          obj.and = [
            {
              annualSalary: {
                gte: item['value']['money']['min'] * 1 * unitMoney2,
                lte: item['value']['money']['max'] * 1 * unitMoney2,
              },
              currency: item['value']['currency'],
              searchMode: 'PREFERRED',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }
        if (item['value']['money']['min'] && !item['value']['money']['max']) {
          obj.and = [
            {
              annualSalary: {
                gte: item['value']['money']['min'] * 1 * unitMoney2,
              },
              currency: item['value']['currency'],
              searchMode: 'PREFERRED',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }
        if (!item['value']['money']['min'] && item['value']['money']['max']) {
          obj.and = [
            {
              annualSalary: {
                lte: item['value']['money']['max'] * 1 * unitMoney2,
              },
              currency: item['value']['currency'],
              searchMode: 'PREFERRED',
              // minimumOverlapRatio: 0.1,
              // scalingFactor: 10000
            },
          ];
        }
        questData.push(obj);
        break;
      case 'preferredLocation':
        item['value'].forEach((item) => {
          if (typeof item == 'object') {
            valueArr.push({
              city: item.city,
              country: item.country,
              province: item.province,
              searchMode: 'PREFERRED',
            });
          } else {
            valueArr.push({
              location: item,
              searchMode: 'PREFERRED',
            });
          }
        });
        obj.or = valueArr;
        questData.push(obj);
        break;
      case 'dateOfCreation':
        let time = {};
        if (item['value'].from)
          time.gte = moment(item['value'].from).format('YYYY-MM-DD');
        if (item['value'].to)
          time.lte = moment(item['value'].to).format('YYYY-MM-DD');
        questData.push({
          and: [
            {
              createdDate: time,
            },
          ],
        });
        break;
      case 'candidateId':
        valueArr.push({
          _id: item.value,
        });
        obj.or = valueArr;
        questData.push(obj);
        break;
      case 'School':
        item.value &&
          item.value.forEach((item) => {
            let box = { collegeName: '' };
            box.collegeName = item;
            res.push(box);
          });
        obj = {
          [item.andOr]: res,
        };
        questData.push(obj);
        break;
      case 'major':
        item.value &&
          item.value.forEach((item) => {
            let box = { major: '', searchMode: 'ALL' };
            box.major = item;
            res.push(box);
          });
        obj = {
          [item.andOr]: res,
        };
        questData.push(obj);
        break;
      case 'am':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              AM: valueArr,
            },
          },
        ];
        questData.push(obj);
        break;
      case 'dm':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              DM: valueArr,
            },
          },
        ];
        questData.push(obj);
        break;
      case 'owner':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });
        obj.or = [
          {
            assignedUsers: {
              OWNER: valueArr,
            },
          },
        ];
        questData.push(obj);
        break;
      case 'recruiter':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              RECRUITER: valueArr,
            },
          },
        ];
        questData.push(obj);
        break;

      case 'createBy':
        item['value'].forEach((items, index) => {
          valueArr.push(JSON.stringify(items.id));
        });

        obj.or = [
          {
            assignedUsers: {
              CREATED_BY: valueArr,
            },
          },
        ];
        questData.push(obj);
        break;

      case 'Company':
        if (item['value']['companyValue'] === 'Current') {
          obj.and = [
            {
              companyName: item['value']['values'],
              searchMode: 'CURRENT',
            },
          ];
        } else {
          obj.and = [
            {
              companyName: item['value']['values'],
              searchMode: 'CURRENT_AND_PAST',
            },
          ];
        }
        questData.push(obj);

        break;

      default:
        break;
    }
  });
  return {
    [key]: questData,
  };
};

// candidate高级搜索条件展示
export const CandidateShowAdvincedFilter = (data) => {
  let language = store.getState().controller.language;
  let arr = [],
    questData = [],
    strBox = [],
    strShow = '';
  let obj = {};
  let key = Object.keys(data)[0];
  data[Object.keys(data)[0]].forEach((item) => {
    let str = '';
    let obj = {},
      valueArr = [],
      keys = null;
    switch (item['value1']) {
      case 'name':
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
            } else {
              str += '"' + items + '"' + 'or';
            }
          } else {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"';
            } else {
              str += '"' + items + '"';
            }
          }
          obj = {
            value: item['value'],
            label: str,
          };
        });
        break;
      case 'email':
      case 'phone':
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
            } else {
              str += '"' + items + '"' + 'or';
            }
          } else {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"';
            } else {
              str += '"' + items + '"';
            }
          }
          obj = {
            value: item['value'],
            label: str,
          };
        });
        break;
      case 'industries':
        // 默认or
        let arrs = [],
          resultArr = [];
        JSON.parse(JSON.stringify(item['values'])).forEach((items) => {
          if (items.children) {
            items.children.forEach((ite) => {
              resultArr.push(ite);
            });
          } else {
            resultArr.push(items);
          }
        });
        item['value'].forEach((items) => {
          // if (items.id == ar)
          resultArr.forEach((ite) => {
            if (ite.id == items) {
              arrs.push(ite);
            }
          });
        });

        arrs.forEach((items, index) => {
          if (arrs.length > 1 && arrs.length - 1 != index) {
            str += '"' + (language ? items.label : items.labelCn) + '"or';
          } else {
            str += '"' + (language ? items.label : items.labelCn) + '"';
          }
        });
        obj = {
          value: arrs,
          label: str,
          andOr: item['andOr'],
        };

        break;
      case 'currentLocation':
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
            } else {
              str += '"' + items + '"' + 'or';
            }
          } else {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"';
            } else {
              str += '"' + items + '"';
            }
          }
          obj = {
            value: item['value'],
            label: str,
          };
        });
        break;
      case 'languages':
        item['value'][0].forEach((items, index) => {
          if (
            item['value'][0].length > 1 &&
            item['value'][0].length - 1 != index
          ) {
            str +=
              '"' +
              (language ? items.label : items.labelCn) +
              '" ' +
              item['andOr'];
          } else {
            str += '"' + (language ? items.label : items.labelCn) + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
          andOr: item['andOr'],
        };
        break;
      case 'currentSalary':
      case 'preferredSalary':
        currencyOptions.forEach((items) => {
          if (items.value === item['value']['currency'])
            str += items.label2 + '.';
        });
        payRateUnitTypes.forEach((items) => {
          if (items.value === item['value']['time']) str += items.label + '.';
        });

        if (item['value']['money']['min'] === item['value']['money']['max']) {
          str += '"' + item['value']['money']['max'] + '"';
        } else {
          if (item['value']['money']['min'] && item['value']['money']['max']) {
            str +=
              item['value']['money']['min'] +
              ' - ' +
              item['value']['money']['max'];
          }
          if (!item['value']['money']['min'] && item['value']['money']['max']) {
            str += '"' + 'min' + ' - ' + item['value']['money']['max'] + '"';
          }
          if (item['value']['money']['min'] && !item['value']['money']['max']) {
            str += '"' + item['value']['money']['min'] + ' - ' + 'max' + '"';
          }
        }

        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'workAuthorization':
      case 'jobFunctions':
        // 默认or
        let arrs1 = [],
          resultArr1 = [];
        JSON.parse(JSON.stringify(item['values'])).forEach((items) => {
          if (items.children) {
            items.children.forEach((ite) => {
              if (ite.children) {
                ite.children.forEach((val) => {
                  resultArr1.push(val);
                });
              } else {
                resultArr1.push(ite);
              }
            });
          } else {
            resultArr1.push(items);
          }
        });
        item['value'].forEach((items) => {
          // if (items.id == ar)
          resultArr1.forEach((ite) => {
            if (ite.id == items) {
              arrs1.push(ite);
            }
          });
        });

        arrs1.forEach((items, index) => {
          if (arrs1.length > 1 && arrs1.length - 1 != index) {
            str += '"' + (language ? items.label : items.labelCn) + '"or';
          } else {
            str += '"' + (language ? items.label : items.labelCn) + '"';
          }
        });
        obj = {
          value: arrs1,
          label: str,
          andOr: item['andOr'],
        };

        break;
      case 'experience':
        if (item['value']['gte'] && item['value']['lte']) {
          str += item['value']['gte'] + ' - ' + item['value']['lte'];
        } else if (item['value']['gte']) {
          str += '"' + item['value']['gte'] + ' - ' + 'max' + '"';
        } else if (item['value']['lte']) {
          str += '"' + 'min' + ' - ' + item['value']['lte'] + '"';
        }
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'currentJobTitle':
        obj = {
          value: item['value'],
          label: '"' + item['value'] + '"',
        };
        break;
      case 'currentCompany':
        // if (item['value'].length == 0) break;
        // if (item['value']) {
        //   obj = {
        //     label: '"' + item['value'][0]['label'] + '"',
        //     value: item['value'][0],
        //   };
        // }
        obj = {
          value: item['value'],
          label: '"' + item['value'] + '"',
        };
        break;

      case 'skills':
        if (item['value'].length == 0) return;
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            str += '"' + items.skillName + '"' + item['andOr'];
          } else {
            str += '"' + items.skillName + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
          andOr: item['andOr'],
        };
        break;
      case 'degrees':
        item['value'].forEach((items, index) => {
          if (item['value'].length - 1 != index) {
            str += '"' + items.label + '" or';
          } else {
            str += '"' + items.label + '"';
          }
        });
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'candidateId':
        obj = {
          value: item['value'],
          label: '"' + item['value'] + '"',
        };
        break;
      case 'preferredLocation':
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
            } else {
              str += '"' + items + '"' + 'or';
            }
          } else {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"';
            } else {
              str += '"' + items + '"';
            }
          }
          obj = {
            value: item['value'],
            label: str,
          };
        });
      case 'dateOfCreation':
        item['value'].from &&
          (str += '"' + moment(item['value'].from).format('YYYY-MM-DD') + '"');
        if (item['value'].from && item['value'].to) str += ' to ';
        item['value'].to &&
          (str += '"' + moment(item['value'].to).format('YYYY-MM-DD') + '"');
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'School':
      case 'major':
        item['value'].forEach((items, index) => {
          if (item['value'].length > 1 && item['value'].length - 1 != index) {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
            } else {
              str += '"' + items + '"' + 'or';
            }
          } else {
            if (typeof items == 'object') {
              str += '"' + items.show.replace(/,/g, '-') + '"';
            } else {
              str += '"' + items + '"';
            }
          }
          obj = {
            value: item['value'],
            label: str,
          };
        });
        break;
      case 'am':
      case 'dm':
      case 'createBy':
      case 'recruiter':
      case 'owner':
        item['value'].forEach((items, index) => {
          if (isChinese(items.firstName)) {
            if (item['value'].length - 1 != index) {
              str += '"' + items.lastName + ' ' + items.firstName + '" or';
            } else {
              str += '"' + items.lastName + ' ' + items.firstName + '"';
            }
          } else {
            if (item['value'].length - 1 != index) {
              str += '"' + items.firstName + ' ' + items.lastName + '" or';
            } else {
              str += '"' + items.firstName + ' ' + items.lastName + '"';
            }
          }
        });
        obj = {
          value: item['value'],
          label: str,
        };
        break;
      case 'Company':
        obj = {
          value: item['value'],
          label: '"' + item['value']['values'] + '"',
        };
        break;
      default:
        break;
    }
    candidateColumns.forEach((items) => {
      if (items.field == item['value1']) {
        obj.colName = items.colName;
        obj.name = items.field;
        obj.field = items.field;
      }
    });
    strShow += obj.colName + ': ' + obj.label + ',';
    arr.push(obj);
    strBox.push(strShow);
  });
  return strShow;
};

// commonPool基础展示
export const commonPoolFilterSearch = (data) => {
  let arr = [],
    strBox = [],
    strShow = '';
  // 搜索条件展示
  Object.keys(data).forEach((item) => {
    let language = store.getState().controller.language;
    let str = '';
    let obj = {};
    if (!!data[item]) {
      if (Array.isArray(data[item]) && data[item].length == 0) return;
      if (item == 'languages' && data[item][1].length == 0) return;
      // if (item == 'currentSalary') return
      switch (item) {
        case 'name':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'email':
        case 'phone':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'industries':
          // 默认or
          let arrs = [],
            resultArr = [];
          data[item]['option'].forEach((items) => {
            if (items.children) {
              items.children.forEach((ite) => {
                resultArr.push(ite);
              });
            } else {
              resultArr.push(items);
            }
          });
          data[item]['value'].forEach((items) => {
            // if (items.id == ar)
            resultArr.forEach((ite) => {
              if (ite.id == items) {
                arrs.push(ite);
              }
            });
          });

          arrs.forEach((items, index) => {
            if (arrs.length > 1 && arrs.length - 1 != index) {
              str += '"' + (language ? items.label : items.labelCn) + '"or';
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item]['value'],
            label: str,
            andOr: 'or',
          };

          break;
        case 'currentLocation':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'languages':
          data[item][1].forEach((items, index) => {
            if (data[item][1].length > 1 && data[item][1].length - 1 != index) {
              str +=
                '"' +
                (language ? items.label : items.labelCn) +
                '" ' +
                data[item][0];
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item][1],
            label: str,
            andOr: data[item][0],
          };
          break;
        case 'currentSalary':
        case 'preferredSalary':
          currencyOptions.forEach((items) => {
            if (items.value === data[item]['currency'])
              str += items.label2 + '.';
          });
          payRateUnitTypes.forEach((items) => {
            if (items.value === data[item]['time']) str += items.label + '.';
          });

          if (data[item]['open']) {
            if (data[item]['money']['min'] === data[item]['money']['max']) {
              str += '"' + data[item]['money']['max'] + '"';
            } else {
              if (data[item]['money']['min'] && data[item]['money']['max']) {
                str +=
                  '"' +
                  data[item]['money']['min'] +
                  ' - ' +
                  data[item]['money']['max'] +
                  '"';
              }
              if (data[item]['money']['min'] && !data[item]['money']['max']) {
                str += '"' + data[item]['money']['min'] + ' - ' + 'max' + '"';
              }
              if (!data[item]['money']['min'] && data[item]['money']['max']) {
                str += '"' + 'min' + ' - ' + data[item]['money']['max'] + '"';
              }
            }
          } else {
            if (data[item]['money']['number']) {
              str += '"' + data[item]['money']['number'] + '"';
            }
          }

          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'workAuthorization':
        case 'jobFunctions':
          // 默认or
          let arrs1 = [],
            resultArr1 = [];
          data[item]['option'].forEach((items) => {
            if (items.children) {
              items.children.forEach((ite) => {
                if (ite.children) {
                  ite.children.forEach((val) => {
                    resultArr1.push(val);
                  });
                } else {
                  resultArr1.push(ite);
                }
              });
            } else {
              resultArr1.push(items);
            }
          });
          data[item]['value'].forEach((items) => {
            // if (items.id == ar)
            resultArr1.forEach((ite) => {
              if (ite.id == items) {
                arrs1.push(ite);
              }
            });
          });

          arrs1.forEach((items, index) => {
            if (arrs1.length > 1 && arrs1.length - 1 != index) {
              str += '"' + (language ? items.label : items.labelCn) + '"or';
            } else {
              str += '"' + (language ? items.label : items.labelCn) + '"';
            }
          });
          obj = {
            value: data[item]['value'],
            label: str,
            andOr: 'or',
          };

          break;
        case 'experience':
          if (data[item].open == true) {
            str += '"' + 'min' + '" - "' + data[item].lte + '"';
          } else {
            if (data[item].gte && data[item].lte) {
              str = '"' + data[item].gte + '" - "' + data[item].lte + '"';
            } else if (!data[item].gte && data[item].lte) {
              str = '"' + 'min' + '" - "' + data[item].lte + '"';
            } else if (data[item].gte && !data[item].lte) {
              str = '"' + data[item].gte + '" - "' + 'max' + '"';
            }
          }
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'currentJobTitle':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'currentCompany':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'skills':
          if (data[item][1].length == 0) return;
          data[item][1].forEach((items, index) => {
            if (data[item][1].length > 1 && data[item][1].length - 1 != index) {
              str += '"' + items.skillName + '"' + data[item][0];
            } else {
              str += '"' + items.skillName + '"';
            }
          });
          obj = {
            value: data[item][1],
            label: str,
            andOr: data[item][0],
          };
          break;
        case 'degrees':
          data[item].forEach((items, index) => {
            if (data[item].length - 1 != index) {
              str += '"' + items.label + '" or';
            } else {
              str += '"' + items.label + '"';
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'candidateId':
          obj = {
            value: data[item],
            label: '"' + data[item] + '"',
          };
          break;
        case 'preferredLocation':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
        case 'dateOfCreation':
          data[item].from &&
            (str += '"' + moment(data[item].from).format('YYYY-MM-DD') + '"');
          if (data[item].from && data[item].to) str += ' to ';
          data[item].to &&
            (str += '"' + moment(data[item].to).format('YYYY-MM-DD') + '"');
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'School':
        case 'major':
          data[item].forEach((items, index) => {
            if (data[item].length > 1 && data[item].length - 1 != index) {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"' + 'or';
              } else {
                str += '"' + items + '"' + 'or';
              }
            } else {
              if (typeof items == 'object') {
                str += '"' + items.show.replace(/,/g, '-') + '"';
              } else {
                str += '"' + items + '"';
              }
            }
            obj = {
              value: data[item],
              label: str,
            };
          });
          break;
        case 'am':
        case 'dm':
        case 'createBy':
        case 'recruiter':
        case 'owner':
          data[item].forEach((items, index) => {
            if (isChinese(items.firstName)) {
              if (data[item].length - 1 != index) {
                str += '"' + items.lastName + ' ' + items.firstName + '" or';
              } else {
                str += '"' + items.lastName + ' ' + items.firstName + '"';
              }
            } else {
              if (data[item].length - 1 != index) {
                str += '"' + items.firstName + ' ' + items.lastName + '" or';
              } else {
                str += '"' + items.firstName + ' ' + items.lastName + '"';
              }
            }
          });
          obj = {
            value: data[item],
            label: str,
          };
          break;
        case 'Company':
          obj = {
            value: data[item],
            label: '"' + data[item][1] + '"',
          };
          break;
        default:
          break;
      }

      commonPoolColumns.forEach((items) => {
        if (items.field == item) {
          obj.colName = items.colName;
          obj.name = items.field;
          obj.field = items.field;
        }
      });
      strShow += obj.colName + ': ' + obj.label + ',';
      strBox.push(strShow);
      arr.push(obj);
      console.log(arr);
    }
  });
  return {
    arr,
    strShow,
    strBox,
  };
};

export const commonPoolColumns = [
  {
    colName: 'Name',
    colWidth: 200,
    flexGrow: 3,
    col: 'name',
    fixed: true,
    sortable: true,
    type: 'name',
    field: 'name',
    placeholder: 'Enter a Name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Industries',
    colWidth: 200,
    flexGrow: 3,
    col: 'industries',
    fixed: true,
    sortable: true,
    type: 'treeSelect',
    field: 'industries',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Job Function',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'jobFunctionTree',
    field: 'jobFunctions',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Current Location',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'currentLocation',
    placeholder: 'Enter a city/state/country name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'languages',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'languages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Current Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'currentSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Experience',
    colWidth: 200,
    flexGrow: 3,
    col: 'experience',
    fixed: true,
    sortable: true,
    type: 'experience',
    field: 'experience',
    andOr: 'na',
    changeAndOr: false,
  },
  {
    colName: 'Current Job Title',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentJobTitle',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'currentJobTitle',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a job title',
  },
  {
    colName: 'Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'Company',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'Company',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'skills',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'skills',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'School',
    colWidth: 200,
    flexGrow: 3,
    col: 'School',
    fixed: true,
    sortable: true,
    type: 'schoolInput',
    field: 'School',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a school name',
  },
  {
    colName: 'Major',
    colWidth: 200,
    flexGrow: 3,
    col: 'major',
    fixed: true,
    sortable: true,
    type: 'majorInput',
    field: 'major',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a major name',
  },
  {
    colName: 'Degrees',
    colWidth: 200,
    flexGrow: 3,
    col: 'degrees',
    fixed: true,
    sortable: true,
    type: 'selects1',
    field: 'degrees',
    andOr: 'or',
    changeAndOr: false,
  },
];

export const candidateColumns = [
  {
    colName: 'Name',
    colWidth: 200,
    flexGrow: 3,
    col: 'name',
    fixed: true,
    sortable: true,
    type: 'name',
    field: 'name',
    placeholder: 'Enter a Name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Email',
    colWidth: 200,
    flexGrow: 3,
    col: 'email',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'email',
    placeholder: 'Enter a email',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Phone',
    colWidth: 200,
    flexGrow: 3,
    col: 'phone',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'phone',
    placeholder: 'Enter a phone number',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Industries',
    colWidth: 200,
    flexGrow: 3,
    col: 'industries',
    fixed: true,
    sortable: true,
    type: 'treeSelect',
    field: 'industries',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Job Function',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'jobFunctionTree',
    field: 'jobFunctions',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Current Location',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'currentLocation',
    placeholder: 'Enter a city/state/country name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'languages',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'languages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Current Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'currentSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Work Authorization',
    colWidth: 200,
    flexGrow: 3,
    col: 'workAuthorization',
    fixed: true,
    sortable: true,
    type: 'workAuth',
    field: 'workAuthorization',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Experience',
    colWidth: 200,
    flexGrow: 3,
    col: 'experience',
    fixed: true,
    sortable: true,
    type: 'experience',
    field: 'experience',
    andOr: 'na',
    changeAndOr: false,
  },
  {
    colName: 'Current Job Title',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentJobTitle',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'currentJobTitle',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a job title',
  },
  {
    colName: 'Current Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentCompany',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'currentCompany',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'skills',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'skills',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Preferred Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'preferredSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'preferredSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Preferred Locations',
    colWidth: 200,
    flexGrow: 3,
    col: 'preferredLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'preferredLocation',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a city/state/country name',
  },
  {
    colName: 'School',
    colWidth: 200,
    flexGrow: 3,
    col: 'School',
    fixed: true,
    sortable: true,
    type: 'schoolInput',
    field: 'School',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a school name',
  },
  {
    colName: 'Major',
    colWidth: 200,
    flexGrow: 3,
    col: 'major',
    fixed: true,
    sortable: true,
    type: 'majorInput',
    field: 'major',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a major name',
  },
  {
    colName: 'Degrees',
    colWidth: 200,
    flexGrow: 3,
    col: 'degrees',
    fixed: true,
    sortable: true,
    type: 'selects1',
    field: 'degrees',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Create by',
    colWidth: 200,
    flexGrow: 3,
    col: 'createBy',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'createBy',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Recruiter',
    colWidth: 200,
    flexGrow: 3,
    col: 'recruiter',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'recruiter',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Candidate ID',
    colWidth: 200,
    flexGrow: 3,
    col: 'candidateId',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'candidateId',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a candidate ID',
  },
  {
    colName: 'Date of Creation',
    colWidth: 200,
    flexGrow: 3,
    col: 'dateOfCreation',
    fixed: true,
    sortable: true,
    type: 'time',
    field: 'dateOfCreation',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Owner',
    colWidth: 200,
    flexGrow: 3,
    col: 'owner',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'owner',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'DM',
    colWidth: 200,
    flexGrow: 3,
    col: 'dm',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'dm',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'AM',
    colWidth: 200,
    flexGrow: 3,
    col: 'am',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'am',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'Company',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'Company',
    andOr: 'and',
    changeAndOr: false,
  },
];
