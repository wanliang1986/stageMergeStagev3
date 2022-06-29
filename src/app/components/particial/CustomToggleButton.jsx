import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    '&$out$out2': {
      height: 32,
      // minWidth: 220,
      fontSize: '1.25em',
      borderRadius: 0,
      '&$borderColor': {
        borderColor: '#cacaca',
      },
      paddingLeft: '0.4em',
      paddingTop: 4,
      paddingBottom: 2,
      '&.active': {
        outline: 'none',
        borderColor: '#8a8a8a',
        boxShadow: '0 0 5px #cacaca',
        transition: 'box-shadow 0.5s, border-color 0.25s ease-in-out',
      },
      '&$borderColor .rs-picker-toggle-caret': {
        top: 4,
      },
      '&$borderColor .rs-picker-toggle-clean': {
        top: 4,
      },
    },
  },
  out: {},
  out2: {},
  borderColor: {},
}));
const CustomToggleButton = React.forwardRef(
  ({ children, className, ...props }, ref) => {
    const classes = useStyles();
    return (
      <div
        {...props}
        className={clsx(
          className,
          classes.root,
          classes.out,
          classes.out2,
          classes.borderColor
        )}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default CustomToggleButton;
