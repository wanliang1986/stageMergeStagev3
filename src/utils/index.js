/**
 * Created by chenghui on 5/26/17.
 */
import moment from 'moment-timezone';
import Immutable from 'immutable';
import validator from 'validator';
import 'moment/locale/zh-cn';
import {
  CONTACT_TYPES,
  resumeSourceTypes,
  USER_TYPES,
  currency as currencyOptions,
} from '../app/constants/formOptions';
import dateFns from 'date-fns';
import memoizeOne from 'memoize-one';

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const rateUnitTypeLabels = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'week',
  DAILY: 'day',
  HOURLY: 'hour',
};

window.moment = moment;

const timezoneOffset = new Date().getTimezoneOffset();
if (timezoneOffset === 480) {
  moment.tz.setDefault('America/Los_Angeles');
} else if (timezoneOffset === -480) {
  moment.tz.setDefault('Asia/Shanghai');
}
moment.updateLocale('en', { invalidDate: 'N/A' });
moment.updateLocale('zh-cn', { invalidDate: 'N/A' });
const lng = localStorage.i18nextLng;
if (lng && lng.match('zh')) {
  moment.locale('zh-cn');
} else {
  moment.locale('en');
}

console.log(moment.locale());

export function customEncodeURIComponent(str) {
  return encodeURIComponent(str)
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/-/g, '%2D')
    .replace(/\./g, '%2E')
    .replace(/_/g, '%5F')
    .replace(/~/g, '%7E')
    .replace(/'/g, '%27');
}

export function getPeriod(period) {
  switch (period) {
    case 'lastHour':
      return {
        from: moment().subtract(1, 'hours').valueOf(),
        to: moment().valueOf(),
      };
    case 'last24Hours':
      return {
        from: moment().subtract(1, 'days').valueOf(),
        to: moment().valueOf(),
      };
    case 'last7Days':
      return {
        from: moment().startOf('day').subtract(7, 'days').valueOf(),
        to: moment().valueOf(),
      };
    case 'last30Days':
      return {
        from: moment().startOf('day').subtract(30, 'days').valueOf(),
        to: moment().valueOf(),
      };
    case 'last90Days':
      return {
        from: moment().startOf('day').subtract(90, 'days').valueOf(),
        to: moment().valueOf(),
      };
    case 'thisWeek':
      return {
        from: moment().startOf('week').valueOf(),
        to: moment().valueOf(),
      };
    case 'lastWeek':
      return {
        from: moment().startOf('week').subtract(1, 'weeks').valueOf(),
        to: moment().endOf('week').subtract(1, 'weeks').valueOf(),
      };
    case 'last2Weeks':
      return {
        from: moment().startOf('week').subtract(1, 'weeks').valueOf(),
        to: moment().valueOf(),
      };
    case 'thisMonth':
      return {
        from: moment().startOf('month').valueOf(),
        to: moment().valueOf(),
      };
    case 'lastMonth':
      return {
        from: moment().startOf('month').subtract(1, 'months').valueOf(),
        to: moment().endOf('month').subtract(1, 'months').valueOf(),
      };
    case 'last3Months':
      return {
        from: moment().startOf('month').subtract(2, 'months').valueOf(),
        to: moment().valueOf(),
      };
    case 'thisYear':
      return {
        from: moment().startOf('year').valueOf(),

        to: moment().valueOf(),
      };
    default:
      return {};
  }
}

export const validateDate = (a) => {
  return a.isAfter(moment().startOf('day').add(1, 'd').hours(12));
};

export const yearOptionsGenerator = (shift) => {
  if (!Number.isInteger(shift)) {
    shift = 0;
  }
  let yearOptions = [];
  let date = new Date();
  const currentYear = date.getFullYear() + shift;
  for (let i = 0; i < 60; i++) {
    yearOptions.push({
      value: currentYear - i,
      label: (currentYear - i).toString(),
    });
  }
  return yearOptions;
};

