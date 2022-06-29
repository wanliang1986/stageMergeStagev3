import React from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import {
  jobType as newJobType,
  getJobTypeLabel,
} from '../../../../constants/formOptions';

import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import UploadJobDescription from './UploadJobDescription';

import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { getColumns, saveColumns } from '../../../../../apn-sdk';
import { showErrorMessage } from '../../../../actions';
import { connect } from 'react-redux';
import Loading from '../../../../components/particial/Loading';

const styles = (theme) => ({
  tooltip: {
    boxShadow: theme.shadows[2],
    backgroundColor: '#ffffff',
    padding: 0,
    maxWidth: 220,
  },
  loading: {
    '& .root': {
      padding: 0,
      height: '30px !important',
    },
    '& .MuiCircularProgress-root': {
      height: '30px !important',
      width: '30px !important',
    },
    '& .container-padding': {
      height: '30px !important',
    },
  },
});

class CreateJobButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      dialogOpen: false,
      jobType: null,
      menuList: [],
      showBtnType: null,
      open: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.getType();
  }
  getRemainJobType = (data) => {
    let { menuList } = this.state;
    let list = [...newJobType];
    let delIndex = null;
    list.map((item, index) => {
      if (data == item.value) {
        delIndex = index;
        this.setState({
          showBtnType: item,
        });
      }
    });
    list.splice(delIndex, 1);
    this.setState({
      menuList: list,
    });
  };

  //获取header数据
  getType = () => {
    const { dispatch } = this.props;
    let { menuList } = this.state;
    this.setState({
      loading: true,
    });
    getColumns()
      .then(({ response }) => {
        const { creationType = null } = response;
        if (!creationType) {
          this.getRemainJobType(newJobType[0].value);
        } else {
          this.getRemainJobType(creationType.jobType);
        }
      })
      .catch((err) => dispatch(showErrorMessage(err)))
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  handleMenuItemClick = (data) => {
    this.setState({
      dialogOpen: true,
      jobType: data.value,
    });
  };

  render() {
    const {
      dialogOpen,
      jobType,
      showBtnType,
      menuList,
      open,
      anchorEl,
      loading,
    } = this.state;
    const { t, classes, ...props } = this.props;
    if (loading) {
      return (
        <div className={classes.loading}>
          <Loading />
        </div>
      );
    }
    return (
      <>
        <ButtonGroup
          variant="contained"
          aria-label="split button"
          color="primary"
        >
          <Button
            size="small"
            color="primary"
            disableRipple
            style={{ minWidth: 60 }}
            onClick={() => {
              this.handleMenuItemClick(showBtnType);
            }}
          >
            Create Job - {showBtnType && showBtnType.label}
          </Button>

          <Button
            color="primary"
            size="small"
            style={{ padding: '0 4px', minWidth: 0 }}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={(e) =>
              this.setState({
                anchorEl: e.currentTarget.parentElement,
                open: true,
              })
            }
          >
            <ArrowDropDownIcon fontSize="small" />
          </Button>
        </ButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorEl}
          transition
          placement={'bottom-start'}
        >
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <ClickAwayListener
                  onClickAway={() => this.setState({ open: false })}
                >
                  <MenuList dense disablePadding style={{ width: 200 }}>
                    {/* //根据el来判断 展示list */}
                    {menuList.map((item, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => this.handleMenuItemClick(item)}
                      >
                        {item.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <Dialog open={dialogOpen} maxWidth="md">
          <UploadJobDescription
            {...props}
            t={t}
            jobType={jobType}
            onClose={() => this.setState({ dialogOpen: false })}
          />
        </Dialog>
      </>
    );
  }
}

export default connect()(withStyles(styles)(CreateJobButton));
