import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';

import Select from 'react-select';
import moment from 'moment-timezone';
import FormInput from '../../../../components/particial/FormInput';
import Immutable from 'immutable';

import DatePicker from 'react-datepicker';
import ShareInput from './shareInput';
import PotentialServiceTypeSelect from '../PotentialServiceTypeSelect/PotentialServiceTypeSelect';
import { connect } from 'react-redux';

import ContactsInput from './ContactsInput';
import MyDialog from '../../../../components/Dialog/myDialog';
import AddContactTemplate from '../../../../components/Dialog/DialogTemplates/AddContactTemplate';

import '../PotentialServiceTypeSelect/index.css';
import { leadSource } from '../../../../constants/formOptions';
import {
  getClientContactByCompanyId,
  upsertClientContact,
} from '../../../../actions/clientActions';

import MyTooltip from '../../../../components/MyTooltip/myTooltip';
import Info from '@material-ui/icons/Info';
import { showErrorMessage } from '../../../../actions';
const accountList = [
  { value: 0, label: '0%' },
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
];

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
    errorInput: {
      '& .react-datepicker-wrapper>.react-datepicker__input-container>.react-datepicker__input-container input':
        {
          border: '1px solid #cc4b37 !improtant',
          backgroundColor: '#f9ecea !improtant',
        },
      '& .red-border': {
        border: '1px solid #cc4b37 !improtant',
        backgroundColor: '#f9ecea !improtant',
      },
    },
  },
};

