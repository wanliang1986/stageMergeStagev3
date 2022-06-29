import React from 'react';
import { connect } from 'react-redux';
import memoizeOne from 'memoize-one';
import { getApplicationStatusLabel } from '../../../constants/formOptions';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import AddActivity from '../forms/AddActivity';
import { getAllActivityList } from '../../../selectors/activitySelector';

const styles = {
  leftButton: {
    borderColor: 'white',
  },
};

class NextStepsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      formOpen: false,
      toStatus: null,
    };
    this.anchorRef = React.createRef();
  }

  handleOpenForm = () => {
    this.setState({
      menuOpen: false,
      formOpen: true,
      toStatus: 'preStatus',
    });
  };

  handleOpenMenu = () => {
    this.setState({
      menuOpen: true,
    });
  };

  handleCloseForm = () => {
    this.setState({ formOpen: false });
  };

  handleCloseMenu = (event) => {
    this.setState({
      menuOpen: false,
    });
  };
  handleToggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  render() {
    const { menuOpen, formOpen, toStatus } = this.state;
    const { application, activityList, ...props } = this.props;

    const preApplication =
      activityList &&
      activityList.find(
        (ac) =>
          !['Internal_Rejected', 'Client_Rejected', 'Candidate_Quit'].includes(
            ac.get('status')
          )
      );
    const isRejected = [
      'Internal_Rejected',
      'Client_Rejected',
      'Candidate_Quit',
    ].includes(application.get('status'));

    if (!isRejected || !preApplication) {
      return null;
    }
    return (
      <div>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={this.anchorRef}
          aria-label="split button"
          disableElevation
        >
          <Button style={styles.leftButton} onClick={this.handleOpenForm}>
            {`Pre Step: ` +
              getApplicationStatusLabel(preApplication.get('status'))}
          </Button>
        </ButtonGroup>

        <AddActivity
          open={formOpen}
          onClose={this.handleCloseForm}
          application={application.set('status', preApplication.get('status'))}
          formType={toStatus}
          activityFromTalent
          {...props}
        />
      </div>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {
    activityList: getAllActivityList(state, application.get('id')),
    users: state.model.users,
  };
}

export default connect(mapStoreStateToProps)(NextStepsButton);