export const monthOptionsGenerator = () => {
  let monthOptions = [];
  for (let i = 1; i <= 12; i++) {
    monthOptions.push({ value: i, label: i.toString() });
  }
  return monthOptions;
};

export const formDateFromYearAndMonth = (year, month) => {
  console.log(year, month);
  if (!year) {
    return null;
  }
  return moment(year + '-' + (month ? month + '-1' : '1-2'), 'YYYY-M-D').format(
    'YYYY-MM-DD'
  );
};

export const getYearAndMonthFromDate = (date) => {
  const year = date && moment(date).year();
  const month =
    date && moment(date).date() === 1 ? moment(date).month() + 1 : null;
  return {
    year,
    month,
  };
};

export const dateFormat = (date) => {
  return moment(date).format('L');
};

export const dateFormat2 = (date) => {
  return moment(date).format('lll');
};

export const jobDateTimeFormat = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm');
};

export const jobDateFormat = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const dateFormatForRange = (date) => {
  return moment(date).format('MM/DD HH:mm');
};

export const componiesDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const formatBy = (date, by) => {
  if (date && by) {
    return moment(date).format('L HH:mm z') + ' By ' + by;
  } else {
    return '';
  }
};

export const formatBy2 = (date, by) => {
  if (date && by) {
    return moment(date).format('l') + ' By ' + by;
  } else {
    return '';
  }
};

export const formatMonthYear = (date) => {
  if (date) {
    const mdate = moment(date);
    if (mdate.date() === 1) {
      const formation = moment.locale() === 'zh-cn' ? 'YYYY年MMM' : 'MMM YYYY';
      return mdate.format(formation);
    } else {
      const formation = moment.locale() === 'zh-cn' ? 'YYYY年' : 'YYYY';
      return mdate.format(formation);
    }
  } else {
    return '';
  }
};

export const dateFromNow = (date) => {
  const a = moment(date);
  const b = moment();
  return date ? b.diff(a, 'days') : 'N/A';
};

export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => (hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)),
      (error) => (hasCanceled_ ? reject({ isCanceled: true }) : reject(error))
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

export const externalUrl = (url, secure) => {
  if (!url) {
    return '#';
  }
  url = url.trim();
  if (!/^(https?:)?\/\//i.test(url)) {
    url = 'http://' + url; //
  }
  if (secure) {
    url = url.replace(/^https?/, 'https');
  }
  return url;
};

export const filterList2 = (dataList, filters) => {
  const indexList = dataList.reduce((indexList, data, index) => {
    let isMatch = true;
    if (
      data &&
      (data.get('id') || data.get('userId') || data.get('candidateId'))
    ) {
      filters.forEach((value, key) => {
        isMatch = _filterForAdvancedSearch(data, value, key);
        return isMatch;
      });
    }
    return isMatch ? indexList.push(index) : indexList;
  }, Immutable.List());
  return {
    indexList,
  };
};

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const applicationStatusDesc = {
  'Submitted to AM': 1,
  // Qualified: 2,
  // Internal_Rejected: 3,
  // Called_Candidate: 4,
  // Meet_Candidate_In_Person: 5,
  'Submitted to Client': 6,
  'Shortlisted by Client': 7,
  'Rejected by Client': 8,
  Interview: 9,

  'Offered by Client': 10,
  'Offer Declined': 11,
  'Offer Accepted': 12,
  'On Boarded': 13,
  // Candidate_Quit: 14
};

