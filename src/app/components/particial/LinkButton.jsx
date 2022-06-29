import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const styles = theme => ({
    link: {
        lineHeight: 'inherit',
        color: theme.palette.primary.main,
        textDecoration: 'none',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        outline: 'none',
        '&:hover': {
            color: theme.palette.primary.dark,
        }
    }
});

const LinkButton = ({ classes, children, className = '', ...props }) => {
    return (
        <button className={clsx(classes.link, className)} {...props}>
            {children}
        </button>
    )
};


export default withStyles(styles)(LinkButton)
