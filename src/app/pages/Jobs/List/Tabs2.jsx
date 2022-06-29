import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import JobListMy from './JobListMy';

const tabs = ['?tab=my'];

class JobTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: tabs.indexOf(props.location.search || '?tab=my'),
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newValue = tabs.indexOf(nextProps.location.search || '?tab=my');
    if (newValue !== this.state.value) {
      this.setState({ value: newValue });
    }
  }

  tabsClickHandler = (e, tabIndex) => {
    this.props.history.replace(tabs[tabIndex], this.props.location.state);
  };

  handleSearch = (search) => {
    const { history, location } = this.props;
    history.replace(
      `?tab=my`,
      Object.assign({}, location.state, { my: search })
    );
  };

  render() {
    const { t, currentUserId } = this.props;

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <Tabs
          value={this.state.value}
          onChange={this.tabsClickHandler}
          variant="scrollable"
        >
          <Tab label={t('myJobs')} />
        </Tabs>
        {currentUserId && (
          <div className="flex-child-auto flex-container flex-dir-column">
            {this.state.value === 0 && (
              <JobListMy t={t} handleSearch={this.handleSearch} />
            )}
          </div>
        )}
      </Paper>
    );
  }
}

function mapStoreStateToProps(state) {
  const currentUserId = state.controller.currentUser.get('id');
  return {
    currentUserId,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(JobTabs)
);
