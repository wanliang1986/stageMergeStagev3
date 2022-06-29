import React, { Component } from 'react';
import MuiLink from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Location from './additionalAddressLocation';
import FormInput from '../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';

class AdditionalAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // AddressList: props.additionalAddress
    };
  }

  getAddress = (event, index) => {
    this.props.getadditionalAddress(event.target.value, index);
  };
  getPrimaryAddressCity = (val, index) => {
    this.props.getadditionalAddressCity(val, index);
  };
  addAddress = () => {
    this.props.addAddress();
  };
  deleteAddress = (index) => {
    this.props.deleteAddress(index);
  };

  getCurLocation = (newValue) => {
    let data;
    let msg;
    if (typeof newValue === 'string') {
      data = { location: newValue, key: newValue };
      msg = newValue;
    } else if (newValue && newValue.location) {
      data = { location: newValue.location, key: newValue.location };
      msg = newValue.location;
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
      additionalAddress,
      errorMessage,
      additionalAddressErrorArr,
      addressError,
      t,
    } = this.props;
    console.log('additionalAddressErrorArr', additionalAddressErrorArr);
    return (
      <>
        <div className="row expanded align-bottom">
          <div className="small-6 columns">
            <FormReactSelectContainer label={t('field:AdditionalAddress')} />
          </div>
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={
                <div className="flex-container align-justify align-bottom">
                  <div
                    style={
                      additionalAddressErrorArr.length > 0 &&
                      additionalAddressErrorArr.some((item, index) => {
                        return item.error === true;
                      })
                        ? { color: '#CC4B37' }
                        : {}
                    }
                  >
                    {t('field:AdditionalAddressCityStateCountry')}
                  </div>
                  <MuiLink
                    style={{ textDecoration: 'none', fontWeight: 600 }}
                    color="primary"
                    size="small"
                    onClick={this.addAddress}
                  >
                    {t('tab:Add Address')}
                  </MuiLink>
                </div>
              }
            />
          </div>
        </div>
        {additionalAddress.map((item, index) => {
          let curLoaction = this.getCurLocation(item);
          console.log('curLoaction', curLoaction);
          return (
            <div key={index} className="row expanded">
              <div className="small-6 columns">
                <FormInput
                  value={item.address}
                  onChange={(event) => {
                    this.getAddress(event, index);
                  }}
                  errorMessage={
                    addressError.length > 0 &&
                    addressError[index].error === true &&
                    errorMessage.get('additionalAddress') ? (
                      <span
                        style={{
                          fontSize: '12px',
                          paddingLeft: '4px',
                          color: 'rgb(204, 75, 55)',
                          fontWeight: 'bold',
                        }}
                      >
                        {errorMessage.get('additionalAddress')}
                      </span>
                    ) : null
                  }
                />
              </div>
              <div
                className={
                  additionalAddress.length > 1
                    ? 'small-5 columns'
                    : 'small-6 columns'
                }
              >
                <Location
                  curLoaction={curLoaction}
                  city={item ? item : null}
                  getLocation={(value) => {
                    this.getPrimaryAddressCity(value, index);
                  }}
                  additionalAddressErrorArr={additionalAddressErrorArr}
                  index={index}
                />
                {additionalAddressErrorArr.length > 0 &&
                additionalAddressErrorArr[index].error === true &&
                errorMessage.get('additionalAddressCity') ? (
                  <span
                    style={{
                      fontSize: '12px',
                      paddingLeft: '4px',
                      color: 'rgb(204, 75, 55)',
                      fontWeight: 'bold',
                    }}
                  >
                    {errorMessage.get('additionalAddressCity')}
                  </span>
                ) : null}
              </div>
              {additionalAddress.length > 1 && (
                <div className="small-1 columns">
                  <IconButton
                    size="small"
                    onClick={() => this.deleteAddress(index)}
                  >
                    <DeleteIcon
                    // style={{ color: '#8E8E8E', marginTop: '5px' }}
                    />
                  </IconButton>
                </div>
              )}
            </div>
          );
        })}
      </>
    );
  }
}

export default AdditionalAddress;
