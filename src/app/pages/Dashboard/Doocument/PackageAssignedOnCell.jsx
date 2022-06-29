import React, { Component, useState } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    paddingTop: '0px',
    marginRight: '10px',
  },
};

class EmployeeNameCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
      str: '',
    };
  }
  componentDidMount() {
    console.log(this.props.data);
    let dataTime = this.props.data.packageAssignedOn;
    let str = dataTime?.substring(0, dataTime.indexOf('T'));
    this.setState({
      str,
    });
  }
  btnName = (data) => {};
  render() {
    const { classes, data } = this.props;
    const { str } = this.state;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '10px' }} onClick={() => this.btnName(data)}>
          {str ? str : 'N/A'}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commonPoolList: state.controller.newCandidateJob,
  };
};

export default withRouter(
  connect(mapStateToProps)(withStyles(style)(EmployeeNameCell))
);
