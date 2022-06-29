import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import JobListAll from './JobListAll';
import JobListMy from './JobListMy';

import { distSelect, distSelectZh } from '../../../../apn-sdk/newSearch';
import { getNewOptions } from '../../../actions/newSearchOptions';
import { resetSearch } from '../../../actions/newSearchJobs';

const tabs = ['?tab=all', '?tab=my', '?tab=favor'];

class JobTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: tabs.indexOf(props.location.search || '?tab=all'),
    };
    this.handleSearchMap = {
      all: this.handleSearch('all'),
      my: this.handleSearch('my'),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const newValue = tabs.indexOf(props.location.search || '?tab=all');
    if (newValue !== state.value) {
      return {
        value: newValue,
      };
    }
    return null;
  }

  componentDidMount() {
    console.timeEnd('job tab');
    // this.getDate();
  }

  componentDidUpdate() {
    console.timeEnd('job tab');
  }

  tabsClickHandler = (e, tabIndex) => {
    console.log(tabIndex);
    this.props.dispatch(resetSearch());
    this.props.history.replace(tabs[tabIndex], this.props.location.state);
  };

  // getDate = () => {
  //   Promise.all([
  //     distSelect(38),
  //     distSelect(65),
  //     distSelect(1),
  //     distSelectZh(1),
  //   ]).then((res) => {
  //     let briefUsers = this.props.briefUsers;
  //     console.log('test1234', briefUsers)
  //     this.props.dispatch(getNewOptions(['languagesOptions', res[0].response]));
  //     this.props.dispatch(getNewOptions(['degreeOptions', res[1].response]));
  //     this.props.dispatch(getNewOptions(['functionOptions', res[2].response]));
  //     this.props.dispatch(getNewOptions(['allUserOptions', briefUsers]));
  //     this.props.dispatch(
  //       getNewOptions(['functionOptionsZh', res[3].response])
  //     );
  //   });
  // };

  handleSearch = (tab) => (search) => {
    const { history, location } = this.props;
    history.replace(
      `?tab=${tab}`,
      Object.assign({}, location.state, { [tab]: search })
    );
  };

  render() {
    console.time('job tab');

    const { t, currentUserId } = this.props;

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <Tabs
          value={this.state.value}
          onChange={this.tabsClickHandler}
          variant="scrollable"
        >
          <Tab label={t('allJobs')} />
          <Tab label={t('myJobs')} />
        </Tabs>
        {currentUserId && (
          <div className="flex-child-auto flex-container flex-dir-column">
            {this.state.value === 0 && (
              <JobListAll t={t} handleSearch={this.handleSearchMap.all} />
            )}
            {this.state.value === 1 && (
              <JobListMy t={t} handleSearch={this.handleSearchMap.my} />
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
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(JobTabs)
);
