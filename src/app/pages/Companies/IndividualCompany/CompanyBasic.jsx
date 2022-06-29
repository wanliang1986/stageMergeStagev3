import React, { Component } from 'react';
import { industryList, typeList } from '../../../constants/formOptions';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import PotentialButton from '../../../components/particial/PotentialButton';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MyDialog from '../../../components/Dialog/myDialog';
import UpgradeClientFirst from '../../../components/Dialog/DialogTemplates/UpgradeClientFirst';
import UpgradeClientSecond from '../../../components/Dialog/DialogTemplates/UpgradeClientSecond';
import AddSalesLeadTemplate from '../../../components/Dialog/DialogTemplates/AddSalesLeadTemplate';
import {
  addSaleLead,
  getSaleLead,
  updateContactPhone,
  getCompany,
  getClientContactList,
} from '../../../actions/clientActions';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import lodash from 'lodash';
import { replace } from 'connected-react-router';
import { showErrorMessage } from '../../../actions/index';
import { getTenantUserList } from '../../../selectors/userSelector';

const styles = {
  prospectColor: {
    minWidth: '97px',
    marginLeft: '20px',
    height: '26px',
    margin: ' 0 1px',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '1.86',
    letterSpacing: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgb(226,245,236)',
    border: '1px solid #42c184',
    color: '#42c184',
  },
  clientColor: {
    minWidth: '97px',
    marginLeft: '20px',
    height: '26px',
    margin: '0 4px 0 6px',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: '1.86',
    letterSpacing: 'normal',
    textAlign: 'center',
    backgroundColor: 'rgb(222,238,249)',
    border: '1px solid #3398dc',
    color: '#3398dc',
  },
};

class CompanyBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientDialog: false,
      clientDialog2: false,
      salesLeadDialog: false,
      type: false,
      formData: {
        owners: [{}],
        contacts: [{}],
        estimatedDealTime: null,
        accountProgress: 0,
        serviceType: null,
        leadSource: null,
        companyId: props.company.toJS().id,
        updateContactDialog: false,
        creating: false,
      },
      salesLead: null,
      upgradeClientType: 0, // 1: with contract  2：without contract
      errorMessage: Immutable.Map(),
      noPhoneContacts: [],
      phoneError: [],
    };
  }

  componentDidMount() {
    this.getSaleLeadList();
  }

  getSaleLeadList = () => {
    this.props
      .dispatch(getSaleLead(this.props.company.toJS().id))
      .then((res) => {
        if (res) {
          let salesLeadList = res.response;
          salesLeadList.forEach((item, index) => {
            item.index = index;
          });
          this.setState({
            salesLead: salesLeadList,
          });
        }
      });
  };

  // add by bill
  selectdType = (type) => {
    this.setState({
      upgradeClientType: type,
    });
  };

  editCompanyHandler = () => {
    let { companyId, history, company } = this.props;
    if (company.get('type') === 'POTENTIAL_CLIENT') {
      history.push(`/companies/edit/${companyId}`);
    } else {
      history.push(`/companies/clientEdit/${companyId}`);
    }
  };

  _getAddress = (address) => {
    let res = '';
    if (address) {
      res = address.get('city') || '';
      res = `${res ? `${res}, ` : ''}${address.get('province') || ''}`;
    }
    return res;
  };

  //开启upgradeClient弹窗
  upgradeClient = () => {
    this.setState({
      clientDialog: true,
    });
  };

  next = () => {
    this.setState({
      clientDialog: false,
      clientDialog2: true,
    });
  };

  primary = () => {
    console.log(123);
  };

  checkToProspect = () => {
    this.props.history.push(`/companies/detail/${this.props.companyId}/1`);
    window.location.reload();
  };
  checkToClient = () => {
    this.props.history.push(`/companies/detail/${this.props.companyId}/0`);
    window.location.reload();
  };
  AddSalesLead = () => {
    this.setState({
      salesLeadDialog: true,
      updateContact: false,
    });
  };

  addShare = () => {
    let obj = {};
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.owners.push(obj);
    this.setState({
      formData: newFormData,
    });
  };
  deleteOwner = (key) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.owners.splice(key, 1);
    this.setState({
      formData: newFormData,
    });
  };

  changeOwner = (key, owner) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.owners[key] = owner;
    this.setState({
      formData: newFormData,
    });
  };

  addContact = () => {
    let obj = {};
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.contacts.push(obj);
    this.setState({
      formData: newFormData,
    });
  };
  deleteContact = (key) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.contacts.splice(key, 1);
    this.setState({
      formData: newFormData,
    });
  };

  changeContact = (key, owner) => {
    console.log(owner);
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.contacts[key] = owner;
    this.setState({
      formData: newFormData,
    });
  };

  getDelTime = (date) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.estimatedDealTime = date.toJSON();
    this.setState({
      formData: newFormData,
    });
  };
  changeProgress = (val) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    if (val) {
      newFormData.accountProgress = val;
    } else {
      newFormData.accountProgress = 0;
    }
    this.setState({
      formData: newFormData,
    });
  };

  sendServiceType = (checkedList) => {
    let arr = [];
    let newFormData = lodash.cloneDeep(this.state.formData);
    checkedList.forEach((item, index) => {
      arr.push(item.id);
    });
    newFormData.serviceType = arr;
    this.setState({
      formData: newFormData,
    });
  };

  changeLeadSource = (val) => {
    let newFormData = lodash.cloneDeep(this.state.formData);
    newFormData.leadSource = val;
    this.setState({
      formData: newFormData,
    });
  };

  sumbit = () => {
    this.setState({
      creating: true,
    });
    const { t } = this.props;
    if (!this.state.updateContact) {
      let errorMessage = this._validateForm(this.state.formData, t);
      if (errorMessage) {
        this.setState({ creating: false });
        return this.setState({ errorMessage });
      }
      this.props
        .dispatch(addSaleLead(this.state.formData))
        .then((res) => {
          if (res && res.response.length === 0) {
            this.setState({
              salesLeadDialog: false,
              creating: false,
              formData: {
                owners: [{}],
                contacts: [{}],
                estimatedDealTime: null,
                accountProgress: 0,
                serviceType: null,
                leadSource: null,
                companyId: this.props.company.toJS().id,
              },
            });
            let type =
              this.props.company.get('type') === 'POTENTIAL_CLIENT' ? 1 : 0;
            this.props
              .dispatch(getCompany(this.props.companyId, type))
              .catch((err) => {
                if (err === 404) {
                  this.props.dispatch(replace('/companies/nomatch'));
                } else {
                  this.props.dispatch(showErrorMessage(err));
                }
              });
            this.getSaleLeadList();
            this.props.dispatch(getClientContactList(this.props.companyId));
          } else {
            let noPhoneContactsName = [];
            res &&
              res.response.forEach((item, index) => {
                if (!item.contactCategory || !item.email) {
                  noPhoneContactsName.push(item.name);
                }
              });
            if (noPhoneContactsName.length > 0) {
              let names;
              if (noPhoneContactsName.length === 1) {
                names = noPhoneContactsName.join(' ');
              } else {
                names = noPhoneContactsName.join(', ');
              }
              this.props.dispatch(
                showErrorMessage(
                  `The selected contact (${names}) has many missing information, please go to the contact page to supplement`
                )
              );
              this.setState({
                creating: false,
              });
            } else {
              if (res) {
                this.setState({
                  updateContact: true,
                  creating: false,
                  noPhoneContacts: res.response,
                });
              }
            }
          }
        })
        .catch((err) => {
          this.props.dispatch(showErrorMessage(err));
          this.setState({
            creating: false,
          });
        });
    } else {
      let errorMessage = this.valiContactsPhoneForm(
        this.state.noPhoneContacts,
        t
      );
      if (errorMessage) {
        this.setState({ creating: false });
        return this.setState({ errorMessage });
      }
      this.props
        .dispatch(updateContactPhone(this.state.noPhoneContacts))
        .then((res) => {
          if (res.response) {
            this.setState({
              creating: false,
              updateContact: false,
            });
          }
        });
    }
  };

  handleClose = () => {
    if (!this.state.updateContact) {
      this.setState({
        salesLeadDialog: false,
        creating: false,
        formData: {
          owners: [{}],
          contacts: [{}],
          estimatedDealTime: null,
          accountProgress: 0,
          serviceType: null,
          leadSource: null,
          companyId: this.props.company.toJS().id,
          updateContactDialog: false,
          creating: false,
        },
      });
    } else {
      this.setState({
        updateContact: false,
        creating: false,
      });
    }
  };

  valiContactsPhoneForm(formData, t) {
    let errorMessage = Immutable.Map();
    let phoneError = [];
    formData.forEach((item, index) => {
      if (item.phone === '' || item.phone === null) {
        phoneError.push({ key: index, error: true });
        errorMessage = errorMessage.set('phone', t('message:phoneIsRequired'));
      } else {
        let regName = /^([\d+(-][-\d+\s\/)(*.·]{8,25}(\s*ext\s*\d{3,})?)$/i;
        if (!regName.test(item.phone)) {
          errorMessage = errorMessage.set(
            'phone',
            t('message:phoneFormatError')
          );
          phoneError.push({ key: index, error: true });
        } else {
          phoneError.push({ key: index, error: false });
        }
      }
    });
    this.setState({
      phoneError,
    });
    return errorMessage.size > 0 && errorMessage;
  }

  _validateForm(formData, t) {
    let errorMessage = Immutable.Map();
    if (!formData.leadSource) {
      errorMessage = errorMessage.set(
        'leadSource',
        t('message:leadSourceIsRequired')
      );
    }

    if (!formData.serviceType || formData.serviceType.length === 0) {
      errorMessage = errorMessage.set(
        'serviceType',
        t('message:serviceTypeIsRequired')
      );
    }

    if (!formData.estimatedDealTime) {
      errorMessage = errorMessage.set(
        'estimatedDealTime',
        t('message:estimatedDealTimeIsRequired')
      );
    }

    // if (!formData.accountProgress) {
    //   errorMessage = errorMessage.set(
    //     'accountProgress',
    //     t('message:accountProgressIsRequired')
    //   );
    // }

    if (!formData.owners || formData.owners.length === 0) {
      errorMessage = errorMessage.set(
        'salesLeadOwner',
        t('message:salesLeadOwnerIsRequired')
      );
    }
    if (formData.owners) {
      let ownersValidateLsit = [];
      let validate = this.ownersValidate(formData.owners);
      ownersValidateLsit.push(validate);
      if (
        ownersValidateLsit.some((item, index) => {
          return item === false;
        })
      ) {
        errorMessage = errorMessage.set(
          'salesLeadOwner',
          t('message:salesLeadOwnerIsRequired')
        );
      }
    }
    //判断sales lead owner是否有空数据
    if (!formData.contacts || formData.contacts.length === 0) {
      errorMessage = errorMessage.set(
        'contacts',
        t('message:contactsIsRequired')
      );
    }
    if (formData.contacts) {
      let contactsValidateList = [];
      let contactValidate = this.contactValidate(formData.contacts);
      contactsValidateList.push(contactValidate);
      if (
        contactsValidateList.some((item, index) => {
          return item === false;
        })
      ) {
        errorMessage = errorMessage.set(
          'contacts',
          t('message:contactsIsRequired')
        );
      }
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
      return item.id;
    });
    return Validate;
  };

  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  setPhone = (val, index) => {
    let newList = lodash.cloneDeep(this.state.noPhoneContacts);
    newList[index].phone = val;
    this.setState({
      noPhoneContacts: newList,
    });
  };

  setEmail = (val, index) => {
    let newList = lodash.cloneDeep(this.state.noPhoneContacts);
    newList[index].email = val;
    this.setState({
      noPhoneContacts: newList,
    });
  };

  setOtherCategory = (val, index) => {
    let newList = lodash.cloneDeep(this.state.noPhoneContacts);
    newList[index].otherCategory = val;
    this.setState({
      noPhoneContacts: newList,
    });
  };

  setContactCategory = (val, index) => {
    let newList = lodash.cloneDeep(this.state.noPhoneContacts);
    newList[index].contactCategory = val;
    this.setState({
      noPhoneContacts: newList,
    });
  };

  getType = (str) => {
    switch (str) {
      case 'POTENTIAL_CLIENT':
        return 'Prospect';
      case 'KEY_ACCOUNT':
        return 'Client - Key Account';
      case 'SUPER_KEY_ACCOUNT':
        return 'Client - Super Key Account';
      case 'COMMERCIAL_ACCOUNT':
        return 'Client - Commercial Account';
      case 'SUN_SET':
        return 'Client - Sunset ';
    }
  };

  render() {
    const {
      t,
      company,
      isCompanyAdmin,
      classes,
      isProspect,
      userList,
      userlist,
      ...props
    } = this.props;
    const {
      clientDialog,
      clientDialog2,
      type,
      salesLeadDialog,
      upgradeClientType,
      salesLead,
      errorMessage,
      updateContact,
      noPhoneContacts,
      creating,
      phoneError,
    } = this.state;
    return (
      <section
        style={{
          display: 'flex',
          padding: '20px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex' }}>
          {company.get('logo') ? (
            <img
              alt="logo"
              src={company.get('logo')}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '5px',
                marginRight: '20px',
              }}
            />
          ) : (
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '5px',
                border: '1px solid #C8C8C8',
                marginRight: '20px',
              }}
            />
          )}
          <div style={{ paddingTop: '10px' }}>
            <Typography variant="h5" gutterBottom>
              {nameFilter(company.get('name'))}
              <Chip
                label={
                  t(`tab:${this.getType(company.get('type'))}`)
                  // company.get('type') === 'POTENTIAL_CLIENT'
                  //   ? 'Prospect'
                  //   : 'Client - ' + company.get('type')
                }
                className={
                  isProspect ? classes.prospectColor : classes.clientColor
                }
              />
            </Typography>
            <div>
              {isProspect ? (
                <>
                  {company.get('prospectAndClient') ? (
                    <Button
                      color="primary"
                      onClick={() => {
                        this.checkToClient();
                      }}
                    >
                      {t('tab:Check Other Service Types With This Client')}
                    </Button>
                  ) : null}
                  <Button
                    color="primary"
                    onClick={() => {
                      this.upgradeClient();
                    }}
                  >
                    {t('tab:Promote to Client')}
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      this.AddSalesLead();
                    }}
                  >
                    {t('tab:Add Sales Lead')}
                  </Button>
                </>
              ) : (
                <>
                  {company.get('prospectAndClient') ? (
                    <>
                      <Button
                        color="primary"
                        onClick={() => {
                          this.checkToProspect();
                        }}
                      >
                        {t('tab:Check Other Sales Leads With This Client')}
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          this.AddSalesLead();
                        }}
                      >
                        {t('tab:Add Sales Lead')}
                      </Button>
                    </>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() => {
                        this.AddSalesLead();
                      }}
                    >
                      {t('tab:Add Sales Lead')}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <PotentialButton
          onClick={this.editCompanyHandler}
          style={{ padding: '2px 30px' }}
          // disabled={!isCompanyAdmin}
        >
          {t('action:edit')}
        </PotentialButton>

        {/* 1 */}
        {/* Upgrade to Client */}
        <MyDialog
          btnShow={true}
          show={clientDialog}
          modalTitle={t('tab:Upgrade to Client')}
          SubmitBtnShow={true}
          SubmitBtnMsg={'Next'}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={true}
          CancelBtnMsg={t('tab:Cancel')}
          CancelBtnVariant={''}
          primary={() => {
            this.next();
          }}
          handleClose={() => {
            this.setState({
              clientDialog: false,
            });
          }}
        >
          <UpgradeClientFirst
            t={this.props.t}
            selectdType={(val) => this.selectdType(val)}
          />
        </MyDialog>

        {/* 2 */}
        {/* Promote to Client */}
        <MyDialog
          btnShow={true}
          show={clientDialog2}
          modalTitle={`${t('tab:Promote to Client')}`}
          SubmitBtnShow={false}
          SubmitBtnMsg={t('action:submit')}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={false}
          CancelBtnMsg={t('tab:Cancel')}
          CancelBtnVariant={''}
          primary={() => {
            this.primary();
          }}
          handleClose={() => {
            this.setState({
              upgradeClientType: '2',
              clientDialog2: false,
            });
          }}
        >
          <UpgradeClientSecond
            upgradeClientType={upgradeClientType}
            t={t}
            companyId={company.get('id')}
            userList={userList}
            userlist={userlist}
            salesLead={salesLead}
            handleClose={() => {
              this.setState({
                upgradeClientType: '2',
                clientDialog2: false,
              });
            }}
          />
        </MyDialog>

        <MyDialog
          btnShow={true}
          show={salesLeadDialog}
          creating={creating}
          modalTitle={t('tab:Add Sales Lead')}
          SubmitBtnShow={true}
          SubmitBtnMsg={t('action:submit')}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={true}
          CancelBtnMsg={t('tab:Cancel')}
          CancelBtnVariant={''}
          primary={() => {
            this.sumbit();
          }}
          handleClose={() => {
            this.setState({
              errorMessage: errorMessage.clear(),
            });
            this.handleClose();
          }}
        >
          <AddSalesLeadTemplate
            t={t}
            errorMessage={errorMessage}
            updateContact={updateContact}
            noPhoneContacts={noPhoneContacts}
            removeErrorMsgHandler={this.removeErrorMsgHandler}
            companyId={company.get('id')}
            formData={this.state.formData}
            phoneError={phoneError}
            addShare={() => {
              this.addShare();
            }}
            deleteOwner={(key) => {
              this.deleteOwner(key);
            }}
            changeOwner={(key, owner) => {
              this.changeOwner(key, owner);
            }}
            addContact={() => {
              this.addContact();
            }}
            deleteContact={(key) => {
              this.deleteContact(key);
            }}
            changeContact={(key, owner) => {
              this.changeContact(key, owner);
            }}
            getDelTime={(date) => {
              this.getDelTime(date);
            }}
            changeProgress={(val) => {
              this.changeProgress(val);
            }}
            sendServiceType={(checkedList) => {
              this.sendServiceType(checkedList);
            }}
            changeLeadSource={(val) => {
              this.changeLeadSource(val);
            }}
            setPhone={(val, index) => {
              this.setPhone(val, index);
            }}
            setEmail={(val, index) => {
              this.setEmail(val, index);
            }}
            setOtherCategory={(val, index) => {
              this.setOtherCategory(val, index);
            }}
            setContactCategory={(val, index) => {
              this.setContactCategory(val, index);
            }}
          />
        </MyDialog>
      </section>
    );
  }
}

const mapStoreStateToProps = (state) => {
  const userList = getTenantUserList(state).toJS();
  const userlist = getTenantUserList(state);
  return { userList, userlist };
};

const nameFilter = (value) => {
  let length = value.length;
  let str;
  if (length > 40) {
    str = value.substr(0, 40) + '...';
  } else {
    str = value;
  }
  return str;
};

export default connect(mapStoreStateToProps)(withStyles(styles)(CompanyBasic));
