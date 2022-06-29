import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const options = [
  'Create Assignment(Extension)',
  'Create Assignment(Rate Change)',
];

class dropDownButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedIndex: 0,
    };
    this.anchorRef = React.createRef();
  }

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  handleMenuItemClick = (event, index) => {
    this.setState({
      open: false,
      selectedIndex: index,
    });
    this.props.handleMenuItemClick(index);
  };
  handleClose = (event) => {
    if (
      this.anchorRef.current &&
      this.anchorRef.current.contains(event.target)
    ) {
      return;
    }

    this.setState({
      open: false,
    });
  };

  render() {
    const { open, selectedIndex } = this.state;
    const { disabled } = this.props;

    return (
      <>
        <ButtonGroup
          variant="contained"
          color="primary"
          ref={this.anchorRef}
          aria-label="split button"
        >
          <Button disabled={disabled}>Create Assignment</Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={this.handleToggle}
            disabled={disabled}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={this.anchorRef.current}
          role={undefined}
          transition
          disablePortal
          style={{ zIndex: 1000 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        disabled={index === 2}
                        selected={index === selectedIndex}
                        onClick={(event) =>
                          this.handleMenuItemClick(event, index)
                        }
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
}

export default dropDownButton;
