import React from 'react';
import memoizeOne from 'memoize-one';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import AddActivity from '../forms/AddActivity';

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

  handleOpenForm = (toStatus) => {
    this.setState({
      menuOpen: false,
      formOpen: true,
      toStatus,
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
    const { application, ...props } = this.props;
    const step = getNextStepsByStatus(application.get('status'));
    return (
      <div>
        {step && (
          <ButtonGroup
            variant="contained"
            color="primary"
            ref={this.anchorRef}
            aria-label="split button"
            disableElevation
          >
            <Button
              style={styles.leftButton}
              onClick={() => this.handleOpenForm(step.main.value)}
            >
              {(step.main.isNextStep ? `Next Step: ` : '') +
                this.props.t(`tab:${step.main.label.toLowerCase()}`)}
            </Button>
            <Button
              color="primary"
              size="small"
              aria-controls={menuOpen ? 'split-button-menu' : undefined}
              aria-expanded={menuOpen ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={this.handleToggleMenu}
            >
              {menuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          </ButtonGroup>
        )}

        {/* 下拉框内容 */}
        <Popper
          open={menuOpen}
          anchorEl={this.anchorRef.current}
          role={undefined}
          transition
          placement="bottom-end"
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'center top',
              }}
            >
              <Paper style={{ zIndex: 1200 }}>
                <ClickAwayListener onClickAway={this.handleCloseMenu}>
                  <MenuList id="split-button-menu" dense>
                    {step.menu.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => this.handleOpenForm(option.value)}
                      >
                        {this.props.t(`tab:${option.label.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <AddActivity
          open={formOpen}
          onClose={this.handleCloseForm}
          application={application}
          formType={toStatus}
          activityFromTalent
          {...props}
        />
      </div>
    );
  }
}

export default NextStepsButton;

const getNextStepsByStatus = memoizeOne((status) => {
  switch (status) {
    case 'Applied':
    case 'Called_Candidate':
    case 'Meet_Candidate_In_Person':
    case 'Qualified':
      return {
        main: {
          value: 'Submitted',
          label: 'Submitted To Client',
          isNextStep: true,
        },
        menu: [
          { value: 'Called_Candidate', label: 'Called Candidate' },
          {
            value: 'Meet_Candidate_In_Person',
            label: 'Meet Candidate In Person',
          },
          { value: 'Qualified', label: 'Qualified by AM' },
          { value: 'updateResume', label: 'Update Resume' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateUserRoles', label: 'Update User Roles' },
        ],
      };

    case 'Submitted':
    case 'Shortlisted_By_Client':
      return {
        main: { value: 'Interview', label: 'Interview', isNextStep: true },
        menu: [
          { value: 'Shortlisted_By_Client', label: 'Shortlisted By Client' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };

    case 'Interview':
      return {
        main: {
          value: 'Offered',
          label: 'Offered By Client',
          isNextStep: true,
        },
        menu: [
          { value: 'Interview', label: 'Add Interview' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };
    case 'Offered':
      return {
        main: {
          value: 'Offer_Accepted',
          label: 'Offer Accepted',
          isNextStep: true,
        },
        menu: [
          { value: 'Offer_Rejected', label: 'Offer Declined' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };
    case 'Offer_Accepted':
      return {
        main: {
          value: 'Offer_Rejected',
          label: 'Offer Declined',
        },
        menu: [
          { value: 'Offer_Accepted', label: 'Update Offer' },
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };
    case 'Offer_Rejected':
      return {
        main: {
          value: 'Offer_Accepted',
          label: 'Offer Accepted',
        },
        menu: [
          { value: 'addNote', label: 'Add Note To Current Status' },
          { value: 'updateCommissions', label: 'Update Commissions' },
        ],
      };
    default:
    // return {
    //   main: { value: 'test', label: 'test', isNextStep: true },
    //   menu: [
    //     { value: 'updateResume', label: 'Update Resume' },
    //     { value: 'addNote', label: 'Add note To Current Status' },
    //     { value: 'updateCommissions', label: 'Update Commissions' },
    //   ],
    // };
  }
});