export const sortList = (indexList, dataList, columnKey, sortDir, extraKey) => {
  let newList = indexList.sort((indexA, indexB) => {
    let valueA = dataList.getIn([indexA, columnKey]);
    let valueB = dataList.getIn([indexB, columnKey]);
    if (columnKey === 'revenue' || columnKey === 'totalBillAmount') {
      if (valueA === NaN || valueA === null || valueA === 0) {
        valueA = 0;
      } else {
        let valueAList = valueA.substring(1).split(',');
        let valueAStr = valueAList.reduce((total, item) => {
          return total + item;
        });
        valueA = Number(valueAStr);
      }
      if (valueB === NaN || valueB === null || valueB === 0) {
        valueB = 0;
      } else {
        let valueBList = valueB.substring(1).split(',');
        let valueBStr = valueBList.reduce((total, item) => {
          return total + item;
        });
        valueB = Number(valueBStr);
      }
    }
    // console.log(valueA, valueB);
    if (columnKey === 'latestActivityStatusDesc') {
      valueA = applicationStatusDesc[valueA] || 0;
      valueB = applicationStatusDesc[valueB] || 0;
    } else if (typeof valueA !== 'number') {
      valueA = (
        valueA ||
        (typeof valueA === 'boolean'
          ? valueA
          : sortDir === SortTypes.ASC
          ? 'zzz'
          : '')
      )
        .toString()
        .toLowerCase();
      valueB = (
        valueB ||
        (typeof valueB === 'boolean'
          ? valueB
          : sortDir === SortTypes.ASC
          ? 'zzz'
          : '')
      )
        .toString()
        .toLowerCase();
    }
    let sortVal = 0;
    if (valueA > valueB) {
      sortVal = 1;
    }
    if (valueA < valueB) {
      sortVal = -1;
    }
    if (columnKey === 'id') {
      sortVal = valueA - valueB;
    }
    if (
      columnKey === 'talentName' ||
      columnKey === 'company' ||
      columnKey === 'name'
    ) {
      sortVal = valueA.localeCompare(valueB, 'zh-CN');
    }
    if (sortVal !== 0 && sortDir !== SortTypes.ASC) {
      sortVal = sortVal * -1;
    }
    // console.log(valueA, valueB, sortVal);

    return sortVal;
  });
  if (extraKey) {
    newList = newList.sortBy((v) => -dataList.getIn([v, extraKey]));
  }
  return newList;
};

export const getIndexList = (
  source,
  filters = Immutable.Map(),
  colSortDirs = {},
  extraKey
) => {
  let indexList = filterList2(source, filters).indexList;
  let columnKey = Object.keys(colSortDirs)[0];
  if (columnKey) {
    let sortDir = colSortDirs[columnKey];
    indexList = sortList(indexList, source, columnKey, sortDir, extraKey);
  }
  return indexList;
};

