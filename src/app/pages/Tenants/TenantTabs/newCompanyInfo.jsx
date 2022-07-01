import React, { Component } from 'react';
import Immutable from 'immutable';
import { getTenantAdminDetails, getTenant } from '../../../actions/tenantAdmin';
import Loading from '../../../components/particial/Loading';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PotentialButton from '../../../components/particial/PotentialButton';
import NewCompanyView from './newCompanyView';
import NewCompanyEdit from './newComoanyEdit';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    padding: '10px',
  },
};

class NewCompanyInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tenantDetail: null,
      edit: false,
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    // const { tenantId } = this.props;
    // this.props.dispatch(getTenantAdminDetails(tenantId)).then((res) => {
    //   this.setState({
    //     tenantDetail: res,
    //   });
    // });
    this.props.dispatch(getTenant()).then((res) => {
      this.setState({
        tenantDetail: res,
      });
    });
  };
  getCreate = () => {
    const { tenantDetail } = this.state;
    if (tenantDetail) {
      return (
        'Created at ' +
        moment(tenantDetail.createdDate).format('MM/DD/YYYY') +
        ' By ' +
        tenantDetail.createdBy
      );
    }
  };
  edit = () => {
    this.setState({
      edit: true,
    });
  };
  closedEdit = () => {
    this.setState({
      edit: false,
    });
  };
  render() {
    const { tenantDetail, edit } = this.state;
    const { classes, isAdmin, t } = this.props;
    if (!tenantDetail) {
      return <Loading />;
    }
    return (
      <div className={classes.root}>
        {!edit ? (
          <>
            <Paper>
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
                    </Typography>
                    <div>{this.getCreate()}</div>
                  </div>
                </div>
                {isAdmin && (
                  <PotentialButton
                    style={{ padding: '2px 30px' }}
                    // disabled={!isCompanyAdmin}
                    onClick={() => {
                      this.edit();
                    }}
                  >
                    {'edit'}
                  </PotentialButton>
                )}
              </section>
            </Paper>
            <Paper style={{ marginTop: '20px' }}>
              <NewCompanyView tenantDetail={tenantDetail} />
            </Paper>
          </>
        ) : (
          <NewCompanyEdit
            fetchData={() => {
              this.fetchData();
            }}
            closedEdit={() => {
              this.closedEdit();
            }}
            tenantInfo={tenantDetail}
            t={t}
          />
        )}
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  const tenantId = state.controller.currentUser.get('tenantId');
  const authorities = state.controller.currentUser.get('authorities');
  const isAdmin =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
  return {
    isAdmin,
    tenantId,
  };
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(NewCompanyInfo)
);
