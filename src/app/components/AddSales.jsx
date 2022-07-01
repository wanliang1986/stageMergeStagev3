import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import DeleteIcon from '@material-ui/icons/Delete';
import FormReactSelectContainer from './particial/FormReactSelectContainer';
import { connect } from 'react-redux';
import { getActiveTenantUserList } from '../selectors/userSelector';
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
const ownerList = [
  { value: 'jing', label: 'jing' },
  { value: 'wang', label: 'wang' },
  { value: 'lin', label: 'lin' },
];

class AddSales extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  changeOwner = (key, owner) => {
    this.props.changeOwner(key, owner);
  };
  render() {
    const {
      classes,
      label,
      saleLeadOwner,
      isReduired,
      userList,
      errorMessage,
    } = this.props;
    const { owner } = this.state;
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
                  this.props.addShare();
                }}
                color="primary"
              >
                Add Share
              </Button>
            </div>
          </div>
          {saleLeadOwner.map((val, key) => {
            return (
              <div key={val}>
                <FormReactSelectContainer
                  errorMessage={
                    errorMessage && errorMessage.get('salesLeadOwner')
                      ? true
                      : false
                  }
                >
                  <div className="row expanded">
                    <div
                      className={
                        saleLeadOwner.length === 1
                          ? 'small-12 columns'
                          : 'small-10 columns'
                      }
                      style={{ padding: '0px' }}
                    >
                      <Select
                        name="Sales Lead Owner"
                        value={
                          saleLeadOwner[key].fullName
                            ? saleLeadOwner[key].fullName
                            : ''
                        }
                        onChange={(owner) => {
                          this.changeOwner(key, owner);
                        }}
                        options={userList}
                        valueKey={'fullName'}
                        labelKey={'fullName'}
                        autoBlur={true}
                        searchable={true}
                        clearable={false}
                      />
                    </div>
                    {saleLeadOwner.length > 1 ? (
                      <div className="small-2 columns">
                        <DeleteIcon
                          onClick={() => {
                            this.props.deleteOwner(key);
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
                <input
                  name="Sales Lead Owner"
                  type="hidden"
                  value={saleLeadOwner[key].fullName}
                />
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const mapStoreStateToProps = (state, props) => {
  const userList = getActiveTenantUserList(state).toJS();
  return { userList };
};

export default connect(mapStoreStateToProps)(withStyles(styles)(AddSales));
