import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as Colors from './../../styles/Colors';

import ExpansionPanel from '@material-ui/core/Accordion';
import ExpansionPanelSummary from '@material-ui/core/AccordionSummary';
import ExpansionPanelDetails from '@material-ui/core/AccordionDetails';

const styles = (theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(22),
    fontWeight: theme.typography.fontWeightRegular,
    color: Colors.SUB_TEXT,
  },
});

class Panel extends Component {
  render() {
    const { classes, title, children, defaultExpanded } = this.props;
    return (
      <ExpansionPanel defaultExpanded={defaultExpanded}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>
            {title}
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

Panel.propTypes = {
  title: PropTypes.string,
};

export default withStyles(styles)(Panel);
