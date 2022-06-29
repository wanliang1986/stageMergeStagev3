import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import {
  JOB_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../../../constants/formOptions';
import { getTenantUserArray } from '../../../../../selectors/userSelector';
import { reduceStartCommissions } from '../../../../../../utils';

import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';
import StartCommissionsEdit from '../DialogForm/StartCommissions';

const styles = {
  root: {
    border: `solid 1px #e5e5e5`,
    borderRadius: 2,
  },
  actionContainer: {
    backgroundColor: `#fafafb`,
    minHeight: 40,
  },
  content: {
    padding: 12,
  },
};

class StartCommissions extends React.Component {
  state = {
    open: false,
  };

  renderCommission = (commission) => {
    const { userList, startCommissions } = this.props;
    const index = startCommissions.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.userRole}
              simpleValue
              options={userTypeOptions}
              autoBlur
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              valueKey="id"
              labelKey="fullName"
              value={commission.userId}
              simpleValue
              options={userList}
              autoBlur
              clearable={false}
              disabled
            />
          </FormReactSelectContainer>
        </div>
        <div className="small-4 columns">
          <FormInput
            name="commissions.commissionPct"
            value={commission.percentage}
            type="number"
            min={0}
            max={100}
            step={5}
            disabled
          />
        </div>
      </div>
    );
  };

  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  render() {
    const { open } = this.state;
    const { classes, t, startCommissions, positionType, start } = this.props;
    const { am, ac, dm, recruiter, sourcer, owner } =
      reduceStartCommissions(startCommissions);
    console.log(startCommissions);
    return (
      <div className={classes.root}>
        <div
          className={clsx(
            'flex-container align-middle align-justify item-padding',
            classes.actionContainer
          )}
        >
          <Typography variant="subtitle2">
            {t('common:User & Commission')}
          </Typography>
          <div className={'flex-child-auto'} />
          {/*{start.status==='ACTIVE'&&<SecondaryButton onClick={this.handleOpen} size="small">*/}
          {/*  {t('action:edit')}*/}
          {/*</SecondaryButton>}*/}
        </div>
        <div className={classes.content}>
          <div className="row expanded">
            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:userRole')} />
            </div>
            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:userName')} />
            </div>
            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:commissionSplit')} />
            </div>
          </div>
          <input
            type="hidden"
            name="startCommissions"
            value={startCommissions ? JSON.stringify(startCommissions) : ''}
          />

          {am.map((commission) => this.renderCommission(commission))}
          {ac.map((commission) => this.renderCommission(commission))}
          {dm.map((commission) => this.renderCommission(commission))}
          {recruiter.map((commission) => this.renderCommission(commission))}
          {sourcer.map((commission) => this.renderCommission(commission))}
          {owner.map((commission) => this.renderCommission(commission))}

          {positionType === JOB_TYPES.Payrolling && (
            <div className="columns" style={{ marginBottom: '0.75rem' }}>
              <Typography variant="caption" color="textSecondary">
                Note: Account Managers will share 40% evenly and Account
                Coordinators will share 30% evenly. At this stage, we only
                record AM and AC user role, however this will not affect other
                user roles’ final GM. HR department will record, calculate and
                allocate all other user roles’ GM.
              </Typography>
            </div>
          )}
        </div>
        <Dialog open={open} maxWidth="md">
          <StartCommissionsEdit
            t={t}
            start={start}
            startCommissions={start.startCommissions}
            onClose={this.handleClose}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userList: getTenantUserArray(state),
    currentUserId: state.controller.currentUser.get('id'),
  };
};
export default connect(mapStateToProps)(withStyles(styles)(StartCommissions));
