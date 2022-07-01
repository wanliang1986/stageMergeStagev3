import React, { Component } from 'react';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';

import { validateProspectName } from '../../../../apn-sdk/client';
import { industryList, levelList } from '../../../constants/formOptions';
import AdditionalAddress from './AdditionalAddress/AdditionalAddress';
import Location from '../../../components/Location';

class ClientBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: (props.companyInfo && props.companyInfo.name) || '',
      industry: (props.companyInfo && props.companyInfo.industry) || '',
      accountManager:
        (props.companyInfo && props.companyInfo.accountManager) || '',
      level:
        (props.companyInfo && props.companyInfo.companyClientLevelType) || '',
      website: (props.companyInfo && props.companyInfo.website) || '',
      primaryAddress:
        (props.companyInfo &&
          props.companyInfo.companyAddresses.filter((item, index) => {
            return item.companyAddressType === 'PRIMARY';
          }))[0] || {},
      additionalAddresses:
        (props.companyInfo &&
          props.companyInfo.companyAddresses.filter((item, index) => {
            return item.companyAddressType !== 'PRIMARY';
          })) ||
        {},
    };
  }

  websiteChange = (event) => {
    this.setState({
      website: event.target.value,
    });
  };

  inputChangeHandler = (event) => {
    const target = event.target;
    const name = target.name;
    let value = target.value;
    this.setState({
      companyName: value,
    });
    this.props.removeErrorMsgHandler('companyName');
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
  };
  primaryAddress = (event) => {
    let newPrimaryAddress = JSON.parse(
      JSON.stringify(this.state.primaryAddress)
    );
    newPrimaryAddress.address = event.target.value;
    this.setState({
      primaryAddress: newPrimaryAddress,
    });
    this.props.removeErrorMsgHandler('primaryAddressesAddress');
    this.props.setPrimaryAddress(newPrimaryAddress);
  };

  getPrimaryAddressCity = (value) => {
    let newPrimaryAddress = JSON.parse(
      JSON.stringify(this.state.primaryAddress)
    );
    if (typeof value === 'string') {
      newPrimaryAddress.address = value;
      newPrimaryAddress.geoInfoEN.city = null;
      newPrimaryAddress.geoInfoEN.country = null;
      newPrimaryAddress.geoInfoEN.province = null;
      newPrimaryAddress.geoInfoEN.similarity = null;
      newPrimaryAddress.geoInfoEN.cityId = null;
      newPrimaryAddress.companyAddressType = 'PRIMARY';
    } else {
      newPrimaryAddress.geoInfoEN.city = value.city;
      newPrimaryAddress.geoInfoEN.country = value.country;
      newPrimaryAddress.geoInfoEN.province = value.province;
      newPrimaryAddress.geoInfoEN.similarity = value.similarity;
      newPrimaryAddress.geoInfoEN.cityId = value.cityId;
      newPrimaryAddress.companyAddressType = 'PRIMARY';
    }
    this.setState({
      primaryAddress: newPrimaryAddress,
    });
    this.props.removeErrorMsgHandler('primaryAddressesCity');
    this.props.setPrimaryAddress(newPrimaryAddress);
  };

  addAddress = () => {
    // let address = {
    //   address: '',
    //   address2: '',
    //   addressType: 'COMPANY',
    //   cityId: null,
    //   companyAddressType: 'OTHER',
    //   language: '',
    // };
    let address = {
      address: null,
      address2: null,
      city: null,
      companyAddressType: 'OTHER',
      geoInfoEN: {
        cityId: null,
        city: null,
        country: null,
        countryCode: null,
        province: null,
        provinceCode: null,
      },
      zipcode: null,
    };
    let newAdditionalAddresses = JSON.parse(
      JSON.stringify(this.state.additionalAddresses)
    );
    newAdditionalAddresses.push(address);
    this.setState({ additionalAddresses: newAdditionalAddresses });
    this.props.setAdditionalAddress(
      newAdditionalAddresses,
      newAdditionalAddresses.length - 1
    );
  };
  deleteAddress = (index) => {
    let newAdditionalAddresses = JSON.parse(
      JSON.stringify(this.state.additionalAddresses)
    );
    newAdditionalAddresses.splice(index, 1);
    this.setState({ additionalAddresses: newAdditionalAddresses });
    console.log(newAdditionalAddresses);
    this.props.setAdditionalAddress(newAdditionalAddresses, index);
  };

  getadditionalAddress = (val, index) => {
    let newAdditionalAddresses = JSON.parse(
      JSON.stringify(this.state.additionalAddresses)
    );
    newAdditionalAddresses[index].address = val;
    this.setState({ additionalAddresses: newAdditionalAddresses });
    this.props.setAdditionalAddress(newAdditionalAddresses, index);
  };

  getadditionalAddressCity = (val, index) => {
    let newAdditionalAddresses = JSON.parse(
      JSON.stringify(this.state.additionalAddresses)
    );
    if (typeof val === 'string') {
      newAdditionalAddresses[index].geoInfoEN.location = val;
      newAdditionalAddresses[index].geoInfoEN.cityId = null;
      newAdditionalAddresses[index].geoInfoEN.city = null;
      newAdditionalAddresses[index].geoInfoEN.country = null;
      newAdditionalAddresses[index].geoInfoEN.province = null;
    } else {
      newAdditionalAddresses[index].geoInfoEN.city = val.city;
      newAdditionalAddresses[index].geoInfoEN.country = val.country;
      newAdditionalAddresses[index].geoInfoEN.province = val.province;
      // newAdditionalAddresses[index].similarity = val.similarity;
      newAdditionalAddresses[index].geoInfoEN.cityId = val.cityId;
      newAdditionalAddresses[index].companyId = null;
    }
    this.setState({ additionalAddresses: newAdditionalAddresses });
    this.props.setAdditionalAddress(newAdditionalAddresses, index);
  };
  getCurLocation = (newValue) => {
    if (newValue) {
      let data;
      let msg;
      if (typeof newValue === 'string') {
        data = { location: newValue, key: newValue };
        msg = newValue;
      } else if (newValue && newValue.inputValue) {
        data = { location: newValue.inputValue, key: newValue.inputValue };
        msg = newValue.inputValue;
      } else {
        if (
          // newValue.similarity &&
          newValue &&
          newValue.geoInfoEN.cityId
        ) {
          // if (newValue.similarity === 'city') {
          data = {
            city: newValue.geoInfoEN.city,
            province: newValue.geoInfoEN.province,
            country: newValue.geoInfoEN.country,
            key: newValue.geoInfoEN.show,
          };
          msg =
            newValue.geoInfoEN.city +
            ', ' +
            newValue.geoInfoEN.province +
            ', ' +
            newValue.geoInfoEN.country;
          // } else if (newValue.similarity === 'province') {
          //   data = {
          //     province: newValue.province,
          //     country: newValue.country,
          //     key: newValue.show,
          //   };
          //   msg = newValue.city + ', ' + newValue.province;
          // } else {
          //   data = {
          //     country: newValue.country,
          //     key: newValue.show,
          //   };
          //   msg = newValue.country;
          // }
        } else if (newValue && newValue.cityId) {
          data = {
            city: newValue.city,
            province: newValue.province,
            country: newValue.country,
            key: newValue.show,
          };
          msg =
            newValue.city + ', ' + newValue.province + ', ' + newValue.country;
        } else {
          msg = null;
        }
      }
      return msg;
    }
  };
  render() {
    const {
      companyInfo,
      errorMessage,
      removeErrorMsgHandler,
      additionalAddressErrorArr,
      t,
      addressError,
    } = this.props;
    console.log(this.state.primaryAddress);
    let curLoaction = this.getCurLocation(this.state.primaryAddress);
    return (
      <div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              name="companyName"
              label={t('field:companyName')}
              value={this.state.companyName}
              isRequired={true}
              onChange={this.inputChangeHandler}
              errorMessage={
                errorMessage ? errorMessage.get('companyName') : null
              }
              onFocus={() => {
                if (removeErrorMsgHandler) {
                  removeErrorMsgHandler('erroFromServer');
                }
              }}
              maxLength={300}
            />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:industry')}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('industry') : null}
            >
              <Select
                name="industrySelect"
                value={this.state.industry}
                onChange={(industry) => {
                  this.setState({ industry: industry.value });
                }}
                // simpleValue
                options={industryList}
                searchable
                clearable={false}
                autoBlur={true}
                onFocus={() => {
                  if (removeErrorMsgHandler) {
                    removeErrorMsgHandler('industry');
                  }
                }}
              />
            </FormReactSelectContainer>
            <input name="industry" type="hidden" value={this.state.industry} />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            {/* <FormReactSelectContainer
                            label={t('field:Account Manager')}
                            isRequired={true}
                            errorMessage={errorMessage ? errorMessage.get('accountManager') : null}
                        >
                            <Select
                                name="accountManager"
                                value={this.state.accountManager}
                                onChange={(accountManager) => this.setState({ accountManager })}
                                simpleValue
                                options={industryList}
                                searchable
                                clearable={false}
                                autoBlur={true}
                                onFocus={() => {
                                    if (removeErrorMsgHandler) {
                                        removeErrorMsgHandler('industry');
                                    }
                                }}
                            />
                        </FormReactSelectContainer>
                        <input name="accountManager" type="hidden" value={this.state.accountManager} /> */}

            <FormInput
              name="CompanyWebsite"
              label={t('field:companyWebsite')}
              value={this.state.website}
              isRequired={true}
              onChange={this.websiteChange}
              errorMessage={
                errorMessage ? errorMessage.get('CompanyWebsite') : null
              }
              onFocus={() => {
                if (removeErrorMsgHandler) {
                  removeErrorMsgHandler('CompanyWebsite');
                  removeErrorMsgHandler('erroFromServer');
                }
              }}
            />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:clientLevel')}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('level') : null}
            >
              <Select
                value={this.state.level}
                onChange={(level) => {
                  this.setState({ level: level.value });
                }}
                // simpleValue
                options={levelList}
                searchable
                clearable={false}
                autoBlur={true}
                onFocus={() => {
                  if (removeErrorMsgHandler) {
                    removeErrorMsgHandler('level');
                  }
                }}
              />
            </FormReactSelectContainer>
            <input name="level" type="hidden" value={this.state.level} />
          </div>
        </div>
        {/* <div className="row expanded">
                    <div className="small-12 columns">
                        
                    </div>
                </div> */}
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              name="Primary Address"
              label={t('field:PrimaryAddress')}
              defaultValue={
                this.state.primaryAddress
                  ? this.state.primaryAddress.address
                  : ''
              }
              isRequired={true}
              onChange={(event) => {
                this.primaryAddress(event);
              }}
              errorMessage={
                errorMessage
                  ? errorMessage.get('primaryAddressesAddress')
                  : null
              }
              // onFocus={() => {
              //   if (removeErrorMsgHandler) {
              //     removeErrorMsgHandler('PrimaryAddress');
              //     removeErrorMsgHandler('PrimaryAddress');
              //   }
              // }}
            />
          </div>
          <div className="small-6 columns" style={{ paddingTop: '4px' }}>
            <div className="row expanded">
              <div
                className="small-9 columns"
                style={{ fontSize: '12px', padding: '0px' }}
              >
                {t('field:PrimaryAddressCityStateCountry')}{' '}
                <span style={{ color: '#cc4b37' }}>*</span>
              </div>
            </div>
            <div className="row expanded">
              <div className={'small-12 columns'} style={{ padding: '0px' }}>
                <Location
                  curLoaction={curLoaction}
                  city={
                    companyInfo && companyInfo.primaryAddress
                      ? companyInfo.primaryAddress
                      : null
                  }
                  getLocation={(value) => {
                    this.getPrimaryAddressCity(value);
                  }}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'blod',
                  }}
                >
                  {errorMessage
                    ? errorMessage.get('primaryAddressesCity')
                    : null}
                </span>
              </div>
            </div>
          </div>
        </div>
        <AdditionalAddress
          {...this.props}
          additionalAddress={this.state.additionalAddresses}
          errorMessage={errorMessage}
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
          additionalAddressErrorArr={additionalAddressErrorArr}
          addressError={addressError}
        />
      </div>
    );
  }
}

export default ClientBasicInfo;
