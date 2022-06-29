import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import {
  candidateSoureChannel,
  currency as currencyOptions,
  payRateUnitTypes,
  CandidateContact,
  CandidateNetWork,
} from '../../../../constants/formOptions';
import { isNum } from '../../../../../utils/search';
import { withStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DeleteIcon from '@material-ui/icons/Delete';

import FormInput from '../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import JobTree from '../../../../components/candidateTree';
import JobCandidateTree from '../../../../components/newCandidateTree';
import Location from '../../../../components/particial/Location';
import WorkAuthTree from '../../../../components/candidateSelectTree';
import ImageEditor from '../../../../components/ImageEditor';
import * as Colors from '../../../../styles/Colors';

const styles = {
  autoBox: {
    '& .MuiFormControl-fullWidth': {
      borderColor: '#cc4b37 !important',
      backgroundColor: '#faedeb !important',
      border: '1px solid #cc4b37 !important',
    },
  },
};

const ContactTypeList = [
  'EMAIL',
  'PHONE',
  'WECHAT',
  'LINKEDIN',
  'FACEBOOK',
  'PERSONAL_WEBSITE',
];

const errorMessages = {
  firstname: {
    1001: 'First Name is required',
    1002: 'First name is not valid',
  },
  lastname: {
    1001: 'Last Name is required',
    1002: 'Last name is not valid',
  },
  fullName: {
    1001: 'message:fullNameIsRequired',
    1002: 'Last name is not valid',
  },
  contact: {
    1001: 'Contacts is required',
    1002: 'message:No more than 10 Phone',
    1003: 'message:No more than 10 Email',
    1004: 'message:The phone format is not correct',
    1005: 'message:The email format is not correct',
    1006: 'message:The Phone has repeated',
    1007: 'message:The email has repeated',
  },
  socialNetwork: {
    1001: 'Social Networks is required',
    1002: 'message:The Wechat format is not correct',
    1003: 'message:The LinkedIn format is not correct',
    1004: 'message:The Facebook format is not correct',
    1005: 'message:The Personal Website format is not correct',
    1006: 'message:The Social Networks has repeated',
  },
  Industries: {
    1001: 'Industries is required',
  },
  jobfunction: {
    1001: 'Job Function is required',
  },
  location: {
    1001: 'Current Location is required',
  },
  languages: {
    1001: 'Languages is required',
  },
  experienceInfor: {
    1001: 'message:Title And Company is required',
    1002: 'message:Duration End Date is required',
    1003: 'message:Duration Start Date is required',
    1004: 'message:Please check if the text exceeds the limit',
  },
  educations: {
    1001: 'message:Please provide at lease one of following fields, Major, Degree, School',
    1002: 'message:Duration End Date is required',
    1003: 'message:Duration End Date is Less than Current Time',
    1004: 'message:Please check if the text exceeds the limit',
  },
  projects: {
    1001: 'message:Please provide at lease one of following fields, projectName, Title, Description',
    1002: 'message:Duration End Date is required',
    1003: 'message:Please check if the text exceeds the limit',
  },
  salaryRange: {
    1001: 'message:Max Must > Min',
  },
  candidateRange: {
    1001: 'message:Max Must > Min',
  },
};

const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

class BasicInfoForm extends React.Component {
  constructor(props) {
    super(props);
    const paserBasicInfo = props.basicInfo ? props.basicInfo.toJS() : {};
    // 从contacts拆分出来social Networks
    let socilaNetworkListTwo = [];
    let contactPhoneList = [];
    let contactEmailList = [];
    paserBasicInfo.contacts &&
      paserBasicInfo.contacts.map((item) => {
        if (
          item.type === 'LINKEDIN' ||
          item.type === 'FACEBOOK' ||
          item.type === 'PERSONAL_WEBSITE' ||
          item.type === 'WECHAT'
        ) {
          socilaNetworkListTwo.push(item);
        } else if (item.type === 'PHONE') {
          contactPhoneList.push(item);
        } else if (item.type === 'EMAIL') {
          contactEmailList.push(item);
        }
      });
    const industrieArr =
      paserBasicInfo.industries &&
      paserBasicInfo.industries.map((item) => {
        return item.dictCode;
      });
    const jobFunctionArr =
      paserBasicInfo.jobFunctions &&
      paserBasicInfo.jobFunctions.map((item) => {
        return item.dictCode;
      });
    const languageArr =
      paserBasicInfo.languages &&
      paserBasicInfo.languages.map((item) => {
        return item.dictCode;
      });
    this.state = {
      errorMessage: Immutable.Map(),
      photoUrl: props.basicInfo.get('photoUrl'),
      editImg: null,
      sourceType:
        paserBasicInfo.tenantLabels &&
        paserBasicInfo.tenantLabels.sourcingChannel,
      rangeStatus:
        paserBasicInfo.additionalInfo &&
        paserBasicInfo.additionalInfo.salaryRange
          ? paserBasicInfo.additionalInfo.salaryRange.gte !==
            paserBasicInfo.additionalInfo.salaryRange.lte
          : false,
      experienceFlag: false,
      contactList:
        contactPhoneList.length > 0
          ? contactPhoneList
          : [{ type: 'PHONE', contact: '' }],
      emailList:
        contactEmailList.length > 0
          ? contactEmailList
          : [{ type: 'EMAIL', contact: '' }],
      socilaNetworkList:
        socilaNetworkListTwo.length > 0
          ? socilaNetworkListTwo
          : [{ type: '', contact: '', details: null }],
      industry:
        industrieArr && industrieArr[0]
          ? industrieArr
          : paserBasicInfo.industries || [],
      jobCheckedList:
        jobFunctionArr && jobFunctionArr[0]
          ? jobFunctionArr
          : paserBasicInfo.jobFunctions || [],
      currentLocation: paserBasicInfo.currentLocation || {},
      languageCheckedList:
        languageArr && languageArr[0]
          ? languageArr
          : paserBasicInfo.languages || [],
      workCheckList:
        (paserBasicInfo.tenantLabels &&
          paserBasicInfo.tenantLabels.workAuthorization) ||
        [],
      ratecurrency:
        (paserBasicInfo.additionalInfo &&
          paserBasicInfo.additionalInfo.currency) ||
        'USD',
      unitType:
        (paserBasicInfo.additionalInfo &&
          paserBasicInfo.additionalInfo.payType) ||
        'YEARLY',
      range: (paserBasicInfo.additionalInfo &&
        paserBasicInfo.additionalInfo.salaryRange) || { gte: null, lte: null },
      resumes: paserBasicInfo.resumes || [],
    };
  }

  static validateForm = (basicForm, t) => {
    let errorMessage = Immutable.Map();

    if (basicForm.firstName && !basicForm.firstName.value.trim()) {
      errorMessage = errorMessage.set(
        'firstname',
        t(errorMessages.firstname[1001])
      );
    }

    if (basicForm.lastName && !basicForm.lastName.value.trim()) {
      errorMessage = errorMessage.set(
        'lastname',
        t(errorMessages.lastname[1001])
      );
    }
    if (basicForm.fullName && !basicForm.fullName.value.trim()) {
      errorMessage = errorMessage.set(
        'fullName',
        t(errorMessages.fullName[1001])
      );
    }
    if (!basicForm.sourceType.value) {
      errorMessage = errorMessage.set(
        'sourceType',
        t('message:Sourcing Channel is required')
      );
    }
    if (basicForm.minRange || basicForm.maxRange) {
      if (basicForm.minRange.value && basicForm.maxRange.value) {
        if (basicForm.minRange.value * 1 > basicForm.maxRange.value * 1) {
          errorMessage = errorMessage.set(
            'salaryRange',
            t(errorMessages.salaryRange[1001])
          );
        }
      }
      if (basicForm.maxRange.value) {
        if (basicForm.maxRange.value * 1 === 0) {
          errorMessage = errorMessage.set(
            'salaryRange',
            t('message:Max must > 0')
          );
        }
      }
    }

    if (basicForm.preferredSalaryRange) {
      let preferredSalaryRange = JSON.parse(
        basicForm.preferredSalaryRange.value
      );
      if (preferredSalaryRange.gte && preferredSalaryRange.lte) {
        if (
          Number(preferredSalaryRange.gte) < 0 ||
          Number(preferredSalaryRange.lte) < 0
        ) {
          errorMessage = errorMessage.set(
            'candidateRange',
            t(errorMessages.candidateRange[1001])
          );
        } else {
          if (
            Number(preferredSalaryRange.lte) < Number(preferredSalaryRange.gte)
          ) {
            errorMessage = errorMessage.set(
              'candidateRange',
              t(errorMessages.candidateRange[1001])
            );
          }
          if (Number(preferredSalaryRange.lte) === 0) {
            errorMessage = errorMessage.set(
              'candidateRange',
              t(errorMessages.candidateRange[1001])
            );
          }
        }
      }
      if (preferredSalaryRange.lte === 0) {
        errorMessage = errorMessage.set(
          'candidateRange',
          t('message:Max must > 0')
        );
      }
    }

    const locationObj = JSON.parse(basicForm.location.value);
    if (
      !locationObj.country &&
      !locationObj.city &&
      !locationObj.province &&
      !locationObj.location
    ) {
      errorMessage = errorMessage.set(
        'location',
        t(errorMessages.location[1001])
      );
    }

    const languagesList = JSON.parse(basicForm.languages.value);
    if (languagesList.length === 0) {
      errorMessage = errorMessage.set(
        'languages',
        t(errorMessages.languages[1001])
      );
    }

    const contactList = JSON.parse(basicForm.contacts.value);
    const contactEmailList = JSON.parse(basicForm.contactEmail.value);
    let contactFlag = false;
    let contactEmailFlag = false;
    let phoneFlag = 0;
    let emailFlag = 0;
    let phoneFormat = false;
    let emailFormat = false;
    let phoneRepeat = false;
    let emailRepeat = false;
    const isPhone = /^([\d+(-][-\d+\s\/)(*.·]{8,25}(\s*ext\s*\d{3,})?)$/i;
    const isEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    contactList &&
      contactList.map((item) => {
        if (!item.contact || !item.type) {
          contactFlag = true;
        }
        if (item.type === 'PHONE') {
          phoneFlag++;
          if (item.contact && !isPhone.test(item.contact)) {
            phoneFormat = true;
          }
        }
        let phoneNum = 0;
        contactList.map((ele) => {
          if (item.contact === ele.contact) {
            phoneNum++;
          }
          if (phoneNum > 1) {
            phoneRepeat = true;
          }
        });
      });
    contactEmailList &&
      contactEmailList.map((item) => {
        if (!item.contact || !item.type) {
          contactEmailFlag = true;
        }
        if (item.type === 'EMAIL') {
          emailFlag++;
          if (item.contact && !isEmail.test(item.contact)) {
            emailFormat = true;
          }
        }
        let emailNum = 0;
        contactEmailList.map((ele) => {
          if (item.contact === ele.contact) {
            emailNum++;
          }
          if (emailNum > 1) {
            emailRepeat = true;
          }
        });
      });
    if (phoneRepeat) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1006])
      );
    }
    if (emailRepeat) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1007])
      );
    }
    if (phoneFlag > 10) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1002])
      );
    }
    if (emailFlag > 10) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1003])
      );
    }
    if (phoneFormat) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1004])
      );
    }
    if (emailFormat) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1005])
      );
    }
    if (contactFlag && contactEmailFlag) {
      errorMessage = errorMessage.set(
        'contacts',
        t(errorMessages.contact[1001])
      );
    }

    let socialNetworkList = JSON.parse(basicForm.socialNetwork.value);
    // socilaNetworkList
    let socialFlag = false;
    let wechatFlag = false;
    let linkedFlag = false;
    let facebookFlag = false;
    let websiteFlag = false;
    let socialRepeat = false;
    const isWechat =
      /^[a-z_-][a-z0-9_-]{5,19}$|^[\d+(-][-\d+\s\/)(*.·]{8,25}$|https:\/\/wechat-qrcode.s3.[-\w]*.amazonaws.com\/\w*/i;
    const isLinkedin =
      /(?:https?:\/\/)?(?:(?:www|[a-z]{2})\.)?linkedin\.com\/(?:in|talent\/profile|public-profile\/in|chatin\/wnc\/in|mwlite\/in)\/([^^/ :?？=—*&!！`$)(）（<>©|}{@#]{3,900})/i;
    const isFaceBook =
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(\w[a-zA-Z0-9._-]*)/i;
    const isWebsite = /(https?:\/\/)?([-\w]+\.)+[-\w]+(\/[-\w .,~～∼/?%&=]*)?/i;
    socialNetworkList &&
      socialNetworkList.map((item) => {
        if (!item.type || (!item.contact && !item.details)) {
          socialFlag = true;
        } else {
          if (item.type === 'WECHAT') {
            if (
              !isWechat.test(
                item.contact === 'None' ? item.details : item.contact
              )
            ) {
              wechatFlag = true;
            }
          }
          if (item.type === 'LINKEDIN') {
            if (
              item.details
                ? !item.details.match(isLinkedin)
                : !item.contact.match(isLinkedin)
            ) {
              linkedFlag = true;
            } else if (!item.details && item.contact) {
              let linkedInValue = item.contact.match(isLinkedin);
              if (linkedInValue) {
                item.details = item.contact;
                item.contact = linkedInValue[1];
              }
            } else if (item.details && !item.contact) {
              let linkedInValue = item.details.match(isLinkedin);
              if (linkedInValue) {
                item.contact = linkedInValue[1];
              }
            }
          }
          if (item.type === 'FACEBOOK') {
            if (
              item.details
                ? !item.details.match(isFaceBook)
                : !item.contact.match(isFaceBook)
            ) {
              facebookFlag = true;
            } else if (!item.details && item.contact) {
              let linkedInValue = item.contact.match(isFaceBook);
              if (linkedInValue) {
                item.details = item.contact;
                item.contact = linkedInValue[1];
              }
            } else if (item.details && !item.contact) {
              let facebookValue = item.details.match(isFaceBook);
              if (facebookValue) {
                item.contact = facebookValue[1];
              }
            }
          }
          if (item.type === 'PERSONAL_WEBSITE') {
            if (!isWebsite.test(item.contact)) {
              websiteFlag = true;
            }
          }
          let socialNumer = 0;
          socialNetworkList.map((ele) => {
            if (item.contact === ele.contact) {
              socialNumer++;
            }
            if (socialNumer > 1) {
              socialRepeat = true;
            }
          });
        }
      });

    if (socialRepeat) {
      errorMessage = errorMessage.set(
        'socialNetwork',
        t(errorMessages.socialNetwork[1006])
      );
    }
    if (wechatFlag) {
      errorMessage = errorMessage.set(
        'socialNetwork',
        t(errorMessages.socialNetwork[1002])
      );
    }
    if (linkedFlag) {
      errorMessage = errorMessage.set(
        'socialNetwork',
        t(errorMessages.socialNetwork[1003])
      );
    }
    if (facebookFlag) {
      errorMessage = errorMessage.set(
        'socialNetwork',
        t(errorMessages.socialNetwork[1004])
      );
    }
    if (websiteFlag) {
      errorMessage = errorMessage.set(
        'socialNetwork',
        t(errorMessages.socialNetwork[1005])
      );
    }
    // if (socialFlag) {
    //   errorMessage = errorMessage.set(
    //     'socialNetwork',
    //     t(errorMessages.socialNetwork[1001])
    //   );
    // }

    const educationList = JSON.parse(basicForm.educations.value);
    let educationFlag = false;
    let educationNumberFlag = false;
    let educationDateFlag = false;
    let educationTimeFlag = false;
    let educationArr = [];
    let educationNumberArr = [];
    let educationDateArr = [];
    let educationTimeArr = [];
    educationList &&
      educationList.map((item, index) => {
        if (!item.majorName && !item.degreeLevel && !item.collegeName) {
          educationFlag = true;
          educationArr.push(index);
        }
        // education不可以只填 start_date,不填end_date,但是可以只填end_date不填start_date
        //  (我们关心他什么时候毕业而不是入学),也可以两个都不填
        if (item.startDate && !item.endDate && !item.current) {
          educationDateFlag = true;
          educationDateArr.push(index);
        }
        if (item.current && item.endDate) {
          if (new Date(item.endDate).getTime() < new Date().getTime()) {
            educationTimeFlag = true;
            educationTimeArr.push(index);
          }
        }
        if (
          (item.majorName && item.majorName.length * 1 > 255) ||
          (item.collegeName && item.collegeName.length * 1 > 255)
        ) {
          educationNumberFlag = true;
          educationNumberArr.push(index);
        }
      });
    if (educationDateFlag) {
      errorMessage = errorMessage.set(
        'educations',
        t(errorMessages.educations[1002])
      );
      errorMessage = errorMessage.set('educationsArr', educationDateArr);
    }
    if (educationTimeFlag) {
      errorMessage = errorMessage.set(
        'educations',
        t(errorMessages.educations[1003])
      );
      errorMessage = errorMessage.set('educationsArr', educationTimeArr);
    }
    if (educationFlag) {
      errorMessage = errorMessage.set(
        'educations',
        t(errorMessages.educations[1001])
      );
      errorMessage = errorMessage.set('educationsArr', educationArr);
    }
    if (educationNumberFlag) {
      errorMessage = errorMessage.set(
        'educations',
        t(errorMessages.educations[1004])
      );
      errorMessage = errorMessage.set('educationsArr', educationNumberArr);
    }

    const projectList = JSON.parse(basicForm.projects.value);
    let projectFlag = false;
    let projectDateFlag = false;
    let projectTextFlag = false;
    let projectArr = [];
    let projectDateArr = [];
    let projectTextArr = [];
    projectList &&
      projectList.map((item, index) => {
        if (!item.projectName && !item.title && !item.description) {
          projectFlag = true;
          projectArr.push(index);
        }
        if (item.startDate && !item.endDate) {
          projectDateFlag = true;
          projectDateArr.push(index);
        }
        if (
          (item.projectName && item.projectName.length * 1 > 200) ||
          (item.title && item.title.length * 1 > 200) ||
          (item.description && item.description.length * 1 > 16380)
        ) {
          projectTextFlag = true;
          projectTextArr.push(index);
        }
      });
    if (projectTextFlag) {
      errorMessage = errorMessage.set(
        'projects',
        t(errorMessages.projects[1003])
      );
      errorMessage = errorMessage.set('projectsArr', projectTextArr);
    }
    if (projectDateFlag) {
      errorMessage = errorMessage.set(
        'projects',
        t(errorMessages.projects[1002])
      );
      errorMessage = errorMessage.set('projectsArr', projectDateArr);
    }
    if (projectFlag) {
      errorMessage = errorMessage.set(
        'projects',
        t(errorMessages.projects[1001])
      );
      errorMessage = errorMessage.set('projectsArr', projectArr);
    }

    const experienceInforList = JSON.parse(basicForm.experienceInfor.value);
    let experienceInforFlag = false;
    let experienceInforTextFlag = false;
    let experienceInforDateFlag = false;
    let experienceInforArr = [];
    let experienceInforTextArr = [];
    let experienceInforDateArr = [];
    if (experienceInforList.length > 0) {
      experienceInforList.map((item, index) => {
        if (!item.title || !item.company) {
          experienceInforFlag = true;
          experienceInforArr.push(index);
        }
        // 不选择 current 的情况下,要不然start_date end_date都填，要不然都不填，
        // 要不然填end_date 不填 start_date。 不可以只填start_date又不勾选current，这是无法理解的数据逻辑。
        if (item.startDate && !item.endDate && !item.current) {
          experienceInforDateFlag = true;
          experienceInforDateArr.push(index);
        }
        if (
          (item.title && item.title.length * 1 > 255) ||
          (item.company && item.company.length * 1 > 255)
        ) {
          experienceInforTextFlag = true;
          experienceInforTextArr.push(index);
        }
      });
    }
    if (experienceInforTextFlag) {
      errorMessage = errorMessage.set(
        'experienceInfor',
        t(errorMessages.experienceInfor[1004])
      );
      errorMessage = errorMessage.set(
        'experienceInforArr',
        experienceInforTextArr
      );
    }
    if (experienceInforDateFlag) {
      errorMessage = errorMessage.set(
        'experienceInfor',
        t(errorMessages.experienceInfor[1002])
      );
      errorMessage = errorMessage.set(
        'experienceInforArr',
        experienceInforDateArr
      );
    }
    if (experienceInforFlag) {
      errorMessage = errorMessage.set(
        'experienceInfor',
        t(errorMessages.experienceInfor[1001])
      );
      errorMessage = errorMessage.set('experienceInforArr', experienceInforArr);
    }

    return errorMessage.size > 0 && errorMessage;
  };

  static getTalentBasicFromForm = (basicForm) => {
    let newSocialNetworkList = JSON.parse(basicForm.socialNetwork.value);
    let contactEmailList = JSON.parse(basicForm.contactEmail.value);
    let contactPhoneList = JSON.parse(basicForm.contacts.value);
    newSocialNetworkList = newSocialNetworkList
      ? newSocialNetworkList.filter(
          (item) => item.type && (item.contact || item.details)
        )
      : [];
    contactEmailList = contactEmailList
      ? contactEmailList.filter((item) => item.type && item.contact)
      : [];
    contactPhoneList = contactPhoneList
      ? contactPhoneList.filter((item) => item.type && item.contact)
      : [];
    const newSalaryRange = JSON.parse(basicForm.salaryRange.value);
    let salaryFlag = false;
    if (!newSalaryRange.gte && !newSalaryRange.lte) {
      salaryFlag = true;
    }

    const candidate = {
      firstName: basicForm.firstName && basicForm.firstName.value,
      lastName: basicForm.lastName && basicForm.lastName.value,
      contacts: contactPhoneList
        .concat(contactEmailList)
        .concat(newSocialNetworkList),
      photoUrl: basicForm.photoUrl.value || null, // this.state.photoUrl,
      industries:
        JSON.parse(basicForm.Industries.value).length === 0
          ? null
          : JSON.parse(basicForm.Industries.value),
      jobFunctions:
        JSON.parse(basicForm.jobfunction.value).length === 0
          ? null
          : JSON.parse(basicForm.jobfunction.value),
      currentLocation: JSON.parse(basicForm.location.value),
      languages: JSON.parse(basicForm.languages.value),
      currency: basicForm.ratecurrency.value,
      payType: basicForm.UnitType.value,
      salaryRange: null,
      // sourcingChannel: basicForm.sourceType.value,
      resumes:
        JSON.parse(basicForm.resume.value).length === 0
          ? null
          : JSON.parse(basicForm.resume.value),
      workAuthorization:
        JSON.parse(basicForm.workAuthorization.value).length === 0
          ? null
          : JSON.parse(basicForm.workAuthorization.value),
      experiences:
        JSON.parse(basicForm.experienceInfor.value).length === 0
          ? null
          : JSON.parse(basicForm.experienceInfor.value),
      skills:
        JSON.parse(basicForm.skills.value).length === 0
          ? null
          : JSON.parse(basicForm.skills.value),
      educations:
        JSON.parse(basicForm.educations.value).length === 0
          ? null
          : JSON.parse(basicForm.educations.value),
      projects:
        JSON.parse(basicForm.projects.value).length === 0
          ? null
          : JSON.parse(basicForm.projects.value),
    };
    if (basicForm.sourceType.value !== 'UNKNOWN') {
      candidate.sourcingChannel = basicForm.sourceType.value;
    }
    if (basicForm.preferredPayType) {
      candidate.preferredPayType = basicForm.preferredPayType.value;
    }
    if (basicForm.preferredCurrency) {
      candidate.preferredCurrency = basicForm.preferredCurrency.value;
    }
    if (basicForm.preferredSalaryRange) {
      candidate.preferredSalaryRange = JSON.parse(
        basicForm.preferredSalaryRange.value
      );
    }
    if (basicForm.preferredLocations) {
      let preferredLocationArr = JSON.parse(basicForm.preferredLocations.value);
      preferredLocationArr = preferredLocationArr
        ? preferredLocationArr.filter(
            (item) =>
              JSON.stringify(item) !== '{}' &&
              (item.country || item.location || item.province || item.city)
          )
        : null;
      candidate.preferredLocations = preferredLocationArr;
    }
    if (!salaryFlag) {
      candidate.salaryRange = newSalaryRange;
    }
    if (basicForm.share) {
      candidate.ownerships = basicForm.share.value
        ? basicForm.share.value.split(',').map((userId) => ({
            userId: parseInt(userId, 10),
          }))
        : [];
    }
    // contacts后端批量插入，需要前端配合按照用户输入的顺序排序
    candidate.contacts.forEach((item, index) => {
      item.sort = index + 1;
    });
    //  todo：check create & edit
    //  UPLOAD_WITH_RESUME(0,"UPLOAD_WITH_RESUME"),
    //  CREATE_WITHOUT_RESUME(1,"CREATE_WITHOUT_RESUME"),
    //  BULK_UPLOAD_RESUMES(2,"BULK_UPLOAD_RESUMES");
    if (JSON.parse(basicForm.resume.value).length > 0) {
      candidate.creationTalentType = 'UPLOAD_WITH_RESUME';
    } else {
      candidate.creationTalentType = 'CREATE_WITHOUT_RESUME';
    }
    return candidate;
  };

  onSubmit = (e) => {
    e.preventDefault();
    const basicForm = e.target;
    console.log('----滴滴滴----');
    let errorMessage = BasicInfoForm.validateForm(basicForm, this.props.t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    const candidate = BasicInfoForm.getTalentBasicFromForm(basicForm);

    if (this.props.onSubmit) {
      this.props.onSubmit(candidate, this.props.basicInfo.get('id'));
    } else {
      console.log(candidate);
    }
  };

  onNewImage = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
    fileInput.value = '';
    this.setState({ editImg: file });
  };

  getCroppedImage = (imgUrl) => {
    this.setState({
      photoUrl: imgUrl || this.props.basicInfo.get('photoUrl'),
      editImg: null,
    });
  };

  addContact = () => {
    let arr = [...this.state.contactList];
    arr.push({
      contact: '',
      type: 'PHONE',
    });
    this.setState({ contactList: arr });
  };
  addContactEmail = () => {
    let arr = [...this.state.emailList];
    arr.push({
      contact: '',
      type: 'EMAIL',
    });
    this.setState({ emailList: arr });
  };

  deleteContact = (index) => {
    let arr = [...this.state.contactList];
    arr.splice(index, 1);
    this.setState({ contactList: arr });
    this.props.removeErrorMessage('contacts');
  };
  deleteContactEmail = (index) => {
    let arr = [...this.state.emailList];
    arr.splice(index, 1);
    this.setState({ emailList: arr });
    this.props.removeErrorMessage('contacts');
  };
  // 数组数据顺序掉换
  swapArrData = (arr, index1, index2) => {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  };
  makePrimaryPhone = (index) => {
    let arr = [...this.state.contactList];
    let newArr = this.swapArrData(arr, index, 0);
    this.setState({
      contactList: newArr,
    });
  };
  makePrimaryEmail = (index) => {
    let arr = [...this.state.emailList];
    let newArr = this.swapArrData(arr, index, 0);
    this.setState({
      emailList: newArr,
    });
  };

  addNetwork = () => {
    let arr = [...this.state.socilaNetworkList];
    arr.push({
      type: '',
      contact: '',
    });
    this.setState({ socilaNetworkList: arr });
  };

  deleteNetwork = (index) => {
    let arr = [...this.state.socilaNetworkList];
    arr.splice(index, 1);
    this.setState({ socilaNetworkList: arr });
    this.props.removeErrorMessage('socialNetwork');
  };

  changeContactOne = (value, index) => {
    let arr = [...this.state.contactList];
    arr[index].type = value;
    console.log(value);
    this.setState({ contactList: arr });
    this.props.removeErrorMessage('contacts');
  };
  changeContactTwo = (e, index) => {
    let arr = [...this.state.contactList];
    arr[index].contact = e.target.value;
    this.setState({ contactList: arr });
    this.props.removeErrorMessage('contacts');
  };
  changeContactEmail = (e, index) => {
    let arr = [...this.state.emailList];
    arr[index].contact = e.target.value;
    this.setState({ emailList: arr });
    this.props.removeErrorMessage('contacts');
  };

  changeNetworkOne = (value, index) => {
    let arr = [...this.state.socilaNetworkList];
    arr[index].type = value;
    if (value === 'LINKEDIN' && (arr[index].contact || arr[index].details)) {
      const linkedInID =
        /(?:https?:\/\/)?(?:(?:www|[a-z]{2})\.)?linkedin\.com\/(?:in|talent\/profile|public-profile\/in|chatin\/wnc\/in|mwlite\/in)\/([^^/ :?？=—*&!！`$)(）（<>©|}{@#]{3,900})/i;
      let linkedInValue =
        (arr[index].contact && arr[index].contact.match(linkedInID)) ||
        (arr[index].details && arr[index].details.match(linkedInID));
      if (linkedInValue) {
        arr[index].contact = linkedInValue[1];
        arr[index].details = linkedInValue[0];
      } else {
        arr[index].details = arr[index].details || arr[index].contact;
        arr[index].contact = null;
      }
      // arr[index].details = arr[index].details || arr[index].contact;
    } else if (
      arr[index].type === 'FACEBOOK' &&
      (arr[index].contact || arr[index].details)
    ) {
      const facebookID =
        /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(\w[a-zA-Z0-9._-]*)/i;
      let facebookValue =
        (arr[index].contact && arr[index].contact.match(facebookID)) ||
        (arr[index].details && arr[index].details.match(facebookID));
      if (facebookValue) {
        arr[index].contact = facebookValue[1];
        arr[index].details = facebookValue[0];
      } else {
        arr[index].details = arr[index].details || arr[index].contact;
        arr[index].contact = null;
      }
      // arr[index].details = arr[index].details || arr[index].contact;
    } else if (arr[index].type === 'PERSONAL_WEBSITE') {
      arr[index].contact = arr[index].details || arr[index].contact;
    } else if (arr[index].type === 'WECHAT') {
      arr[index].contact = arr[index].details || arr[index].contact;
    }
    this.setState({ socilaNetworkList: arr });
    this.props.removeErrorMessage('socialNetwork');
  };
  changeNetworkTwo = (e, index) => {
    // 111111111
    let arr = [...this.state.socilaNetworkList];
    // 根据type类型，对应正则取它的id值
    let value = e.target.value;

    if (arr[index].type === 'LINKEDIN') {
      const linkedInID =
        /(?:https?:\/\/)?(?:(?:www|[a-z]{2})\.)?linkedin\.com\/(?:in|talent\/profile|public-profile\/in|chatin\/wnc\/in|mwlite\/in)\/([^^/ :?？=—*&!！`$)(）（<>©|}{@#]{3,900})/i;
      let linkedInValue = value.match(linkedInID);

      if (linkedInValue) {
        arr[index].contact = linkedInValue[1];
      } else {
        arr[index].contact = null;
      }

      arr[index].details = value;
    } else if (arr[index].type === 'FACEBOOK') {
      const facebookID =
        /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(\w[a-zA-Z0-9._-]*)/i;
      let facebookValue = value.match(facebookID);
      if (facebookValue) {
        arr[index].contact = facebookValue[1];
      } else {
        arr[index].contact = null;
      }
      arr[index].details = value;
    } else if (!ContactTypeList.includes(arr[index].type)) {
      arr[index].type = 'PERSONAL_WEBSITE';
      arr[index].contact = value;
      arr[index].details = null;
    } else {
      arr[index].contact = value;
      arr[index].details = null;
    }
    this.setState({ socilaNetworkList: arr });
    this.props.removeErrorMessage('socialNetwork');
  };

  changeRangeStatus = () => {
    this.setState({
      rangeStatus: !this.state.rangeStatus,
      range: { gte: '', lte: '' },
    });
  };
  handleJobFunctionChange = (jobCheckedList) => {
    let serviceType = jobCheckedList.map((job) => Number(job));
    this.setState({
      jobCheckedList: serviceType,
    });
  };
  handleIndustryChange = (industryList) => {
    let serviceType = industryList.map((job) => Number(job));
    this.setState({
      industry: serviceType,
    });
  };
  getSingleLocation = (data) => {
    this.setState({ currentLocation: data });
    this.props.removeErrorMessage('location');
  };
  handleReLanguageChange = (CheckedList) => {
    let serviceType = [];
    CheckedList &&
      CheckedList.forEach((item) => {
        serviceType.push(item * 1);
      });
    this.setState({
      languageCheckedList: serviceType,
    });
    this.props.removeErrorMessage('languages');
  };

  changeRangeNumber = (event) => {
    let number = isNum(event.target.value, 9);
    let rangeTwo = { gte: number, lte: number };
    this.setState({
      range: rangeTwo,
    });
  };
  changeRangeGte = (event) => {
    let number = isNum(event.target.value, 9);
    let rangeTwo = { ...this.state.range };
    rangeTwo.gte = number;
    this.setState({
      range: rangeTwo,
    });
  };
  changeRangeLte = (event) => {
    let number = isNum(event.target.value, 9);
    let rangeTwo = { ...this.state.range };
    rangeTwo.lte = number;
    this.setState({
      range: rangeTwo,
    });
  };

  handleWorkAuthChange = (workCheckedList) => {
    let serviceType = workCheckedList.map((job) => Number(job));
    this.setState({
      workCheckList: serviceType,
    });
  };

  render() {
    const {
      t,
      i18n,
      basicInfo,
      talentFormRef,
      removeErrorMessage,
      errorMessage,
      jobFunctionList,
      languageList,
      workAuthList,
      industryList,
      classes,
    } = this.props;

    const {
      photoUrl,
      editImg,
      rangeStatus,
      contactList,
      emailList,
      socilaNetworkList,
      industry,
      currentLocation,
      range,
    } = this.state;

    return (
      <form onSubmit={this.onSubmit} ref={talentFormRef} id="candidateBasic">
        <div className={'flex-container align-top'}>
          <div className="row flex-child-auto">
            <div
              className="row expanded small-12"
              style={{ marginLeft: 0, marginRight: 0 }}
            >
              <div className="small-6 columns">
                <FormInput
                  name="firstName"
                  label={t('field:firstName')}
                  defaultValue={basicInfo.get('firstName') || ''}
                  placeholder={'First Name'}
                  isRequired={true}
                  errorMessage={errorMessage.get('firstname')}
                  onBlur={() => removeErrorMessage('firstname')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="lastName"
                  label={t('field:lastName')}
                  placeholder={'Last Name'}
                  defaultValue={basicInfo.get('lastName') || ''}
                  isRequired={true}
                  errorMessage={errorMessage.get('lastname')}
                  onBlur={() => removeErrorMessage('lastname')}
                />
              </div>
            </div>

            <div
              className="row expanded small-12"
              style={{ marginRight: '0px', marginLeft: '0px' }}
            >
              <div
                className="expanded small-6"
                style={{ position: 'relative' }}
              >
                <p
                  style={{
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    color: '#3398dc',
                    cursor: 'pointer',
                    paddingRight: '4px',
                  }}
                  onClick={this.addContact}
                >
                  {'Add'}
                </p>
                {contactList &&
                  contactList.map((item, index) => {
                    return (
                      <div className="expanded small-12" key={index}>
                        <div className={'small-12 columns'}>
                          <FormInput
                            name="phone"
                            label={index === 0 ? t('field:Contacts') : null}
                            isRequired={index === 0 ? true : false}
                            value={item.contact}
                            onChange={(e) => {
                              this.changeContactTwo(e, index);
                            }}
                            placeholder={
                              index === 0
                                ? 'Enter a primary phone number'
                                : 'Enter a phone number'
                            }
                          />
                        </div>
                        {index === 0 ? (
                          <p
                            style={{
                              fontSize: 14,
                              color: '#aab1b8',
                              marginTop: -5,
                              marginBottom: 5,
                              marginLeft: '0.25em',
                            }}
                          >
                            {'Primary'}
                          </p>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginTop: -5,
                              marginBottom: 5,
                              marginLeft: '0.25em',
                            }}
                          >
                            <p
                              style={{
                                fontSize: 14,
                                color: '#3398dc',
                                cursor: 'pointer',
                                marginRight: 14,
                              }}
                              onClick={() => {
                                this.makePrimaryPhone(index);
                              }}
                            >
                              {'Make primary'}
                            </p>
                            <p
                              style={{
                                fontSize: 14,
                                color: '#3398dc',
                                cursor: 'pointer',
                                marginTop: 0,
                              }}
                              onClick={() => {
                                this.deleteContact(index);
                              }}
                            >
                              {'Remove'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                <input
                  type="hidden"
                  name="contacts"
                  value={contactList && JSON.stringify(contactList)}
                />
              </div>

              <div
                className="expanded small-6"
                style={{ position: 'relative' }}
              >
                <p
                  style={{
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    color: '#3398dc',
                    cursor: 'pointer',
                    paddingRight: '4px',
                  }}
                  onClick={this.addContactEmail}
                >
                  {'Add'}
                </p>
                {emailList &&
                  emailList.map((item, index) => {
                    return (
                      <div className="expanded small-12" key={index}>
                        <div className={'small-12 columns'}>
                          <FormInput
                            name="email"
                            label={index === 0 ? <div>&nbsp;</div> : null}
                            value={item.contact}
                            onChange={(e) => {
                              this.changeContactEmail(e, index);
                            }}
                            placeholder={
                              index === 0
                                ? 'Enter a primary email address'
                                : 'Enter an email address'
                            }
                          />
                        </div>
                        {index === 0 ? (
                          <p
                            style={{
                              fontSize: 14,
                              color: '#aab1b8',
                              marginTop: -5,
                              marginBottom: 5,
                              marginLeft: '0.25em',
                            }}
                          >
                            {'Primary'}
                          </p>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginTop: -5,
                              marginBottom: 5,
                              marginLeft: '0.25em',
                            }}
                          >
                            <p
                              style={{
                                fontSize: 14,
                                color: '#3398dc',
                                cursor: 'pointer',
                                marginRight: 14,
                              }}
                              onClick={() => {
                                this.makePrimaryEmail(index);
                              }}
                            >
                              {'Make primary'}
                            </p>
                            <p
                              style={{
                                fontSize: 14,
                                color: '#3398dc',
                                cursor: 'pointer',
                                marginTop: 0,
                              }}
                              onClick={() => {
                                this.deleteContactEmail(index);
                              }}
                            >
                              {'Remove'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                <input
                  type="hidden"
                  name="contactEmail"
                  value={emailList && JSON.stringify(emailList)}
                />
              </div>
              {errorMessage.get('contacts') ? (
                <div
                  style={{
                    color: '#CC4B37',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    marginTop: '-6px',
                    marginBottom: '1rem',
                  }}
                >
                  {errorMessage.get('contacts')}
                </div>
              ) : null}
            </div>
          </div>

          <div style={{ minWidth: 100, marginLeft: 10 }}>
            <FormReactSelectContainer
              label={t('field:photoUrl')}
              className={'columns'}
            >
              <div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={this.onNewImage}
                />
                {photoUrl ? (
                  <Avatar
                    title={t('common:uploadImage')}
                    src={photoUrl}
                    style={{
                      width: 100,
                      height: 100,
                      margin: '0 2px',
                      backgroundColor: 'white',
                    }}
                  />
                ) : (
                  <div
                    className="flex-container flex-dir-column align-center align-middle"
                    style={{
                      width: 100,
                      height: 100,
                      padding: 4,
                      margin: '0 2px',
                      backgroundColor: '#f2f2f2',
                    }}
                  >
                    <AccountCircleIcon
                      style={{
                        fontSize: '4em',
                        color: Colors.WHITE,
                        textAlign: 'center',
                      }}
                    />
                  </div>
                )}
                <input type="hidden" name="photoUrl" value={photoUrl || ''} />
              </div>
            </FormReactSelectContainer>
          </div>
        </div>
        <ImageEditor
          open={!!editImg}
          image={editImg}
          onSave={this.getCroppedImage}
          onNewImage={this.onNewImage}
          photoUrl={photoUrl}
          circle={true}
        />

        <div className="expanded small-12" style={{ position: 'relative' }}>
          <p
            style={
              socilaNetworkList.length > 1
                ? {
                    position: 'absolute',
                    right: '33px',
                    top: '0px',
                    color: '#3398dc',
                    cursor: 'pointer',
                    paddingRight: '4px',
                  }
                : {
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    color: '#3398dc',
                    cursor: 'pointer',
                    paddingRight: '4px',
                  }
            }
            onClick={this.addNetwork}
          >
            {'Add'}
          </p>
          {socilaNetworkList &&
            socilaNetworkList.map((item, index) => {
              return (
                <div className="row expanded small-12" key={index}>
                  <div className="small-6 columns">
                    <FormReactSelectContainer
                      label={index === 0 ? t('field:Social Networks') : null}
                    >
                      <Select
                        value={
                          ContactTypeList.includes(item.type)
                            ? item.type
                            : item.type
                            ? 'PERSONAL_WEBSITE'
                            : null
                        }
                        onChange={(value) => {
                          this.changeNetworkOne(value, index);
                        }}
                        simpleValue
                        placeholder={'Select'}
                        options={CandidateNetWork}
                        autoBlur={true}
                        searchable={false}
                        clearable={false}
                        openOnFocus={true}
                      />
                    </FormReactSelectContainer>
                  </div>
                  <div
                    className={
                      socilaNetworkList.length > 1
                        ? 'small-5 columns'
                        : 'small-6 columns'
                    }
                  >
                    <FormInput
                      name="NetworksNumber"
                      value={item.details || item.contact}
                      onChange={(e) => {
                        this.changeNetworkTwo(e, index);
                      }}
                      label={index === 0 ? <div>&nbsp;</div> : null}
                      placeholder={
                        item.type === 'WECHAT'
                          ? 'Enter a Wechat Number'
                          : 'Enter a Link'
                      }
                    />
                  </div>
                  {socilaNetworkList.length > 1 ? (
                    <div className="small-1 columns">
                      <DeleteIcon
                        style={
                          index === 0
                            ? {
                                marginTop: 25,
                                cursor: 'pointer',
                                color: 'gray',
                              }
                            : { marginTop: 4, cursor: 'pointer', color: 'gray' }
                        }
                        onClick={() => {
                          this.deleteNetwork(index);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          {errorMessage.get('socialNetwork') ? (
            <div
              style={{
                color: '#CC4B37',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                marginTop: '-6px',
                marginBottom: '1rem',
              }}
            >
              {errorMessage.get('socialNetwork')}
            </div>
          ) : null}
          <input
            type="hidden"
            name="socialNetwork"
            value={socilaNetworkList && JSON.stringify(socilaNetworkList)}
          />
        </div>

        <div className="row small-12 expanded">
          <div className="small-6 columns">
            <span style={{ fontSize: 12 }}>{t('field:Industries')}</span>
            <JobTree
              jobData={industryList}
              selected={industry}
              sendServiceType={this.handleIndustryChange}
            />
            <input
              name="Industries"
              type="hidden"
              value={JSON.stringify(industry)}
            />
          </div>
          <div className="row small-6 expanded">
            <div className="small-12 columns">
              <span style={{ fontSize: 12 }}>{t('field:jobfunction')}</span>
              <JobCandidateTree
                jobData={jobFunctionList}
                selected={this.state.jobCheckedList}
                sendServiceType={this.handleJobFunctionChange}
              />
              <input
                type="hidden"
                name="jobfunction"
                value={
                  this.state.jobCheckedList &&
                  JSON.stringify(this.state.jobCheckedList)
                }
              />
            </div>
          </div>
        </div>

        <div className="row small-12 expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              isRequired
              label={t('field:Current Location')}
              errorMessage={errorMessage.get('location')}
            >
              <div
                className={errorMessage.get('location') ? classes.autoBox : ''}
              >
                <Location
                  handleChange={this.getSingleLocation}
                  value={currentLocation}
                />
              </div>
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="location"
              value={JSON.stringify(currentLocation)}
            />
          </div>
          <div className="small-6 columns">
            <span style={{ fontSize: 12 }}>{t('field:Languages')}</span>
            <span style={{ color: '#CC4B37' }}> *</span>
            <div
              className={errorMessage.get('languages') ? classes.autoBox : ''}
            >
              <JobTree
                jobData={languageList}
                selected={this.state.languageCheckedList}
                sendServiceType={this.handleReLanguageChange}
                show={true}
              />
            </div>
            <input
              type="hidden"
              name="languages"
              value={JSON.stringify(this.state.languageCheckedList)}
            />
            {errorMessage.get('languages') ? (
              <div
                style={{
                  color: '#CC4B37',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  marginTop: '-5px',
                  marginBottom: '1rem',
                }}
              >
                {errorMessage.get('languages')}
              </div>
            ) : null}
          </div>
        </div>

        <div className="row small-12 expanded">
          <div className="small-6 row">
            <div className="columns">
              <FormReactSelectContainer label={t('field:Current Salary')}>
                <Select
                  labelKey={'label2'}
                  options={currencyOptions}
                  value={this.state.ratecurrency}
                  onChange={(ratecurrency) => this.setState({ ratecurrency })}
                  simpleValue
                  noResultsText={''}
                  autoBlur={true}
                  clearable={false}
                  openOnFocus={true}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="ratecurrency"
                value={this.state.ratecurrency}
              />
            </div>
            <div className="columns">
              <FormReactSelectContainer label="&nbsp;">
                <Select
                  value={this.state.unitType}
                  onChange={(unitType) => this.setState({ unitType })}
                  simpleValue
                  options={payRateUnitTypes}
                  autoBlur={true}
                  searchable={false}
                  clearable={false}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="UnitType"
                value={this.state.unitType}
              />
            </div>
          </div>
          <div className="small-6 row" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', right: '0px', top: '-2px' }}>
              Range
              <Switch
                checked={rangeStatus}
                color="primary"
                name="checkedA"
                size="small"
                onChange={this.changeRangeStatus}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
            {!rangeStatus && (
              <div className="small-12 columns">
                <FormInput
                  name="rangeNumber"
                  value={range.lte}
                  onChange={(event) => {
                    this.changeRangeNumber(event);
                  }}
                  placeholder={'Enter a number'}
                  label="&nbsp;"
                />
              </div>
            )}
            {rangeStatus && (
              <>
                <div className="columns">
                  <FormInput
                    name="minRange"
                    label="&nbsp;"
                    value={range.gte}
                    onChange={(event) => {
                      this.changeRangeGte(event);
                    }}
                    placeholder={'Min'}
                    errorMessage={errorMessage.get('salaryRange')}
                    onBlur={() => removeErrorMessage('salaryRange')}
                  />
                </div>
                <div className="columns">
                  <FormInput
                    name="maxRange"
                    label="&nbsp;"
                    value={range.lte}
                    onChange={(event) => {
                      this.changeRangeLte(event);
                    }}
                    placeholder={'Max'}
                    errorMessage={errorMessage.get('salaryRange')}
                    onBlur={() => removeErrorMessage('salaryRange')}
                  />
                </div>
              </>
            )}
            <input
              type="hidden"
              name="salaryRange"
              value={JSON.stringify(range)}
            />
          </div>
        </div>

        <div className="row small-12 expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:Sourcing Channel')}
              isRequired={true}
              errorMessage={errorMessage.get('sourceType')}
            >
              <Select
                value={this.state.sourceType}
                onChange={(sourceType) => this.setState({ sourceType })}
                simpleValue
                options={candidateSoureChannel}
                placeholder={'Select'}
                autoBlur={true}
                searchable={false}
                clearable={false}
                openOnFocus={true}
                onBlur={() => removeErrorMessage('sourceType')}
              />
            </FormReactSelectContainer>
            <input
              name="sourceType"
              type="hidden"
              value={this.state.sourceType}
            />
          </div>
          <div className="small-6 columns">
            <span style={{ fontSize: 12 }}>
              {t('field:Work Authorization')}
            </span>
            <WorkAuthTree
              jobData={workAuthList}
              selected={this.state.workCheckList}
              sendServiceType={this.handleWorkAuthChange}
            />
            <input
              name="workAuthorization"
              type="hidden"
              value={JSON.stringify(this.state.workCheckList)}
            />
          </div>
        </div>
        <input
          name="resume"
          type="hidden"
          value={JSON.stringify(this.state.resumes)}
        />

        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
      </form>
    );
  }
}

const mapStateToProps = (state, { basicInfo }) => {
  return {
    jobFunctionList: state.controller.candidateSelect.toJS().jobFounctionList,
    languageList: state.controller.candidateSelect.toJS().languageList,
    workAuthList: state.controller.candidateSelect.toJS().workAuthList,
    industryList: state.controller.candidateSelect.toJS().industryList,
  };
};

BasicInfoForm.prototypes = {
  onSubmit: PropTypes.func.isRequired,
  basicInfo: PropTypes.object.isRequired,
};
const HOC_BasicInfoForm = withTranslation(['field', 'message', 'action'])(
  connect(mapStateToProps)(withStyles(styles)(BasicInfoForm))
);
hoistNonReactStatics(HOC_BasicInfoForm, BasicInfoForm);

export default HOC_BasicInfoForm;
