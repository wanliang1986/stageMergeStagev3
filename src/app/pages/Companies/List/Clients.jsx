import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getIndexList, sortList } from '../../../../utils/index';

import Typography from '@material-ui/core/Typography';

import CompanyTable from '../../../components/Tables/CompanyTable';

import Loading from '../../../components/particial/Loading';
let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class Clients extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indexList: getIndexList(
        props.companyListFromStore,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      colSortDirs: status.colSortDirs || {},
    };
  }

  componentWillUnmount() {
    status.filters = this.state.filters;
    status.colSortDirs = this.state.colSortDirs;
  }

  static getDerivedStateFromProps(props, state) {
    const newIndexList = getIndexList(
      props.companyListFromStore,
      state.filters,
      state.colSortDirs
    );

    if (!newIndexList.equals(state.indexList)) {
      return {
        indexList: newIndexList,
      };
    }
    return null;
  }

  onFilter = (input) => {
    let filters = this.state.filters;
    let col = input.name;
    let query = input.value;
    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      indexList: getIndexList(
        this.props.companyListFromStore,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  finalyFilteredCompanyList = (List) => {
    console.log('filter');
    let newList = [];
    newList = List.map((item) => {
      return {
        ...item,
        salesLeadOwner:
          item.saleLead && this.findDeepData(item.saleLead, 'saleLeadOwner'),
        serviceTypes:
          item.saleLead && this.findDeepData(item.saleLead, 'serviceTypes'),
      };
    });
    return Immutable.fromJS(newList);
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.props.companyListFromStore,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.companyListFromStore, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };
  onSerciceTypeFilter = (selected, name) => {
    let filters = this.state.filters;
    let col = name;
    let query = selected;
    if (filters.get(col) === query) {
      return;
    }
    if (!query || query.length === 0) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      indexList: getIndexList(
        this.props.companyListFromStore,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  findDeepData = (saleLead, key) => {
    let dataArr = [];
    // console.log(saleLead);
    for (let item of saleLead) {
      // 如果key不存在 跳过
      if (!item[key]) {
        continue;
      }

      for (let item2 of item[key]) {
        // saleLeadOwner
        if (key === 'saleLeadOwner') {
          dataArr.push(item2 ? `${item2.firstName} ${item2.lastName}` : '****');
        }
        // serviceTypes
        if (key === 'serviceTypes') {
          dataArr.push(item2.label);
        }
      }
    }
    return dataArr.join(', ');
  };

  render() {
    const { indexList, colSortDirs } = this.state;
    const { t, companyListFromStore, clientType, requestType } = this.props;

    let filteredCompanyList = indexList.map((index) =>
      companyListFromStore.get(index)
    );
    let filteredCompanyList_TOJS = filteredCompanyList.toJS();
    const finalList = (filteredCompanyList_TOJS =
      this.finalyFilteredCompanyList(filteredCompanyList_TOJS));

    //切换选择时，此处loading状态显示，拿到数据后再显示无数据提示或表格，待优化
    if (requestType === true) {
      return (
        <div className="flex-child-auto container-padding">
          <Loading />
        </div>
      );
    }

    if (companyListFromStore.size === 0 && requestType === false) {
      return (
        <div className="flex-child-auto container-padding">
          <Typography variant="h5">There is no record</Typography>
        </div>
      );
    }

    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <CompanyTable
            companyList={finalList}
            filterOpen={true}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onSerciceTypeFilter={this.onSerciceTypeFilter}
            filters={this.state.filters}
            onFilter={this.onFilter}
            t={t}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            clientType={clientType}
          />
        </div>
      </div>
    );
  }
}

Clients.propTypes = {
  t: PropTypes.func.isRequired,
};

export default Clients;