class Lead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: Immutable.Map(),
      account: '',
      disabled: true,
      owners: '',
      treeList: null,
      value: '',
      addContactDialog: false,
      client: Immutable.Map(),
      contactIndex: 0,
      time: null,
      contacts: null,
    };
  }

  componentDidMount() {
    if (this.props.companyId) {
      this.getContacts(this.props.companyId);
    }
  }
  getContacts = (id) => {
    this.props.dispatch(getClientContactByCompanyId(id)).then((res) => {
      if (res) {
        this.setState({
          contacts: res.response,
        });
      }
    });
  };

  getMsg = (list, msg) => {
    this.setState({
      treeList: list,
      value: msg,
    });
  };
  addContact = (index) => {
    this.setState({
      addContactDialog: true,
      contactIndex: index,
    });
  };
  setContact = (name, key, index) => {
    this.props.setContact(name, key, index);
  };
  sendContact = (client) => {
    if (this.props.companyId) {
      client.companyId = Number(this.props.companyId);
      this.props
        .dispatch(upsertClientContact(client))
        .then((res) => {
          this.props.getNewContact(res, this.state.contactIndex);
          this.getContacts(this.props.companyId);
          this.setState({
            addContactDialog: false,
          });
        })
        .catch((err) => this.props.dispatch(showErrorMessage(err)));
    } else {
      this.props.getNewContact(client, this.state.contactIndex);
      this.setState({
        addContactDialog: false,
      });
    }
  };

  newOwners = (owners) => {
    let newOwnerList = owners.map((item, index) => {
      return {
        ...item,
      };
    });
    return newOwnerList;
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

  render() {
    const {
      classes,
      salesLeadList,
      t,
      i18n,
      serviceTypeTree,
      errorMessage,
      leadSourceError,
      estimatedDealTimeError,
      contactsError,
      salesLeadError,
      serviceTypeError,
      ...props
    } = this.props;
    const { range, disabled, value, treeList, addContactDialog, contacts } =
      this.state;
    const isZH = i18n.language.match('zh');
    return (
      <>
        {salesLeadList.map((item, index) => {
          return (
            <div key={index}>
              {salesLeadList.length !== 1 ? (
                <div
                  className="row expanded"
                  style={{ backgroundColor: '#edf5ff' }}
                >
                  <div className="small-11 columns">
                    <Typography variant="h6" gutterBottom>{`Sales Lead ${
                      index + 1
                    }`}</Typography>
                  </div>
                  <div className="small-1 columns">
                    <Button
                      color="primary"
                      onClick={() => {
                        this.props.delete(index);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                ''
              )}
              <div key={index} className="row expanded">
                <div className="small-6 columns">
                  <ShareInput
                    owners={item.owners}
                    label={t('field:SalesLeadOwner')}
                    leadIndex={index}
                    salesLeadError={salesLeadError}
                    errorMessage={errorMessage}
                    userList={this.props.userList}
                    addShare={() => {
                      console.log(index);
                      this.props.addShare(index);
                    }}
                    deleteOwner={(key) => {
                      this.props.deleteOwner(index, key);
                    }}
                    changeOwner={(key, owner) => {
                      this.props.changeOwner(index, key, owner);
                    }}
                    // {...props}
                  />
                </div>
                <div className="small-6 columns">
                  <ContactsInput
                    label={t('field:clientContact')}
                    companyId={this.props.companyId}
                    leadIndex={index}
                    contactsError={contactsError}
                    errorMessage={errorMessage}
                    contacts={contacts}
                    addContact={() => {
                      this.addContact(index);
                    }}
                    setContact={(name, key) => {
                      this.setContact(name, key, index);
                    }}
                    deleteContact={(key) => {
                      this.props.deleteContact(index, key);
                    }}
                    contactList={item.contacts}
                  />
                </div>
                <div className="small-6 columns">
                  <DatePicker
                    className={
                      errorMessage && errorMessage.get('estimatedDealTime')
                        ? classes.errorInput
                        : classes.fullWidth
                    }
                    selected={
                      item.estimatedDealTime && moment(item.estimatedDealTime)
                      // : this.state.time
                    }
                    onChange={(time) => {
                      // this.setState({ time });
                      this.props.setEstimatedDealTime(time, index);
                    }}
                    customInput={
                      <FormInput
                        label={t('field:Estimated Deal Time')}
                        isRequired={true}
                        errorMessage={
                          errorMessage &&
                          errorMessage.get('estimatedDealTime') &&
                          this.hasError(estimatedDealTimeError, index)
                            ? errorMessage.get('estimatedDealTime')
                            : null
                        }
                      />
                    }
                    placeholderText="mm/dd/yyyy"
                  />
                </div>
                <div className="small-6 columns">
                  <FormReactSelectContainer
                    label={t('field:AccountProgress')}
                    icon={
                      <MyTooltip
                        title={
                          <React.Fragment>
                            <div style={{ fontSize: '14px' }}>
                              Progress Milestones
                            </div>
                            <div style={{ fontSize: '14px' }}>
                              0%： Have not contacted client yet
                            </div>
                            <div style={{ fontSize: '14px' }}>
                              25%: Initial contact (conference call, email
                              contact, etc…)
                            </div>
                            <div style={{ fontSize: '14px' }}>
                              50%: Meet client in person/have lunch, client
                              shows interest
                            </div>
                            <div style={{ fontSize: '14px' }}>
                              75%: Negotiating terms
                            </div>
                          </React.Fragment>
                        }
                      >
                        <Info
                          style={{
                            width: '12px',
                            height: '12px',
                            color: '#bdbdbd',
                          }}
                        />
                      </MyTooltip>
                    }
                  >
                    <Select
                      name="Account Progress"
                      value={item.accountProgress}
                      onChange={(account) => {
                        this.props.changeAccountProgress(account, index);
                      }}
                      options={accountList}
                      valueKey={'value'}
                      labelKey={'label'}
                      autoBlur={true}
                      searchable={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                </div>
              </div>
              <div className="row expanded">
                <div className="small-6 columns">
                  <PotentialServiceTypeSelect
                    data={serviceTypeTree}
                    t={t}
                    width={'100%'}
                    value={value}
                    selected={item.serviceType}
                    sendServiceType={(checkedList) => {
                      this.props.sendServiceType(checkedList, index);
                    }}
                    getMsg={(list, msg) => {
                      this.getMsg(list, msg);
                    }}
                    errorMessage={errorMessage}
                    serviceTypeError={serviceTypeError}
                    salesLeadIndex={index}
                  />
                  {errorMessage &&
                  errorMessage.get('serviceType') &&
                  this.hasError(serviceTypeError, index) ? (
                    <span
                      style={{
                        color: '#cc4b37',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        fontFamily: 'Roboto',
                      }}
                    >
                      {errorMessage.get('serviceType')}
                    </span>
                  ) : null}
                  {/* <label style={{fontSize:'0.75em'}}>Service Type</label>
                  <DropdownTreeSelect 
                    data={serviceTypeTree?serviceTypeTree:[]} 
                    onChange={this.onChange} 
                    className="mdl-demo"/> */}
                </div>
                <div className="small-6 columns" style={{ paddingTop: '2px' }}>
                  <FormReactSelectContainer
                    label={t('field:LeadSource')}
                    isRequired={true}
                    errorMessage={
                      errorMessage &&
                      errorMessage.get('leadSource') &&
                      this.hasError(leadSourceError, index)
                        ? errorMessage.get('leadSource')
                        : null
                    }
                  >
                    <Select
                      name="Lead Source"
                      value={item.leadSource}
                      onChange={(source) => {
                        this.props.changeLeadSource(source, index);
                        this.setState({ source: source });
                      }}
                      options={leadSource}
                      valueKey={'value'}
                      labelKey={'label'}
                      autoBlur={true}
                      searchable={true}
                      clearable={false}
                    />
                  </FormReactSelectContainer>
                  {item.leadSource && item.leadSource === 'OTHER' ? (
                    <div>
                      <FormInput
                        value={item.otherSource}
                        onChange={(e) => {
                          this.props.OtherSource(e.target.value, index);
                        }}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <MyDialog
                btnShow={false}
                show={addContactDialog && this.state.contactIndex === index}
                modalTitle={`Create Contact`}
                handleClose={() => {
                  this.setState({ addContactDialog: false });
                }}
              >
                <AddContactTemplate
                  handleClose={() => {
                    this.setState({ addContactDialog: false });
                  }}
                  sendContact={(obj) => {
                    this.sendContact(obj);
                  }}
                  t={t}
                />
              </MyDialog>
            </div>
          );
        })}
      </>
    );
  }
}

const mapStoreStateToProps = (state, props) => {
  const serviceTypeTree = state.model.serviceTypeTree.tree;
  return { serviceTypeTree };
};

export default connect(mapStoreStateToProps)(withStyles(styles)(Lead));
