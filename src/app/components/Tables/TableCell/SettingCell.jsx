import React, { Component } from 'react';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import SettingsIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import * as ActionTypes from '../../../constants/actionTypes';
import { connect } from 'react-redux';
const style = {
  listBox: {
    padding: 15,
    maxHeight: '450px',
    overflowY: 'auto',
  },
};
class SettingCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      id: null,
      hardList: this.props.columns,
      arr: JSON.parse(JSON.stringify(this.props.columns)),
    };
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      id: 'simple-popover',
    });
  };

  handleClose = () => {
    console.log(123);
    let { arr } = this.state;
    this.setState({
      anchorEl: null,
      id: null,
      hardList: arr,
    });
    // this.forceUpdate();
  };

  changeCheck = (index) => {
    let { hardList } = this.state;
    // let _columns = JSON.parse(JSON.stringify(this.props.columns))
    hardList[index].showFlag = !hardList[index].showFlag;
    // this.props.onChangeHeader(hardList)
    this.setState({ hardList });
    // this.forceUpdate();
  };

  saveQuit = () => {
    let { hardList } = this.state;
    this.setState({
      anchorEl: null,
    });
    this.props.onChangeSetting(hardList);
  };

  handleDisable = (item) => {
    if (
      item?.labelCn == 'Name' ||
      item?.labelCn == 'Job Title' ||
      item?.labelCn == 'Status' ||
      item?.labelCn == 'Company'
    )
      return true;
  };

  render() {
    const { columns, classes } = this.props;
    const { anchorEl, id, hardList } = this.state;
    return (
      <div>
        <SettingsIcon
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            this.handleClick(e);
          }}
        />
        <Popover
          id={id}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={(e) => {
            this.handleClose(e);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.listBox}>
            {Array.isArray(hardList) &&
              hardList.map((item, index) => {
                return (
                  <div key={index}>
                    <Checkbox
                      color="primary"
                      className={classes.checkbox}
                      disabled={this.handleDisable(item)}
                      checked={item.showFlag}
                      onChange={(e) => this.changeCheck(index)}
                    />
                    <span>{item.labelCn}</span>
                  </div>
                );
              })}
          </div>
          <div
            style={{
              minWidth: 120,
              display: 'flex',
              justifyContnet: 'cneter',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <PrimaryButton
              type="submit"
              style={{
                minWidth: 120,
                marginBottom: 10,
              }}
              processing={this.state.creating}
              onClick={this.saveQuit}
            >
              Save
            </PrimaryButton>
          </div>
        </Popover>
      </div>
    );
  }
}

const mapStoreStateToProps = (state) => {
  let columns = state.controller.pipelineTemplate;
  return {
    columns: columns,
  };
};

export default connect(mapStoreStateToProps)(withStyles(style)(SettingCell));
