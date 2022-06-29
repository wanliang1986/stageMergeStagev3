import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    paddingTop: '0px',
  },
};
class LinkCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, data, colDef } = this.props;

    return (
      <Link to={`/candidates/detail/${data._id}`} className={classes.link}>
        {data.fullName}
      </Link>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(style)(LinkCell));
