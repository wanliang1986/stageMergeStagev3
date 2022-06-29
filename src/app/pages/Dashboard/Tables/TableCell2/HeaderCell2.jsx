import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  jobType,
  jobPriority,
  templateTypes2,
  typeList,
  industryList,
  invoiceType,
  applicationStatus3,
} from '../../../../constants/formOptions';

import { Cell } from 'fixed-data-table-2';
import {
  SortDownIcon,
  SortIcon,
  SortUpIcon,
} from '../../../../components/Icons';
import * as Colors from '../../../../styles/Colors';

import { styles } from '../params';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};
const enums = {
  status: applicationStatus3,
  type: templateTypes2,
  jobType: jobType,
  priority: jobPriority,
  level: typeList.slice(0, 3),
  industry: industryList,
  invoiceType: invoiceType,
};

class HeaderCell extends React.PureComponent {
  constructor(props) {
    super(props);

    const { column, filters } = props;
    let value = (filters && filters.get(column.col)) || '';
    this.state = {
      value,
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
      ...props
    } = this.props;
    let { value } = this.state;

    return (
      <Cell style={styles.headerCell} {...props}>
        <div style={styles.headerText}>
          <div
            onClick={this._onSortChange}
            className="flex-container align-justify align-middle"
          >
            <span>
              {column.type === 'activityCount' && <div>{t('Sum of')}</div>}
              {t(column.colName)}
              {console.log(column.colName)}
            </span>
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
              {column.type !== 'enum' && (
                <input
                  style={{ width: '100%' }}
                  name={column.col}
                  type={column.colType === 'date' ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => this.setState({ value: e.target.value })}
                  onBlur={(e) => onFilter(e.target)}
                />
              )}
              {column.type === 'enum' && (
                <select
                  name={column.col}
                  onBlur={(e) => onFilter(e.target)}
                  value={value}
                  // onChange={(e) => this.setState({value: e.target.value})}
                  onChange={(e) => onFilter(e.target)}
                >
                  <option value=""> {t('tab:All')} </option>
                  {enums[column.col].map((option, index) => (
                    <option key={index} value={option.value}>
                      {console.log(option.value)}
                      {t(`tab:${option.value}`)}
                    </option>
                  ))}
                </select>
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

export default withTranslation('field', 'tab')(HeaderCell);
