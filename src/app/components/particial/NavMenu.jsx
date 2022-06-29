/**
 * Created by leonardli on 5/7/17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import * as Colors from '../../styles/Colors/index';
import { LogoIcon } from './../Icons';

const styles = (theme) => ({
  root: {
    flex: '0 0 auto',
    overflow: 'visible',
    backgroundColor: Colors.BALTIC,
    width: 56,
    zIndex: 1200,
  },
  body: {
    overflow: 'hidden',
    width: 56,
    backgroundColor: Colors.BALTIC,
    height: '100%',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '&$isExpand': {
      width: 200,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        delay: 750,
      }),
    },
  },
  isExpand: {},
  logoContainer: {
    height: 48,
    padding: 12,
    width: 56,
  },
  listItem: {
    paddingLeft: 16,
    paddingRight: 16,
    '&:hover': {
      backgroundColor: Colors.EMPEROR,
    },
    '&$isSelected': {
      backgroundColor: Colors.BLACK,
    },
  },
  listText: {
    '& span': {
      color: Colors.GRAY,
      whiteSpace: 'nowrap',
    },
    '&$isSelected span': {
      color: Colors.GALLERY,
    },
  },
  listIcon: {
    '&$isSelected': {
      color: Colors.GALLERY,
    },
  },
  isSelected: {},
});

class Item extends React.PureComponent {
  handleClick = () => {
    const { value, onClick } = this.props;
    onClick(`/${value}`);
  };

  render() {
    const { classes, isActive, label, IconComponent } = this.props;
    return (
      <ListItem
        button
        className={clsx(classes.listItem, { [classes.isSelected]: isActive })}
        onClick={this.handleClick}
      >
        <ListItemIcon
          className={clsx(classes.listIcon, { [classes.isSelected]: isActive })}
        >
          <IconComponent />
        </ListItemIcon>
        <ListItemText
          primary={label}
          className={clsx(classes.listText, { [classes.isSelected]: isActive })}
        />
      </ListItem>
    );
  }
}

class Content extends React.PureComponent {
  render() {
    const { classes, menuItems, selectedIndex, handleMenuItemClick } =
      this.props;
    return (
      <React.Fragment>
        <div className={classes.logoContainer}>
          <LogoIcon />
        </div>
        {/*<Divider style={{backgroundColor:Colors.GRAY}} />*/}
        <List>
          {menuItems.map((item, index) => {
            const isActive = selectedIndex === index;
            if (item.label === 'divider') {
              return <Divider key={index} />;
            }

            return (
              <Item
                key={index}
                classes={classes}
                IconComponent={item.icon}
                onClick={handleMenuItemClick}
                value={item.key}
                isActive={isActive}
                label={item.label}
              />
            );
          })}
        </List>
      </React.Fragment>
    );
  }
}

class NavMenu extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isExpand: false,
    };
  }

  render() {
    const { classes, ...props } = this.props;
    return (
      <div
        className={classes.root}
        onMouseEnter={() => {
          this.setState({ isExpand: true });
        }}
        onMouseLeave={() => {
          this.setState({ isExpand: false });
        }}
      >
        <Paper
          className={clsx('flex-container flex-dir-column', classes.body, {
            [classes.isExpand]: this.state.isExpand,
          })}
        >
          <Content classes={classes} {...props} />
        </Paper>
      </div>
    );
  }
}

NavMenu.propTypes = {
  menuItems: PropTypes.array,
  selectedIndex: PropTypes.number,
};

export default withStyles(styles)(NavMenu);
