import React, { Component } from 'react';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';

import { validateProspectName } from '../../../../apn-sdk/client';
import { industryList, levelList } from '../../../constants/formOptions';
import AdditionalAddress from './AdditionalAddress/AdditionalAddress';
import Location from '../../../components/Location';
import lodash from 'lodash';

class ClientBasicInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: (props.companyInfo && props.companyInfo.name) || '',
      industry: (props.companyInfo && props.companyInfo.industry) || '',
      accountManager:
        (props.companyInfo && props.companyInfo.accountManager) || '',
      level: (props.companyInfo && props.companyInfo.type) || '',
      website: (props.companyInfo && props.companyInfo.website) || '',
      primaryAddress:
        (props.companyInfo && props.companyInfo.primaryAddress) || {},
      additionalAddresses:
        (props.companyInfo && props.companyInfo.additionalAddresses) || {},
    };
  }

  componentDidMount() {
    if (this.props.companyInfo.additionalAddresses.length === 0) {
      let arr = [
        {
          address: null,
          address2: null,
          addressType: 'COMPANY',
          city: null,
          cityId: null,
          companyAddressType: 'OTHER',
          companyId: null,
          country: null,
          language: null,
          province: null,
        },
      ];
      this.setState({
        additionalAddresses: arr,
      });
    }
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

  getPrimaryAddressCity = (address) => {
    let newPrimaryAddress = JSON.parse(
      JSON.stringify(this.state.primaryAddress)
    );
    newPrimaryAddress.city = address.city;
    newPrimaryAddress.cityId = address.cityId;
    newPrimaryAddress.cityCN = address.cityCN;
    newPrimaryAddress.country = address.country;
    newPrimaryAddress.countryCN = address.countryCN;
    newPrimaryAddress.countryCode = address.countryCode;
    newPrimaryAddress.province = address.province;
    newPrimaryAddress.provinceCN = address.provinceCN;
    newPrimaryAddress.provinceCode = address.provinceCode;
    newPrimaryAddress.show = address.show;
    newPrimaryAddress.similarity = address.similarity;
    this.setState({
      primaryAddress: newPrimaryAddress,
    });
    this.props.removeErrorMsgHandler('primaryAddressesCity');
    this.props.setPrimaryAddress(newPrimaryAddress);
  };

  addAddress = () => {
    let address = {
      address: '',
      address2: '',
      addressType: 'COMPANY',
      cityId: null,
      companyAddressType: 'OTHER',
      language: '',
    };
    let newAdditionalAddresses = JSON.parse(
      JSON.stringify(this.state.additionalAddresses)
    );
    newAdditionalAddresses.push(address);
    this.setState({ additionalAddresses: newAdditionalAddresses });
    // this.props.addAddress(newAdditionalAddresses.length - 1);
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
      newAdditionalAddresses[index].location = val;
      newAdditionalAddresses[index].cityId = null;
      newAdditionalAddresses[index].city = null;
      newAdditionalAddresses[index].country = null;
      newAdditionalAddresses[index].province = null;
    } else {
      newAdditionalAddresses[index].city = val.city;
      newAdditionalAddresses[index].country = val.country;
      newAdditionalAddresses[index].province = val.province;
      newAdditionalAddresses[index].similarity = val.similarity;
      newAdditionalAddresses[index].cityId = val.cityId;
      newAdditionalAddresses[index].companyId = null;
      newAdditionalAddresses[index].addressType = 'COMPANY';
    }
    this.setState({ additionalAddresses: newAdditionalAddresses });
    this.props.setAdditionalAddress(newAdditionalAddresses, index);
  };
  getCurLocation = (newValue) => {
    console.log(newValue);
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
    const {
      companyInfo,
      errorMessage,
      removeErrorMsgHandler,
      additionalAddressErrorArr,
      addressError,
      t,
    } = this.props;
    let curLoaction = this.getCurLocation(companyInfo.primaryAddress);
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
                        padding: '0px',
                        color: 'rgb(204, 75, 55)',
                      }
                    : { fontSize: '12px', padding: '0px' }
                }
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
                  errorMessage={errorMessage}
                />
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
