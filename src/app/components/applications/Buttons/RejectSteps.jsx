import React from 'react';
import memoizeOne from 'memoize-one';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import AddActivity from '../forms/AddActivity';

const theme = createTheme({
  palette: {
    primary: {
      light: '#f78a73',
      main: '#f56d50',
      dark: '#ab4c38',
      contrastText: '#fff',
    },
  },
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'capitalize',
      },
      label: {
        whiteSpace: 'nowrap',
      },
    },
  },
});

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
          <ThemeProvider theme={theme}>
            <Button
              variant="outlined"
              color="primary"
              aria-label="split button"
              disableElevation
              ref={this.anchorRef}
              onClick={this.handleToggleMenu}
              endIcon={menuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            >
              {'Rejected By'}
            </Button>
          </ThemeProvider>
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
        menu: [
          { value: 'Internal_Rejected', label: 'Rejected by AM' },
          { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
        ],
      };

    case 'Submitted':
    case 'Shortlisted_By_Client':
    case 'Interview':
      return {
        menu: [
          { value: 'Client_Rejected', label: 'Rejected by Client' },
          { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
        ],
      };
    default:
  }
});
