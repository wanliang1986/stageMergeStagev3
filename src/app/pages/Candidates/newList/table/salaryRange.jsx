import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import { currency, rateUnitOptions } from '../../../../constants/formOptions';

const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
class SalaryRangeCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getCurrencyLabel = (dataCurrency) => {
    let _currency = currency.filter((item, index) => {
      return item.value === dataCurrency;
    });
    return _currency[0].label;
  };

  getRateUnitType = (type) => {
    let _type = rateUnitOptions.filter((item, index) => {
      return item.value === type;
    });
    return _type[0].label;
  };

  render() {
    const { classes, data, colDef } = this.props;
    let html = '';
    if (data.currentSalary) {
      const { gte, lte } = data.currentSalary;
      let _current = data.currency ? this.getCurrencyLabel(data.currency) : '';
      let _type = data.payType ? this.getRateUnitType(data.payType) : '';
      if (gte && lte) {
        html = `${_current}  ${gte} - ${lte}/${_type}`;
      } else if (!gte && lte) {
        html = `less than ${_current}  ${lte} /${_type}`;
      } else if (gte && !lte) {
        html = `more than ${_current}  ${gte} /${_type}`;
      }
    } else {
      html = `N/A`;
    }
    let prehtml = '';
    if (data.preferredSalary) {
      const { gte, lte } = data.preferredSalary;
      let _current = data.preferredCurrency
        ? this.getCurrencyLabel(data.preferredCurrency)
        : '';
      let _type = data.preferredPayType
        ? this.getRateUnitType(data.preferredPayType)
        : '';
      if (gte && lte) {
        prehtml = `${_current} ${gte}-${lte}/${_type}`;
      } else if (!gte && lte) {
        prehtml = `less than ${_current} ${lte}/${_type}`;
      } else if (gte && !lte) {
        prehtml = `more than ${_current} ${gte}/${_type}`;
      }
    } else {
      prehtml = `N/A`;
    }
    if (colDef.headerName == 'Preferred Salary') {
      return <span className={classes.title}>{prehtml}</span>;
    }
    return (
      // <Tooltip title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>} arrow placement="top">
      <span className={classes.title}>{html}</span>
      // </Tooltip>
    );
  }
}

export default withStyles(style)(SalaryRangeCell);
