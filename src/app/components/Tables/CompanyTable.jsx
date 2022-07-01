import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
// import
import { Table, Column, Cell } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import HeaderCell3 from './TableCell/HeaderCell3';
import TextCell from './TableCell/TextCell';
import DateCell3 from './TableCell/DateCell3';

import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import MyTooltip from '../MyTooltip/myTooltip';
import TemporaryContract from '../MyTooltip/TooltipTemplate/TemporaryContract';

// add by bill
import CompanyTooltip from '../../pages/Companies/CompanyTooltip';
import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';
import { levelList, industryList } from '../../constants/formOptions';
import SalesLead from '../../pages/Companies/Form/SalesLead/SalesLead';

import { getPotentialServiceType } from '../../actions/clientActions';
import { connect } from 'react-redux';

const enums = {
  companyClientLevelType: levelList,
  industryType: industryList,
  industry: industryList,
};

const convertValueToLabel = (val, col) => {
  const ele = enums[col].find((ele) => ele.value === val);
  return ele && ele.label;
};

class LinkCell extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this._getValue(nextProps) !== this._getValue(this.props);
  }

  _getValue = ({ rowIndex, data }) => {
    return data.getIn([rowIndex, 'id']);
  };

  //获取临期合同信息
  getContractinformation = (expiredContract) => {
    let newDate = Date.parse(new Date()) / 1000;
    let contractMsg = [];
    expiredContract.forEach((item, index) => {
      if (item.endDate) {
        let days = parseInt(
          (new Date(item.endDate).getTime() / 1000 - newDate) / 24 / 60 / 60
        );
        if (days >= 0 && days <= 30) {
          contractMsg.push(item);
        }
      }
    });
    return contractMsg;
  };

  //获取到期合同
  getExpiredcontract = (expiredContract) => {
    let newDate = Date.parse(new Date()) / 1000;
    let contractMsg = [];
    expiredContract.forEach((item, index) => {
      if (item.endDate) {
        let days = parseInt(
          (new Date(item.endDate).getTime() / 1000 - newDate) / 24 / 60 / 60
        );
        console.log(days);
        if (days < 0) {
          contractMsg.push(item);
        }
      }
    });
    return contractMsg;
  };
  ///

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const id = data.getIn([rowIndex, 'id']);
    const text = data.getIn([rowIndex, col]);
    const type = data.getIn([rowIndex, 'type']);
    const expiredContract = data.getIn([rowIndex, 'expiredContract']);
    let contractList;
    let expiredcontractList;
    if (expiredContract) {
      let list = expiredContract.toJS();
      // contractList = expiredContract.toJS();
      contractList = this.getContractinformation(list);
      expiredcontractList = this.getExpiredcontract(list);
    }
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {type === 'POTENTIAL_CLIENT' ? (
            <Link className="job-link" to={`/companies/detail/${id}/1`}>
              {text}{' '}
            </Link>
          ) : (
            <Link className="job-link" to={`/companies/detail/${id}/0`}>
              {text}{' '}
            </Link>
          )}
          {contractList && contractList.length > 0 ? (
            <MyTooltip
              title={<TemporaryContract contractList={contractList} type={1} />}
            >
              <NotificationImportantIcon
                style={{ color: '#FBAD30', verticalAlign: 'middle' }}
              />
            </MyTooltip>
          ) : (
            ''
          )}
          {expiredcontractList && expiredcontractList.length > 0 ? (
            <MyTooltip
              title={
                <TemporaryContract
                  contractList={expiredcontractList}
                  type={2}
                />
              }
            >
              <NotificationImportantIcon
                style={{ color: '#FB3030', verticalAlign: 'middle' }}
              />
            </MyTooltip>
          ) : (
            ''
          )}
        </div>
      </Cell>
    );
  }
}

class EnumCell extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this._getValue(nextProps) !== this._getValue(this.props);
  }

  _getValue = ({ rowIndex, data }) => {
    return data.getIn([rowIndex, 'id']);
  };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const text = data.getIn([rowIndex, col]);

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {convertValueToLabel(text, col)}
        </div>
      </Cell>
    );
  }
}

