import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import ProspectOverView from './prospectOverView';
import ClientOverView from './ClientOverView';
import { getProCompanyById } from '../../../../../apn-sdk/client';
const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '20px',
  },
};

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, t, company, ...props } = this.props;
    let type = company.get('type');
    return (
      <div className={classes.root}>
        {type !== 'POTENTIAL_CLIENT' ? (
          <ClientOverView company={company} t={t} />
        ) : (
          <ProspectOverView company={company} t={t} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Overview);
