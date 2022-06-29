import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { dateFormat2 } from '../../../../../../utils';
import * as Color from '../../../../../styles/Colors';

const styles = {
  wrapper: {
    padding: '20px',
    backgroundColor: '#FDFDFD',
    margin: '20px 24px',
    position: 'relative',
    border: '1px solid transparent',
    borderColor: Color.GALLERY,
    borderRadius: '5px',
    '&::before, &::after': {
      bottom: '100%',
      left: '5.8%',
      border: '1px solid transparent',
      content: '""',
      height: 0,
      width: 0,
      position: 'absolute',
    },
    '&::after': {
      borderBottomColor: '#FDFDFD',
      borderWidth: '15px',
      borderBottomWidth: '23px',
      marginLeft: '-15px',
    },
    '&::before': {
      borderBottomColor: Color.GALLERY,
      borderWidth: '17px',
      borderBottomWidth: '25px',
      marginLeft: '-17px',
    },
    transition: 'transform 0.3s ease-out',
  },
};

class StepperController1 extends Component {
  constructor(props) {
    super(props);

    // console.log('[first stepper]',this.props.appearFrom);
    let transform = { transform: 'translateX(0)' };
    if (this.props.appearFrom === 'left') {
      transform = { transform: 'translateX(100vw)' };
    } else if (this.props.appearFrom === 'right') {
      transform = { transform: 'translateX(-100vw)' };
    }
    this.state = {
      transform: transform,
    };
  }

  componentDidMount() {
    this.timerId = setTimeout(() => {
      this.setState({ transform: { transform: 'translateX(0)' } });
    }, 1);
  }

  componentWillUnmount() {
    clearTimeout(this.timerId);
  }

  render() {
    const { classes, data } = this.props;
    if (!data) {
      return null;
    }

    return (
      <Fragment>
        <section className={classes.wrapper} style={this.state.transform}>
          <Typography
            variant="h6"
            style={{ fontWeight: '400' }}
            className={classes.headerColumn}
          >
            Create
            <Typography style={{ marginTop: '8px' }}>
              This invoice is created by {data.get('userFullName')} on{' '}
              {dateFormat2(data.get('createdDate'))}
            </Typography>
          </Typography>
        </section>
      </Fragment>
    );
  }
}

export default withStyles(styles)(StepperController1);
