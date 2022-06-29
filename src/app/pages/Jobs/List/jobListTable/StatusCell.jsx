import React from 'react';
import { ADD_MESSAGE } from '../../../../constants/actionTypes';
import { connect } from 'react-redux';
import { changeStatus } from '../../../../../apn-sdk/newSearch';
import withStyles from '@material-ui/core/styles/withStyles';
import { jobStatus } from '../../../../constants/formOptions';
import clsx from 'clsx';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import EditIcon from '@material-ui/icons/Edit';

import Loading from '../../../../components/particial/Loading';

const statusLabels = jobStatus.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
  statusBtn: {
    padding: '1px 4px',
    borderRadius: '10.5px',
    color: '#fff',
    // backgroundColor: '#3398dc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: 100,
    margin: 'auto',
    marginTop: '8px',
  },
};
class StatusCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      anchorEl: null,
      status: props.data && props.data.status,
      loading: false,
    };
  }

  handleClosePop = () => {
    this.setState({
      open: false,
      anchorEl: null,
    });
  };

  handleOpen = (e) => {
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  };

  handleSelect = (value) => {
    const { status } = this.state;
    this.setState({
      status: value,
      open: false,
      anchorEl: null,
      loading: true,
    });
    changeStatus(this.props.data.id, value)
      .then((res) => {
        this.setState({
          status: value,
        });
        this.props.updateStatus(this.props.data.id, value);
      })
      .catch((err) => {
        this.setState({
          status: status,
          open: false,
          anchorEl: null,
        });
        if (err?.message) {
          this.props.dispatch({
            type: ADD_MESSAGE,
            message: {
              message: err.message,
              type: 'error',
            },
          });
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };
  getColor = () => {
    const { status } = this.state;
    switch (status) {
      case 'OPEN':
        return '#3398DC';
        break;
      case 'REOPENED':
        return '#21B66E';
        break;
      case 'FILLED':
        return '#F56D50';
        break;
      case 'CLOSED':
      case 'CANCELLED':
        return '#BDBDBD';
        break;
      case 'ONHOLD':
        return '#FDAB29';
        break;
      default:
        return '#3398DC';
        break;
    }
  };

  render() {
    const { classes, data } = this.props;
    const { anchorEl, open, status, loading } = this.state;
    if (loading) {
      return (
        <div
          className={classes.loading}
          style={{ width: '100%', height: '30px' }}
        >
          <Loading />
        </div>
      );
    }
    if (!status) {
      return <span />;
    }
    return (
      <div>
        <div
          onClick={this.handleOpen}
          className={classes.statusBtn}
          style={{
            backgroundColor: this.getColor(),
          }}
        >
          <p style={{ marginRight: 4 }}>{statusLabels[status] || status}</p>
          <EditIcon style={{ color: '#fff', fontSize: 15 }} />
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={this.handleClosePop}
        >
          <MenuList dense>
            {jobStatus
              .filter((_item) => _item.value !== status && !_item.disabled)
              .map((item) => {
                return (
                  <MenuItem
                    dense
                    key={item.value}
                    onClick={() => this.handleSelect(item.value)}
                  >
                    {item.label}
                  </MenuItem>
                );
              })}
          </MenuList>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(style)(StatusCell));
