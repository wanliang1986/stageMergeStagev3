import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import { staffSize } from '../../constants/formOptions';
import { externalUrl } from '../../../utils';
import { withTranslation } from 'react-i18next';
const styles = {
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '13px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#939393',
  },
  paper: {
    padding: '10px',
    backgroundColor: '#fafafb',
    marginBottom: '10px',
  },
  msg: {
    minHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#505050',
  },
  msg1: {
    width: '100%',
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    overflow: 'hidden',
  },
};

class TenantView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getStaffSize = (str) => {
    let obj = staffSize.filter((item, index) => {
      return item.value === str;
    });
    if (obj.length !== 0) {
      return obj[0].label;
    }
  };
  openWindow = (str) => {
    if (str) {
      window.open(externalUrl(str), '_blank');
    }
  };
  getCredits = () => {
    const { tenantDetail } = this.props;
    let used = tenantDetail.monthlyUsedCredit
      ? tenantDetail.monthlyUsedCredit
      : 0;
    let _credit = tenantDetail.monthlyCredit ? tenantDetail.monthlyCredit : 0;
    return used + '/' + _credit;
  };
  getBulkCredits = () => {
    const { tenantDetail } = this.props;
    let bulkUsed = tenantDetail.bulkUsedCredit
      ? tenantDetail.bulkUsedCredit
      : 0;
    let bulkCredit = tenantDetail.bulkCredit ? tenantDetail.bulkCredit : 0;
    return bulkUsed + '/' + bulkCredit;
  };
  getAddress = (address) => {
    if (address.city && address.province && address.country) {
      return address.city + ',' + address.province + ',' + address.country;
    } else if (address.city && address.province && !address.country) {
      return address.city + ',' + address.province;
    } else if (address.city && !address.province && !address.country) {
      return address.city;
    } else {
      return '';
    }
  };
  render() {
    const { tenantDetail, classes } = this.props;
    return (
      <div className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Tenant Name')}
            </div>
            <div className={classes.msg}>{tenantDetail.name}</div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>{this.props.t('tab:Industry')}</div>
            <div className={classes.msg}>{tenantDetail.industry}</div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Admin First Name')}
            </div>
            {tenantDetail.admin.map((item, index) => {
              return (
                <div key={index} className={classes.msg}>
                  {item.firstName}
                </div>
              );
            })}
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Admin Last Name')}{' '}
            </div>
            {tenantDetail.admin.map((item, index) => {
              return (
                <div key={index} className={classes.msg}>
                  {item.lastName}
                </div>
              );
            })}
            {/* <div className={classes.msg}>{tenantDetail.adminLastName}</div> */}
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Admin Email')}
            </div>
            {tenantDetail.admin.map((item, index) => {
              return (
                <div key={index} className={classes.msg}>
                  {item.email}
                </div>
              );
            })}
            {/* <div className={classes.msg}>{tenantDetail.email}</div> */}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:APN Pro Monthly Credits')}{' '}
            </div>
            <div className={classes.msg}>{this.getCredits()}</div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Monthly Credits Reset Date')}{' '}
            </div>
            <div className={classes.msg}>
              {moment(new Date()).add(1, 'M').format('MM') +
                '/' +
                '01' +
                '/' +
                moment(new Date()).format('YYYY')}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:APN Pro Bulk Credits')}{' '}
            </div>
            <div className={classes.msg}>{this.getBulkCredits()}</div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div className={classes.title}>{this.props.t('tab:Address')}</div>
            <div className={classes.msg}>
              {tenantDetail.address && tenantDetail.address.address}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:City/State/Country')}
            </div>
            <div className={classes.msg}>
              {tenantDetail.address && this.getAddress(tenantDetail.address)}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <div className={classes.title}>{this.props.t('tab:Founded')}</div>
            <div className={classes.msg}>
              {moment(tenantDetail.foundedDate).format('MM/DD/YYYY')}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Staff Size')}
            </div>
            <div className={classes.msg}>
              {this.getStaffSize(tenantDetail.staffSizeType)}
            </div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>
              {this.props.t('tab:Company Website')}{' '}
            </div>
            <div
              className={classes.msg}
              style={{ color: '#3498DB', cursor: 'pointer' }}
              onClick={() => {
                this.openWindow(tenantDetail.website);
              }}
            >
              {tenantDetail.website}
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes.title}>
              {this.props.t('tab:Description')}
            </div>
            <div className={classes.msg1}>{tenantDetail.description}</div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(TenantView));