function _filterForAdvancedSearch(data, filterOption, key) {
  let query;
  switch (key) {
    case 'billRate':
      return (
        !!(data.get('billRateFrom') || data.get('billRateTo')) &&
        data.get('billRateFrom') < filterOption.get('max') &&
        data.get('billRateTo') > filterOption.get('min')
      );
    case 'expectedSalary':
      return (
        !!data.get('expectedSalary') &&
        data.get('expectedSalary') < filterOption.get('max') &&
        data.get('expectedSalary') > filterOption.get('min')
      );
    case 'date':
      return (
        (!filterOption.get('min') ||
          moment(filterOption.get('min')).isBefore(data.get('postingTime'))) &&
        (!filterOption.get('max') ||
          moment(data.get('postingTime')).isBefore(filterOption.get('max')))
      );

    case 'date2':
      return (
        (!filterOption.get('min') ||
          moment(filterOption.get('min')).isBefore(data.get('createdAt'))) &&
        (!filterOption.get('max') ||
          moment(data.get('createdAt')).isBefore(filterOption.get('max')))
      );
    // case 'jobType':
    // case 'priority':
    // case 'expLevel':
    //     return filterOption.map(option => option.value).includes(data.get(key));
    case 'skills':
      query = '(?=.*' + filterOption.toArray().join(')(?=.*') + ')'; //and
      return new RegExp(query, 'i').test(data.get(key));
    case 'divisionId':
      return !filterOption || data.get(key) === filterOption;

    case 'chinese':
      console.log('chinese', data.get(key), filterOption);
      return !filterOption || data.get(key) === filterOption;

    case 'progress':
      if (data.get('saleLead')) {
        let type = data.get('saleLead').some((item, index) => {
          return item.get('accountProgress') * 100 + '%' === filterOption;
        });
        if (type) {
          return data;
        }
      }
      break;

    case 'salesLeadOwner':
      if (data.get('saleLead')) {
        let ownersType = [];
        data.get('saleLead').forEach((item, index) => {
          let type = item.get('saleLeadOwner').some((val, key) => {
            let fullName = val.get('firstName') + ' ' + val.get('lastName');
            return (
              fullName.toLowerCase().indexOf(filterOption.toLowerCase()) !== -1
            );
          });
          ownersType.push(type);
        });
        let status = ownersType.some((item, index) => {
          return item === true;
        });
        if (status) {
          return data;
        }
      }
      break;

    ////serviceTypes 表格搜索
    case 'companyServiceTypes':
      if (
        typeof filterOption === 'object' &&
        (data.get('salesLeads') || data.get('companyServiceTypes'))
      ) {
        let serviceTypesList = [];
        let selectedServiceTypes = [];
        if (data.get('salesLeads')) {
          data.get('salesLeads').forEach((item, index) => {
            item.get('companyServiceTypes').forEach((val, key) => {
              serviceTypesList.push(val.get('label'));
            });
          });

          filterOption.forEach((item, index) => {
            selectedServiceTypes.push(item.label);
          });
        } else {
          data.get('companyServiceTypes').forEach((item, index) => {
            serviceTypesList.push(item.get('label'));
          });
          filterOption.forEach((item, index) => {
            selectedServiceTypes.push(item.label);
          });
        }

        let msg1 = serviceTypesList.join(',');
        let msg2 = selectedServiceTypes.join(',');
        if (msg1.search(msg2) > -1) {
          return data;
        } else {
          return null;
        }
      } else {
        return null;
      }
    case 'type':
    case 'companyClientLevelType':
      if (data.get(key) === filterOption) {
        return data;
      } else {
        return null;
      }
    case 'score':
      if (parseInt(data.get(key)) == filterOption) {
        return data;
      } else {
        return null;
      }

    default:
      query = new RegExp(filterOption, 'i');
      return query.test(data.get(key));
  }
}

