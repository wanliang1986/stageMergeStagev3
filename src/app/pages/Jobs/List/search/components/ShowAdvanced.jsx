import React, { useState, useEffect } from 'react';

import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { connect, useSelector, useDispatch } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';

const style = makeStyles({
  every: {
    marginRight: 0,
    marginBottom: '5px',
    maxWidth: '275px',
  },
  andOr: {
    marginLeft: '5px',
    marginRight: '5px',
    marginBottom: '5px',
  },
});
const ShowAdvanced = ({ data, advancedFilter }) => {
  const classes = style();

  const [arr, setArr] = useState([]);
  const [filter, setFilter] = useState();

  useEffect(() => {
    console.log(advancedFilter);
    if (advancedFilter) {
      setFilter(advancedFilter);
    }
  }, [advancedFilter]);

  useEffect(() => {
    let arrs = [],
      ars = [];
    if (data[1]) {
      arrs = data[1].split(',').map((item) => {
        return item.replace(/\./g, '.');
      });
      if (arr.length >= 1) {
        arrs.pop();
      }
      arrs.map((item) => {
        if (item != '') {
          ars.push(item);
        }
      });
      setArr(ars);
    }
  }, [data]);

  const handleDelete = (item, e) => {
    console.log(filter);
    console.log(data);
    let arrs = [],
      arrss = [];
    let arr = data[1].split(',');
    arr.pop();
    data.forEach((items) => {});
    arrs = filter.filter((items) => {
      console.log(Object.keys(items), Object.values(items));
      return (
        Object.keys(items)[0] == data[0] &&
        Object.values(items)[0].length == arr.length
      );
    });
    console.log(item, arrs);

    item = item.replace(/"/g, '').split(': ');
    arrs.forEach((items) => {
      Object.values(items)[0].forEach((ite) => {
        if (ite['colName'] == item[0] && ite['value'] == item[1]) {
          arrs.push(ite);
        }
      });
    });
  };

  return (
    <>
      <span className={classes.andOr}>(</span>
      {arr.map((item, index) => {
        return (
          <span key={item + index}>
            <Tooltip title={item} placement="top-end">
              <Chip
                color="default"
                size="small"
                key={index}
                label={item}
                // onDelete={(e) => handleDelete(item, e)}
                // deleteIcon={<ClearIcon color="disabled" />}
                className={classes.every}
              />
            </Tooltip>
            {arr.length - 1 != index && (
              <span className={classes.andOr}>{data[0]}</span>
            )}
          </span>
        );
      })}
      <span className={classes.andOr}>)</span>
    </>
  );
};

function mapStateToProps(state) {
  let { advancedFilter } = state.controller.newSearchJobs.toJS();
  return {
    advancedFilter,
  };
}

export default connect(mapStateToProps)(ShowAdvanced);
