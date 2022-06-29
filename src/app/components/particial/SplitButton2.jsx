import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { getApplicationStatusByCurrentStatus } from '../../constants/formOptions';

const styles = {
  rightButton: {
    border: 'solid 1px #f56d50',
    color: '#f56d50',
    backgroundColor: 'white',
    height: '36px',
  },
  disabledButton: {
    height: '36px',
  },
};

class SplitButton2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorRef: null,
      open: false,
      application_state: null,
      delayHide: false,
      step: {
        allOptions: [],
      },
    };
  }

  hideDom = () => {
    const { step } = this.state;
    if (step.allOptions.length <= 0) {
      // ReactDOM.unmountComponentAtNode(document.getElementById('buttonDom'));
      let buttonDom = document.getElementById('buttonDom');
      buttonDom.innerHTML = '';
    }
  };

  splitApplicationStatus = (application) => {
    const { step } = this.state;
    const applicationStatusOptions = getApplicationStatusByCurrentStatus(
      application.status
    );
    let allOptions = [];
    let OptionsObj = {};

    for (let i = 0; i < applicationStatusOptions.length; i++) {
      let OptionItem = applicationStatusOptions[i];
      // 只需要拒绝的
      if (
        OptionItem.value === 'Internal_Rejected' ||
        OptionItem.value === 'Client_Rejected' ||
        OptionItem.value === 'Candidate_Quit'
      ) {
        allOptions.push(OptionItem);
        OptionsObj[OptionItem.value] = OptionItem.label;
      }
    }

    const newStep = Object.assign({}, step, { allOptions });
    this.setState(
      {
        step: newStep,
      },
      () => {
        this.hideDom();
      }
    );

    console.log('当前组件显示的可以选的全部的选项');
    console.log(allOptions);
  };
  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };
  handleClose = (event) => {
    const { anchorRef } = this.state;
    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }
    this.setState({
      open: false,
    });
  };
  handleMenuItemClick = (status) => {
    this.setState({
      open: false,
    });
    this.props.openAddDialog(status);
  };
  render() {
    const { open, anchorRef, step, application_state } = this.state;
    let iconDrop = false;
    if (open && step.allOptions.length > 0) {
      iconDrop = true;
    }
    return (
      <div id="buttonDom">
        <div>
          <ButtonGroup
            variant="contained"
            color="primary"
            ref="anchorRef"
            aria-label="split button"
            disableElevation
          >
            <Button
              style={
                step.allOptions.length > 0
                  ? styles.rightButton
                  : styles.disabledButton
              }
              color="primary"
              size="small"
              aria-controls={open ? 'split-button-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={this.handleToggle}
              disabled={step.allOptions.length > 0 ? false : true}
            >
              {step.allOptions.length > 0
                ? 'Rejected By'
                : "It's impossible to refuse"}

              {iconDrop ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </Button>
          </ButtonGroup>

          {/* 下拉框内容 */}
          <Popper
            open={open}
            anchorEl={anchorRef}
            role={undefined}
            transition
            disablePortal
            placement="bottom-end"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center bottom' : 'center top',
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList id="split-button-menu" dense>
                      {step.allOptions.length > 0 &&
                        step.allOptions.map((option, index) => (
                          <MenuItem
                            key={option.value}
                            selected={option.value === application_state.status}
                            onClick={() =>
                              this.handleMenuItemClick(option.value)
                            }
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
  componentDidMount() {
    const applicationTOJS = this.props.application.toJS();

    this.setState({
      anchorRef: this.refs.anchorRef,
    });
    if (applicationTOJS) {
      this.setState({
        application_state: applicationTOJS,
      });
      this.splitApplicationStatus(applicationTOJS);
    }
  }
  componentWillReceiveProps(nextProps) {
    const newApplicationTOJS = nextProps.application.toJS();
    const { application_state } = this.state;
    if (application_state.status !== newApplicationTOJS.status) {
      this.setState({
        application_state: newApplicationTOJS,
      });
      this.splitApplicationStatus(newApplicationTOJS);
    }
  }
}

export default SplitButton2;