export const isEmail = (email) => {
  if (email) {
    email = email.trim();
  }
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
export const isUrl = (url) => {
  if (url) {
    url = url.trim();
  }
  return validator.isURL(url);
};

export const checkExperienceValidation = (experience) => {
  if (!experience.get('title')) {
    return 0;
  }
  if (experience.get('title').length > 250) {
    return 0;
  }
  if (!experience.get('company') || !experience.get('startDate')) {
    return 1;
  }
  return 2;
};

export const checkEducationValidation = (education) => {
  if (!education.get('collegeName')) {
    return 0;
  }
  if (
    !education.get('majorName') ||
    !education.get('degreeName') ||
    !education.get('startDate')
  ) {
    return 1;
  }
  return 2;
};

export function _getLiepinResId(str) {
  let map = {};
  const kvs = str.split('?')[1].split('&');
  kvs.forEach((value) => {
    const result = value.split('=');
    const k = result[0];
    const v = result[1];
    map[k] = v;
  });
  return map['res_id_encode'];
}

export function _getGithubUsername(str) {
  let username = /github\.com\/([^/]+)/.exec(str);
  if (username) {
    return username[1];
  }
}

export function _getIdentifier(str) {
  let identifier = /\/in\/([^/^?]+)/.exec(str);
  if (identifier) {
    return identifier[1];
  }
}

export const getSize = (size, u) => {
  const unit = ['B', 'K', 'M', 'G', 'T'];
  let next = size / 1024;
  if (next > 1) {
    return getSize(next.toFixed(1), u + 1);
  } else {
    return size + unit[u];
  }
};

export const formatUserName = (user) => {
  if (!user) {
    return '';
  }
  const firstName = user.get('firstName');
  const lastName = user.get('lastName');
  const username = user.get('username');
  return firstName && lastName
    ? formatFullName(firstName.trim(), lastName.trim())
    : username;
};

///////多个AM显示
export const formatMultipleName = (user) => {
  if (!user || user.size === 0) {
    return '';
  }
  let userList = user.toJS();
  let name;
  // console.log(user, userList);
  let userName = userList.map((item, index) => {
    // console.log('item', item);
    if (!item) return '****';
    // if (item.firstName && item.lastName) {
    //   let fullName = formatFullName(
    //     item.firstName.trim(),
    //     item.lastName.trim()
    //   );
    //   name = fullName;
    // } else {
    name = item.fullName;
    // }
    return name;
  });
  return userName.join(',');
};

export const multipleName = (arr) => {
  if (!arr || arr.length === 0) {
    return '';
  }
  let name;
  let userName = arr.map((item, index) => {
    if (item.firstName && item.lastName) {
      let fullName = formatFullName(
        item.firstName.trim(),
        item.lastName.trim()
      );
      name = fullName;
    } else {
      name = item.username;
    }
    return name;
  });
  return userName.join(',');
};

export const getStartSearchParams = ({ filters = {}, sort = {} }, active) => {
  let query = {
    bool: {
      filter: [],
      must: [],
      should: [],
    },
  };

  let sortKey = Object.keys(sort)[0];
  if (sortKey && sortKey !== 'startDate') {
    sort = {
      [sortKey + '.keyword']: sort[sortKey],
    };
  }
  sort = [sort, '_score', { id: 'desc' }];
  Object.keys(filters).forEach((key) => {
    switch (key) {
      case 'talentName':
      case 'company':
      case 'jobTitle':
        query.bool.must.push({
          match: {
            [key]: {
              query: filters[key],
              fuzziness: 'AUTO',
              operator: 'or',
            },
          },
        });
        break;

      default:
        query.bool.must.push({
          regexp: {
            [key]: `${filters[key].toLowerCase()}.*`,
          },
        });
        break;
    }
  });

  if (active) {
    query.bool.filter.push({
      match: {
        status: {
          query: 'ACTIVE',
        },
      },
    });
  }
  return {
    sort,
    query,
  };
};

export const getTalentFromParserOutput = (parserOutput) => {
  const keys = ['firstName', 'lastName', 'interests'];
  let talent = {};
  const preTalent = JSON.parse(parserOutput || '{}');
  console.log('preTalent', preTalent);
  // assign basic Info;
  keys.forEach((key) => (talent[key] = preTalent[key]));
  // assign additional Info
  if (talent.firstName && talent.lastName) {
    talent.fullName = formatFullName(talent.firstName, talent.lastName);
  }
  talent.skills = preTalent.skills || [];
  talent.educations = preTalent.educations || [];
  talent.experiences = preTalent.experiences || [];
  talent.certificates = preTalent.certificates || [];
  talent.contacts = preTalent.contacts
    ? preTalent.contacts
        .map((c) => {
          c.type = c.type.toUpperCase();
          return c;
        })
        .filter((el) => {
          if (el.type === CONTACT_TYPES.LiePin && !el.details) {
            return false;
          } else if (el.type === CONTACT_TYPES.Weibo && !el.details) {
            return false;
          } else return el.contact !== 'in';
        })
    : [];

  if (preTalent.industries) {
    talent.industries = preTalent.industries;
  }
  if (preTalent.jobFunctions) {
    talent.jobFunctions = preTalent.jobFunctions;
  }
  if (preTalent.currentLocation) {
    talent.currentLocation = preTalent.currentLocation;
  }
  if (preTalent.preferredLocations) {
    talent.preferredLocations = preTalent.preferredLocations;
  }
  if (preTalent.preferredSalaryRange) {
    talent.preferredSalaryRange = preTalent.preferredSalaryRange;
  }
  if (preTalent.currency) {
    talent.currency = preTalent.currency;
  }
  if (preTalent.payType) {
    talent.payType = preTalent.payType;
  }
  if (preTalent.projects) {
    talent.projects = preTalent.projects;
  }
  if (preTalent.salaryRange) {
    talent.salaryRange = preTalent.salaryRange;
  }
  if (preTalent.socialNetworks) {
    talent.socialNetworks = preTalent.socialNetworks;
  }
  if (preTalent.languages) {
    talent.languages = preTalent.languages;
  }

  return talent;
};

// //////////////
export const getTalentFromParseResultV2 = (parseResult, sourceType) => {
  let talent;
  console.log('Resume from parseRecord', parseResult);

  talent = getTalentFromParserOutput(parseResult.parserOutput);
  talent.photoUrl = parseResult.photoUrl || '';
  talent.resumes = [
    {
      name: parseResult.name,
      s3Link: parseResult.s3Link,
      text: parseResult.text,
      uuid: parseResult.uuid,
    },
  ];
  parseResult.sourceType = sourceType || resumeSourceTypes[0].value;
  // parseResult.status = 'AVAILABLE';
  console.log('Talent from parseRecord', talent);

  return talent;
};

// /////////////
export const getValidTalentFromParseResult = (parseResult, sourceType) => {
  return Immutable.fromJS(getTalentFromParseResultV2(parseResult, sourceType))
    .update('contacts', (contacts = Immutable.List()) =>
      contacts.filter(
        (contact) =>
          !(
            contact.get('type') === CONTACT_TYPES.LinkedIn &&
            !contact.get('contact')
          )
      )
    )
    .update('experiences', (experiences) =>
      experiences.filter(checkExperienceValidation)
    )
    .update('educations', (educations) =>
      educations.filter(checkEducationValidation)
    )
    .toJS();
};

export const getNewFilters = ({ name, value }, filters) => {
  if ((filters.get(name) || '') === value) {
    return;
  }
  if (!value) {
    return filters.remove(name);
  }
  return filters.set(name, value);
};

export function formatFullName(firstName, lastName) {
  if (lastName[0].match(/[\uAC00-\uD7AF\u4E00-\u9FBF]+/g)) {
    return lastName + firstName;
  }
  return firstName + ' ' + lastName;
}

export const sleep = (timeout) => {
  timeout = timeout || 400;
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeout);
  });
};

