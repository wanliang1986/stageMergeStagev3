import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../components/particial/FormInput';
import {
  industryList,
  staffSize,
  businessRevenue,
} from '../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import SalesLead from './SalesLead/SalesLead';
import AdditionalAddress from './AdditionalAddress/AdditionalAddress';
import MyDialog from '../../../components/Dialog/myDialog';
import CompanyNameTemplate from '../../../components/Dialog/DialogTemplates/CompanyNameTemplate';
import {
  validateProspectName,
  prospectCheckname,
} from '../../../../apn-sdk/client';
import Button from '@material-ui/core/Button';
import Location from '../../../components/Location';

import { createCompany, putCompany } from '../../../actions/clientActions';

import CompanyLogo from './CompanyLogo';
import { uploadAvatar } from '../../../../apn-sdk/files';
import Loading from '../../../components/particial/Loading';
import lodash from 'lodash';
import Immutable from 'immutable';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import UserSearchSelect from '../../../components/userSearchSelect';
import { showErrorMessage } from '../../../actions';

const fortuneRankingList = [
  { value: 'FORTUNE_1000', label: 'FORTUNE_1000' },
  { value: 'FORTUNE_500', label: 'FORTUNE_500' },
];
class BasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.props.companyInfo,
      openDialog: false,
      CompanyNameList: [],
      CompanyNameListCount: null,
      companyNameErrorMsg: null,
      errorMessage: Immutable.Map(),
      creating: false,
      additionalAddressErrorArr: [],
      leadSourceError: [],
      estimatedDealTimeError: [],
      salesLeadError: [],
      contactsError: [],
      serviceTypeError: [],
      addressError: [],
    };
  }
  _validateForm(formData, t) {
    let errorMessage = Immutable.Map();
    if (!formData.name) {
      errorMessage = errorMessage.set(
        'companyName',
        t('message:companyNameIsRequired')
      );
    }

    if (!formData.industry) {
      errorMessage = errorMessage.set(
        'industry',
        t('message:industryIsRequired')
      );
    }

    if (!formData.website) {
      errorMessage = errorMessage.set(
        'CompanyWebsite',
        t('message:companyWebsiteIsRequired')
      );
    }

    if (!formData.primaryAddress.address) {
      errorMessage = errorMessage.set(
        'primaryAddressesAddress',
        t('message:primaryAddressesAddressIsRequired')
      );
    }
    if (!formData.primaryAddress.cityId) {
      errorMessage = errorMessage.set(
        'primaryAddressesCity',
        t('message:primaryAddressesCityIsRequired')
      );
    }
    if (formData.additionalAddress.length > 0) {
      let status = formData.additionalAddress.filter((item, index) => {
        return item.location && !item.cityId;
      });
      let status_1 = formData.additionalAddress.filter((item, index) => {
        return !item.address && item.cityId;
      });
      let arr = [];
      let arr1 = [];
      formData.additionalAddress.forEach((item, index) => {
        if (item.location && item.location !== null && item.cityId === null) {
          arr.push({ key: index, error: true });
        } else {
          arr.push({ key: index, error: false });
        }
        if (!item.address && item.cityId) {
          arr1.push({ key: index, error: true });
        } else {
          arr1.push({ key: index, error: false });
        }
      });
      this.setState({
        additionalAddressErrorArr: arr,
        addressError: arr1,
      });
      if (status.length > 0) {
        errorMessage = errorMessage.set(
          'additionalAddressCity',
          t('message:additionalAddressCityIsRequired')
        );
      }
      if (status_1.length > 0) {
        errorMessage = errorMessage.set(
          'additionalAddress',
          t('message:additionalAddressIsRequired')
        );
      }
    }

    if (formData.teamNumbers.length === 0) {
      errorMessage = errorMessage.set(
        'teamMember',
        t('message:teamMemberIsRequired')
      );
    }
    if (formData.fortuneRank && !formData.sourceLink) {
      errorMessage = errorMessage.set(
        'sourceLink',
        t('message:sourceLinkIsRequired')
      );
    }

    if (formData.sourceLink) {
      let reg =
        /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
      if (!reg.test(formData.sourceLink)) {
        errorMessage = errorMessage.set(
          'sourceLink',
          t('message:sourceLinkTypeError')
        );
      }
    }

    if (formData.salesLead) {
      console.log(formData.salesLead);
      let _estimatedDealTimeError = [];
      let _leadSourceError = [];
      let salesLeadError = [];
      let contactsError = [];
      let serviceTypeError = [];
      formData.salesLead.forEach((item, index) => {
        let owners = item.owners;
        let contacts = item.contacts;
        console.log(contacts);
        let validate = this.ownersValidate(owners);
        let contactValidate = this.contactValidate(contacts);
        if (!validate) {
          owners.forEach((_item, _index) => {
            if (!_item.id) {
              salesLeadError.push({
                salesLeadIndex: index,
                ownerIndex: _index,
                errorMessage: true,
              });
            } else {
              salesLeadError.push({
                salesLeadIndex: index,
                ownerIndex: _index,
                errorMessage: false,
              });
            }
          });
          this.setState({
            salesLeadError,
          });
          errorMessage = errorMessage.set(
            'salesLeadOwner',
            t('message:salesLeadOwnerIsRequired')
          );
        }
        if (!contactValidate) {
          contacts.forEach((_item, _index) => {
            if (!_item.name || !_item.id) {
              contactsError.push({
                salesLeadIndex: index,
                contactIndex: _index,
                errorMessage: true,
              });
            } else {
              contactsError.push({
                salesLeadIndex: index,
                contactIndex: _index,
                errorMessage: false,
              });
            }
          });
          this.setState({
            contactsError,
          });
          errorMessage = errorMessage.set(
            'contacts',
            t('message:contactsIsRequired')
          );
        }

        // ownersValidateLsit.push(validate);
        // contactsValidateList.push(contactValidate);
        if (!item.estimatedDealTime) {
          _estimatedDealTimeError.push({
            salesLeadIndex: index,
            errorMessage: true,
          });
          errorMessage = errorMessage.set(
            'estimatedDealTime',
            t('message:estimatedDealTimeIsRequired')
          );
        } else {
          _estimatedDealTimeError.push({
            salesLeadIndex: index,
            errorMessage: false,
          });
        }
        this.setState({
          estimatedDealTimeError: _estimatedDealTimeError,
        });
        // if (!item.accountProgress) {
        //   errorMessage = errorMessage.set(
        //     'accountProgress',
        //     t('message:accountProgressIsRequired')
        //   );
        // }
        if (!item.leadSource) {
          _leadSourceError.push({ salesLeadIndex: index, errorMessage: true });
          errorMessage = errorMessage.set(
            'leadSource',
            t('message:leadSourceIsRequired')
          );
        } else {
          _leadSourceError.push({ salesLeadIndex: index, errorMessage: false });
        }
        this.setState({
          leadSourceError: _leadSourceError,
        });
        if (!item.serviceType || item.serviceType.length === 0) {
          serviceTypeError.push({ salesLeadIndex: index, errorMessage: true });
          errorMessage = errorMessage.set(
            'serviceType',
            t('message:serviceTypeIsRequired')
          );
        } else {
          serviceTypeError.push({ salesLeadIndex: index, errorMessage: false });
        }
        this.setState({
          serviceTypeError,
        });
      });
      //判断sales lead owner是否有空数据
      // if (
      //   ownersValidateLsit.some((item, index) => {
      //     return item === false;
      //   })
      // ) {
      //   // salesLeadError.push(index)
      //   errorMessage = errorMessage.set(
      //     'salesLeadOwner',
      //     t('message:salesLeadOwnerIsRequired')
      //   );
      // }
      // if (
      //   contactsValidateList.some((item, index) => {
      //     return item === false;
      //   })
      // ) {
      //   // contactsError.push(index)
      //   errorMessage = errorMessage.set(
      //     'contacts',
      //     t('message:contactsIsRequired')
      //   );
      // }
    }
    return errorMessage.size > 0 && errorMessage;
  }
  ownersValidate = (owners) => {
    let Validate = owners.every((item, index) => {
      return item.id;
    });
    return Validate;
  };

  contactValidate = (contacts) => {
    let Validate = contacts.every((item, index) => {
      return item.name || item.id;
    });
    return Validate;
  };

  inputChangeHandler = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;
    if (!value) {
      this.setState({
        companyNameErrorMsg: 'company Name is required',
      });
      return;
    } else {
      let newFormData = lodash.cloneDeep(this.state.formData);
      newFormData.name = value;
      this.setState({
        formData: newFormData,
        companyNameErrorMsg: null,
      });
      //调接口，看输入的名称是否存在如果存在，弹出弹框
      if (!this.props.companyInfo) {
        validateProspectName(value).then((res) => {
          if (res.response) {
            let list = res.response;
            if (list.length > 0) {
              this.setState({
                CompanyNameList: list,
                CompanyNameListCount: list.length,
                openDialog: true,
              });
            }
          }
        });
      }
    }
  };

  sourceLinkChange = (event) => {
    const link = event.target.value;
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.sourceLink = link;
    this.setState({
      formData: newFormData,
    });
  };

  primary = () => {
    prospectCheckname(this.state.formData.name).then((res) => {
      if (res.response.length > 0) {
        this.setState({
          companyNameErrorMsg: 'Company name already exists',
          openDialog: false,
        });
      } else {
        this.setState({
          openDialog: false,
        });
      }
    });
  };

  primaryAddress = (event) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.primaryAddress.address = event.target.value;
    this.setState({
      formData: newFormData,
    });
  };

  changeIndustry = (val) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.industry = val;
    this.setState({
      formData: newFormData,
    });
  };
  getPrimaryAddressCity = (value) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (typeof value === 'string') {
      newFormData.primaryAddress.location = value;
      newFormData.primaryAddress.city = null;
      newFormData.primaryAddress.country = null;
      newFormData.primaryAddress.province = null;
      newFormData.primaryAddress.similarity = null;
      newFormData.primaryAddress.cityId = null;
      newFormData.primaryAddress.companyId = null;
      newFormData.primaryAddress.addressType = 'COMPANY';
    } else {
      newFormData.primaryAddress.city = value.city;
      newFormData.primaryAddress.country = value.country;
      newFormData.primaryAddress.province = value.province;
      newFormData.primaryAddress.similarity = value.similarity;
      newFormData.primaryAddress.cityId = value.cityId;
      newFormData.primaryAddress.companyId = null;
      newFormData.primaryAddress.addressType = 'COMPANY';
    }
    this.setState({
      formData: newFormData,
    });
    this.removeErrorMsgHandler('primaryAddressesCity');
  };
  addAddress = () => {
    let address = {
      address: '',
      address2: '',
      city: '',
      country: '',
      province: '',
      addressType: 'COMPANY',
      cityId: null,
      companyAddressType: 'OTHER',
      language: '',
    };
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (this.state.additionalAddressErrorArr.length > 0) {
      let _additionalAddressErrorArr = lodash.cloneDeep(
        this.state.additionalAddressErrorArr
      );
      _additionalAddressErrorArr.push({ key: null, error: false });
      this.setState({
        additionalAddressErrorArr: _additionalAddressErrorArr,
      });
    }
    if (this.state.addressError.length > 0) {
      let addressError = lodash.cloneDeep(this.state.addressError);
      addressError.push({ key: null, error: false });
      this.setState({
        addressError,
      });
    }
    newFormData.additionalAddress.push(address);
    this.setState({ formData: newFormData });
  };
  deleteAddress = (index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _additionalAddressErrorArr = lodash.cloneDeep(
      this.state.additionalAddressErrorArr
    );
    let _addressError = lodash.cloneDeep(this.state.addressError);
    if (_additionalAddressErrorArr.length > 0) {
      _additionalAddressErrorArr.splice(index, 1);
    }
    if (_addressError.length > 0) {
      _addressError.splice(index, 1);
    }
    newFormData.additionalAddress.splice(index, 1);
    this.setState({
      formData: newFormData,
      additionalAddressErrorArr: _additionalAddressErrorArr,
      addressError: _addressError,
    });
  };

  getadditionalAddress = (val, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _addressError = lodash.cloneDeep(this.state.addressError);
    if (_addressError.length > 0) {
      _addressError[index].error = false;
    }
    newFormData.additionalAddress[index].address = val;
    this.setState({
      formData: newFormData,
      addressError: _addressError,
    });
  };

  getadditionalAddressCity = (val, index) => {
    const { additionalAddressErrorArr } = this.state;
    let _additionalAddressErrorArr = lodash.cloneDeep(
      additionalAddressErrorArr
    );
    if (_additionalAddressErrorArr.length > 0) {
      _additionalAddressErrorArr[index].error = false;
    }
    this.setState({
      additionalAddressErrorArr: _additionalAddressErrorArr,
    });
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (typeof val === 'string') {
      newFormData.additionalAddress[index].location = val;
      newFormData.additionalAddress[index].cityId = null;
      newFormData.additionalAddress[index].city = null;
      newFormData.additionalAddress[index].country = null;
      newFormData.additionalAddress[index].province = null;
    } else {
      newFormData.additionalAddress[index].city = val.city;
      newFormData.additionalAddress[index].country = val.country;
      newFormData.additionalAddress[index].province = val.province;
      newFormData.additionalAddress[index].similarity = val.similarity;
      newFormData.additionalAddress[index].cityId = val.cityId;
      newFormData.additionalAddress[index].companyId = null;
      newFormData.additionalAddress[index].addressType = 'COMPANY';
      newFormData.additionalAddress[index].location = null;
    }
    this.setState({
      formData: newFormData,
    });
  };

  //添加salesLead
  addSalesLead = () => {
    let obj = {
      accountProgress: 0,
      contacts: [{}],
      estimatedDealTime: '',
      leadSource: '',
      otherSource: '',
      owners: [{}],
      salesLeadStatus: 'PROSPECT',
    };

    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.salesLead.push(obj);
    this.setState({
      formData: newFormData,
    });
  };

  //删除salesLead
  deleteSalesLead = (index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.salesLead.splice(index, 1);
    this.setState({
      formData: newFormData,
    });
  };

  //添加新的联系人
  getNewContact = (contact, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (
      newFormData.salesLead[index].contacts.length > 0 &&
      !newFormData.salesLead[index].contacts[0].name
    ) {
      newFormData.salesLead[index].contacts.splice(0, 1, contact);
    } else {
      newFormData.salesLead[index].contacts.push(contact);
    }
    this.setState({
      formData: newFormData,
    });
    this.removeErrorMsgHandler('contacts');
  };

  //删除联系人
  deleteContact = (index, key) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (newFormData.salesLead[index].contacts.length === 1) {
      newFormData.salesLead[index].contacts[key] = {};
    } else {
      newFormData.salesLead[index].contacts.splice(key, 1);
    }
    this.setState({
      formData: newFormData,
    });
    this.removeErrorMsgHandler('contacts');
  };
  //添加saleleadowner
  addShare = (index) => {
    console.log(1);
    let ownerShare = {
      activated: true,
      divisionId: 0,
      email: '',
      firstName: '',
      id: 0,
      lastName: '',
      tenantId: 0,
      username: '',
    };
    let newFormData = lodash.cloneDeep(this.state.formData);
    console.log(newFormData.salesLead);
    newFormData.salesLead[index].owners.push(ownerShare);
    this.setState({
      formData: newFormData,
    });
  };
  //删除owner
  deleteOwner = (index, key) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _salesLeadError = lodash.cloneDeep(this.state.salesLeadError);
    newFormData.salesLead[index].owners.splice(key, 1);
    _salesLeadError.forEach((_item, _index) => {
      if (_item.salesLeadIndex === index && _item.ownerIndex === key) {
        _item.errorMessage = false;
      }
    });
    this.setState({
      formData: newFormData,
      salesLeadError: _salesLeadError,
    });
    // this.removeErrorMsgHandler('salesLeadOwner');
  };
  //选择owner
  changeOwner = (index, key, owner) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _salesLeadError = lodash.cloneDeep(this.state.salesLeadError);
    newFormData.salesLead[index].owners[key] = owner;
    _salesLeadError.forEach((_item, _index) => {
      if (_item.salesLeadIndex === index && _item.ownerIndex === key) {
        _item.errorMessage = false;
      }
    });
    this.setState({
      formData: newFormData,
      salesLeadError: _salesLeadError,
    });
    // this.removeErrorMsgHandler('salesLeadOwner');
  };
  //estimated Deal Time
  setEstimatedDealTime = (time, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _estimatedDealTimeError = lodash.cloneDeep(
      this.state.estimatedDealTimeError
    );
    newFormData.salesLead[index].estimatedDealTime = time.toJSON();
    if (_estimatedDealTimeError.length > 0) {
      _estimatedDealTimeError[index].errorMessage = false;
    }
    this.setState({
      formData: newFormData,
      estimatedDealTimeError: _estimatedDealTimeError,
    });
    // this.removeErrorMsgHandler('estimatedDealTime');
  };

  //accountprogress
  changeAccountProgress = (account, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.salesLead[index].accountProgress = account.value;
    this.setState({
      formData: newFormData,
    });
    // this.removeErrorMsgHandler('accountProgress');
  };

  //lead Source
  changeLeadSource = (source, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _leadSourceError = lodash.cloneDeep(this.state.leadSourceError);
    newFormData.salesLead[index].leadSource = source.value;
    if (_leadSourceError.length > 0) {
      _leadSourceError[index].errorMessage = false;
    }
    this.setState({
      formData: newFormData,
      leadSourceError: _leadSourceError,
    });
    // this.removeErrorMsgHandler('leadSource');
  };

  //sendServiceType
  sendServiceType = (checkedList, index) => {
    let serviceType = [];
    checkedList.forEach((item, index) => {
      // serviceType.push(item.id);
      serviceType.push({
        id: item.id,
        label: item.label,
      });
    });
    let newFormData = lodash.cloneDeep(this.state.formData);
    let _serviceTypeError = lodash.cloneDeep(this.state.serviceTypeError);
    newFormData.salesLead[index].serviceType = serviceType;
    if (_serviceTypeError.length > 0) {
      _serviceTypeError[index].errorMessage = false;
    }
    this.setState({
      formData: newFormData,
      serviceTypeError: _serviceTypeError,
    });
    // this.removeErrorMsgHandler('serviceType');
  };

  setContact = (name, key, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.salesLead[index].contacts[key] = name;
    this.setState({
      formData: newFormData,
    });
    this.removeErrorMsgHandler('contacts');
  };
  //
  handleCheck = (user) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    let userIndex = null;
    if (newFormData.teamNumbers && newFormData.teamNumbers.length > 0) {
      if (
        newFormData.teamNumbers.some((item, index) => {
          if (item.id === user.id || item.userId === user.id) {
            userIndex = index;
            return true;
          }
        })
      ) {
        newFormData.teamNumbers.splice(userIndex, 1);
      } else {
        newFormData.teamNumbers.push(user);
      }
    } else {
      newFormData.teamNumbers.push(user);
    }
    console.log(newFormData);
    this.setState({
      formData: newFormData,
    });
    this.removeErrorMsgHandler('teamMember');
  };

  ////
  getowners = (arr) => {
    let _arr = arr.map((item, index) => {
      return {
        userId: item.id,
        fullName: item.fullName,
        contribution: null,
        salesLeadRoleType: 'SALES_LEAD_OWNER',
      };
    });
    return _arr;
  };

  createCompany = () => {
    const { t } = this.props;
    this.setState({ creating: true });
    console.log(this.state.formData);
    let errorMessage = this._validateForm(this.state.formData, t);
    if (errorMessage) {
      return this.setState({ errorMessage, creating: false });
    }
    let newFormData = lodash.cloneDeep(this.state.formData);
    let newAdditionalAddress = [];
    this.state.formData.additionalAddress.forEach((item, index) => {
      if (item.cityId !== null && item.address !== '') {
        newAdditionalAddress.push(item);
      }
    });
    newFormData.additionalAddress = newAdditionalAddress;
    let addresses = [
      newFormData.primaryAddress,
      ...newFormData.additionalAddress,
    ];
    let companyAddresses = addresses.map((item, index) => {
      return {
        address: item.address,
        companyAddressType: item.companyAddressType,
        geoInfoEN: {
          cityId: item.cityId,
        },
      };
    });
    let salesLeadDetails = newFormData.salesLead.map((item, index) => {
      return {
        accountProgress: item.accountProgress,
        salesLeadClientContacts: item.contacts,
        estimatedDealTime: item.estimatedDealTime,
        leadSource: item.leadSource,
        otherSource: item.otherSource,
        salesLeadsOwner: this.getowners(item.owners),
        salesLeadStatus: item.salesLeadStatus,
        companyServiceTypes: item.serviceType,
      };
    });
    let companyAssignTeamMembers = newFormData.teamNumbers.map(
      (item, index) => {
        return {
          userId: item.id,
          fullName: item.fullName,
        };
      }
    );
    let companyDetail = {
      logo: newFormData.logo,
      name: newFormData.name,
      industry: newFormData.industry,
      website: newFormData.website,
      fortuneRank: newFormData.fortuneRank,
      sourceLink: newFormData.sourceLink,
      businessRevenue: newFormData.businessRevenue,
      staffSizeType: newFormData.staffSizeType,
      linkedinCompanyProfile: newFormData.linkedinCompanyProfile,
      crunchbaseCompanyProfile: newFormData.crunchbaseCompanyProfile,
      companyAssignTeamMembers: companyAssignTeamMembers,
      companyAddresses: companyAddresses,
      salesLeadDetails: salesLeadDetails,
      s3_link: null,
      organizationName: null,
    };
    if (!this.props.companyId) {
      companyDetail.type = 'POTENTIAL_CLIENT';
      companyDetail.active = true;
      this.props.dispatch(createCompany(companyDetail)).then((res) => {
        if (res) {
          let id = res.id;
          this.props.history.push(`/companies/detail/${id}/1`);
        } else {
          this.setState({ creating: false });
        }
      });
    } else {
      companyDetail.id = this.props.companyId;
      this.props.dispatch(putCompany(companyDetail)).then((res) => {
        if (res) {
          let id = res.id;
          this.setState({ creating: false });
          this.props.history.push(`/companies/detail/${id}/1`);
        } else {
          this.setState({ creating: false });
        }
      });
    }
  };

  //
  changeFortuneRank = (fortuneRank) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (fortuneRank) {
      if (fortuneRank.value !== '') {
        newFormData.fortuneRank = fortuneRank.value;
        this.setState({
          formData: newFormData,
        });
      }
    } else {
      newFormData.fortuneRank = null;
      this.setState({
        formData: newFormData,
      });
    }
  };

  onNewImage = (e) => {
    const fileTypes = ['bmp', 'jpg', 'jpeg', 'png'];
    const fileInput = e.target;
    const file = fileInput.files[0];
    let index = file.name.lastIndexOf('.');
    let fileType = file.name.substring(index + 1, file.name.length);
    //判断文件类型是否符合上传标准
    let status = fileTypes.includes(fileType.toLowerCase());

    if (status) {
      uploadAvatar(file).then((res) => {
        let newFormData = lodash.cloneDeep(this.state.formData);
        newFormData.logo = res.response.s3url;
        this.setState({ formData: newFormData });
      });
    } else {
      this.props.dispatch(showErrorMessage('The picture format is incorrect'));
    }
  };

  changeWebsite = (event) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.website = event.target.value;
    this.setState({
      formData: newFormData,
    });
  };

  checkedMember = (companyInfo) => {
    if (companyInfo && companyInfo.teamNumbers) {
      let newcheckedMember = companyInfo.teamNumbers.map((item, index) => {
        return {
          ...item,
        };
      });
      return newcheckedMember;
    } else {
      return [];
    }
  };
  setCheckName = (companyInfo) => {
    if (companyInfo && companyInfo.teamNumbers) {
      let newcheckedMember = companyInfo.teamNumbers.map((item, index) => {
        return {
          ...item,
        };
      });
      let names = [];
      newcheckedMember.forEach((val, index) => {
        names.push(val.fullName);
      });
      return names;
    } else {
      return [];
    }
  };

  OtherSource = (val, index) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.salesLead[index].otherSource = val;
    this.setState({
      formData: newFormData,
    });
  };

  setStaffSize = (staffsize) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.staffSizeType = staffsize.value;
    this.setState({
      formData: newFormData,
    });
  };

  setBusinessRevenue = (revenue) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.businessRevenue = revenue.value;
    this.setState({
      formData: newFormData,
    });
  };

  setlinkedInProfile = (e) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.linkedinCompanyProfile = e.target.value;
    this.setState({
      formData: newFormData,
    });
  };

  setCrunchbaseProfile = (e) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.crunchbaseCompanyProfile = e.target.value;
    this.setState({
      formData: newFormData,
    });
  };

  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  getCurLocation = (newValue) => {
    let data;
    let msg;
    if (typeof newValue === 'string') {
      data = { location: newValue, key: newValue };
      msg = newValue;
    } else if (newValue && newValue.inputValue) {
      data = { location: newValue.inputValue, key: newValue.inputValue };
      msg = newValue.inputValue;
    } else {
      if (newValue.similarity && newValue.cityId) {
        if (newValue.similarity === 'city') {
          data = {
            city: newValue.city,
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          msg =
            newValue.city + ', ' + newValue.province + ', ' + newValue.country;
        } else if (newValue.similarity === 'province') {
          data = {
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          msg = newValue.city + ', ' + newValue.province;
        } else {
          data = {
            country: newValue.country,
            key: newValue.show,
          };
          msg = newValue.country;
        }
      } else {
        msg = null;
      }
    }
    return msg;
  };

  render() {
    const { t, userList, companyInfo } = this.props;
    const {
      openDialog,
      errorMessage,
      CompanyNameList,
      CompanyNameListCount,
      companyNameErrorMsg,
      additionalAddressErrorArr,
      leadSourceError,
      estimatedDealTimeError,
      salesLeadError,
      contactsError,
      serviceTypeError,
      addressError,
    } = this.state;
    let curLocation;
    if (companyInfo) {
      curLocation = this.getCurLocation(companyInfo.primaryAddress);
    }
    console.log(userList.toJS());
    return (
      <div style={{ display: 'flex' }}>
        <CompanyLogo
          onNewImage={this.onNewImage}
          t={t}
          logoUrl={
            companyInfo && companyInfo.logo
              ? companyInfo.logo
              : this.state.formData.logo
          }
        />
        <section style={{ width: '65%' }}>
          <Typography variant="h6" style={{ color: '#cc4b37' }}>
            {errorMessage ? errorMessage.get('erroFromServer') : ''}
          </Typography>

          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                name="companyName"
                label={t('field:companyName')}
                defaultValue={
                  companyInfo ? companyInfo.name : this.state.formData.name
                }
                isRequired={true}
                onBlur={(event) => {
                  this.inputChangeHandler(event);
                  this.removeErrorMsgHandler('companyName');
                }}
                errorMessage={
                  errorMessage.get('companyName') || companyNameErrorMsg
                }
                maxLength={300}
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={t('field:industry')}
                isRequired={true}
                errorMessage={errorMessage.get('industry')}
              >
                <Select
                  name="industrySelect"
                  value={this.state.formData.industry}
                  onChange={(industry) => {
                    this.changeIndustry(industry);
                    this.removeErrorMsgHandler('industry');
                  }}
                  simpleValue
                  options={industryList}
                  searchable
                  clearable={false}
                  autoBlur={true}
                />
              </FormReactSelectContainer>
            </div>
          </div>
          <div className="row expanded">
            <div className="small-6 columns">
              {/* 公司网址 */}
              <FormInput
                name="Company Website"
                label={t('field:companyWebsite')}
                placeholder={`https://www.xxxx.com`}
                defaultValue={this.state.formData.website || ''}
                isRequired={true}
                onChange={(event) => {
                  this.changeWebsite(event);
                  this.removeErrorMsgHandler('CompanyWebsite');
                }}
                errorMessage={errorMessage.get('CompanyWebsite')}
              />
            </div>
            <div className="small-6 columns">
              {/* 公司财富排名 */}
              <FormReactSelectContainer label={t('field:Fortune Ranking')}>
                <Select
                  name="Fortune Ranking"
                  value={this.state.formData.fortuneRank}
                  onChange={this.changeFortuneRank}
                  options={fortuneRankingList}
                  valueKey={'value'}
                  labelKey={'label'}
                  autoBlur={true}
                  searchable={true}
                  clearable={true}
                />
              </FormReactSelectContainer>
            </div>
          </div>
          {/* 财富排名不为空时，显示该信息来源input */}
          {this.state.formData.fortuneRank ? (
            <div className="row expanded">
              <div className="small-6 columns"></div>
              <div className="small-6 columns">
                <FormInput
                  value={this.state.formData.sourceLink || ''}
                  onChange={this.sourceLinkChange}
                  placeholder={`Please provide a source link`}
                  errorMessage={errorMessage.get('sourceLink')}
                />
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                name="Primary Address"
                label={t('field:PrimaryAddress')}
                defaultValue={this.state.formData.primaryAddress.address || ''}
                isRequired={true}
                onChange={(event) => {
                  this.primaryAddress(event);
                  this.removeErrorMsgHandler('primaryAddressesAddress');
                }}
                errorMessage={errorMessage.get('primaryAddressesAddress')}
              />
            </div>
            <div className="small-6 columns" style={{ paddingTop: '4px' }}>
              <div className="row expanded">
                <div
                  className="small-9 columns"
                  style={
                    errorMessage && errorMessage.get('primaryAddressesCity')
                      ? {
                          fontSize: '12px',
                          height: '16px',
                          padding: '0px',
                          fontFamily: 'Roboto',
                          color: '#cc4b37',
                        }
                      : {
                          fontSize: '12px',
                          height: '16px',
                          padding: '0px',
                          fontFamily: 'Roboto',
                        }
                  }
                >
                  {t('field:PrimaryAddressCityStateCountry')}{' '}
                  <span style={{ color: '#cc4b37' }}>*</span>
                </div>
              </div>
              <div className="row expanded">
                <div className="small-12 columns" style={{ padding: '0px' }}>
                  <Location
                    curLoaction={curLocation}
                    city={
                      companyInfo && companyInfo.primaryAddress
                        ? companyInfo.primaryAddress
                        : null
                    }
                    getLocation={(value) => {
                      this.getPrimaryAddressCity(value);
                    }}
                    errorMessage={errorMessage}
                    removeErrorMsgHandler={this.removeErrorMsgHandler}
                  />
                  {/* <span
                    style={{
                      color: '#cc4b37',
                      fontSize: '0.75em',
                      fontWeight: 'bold',
                    }}
                  >
                    {errorMessage && errorMessage.get('primaryAddressesCity')
                      ? errorMessage.get('primaryAddressesCity')
                      : null}
                  </span> */}
                </div>
              </div>
            </div>
          </div>
          <AdditionalAddress
            {...this.props}
            t={t}
            additionalAddress={this.state.formData.additionalAddress}
            addAddress={() => {
              this.addAddress();
            }}
            deleteAddress={(index) => {
              this.deleteAddress(index);
            }}
            getadditionalAddress={(val, index) => {
              this.getadditionalAddress(val, index);
            }}
            getadditionalAddressCity={(value, index) => {
              this.getadditionalAddressCity(value, index);
            }}
            errorMessage={errorMessage}
            additionalAddressErrorArr={additionalAddressErrorArr}
            addressError={addressError}
          />
          <Divider />
          {/* Sales Lader 部分 */}
          <SalesLead
            {...this.props}
            salesLead={this.state.formData.salesLead}
            addSalesLead={() => {
              this.addSalesLead();
            }}
            getNewContact={(contact, index) => {
              this.getNewContact(contact, index);
            }}
            deleteSalesLead={(index) => {
              this.deleteSalesLead(index);
            }}
            deleteContact={(index, key) => {
              this.deleteContact(index, key);
            }}
            addShare={(index) => this.addShare(index)}
            deleteOwner={(index, key) => {
              this.deleteOwner(index, key);
            }}
            changeOwner={(index, key, owner) => {
              this.changeOwner(index, key, owner);
            }}
            setEstimatedDealTime={(time, index) => {
              this.setEstimatedDealTime(time, index);
            }}
            changeAccountProgress={(account, index) => {
              this.changeAccountProgress(account, index);
            }}
            changeLeadSource={(source, index) => {
              this.changeLeadSource(source, index);
            }}
            sendServiceType={(checkedList, index) => {
              this.sendServiceType(checkedList, index);
            }}
            OtherSource={(val, index) => {
              this.OtherSource(val, index);
            }}
            setContact={(name, key, index) => {
              this.setContact(name, key, index);
            }}
            errorMessage={errorMessage}
            leadSourceError={leadSourceError}
            estimatedDealTimeError={estimatedDealTimeError}
            salesLeadError={salesLeadError}
            contactsError={contactsError}
            serviceTypeError={serviceTypeError}
          />
          <Divider />
          {/* Team Member 部分 */}
          <div className="row expanded" style={{ margin: '10px 0px' }}>
            <div className="small-6 columns">
              {/* <TeamMember
                label={`Assign Team Member`}
                checkedMember={this.checkedMember(this.state.formData)}
                teamMember={userList}
                handleCheck={(user) => {
                  this.handleCheck(user);
                }}
              />
              <p
                style={{
                  color: '#cc4b37',
                  fontSize: '0.75em',
                  fontWeight: 'bold',
                }}
              >
                {errorMessage && errorMessage.get('teamMember')
                  ? errorMessage.get('teamMember')
                  : null}
              </p> */}
              <UserSearchSelect
                label={t('field:AssignTeamMember')}
                checkedMember={this.checkedMember(this.state.formData)}
                checkedName={this.setCheckName(this.state.formData)}
                teamMember={userList}
                handleCheck={(user) => {
                  this.handleCheck(user);
                }}
                errorMessage={errorMessage}
              />
              <p
                style={{
                  color: '#cc4b37',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  fontFamily: 'Roboto',
                }}
              >
                {errorMessage && errorMessage.get('teamMember')
                  ? errorMessage.get('teamMember')
                  : null}
              </p>
            </div>
          </div>
          <Divider />
          {companyInfo ? (
            <div>
              <Typography style={{ marginBottom: '10px' }}>
                Additional Information
              </Typography>
              <div className="row expanded" style={{ marginTop: '10px' }}>
                <div className="small-6 columns">
                  <FormReactSelectContainer label={t('field:Staff Size')}>
                    <Select
                      name="Staff Size"
                      value={
                        companyInfo && companyInfo.staffSizeType
                          ? companyInfo.staffSizeType
                          : this.state.formData.staffSizeType
                      }
                      onChange={(staffSize) => this.setStaffSize(staffSize)}
                      options={staffSize}
                      valueKey={'value'}
                      labelKey={'label'}
                      autoBlur={true}
                      searchable={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
                <div className="small-6 columns">
                  <FormReactSelectContainer label={t('field:Business Revenue')}>
                    <Select
                      name="Business Revenue"
                      value={
                        companyInfo && companyInfo.businessRevenue
                          ? companyInfo.businessRevenue
                          : this.state.formData.businessRevenue
                      }
                      onChange={(revenue) => this.setBusinessRevenue(revenue)}
                      options={businessRevenue}
                      valueKey={'value'}
                      labelKey={'label'}
                      autoBlur={true}
                      searchable={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>
              <div className="row expanded" style={{ marginTop: '10px' }}>
                <div className="small-6 columns">
                  <FormInput
                    name="Company Website"
                    label={t('field:LinkedIn Company Profile')}
                    value={this.state.formData.linkedinCompanyProfile}
                    onChange={(e) => {
                      this.setlinkedInProfile(e);
                    }}
                    placeholder={``}
                  />
                </div>
                <div className="small-6 columns">
                  <FormInput
                    name="Company Website"
                    label={t('field:Crunchbase Company Profile')}
                    value={this.state.formData.crunchbaseCompanyProfile}
                    onChange={(e) => {
                      this.setCrunchbaseProfile(e);
                    }}
                    placeholder={``}
                  />
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
          <div className="row expanded" style={{ marginTop: '10px' }}>
            <Button
              // variant="contained"
              color="primary"
              onClick={() => {
                if (this.props.match.params.id) {
                  this.props.history.replace(
                    `/companies/detail/${this.props.match.params.id}/1`
                  );
                } else {
                  this.props.history.replace('/companies?tab=client');
                }
              }}
              style={{ marginRight: '10px' }}
            >
              Cancel
            </Button>
            {/* <Button
              style={{ marginLeft: '10px' }}
              variant="contained"
              color="primary"
              onClick={() => {
                this.createCompany();
              }}
            >
              Save
            </Button> */}
            <PrimaryButton
              type="Button"
              style={{ minWidth: 100 }}
              processing={this.state.creating}
              name="submit"
              onClick={() => {
                this.createCompany();
              }}
            >
              {t('action:save')}
            </PrimaryButton>
          </div>
          <MyDialog
            btnShow={true}
            show={openDialog}
            modalTitle={`Create Prospect`}
            SubmitBtnShow={true}
            SubmitBtnMsg={'Ignore'}
            SumbitBtnVariant={'contained'}
            primary={() => {
              this.primary();
            }}
            handleClose={() => {
              this.setState({
                openDialog: false,
              });
            }}
          >
            <CompanyNameTemplate
              CompanyNameList={CompanyNameList}
              CompanyNameListCount={CompanyNameListCount}
            />
          </MyDialog>
        </section>
      </div>
    );
  }
}

export default withTranslation(['action', 'message', 'field'])(BasicInfo);
