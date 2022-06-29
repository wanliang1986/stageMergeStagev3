import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Lead from './lead';

const styles = {
  leadroot: {
    width: '100%',
    marginTop: '5px',
  },
};

class SalesLead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salesLeadList: props.salesLead,
    };
  }

  render() {
    const {
      classes,
      salesLead,
      treeList,
      errorMessage,
      leadSourceError,
      estimatedDealTimeError,
      salesLeadError,
      contactsError,
      serviceTypeError,

      ...props
    } = this.props;
    const { salesLeadList } = this.state;
    console.log(salesLead);
    return (
      <div className={classes.leadroot}>
        <div className="row expanded">
          <div className="small-6 columns">
            <Typography>{this.props.t('tab:Sales Lead')}</Typography>
          </div>
          <div className="small-6 columns" style={{ textAlign: 'right' }}>
            <Button
              color="primary"
              onClick={() => {
                this.props.addSalesLead();
              }}
            >
              {this.props.t('tab:Add New Sales Lead')}
            </Button>
          </div>
        </div>
        <Lead
          salesLeadList={salesLead}
          leadSourceError={leadSourceError}
          estimatedDealTimeError={estimatedDealTimeError}
          errorMessage={errorMessage}
          salesLeadError={salesLeadError}
          contactsError={contactsError}
          serviceTypeError={serviceTypeError}
          delete={(index) => {
            this.props.deleteSalesLead(index);
          }}
          addShare={(index) => {
            this.props.addShare(index);
          }}
          deleteOwner={(index, key) => {
            this.props.deleteOwner(index, key);
          }}
          changeOwner={(index, key, owner) => {
            this.props.changeOwner(index, key, owner);
          }}
          getNewContact={(contact, index) => {
            this.props.getNewContact(contact, index);
          }}
          deleteContact={(index, key) => {
            this.props.deleteContact(index, key);
          }}
          setEstimatedDealTime={(time, index) => {
            this.props.setEstimatedDealTime(time, index);
          }}
          changeAccountProgress={(account, index) => {
            this.props.changeAccountProgress(account, index);
          }}
          changeLeadSource={(source, index) => {
            this.props.changeLeadSource(source, index);
          }}
          sendServiceType={(checkedList, index) => {
            this.props.sendServiceType(checkedList, index);
          }}
          OtherSource={(val, index) => {
            this.OtherSource(val, index);
          }}
          setContact={(name, key, index) => {
            this.props.setContact(name, key, index);
          }}
          {...props}
        />
      </div>
    );
  }
}

export default withStyles(styles)(SalesLead);
