import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';

import HotlistIcon from '@material-ui/icons/Whatshot';

import AddTalentsToHotList from './AddTalentsToHotList';

const styles = {};

class AddTalentsToHotListButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  handleOpen = () => {
    this.setState({ openDialog: true });
  };

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  render() {
    const { openDialog } = this.state;
    const { t, classes, talentIds, talentList, ...props } = this.props;
    return (
      <>
        <Tooltip title={t('action:Add to a hotlist')}>
          <span>
            <IconButton
              disabled={talentIds.size === 0}
              onClick={this.handleOpen}
            >
              <HotlistIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Dialog open={openDialog} fullWidth maxWidth="md">
          <AddTalentsToHotList
            t={t}
            {...props}
            talentIds={talentIds}
            talentList={talentList}
            onClose={this.handleClose}
          />
        </Dialog>
      </>
    );
  }
}

AddTalentsToHotListButton.propTypes = {
  t: PropTypes.func.isRequired,
  talentIds: PropTypes.instanceOf(Immutable.Set),
  talentList: PropTypes.instanceOf(Immutable.List),
};

export default withStyles(styles)(AddTalentsToHotListButton);