export const getRanges = (t) => {
  return [
    {
      label: t('action:thisMonth'),
      value: [dateFns.startOfMonth(new Date()), dateFns.endOfToday()],
    },
    {
      label: t('action:last3Months'),
      value: [
        dateFns.addMonths(dateFns.startOfToday(), -3),
        dateFns.endOfToday(),
      ],
    },
    {
      label: t('action:ytd'),
      value: [dateFns.startOfYear(new Date()), dateFns.endOfToday()],
    },
  ];
};

export const getMemoFromApplication = memoizeOne((application) => {
  return formatBy2(
    application.get('lastModifiedDate'),
    application.get('lastModifiedUser') + '\n' + application.get('memo')
  );
});

export const handleFileDownload = (filename) => (response) => {
  // console.log(response);
  const linkElement = document.createElement('a');
  try {
    const blob = new Blob([response], { type: response.type });
    const url = window.URL.createObjectURL(blob);
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (ex) {
    console.error(ex);
  }
};

export const handleFetchFile = (resumelink) => {
  return fetch(externalUrl(resumelink, true)).then((response) => {
    if (response.ok) {
      return response.blob();
    } else {
      return Promise.reject(response.status);
    }
  });
};
export const isContained = (aa, bb) => {
  if (
    !(aa instanceof Array) ||
    !(bb instanceof Array) ||
    aa.length < bb.length
  ) {
    return false;
  }
  //var aaStr = aa.toString();
  /*for(var i = 0; i < bb.length; i++) {
    if(aaStr.indexOf(bb[i]) < 0) return false;
  }*/
  for (var i = 0; i < bb.length; i++) {
    var flag = false;
    for (var j = 0; j < aa.length; j++) {
      if (aa[j] == bb[i]) {
        flag = true;
        break;
      }
    }
    if (flag == false) {
      return flag;
    }
  }

  return true;
};

export const getNewAMList = (salesLead) => {
  if (salesLead) {
    let list = [];
    salesLead.forEach((item, index) => {
      let accountManager = item.accountManager;

      if (accountManager && accountManager.length > 0) {
        accountManager.forEach((_item, _index) => {
          console.log(_item);
          list.push(_item);
        });
      }
    });
    return list;
  }
};

export const reduceStartCommissions = (startCommissions) => {
  return (startCommissions || []).reduce(
    (res, c) => {
      if (c.userRole === USER_TYPES.AM) {
        res.am.push(c);
      } else if (c.userRole === USER_TYPES.AccountCoordinator) {
        res.ac.push(c);
      } else if (c.userRole === USER_TYPES.DM) {
        res.dm.push(c);
      } else if (c.userRole === USER_TYPES.Recruiter) {
        res.recruiter.push(c);
      } else if (c.userRole === USER_TYPES.Sourcer) {
        res.sourcer.push(c);
      } else if (c.userRole === USER_TYPES.Owner) {
        res.owner.push(c);
      }
      return res;
    },
    {
      am: [],
      ac: [],
      dm: [],
      recruiter: [],
      sourcer: [],
      owner: [],
    }
  );
};

export const export2Doc = (content, filename = '') => {
  try {
    const linkElement = document.createElement('a');

    const preHtml =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    const postHtml = '</body></html>';
    const html = preHtml + content + postHtml;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword',
    });

    const url = window.URL.createObjectURL(blob);
    filename = filename ? filename + '.doc' : 'document.doc';

    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', filename);
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false,
    });
    linkElement.dispatchEvent(clickEvent);
  } catch (e) {
    console.error(e);
  }
};

