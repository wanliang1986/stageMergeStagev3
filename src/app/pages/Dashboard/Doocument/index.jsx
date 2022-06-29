import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DocumentVIew from './DocumenView';
import PackageView from './PackageView';
import * as ActionTypes from '../../../constants/actionTypes';
import {
  newDocumentSearch,
  newPackageSearch,
} from '../../../actions/newDocumentView';
import moment from 'moment-timezone';

class DocumentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabsValue: '',
    };
  }
  componentWillReceiveProps() {}
  componentDidMount() {
    const { history } = this.props;
    if (history.location.search === '?tab=PackageView') {
      this.setState({
        tabsValue: 'PackageView',
      });
    } else {
      this.setState({
        tabsValue: 'DocumentView',
      });
    }
  }
  // tabs的change事件
  handleChange = (e, selectedTab) => {
    const { tabsValue } = this.state;
    const { getTabaValue, dispatch, documentParams, packageParams } =
      this.props;
    if (selectedTab === 'PackageView') {
      if (typeof packageParams != 'undefined') {
        dispatch({
          type: ActionTypes.DOCUMENT_LODING,
          payload: true,
        });
        dispatch(newPackageSearch(packageParams));
      }
      this.setState({
        tabsValue: 'PackageView',
      });
      this.props.dispatch({
        type: ActionTypes.TABS_VALUE,
        payload: 'PackageView',
      });
    } else if (selectedTab === 'DocumentView') {
      if (typeof documentParams != 'undefined') {
        dispatch({
          type: ActionTypes.DOCUMENT_LODING,
          payload: true,
        });
        dispatch(newDocumentSearch(documentParams));
      }

      this.setState({
        tabsValue: 'DocumentView',
      });
      this.props.dispatch({
        type: ActionTypes.TABS_VALUE,
        payload: 'DocumentView',
      });
    }

    if (this.state.tabsValue !== selectedTab) {
      this.setState({
        tabsValue: selectedTab,
      });
      this.props.history.replace(`?tab=${selectedTab}`);
    }
  };
  render() {
    const { tabsValue } = this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <Paper className="flex-child-auto flex-container flex-dir-column">
          <div
            className="flex-container align-justify align-middle"
            style={{ boxShadow: 'inset 0 -1px #e8e8e8' }}
          >
            <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
              <Tabs
                onChange={this.handleChange}
                value={tabsValue}
                aria-label="basic tabs example"
              >
                <Tab label="Document View" value={'DocumentView'} />
                <Tab label="Package View" value={'PackageView'} />
              </Tabs>
            </div>
          </div>
          {tabsValue === 'DocumentView' && <DocumentVIew />}
          {tabsValue === 'PackageView' && <PackageView />}
        </Paper>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let getTabaValue = state.controller.documentView.toJS().tabaValue;
  let documentParams = state.controller.documentView.toJS().interfaceDataList;
  let packageParams =
    state.controller.documentView.toJS().packInterfaceDataList;
  return {
    getTabaValue,
    documentParams,
    packageParams,
  };
};
export default connect(mapStateToProps)(DocumentView);
