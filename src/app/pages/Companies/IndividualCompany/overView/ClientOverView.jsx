import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import { externalUrl } from '../../../../../utils';
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
    lineHeight: '20px',
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
};

class ClientOverView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getAddresses = (arr) => {
    return arr.toJS().map((item, index) => {
      return item.address;
    });
  };
  getCity = (arr) => {
    return arr.toJS().map((item, index) => {
      return `${item.city},${item.country} (${item.addressType})`;
    });
  };
  getDealTime = (arr) => {
    return arr.toJS().map((item, index) => {
      if (item.estimatedDealTime) {
        return item.estimatedDealTime.join('-');
      }
    });
  };
  getAccountProgress = (arr) => {
    return arr.toJS().map((item, index) => {
      return `${item.accountProgress * 100}%`;
    });
  };
  getLeadSource = (arr) => {
    return arr.toJS().map((item, index) => {
      return item.leadSource;
    });
  };
  getLeadOwner = (arr) => {
    let list = [];
    arr.toJS().forEach((item, index) => {
      if (item.saleLeadOwner && item.saleLeadOwner.length > 0) {
        item.saleLeadOwner.forEach((val, index) => {
          list.push(val);
        });
      }
    });
    return list.map((item, index) => {
      return `${item.firstName} ${item.lastName}`;
    });
  };
  getClientContact = (arr) => {};
  getServiceType = (arr) => {
    return arr.toJS().map((item, index) => {
      return item.potentialService;
    });
  };
  getTeamMember = (arr) => {
    let list = [];
    arr.toJS().forEach((item, index) => {
      if (item.assignTeamNumber && item.assignTeamNumber.length > 0) {
        item.assignTeamNumber.forEach((val, index) => {
          list.push(val.id);
        });
      }
    });
    return list.join(', ');
  };

  getAccountManager = (arr) => {
    return arr.toJS().forEach((item, index) => {
      return `${item.firstName} ${item.lastName}`;
    });
  };

  getAddress = (company) => {
    let address = [];
    company.get('additionalAddresses') &&
      company.get('additionalAddresses').forEach((item, index) => {
        if (item.get('city') || item.get('province') || item.get('country')) {
          address.push(item);
        }
      });
    if (company.get('primaryAddress')) {
      address.unshift(company.get('primaryAddress'));
    }
    return address;
  };
  getAddressMsg = (item) => {
    if (item.get('city') && item.get('province') && item.get('country')) {
      return (
        item.get('city') +
        ', ' +
        item.get('province') +
        ', ' +
        item.get('country')
      );
    } else if (
      item.get('city') &&
      item.get('province') &&
      !item.get('country')
    ) {
      return item.get('city') + ', ' + item.get('province');
    } else if (
      item.get('city') &&
      !item.get('province') &&
      !item.get('country')
    ) {
      return item.get('city');
    } else if (
      !item.get('city') &&
      item.get('province') &&
      item.get('country')
    ) {
      return item.get('province') + ', ' + item.get('country');
    } else if (
      item.get('city') &&
      !item.get('province') &&
      item.get('country')
    ) {
      return item.get('city') + ', ' + item.get('country');
    } else if (
      !item.get('city') &&
      item.get('province') &&
      !item.get('country')
    ) {
      return item.get('province');
    } else if (
      !item.get('city') &&
      !item.get('province') &&
      item.get('country')
    ) {
      return item.get('country');
    } else {
      return '';
    }
  };

  getOwnerContribution = (item) => {
    let contribution = [];
    let msg;
    if (item.get('owners') && item.get('owners').size > 0) {
      item.get('owners').forEach((item, index) => {
        msg =
          item.get('firstName') +
          ' ' +
          item.get('lastName') +
          '(' +
          item.get('percentage') +
          ')';
        contribution.push(msg);
      });
    }
    if (contribution.length > 1) {
      return contribution.join(', ');
    } else {
      return msg;
    }
  };
  getBDContribution = (item) => {
    let contribution = [];
    let msg;
    if (item.get('bdManagers') && item.get('bdManagers').size > 0) {
      item.get('bdManagers').forEach((item, index) => {
        msg =
          item.get('firstName') +
          ' ' +
          item.get('lastName') +
          '(' +
          item.get('percentage') +
          ')';
        contribution.push(msg);
      });
    }
    if (contribution.length > 1) {
      return contribution.join(', ');
    } else {
      return msg;
    }
  };
  getAm = (item) => {
    let contribution = [];
    let msg;
    if (item.get('accountManager') && item.get('accountManager').size > 0) {
      item.get('accountManager').forEach((item, index) => {
        msg = item.get('firstName') + ' ' + item.get('lastName');
        contribution.push(msg);
      });
    }
    if (contribution.length > 1) {
      return contribution.join(', ');
    } else {
      return msg;
    }
  };

  getType = (str) => {
    switch (str) {
      case 'POTENTIAL_CLIENT':
        return 'Prospect';
      case 'KEY_ACCOUNT':
        return 'Client - Key Account';
      case 'SUPER_KEY_ACCOUNT':
        return 'Client - Super Key Account';
      case 'COMMERCIAL_ACCOUNT':
        return 'Client - Commercial Account';
      case 'SUN_SET':
        return 'Client - Sunset ';
    }
  };
  render() {
    const { classes, t, company } = this.props;
    const address = this.getAddress(company);
    return (
      <>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Company Name')} </div>
              <div className={classes.msg}>{company.get('name')}</div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Industry')} </div>
              <div className={classes.msg}>{company.get('industry')}</div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}> {t('tab:Status')}</div>
              <div className={classes.msg}>
                {company.get('active') ? `${t('common:Active')}` : 'Inactive'}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Client Level')} </div>
              <div className={classes.msg}>
                {t(`tab:${this.getType(company.get('type'))}`)}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}> {t('tab:Company Website')}</div>
              <div className={classes.msg}>
                <a
                  // onClick={() => {
                  //   this.openWindow(company.get('website'));
                  // }}
                  href={externalUrl(company.get('website'))}
                  target="_blank"
                >
                  {company.get('website')}
                </a>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Address')} </div>
              {address
                ? address.map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {item.get('address')}
                      </div>
                    );
                  })
                : ''}
              {/* <div>{company.get('addresses')}</div> */}
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:City/State/Country')}</div>
              {address
                ? address.map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {this.getAddressMsg(item)}
                        {/* {item.get('city')}/{item.get('country')} */}
                      </div>
                    );
                  })
                : ''}
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Service Type')} </div>
              {company.get('salesLead')
                ? company.get('salesLead').map((item, index) => {
                    return item.get('serviceTypeNames') &&
                      item.get('serviceTypeNames').size > 0 ? (
                      <div key={index} className={classes.msg}>
                        {item.get('serviceTypeNames').join(', ')}
                      </div>
                    ) : null;
                  })
                : null}
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Account Manager')} </div>

              {company.get('salesLead')
                ? company.get('salesLead').map((item, index) => {
                    // return item.get('accountManager') &&
                    //   item.get('accountManager').size > 0
                    //   ? item.get('accountManager').map((am, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {/* {am.get('firstName') + ' ' + am.get('lastName')} */}
                        {this.getAm(item)}
                      </div>
                    );
                    //   })
                    // : null;
                  })
                : null}
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>
                {' '}
                {t('tab:BD Owner & Contribution%')}
              </div>

              {company.get('salesLead')
                ? company.get('salesLead').map((item, index) => {
                    // return item.get('bdManagers') &&
                    //   item.get('bdManagers').size > 0
                    //   ? item.get('bdManagers').map((bd, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {this.getBDContribution(item)}
                      </div>
                    );
                    //   })
                    // : null;
                  })
                : null}
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>
                {t('tab:Sales Lead Owner & Contribution%')}
              </div>
              <div className={classes.msg}>
                {company.get('salesLead')
                  ? company.get('salesLead').map((item, index) => {
                      // return item.get('owners') && item.get('owners').size > 0
                      //   ? item.get('owners').map((owner, index) => {
                      // return (
                      //   <div className={classes.msg}>
                      //     {owner.get('firstName') +
                      //       ' ' +
                      //       owner.get('lastName') +
                      //       '(' +
                      //       owner.get('percentage') +
                      //       ')'}
                      //   </div>
                      // );
                      return (
                        <div key={index} className={classes.msg}>
                          {this.getOwnerContribution(item)}
                        </div>
                      );
                      // })
                      // : null;
                    })
                  : null}
              </div>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Staff Size')}</div>
              <div className={classes.msg}>{company.get('staffSizeType')}</div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}> {t('tab:Business Revenue')}</div>
              <div className={classes.msg}>
                {company.get('businessRevenue')}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Organization Name')}</div>
              <div className={classes.msg}>
                {company.get('organizationName')
                  ? company.get('organizationName')
                  : null}
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>{t('tab:Fortune Ranking')}</div>
              <div className={classes.msg}>{company.get('fortuneRank')}</div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>
                {t('tab:LinkedIn Company Profile')}
              </div>
              <div className={classes.msg}>
                {company.get('linkedinCompanyProfile')}
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>
                {t('tab:Crunchbase Company Profile')}
              </div>
              <div className={classes.msg}>
                {company.get('crunchbaseCompanyProfile')}
              </div>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }
}

export default withStyles(styles)(ClientOverView);
