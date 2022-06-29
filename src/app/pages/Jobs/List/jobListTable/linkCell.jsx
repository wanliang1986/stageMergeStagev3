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
};
class LinkCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, data, colDef } = this.props;

    if (colDef.headerName == 'Company') {
      return (
        <Link className="job-link" to={`/companies/detail/${data.companyId}/0`}>
          {data.companyName}
        </Link>
      );
    }

    return (
      <Link className="job-link" to={`/jobs/detail/${data.id}`}>
        {data.title}
      </Link>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(style)(LinkCell));
