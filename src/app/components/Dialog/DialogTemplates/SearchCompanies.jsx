import { withStyles } from '@material-ui/core';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { multipleName } from '../../../../utils/index';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    width: '1161px',
    height: '540px',
  },
  card: {
    width: '270px',
    cursor: 'pointer',
    display: 'inline-block',
    marginRight: '10px',
  },
  clientTitle: {
    width: '100%',
    height: '41px',
    color: 'white',
    paddingLeft: '10px',
    backgroundColor: '#3398dc',
    overflow: 'hidden',
  },
  prospectTitle: {
    width: '100%',
    height: '41px',
    color: 'white',
    paddingLeft: '10px',
    backgroundColor: 'rgba(33, 182, 110, 0.85)',
    overflow: 'hidden',
  },
  MuiCardContentRoot: {
    padding: 0,
    '&:last-child': {
      paddingBottom: '0px',
    },
  },
  content: {
    minHeight: '155px',
    padding: '10px',
  },
  contentItem: {
    marginBottom: '5px',
  },
  formTitle: {
    width: '35%',
    color: '#505050',
    textAlign: 'left',
    marginRight: '10px',
    verticalAlign: 'top',
    // display: 'inline-block',
    float: 'left',
    fontSize: '12px',
  },
  result: {
    width: '55%',
    color: '#8e8e8e',
    textAlign: 'left',
    fontSize: '12px',
    float: 'left',
    // display: 'inline-block',
  },
  clear: {
    clear: 'both',
  },
};

class SearchCompanies extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  getLevel = (str) => {
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
        return 'Client - Sunset';
    }
  };
  render() {
    const { classes, searchCompanies } = this.props;
    return (
      <div className={classes.root}>
        {searchCompanies.map((item, index) => {
          let type = item.type === 'POTENTIAL_CLIENT' ? 1 : 0;
          return (
            <Card className={classes.card} key={index}>
              <Link to={`/companies/detail/${item.companyId}/${type}`}>
                <CardContent className={classes.MuiCardContentRoot}>
                  <div
                    className={
                      item.type !== 'POTENTIAL_CLIENT'
                        ? classes.clientTitle
                        : classes.prospectTitle
                    }
                  >
                    <Typography
                      variant="h6"
                      style={{ color: 'white', lineHeight: '41px' }}
                    >
                      {item.name}
                    </Typography>
                  </div>
                  <div className={classes.content}>
                    <div className={classes.contentItem}>
                      <div className={classes.formTitle}>Level：</div>
                      <div
                        className={classes.result}
                        style={{
                          maxHeight: '50px',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 1,
                          overflow: 'hidden',
                        }}
                      >
                        {this.props.t(`tab:${this.getLevel(item.type)}`)}
                      </div>
                      <div className={classes.clear}></div>
                    </div>
                    <div className={classes.contentItem}>
                      <div className={classes.formTitle}>Industry：</div>
                      <div
                        className={classes.result}
                        style={{
                          maxHeight: '50px',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {item.industryType}
                      </div>
                      <div className={classes.clear}></div>
                    </div>
                    <div className={classes.contentItem}>
                      <div className={classes.formTitle}>Service Type:</div>
                      <div
                        className={classes.result}
                        style={{
                          maxHeight: '50px',
                          minHeight: '35px',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {item.serviceType}
                      </div>
                      <div className={classes.clear}></div>
                    </div>
                    <div className={classes.contentItem}>
                      <div className={classes.formTitle}>Contacts：</div>
                      <div
                        className={classes.result}
                        style={{
                          maxHeight: '50px',
                          minHeight: '35px',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {item.contact}
                      </div>
                      <div className={classes.clear}></div>
                    </div>
                    <div className={classes.contentItem}>
                      <div className={classes.formTitle}>Location:</div>
                      <div
                        className={classes.result}
                        style={{
                          maxHeight: '50px',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {item.countryCN}
                      </div>
                      <div className={classes.clear}></div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    );
  }
}

export default withTranslation('tab')(withStyles(styles)(SearchCompanies));
