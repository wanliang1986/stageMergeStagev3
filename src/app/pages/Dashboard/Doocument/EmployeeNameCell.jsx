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
    };
  }
  componentDidMount() {
    console.log(this.props.data);
  }
  btnName = (data) => {
    console.log('data', data);
    let dataTalentId = data.talentId;
    this.props.history.push(`/candidates/detail/${dataTalentId}`);
  };
  render() {
    const { classes, data } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{ marginRight: '10px', color: '#3598dc' }}
          onClick={() => this.btnName(data)}
        >
          {data.employeeName ? data.employeeName : 'N/A'}
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
