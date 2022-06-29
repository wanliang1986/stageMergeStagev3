import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
// import Immutable from 'immutable';
import { getAllDivisionList } from '../../../actions/divisionActions';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import Invoice from '../Invoice/List';
import Commission from '../Commission/List';

const tabs = ['?tab=invoices', '?tab=commissions'];

class FinanceTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: tabs.indexOf(props.location.search || '?tab=invoices')
    };
  }
  componentDidMount(): void {
    this.props.dispatch(getAllDivisionList());
  }

  static getDerivedStateFromProps(props, state) {
    const newValue = tabs.indexOf(props.location.search || '?tab=invoices');
    if (newValue !== state.value) {
      return {
        value: newValue
      };
    }
    return null;
  }

  tabsClickHandler = (e, tabIndex) => {
    this.props.history.replace(tabs[tabIndex], this.props.location.state);
  };

  render() {
    const { value } = this.state;
    const { t, i18n, history, location, currentUserId } = this.props;
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <Tabs
          value={value}
          onChange={this.tabsClickHandler}
          variant="scrollable"
        >
          <Tab label={t('nav:invoice')} />
          <Tab label={t('nav:commission')} />
        </Tabs>
        {currentUserId && (
          <div className="flex-child-auto flex-container flex-dir-column">
            {value === 0 && (
              <Invoice
                t={t}
                i18n={i18n}
                history={history}
                location={location}
              />
            )}
            {value === 1 && (
              <Commission t={t} history={history} location={location} />
            )}
          </div>
        )}
      </Paper>
    );
  }
}

function mapStateToProps(state) {
  const currentUserId = state.controller.currentUser.get('id');
  return {
    currentUserId
  };
}
export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(FinanceTabs)
);
