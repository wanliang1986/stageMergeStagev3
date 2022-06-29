import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { tenantTemplateList } from '../../actions/templateAction';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import ApplicationTemplates from './ApplicationTemplateList';
import EmailBlastTemplates from './EmailBlastTemplateList';
import NewTemplateList from './NewTemplates/NewTemplateList';

import { makeCancelable } from '../../../utils/index';
import templateSelector from '../../selectors/templateSelector';

import Loading from '../../components/particial/Loading';

const tabs = [
  '?tab=applicationTemplates',
  '?tab=emailBlastTemplates',
  '?tab=myEmailHistory',
];

class AllEmailTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab:
        tabs.indexOf(props.location.search) === -1
          ? 0
          : tabs.indexOf(props.location.search),
      loading: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.templateTask.cancel();
  }

  fetchData() {
    this.setState({ loading: true });
    this.templateTask = makeCancelable(
      this.props.dispatch(tenantTemplateList())
    );
    this.templateTask.promise.then(() => this.setState({ loading: false }));
    this.templateTask.promise.catch((reason) => {
      if (reason.isCanceled) {
        console.log('isCanceled');
      } else {
        console.log(reason);
        this.setState({ loading: false });
      }
    });
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
    const { t, templateList, ...props } = this.props;
    const { selectedTab, loading } = this.state;

    console.log('templateList', templateList);
    const appTemp = templateList.filter(
      (ele) =>
        ele.get('type') !== 'Email_Blast' &&
        ele.get('type') !== 'Email_Merge_Contacts'
    );
    const emailBlastTemp = templateList.filter(
      (ele) => ele.get('type') === 'Email_Blast'
    );

    if (loading) {
      return (
        <div className="flex-child-auto flex-container flex-dir-column">
          <Loading />
        </div>
      );
    }

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
          <Tab label={t('Application Templates')} />
          <Tab label={t('Email Blast Templates')} />
          <Tab label={t('Email Blast Designs')} />
        </Tabs>
        {selectedTab === 0 && (
          <ApplicationTemplates templateList={appTemp} t={t} {...props} />
        )}
        {selectedTab === 1 && (
          <EmailBlastTemplates templateList={emailBlastTemp} t={t} {...props} />
        )}
        {selectedTab === 2 && <NewTemplateList t={t} {...props} />}
      </Paper>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    templateList: templateSelector(state),
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(AllEmailTabs)
);
