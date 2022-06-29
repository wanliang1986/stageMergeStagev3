import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FilterSearch from './FilterSearch';
import DocumentFrom from './FromList';
import { documentViweColumns } from '../../../../utils/documentViewSearch';
import { newDocumentSearch } from '../../../actions/newDocumentView';
import * as ActionTypes from '../../../constants/actionTypes';
import {
  getDocumentColumns,
  getDefaultColumns,
} from '../../../../apn-sdk/documentDashboard';
const styles = {
  root: {
    paddingTop: '10px',
  },
};

class DocumentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Newcolumns: [],
      headerList: [],
    };
  }
  componentDidMount() {
    const { dispatch, documentInterfaceDataList } = this.props;
    let newRes = documentViweColumns;
    this.setState({
      Newcolumns: newRes,
    });

    if (typeof documentInterfaceDataList !== 'undefined') {
      dispatch({
        type: ActionTypes.DOCUMENT_LODING,
        payload: true,
      });
      dispatch(newDocumentSearch(documentInterfaceDataList));
    }
  }

  render() {
    const { classes, searchShow, documentViewFromData } = this.props;
    const { Newcolumns, headerList } = this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <FilterSearch Newcolumns={Newcolumns} searchShow={searchShow} />
        <div className="flex-child-auto">
          <DocumentFrom />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let searchShow = state.controller.documentView.toJS().searchDataList;
  let documentViewFromData =
    state.controller.documentView.toJS().searchDataList;
  let documentInterfaceDataList =
    state.controller.documentView.toJS().interfaceDataList;
  return {
    searchShow,
    documentViewFromData,
    documentInterfaceDataList,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(DocumentView));
