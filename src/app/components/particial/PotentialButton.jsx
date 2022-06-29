import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    root: {
        borderColor: theme.palette.primary.main
    },
    wrapper: {
        position: 'relative',
        // display:'inline-block'
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },

});

class PotentialButton extends Component {
    render() {
        const { classes, processing = false, children, disabled, ...otherProps } = this.props;
        return (
            <div className={classes.wrapper}>
                <Button
                    disabled={disabled || processing}
                    {...otherProps}
                    variant="outlined"
                    color="primary"
                    classes={{
                        root: classes.root
                    }}
                >
                    {children}
                    {processing &&
                    <CircularProgress size={24} className={classes.buttonProgress} />}
                </Button>
            </div>
        );
    }
}

PotentialButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PotentialButton);
