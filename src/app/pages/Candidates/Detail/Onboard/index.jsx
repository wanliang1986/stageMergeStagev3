import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Documents from './Documents';
import Completed from './Completed';
const styles = {
  root: {
    margin: 24,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  tabs: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '18px',
  },
  tab: {
    width: 210,
    height: 32,
    borderRadius: '4px',
    backgroundColor: '#fff',
    
    lineHeight: 2.2,
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.65)',
    border: 'solid 1px #d9d9d9',
    cursor: 'pointer',
    textAlign: 'center',
  },
  isSelected: {
    border: 'solid 1px #3598dc',
    color: '#3598dc',
  },
};
class Onboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedTab: 'Onboarding Documents',
    };
  }

  componentDidMount() {}

  tabsClickHandler = (selectedTab) => {
    this.setState({ selectedTab });
  };

  render() {
    const { loading, selectedTab } = this.state;
    const { classes, t } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.tabs}>
          <div
            style={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            className={clsx(classes.tab, {
              [classes.isSelected]: selectedTab == 'Onboarding Documents',
            })}
            onClick={() => {
              this.tabsClickHandler('Onboarding Documents');
            }}
          >
            Onboarding Documents
          </div>
          <div
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            className={clsx(classes.tab, {
              [classes.isSelected]: selectedTab == 'Completed Documents',
            })}
            onClick={() => {
              this.tabsClickHandler('Completed Documents');
            }}
          >
            Completed Documents
          </div>
        </div>
        {selectedTab == 'Onboarding Documents' ? (
          <Documents t={t} />
        ) : (
          <Completed t={t} />
        )}
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(withStyles(styles)(Onboard));
