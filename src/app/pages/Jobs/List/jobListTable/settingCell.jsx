import React, { Component } from 'react';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import SettingsIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
const style = {
  listBox: {
    padding: 20,
    maxHeight: '400px',
    overflowY: 'auto',
    position: 'relative',
    paddingTop: 0,
  },
};
class settingCell extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      id: null,
      hardList: props.headerList,
      arr: JSON.parse(JSON.stringify(props.headerList)),
    };
  }

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      id: 'simple-popover',
    });
  };

  handleClose = () => {
    let { arr } = this.state;
    this.setState({
      anchorEl: null,
      id: null,
      hardList: JSON.parse(JSON.stringify(arr)),
    });
    this.forceUpdate();
  };

  changeCheck = (index) => {
    let { hardList } = this.state;
    hardList[index].showFlag = !hardList[index].showFlag;
    // this.props.onChangeHeader(hardList)
    // this.setState({ hardList });
    this.forceUpdate();
  };

  saveQuit = () => {
    let { hardList } = this.state;
    this.setState({
      anchorEl: null,
      arr: hardList,
    });
    this.props.onChangeSetting(hardList);
  };

  handleDisable = (item) => {
    // if (
    //   item?.label == 'Job Title' ||
    //   item?.label == 'Company' ||
    //   item?.label == 'Account Manager'
    // )
    //   return true;
  };

  render() {
    const { classes } = this.props;
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
            {hardList.map((item, index) => {
              return index == 0 ? null : (
                <div key={index}>
                  <Checkbox
                    color="primary"
                    className={classes.checkbox}
                    disabled={this.handleDisable(item)}
                    checked={item.showFlag}
                    onChange={(e) => this.changeCheck(index)}
                  />
                  <span>{item.label}</span>
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
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <PrimaryButton
              type="submit"
              style={{
                minWidth: 100,
                marginBottom: 5,
              }}
              processing={this.state.creating}
              onClick={this.saveQuit}
            >
              save
            </PrimaryButton>
          </div>
        </Popover>
      </div>
    );
  }
}

export default withStyles(style)(settingCell);
