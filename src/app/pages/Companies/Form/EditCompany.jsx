import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import lodash from 'lodash';
import { connect } from 'react-redux';
import { uploadAvatar } from '../../../../apn-sdk/files';
import {
  putClientInfo,
  getPotentialServiceType,
} from '../../../actions/clientActions';
import { getClientInfo } from '../../../../apn-sdk/client';
import { getTenantUserList } from '../../../selectors/userSelector';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import NextSecondaryButton from '../../../components/particial/SecondaryButton';
import ClientBasicInfo from './ClientBasicInfo';
import AdditionalInfo from './AdditionalInfo';
import Loading from '../../../components/particial/Loading';
import BDInformation from './BDInformation';
import CompanyLogo from './CompanyLogo';
import { replace } from 'connected-react-router';
import { showErrorMessage } from '../../../actions/index';
class CompanyEdition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      showAdditionalInfo: false,
      creating: false,
      primaryAddresses: null,
      additionalAddresses: null,
      salesLead: null,
      organization: null,
      additionalAddressErrorArr: [],
      serviceTypeError: [],
      accountManagerError: [],
      percentageError: [],
      ownerError: [],
      addressError: [],
      fortuneRank: null,
    };
  }

  componentWillMount() {
    this.fetchData();
    getClientInfo(this.props.match.params.id)
      .then((res) => {
        let newSalesLead = [
          {
            accountManager: [],
            bdManagers: [{}],
            owners: [{}],
            serviceType: [],
          },
        ];
        if (!res.response.salesLeadDetails) {
          res.response.salesLeadDetails = newSalesLead;
        }
        this.setState({
          companyInfo: res.response,
          salesLead: res.response.salesLeadDetails,
          active: res.response.active,
        });
      })
      .catch((err) => {
        if (err.status === 404) {
          this.props.dispatch(replace('/companies/nomatch'));
        } else {
          this.props.dispatch(showErrorMessage(err));
        }
      });
  }

  fetchData() {
    this.props.dispatch(getPotentialServiceType());
  }

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();
    console.log(form);
    if (!form.name) {
      errorMessage = errorMessage.set(
        'companyName',
        t('message:companyNameIsRequired')
      );
    }
    // if (form.type.value) {
    //   errorMessage = errorMessage.set('type', t('message:levelIsRequired'));
    // }
    if (!form.industry) {
      errorMessage = errorMessage.set(
        'industry',
        t('message:industryIsRequired')
      );
    }
    if (!form.website) {
      errorMessage = errorMessage.set(
        'CompanyWebsite',
        t('message:CompanyWebsiteIsRequired')
      );
    }
    if (form.website) {
      let reg =
        /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
      if (!reg.test(form.website)) {
        errorMessage = errorMessage.set(
          'CompanyWebsite',
          t('message:CompanyWebsiteTypeError')
        );
      }
    }
    if (!form.clientLevel) {
      errorMessage = errorMessage.set('level', t('message:levelIsRequired'));
    }

    if (!form.primaryAddress || !form.primaryAddress.address) {
      errorMessage = errorMessage.set(
        'primaryAddressesAddress',
        t('message:primaryAddressesAddressIsRequired')
      );
    }
    if (!form.primaryAddress || !form.primaryAddress.geoInfoEN.cityId) {
      errorMessage = errorMessage.set(
        'primaryAddressesCity',
        t('message:primaryAddressesCityIsRequired')
      );
    }
    if (form.additionalAddresses.length > 0) {
      let status = form.additionalAddresses.filter((item, index) => {
        return item.geoInfoEN.location && !item.geoInfoEN.cityId;
      });
      let status_1 = form.additionalAddresses.filter((item, index) => {
        return !item.address;
      });
      let arr = [];
      let arr1 = [];
      form.additionalAddresses.forEach((item, index) => {
        if (
          item.geoInfoEN.location &&
          item.geoInfoEN.location !== null &&
          item.geoInfoEN.cityId === null
        ) {
          arr.push({ key: index, error: true });
        } else {
          arr.push({ key: index, error: false });
        }
        if (!item.address && item.geoInfoEN.cityId) {
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
    if (form.fortuneRank && !form.sourceLink) {
      errorMessage = errorMessage.set(
        'sourceLink',
        t('message:sourceLinkIsRequired')
      );
    }
    if (form.sourceLink) {
      let reg =
        /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;
      if (!reg.test(form.sourceLink)) {
        errorMessage = errorMessage.set(
          'sourceLink',
          t('message:sourceLinkTypeError')
        );
      }
    }
    if (this.state.salesLead) {
      let serviceTypeError = [];
      let accountManagerError = [];
      let ownerError = [];
      let percentageError = [];
      form.salesLead.forEach((item, index) => {
        if (
          !item.companyServiceTypes ||
          item.companyServiceTypes.length === 0
        ) {
          serviceTypeError.push({ salesLeadIndex: index, errorMessage: true });
          errorMessage = errorMessage.set(
            'serviceType',
            t('message:serviceTypeIsRequired')
          );
        } else {
          serviceTypeError.push({ salesLeadIndex: index, errorMessage: false });
        }

        if (!item.accountManagers || item.accountManagers.length === 0) {
          accountManagerError.push({
            salesLeadIndex: index,
            errorMessage: true,
          });
          errorMessage = errorMessage.set(
            'accountManager',
            t('message:accountManagerIsRequired')
          );
        } else {
          accountManagerError.push({
            salesLeadIndex: index,
            errorMessage: false,
          });
        }
        let ownersValidate = this.setOwnersErrorMessage(item.salesLeadsOwner);
        let bdValidate = this.setBdCommissionErrorMessage(
          item.businessDevelopmentOwner
        );
        if (ownersValidate.hasOwners || bdValidate.hasbds) {
          ownerError.push({ salesLeadIndex: index, errorMessage: true });
          errorMessage = errorMessage.set(
            'ownerError',
            t('message:ownerError')
          );
        } else {
          ownerError.push({ salesLeadIndex: index, errorMessage: false });
        }
        if (
          ownersValidate.ownersPercentage > 50 ||
          bdValidate.bdPercentage > 50 ||
          bdValidate.bdPercentage + ownersValidate.ownersPercentage !== 100
        ) {
          percentageError.push({ salesLeadIndex: index, errorMessage: true });
          errorMessage = errorMessage.set(
            'percentageError',
            t('message:percentageError')
          );
        } else {
          percentageError.push({ salesLeadIndex: index, errorMessage: false });
        }

        this.setState({
          serviceTypeError,
          accountManagerError,
          percentageError,
          ownerError,
        });
      });
    }
    return errorMessage.size > 0 && errorMessage;
  }

  setOwnersErrorMessage = (owners) => {
    let ownersPercentage = 0;
    let hasOwners = owners.some((item, index) => {
      return !item.userId;
    });
    owners.forEach((item, index) => {
      ownersPercentage += item.contribution;
    });
    return {
      hasOwners,
      ownersPercentage,
    };
  };

  setBdCommissionErrorMessage = (bd) => {
    let bdPercentage = 0;
    let hasbds = bd.some((item, index) => {
      return !item.userId;
    });
    bd.forEach((item, index) => {
      console.log(item);
      bdPercentage += item.contribution;
    });
    console.log(bdPercentage);
    return {
      hasbds,
      bdPercentage,
    };
  };

  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  submitEditCompanyHandler = (e) => {
    e.preventDefault();
    const editCompanyForm = e.target;
    this.setState({ creating: true });
    let company = {
      name: editCompanyForm.companyName.value,
      logo:
        this.state.logoUrl ||
        (this.state.companyInfo && this.state.companyInfo.logo),
      // "type": editCompanyForm.potential.checked ? 'POTENTIAL_CLIENT' : editCompanyForm.type.value,
      industry: editCompanyForm.industry.value,
      // "accountManager": editCompanyForm.accountManager.value,
      clientLevel: editCompanyForm.level.value,
      website:
        editCompanyForm.CompanyWebsite && editCompanyForm.CompanyWebsite.value,
      primaryAddress: this.state.primaryAddresses
        ? this.state.primaryAddresses
        : this.state.companyInfo.companyAddresses.filter((item, index) => {
            return item.companyAddressType === 'PRIMARY';
          })[0],
      additionalAddresses: this.state.additionalAddresses
        ? this.state.additionalAddresses
        : this.state.companyInfo.companyAddresses.filter((item, index) => {
            return item.companyAddressType !== 'PRIMARY';
          }),
      staffSizeType:
        editCompanyForm.size.value !== '' ? editCompanyForm.size.value : null,
      businessRevenue:
        editCompanyForm.businessRevenue.value !== ''
          ? editCompanyForm.businessRevenue.value
          : null,
      organizationName:
        editCompanyForm.organizationNameSelect.value !== ''
          ? editCompanyForm.organizationNameSelect.value
          : null,
      fortuneRank: this.state.fortuneRank ? this.state.fortuneRank.value : null,
      linkedinCompanyProfile: editCompanyForm.linkedInCompanyProfile.value,
      crunchbaseCompanyProfile: editCompanyForm.crunchbaseCompanyProfile.value,
      description: editCompanyForm.note.value,
      salesLead: this.state.salesLead,
      active: this.state.active,
      sourceLink:
        editCompanyForm.sourceLink && editCompanyForm.sourceLink.value,
    };
    console.log(company);
    let errorMessage = this._validateForm(company, this.props.t);
    if (errorMessage) {
      this.setState({ creating: false });
      return this.setState({ errorMessage });
    }

    let newFormData = lodash.cloneDeep(company);
    let newAdditionalAddress = [];
    company.additionalAddresses.forEach((item, index) => {
      if (item.cityId !== null && item.address !== '') {
        newAdditionalAddress.push(item);
      }
    });
    newFormData.additionalAddresses = newAdditionalAddress;
    let _companyAddresses = [
      newFormData.primaryAddress,
      ...newFormData.additionalAddresses,
    ];
    let obj = {
      id: this.props.match.params.id,
      logo: newFormData.logo,
      name: newFormData.name,
      industry: newFormData.industry,
      website: newFormData.website,
      fortuneRank: newFormData.fortuneRank,
      businessRevenue: newFormData.businessRevenue,
      staffSizeType: newFormData.staffSizeType,
      linkedinCompanyProfile: newFormData.linkedinCompanyProfile,
      crunchbaseCompanyProfile: newFormData.crunchbaseCompanyProfile,
      description: newFormData.description,
      organizationName: newFormData.organizationName,
      companyClientLevelType: newFormData.clientLevel,
      salesLeadDetails: newFormData.salesLead,
      companyAddresses: _companyAddresses,
      active: this.state.active,
    };
    this.props.dispatch(putClientInfo(obj)).then((id) => {
      if (id) {
        this.setState({ creating: false });
        this.props.history.push(`/companies/detail/${id}/0`);
      } else {
        this.setState({ creating: false });
      }
    });
  };

  toggleshowAdditionalInfo = () => {
    this.setState({ showAdditionalInfo: !this.state.showAdditionalInfo });
  };

  cancelCreationHandler = () => {
    this.props.history.replace(
      `/companies/detail/${this.props.match.params.id}/0`
    );
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
        // console.log('[[upload ]]', res.response.s3url);
        this.setState({ logoUrl: res.response.s3url });
      });
    } else {
      this.props.dispatch(showErrorMessage('The picture format is incorrect'));
    }
  };

  //////////////////////////////
  setPrimaryAddress = (address) => {
    this.setState({ primaryAddresses: address });
  };

  setAdditionalAddress = (address, index) => {
    const { additionalAddressErrorArr } = this.state;
    let _additionalAddressErrorArr = lodash.cloneDeep(
      additionalAddressErrorArr
    );
    if (_additionalAddressErrorArr.length > 0) {
      _additionalAddressErrorArr[index].error = false;
    }
    this.setState({
      additionalAddresses: address,
      additionalAddressErrorArr: _additionalAddressErrorArr,
    });
  };

  setBdCommission = (bd, index) => {
    let newSalesLead = lodash.cloneDeep(this.state.salesLead);
    let ownerError = lodash.cloneDeep(this.state.ownerError);
    let percentageError = lodash.cloneDeep(this.state.percentageError);
    if (ownerError.length > 0) {
      ownerError[index].errorMessage = false;
    }
    if (percentageError.length > 0) {
      percentageError[index].errorMessage = false;
    }
    newSalesLead[index].businessDevelopmentOwner = bd;
    this.setState({
      salesLead: newSalesLead,
      ownerError,
      percentageError,
    });
  };

  ownerCommission = (owners, index) => {
    let newSalesLead = lodash.cloneDeep(this.state.salesLead);
    let ownerError = lodash.cloneDeep(this.state.ownerError);
    let percentageError = lodash.cloneDeep(this.state.percentageError);
    if (ownerError.length > 0) {
      ownerError[index].errorMessage = false;
    }
    if (percentageError.length > 0) {
      percentageError[index].errorMessage = false;
    }
    newSalesLead[index].salesLeadsOwner = owners;
    this.setState({
      salesLead: newSalesLead,
      ownerError,
      percentageError,
    });
  };

  setAccountManager = (am, index) => {
    let newSalesLead = lodash.cloneDeep(this.state.salesLead);
    let _accountManagerError = lodash.cloneDeep(this.state.accountManagerError);
    if (_accountManagerError.length > 0) {
      _accountManagerError[index].errorMessage = false;
    }
    newSalesLead[index].accountManagers = am;
    this.setState({
      salesLead: newSalesLead,
      accountManagerError: _accountManagerError,
    });
  };

  changeChecked = (event) => {
    this.setState({
      active: !this.state.active,
    });
  };

  setServiceType = (serviceType, index) => {
    console.log(serviceType);
    let newSalesLead = lodash.cloneDeep(this.state.salesLead);
    newSalesLead[index].serviceType = serviceType;
    let _serviceTypeError = lodash.cloneDeep(this.state.serviceTypeError);
    if (_serviceTypeError.length > 0) {
      _serviceTypeError[index].errorMessage = false;
    }
    this.setState({
      salesLead: newSalesLead,
      serviceTypeError: _serviceTypeError,
    });
  };

  setOrganization = (organization) => {
    this.setState({ organization: organization });
  };

  hasError = (arr, index) => {
    let _arr = arr.filter((_item, _index) => {
      return _item.salesLeadIndex === index && _item.errorMessage === true;
    });
    if (_arr.length > 0) {
      return true;
    }
    return false;
  };

  setfortuneRank = (fortuneRank) => {
    this.setState({
      fortuneRank: fortuneRank,
    });
  };

  ///////
  render() {
    const { t, userList, serviceTypeTree } = this.props;
    const {
      showAdditionalInfo,
      logoUrl,
      companyInfo,
      active,
      additionalAddressErrorArr,
      serviceTypeError,
      accountManagerError,
      percentageError,
      ownerError,
      errorMessage,
      addressError,
    } = this.state;
    if (!companyInfo) {
      return <Loading />;
    }
    return (
      <Paper style={{ padding: '10px' }}>
        <div className="row expanded">
          <div className="small-10 columns">
            <Typography>Edit Client</Typography>
          </div>
          <div className="small-2 columns">
            <FormControlLabel
              value="start"
              control={
                <Switch
                  onChange={this.changeChecked}
                  checked={active}
                  color="primary"
                />
              }
              label="Active"
              labelPlacement="start"
            />
          </div>
        </div>
        {companyInfo && (
          <div style={{ padding: '20px', display: 'flex' }}>
            <CompanyLogo
              onNewImage={this.onNewImage}
              t={t}
              logoUrl={logoUrl || (companyInfo && companyInfo.logo)}
            />
            <form
              onSubmit={this.submitEditCompanyHandler}
              style={{ width: '70%' }}
              autoComplete="off"
            >
              <ClientBasicInfo
                t={t}
                removeErrorMsgHandler={this.removeErrorMsgHandler}
                errorMessage={this.state.errorMessage}
                {...this.props}
                companyInfo={companyInfo}
                setPrimaryAddress={(address) => {
                  this.setPrimaryAddress(address);
                }}
                setAdditionalAddress={(address, index) => {
                  this.setAdditionalAddress(address, index);
                }}
                additionalAddressErrorArr={additionalAddressErrorArr}
                addressError={addressError}
              />
              <Divider />
              <div style={{ padding: '0.25rem', margin: '10px 0' }}>
                <section
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Typography variant="h5" style={{ margin: '10px 0' }}>
                    {`Service Type & BD Information`}
                  </Typography>
                  {/* <IconButton onClick={this.toggleshowAdditionalInfo}>
                    {!showAdditionalInfo ? <ArrowDown /> : <ArrowUp />}
                  </IconButton> */}
                </section>
                {companyInfo && companyInfo.salesLeadDetails
                  ? companyInfo.salesLeadDetails.map((item, index) => {
                      return (
                        <div key={index}>
                          {companyInfo.salesLeadDetails.length > 1 ? (
                            <div
                              style={{
                                width: '100%',
                                backgroundColor: '#edf5ff',
                                padding: '2px',
                              }}
                            >
                              <Typography variant="h6">{`Service Type ${
                                index + 1
                              }`}</Typography>
                            </div>
                          ) : null}
                          <BDInformation
                            t={t}
                            removeErrorMsgHandler={this.removeErrorMsgHandler}
                            errorMessage={this.state.errorMessage}
                            name="BDInformation"
                            userList={userList}
                            companyInfo={item}
                            serviceTypeTree={serviceTypeTree}
                            setBdCommission={(bd) => {
                              this.setBdCommission(bd, index);
                            }}
                            ownerCommission={(owners) => {
                              this.ownerCommission(owners, index);
                            }}
                            setAccountManager={(accountManager) => {
                              this.setAccountManager(accountManager, index);
                            }}
                            setServiceType={(serviceType) => {
                              this.setServiceType(serviceType, index);
                            }}
                            serviceTypeError={serviceTypeError}
                            salesLeadIndex={index}
                            accountManagerError={accountManagerError}
                            percentageError={percentageError}
                            ownerError={ownerError}
                          />
                          {errorMessage &&
                          errorMessage.get('ownerError') &&
                          this.hasError(ownerError, index) ? (
                            <span
                              style={{
                                fontSize: '12px',
                                height: '16px',
                                paddingLeft: '4px',
                                fontFamily: 'Roboto',
                                color: '#cc4b37',
                                fontWeight: 'bold',
                              }}
                            >
                              {errorMessage.get('ownerError')}
                            </span>
                          ) : null}
                          {errorMessage &&
                          errorMessage.get('percentageError') &&
                          this.hasError(percentageError, index) ? (
                            <span
                              style={{
                                fontSize: '12px',
                                height: '16px',
                                paddingLeft: '4px',
                                fontFamily: 'Roboto',
                                color: '#cc4b37',
                                fontWeight: 'bold',
                              }}
                            >
                              {errorMessage.get('percentageError')}
                            </span>
                          ) : null}
                        </div>
                      );
                    })
                  : null}
              </div>
              <div style={{ padding: '0.25rem', margin: '10px 0' }}>
                <Divider />
                <Typography variant="h5" style={{ margin: '10px 0' }}>
                  Additional Information
                </Typography>
                <AdditionalInfo
                  t={t}
                  userList={userList}
                  removeErrorMsgHandler={this.removeErrorMsgHandler}
                  errorMessage={this.state.errorMessage}
                  // companyBriefList={companyBriefList}
                  companyInfo={companyInfo}
                  setOrganization={(val) => {
                    this.setOrganization(val);
                  }}
                  setfortuneRank={(fortuneRank) => {
                    this.setfortuneRank(fortuneRank);
                  }}
                />
                <Divider />
              </div>

              <div className="row expanded" style={{ marginTop: '20px' }}>
                <NextSecondaryButton
                  type="button"
                  name="cancel"
                  style={{ marginRight: '30px' }}
                  onClick={this.cancelCreationHandler}
                >
                  {t('action:cancel')}
                </NextSecondaryButton>
                <PrimaryButton
                  type="submit"
                  style={{ minWidth: 100 }}
                  processing={this.state.creating}
                  name="submit"
                >
                  {t('action:save')}
                </PrimaryButton>
              </div>
            </form>
          </div>
        )}
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  const authorities = state.controller.currentUser.get('authorities');
  const serviceTypeTree = state.model.serviceTypeTree.tree;
  return {
    serviceTypeTree: serviceTypeTree,
    userList: getTenantUserList(state),
    currentUser: state.controller.currentUser,
    isLimitUser:
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
  };
};

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStateToProps)(CompanyEdition)
);
