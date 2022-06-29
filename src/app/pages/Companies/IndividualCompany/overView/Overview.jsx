import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import ProspectOverView from './prospectOverView';
import ClientOverView from './ClientOverView';
import { getProCompanyById } from '../../../../../apn-sdk/client';
import { connect } from 'react-redux';
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
    const { classes, t, company, companyType, ...props } = this.props;
    return (
      <div className={classes.root}>
        {companyType !== '1' ? (
          <ClientOverView company={company} t={t} />
        ) : (
          <ProspectOverView company={company} t={t} />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  console.log(match);
  const companyType = match.params.type;
  return {
    companyType,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Overview));
