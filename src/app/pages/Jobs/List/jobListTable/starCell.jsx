import React, { Component } from 'react';
import Star from '@material-ui/icons/Star';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import { style } from '../../../../components/Tables/params';
import { connect } from 'react-redux';
import { updateCollect } from '../../../../../apn-sdk/newSearch';
import { debounce } from 'lodash';

class starCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFlag: props.data.favoriteFlag,
    };
  }

  onFavorite = debounce(function (e) {
    console.log(e.target.checked);
    this.setState({
      isFlag: !e.target.checked,
    });
    if (e.target.checked) {
      updateCollect(this.props.data.id, 'POST')
        .then((res) => {
          this.props.updateStar(this.props.data.id, e.target.checked);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            isFlag: e.target.checked,
          });
        });
    } else {
      updateCollect(this.props.data.id, 'DELETE')
        .then((res) => {
          this.props.updateStar(this.props.data.id, e.target.checked);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            isFlag: e.target.checked,
          });
        });
    }
  }, 300);

  render() {
    const { classes, data } = this.props;
    const { isFlag } = this.state;
    return (
      <Checkbox
        className={classes.checkbox}
        checkedIcon={<Star />}
        icon={<StarBorder />}
        checked={isFlag}
        onChange={(e) => this.onFavorite(e)}
        // disabled={!id}
        classes={{
          root: classes.favoriteRoot,
          checked: classes.favoriteChecked,
        }}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(style)(starCell));
