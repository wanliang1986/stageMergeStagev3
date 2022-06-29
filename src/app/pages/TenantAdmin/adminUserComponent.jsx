import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import FormInput from '../../components/particial/FormInput';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
const styles = {};

class AdminUserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: this.props.admins,
    };
  }
  addAdmin = () => {
    let obj = { firstName: null, lastName: null, email: null };
    this.props.addAdmin(obj);
  };
  componentWillReceiveProps(nextProps) {
    this.setState({
      users: nextProps.admins,
    });
  }
  render() {
    const { classes, admins, type, errorMessage } = this.props;
    const { users } = this.state;
    return (
      <>
        <React.Fragment>
          <div className="row expanded">
            <div className="small-3 columns">
              <label
                style={
                  errorMessage
                    ? {
                        fontSize: '12px',
                        fontFamily: 'Roboto',
                        color: '#cc4b37',
                      }
                    : { fontSize: '12px', fontFamily: 'Roboto' }
                }
              >
                Admin FirstName <span style={{ color: 'red' }}>*</span>
              </label>
              {users &&
                users.map((item, index) => {
                  return (
                    <FormInput
                      key={index + item.firstName}
                      errorMessage={errorMessage ? true : false}
                      name="adminFirstName"
                      // label={t('field:adminFirstName')}
                      disabled={type === 1}
                      defaultValue={item.firstName}
                      // isRequired={true}
                      onBlur={(event) => {
                        // this.setAdminFirstName(event);
                        this.props.removeErrorMsgHandler('adminOptions');
                        this.props.setAdminFirstName(event, index);
                      }}
                    />
                  );
                })}
            </div>
            <div className="small-3 columns">
              <label
                style={
                  errorMessage
                    ? {
                        fontSize: '12px',
                        fontFamily: 'Roboto',
                        color: '#cc4b37',
                      }
                    : { fontSize: '12px', fontFamily: 'Roboto' }
                }
              >
                Admin LastName <span style={{ color: 'red' }}>*</span>
              </label>
              {users &&
                users.map((item, index) => {
                  return (
                    <FormInput
                      errorMessage={errorMessage ? true : false}
                      key={index + item.lastName}
                      name="adminLastName"
                      disabled={type === 1}
                      defaultValue={item.lastName}
                      onBlur={(event) => {
                        this.props.removeErrorMsgHandler('adminOptions');
                        this.props.setAdminLastName(event, index);
                      }}
                    />
                  );
                })}
            </div>
            <div className="small-6 columns">
              <label
                style={
                  errorMessage
                    ? {
                        fontSize: '12px',
                        fontFamily: 'Roboto',
                        color: '#cc4b37',
                      }
                    : { fontSize: '12px', fontFamily: 'Roboto' }
                }
              >
                Admin Email <span style={{ color: 'red' }}>*</span>
              </label>
              {users &&
                users.map((item, index) => {
                  return (
                    <React.Fragment key={index + item.email}>
                      <div className="row">
                        <div
                          className={
                            type === 1 || users.length === 1
                              ? 'small-12'
                              : 'small-10'
                          }
                        >
                          <FormInput
                            errorMessage={errorMessage ? true : false}
                            key={index + item.email}
                            name="adminEmail"
                            disabled={type === 1}
                            defaultValue={item.email}
                            onBlur={(event) => {
                              this.props.removeErrorMsgHandler('adminOptions');
                              this.props.setEmail(event, index);
                            }}
                          />
                        </div>
                        {type === 2 && users.length > 1 && (
                          <div
                            className="small-2"
                            style={{ textAlign: 'center' }}
                          >
                            <DeleteIcon
                              style={{
                                color: '#8E8E8E',
                                marginTop: '5px',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                this.props.deleteAdmin(index);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
            </div>
          </div>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 'bold',
              color: '#cc4b37',
              paddingLeft: '4px',
            }}
          >
            {errorMessage}
          </p>
        </React.Fragment>
        {type === 2 && (
          <Button
            color="primary"
            onClick={() => {
              this.addAdmin();
            }}
          >
            Add Admin
          </Button>
        )}
      </>
    );
  }
}

export default withStyles(styles)(AdminUserComponent);
