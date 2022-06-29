import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Loading from '../../../../components/particial/Loading';

const styles = {
  root: {
    border: 'solid 1px rgba(0, 0, 0, 0.15)',
    flex: 1,
    height: 274,
    minWidth: 320,
    overflow: 'auto',
  },
  title: {
    backgroundColor: '#fafafa',
    
    fontSize: '14px',
    color: '#505050',
    fontWeight: '500',
    lineHeight: 1.57,
    marginBottom: '16px',
    width: '100%',
    height: 44,
    padding: '11px 14px',
  },
  documentName: {
    
    fontSize: '14px',
    color: '#3598dc',
    lineHeight: 1.57,
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginTop: '8px',
  },
  documentList: {
    display: 'flex',
    cursor: 'pointer',
  },
};
class DocumentsPackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  openS3Link = (item) => {
    this.props.openS3LinkDialog(item);
  };

  render() {
    const {} = this.state;
    const { classes, packageList, packageName, checked, loading } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.title}>Package Name：{packageName}</div>
        {loading ? (
          <Loading />
        ) : (
          <div className={classes.list}>
            {packageList.map((item) => {
              return (
                <div className={classes.documentList} key={item.name}>
                  <Checkbox
                    onClick={() => {
                      checked(item);
                    }}
                    checked={!item.checked}
                    disabled={item.mandatory}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                  <Tooltip title={item.name} placement="top-start">
                    <div
                      className={classes.documentName}
                      onClick={() => {
                        this.openS3Link(item);
                      }}
                    >
                      {item.name}
                    </div>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  return {};
}
export default connect(mapStoreStateToProps)(
  withStyles(styles)(DocumentsPackageList)
);
