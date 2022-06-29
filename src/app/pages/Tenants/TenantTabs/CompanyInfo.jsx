import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { externalUrl } from '../../../../utils/index';
import { updateCompany } from '../../../actions/tenantActions';
import * as ActionTypes from '../../../constants/actionTypes';
import * as FormOptions from '../../../constants/formOptions';

import Select from 'react-select';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';

import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import FormInput from '../../../components/particial/FormInput';
import * as Colors from '../../../styles/Colors/index';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../components/particial/FormTextArea';
import ImageEditor from '../../../components/ImageEditor';
import CompanyLogo from '../../Companies/Form/CompanyLogo';
import { industryList, staffSize } from '../../../constants/formOptions';
import DatePicker from 'react-datepicker';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import ImageIcon from '@material-ui/icons/Image';

class CompanyInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      onEdit: false,
      errorMessage: Immutable.Map(),
      photoUrl: props.company.get('logo'),
      companyName: props.company.get('name'),
      companyWebsite: props.company.get('website'),
      organizationName: props.company.get('bizName'),
      companyIndustries: props.company.get('industries'),
      companySize: props.company.get('size'),
      companyFounded: props.company.get('founded'),
      companyDescription: props.company.get('description'),
      companyEmail: props.company.get('email'),
      companyPhone: props.company.get('phone'),
      companyFax: props.company.get('fax'),
      companyStreet: props.company.get('addressLine'),
      companyCity: props.company.get('city'),
      companyState: props.company.get('province'),
      companyZip: props.company.get('zipcode'),
      companyCountry: props.company.get('country'),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.company.equals(this.props.company) && !this.state.onEdit) {
      this.setState({
        photoUrl: nextProps.company.get('logo'),
        companyName: nextProps.company.get('name'),
        companyWebsite: nextProps.company.get('website'),
        organizationName: nextProps.company.get('bizName'),
        companyIndustries: nextProps.company.get('industries'),
        companySize: nextProps.company.get('size'),
        companyFounded: nextProps.company.get('founded'),
        companyDescription: nextProps.company.get('description'),
        companyEmail: nextProps.company.get('email'),
        companyPhone: nextProps.company.get('phone'),
        companyFax: nextProps.company.get('fax'),
        companyStreet: nextProps.company.get('addressLine'),
        companyCity: nextProps.company.get('city'),
        companyState: nextProps.company.get('province'),
        companyZip: nextProps.company.get('zipcode'),
        companyCountry: nextProps.company.get('country'),
      });
    }
  }

  handleUpdateCompany = (e) => {
    e.preventDefault();
    let errorMessage = this._validateForm();
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    const company = {
      logo: this.state.photoUrl,
      name: this.state.companyName,
      bizName: this.state.organizationName,
      addressLine: this.state.companyStreet,
      city: this.state.companyCity,
      province: this.state.companyState,
      country: this.state.companyCountry,
      zipcode: this.state.companyZip,
      phone: this.state.companyPhone,
      email: this.state.companyEmail,
      fax: this.state.companyFax,
      website: this.state.companyWebsite,
      description: this.state.companyDescription,
      industries: this.state.companyIndustries,
      size: this.state.companySize,
      founded: this.state.companyFounded,
    };

    this.props
      .dispatch(
        updateCompany(
          company,
          this.props.company.get('id'),
          this.props.tenantId
        )
      )
      .then(this.onCancel)
      .catch((err) => {
        this.props.dispatch({
          type: ActionTypes.ADD_MESSAGE,
          message: {
            type: 'error',
            message: err.message || err,
          },
        });
      });
  };

  _validateForm() {
    let hasError = false;
    let errorMessage = Immutable.Map();
    if (!this.state.companyName) {
      hasError = true;
      errorMessage = errorMessage.set(
        'name',
        this.props.t('message:companyNameIsRequired')
      );
    }
    return hasError && errorMessage;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  onCancel = () => {
    this.setState({
      onEdit: false,
      errorMessage: Immutable.Map(),
      photoUrl: this.props.company.get('logo'),
      companyName: this.props.company.get('name'),
      companyWebsite: this.props.company.get('website'),
      organizationName: this.props.company.get('bizName'),
      companyIndustries: this.props.company.get('industries'),
      companySize: this.props.company.get('size'),
      companyFounded: this.props.company.get('founded'),
      companyDescription: this.props.company.get('description'),
      companyEmail: this.props.company.get('email'),
      companyPhone: this.props.company.get('phone'),
      companyFax: this.props.company.get('fax'),
      companyStreet: this.props.company.get('addressLine'),
      companyCity: this.props.company.get('city'),
      companyState: this.props.company.get('province'),
      companyZip: this.props.company.get('zipcode'),
      companyCountry: this.props.company.get('country'),
    });
  };

  onNewImage = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];
    fileInput.value = '';
    this.setState({ editImg: file });
  };

  getCroppedImage = (imgUrl) => {
    this.setState({
      photoUrl: imgUrl || this.props.company.get('logo'),
      editImg: null,
    });
  };

  getCurLoaction = (obj) => {
    let data;
    let msg;
    if (obj.similarity === 'city') {
      data = {
        city: obj.city,
        province: obj.province,
        country: obj.country,
      };
      msg = obj.city + ', ' + obj.province + ', ' + obj.country;
    } else if (obj.similarity === 'province') {
      data = {
        province: obj.province,
        country: obj.country,
      };
      msg = obj.city + ', ' + obj.province;
    } else {
      data = {
        country: obj.country,
      };
      msg = obj.country;
    }
    return msg;
  };

  render() {
    const { errorMessage, photoUrl, onEdit, editImg } = this.state;
    const { t, isAdmin, company } = this.props;
    console.log(company.toJS());
    return (
      <div style={{ overflow: 'auto' }}>
        {!onEdit ? (
          <div className="flex-container align-center">
            <div
              className="flex-child-auto flex-container flex-dir-column"
              style={{ maxWidth: 800 }}
            >
              <div className="flex-container align-center">
                <div style={{ minWidth: 200, marginLeft: 20 }}>
                  {photoUrl ? (
                    <Avatar
                      src={photoUrl}
                      style={{
                        width: 155,
                        height: 155,
                        backgroundColor: 'white',
                      }}
                    />
                  ) : (
                    <ImageIcon
                      style={{
                        fontSize: '4em',
                        color: Colors.GRAY,
                        textAlign: 'center',
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="item-padding">
                <div className="row expanded">
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:companyName')}
                    </label>
                    <p>{this.state.companyName || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:website')}
                    </label>
                    <a
                      href={externalUrl(this.state.companyWebsite)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p>{this.state.companyWebsite || ''}</p>
                    </a>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:bizName')}
                    </label>
                    <p>{this.state.organizationName || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {' '}
                      {t('field:industries')}
                    </label>
                    <p>{this.state.companyIndustries || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:size')}
                    </label>
                    <p>{this.state.companySize || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:founded')}
                    </label>
                    <p>{this.state.companyFounded || ''}</p>
                  </div>
                  <div className="small-12 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:description')}
                    </label>
                    <p>{this.state.companyDescription || ''}</p>
                  </div>

                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:email')}
                    </label>
                    <a href={'mailto:' + this.state.companyEmail}>
                      <p>{this.state.companyEmail || ''}</p>
                    </a>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:phone')}
                    </label>
                    <a href={'tel:' + this.state.companyPhone}>
                      <p>{this.state.companyPhone || ''}</p>
                    </a>
                  </div>

                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:fax')}
                    </label>
                    <a href={'fax:' + this.state.companyFax}>
                      <p>{this.state.companyFax || ''}</p>
                    </a>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:street')}
                    </label>
                    <p>{this.state.companyStreet || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:city')}
                    </label>
                    <p>{this.state.companyCity || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:province')}
                    </label>
                    <p>{this.state.companyState || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:zipcode')}
                    </label>
                    <p>{this.state.companyZip || ''}</p>
                  </div>
                  <div className="small-4 columns">
                    <label
                      style={{
                        fontSize: '14px',
                        color: Colors.SUB_TEXT,
                      }}
                    >
                      {t('field:country')}
                    </label>
                    <p>{this.state.companyCountry || ''}</p>
                  </div>
                </div>
              </div>

              <div
                className="flex-container align-center"
                style={{ padding: '16px 0' }}
              >
                <PrimaryButton
                  disabled={!isAdmin}
                  style={{ minWidth: 120 }}
                  onClick={() => this.setState({ onEdit: true })}
                >
                  {t('action:edit')}
                </PrimaryButton>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="flex-child-auto"
            onSubmit={this.handleUpdateCompany}
            style={{ overflow: 'auto' }}
          >
            <div className="flex-child-grow flex-container align-middle flex-dir-column ">
              <div className="flex-child-grow flex-container flex-dir-column container-padding">
                <div style={{ maxWidth: 800 }}>
                  <div className="flex-container align-top">
                    <div className="row flex-child-auto">
                      <div className="small-12 columns">
                        <FormInput
                          name="companyName"
                          label={t('field:companyName')}
                          value={this.state.companyName || ''}
                          isRequired={true}
                          errorMessage={
                            errorMessage ? errorMessage.get('name') : null
                          }
                          disabled={!onEdit}
                          onChange={(e) =>
                            this.setState({ companyName: e.target.value })
                          }
                        />
                      </div>
                      <div className="small-12 columns">
                        <FormInput
                          name="website"
                          label={t('field:website')}
                          value={this.state.companyWebsite || ''}
                          disabled={!onEdit}
                          onChange={(e) =>
                            this.setState({ companyWebsite: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div style={{ minWidth: 200, marginLeft: 20 }}>
                      <FormReactSelectContainer
                        label={t('field:logo')}
                        className={'columns'}
                      >
                        <div>
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            disabled={!onEdit}
                            onChange={this.onNewImage}
                          />
                          {photoUrl ? (
                            <Paper
                              style={{
                                width: 175,
                                height: 175,
                                margin: '0 2px',
                              }}
                              title={t('common:uploadImage')}
                            >
                              <Avatar
                                src={photoUrl}
                                style={{
                                  width: 175,
                                  height: 175,
                                  borderRadius: 0,
                                }}
                              />
                            </Paper>
                          ) : (
                            <Paper
                              className="flex-container flex-dir-column align-center"
                              style={{
                                width: 180,
                                height: 140,
                                padding: 12,
                                margin: '0 2px 20px',
                              }}
                            >
                              <ImageIcon
                                style={{
                                  fontSize: '4em',
                                  color: Colors.GRAY,
                                  textAlign: 'center',
                                  margin: 'auto',
                                }}
                              />
                              <div
                                style={{
                                  textAlign: 'center',
                                  color: Colors.SUB_TEXT,
                                }}
                              >
                                {t('common:uploadImage')}
                              </div>
                            </Paper>
                          )}
                        </div>
                      </FormReactSelectContainer>
                    </div>
                  </div>

                  <div className="row expanded">
                    <div className="small-6 columns">
                      <FormInput
                        name="bizName"
                        label={t('field:bizName')}
                        value={this.state.organizationName || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ organizationName: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-6 columns">
                      <FormInput
                        name="industries"
                        label={t('field:industries')}
                        value={this.state.companyIndustries || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyIndustries: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-6 columns">
                      <FormReactSelectContainer label={t('field:size')}>
                        <Select
                          name="size"
                          value={this.state.companySize || ''}
                          onChange={(companySize) =>
                            this.setState({ companySize })
                          }
                          simpleValue
                          options={FormOptions.companySize}
                          disabled={!onEdit}
                          autoBlur={true}
                          searchable={true}
                        />
                      </FormReactSelectContainer>
                    </div>
                    <div className="small-6 columns">
                      <FormInput
                        name="founded"
                        label={t('field:founded')}
                        value={this.state.companyFounded || ''}
                        disabled={!onEdit}
                        type="date"
                        onChange={(e) =>
                          this.setState({ companyFounded: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="row small-12 expanded">
                    <div className="small-12 columns">
                      <FormTextArea
                        name="description"
                        label={t('field:description')}
                        rows="5"
                        value={this.state.companyDescription || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyDescription: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="row expanded">
                    <div className="small-4 columns">
                      <FormInput
                        name="email"
                        label={t('field:email')}
                        value={this.state.companyEmail || ''}
                        errorMessage={
                          errorMessage ? errorMessage.get('email') : null
                        }
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyEmail: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-4 columns">
                      <FormInput
                        name="phone"
                        label={t('field:phone')}
                        value={this.state.companyPhone || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyPhone: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-4 columns">
                      <FormInput
                        name="fax"
                        label={t('field:fax')}
                        value={this.state.companyFax || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyFax: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="row expanded">
                    <div className="small-12 columns">
                      <FormInput
                        label={t('field:street')}
                        name={'street'}
                        value={this.state.companyStreet || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyStreet: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="row expanded">
                    <div className="small-3 columns">
                      <FormInput
                        label={t('field:city')}
                        name={'city'}
                        errorMessage={
                          errorMessage ? errorMessage.get('city') : null
                        }
                        value={this.state.companyCity || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyCity: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-3 columns">
                      <FormInput
                        label={t('field:province')}
                        name={'province'}
                        errorMessage={
                          errorMessage ? errorMessage.get('state') : null
                        }
                        value={this.state.companyState || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyState: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-3 columns">
                      <FormInput
                        label={t('field:zipcode')}
                        name={'zipcode'}
                        errorMessage={
                          errorMessage ? errorMessage.get('zipcode') : null
                        }
                        value={this.state.companyZip || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyZip: e.target.value })
                        }
                      />
                    </div>
                    <div className="small-3 columns">
                      <FormInput
                        label={t('field:country')}
                        name={'country'}
                        errorMessage={
                          errorMessage ? errorMessage.get('country') : null
                        }
                        value={this.state.companyCountry || ''}
                        disabled={!onEdit}
                        onChange={(e) =>
                          this.setState({ companyCountry: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="flex-container align-center"
                  style={{ padding: '16px 0' }}
                >
                  <SecondaryButton
                    style={{ minWidth: 120, marginRight: 30 }}
                    onClick={this.onCancel}
                  >
                    {t('action:cancel')}
                  </SecondaryButton>
                  <PrimaryButton type="submit" style={{ minWidth: 120 }}>
                    {t('action:save')}
                  </PrimaryButton>
                </div>
              </div>
            </div>
            <ImageEditor
              open={!!editImg}
              image={editImg}
              onSave={this.getCroppedImage}
              onNewImage={this.onNewImage}
            />
          </form>
          // <div>

          //   <div style={{ display: 'flex', padding: '10px' }}>
          //     <CompanyLogo
          //       logoUrl={
          //         company && company.logo ? company.logo : this.state.logo
          //       }
          //       // onNewImage={this.onNewImage}
          //       t={t}
          //     />
          //     <section style={{ width: '65%', position: 'relative' }}>
          //       <div className="row expanded">
          //         <div className="small-6 columns">
          //           <FormInput
          //             name="tenantName"
          //             label={t('field:tenantName')}
          //             defaultValue={
          //               company ? company.name : this.state.tenantName
          //             }
          //             isRequired={true}
          //           // onBlur={(event) => {
          //           //   this.inputChangeHandler(event);
          //           //   this.removeErrorMsgHandler('tenantName');
          //           // }}
          //           // errorMessage={
          //           //   errorMessage && errorMessage.get('tenantName')
          //           //     ? errorMessage.get('tenantName')
          //           //     : null
          //           // }
          //           />
          //         </div>
          //         <div className="small-6 columns">
          //           <FormReactSelectContainer
          //             label={t('field:industry')}
          //             isRequired={true}
          //           // errorMessage={
          //           //   errorMessage && errorMessage.get('industry')
          //           //     ? errorMessage.get('industry')
          //           //     : null
          //           // }
          //           >
          //             <Select
          //               name="industrySelect"
          //               value={this.state.industry}
          //               onChange={(industry) => {
          //                 // this.changeIndustry(industry);
          //                 // this.removeErrorMsgHandler('industry');
          //               }}
          //               // simpleValue
          //               valueKey={'value'}
          //               labelKey={'label'}
          //               options={industryList}
          //               searchable
          //               clearable={false}
          //               autoBlur={true}
          //             />
          //           </FormReactSelectContainer>
          //         </div>
          //       </div>
          //       <div className="row expanded">
          //         <div className="small-12 columns">
          //           <FormInput
          //             name="website "
          //             label={t('field:website')}
          //             defaultValue={
          //               company ? company.website : this.state.website
          //             }
          //             onBlur={(event) => {
          //               // this.setWebsite(event);
          //             }}
          //           />
          //         </div>
          //         <div className="small-6 columns">
          //           <FormInput
          //             name="address"
          //             label={t('field:address')}
          //             defaultValue={
          //               company && company.address
          //                 ? company.address.address
          //                 : this.state.address
          //             }
          //             onBlur={(event) => {
          //               // this.setAddress(event);
          //             }}
          //           />
          //         </div>
          //         <div className="small-6 columns">
          //           <div className="row expanded">
          //             <div
          //               className="small-9 columns"
          //               style={{
          //                 fontSize: '12px',
          //                 height: '16px',
          //                 padding: '0px',
          //                 fontFamily: 'Roboto',
          //               }}
          //             >
          //               {t('field:cityStateCountry')}
          //             </div>
          //           </div>
          //           <div className="row expanded" style={{ marginTop: '4px' }}>
          //             <div className="small-12 columns" style={{ padding: '0px' }}>
          //               {/* <Location
          //               curLoaction={
          //                 company && company.address
          //                   ? this.getCurLoaction(company.address)
          //                   : this.state.curLocation
          //               }
          //               city={
          //                 company && company.address
          //                   ? company.address
          //                   : null
          //               }
          //               getLocation={(value) => {
          //                 // this.setCity(value);
          //               }}
          //             /> */}
          //             </div>
          //           </div>
          //         </div>
          //         <div className="small-6 columns">
          //           <FormReactSelectContainer label={t('field:Founded')}>
          //             <DatePicker
          //               // className={classes.fullWidth}
          //               selected={this.state.foundedDate}
          //               maxDate={moment(new Date())}
          //               onChange={(foundedDate) => {
          //                 // this.setFoundedDate(foundedDate);
          //               }}
          //               placeholderText="mm/dd/yyyy"
          //             />
          //           </FormReactSelectContainer>
          //         </div>
          //         <div className="small-6 columns">
          //           <FormReactSelectContainer label={t('field:Staff Size')}>
          //             <Select
          //               name="Staff Size"
          //               value={this.state.staffSizeType}
          //               // onChange={(staffSize) => this.setStaffSize(staffSize)}
          //               options={staffSize}
          //               valueKey={'value'}
          //               labelKey={'label'}
          //               autoBlur={true}
          //               searchable={true}
          //               clearable={false}
          //             />
          //           </FormReactSelectContainer>
          //         </div>
          //         <div className="small-12 columns">
          //           <FormTextArea
          //             name="description"
          //             label={t('field:description')}
          //             rows="3"
          //             maxLength={500}
          //             defaultValue={
          //               company && company.description
          //                 ? company.description
          //                 : this.state.description
          //             }
          //             onChange={(e) => {
          //               // this.setDescription(e);
          //             }}
          //           />
          //         </div>
          //       </div>
          //       <Divider />
          //       <div className="row expanded" style={{ marginTop: '10px' }}>
          //         <Button
          //           // variant="contained"
          //           color="primary"
          //           onClick={() => {
          //             // this.cancel();
          //           }}
          //           style={{ marginRight: '10px' }}
          //         >
          //           Cancel
          //         </Button>
          //         <PrimaryButton
          //           type="Button"
          //           style={{ minWidth: 100 }}
          //           processing={this.state.creating}
          //           name="submit"
          //           onClick={() => {
          //             // this.SaveTenant();
          //           }}
          //         >
          //           {t('action:save')}
          //         </PrimaryButton>
          //       </div>
          //     </section>
          //   </div>
          // </div>
        )}
      </div>
    );
  }
}

function mapStoreStateToProps(state) {
  const tenantId = state.controller.currentUser.get('tenantId');
  const company =
    (tenantId && state.model.tenants.get(tenantId.toString())) ||
    Immutable.Map();
  const authorities = state.controller.currentUser.get('authorities');
  const isAdmin =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
  return {
    company,
    tenantId,
    isAdmin,
  };
}

export default connect(mapStoreStateToProps)(CompanyInfo);
