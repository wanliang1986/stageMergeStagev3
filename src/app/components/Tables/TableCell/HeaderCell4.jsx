import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  jobStatus,
  jobType,
  jobPriority,
  templateTypes2,
  levelList,
  industryList,
  invoiceType,
  applicationStatus,
  applicationStatus4,
  componiesStatus,
  accountProgressList,
  potentialServiceType,
  activityStatus,
} from '../../../constants/formOptions';

import { Cell } from 'fixed-data-table-2';
import { SortDownIcon, SortIcon, SortUpIcon } from '../../Icons';

import Tooltip from '@material-ui/core/Tooltip';

import Info from '@material-ui/icons/Info';

import * as Colors from '../../../styles/Colors';

import { style } from '../params';
import ServiceTypesSelect from '../../../pages/Companies/Form/PotentialServiceTypeSelect/ServiceTypesSelect';
import MyTooltip from '../../MyTooltip/myTooltip';
const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};
const enums = {
  status: jobStatus.filter((status) => !status.disabled),
  applicationStatus: applicationStatus,
  activityStatus: activityStatus,
  // type: templateTypes2,
  jobType: jobType,
  priority: jobPriority,
  type: levelList,
  industry: industryList,
  invoiceType: invoiceType,
  active: componiesStatus,
  progress: accountProgressList,

  // for p1-report
  currentStatusDesc: applicationStatus4,
  jobStatus: jobStatus.filter((status) => !status.disabled),
};

class HeaderCell3 extends React.PureComponent {
  constructor(props) {
    super(props);

    const { column, filters } = props;
    let value = (filters && filters.get(column.col)) || '';
    let ids = [];
    if (column.col === 'serviceTypes') {
      value.length > 0 &&
        value.forEach((item, index) => {
          ids.push(item.id);
        });
    }
    this.state = {
      value,
      serviceTypeSelect: ids,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { column, filters } = props;
    let value = (filters && filters.get(column.col)) || '';
    if (value !== state.preValue) {
      return {
        value,
        preValue: value,
      };
    }
    return null;
  }

  _onSortChange = (e) => {
    e.preventDefault();

    if (this.props.onSortChange && this.props.column.sortable) {
      let sortDir;
      let columnKey;
      const currentSortDir = this.props.sortDir;
      const currentColumnKey = this.props.column.col;
      if (currentSortDir) {
        if (currentSortDir === SortTypes.DESC) {
          sortDir = SortTypes.ASC;
          columnKey = currentColumnKey;
        } else {
          sortDir = null;
          columnKey = null;
        }
      } else {
        sortDir = SortTypes.DESC;
        columnKey = currentColumnKey;
      }

      this.props.onSortChange(columnKey, sortDir);
    }
  };

  sendServiceType = (checkedList) => {
    let checkedId = [];
    checkedList.forEach((item, index) => {
      checkedId.push(item.id);
    });
    this.props.onSerciceTypeFilter(checkedList, 'serviceTypes');
    this.setState({
      serviceTypeSelect: checkedId,
    });
  };

  render() {
    const {
      column,
      filterOpen,
      onFilter,
      sortDir,
      onSortChange,
      t,
      i18n,
      tReady,
      filters,
      serviceTypeTree,
      ...props
    } = this.props;
    let { value, serviceTypeSelect } = this.state;
    return (
      <Cell style={style.headerCell} {...props}>
        <div style={style.headerText}>
          <div
            onClick={this._onSortChange}
            className="flex-container align-justify align-middle"
          >
            <span>
              {column.type === 'activityCount' && <div>Sum of</div>}
              {t(column.colName)}
            </span>
            {column.tooltip ? (
              <MyTooltip
                title={
                  <React.Fragment>
                    <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                      {column.tooltipText}
                    </div>
                  </React.Fragment>
                }
              >
                <Info
                  style={{ width: '18px', height: '18px', color: '#bdbdbd' }}
                />
              </MyTooltip>
            ) : null}
            {onSortChange &&
              column.sortable &&
              (sortDir ? (
                sortDir === SortTypes.DESC ? (
                  <SortDownIcon fontSize="inherit" color="primary" />
                ) : (
                  <SortUpIcon fontSize="inherit" color="primary" />
                )
              ) : (
                <SortIcon fontSize="inherit" htmlColor={Colors.ALUMINUM} />
              ))}
          </div>
          {!column.disableSearch ? (
            <form
              style={{ display: filterOpen ? '' : 'none' }}
              onSubmit={(e) => {
                e.preventDefault();
                e.target[column.col].blur();
              }}
            >
              {column.type !== 'enum' &&
                column.type !== 'boolean' &&
                column.type !== 'progress' &&
                column.type !== 'salesLeadOwner' &&
                column.type !== 'serviceTypes' && (
                  <input
                    style={{ width: '100%' }}
                    name={column.col}
                    type={column.colType === 'date' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => this.setState({ value: e.target.value })}
                    onBlur={(e) => onFilter(e.target)}
                  />
                )}
              {(column.type === 'enum' || column.type === 'boolean') && (
                <select
                  name={column.col}
                  onBlur={(e) => onFilter(e.target)}
                  value={value}
                  // onChange={(e) => this.setState({value: e.target.value})}
                  onChange={(e) => {
                    onFilter(e.target);
                    this.setState({ value: e.target.value });
                  }}
                >
                  <option value="">All</option>
                  {enums[column.col].map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {column.type === 'progress' && (
                <select
                  name={'progress'}
                  value={value}
                  onChange={(e) => {
                    onFilter(e.target);
                    this.setState({ value: e.target.value });
                  }}
                  // onChange={(e) => onFilter(e.target)}
                >
                  <option value="">All</option>
                  {enums['progress'].map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {column.type === 'salesLeadOwner' && (
                <input
                  style={{ width: '100%' }}
                  name={column.col}
                  type={'text'}
                  value={value}
                  onChange={(e) => this.setState({ value: e.target.value })}
                  onBlur={(e) => onFilter(e.target)}
                />
              )}
              {column.type === 'serviceTypes' && (
                <ServiceTypesSelect
                  name={column.col}
                  labelShow={true}
                  data={serviceTypeTree}
                  selected={serviceTypeSelect}
                  sendServiceType={(checkedList) => {
                    this.sendServiceType(checkedList);
                  }}
                />
              )}
            </form>
          ) : (
            <br style={{ display: filterOpen ? '' : 'none' }} />
          )}
        </div>
      </Cell>
    );
  }
}

export default withTranslation('field')(HeaderCell3);
