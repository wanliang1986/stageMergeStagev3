import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
// import RightIcon from '@material-ui/icons/ChevronRight';

const styles = {
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    border: '1px solid #e8e8e8',
    borderRadius: 3,
    padding: 16,
    width: 268,
    height: 106,
  },
};

const tabs = [
  {
    label: 'Commission by Project',
    path: '/finance/commissions/project',
  },
  {
    label: 'Commission by Recruiters',
    path: '/finance/commissions/recruiter',
  },
];

class Commission extends React.Component {
  render() {
    const { t, classes } = this.props;
    return (
      <div className="container-padding horizontal-layout">
        {tabs.map((tab, index) => {
          return (
            <div key={index} className={classes.tab}>
              <Typography variant="subtitle2" gutterBottom>
                {t(tab.label)}
              </Typography>
              <MuiLink
                component={Link}
                to={tab.path}
                className={'flex-container align-middle'}
                // onClick={() => this.handleTabChange(index)}
              >
                {t('Details >')}
                {/*<RightIcon />*/}
              </MuiLink>
            </div>
          );
        })}
      </div>
    );
  }
}

export default connect()(withStyles(styles)(Commission));