// 布尔类型cell
class BooleanTextCell extends React.Component {
  shouldComponentUpdate(nextProps) {
    return this._getValue(nextProps) !== this._getValue(this.props);
  }

  _getValue = ({ rowIndex, data }) => {
    return data.getIn([rowIndex, 'id']);
  };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const text = data.getIn([rowIndex, col]);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {text ? 'Active' : 'InActive'}
        </div>
      </Cell>
    );
  }
}

class DealTimeCell extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return this._getValue(nextProps) !== this._getValue(this.props);
  // }

  // _getValue = ({ rowIndex, data }) => {
  //   return data.getIn([rowIndex, 'saleLead']);
  // };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    // console.log(data.toJS())
    const salesLead = data.getIn([rowIndex, 'salesLeads']);
    let estimatedDealTime;
    if (salesLead) {
      estimatedDealTime = salesLead
        .map((item, index) => {
          return moment(item.get('estimatedDealTime')).format('YYYY-MM-DD');
        })
        .join(',');
    }

    // return salesLead.map((item, index) => {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {/* {item.get('estimatedDealTime') ? item.get('estimatedDealTime') : ''} */}
          {estimatedDealTime}
        </div>
      </Cell>
    );
    // });
  }
}

class ProgressCell extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return this._getValue(nextProps) !== this._getValue(this.props);
  // }

  // _getValue = ({ rowIndex, data }) => {
  //   return data.getIn([rowIndex, 'saleLead']);
  // };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    // console.log(data.toJS())
    const salesLead = data.getIn([rowIndex, col]);
    let accountProgress;
    if (salesLead) {
      accountProgress = salesLead
        .map((item, index) => {
          return item.get('accountProgress') * 100 + '%';
        })
        .join(',');
    }

    return (
      // salesLead &&
      // salesLead.map((item, index) => {
      //   return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {/* {item.get('accountProgress')
                ? item.get('accountProgress') * 100 + '%'
                : ''} */}
          {accountProgress}
        </div>
      </Cell>
      //   );
      // })
    );
  }
}

class ServiceTypeCell extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return this._getValue(nextProps) !== this._getValue(this.props);
  // }

  // _getValue = ({ rowIndex, data }) => {
  //   return data.getIn([rowIndex, 'saleLead']);
  // };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    const salesLead =
      data.getIn([rowIndex, 'salesLeadDetails']) ||
      data.getIn([rowIndex, 'salesLeads']);
    let serviceType;
    if (salesLead) {
      let companyServiceTypes =
        salesLead &&
        salesLead.map((item, index) => {
          let arr = item.get('companyServiceTypes').map((_item, _index) => {
            return _item.get('label');
          });
          return arr.join(',');
        });
      serviceType = companyServiceTypes && companyServiceTypes.join(',');
    } else {
      let companyServiceTypes =
        data &&
        data.getIn([rowIndex, 'companyServiceTypes']).map((item, index) => {
          return item.get('label');
        });
      serviceType = companyServiceTypes && companyServiceTypes.join(',');
    }
    return (
      <MyTooltip title={serviceType}>
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            style={{
              width: props.width - 26,
              textTransform: 'none',
            }}
          >
            {serviceType}
          </div>
        </Cell>
      </MyTooltip>
    );
  }
}

class LeadOwnerCell extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return this._getValue(nextProps) !== this._getValue(this.props);
  // }

  // _getValue = ({ rowIndex, data }) => {
  //   return data.getIn([rowIndex, 'saleLead']);
  // };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    let salesLeadOwners = data.getIn([rowIndex, col]);
    console.log(salesLeadOwners.toJS());
    let LeadOwner = null;
    if (salesLeadOwners && salesLeadOwners.size > 0) {
      LeadOwner = salesLeadOwners
        .map((item, index) => {
          return item.get('fullName');
        })
        .join(',');
    }

    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          <CompanyTooltip
            {...this.props}
            LeadOwner={LeadOwner}
          ></CompanyTooltip>
        </div>
      </Cell>
    );
    // return salesLead.forEach((item, index) => {
    //   if (item.get('saleLeadOwner').size !== 0) {
    //     item.get('saleLeadOwner').map((val, index) => {
    //       return (
    //         <Cell {...props}>
    //           <div
    //             className="overflow_ellipsis_1"
    //             style={{
    //               width: props.width - 26,
    //               textTransform: 'none',
    //             }}
    //           >
    //             <CompanyTooltip {...props}>
    //               test!
    //               {/* {val.get('firstName') + '' + val.get('lastName')} */}
    //             </CompanyTooltip>
    //           </div>
    //         </Cell>
    //       );
    //     });
    //   }
    // });
  }
}

