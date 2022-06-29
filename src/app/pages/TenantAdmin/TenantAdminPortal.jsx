import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TenantAdminportalTable from '../../components/Tables/TenantAdminportalTable';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import { getTenantAdminList } from '../../actions/tenantAdmin';
import { connect } from 'react-redux';
import TenantsAdminStatus from './tenantsAdminStatus';
import Loading from '../../components/particial/Loading';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '10px',
  },
  pageNav: {
    width: '100%',
    height: '50px',
    lineHeight: '50px',
  },
};

let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class TenantAdminPortal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantList: null,
      openTenantStatus: false,
      selectedTenant: null,
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    this.props.dispatch(getTenantAdminList()).then((res) => {
      if (res) {
        this.setState({
          tenantList: res,
        });
      }
    });
  };
  handleStatusChange = (event, selectedTenant) => {
    event.preventDefault();
    this.setState({
      anchorEl: event.currentTarget,
      selectedTenant,
      openTenantStatus: true,
    });
  };

  handleClosePop = () => {
    this.setState({ openTenantStatus: false });
  };

  render() {
    const { classes, ...props } = this.props;
    const { tenantList, anchorEl, openTenantStatus, selectedTenant } =
      this.state;
    return (
      <>
        <Paper elevation={3} className={classes.root}>
          <div className={classes.pageNav}>
            <Link to={`/tenantAdminPortal/create`}>
              <Button variant="contained" color="primary">
                Create Tenant
              </Button>
            </Link>
          </div>
          <Divider />
          <div style={{ width: '100%', height: '90%', overflow: 'hidden' }}>
            {tenantList ? (
              <>
                <TenantAdminportalTable
                  tenantList={Immutable.List(tenantList)}
                  onScrollEnd={onScrollEnd}
                  scrollLeft={status.scrollLeft}
                  scrollTop={status.scrollTop}
                  onStatusChange={this.handleStatusChange}
                />
                <Popover
                  open={openTenantStatus}
                  anchorEl={anchorEl}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  onClose={this.handleClosePop}
                >
                  <TenantsAdminStatus
                    {...props}
                    selectedTenant={selectedTenant}
                    fetchData={() => {
                      this.fetchData();
                    }}
                    onClose={this.handleClosePop}
                  />
                </Popover>
              </>
            ) : (
              <Loading />
            )}
          </div>
        </Paper>
      </>
    );
  }
}

export default connect()(withStyles(styles)(TenantAdminPortal));
