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
class CompanyNameTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes, CompanyNameList, CompanyNameListCount } = this.props;
    console.log(CompanyNameList);
    return (
      <div className={classes.root}>
        <Typography variant="caption">
          We found {CompanyNameListCount} similar clients/prospects.You may
          click the link and edit on the company page.
        </Typography>
        <List>
          {CompanyNameList
            ? CompanyNameList.map((item, index) => {
                let type = item.type === 'POTENTIAL_CLIENT' ? 1 : 0;
                return (
                  <ListItem key={index} className={classes.MuiListItemGutters}>
                    <Link to={`/companies/detail/${item.prospectId}/${type}`}>
                      {item.name}
                    </Link>
                  </ListItem>
                );
              })
            : ''}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(CompanyNameTemplate);
