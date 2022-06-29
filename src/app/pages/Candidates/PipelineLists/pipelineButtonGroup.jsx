import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import { connect } from 'react-redux';
import {
  savePipelineTemplate,
  getMyPipelineTemplate,
  deletePipelineModule,
  getDict,
} from '../../../actions/myPipelineActions';
import * as ActionTypes from '../../../constants/actionTypes';
import { showErrorMessage, showSuccessMessage } from '../../../actions';

const options = [
  'Create a merge commit',
  'Squash and merge',
  'Rebase and merge',
];

const styles = {
  saveTemplatebox: {
    width: '230px',
    height: '150px',
    padding: '15px',
  },
};

class PipelineButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      noTemplateOpen: false,
      selectedIndex: -1,
      saveOpen: false,
      templateValue: null,
      selectTemplate: null,
    };
  }
  handleClick = () => {
    console.log('Save Current as Template');
    this.setState(
      {
        saveOpen: !this.state.saveOpen,
      },
      () => {
        if (this.state.open === true) {
          this.setState({
            open: false,
          });
        }
      }
    );
  };
  handleMenuItemClick = (event, index, option) => {
    let selectTemplate = JSON.parse(option.itemSortAll);

    this.setState(
      {
        selectedIndex: index,
        open: false,
        selectTemplate: option,
      },
      () => {
        this.props.dispatch({
          type: ActionTypes.RECEIVE_PIPELINE_TEMPLATE,
          template: selectTemplate,
        });
        this.props.getSelectTemplate(option);
      }
    );
  };
  handleToggle = () => {
    if (this.props.templateList.size === 0) {
      this.setState(
        {
          noTemplateOpen: !this.state.noTemplateOpen,
        },
        () => {
          if (this.state.saveOpen === true) {
            this.setState({
              saveOpen: false,
              open: false,
            });
          }
        }
      );
    } else {
      this.setState(
        {
          open: !this.state.open,
        },
        () => {
          if (this.state.saveOpen === true) {
            this.setState({
              saveOpen: false,
              noTemplateOpen: false,
            });
          }
        }
      );
    }
  };
  handleClose = (event) => {
    if (this.refs.buttonGroup && this.refs.buttonGroup.contains(event.target)) {
      return;
    }

    this.setState({
      open: false,
      saveOpen: false,
      noTemplateOpen: false,
    });
  };

  deleteTemplate = (option) => {
    let id = option.id;
    this.props.dispatch(deletePipelineModule(id)).then((res) => {
      if (res.response === 200) {
        this.setState({
          open: false,
        });
        this.props.dispatch(getMyPipelineTemplate());
        if (
          this.state.selectTemplate &&
          this.state.selectTemplate.itemSortAll ===
            JSON.stringify(this.props.columns)
        ) {
          this.props.dispatch(getDict());
        }
      }
    });
  };
  inputValue = (e) => {
    this.setState({
      templateValue: e.target.value,
    });
  };
  saveTemplate = () => {
    const { templateList } = this.props;
    if (templateList.size >= 10) {
      this.props.dispatch(
        showErrorMessage('The number of templates cannot exceed 10')
      );
      return;
    }
    let obj = {
      tempName: this.state.templateValue,
      itemSortAll: JSON.stringify(this.props.columns),
    };
    this.props.dispatch(savePipelineTemplate(obj)).then((res) => {
      if (res === 'OK') {
        this.setState(
          {
            saveOpen: false,
          },
          () => {
            this.setState({
              templateValue: null,
            });
            this.props.dispatch(
              showSuccessMessage('Template saved successfully')
            );
            this.props.dispatch(getMyPipelineTemplate());
          }
        );
      }
    });
  };
  render() {
    const { classes, templateList } = this.props;
    const { saveOpen, open, selectedIndex, templateValue, noTemplateOpen } =
      this.state;
    return (
      <>
        {/* {String(noTemplateOpen)} */}
        <ButtonGroup
          variant="contained"
          color="primary"
          ref="buttonGroup"
          aria-label="split button"
        >
          <Button
            variant="outlined"
            style={{ borderColor: 'none' }}
            aria-controls={saveOpen ? 'split-button-menu' : undefined}
            aria-expanded={saveOpen ? 'true' : undefined}
            onClick={this.handleClick}
          >
            Save Current as Template
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={this.handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={this.refs.buttonGroup}
          role={undefined}
          style={{ zIndex: 100 }}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'left top' : 'center bottom',
              }}
            >
              <Paper style={{ minWidth: '240px' }}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList id="split-button-menu">
                    {templateList.size > 0 &&
                      templateList.map((option, index) => (
                        <MenuItem
                          key={index}
                          selected={index === selectedIndex}
                        >
                          <div style={{ width: '100%', display: 'flex' }}>
                            <div
                              style={{ width: '75%', overflow: 'hidden' }}
                              onClick={(event) =>
                                this.handleMenuItemClick(event, index, option)
                              }
                            >
                              {option.tempName}
                            </div>
                            <div style={{ width: '25%', textAlign: 'right' }}>
                              <DeleteIcon
                                onClick={() => {
                                  this.deleteTemplate(option);
                                }}
                              />
                            </div>
                          </div>
                        </MenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Popper
          open={noTemplateOpen}
          anchorEl={this.refs.buttonGroup}
          role={undefined}
          style={{ zIndex: 100 }}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'left top' : 'center bottom',
              }}
            >
              <ClickAwayListener onClickAway={this.handleClose}>
                <Paper
                  style={{
                    minWidth: '240px',
                    height: '35px',
                    lineHeight: '35px',
                    textAlign: 'center',
                  }}
                >
                  No template
                </Paper>
              </ClickAwayListener>
            </Grow>
          )}
        </Popper>
        <Popper
          open={saveOpen}
          anchorEl={this.refs.buttonGroup}
          role={undefined}
          style={{ zIndex: 100, minWidth: '240px' }}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'left top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <div className={classes.saveTemplatebox}>
                    <Typography
                      variant="subtitle1"
                      style={{ textAlign: 'left' }}
                    >
                      Template Name
                    </Typography>
                    <TextField
                      size="small"
                      value={templateValue}
                      id="outlined-size-normal"
                      placeholder="Template A"
                      variant="outlined"
                      onChange={(e) => {
                        this.inputValue(e);
                      }}
                    />
                    <div style={{ width: '100%', marginTop: '20px' }}>
                      <Button
                        style={{ width: '100%' }}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          this.saveTemplate();
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
}

const mapStoreStateToProps = (state) => {
  let columns = state.controller.pipelineTemplate;
  let templateList = state.controller.pipelineTemplateList;
  console.log(templateList);
  return {
    columns: columns,
    templateList: templateList,
  };
};

export default connect(mapStoreStateToProps)(
  withStyles(styles)(PipelineButtonGroup)
);
