import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  items: {
    width: '100%',
    minHeight: 32,
    marginBottom: 24,
    display: 'flex',
  },
  leftItem: {
    minWidth: 162,
    height: '100%',
    marginRight: 24,
  },
  rightItemItem: {
    minWidth: 523,
    height: '100%',
    paddingRight: 24,
  },
});

const FormItem = (props) => {
  const { label, children, required, isRadio } = props;
  const classes = useStyles();
  return (
    <div className={classes.items}>
      <div className={classes.leftItem}>
        <span style={{ float: 'right', marginTop: isRadio ? 9 : 6 }}>
          {label}
          {required && <span style={{ color: 'red', paddingLeft: 4 }}>*</span>}
        </span>
      </div>
      <div className={classes.rightItemItem}>{children}</div>
    </div>
  );
};

export default FormItem;