class AccountManager extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return this._getValue(nextProps) !== this._getValue(this.props);
  // }

  // _getValue = ({ rowIndex, data }) => {
  //   return data.getIn([rowIndex, 'saleLead']);
  // };

  render() {
    const { rowIndex, data, col, ...props } = this.props;
    console.log(data.toJS());
    let AM = data.getIn([rowIndex, 'accountManager']);
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          {/* <CompanyTooltip
            {...this.props}
            LeadOwner={AM}
          ></CompanyTooltip> */}
        </div>
      </Cell>
    );
    // return salesLead.forEach((item, index) => {
    //   if (item.get('saleLeadOwner').size !== 0) {
    //     item.get('saleLeadOwner').map((val, index) => {
    //       return (
    //         <Cell {...props}>
    //           <div
    //             className="overflow_ellipsis_1"
    //             style={{
    //               width: props.width - 26,
    //               textTransform: 'none',
    //             }}
    //           >
    //             <CompanyTooltip {...props}>
    //               test!
    //               {/* {val.get('firstName') + '' + val.get('lastName')} */}
    //             </CompanyTooltip>
    //           </div>
    //         </Cell>
    //       );
    //     });
    //   }
    // });
  }
}

const CompanyCell = ({ type, ...props }) => {
  switch (type) {
    case 'link':
      return <LinkCell {...props} />;
    case 'enum':
      return <EnumCell {...props} />;
    case 'date':
      return <DateCell3 {...props} />;
    case 'num':
      return <TextCell disableTooltip {...props} />;
    case 'boolean':
      return <BooleanTextCell {...props} />;
    case 'dealTime':
      return <DealTimeCell {...props} />;
    case 'progress':
      return <ProgressCell {...props} />;
    case 'companyServiceTypes':
      return <ServiceTypeCell {...props} />;
    case 'salesLeadOwner':
      return <LeadOwnerCell {...props} />;
    // case 'accountManager':
    //   return <AccountManager {...props}/>
    default:
      return <TextCell {...props} />;
  }
};

const columns = [
  {
    colName: 'Company Name',
    colWidth: 300,
    flexGrow: 3,
    col: 'name',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Open Jobs',
    colWidth: 120,
    flexGrow: 2,
    col: 'openJobAmount',
    type: 'num',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Account Manager',
    colWidth: 200,
    flexGrow: 2,
    col: 'accountManager',
    sortable: true,
  },
  {
    colName: 'Contacts',
    colWidth: 100,
    flexGrow: 2,
    col: 'contactAmount',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Level',
    colWidth: 180,
    flexGrow: 2,
    col: 'companyClientLevelType',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'Service Type',
    colWidth: 420,
    flexGrow: 1,
    type: 'companyServiceTypes',
    col: 'companyServiceTypes',
    // disableSearch: true,
    sortable: false,
  },
  {
    colName: 'Status',
    colWidth: 180,
    col: 'active',
    type: 'boolean',
    sortable: true,
  },
  {
    colName: 'Industry',
    colWidth: 240,
    flexGrow: 2,
    col: 'industryType',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'Country',
    colWidth: 180,
    flexGrow: 2,
    col: 'country',
    sortable: true,
  },
  // {
  //   colName: 'Owner',
  //   colWidth: 200,
  //   flexGrow: 2,
  //   col: 'bdManager',
  //   sortable: true,
  // },
  // {
  //   colName: 'Contact Person',
  //   colWidth: 150,
  //   flexGrow: 2,
  //   col: 'numOfContacts',
  //   type: 'num',
  //   sortable: true,
  //   disableSearch: true,
  // },
];

