import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import TenantInfo from './TenantInfo';
import { getTenantAdminDetails } from '../../actions/tenantAdmin';
import Loading from '../../components/particial/Loading';

class TenantAdminCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantInfo: null,
    };
  }

  componentDidMount() {
    const { tenantId } = this.props;
    if (tenantId) {
      this.props.dispatch(getTenantAdminDetails(tenantId)).then((res) => {
        if (res) {
          this.setState({
            tenantInfo: res,
          });
        }
      });
    }
  }

  render() {
    const { t, tenantId, ...props } = this.props;
    const { tenantInfo } = this.state;
    if (this.props.match.params.id && !tenantInfo) {
      return <Loading />;
    }
    return (
      <Paper style={{ padding: '10px' }}>
        {tenantId ? (
          <Typography style={{ paddingLeft: '20px' }}>Edit Tenant</Typography>
        ) : (
          <Typography style={{ paddingLeft: '20px' }}>Create Tenant</Typography>
        )}
        <div style={{ padding: '20px' }}>
          <TenantInfo {...props} tenantInfo={tenantInfo} t={t} />
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  const tenantId = (match.params.id && match.params.id) || null;
  return {
    tenantId: tenantId,
  };
};

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStateToProps)(TenantAdminCreate)
);
