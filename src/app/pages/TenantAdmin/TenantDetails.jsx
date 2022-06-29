import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TenantBasic from './TenantBasic';
import TenantView from './TenantView';
import { connect } from 'react-redux';
import { getTenantAdminDetails } from '../../actions/tenantAdmin';
import Loading from '../../components/particial/Loading';
import { withTranslation } from 'react-i18next';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '10px',
  },
};

class TenantDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantDetail: null,
    };
  }
  componentDidMount() {
    const { tenantId } = this.props;
    if (tenantId) {
      this.props.dispatch(getTenantAdminDetails(tenantId)).then((res) => {
        if (res) {
          this.setState({
            tenantDetail: res,
          });
        }
      });
    }
  }
  render() {
    const { classes, ...props } = this.props;
    const { tenantDetail } = this.state;
    if (!tenantDetail) {
      return <Loading />;
    }
    return (
      <div className={classes.root}>
        <Paper>
          <TenantBasic {...props} tenantDetail={tenantDetail} />
        </Paper>
        <Paper style={{ marginTop: '20px' }}>
          <TenantView tenantDetail={tenantDetail} />
        </Paper>
      </div>
    );
  }
}

const mapStoreStateToProps = (state, { match }) => {
  // console.log('EditEducation match', match);
  const tenantId = match.params.id;

  return {
    tenantId: tenantId,
  };
};

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStoreStateToProps)(withStyles(styles)(TenantDetails))
);
