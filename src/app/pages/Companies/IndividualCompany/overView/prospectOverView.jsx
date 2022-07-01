import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import moment from 'moment-timezone';

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

class ProspectOverView extends Component {
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
        return moment(item.estimatedDealTime).format('L');
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
    let a = arr.toJS().map((item, index) => {
      return item.label;
    });

    return a.join(', ');
  };

  getAddress = (company) => {
    let address = [];
    company.get('companyAddresses') &&
      company.get('companyAddresses').forEach((item, index) => {
        if (
          item.get('geoInfoEN').get('city') ||
          item.get('geoInfoEN').get('province') ||
          item.get('geoInfoEN').get('country')
        ) {
          address.push(item);
        }
      });
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
  getTeam = (team) => {
    let msg = [];
    team.forEach((item, index) => {
      let name = item.get('fullName');
      msg.push(name);
    });
    return msg.join(', ');
  };
  getOwners = (item) => {
    let names = [];
    if (item && item.size > 0) {
      item.forEach((name, index) => {
        names.push(name.get('fullName'));
      });
    }
    if (names.size === 1) {
      return names.join(' ');
    } else {
      return names.join(', ');
    }
  };
  getContacts = (item) => {
    let names = [];
    if (item && item.size > 0) {
      item.forEach((name, index) => {
        names.push(name.get('name'));
      });
    }
    if (names.size === 1) {
      return names.join(' ');
    } else {
      return names.join(', ');
    }
  };

  openWindow = (str) => {
    if (!/^(f|ht)tps?:\/\//i.test(str)) {
      let url = 'http://' + str;
      let w = window.open('about:_blank');
      w.location.href = url;
    } else {
      let w = window.open('about:_blank');
      w.location.href = str;
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
              <div className={classes.title}>Company Name</div>
              <div className={classes.msg}>{company.get('name')}</div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>Industry</div>
              <div className={classes.msg}>{company.get('industry')}</div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>Company Website</div>
              <div className={classes.msg}>
                <a
                  onClick={() => {
                    this.openWindow(company.get('website'));
                  }}
                  target="_blank"
                  rel="noopener noreferer"
                >
                  {company.get('website')}
                </a>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>Fortune Ranking</div>
              <div className={classes.msg}>{company.get('fortuneRank')}</div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>Address</div>
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
              <div className={classes.title}>City/State/Country</div>
              {address
                ? address.map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {this.getAddressMsg(item.get('geoInfoEN'))}
                      </div>
                    );
                  })
                : ''}
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <div className={classes.title}>Sales Lead Owner</div>
              {company.get('salesLeadDetails')
                ? company.get('salesLeadDetails').map((item, index) => {
                    // return item.get('owners') && item.get('owners').size > 0
                    //   ? item.get('owners').map((owner, index) => {
                    //       return (
                    //         <div className={classes.msg}>
                    //           {owner.get('firstName') +
                    //             ' ' +
                    //             owner.get('lastName')}
                    //         </div>
                    //       );
                    //     })
                    //   : null;
                    return (
                      <div key={index} className={classes.msg}>
                        {this.getOwners(item.get('salesLeadsOwner'))}
                      </div>
                    );
                  })
                : null}
            </Grid>
            <Grid item xs={2}>
              <div className={classes.title}>Client Contact</div>
              {company.get('salesLeadDetails')
                ? company.get('salesLeadDetails').map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {this.getContacts(item.get('salesLeadClientContacts'))}
                      </div>
                    );
                  })
                : null}
            </Grid>
            <Grid item xs={2}>
              <div className={classes.title}>Estimated Deal Time </div>
              {company.get('salesLeadDetails')
                ? company.get('salesLeadDetails').map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {moment(item.get('estimatedDealTime')).format(
                          'YYYY-MM-DD'
                        )}
                      </div>
                    );
                  })
                : null}
            </Grid>
            <Grid item xs={2}>
              <div className={classes.title}>Account Progress</div>
              {company.get('salesLeadDetails')
                ? company.get('salesLeadDetails').map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {item.get('accountProgress') * 100 + '%'}
                      </div>
                    );
                  })
                : null}
            </Grid>
            <Grid item xs={2}>
              <div className={classes.title}>Service Type</div>
              {company.get('salesLeadDetails')
                ? company.get('salesLeadDetails').map((item, index) => {
                    return item.get('companyServiceTypes').size > 0 ? (
                      <div key={index} className={classes.msg}>
                        {/* {item.get('companyServiceTypes').join(', ')} */}
                        {this.getServiceType(item.get('companyServiceTypes'))}
                      </div>
                    ) : null;
                  })
                : null}
            </Grid>
            <Grid item xs={2}>
              <div className={classes.title}>Lead Source</div>
              {company.get('salesLeadDetails')
                ? company.get('salesLeadDetails').map((item, index) => {
                    return (
                      <div key={index} className={classes.msg}>
                        {item.get('leadSource')}
                      </div>
                    );
                  })
                : null}
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>Assign Team Member</div>
              {company.get('companyAssignTeamMembers') &&
              company.get('companyAssignTeamMembers').size > 0 ? (
                // ? company.get('teamNumbers').map((item, index) => {
                //     return (
                //       <div className={classes.msg}>
                //         {item.get('firstName') + ' ' + item.get('lastName')}
                //       </div>
                //     );
                //   })
                <div className={classes.msg}>
                  {this.getTeam(company.get('companyAssignTeamMembers'))}
                </div>
              ) : null}
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <div className={classes.title}>Staff Size</div>
              <div className={classes.msg}>{company.get('staffSizeType')}</div>
            </Grid>
            <Grid item xs={3}>
              <div className={classes.title}>Business Revenue</div>
              <div className={classes.msg}>
                {company.get('businessRevenue')}
              </div>
            </Grid>

            <Grid item xs={3}>
              <div className={classes.title}>LinkedIn Company Profile</div>
              <div className={classes.msg}>
                {company.get('linkedinCompanyProfile')}
              </div>
            </Grid>

            <Grid item xs={3}>
              <div className={classes.title}>Crunchbase Company Profile</div>
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

export default withStyles(styles)(ProspectOverView);
