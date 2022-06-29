import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import moment from 'moment-timezone';
import { staffSize } from '../../../constants/formOptions';
import { withTranslation } from 'react-i18next';
import { externalUrl } from '../../../../utils';
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

class NewCompanyView extends Component {
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
    window.open(externalUrl(str), '_blank');
  };

  getCredits = () => {
    const { tenantDetail } = this.props;
    let used = tenantDetail.usedCredit ? tenantDetail.usedCredit : 0;
    let _credit = tenantDetail.credit ? tenantDetail.credit - used : 0;
    return _credit + ' remaining ' + '(' + used + ' used)';
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
            <div className={classes.title}>{this.props.t('tab:Email')}</div>
            <div className={classes.msg}>{tenantDetail.tenantEmail}</div>
          </Grid>
          <Grid item xs={3}>
            <div className={classes.title}>{this.props.t('tab:Phone')}</div>
            <div className={classes.msg}>{tenantDetail.tenantPhone}</div>
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
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className={classes.title}>
              {this.props.t('tab:Description')}{' '}
            </div>
            <div className={classes.msg1}>{tenantDetail.description}</div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(NewCompanyView));
