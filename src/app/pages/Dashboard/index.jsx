import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import MyCandidate from './MyCandidate';
import MyJob from './MyJob';
import MyFinance from './MyFinance';

import MyStoppedJob from './MyStoppedJob';
import MyStoppedCandidate from './MyStoppedCandidate';

const styles = {
  row: {
    width: '1400px',
    margin: '0 -8px',
    display: 'flex',
    '&:not(:last-child)': {
      marginBottom: 16,
    },
    flex: '0 0 auto',
  },
  columns: {
    padding: '0 8px',
    flex: 1,
  },
};

class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, syncDashboard, t, i18n } = this.props;
    return (
      <>
        <div className={classes.row}>
          <div className={classes.columns}>
            <MyCandidate t={t} syncDashboard={syncDashboard} i18n={i18n} />
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.columns}>
            <MyJob t={t} syncDashboard={syncDashboard} />
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.columns}>
            <MyFinance t={t} />
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.columns}>
            <MyStoppedJob t={t} syncDashboard={syncDashboard} />
          </div>
          <div className={classes.columns} style={{ overflow: 'hidden' }}>
            <MyStoppedCandidate
              t={t}
              syncDashboard={syncDashboard}
              i18n={i18n}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    syncDashboard: state.model.syncDashboard,
  };
};

export default connect(mapStateToProps)(
  withTranslation(['message', 'action', 'tab', 'field'])(
    withStyles(styles)(Index)
  )
);