export const mapOfferLetterParams = ({
  taxBurdenRate,
  mspRate,
  immigrationCost,
}) => {
  let result = { loadingParams: false };
  if (immigrationCost) {
    Object.assign(result, {
      immigrationCostOpts: immigrationCost,
      immigrationCostMaps: immigrationCost.reduce((res, value) => {
        res[value.code] = value;
        return res;
      }, {}),
    });
  }
  if (mspRate) {
    Object.assign(result, {
      mspRateOpts: mspRate,
      mspRateMaps: mspRate.reduce((res, value) => {
        res[value.code] = value;
        return res;
      }, {}),
    });
  }
  if (taxBurdenRate) {
    Object.assign(result, {
      taxBurdenRateOpts: taxBurdenRate,
      taxBurdenRateMaps: taxBurdenRate.reduce((res, value) => {
        res[value.code] = value;
        return res;
      }, {}),
    });
  }

  return result;
};

export const swichRate = (rate, unit) => {
  let hourlyRate = '';
  switch (unit) {
    // 年
    case 'YEARLY':
      hourlyRate = rate / 2080;
      break;
    // 月
    case 'MONTHLY':
      hourlyRate = (rate * 12) / 2080;
      break;
    // 周
    case 'WEEKLY':
      hourlyRate = rate / 40;
      break;
    // 日
    case 'DAILY':
      hourlyRate = rate / 8;
      break;
    // 小时
    default:
      hourlyRate = rate;
  }
  return hourlyRate;
};

export const swichSalary = (salary, unit) => {
  let annualSalary = '';
  switch (unit) {
    // 月
    case 'MONTHLY':
      annualSalary = salary * 12;
      break;
    // 周
    case 'WEEKLY':
      annualSalary = salary * 52; // 2080 /40
      break;
    // 日
    case 'DAILY':
      annualSalary = salary * 260; // 2080 / 8;
      break;

    // 小时
    case 'HOURLY':
      annualSalary = salary * 2080;
      break;
    // 年
    default:
      annualSalary = salary;
  }
  return annualSalary;
};

export const getAgreedPayRateLabel = (agreedPayRate) => {
  if (!agreedPayRate) {
    return '';
  }
  const currency = agreedPayRate.currency;
  const amount = agreedPayRate.agreedPayRate;
  const rateUnitType = agreedPayRate.rateUnitType;
  return `${currencyLabels[currency] || ''} ${
    amount < 0 ? '' : amount || ''
  } per ${rateUnitTypeLabels[rateUnitType]}`;
};
