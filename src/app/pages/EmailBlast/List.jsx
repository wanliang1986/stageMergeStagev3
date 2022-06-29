import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import BlastList from './BlastList';
import MyDraftList from './MyDraftList';
import MyHistoryList from './MyHistoryList';
import Report from './Report';
import ArchivedGroup from './ArchivedGroup';
import { getMyEmailBlastList } from '../../actions/emailAction';
const tabs = [
  '?tab=emailBlastGroup',
  '?tab=myDrafts',
  '?tab=myEmailHistory',
  '?tab=reports',
  '?tab=ArchivedGroup',
];

class AllEmailTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab:
        tabs.indexOf(props.location.search) === -1
          ? 0
          : tabs.indexOf(props.location.search),
    };
  }

  componentDidMount() {
    this.props.dispatch(getMyEmailBlastList());
  }

  static getDerivedStateFromProps(props, state) {
    const newValue =
      tabs.indexOf(props.location.search) === -1
        ? 0
        : tabs.indexOf(props.location.search);
    if (newValue !== state.selectedTab) {
      return {
        selectedTab: newValue,
      };
    }
    return null;
  }

  tabsClickHandler = (e, selectedTab) => {
    this._handleActive(selectedTab);
  };

  _handleActive = (tabIndex) => {
    this.props.history.replace(tabs[tabIndex], this.props.location.state || {});
  };

  render() {
    const { t, ...props } = this.props;
    const { selectedTab } = this.state;

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <Tabs
          value={selectedTab}
          onChange={this.tabsClickHandler}
          variant="scrollable"
          scrollButtons="off"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={t('Email Blast Group')} />
          <Tab label={t('My Drafts')} />
          <Tab label={t('My Email History')} />
          <Tab label={t('Reports')} />
          <Tab label={t('Archived Group')} />
        </Tabs>
        {selectedTab === 0 && <BlastList t={t} {...props} />}
        {selectedTab === 1 && <MyDraftList t={t} {...props} />}
        {selectedTab === 2 && <MyHistoryList t={t} {...props} />}
        {selectedTab === 3 && <Report t={t} {...props} />}
        {selectedTab === 4 && <ArchivedGroup t={t} {...props} />}
      </Paper>
    );
  }
}

// function mapStoreStateToProps(state) {
//   return {
//     emailBlastList: emailBlastSelector(state)
//   };
// }

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect()(AllEmailTabs)
);
