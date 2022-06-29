import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as Colors from '../../styles/Colors/index';
import { LogoIcon } from './../Icons';

const useStyles = makeStyles((theme) => ({
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
      width: 300,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        delay: 250,
      }),
    },
    '& .MuiList-padding': {
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: 0,
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
  chilrenItem: {
    padding: '8px 16px 8px 70px',
    height: 48,
    lineHeight: '32px',
    color: '#8E8E8E',
    '&:hover': {
      backgroundColor: Colors.EMPEROR,
    },
    '&$isSelected': {
      backgroundColor: Colors.BLACK,
      color: '#EDEDED',
    },
  },
  listIcon: {
    '&$isSelected': {
      color: Colors.GALLERY,
    },
  },
  isSelected: {},

  nested: {
    display: 'block',
    // marginLeft: 56,
    '& .MuiTypography-root': {
      color: '#8E8E8E',
    },
  },
}));

const NavMenu = (props) => {
  const classes = useStyles();
  const [isExpand, setIsExpand] = useState(false);
  return (
    <div
      className={classes.root}
      onMouseEnter={() => {
        setIsExpand(true);
      }}
      onMouseLeave={() => {
        setIsExpand(false);
      }}
    >
      <Paper
        className={clsx('flex-container flex-dir-column', classes.body, {
          [classes.isExpand]: isExpand,
        })}
      >
        <Content classes={classes} isExpand={isExpand} {...props} />
      </Paper>
    </div>
  );
};

const Content = (props) => {
  const {
    classes,
    menuItems,
    handleMenuItemClick,
    isExpand,
    currentRoute,
    currentRouteStart,
  } = props;
  const isActive = (item) => {
    let flag = false;
    if (item.key == currentRouteStart) {
      flag = true;
    } else if (item.children) {
      item.children.map((child) => {
        if (child.key === currentRouteStart) {
          flag = true;
        } else if (child.children) {
          child.children.map((ele) => {
            if (ele.key.split('/')[0] === currentRouteStart) {
              flag = true;
            }
          });
        }
      });
    }
    return flag;
  };

  return (
    <React.Fragment>
      <div className={classes.logoContainer}>
        <LogoIcon />
      </div>
      <List>
        {menuItems.map((item, index) => {
          const isActiveFlag = isActive(item);
          if (item.children) {
            return (
              <Children
                item={item}
                key={index}
                IconComponent={item.icon}
                classes={classes}
                isExpand={isExpand}
                handleMenuItemClick={handleMenuItemClick}
                isActiveFlag={isActiveFlag}
                currentRoute={currentRoute}
                currentRouteStart={currentRouteStart}
              />
            );
          } else {
            return (
              <Item
                key={index}
                classes={classes}
                IconComponent={item.icon}
                handleMenuItemClick={handleMenuItemClick}
                value={item.key}
                label={item.label}
                isActiveFlag={isActiveFlag}
              />
            );
          }
        })}
      </List>
    </React.Fragment>
  );
};

