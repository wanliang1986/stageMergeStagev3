import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getIndexList, sortList } from '../../../../utils/index';

import Typography from '@material-ui/core/Typography';

import CompanyTable from '../../../components/Tables/CompanyTable';
import moment from 'moment-timezone';
import Loading from '../../../components/particial/Loading';

// Define a users schema
// const user = new schema.Entity('users');

// // Define your comments schema
// const comment = new schema.Entity('comments', {
//   commenter: user,
// });

// // Define your article
// const article = new schema.Entity('articles', {
//   author: user,
//   comments: [comment],
// });

// const normalizedData = normalize(originalData, article);

// console.log(normalizedData);

//////
let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const columns = [
  {
    colName: 'Company Name',
    colWidth: 200,
    flexGrow: 3,
    col: 'name',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Industry',
    colWidth: 200,
    flexGrow: 2,
    col: 'industry',
    type: 'enum',
    sortable: true,
  },

  // 1
  {
    colName: 'Sales Lead Owner',
    colWidth: 200,
    flexGrow: 1,
    col: 'salesLeadOwner',
    type: 'salesLeadOwner',
    // sortable: true,
  },

  {
    colName: 'Estimated Deal Time',
    colWidth: 240,
    flexGrow: 1,
    col: 'estimatedDealTime',
    type: 'dealTime',
    disableSearch: true,
    // sortable: true,
  },
  {
    colName: 'Account Progress',
    colWidth: 240,
    flexGrow: 1,
    col: 'accountProgress',
    type: 'progress',
    // disableSearch: true,
    // sortable: true,
    // tooltip: true,
  },

  //2
  {
    colName: 'Service Type',
    colWidth: 420,
    flexGrow: 1,
    col: 'serviceTypes',
    type: 'serviceTypes',
    // disableSearch: true,
    // sortable: true,
  },
  {
    colName: 'Country',
    colWidth: 240,
    flexGrow: 1,
    col: 'addresses',
    // disableSearch: true,
    sortable: true,
  },
  {
    colName: 'Created At',
    colWidth: 150,
    flexGrow: 2,
    col: 'createdDate',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Created By',
    colWidth: 150,
    flexGrow: 2,
    col: 'createdBy',
    sortable: true,
  },
  // {
  //   colName: 'City',
  //   colWidth: 180,
  //   col: 'city',
  //   sortable: true,
  // },

  //3
  // {
  //   colName: 'Account Manager',
  //   colWidth: 200,
  //   flexGrow: 2,
  //   col: 'accountManager',
  //   sortable: true,
  // },
  // {
  //   colName: 'Owner',
  //   colWidth: 200,
  //   flexGrow: 2,
  //   col: 'bdManager',
  //   sortable: true,
  //   // disableSearch:true
  // },

  // {
  //   colName: 'Contact Person',
  //   colWidth: 150,
  //   flexGrow: 1,
  //   col: 'numOfContacts',
  //   type: 'num',
  //   sortable: true,
  //   disableSearch: true,
  // },

  // {
  //   colName: 'Open Jobs',
  //   colWidth: 150,
  //   flexGrow: 2,
  //   col: 'numOfOpenJobs',
  //   type: 'num',
  //   sortable: true,
  //   disableSearch: true,
  // },
];

class Prospect extends React.PureComponent {
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
    const indexList = getIndexList(
      props.companyListFromStore,
      state.filters,
      state.colSortDirs
    );
    if (!indexList.equals(state.indexList)) {
      return { indexList };
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
        estimatedDealTime:
          item.saleLead && this.findestimateDealTime(item.saleLead),
        accountProgress:
          item.saleLead && this.findaccountProgress(item.saleLead),
      };
    });
    return Immutable.fromJS(newList);
  };

  findestimateDealTime = (saleLead) => {
    let dataArr = [];
    saleLead.forEach((item, index) => {
      dataArr.push(moment(item.estimatedDealTime).format('YYYY-MM-DD'));
    });
    return dataArr.join(', ');
  };

  findaccountProgress = (saleLead) => {
    let dataArr = [];
    saleLead.forEach((item, index) => {
      dataArr.push(item.accountProgress * 100 + '%');
    });
    return dataArr.join(', ');
  };

  findDeepData = (saleLead, key) => {
    let dataArr = [];
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
    const { t, companyListFromStore, authorities, requestType } = this.props;
    // console.log("[[clients]]", companyListFromStore);
    let filteredCompanyList = indexList.map((index) =>
      companyListFromStore.get(index)
    );

    let filteredCompanyList_TOJS = filteredCompanyList.toJS();
    const finalList = (filteredCompanyList_TOJS =
      this.finalyFilteredCompanyList(filteredCompanyList_TOJS));
    if (
      !authorities
      // ||!authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) //用户权限判断
    ) {
      return (
        <div className="flex-child-auto container-padding">
          <Typography variant="h5">
            {t('message:notAuthorizedToViewCurrentPage')}
          </Typography>
        </div>
      );
    }
    if (requestType === true) {
      return <Loading />;
    }

    if (companyListFromStore.size === 0 && requestType === false) {
      return (
        <div className="flex-child-auto container-padding">
          <Typography variant="h5">{t('tab:There is no record')}</Typography>
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
            filters={this.state.filters}
            onFilter={this.onFilter}
            onSerciceTypeFilter={this.onSerciceTypeFilter}
            t={t}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            ownColumns={columns}
          />
        </div>
      </div>
    );
  }
}

Prospect.propTypes = {
  t: PropTypes.func.isRequired,
};

export default Prospect;
