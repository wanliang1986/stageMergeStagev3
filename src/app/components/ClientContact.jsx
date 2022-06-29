import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import DeleteIcon from '@material-ui/icons/Delete';
import FormReactSelectContainer from './particial/FormReactSelectContainer';
import { connect } from 'react-redux';
import { getClientContactArrayByCompany } from '../selectors/clientSelector';
const styles = {
  root: {
    width: '100%',
  },
  add: {
    fontSize: '12px',
    padding: '0px',
    fontWeight: 'bold',
    color: '#3498DB',
    cursor: 'pointer',
    '&:hover': {
      color: '#157FC5',
    },
  },
};

class ClientContact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owners: props.salesLeadOwner,
      owner: '',
    };
  }
  changeOwner = (key, owner) => {
    this.props.changeOwner(key, owner);
  };
  changeContact = (key, owner) => {
    this.props.changeContact(key, owner);
  };
  render() {
    const {
      classes,
      label,
      clientContact,
      isReduired,
      clientList,
      errorMessage,
    } = this.props;
    return (
      <>
        <div>
          <div className="row expanded">
            <div
              className="small-7 columns"
              style={{ fontSize: '12px', padding: '0px' }}
            >
              {label} <span style={{ color: 'red' }}>*</span>
            </div>
            <div className="small-5 columns" style={{ textAlign: 'right' }}>
              <Button
                style={{ padding: '0px 0px 0px 10px', fontSize: '12px' }}
                onClick={() => {
                  this.props.addContact();
                }}
                color="primary"
              >
                Add Contact
              </Button>
            </div>
          </div>
          {clientContact.map((val, key) => {
            return (
              <div key={key}>
                <FormReactSelectContainer
                  key={key}
                  errorMessage={
                    errorMessage && errorMessage.get('contacts') ? true : false
                  }
                >
                  <div className="row expanded">
                    <div
                      className={
                        clientContact.length === 1
                          ? 'small-12 columns'
                          : 'small-10 columns'
                      }
                      style={{ padding: '0px' }}
                    >
                      <Select
                        name="Sales Lead Owner"
                        value={
                          clientContact[key].name ? clientContact[key].name : ''
                        }
                        onChange={(owner) => {
                          this.changeContact(key, owner);
                        }}
                        options={clientList}
                        valueKey={'name'}
                        labelKey={'name'}
                        autoBlur={true}
                        searchable={true}
                        clearable={false}
                      />
                    </div>
                    {clientContact.length > 1 ? (
                      <div className="small-2 columns">
                        <DeleteIcon
                          onClick={() => {
                            this.props.deleteContact(key);
                          }}
                          style={{
                            color: '#797979',
                            marginTop: '5px',
                            cursor: 'pointer',
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </FormReactSelectContainer>
                {/* <input
                  name="Sales Lead Owner"
                  type="hidden"
                  value={clientContact[key].name}
                /> */}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state, props) => {
  let _clientList = getClientContactArrayByCompany(state, props.companyId);
  console.log(_clientList);
  let clientList = _clientList.map((item, index) => {
    return {
      ...item,
      disabled: !item.active,
    };
  });
  return { clientList };
};
export default connect(mapStateToProps)(withStyles(styles)(ClientContact));