const Children = (props) => {
  const {
    classes,
    item,
    isActiveFlag,
    IconComponent,
    handleMenuItemClick,
    isExpand,
    currentRoute,
    currentRouteStart,
  } = props;
  const url = window.location.pathname;
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!isExpand) {
      setOpen(isExpand);
    }
  }, [isExpand]);

  const handleClick = (item) => {
    const openflag = open == item.label ? null : item.label;
    setOpen(openflag);
  };

  return (
    <List
      style={{
        width: IconComponent ? '100%' : '112%',
        marginLeft: IconComponent ? '' : '-18px',
      }}
    >
      <ListItem
        button
        onClick={() => {
          handleClick(item);
        }}
        className={classes.listItem}
      >
        {/* icon */}
        <ListItemIcon
          className={clsx(classes.listIcon, {
            [classes.isSelected]: isActiveFlag,
          })}
        >
          {IconComponent ? <IconComponent /> : null}
        </ListItemIcon>

        {/* label */}
        <ListItemText
          primary={item.label}
          className={clsx(classes.listText, {
            [classes.isSelected]: isActiveFlag,
          })}
        />

        {open === item.label ? (
          <ExpandLess
            style={{ color: isActiveFlag ? ' #EDEDED' : '#8E8E8E' }}
          />
        ) : (
          <ExpandMore
            style={{ color: isActiveFlag ? ' #EDEDED' : '#8E8E8E' }}
          />
        )}
      </ListItem>

      {/* Children */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {item.children.map((element, index) => {
          if (element.children) {
            return (
              <ChildrenItem
                item={element}
                key={index}
                classes={classes}
                handleMenuItemClick={handleMenuItemClick}
                isActiveFlag={isActiveFlag}
                currentRoute={currentRoute}
                currentRouteStart={currentRouteStart}
              />
            );
          } else {
            return (
              <div
                key={element.label}
                onClick={() => {
                  handleMenuItemClick(`/${element.key}`);
                }}
                className={clsx(classes.chilrenItem, {
                  [classes.isSelected]:
                    isActiveFlag && url === `/${element.key}`,
                })}
              >
                {element.label}
              </div>
            );
          }
        })}
      </Collapse>
    </List>
  );
};

const ChildrenItem = (props) => {
  const {
    classes,
    item,
    IconComponent,
    handleMenuItemClick,
    currentRoute,
    currentRouteStart,
  } = props;
  const [open, setOpen] = useState(null);
  const flag = currentRouteStart === 'setting';

  const handleClick = (item) => {
    const openflag = open == item.label ? null : item.label;
    setOpen(openflag);
  };

  return (
    <List>
      <ListItem
        button
        onClick={() => {
          handleClick(item);
        }}
        className={classes.listItem}
      >
        {/* icon */}
        <ListItemIcon>{IconComponent ? <IconComponent /> : null}</ListItemIcon>

        {/* label */}
        <ListItemText
          primary={item.label}
          className={clsx(classes.listText, {
            [classes.isSelected]: flag,
          })}
        />

        {open === item.label ? (
          <ExpandLess style={{ color: flag ? ' #EDEDED' : '#8E8E8E' }} />
        ) : (
          <ExpandMore style={{ color: flag ? ' #EDEDED' : '#8E8E8E' }} />
        )}
      </ListItem>

      {/* Children */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {item.children.map((element) => {
          return (
            <div
              key={element.label}
              onClick={() => {
                handleMenuItemClick(`/${element.key}`);
              }}
              className={clsx(classes.chilrenItem, {
                [classes.isSelected]: currentRoute === `/${element.key}`,
              })}
            >
              {element.label}
            </div>
          );
        })}
      </Collapse>
    </List>
  );
};

const Item = (props) => {
  const {
    value,
    classes,
    isActiveFlag,
    label,
    IconComponent,
    handleMenuItemClick,
  } = props;

  const handleClick = () => {
    handleMenuItemClick(`/${value}`);
  };

  return (
    <ListItem
      button
      className={clsx(classes.listItem, { [classes.isSelected]: isActiveFlag })}
      onClick={handleClick}
    >
      {/* icon */}
      <ListItemIcon
        className={clsx(classes.listIcon, {
          [classes.isSelected]: isActiveFlag,
        })}
      >
        <IconComponent />
      </ListItemIcon>

      {/* label */}
      <ListItemText
        primary={label}
        className={clsx(classes.listText, {
          [classes.isSelected]: isActiveFlag,
        })}
      />
    </ListItem>
  );
};

function mapStoreStateToProps(state) {
  const currentRoute = state.router.location.pathname;
  const currentRouteStart = state.router.location.pathname.split('/')[1];
  return {
    currentRoute,
    currentRouteStart,
  };
}

export default connect(mapStoreStateToProps)(NavMenu);