const columns2 = [
  {
    colName: 'Company Name',
    colWidth: 300,
    flexGrow: 3,
    col: 'name',
    type: 'link',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Open Jobs',
    colWidth: 120,
    flexGrow: 2,
    col: 'numOfOpenJobs',
    type: 'num',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Account Manager',
    colWidth: 200,
    flexGrow: 2,
    col: 'accountManager',
    sortable: true,
  },
  {
    colName: 'My Role',
    colWidth: 200,
    flexGrow: 2,
    col: 'role',
    sortable: true,
  },
  {
    colName: 'Contacts',
    colWidth: 100,
    flexGrow: 2,
    col: 'numOfContacts',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Level',
    colWidth: 180,
    flexGrow: 2,
    col: 'companyClientLevelType',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'Service Type',
    colWidth: 420,
    flexGrow: 1,
    type: 'companyServiceTypes',
    col: 'companyServiceTypes',
    // disableSearch: true,
    sortable: false,
  },
  {
    colName: 'Status',
    colWidth: 180,
    col: 'active',
    type: 'boolean',
    sortable: true,
  },
  {
    colName: 'Industry',
    colWidth: 240,
    flexGrow: 2,
    col: 'industryType',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'Country',
    colWidth: 180,
    flexGrow: 2,
    col: 'addresses',
    sortable: true,
  },
  // {
  //   colName: 'Owner',
  //   colWidth: 200,
  //   flexGrow: 2,
  //   col: 'bdManager',
  //   sortable: true,
  // },
  // {
  //   colName: 'Contact Person',
  //   colWidth: 150,
  //   flexGrow: 2,
  //   col: 'numOfContacts',
  //   type: 'num',
  //   sortable: true,
  //   disableSearch: true,
  // },
];

class CompanyTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      columnWidths: (
        props.ownColumns || (props.clientType === 0 ? columns : columns2)
      ).reduce((columnWidths, column) => {
        columnWidths[column.col] = column.colWidth;
        return columnWidths;
      }, {}),
      companyList: props.companyList,
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
    this.props.dispatch(getPotentialServiceType());
  }

  _onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    this.setState(({ columnWidths }) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      },
    }));
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.companyList &&
      !nextProps.companyList.equals(this.props.companyList)
    ) {
      this.setState({
        companyList: nextProps.companyList,
      });
    }
  }

  render() {
    const {
      filterOpen,
      onFilter,
      onSortChange,
      colSortDirs = {},
      filters,
      onScrollEnd,
      scrollLeft,
      scrollTop,
      count,
      ownColumns,
      clientType,
      serviceTypeTree,
      onSerciceTypeFilter,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              rowsCount={count || this.state.companyList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              onScrollEnd={(...props) => {
                if (onScrollEnd) {
                  onScrollEnd(...props);
                }
                ReactTooltip.rebuild();
              }}
              scrollLeft={scrollLeft || 0}
              scrollTop={scrollTop || 0}
              onColumnResizeEndCallback={this._onColumnResizeEndCallback}
              isColumnResizing={false}
            >
              {(ownColumns || (clientType === 0 ? columns : columns2)).map(
                (column, index) => {
                  return (
                    <Column
                      key={index}
                      columnKey={column.col}
                      header={
                        <HeaderCell3
                          column={column}
                          filterOpen={filterOpen}
                          serviceTypeTree={serviceTypeTree}
                          filters={filters}
                          onFilter={onFilter}
                          onSerciceTypeFilter={onSerciceTypeFilter}
                          onSortChange={onSortChange}
                          sortDir={colSortDirs && colSortDirs[column.col]}
                        />
                      }
                      cell={
                        <CompanyCell
                          data={this.state.companyList}
                          type={column.type}
                          col={column.col}
                          style={style.displayCell}
                        />
                      }
                      width={this.state.columnWidths[column.col]}
                      flexGrow={column.flexGrow}
                      fixed={column.fixed}
                      allowCellsRecycling={true}
                      pureRendering={true}
                      isResizable={true}
                    />
                  );
                }
              )}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

CompanyTable.propTypes = {
  companyList: PropTypes.instanceOf(Immutable.List).isRequired,
};

const mapStoreStateToProps = (state, props) => {
  const serviceTypeTree = state.model.serviceTypeTree.tree;
  return { serviceTypeTree };
};

export default connect(mapStoreStateToProps)(withStyles(style)(CompanyTable));
