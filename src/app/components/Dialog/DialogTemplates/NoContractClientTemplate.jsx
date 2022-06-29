import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const styles = {
  root: {
    width: '450px',
  },
  MuiListItemGutters: {
    paddingLeft: '0px',
  },
};
class NoContractClientTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes, noContractClient, noContractClientCount } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="caption">
          {noContractClientCount} no contract client. Please go to the client
          page to upload a contract.
        </Typography>
        <List>
          {noContractClient.map((item, index) => {
            return (
              <ListItem key={index} className={classes.MuiListItemGutters}>
                <Link to={`/companies/detail/${item.id}/0`}>{item.name}</Link>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

function mapStoreStateToProps(state) {
  return {
    noContractClient: state.model.noContractClient.toJS(),
    noContractClientCount: state.model.noContractClient.size,
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(NoContractClientTemplate)
);
