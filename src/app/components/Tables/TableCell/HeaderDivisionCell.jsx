import React from 'react';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import { withTranslation } from 'react-i18next';

import { Cell } from 'fixed-data-table-2';
import { SortDownIcon, SortIcon, SortUpIcon } from '../../Icons';
import * as Colors from '../../../styles/Colors';
import { style } from '../params';

import Select from 'react-select-5';

const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

const dropdownStyles = {
  valueContainer: (base) => ({ ...base, padding: '0 8px' }),
  control: (base, params) => {
    // console.log('control', base, params.isFocused);
    if (params.isFocused) {
      return {
        ...base,
        borderColor: '#8a8a8a',
        minHeight: 28,
        borderRadius: 0,
        boxShadow: '0 0 5px #cacaca',
        '&:hover': { borderColor: '#8a8a8a' },
      };
    }
    return { ...base, borderColor: '#cacaca', minHeight: 28, borderRadius: 0 };
  },
  menu: (base, ...params) => {
    // console.log('menu', base, params);
    return {
      ...base,
      marginBottom: 1,
      marginTop: -1,
      borderRadius: 0,
      border: '1px solid #8a8a8a',
      borderTopColor: '#F2F2F2',
      boxShadow: 'none',
    };
  },
  menuList: (base, ...params) => {
    return { ...base, paddingTop: 0, paddingBottom: 1 };
  },
  input: (base) => ({ ...base, margin: '0 2px' }),
  clearIndicator: (base) => ({ ...base, padding: 2 }),
  dropdownIndicator: (base) => ({ ...base, padding: 2 }),
  indicatorSeparator: () => null,
};

class HeaderDivisionCell extends React.Component {
  constructor(props) {
    super(props);
    const { column, filters, divisionMaps } = props;
    let value = (filters && filters.get(column.col)) || '';
    const selectedDivision = divisionMaps[value];
    this.state = {
      value,
      preValue: value,
      selectedDivision: selectedDivision || { id: '', name: 'All' },
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { column, filters, divisionMaps } = props;
    let value = (filters && filters.get(column.col)) || '';
    if (value !== state.preValue) {
      const selectedDivision = divisionMaps[value];
      return {
        value,
        preValue: value,
        selectedDivision: selectedDivision || { id: '', name: 'All' },
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

  handleChange = (value) => {
    const { onFilter, column } = this.props;
    console.log(value);
    onFilter({ value: value && value.id, name: column.col });
  };

  render() {
    const {
      dispatch,
      divisionOptions,
      divisionMaps,
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
    return (
      <Cell style={style.headerCell} {...props}>
        <div style={style.headerText}>
          <div
            onClick={this._onSortChange}
            className="flex-container align-justify align-middle"
          >
            <span>{t(column.colName)}</span>
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
            <Select
              noOptionsMessage={() => null}
              styles={dropdownStyles}
              menuPortalTarget={window.document.body}
              menuPosition={'absolute'}
              menuPlacement={'auto'}
              isSearchable
              isClearable={
                this.state.selectedDivision && this.state.selectedDivision.id
              }
              value={this.state.selectedDivision}
              options={divisionOptions}
              getOptionValue={(option) => option['id']}
              getOptionLabel={(option) => option.name}
              // filterOption={(c, i) => {
              //   console.log(c, i);
              //   return true;
              // }}
              onChange={this.handleChange}
            />
          ) : (
            <br style={{ display: filterOpen ? '' : 'none' }} />
          )}
        </div>
      </Cell>
    );
  }
}

const mapStateToProps = (state) => {
  const { divisionOptions, divisionMaps } = getDivisionOptions(
    state.model.divisions
  );
  return {
    divisionOptions,
    divisionMaps,
  };
};

export default withTranslation('field')(
  connect(mapStateToProps)(HeaderDivisionCell)
);

const getDivisionOptions = memoizeOne((divisions) => {
  return {
    divisionMaps: divisions.toJS(),
    divisionOptions: [{ id: '', name: 'All' }].concat(
      divisions
        .toList()
        .sortBy((u) => u.get('name'))
        .toJS()
    ),
  };
});
