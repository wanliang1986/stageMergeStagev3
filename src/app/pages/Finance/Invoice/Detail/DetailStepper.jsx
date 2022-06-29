import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { getInvoiceActivitiesByInvoiceId } from '../../../../selectors/invoiceSelector';
import clsx from 'clsx';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepConnector from '@material-ui/core/StepConnector';
import StepLabel from '@material-ui/core/StepLabel';
import StepButton from '@material-ui/core/StepButton';
import StepIcon from '@material-ui/core/StepIcon';
import Typography from '@material-ui/core/Typography';

import CompleteIcon from '@material-ui/icons/Check';

import StepperController1 from './StepperController/StepperController1';
import StepperController3 from './StepperController/StepperController3';

const styles = (theme) => ({
  root: {
    position: 'relative',
  },
  stepper: {
    width: 550,
    transform: 'translateX(-15%)',
  },
  voidLabel: {
    color: '#f26d54',
    fontSize: 80,
    position: 'absolute',
    bottom: 50,
    left: `33%`,
    opacity: 0.58,
    transform: `rotateZ(-30deg)`,
  },
  disabledLabel: {
    opacity: 0.6,
  },
});

const StyledConnector = withStyles({
  alternativeLabel: {
    top: 19,
    left: 'calc(-50% + 22px)',
    right: 'calc(50% + 22px)',
  },
  active: {
    '& $line': {
      borderColor: '#56d18c',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#56d18c',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 2,
    borderRadius: 1,
  },
})(StepConnector);

const useCustomStepIconStyles = makeStyles({
  root: {
    zIndex: 1,
    width: 40,
    height: 40,
    '&$active': {
      color: '#46CC7F',
    },
    '&$completed': {
      color: '#79D9A1',
    },
  },
  completedIcon: {
    color: '#37c771',
    boxSizing: 'border-box',
    border: '2px solid',
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(134, 240, 178, 0.22)',
    '&$disabled': {
      color: '#8c8c8c',
      backgroundColor: `rgba(196, 196, 196, 0.42)`,
    },
  },
  active: {},
  completed: {},
  disabled: {},
});

function CustomStepIcon(props) {
  const classes = useCustomStepIconStyles();
  console.log(props);

  if (props.completed) {
    return (
      <div
        className={clsx(classes.root, classes.completedIcon, {
          [classes.disabled]: props.disabled,
        })}
      >
        <CompleteIcon />
      </div>
    );
  }

  return <StepIcon {...props} classes={classes} />;
}

class DetailStepper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: props.voidActivity ? 0 : 1,
      appearFrom: '',
    };
  }

  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS
  ) {
    if (this.props.voidActivity && this.state.activeStep !== 0) {
      this.setState({ activeStep: 0 });
    }
  }

  showClickBack = (index) => {
    let currentIndex = this.state.activeStep;
    let appearFrom = '';
    if (currentIndex < index) {
      appearFrom = 'left';
    } else if (currentIndex > index) {
      appearFrom = 'right';
    }
    this.setState({
      activeStep: index,
      appearFrom,
    });
  };

  getSteps = () => {
    const { t, createActivity, paidActivities } = this.props;
    return [
      {
        label: t('tab:Create'),
        activity: createActivity,
      },
      {
        label: t('tab:Get Paid'),
        activity: paidActivities.size > 0,
      },
    ];
  };

  render() {
    // console.log('params',params);
    const {
      classes,
      invoice,
      activities,
      createActivity,
      paidActivities,
      creditActivity,
      voidActivity,
      props,
      t,
    } = this.props;
    console.log('sssclass', activities.toJS());
    const { appearFrom, activeStep } = this.state;
    const steps = this.getSteps();

    return (
      <div className={classes.root}>
        <Stepper
          activeStep={activeStep}
          nonLinear
          alternativeLabel
          className={classes.stepper}
          connector={<StyledConnector />}
        >
          {steps.map(({ label, activity }, index) => {
            return (
              <Step
                key={label}
                completed={Boolean(activity)}
                disabled={!!voidActivity}
              >
                <StepButton onClick={() => this.showClickBack(index)}>
                  <StepLabel
                    StepIconComponent={CustomStepIcon}
                    className={clsx({
                      [classes.disabledLabel]: !!voidActivity,
                    })}
                    StepIconProps={{ disabled: !!voidActivity }}
                  >
                    <Typography variant="subtitle2">{label}</Typography>
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === 0 && (
          <StepperController1
            data={createActivity}
            appearFrom={appearFrom}
            voidActivity={voidActivity}
          />
        )}

        {activeStep === 1 && (
          <StepperController3
            paidActivities={paidActivities}
            creditActivity={creditActivity}
            appearFrom={appearFrom}
            invoice={invoice}
            {...props}
          />
        )}
        {voidActivity && (
          <div className={classes.voidLabel}>
            <Typography
              variant="h6"
              color="inherit"
              style={{ fontSize: 'inherit', fontWeight: 'bold' }}
            >
              {t('tab:VOID')}
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, { invoice }) => {
  const activities = getInvoiceActivitiesByInvoiceId(state, invoice.get('id'));
  return {
    activities,
    createActivity: activities.find(
      (a) => a.get('invoiceActivityType') === 'CREATE'
    ),
    paidActivities: activities.filter(
      (a) => a.get('invoiceActivityType') === 'PAYMENT'
    ),
    creditActivity: activities.find(
      (a) => a.get('invoiceActivityType') === 'CREDIT_APPLY'
    ),
    voidActivity: activities.find(
      (a) => a.get('invoiceActivityType') === 'VOID'
    ),
  };
};

export default connect(mapStateToProps)(withStyles(styles)(DetailStepper));
