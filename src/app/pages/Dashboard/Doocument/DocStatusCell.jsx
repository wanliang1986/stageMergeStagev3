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
    let a = this.props.data?.documentStatus || '';
    a = a?.toLowerCase();
    var name = a.charAt(0)?.toUpperCase() + a?.slice(1);
    console.log('name', name);
    this.setState({
      str: name,
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
