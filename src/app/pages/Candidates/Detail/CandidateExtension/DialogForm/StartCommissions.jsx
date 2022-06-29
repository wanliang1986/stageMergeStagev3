import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import {
  USER_TYPES,
  userTypeForCommission as userTypeOptions,
} from '../../../../../constants/formOptions';
import { getTenantUserArray } from '../../../../../selectors/userSelector';
import { reduceStartCommissions } from '../../../../../../utils';

import Select from 'react-select';
import IconButton from '@material-ui/core/IconButton';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';

import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormInput from '../../../../../components/particial/FormInput';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import CustomToggleButton from '../../../../../components/particial/CustomToggleButton';
import { DateRangePicker } from 'rsuite';
import { withStyles } from '@material-ui/core/styles';
import dateFns from 'date-fns';

const styles = (theme) => ({
  root: {
    minWidth: 660,
    '& $dateCalendarMenu': {
      zIndex: theme.zIndex.tooltip,
    },
  },
  dateCalendarMenu: {
    zIndex: `${theme.zIndex.tooltip} !important`,
  },
});
class StartCommissions extends React.Component {
  constructor(props) {
    super();
    this.state = {
      startCommissions: props.startCommissions,
      errorMessage: Immutable.Map(),
    };
  }

  handleSubmit = () => {};

  renderAMCommission = (commission, size) => {
    console.log(size);
    const { classes, userList, start } = this.props;
    const { startCommissions, errorMessage } = this.state;
    const index = startCommissions.indexOf(commission);

    return (
      <div key={index} className="row expanded">
        <div className="columns" style={{ minWidth: 230 }}>
          <DateRangePicker
            value={[
              new Date(commission.periodStartDate || start.startDate),
              new Date(commission.periodEndDate || start.endDate),
            ]}
            ranges={[]}
            cleanable={false}
            toggleComponentClass={CustomToggleButton}
            disabledDate={(date) =>
              dateFns.isAfter(date, new Date(start.endDate)) ||
              dateFns.isBefore(date, new Date(start.startDate))
            }
            menuClassName={classes.dateCalendarMenu}
            size="sm"
            style={{ height: 32, fontSize: 12 }}
            block
            onChange={(range) => {
              console.log(range);
            }}
            format={'MM/DD/YYYY'}
          />
        </div>
        <div className="columns">
          <FormReactSelectContainer>
            <Select
              valueKey="id"
              labelKey="fullName"
              value={commission.userId}
              onChange={(userId) => {
                commission.userId = userId || commission.userId;
                this.setState({ startCommissions: startCommissions.slice() });
              }}
              simpleValue
              options={userList}
              autoBlur
              clearable={false}
            />
          </FormReactSelectContainer>
        </div>

        <div className="columns flex-container">
          <div className="flex-child-auto">
            <FormInput
              name="commissions.commissionPct"
              value={commission.percentage}
              onChange={(e) => {
                commission.percentage = e.target.value;
                this.setState({ startCommissions: startCommissions.slice() });
              }}
              type="number"
              min={0}
              max={100}
              step={5}
              errorMessage={errorMessage.get('commissions') && true}
            />
          </div>
          <div className="flex-container align-self-top">
            <IconButton
              size="small"
              disabled={size <= 1}
              onClick={() => {
                this.setState({
                  startCommissions: startCommissions.filter(
                    (c) => c !== commission
                  ),
                });
              }}
            >
              <Delete />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                startCommissions.push({
                  userId: commission.userId,
                  userRole: USER_TYPES.AM,
                  percentage: commission.percentage || 0,
                });
                this.setState({ startCommissions: startCommissions.slice() });
              }}
            >
              <Add />
            </IconButton>
          </div>
        </div>
      </div>
    );
  };
  renderCommission = (commission) => {
    const { userList } = this.props;
    const { startCommissions } = this.state;
    const index = startCommissions.indexOf(commission);
    return (
      <div key={index} className="row expanded">
        <div className="columns" style={{ minWidth: 230 }}>
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
        <div className="columns">
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
        <div className="columns">
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

  handleCancel = () => this.props.onClose();

  render() {
    const { startCommissions, errorMessage } = this.state;
    const { t, classes } = this.props;
    const { am, ac, dm, recruiter, sourcer, owner } =
      reduceStartCommissions(startCommissions);
    return (
      <>
        <DialogTitle>{t('common:Edit User & Commission')}</DialogTitle>
        <DialogContent className={classes.root}>
          <div className="row expanded">
            <div className="columns" style={{ minWidth: 230 }}>
              <FormReactSelectContainer label={t('field:Period')} />
            </div>
            <div className="columns">
              <FormReactSelectContainer label={t('field:AM Name')} />
            </div>
            <div className="columns">
              <FormReactSelectContainer label={t('field:commissionSplit')} />
            </div>
          </div>

          {am.map((commission) =>
            this.renderAMCommission(commission, am.length)
          )}

          {errorMessage.get('commissions') && (
            <div className="columns" style={{ marginTop: 4 }}>
              <div className="foundation">
                <span className="form-error is-visible">
                  {errorMessage.get('commissions')}
                </span>
              </div>
            </div>
          )}
          {errorMessage.get('commissionPct') && (
            <div className="columns" style={{ marginTop: 4 }}>
              <div className="foundation">
                <span className="form-error is-visible">
                  {errorMessage.get('commissionPct')}
                </span>
              </div>
            </div>
          )}

          {startCommissions.length - am.length > 0 && (
            <div className="row expanded">
              <div className=" columns" style={{ minWidth: 230 }}>
                <FormReactSelectContainer label={t('field:userRole')} />
              </div>
              <div className="columns">
                <FormReactSelectContainer label={t('field:userName')} />
              </div>
              <div className="columns">
                <FormReactSelectContainer label={t('field:commissionSplit')} />
              </div>
            </div>
          )}

          {ac.map((commission) => this.renderCommission(commission))}
          {dm.map((commission) => this.renderCommission(commission))}
          {recruiter.map((commission) => this.renderCommission(commission))}
          {sourcer.map((commission) => this.renderCommission(commission))}
          {owner.map((commission) => this.renderCommission(commission))}
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleCancel}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton onClick={this.handleSubmit}>
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
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
