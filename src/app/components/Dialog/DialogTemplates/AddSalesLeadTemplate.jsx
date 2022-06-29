import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import AddSales from '../../AddSales';

import ClientContact from '../../ClientContact';
import DatePicker from 'react-datepicker';
import FormInput from '../../../components/particial/FormInput';
import TooltipSelect from '../../particial/TooltipSelect';
import Select from 'react-select';
import { leadSource } from '../../../constants/formOptions';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import PotentialServiceTypeSelect from '../../../pages/Companies/Form/PotentialServiceTypeSelect/PotentialServiceTypeSelect';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import * as FormOptions from '../../../constants/formOptions';
import { getClientContactList } from '../../../actions/clientActions';
const styles = {
  root: {
    width: '480px',
    minHeight: '220px',
  },
};

const accountProgress = [
  { value: 0, label: '0%' },
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
];

class AddSalesLeadTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      value: '',
      serviceTypeSelect: [],
      email: null,
      contactCategory: null,
      otherCategory: null,
    };
  }
  componentDidMount() {
    this.props.dispatch(getClientContactList(this.props.companyId));
  }
  addShare = () => {
    this.props.addShare();
  };
  deleteOwner = (key) => {
    this.props.deleteOwner(key);
  };

  addContact = () => {
    this.props.addContact();
  };
  deleteContact = (key) => {
    this.props.deleteContact(key);
  };
  getMsg = (list, msg) => {
    this.setState({
      treeList: list,
      value: msg,
    });
  };

  sendServiceType = (checkedList) => {
    let checkedId = [];
    checkedList.forEach((item, index) => {
      checkedId.push(item.id);
    });
    this.setState({
      serviceTypeSelect: checkedId,
    });
    this.props.removeErrorMsgHandler('ServiceType');
    this.props.sendServiceType(checkedList);
  };

  hasError = (arr, index) => {
    let _arr = arr.filter((_item, _index) => {
      return _item.key === index && _item.error === true;
    });
    if (_arr.length > 0) {
      return true;
    }
    return false;
  };

  render() {
    const {
      classes,
      formData,
      t,
      serviceTypeTree,
      companyId,
      removeErrorMsgHandler,
      errorMessage,
      updateContact,
      noPhoneContacts,
      phoneError,
    } = this.props;
    const { value, serviceTypeSelect, contactCategory, otherCategory, email } =
      this.state;

    return (
      <div className={classes.root}>
        {!updateContact ? (
          <>
            <div className="row expanded">
              <div className="small-6 columns">
                <AddSales
                  label={t('field:Sales Lead Owner')}
                  saleLeadOwner={formData.owners}
                  addShare={() => {
                    this.addShare();
                  }}
                  deleteOwner={(key) => {
                    this.deleteOwner(key);
                  }}
                  changeOwner={(key, owner) => {
                    this.props.changeOwner(key, owner);
                    removeErrorMsgHandler('salesLeadOwner');
                  }}
                  errorMessage={errorMessage}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                  }}
                >
                  {errorMessage && errorMessage.get('salesLeadOwner')
                    ? errorMessage.get('salesLeadOwner')
                    : null}
                </span>
              </div>
              <div className="small-6 columns">
                <ClientContact
                  label={t('field:Client Contact')}
                  clientContact={formData.contacts}
                  companyId={companyId}
                  addContact={() => {
                    this.addContact();
                  }}
                  deleteContact={(key) => {
                    this.deleteContact(key);
                  }}
                  changeContact={(key, owner) => {
                    this.props.changeContact(key, owner);
                    removeErrorMsgHandler('contacts');
                  }}
                  errorMessage={errorMessage}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                  }}
                >
                  {errorMessage && errorMessage.get('contacts')
                    ? errorMessage.get('contacts')
                    : null}
                </span>
              </div>
              <div className="small-6 columns">
                <DatePicker
                  customInput={
                    <FormInput
                      label={t('field:Estimated Deal Time')}
                      isRequired={true}
                      errorMessage={
                        errorMessage.get('estimatedDealTime')
                          ? errorMessage.get('estimatedDealTime')
                          : null
                      }
                      name="EstimatedDealTime"
                    />
                  }
                  className={classes.fullWidth}
                  selected={this.state.delTime}
                  onChange={(delTime) => {
                    this.props.getDelTime(delTime);
                    this.setState({ delTime });
                    if (removeErrorMsgHandler) {
                      removeErrorMsgHandler('estimatedDealTime');
                    }
                  }}
                  placeholderText="mm/dd/yyyy"
                  popperModifiers={{}}
                />
                <input
                  name="EstimatedDealTime"
                  type="hidden"
                  value={
                    this.state.delTime
                      ? this.state.delTime.format('YYYY-MM-DD')
                      : ''
                  }
                />
              </div>
              <div className="small-6 columns">
                <TooltipSelect
                  label={t('field:Account Progress')}
                  tip={
                    <React.Fragment>
                      <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                        Progress Milestones
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                        0%： Have not contacted client yet
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                        25%: Initial contact (conference call, email contact,
                        etc…)
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                        50%: Meet client in person/have lunch, client shows
                        interest
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        75%: Negotiating terms
                      </div>
                    </React.Fragment>
                  }
                >
                  <FormReactSelectContainer
                  // errorMessage={
                  //   errorMessage && errorMessage.get('accountProgress')
                  //     ? errorMessage.get('accountProgress')
                  //     : null
                  // }
                  >
                    <Select
                      name="Account Progress"
                      value={this.state.progress}
                      onChange={(val) => {
                        this.setState({ progress: val.value });
                        this.props.changeProgress(val.value);
                      }}
                      options={accountProgress}
                      valueKey={'value'}
                      labelKey={'label'}
                      autoBlur={true}
                      searchable={true}
                      clearable={false}
                      // onFocus={() => {
                      //   if (removeErrorMsgHandler) {
                      //     removeErrorMsgHandler('accountProgress');
                      //   }
                      // }}
                    />
                  </FormReactSelectContainer>
                </TooltipSelect>
              </div>
              <div className="small-6 columns">
                <PotentialServiceTypeSelect
                  t={t}
                  data={serviceTypeTree}
                  value={value}
                  width={'100%'}
                  // getMsg={(list, msg) => {
                  //   this.getMsg(list, msg);
                  // }}
                  selected={serviceTypeSelect}
                  sendServiceType={(checkedList) => {
                    this.sendServiceType(checkedList);
                    this.props.sendServiceType(checkedList);
                    this.props.removeErrorMsgHandler('serviceType');
                  }}
                  errorMessage={errorMessage}
                  salesLeadIndex={0}
                  serviceTypeError={[
                    {
                      salesLeadIndex: 0,
                      errorMessage: errorMessage.get('serviceType')
                        ? true
                        : false,
                    },
                  ]}
                />
                <span
                  style={{
                    color: '#cc4b37',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                  }}
                >
                  {errorMessage && errorMessage.get('serviceType')
                    ? errorMessage.get('serviceType')
                    : null}
                </span>
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={t('field:Lead Source')}
                  isRequired={true}
                  errorMessage={
                    errorMessage && errorMessage.get('leadSource')
                      ? errorMessage.get('leadSource')
                      : null
                  }
                >
                  <Select
                    name="Lead Source"
                    value={this.state.leadSource}
                    onChange={(val) => {
                      this.setState({ leadSource: val.value });
                      this.props.changeLeadSource(val.value);
                    }}
                    options={leadSource}
                    valueKey={'value'}
                    labelKey={'label'}
                    autoBlur={true}
                    searchable={true}
                    clearable={false}
                    onFocus={() => {
                      if (removeErrorMsgHandler) {
                        removeErrorMsgHandler('leadSource');
                      }
                    }}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
          </>
        ) : (
          <div>
            <Typography variant="caption" display="block" gutterBottom>
              Please provide contacts’ phone number in order to add a sales
              lead.
            </Typography>
            {noPhoneContacts.length > 0 &&
              noPhoneContacts.map((item, index) => {
                return (
                  <div className="row expanded">
                    <div className="small-6 columns">
                      <FormReactSelectContainer
                        label={t('field:name')}
                        isRequired={true}
                      >
                        <FormInput
                          name="name"
                          value={item.name}
                          disabled={true}
                        />
                      </FormReactSelectContainer>
                    </div>
                    <div className="small-6 columns">
                      <FormReactSelectContainer
                        label={t('field:contactCategory')}
                        isRequired={true}
                      >
                        <FormInput
                          name="contactCategory"
                          value={item.contactCategory}
                          disabled={true}
                        />
                        {/* {item.contactCategory?(
                          <FormInput
                          name="contactCategory"
                          value={item.contactCategory}
                          disabled={true}
                        />
                        ):(
                          <Select
                            name="contactCategory"
                            valuekey={'value'}
                            labelkey={'label'}
                            value={contactCategory}
                            onChange={(contactCategory) =>{
                              this.setState({
                                contactCategory:contactCategory.value
                              })
                              this.props.setContactCategory(contactCategory.value,index)
                            }}
                            // simpleValue
                            options={FormOptions.ContactCategory}
                            autoBlur={true}
                          />
                        )} */}
                      </FormReactSelectContainer>
                      {item.contactCategory &&
                        item.contactCategory === 'OTHER' && (
                          <FormInput
                            name="otherCategory"
                            defaultValue={item.otherCategory}
                          />
                        )}
                      {/* {contactCategory&&contactCategory === 'OTHER'&&(
                         <FormInput
                         name="otherCategory"
                         value={otherCategory}
                         onChange={(e) => {
                           this.setState({
                            otherCategory:e.target.value
                           })
                           this.props.setOtherCategory(e.target.value,index)
                         }}
                         onBlur={() => this.removeErrorMessage('otherCategory')}
                       />
                      )} */}
                    </div>
                    <div className="small-6 columns">
                      <FormReactSelectContainer
                        label={t('field:email')}
                        isRequired={true}
                      >
                        {/* {
                          item.email?
                          ( */}
                        <FormInput
                          name="email"
                          value={item.email}
                          disabled={true}
                        />
                        {/* ):(
                            <FormInput
                            name="email"
                            value={email}
                            onChange={(e)=>{
                              this.setState({email:e.target.value})
                              this.props.setEmail(e.target.value,index)
                            }}
                          />
                          )
                        } */}
                      </FormReactSelectContainer>
                    </div>
                    <div className="small-6 columns">
                      <FormInput
                        label={t('field:phone')}
                        isRequired={true}
                        errorMessage={
                          phoneError && this.hasError(phoneError, index)
                            ? errorMessage.get('phone')
                            : null
                        }
                        name="phone"
                        value={item.phone}
                        onChange={(e) => {
                          this.props.setPhone(e.target.value, index);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

const mapStoreStateToProps = (state, props) => {
  const serviceTypeTree = state.model.serviceTypeTree.tree;
  return { serviceTypeTree };
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(AddSalesLeadTemplate)
);
