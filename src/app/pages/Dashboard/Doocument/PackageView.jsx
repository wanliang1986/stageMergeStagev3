import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PackFilterSearch from './PackFilterSearch';
import PackageFromList from './PackageFromList';
import { packagetViweColumns } from '../../../../utils/documentViewSearch';
import * as ActionTypes from '../../../constants/actionTypes';
import { newPackageSearch } from '../../../actions/newDocumentView';
import moment from 'moment-timezone';

const styles = {
  root: {
    paddingTop: '10px',
  },
};

class PackageVIew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Newcolumns: [],
    };
  }
  componentDidMount() {
    const { dispatch, packageInterfaceDataList } = this.props;
    let newRes = packagetViweColumns;
    this.setState({
      Newcolumns: newRes,
    });
    dispatch({
      type: ActionTypes.DOCUMENT_LODING,
      payload: true,
    });
    if (typeof packageInterfaceDataList == 'undefined') {
      let params = {
        pageNumber: 1,
        pageSize: 25,
        search: [
          {
            condition: [],
            relation: 'AND',
          },
        ],
      };
      params.timezone = new Date(moment().startOf('day').toDate()).getTime();

      dispatch({
        type: ActionTypes.PACKAGE_INTERFACE,
        payload: params,
      });
      dispatch(newPackageSearch(params));
    } else {
      dispatch(newPackageSearch(packageInterfaceDataList));
    }
  }
  render() {
    const { classes, searchShow, packageViewFromData } = this.props;
    const { Newcolumns } = this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <PackFilterSearch Newcolumns={Newcolumns} searchShow={searchShow} />

        <div className="flex-child-auto">
          <PackageFromList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let searchShow = state.controller.documentView.toJS().searchDataList;
  let packageViewFromData =
    state.controller.documentView.toJS().packSearchDataList;
  let packageInterfaceDataList =
    state.controller.documentView.toJS().packInterfaceDataList;
  return {
    searchShow,
    packageViewFromData,
    packageInterfaceDataList,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(PackageVIew));
