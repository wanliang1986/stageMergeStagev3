import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { distSelect, distSelectZh } from '../../../../apn-sdk/newSearch';
import { getNewOptions } from '../../../actions/newCandidate';
import { candidateResetSearch } from '../../../actions/newCandidate';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CandidateListMy from './candidateListMys';
import CandidateListAll from './candidateListAll';
import HotLists from '../HotLists';
import PipelineLists from '../PipelineLists';
import ErrorResumes from '../ErrorResumes';
import CommonPoolList from '../CommonPoolList';
class CandidateTabs extends React.PureComponent {
  componentDidMount() {
    console.timeEnd('talent tab');
    this.getSelectOptions();
  }

  componentDidUpdate() {
    console.timeEnd('talent tab');
  }

  getSelectOptions = () => {
    const { dispatch, isLimitUser } = this.props;
    Promise.all([
      distSelect(1),
      distSelect(38),
      distSelect(65),
      distSelect(92),
      distSelect(117),
      // distSelectZh(1),
      // distSelectZh(117),
    ]).then((res) => {
      console.log(res);
      let briefUsers = this.props.briefUsers;
      this.props.dispatch(getNewOptions(['jobFounctionList', res[0].response]));
      this.props.dispatch(getNewOptions(['languageList', res[1].response]));
      this.props.dispatch(getNewOptions(['degreeList', res[2].response]));
      this.props.dispatch(getNewOptions(['workAuthList', res[3].response]));
      this.props.dispatch(getNewOptions(['industryList', res[4].response]));
      // this.props.dispatch(
      //   getNewOptions(['jobFounctionListZh', res[5].response])
      // );
      // this.props.dispatch(getNewOptions(['industryListZh', res[6].response]));
      this.props.dispatch(getNewOptions(['allUserOptions', briefUsers]));
    });
  };

  tabsClickHandler = (e, selectedTab) => {
    if (selectedTab !== this.props.tab) {
      this.props.history.replace(
        `?tab=${selectedTab}`,
        this.props.location.state || {}
      );
      this.props.dispatch(candidateResetSearch());
    }
  };

  render() {
    console.time('talent tab');
    const { t, currentUserId, tab, ...props } = this.props;
    console.log('render candidate tabs');
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <Paper className="flex-child-auto flex-container flex-dir-column">
          <div
            className="flex-container align-justify align-middle"
            style={{ boxShadow: 'inset 0 -1px #e8e8e8' }}
          >
            <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
              <Tabs
                value={tab}
                onChange={this.tabsClickHandler}
                variant="scrollable"
                scrollButtons="off"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label={t('tab:talentPool')} value={'all'} />
                <Tab label={t('myCandidates')} value={'my'} />
                <Tab label={t('nav:hotlists')} value={'hotlist'} />
                <Tab label={t('My Pipeline')} value={'myPipeline'} />
                <Tab label={t('Common Pool')} value={'CommonPool'} />
              </Tabs>
            </div>

            <ErrorResumes t={t} />
          </div>

          {currentUserId && (
            <div className="flex-child-auto flex-container flex-dir-column">
              {tab === 'all' && <CandidateListAll t={t} />}
              {tab === 'my' && <CandidateListMy t={t} />}
              {tab === 'hotlist' && <HotLists t={t} {...props} />}
              {tab === 'myPipeline' && <PipelineLists t={t} {...props} />}
              {tab === 'CommonPool' && <CommonPoolList t={t} {...props} />}
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { location }) {
  const searchParams = new URLSearchParams(location.search);

  const currentUserId = state.controller.currentUser.get('id');
  return {
    currentUserId,
    tab: searchParams.get('tab') || 'all',
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(CandidateTabs)
);
