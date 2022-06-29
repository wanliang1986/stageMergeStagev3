import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import PotentialButton from '../../components/particial/PotentialButton';
import { withStyles } from '@material-ui/styles';
import moment from 'moment-timezone';

const styles = {};

class TenantBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getCreate = () => {
    const { tenantDetail } = this.props;
    if (tenantDetail) {
      return (
        'Created at ' +
        moment(tenantDetail.createdDate).format('MM/DD/YYYY') +
        'By ' +
        tenantDetail.createdBy
      );
    }
  };
  edit = () => {
    const { tenantDetail } = this.props;
    this.props.history.push(`/tenantAdminPortal/edit/${tenantDetail.id}`);
  };
  render() {
    const { tenantDetail, ...props } = this.props;
    return (
      <section
        style={{
          display: 'flex',
          padding: '20px',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex' }}>
          {tenantDetail.logo ? (
            <img
              alt="logo"
              src={tenantDetail.logo}
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
              {tenantDetail.name}
              <Chip
                variant="outlined"
                size="small"
                label={tenantDetail.status === 1 ? 'Active' : 'Inactive'}
                style={{
                  marginLeft: '10px',
                  backgroundColor: 'rgba(51, 152, 220, 0.16)',
                }}
              />
            </Typography>
            <div>{this.getCreate()}</div>
          </div>
        </div>
        <PotentialButton
          style={{ padding: '2px 30px' }}
          // disabled={!isCompanyAdmin}
          onClick={() => {
            this.edit();
          }}
        >
          {'edit'}
        </PotentialButton>
      </section>
    );
  }
}

export default withStyles(styles)(TenantBasic);
