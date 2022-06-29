import React from 'react';
import { connect } from 'react-redux';
import { makeCancelable } from '../../../../utils';
import { getApplicationCommissions } from '../../../../apn-sdk';
import { ADD_SEND_EMAIL_REQUEST } from '../../../constants/actionTypes';
import {
  applicationStatus,
  SEND_EMAIL_TYPES,
  USER_TYPES,
} from '../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';

import Email from '@material-ui/icons/Email';

import UpdateApplicationCommissions from '../forms/UpdateApplicationCommissions';
import UpdateApplicationUserRoles from '../forms/UpdateApplicationUserRoles';
import PotentialButton from '../../particial/PotentialButton';

class ApplicationCommission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commissions: [],
      canEdit: false,
      openEdit: false,
    };
  }

  componentDidMount(): void {
    const { application, currentUserId } = this.props;
    this.commissionTask = makeCancelable(
      getApplicationCommissions(application.get('id'))
    );
    this.commissionTask.promise.then(({ response }) => {
      this.props.onCommissionsUpdate(response);
      this.setState({
        commissions: response,
        canEdit: !!response.find((c) => c.userId === currentUserId),
      });
    });
  }

  handleCommissionsUpdate = (commissions) => {
    this.props.onCommissionsUpdate(commissions);
    this.setState({
      commissions: commissions,
      canEdit: !!commissions.find((c) => c.userId === this.props.currentUserId),
    });
  };

  handleSendEmailToAM = () => {
    const { dispatch, application } = this.props;
    const { commissions } = this.state;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToAM,
        data: {
          application: Object.assign({}, application.toJS(), {
            applicationCommissions: commissions,
          }),
        },
      },
    });
  };

  render() {
    const { commissions, canEdit, openEdit } = this.state;
    const { application, t } = this.props;

    const sourcers = commissions.filter(
      (el) => el.userRole === USER_TYPES.Sourcer
    );
    const recruiters = commissions.filter(
      (el) => el.userRole === USER_TYPES.Recruiter
    );
    const ams = commissions.filter((el) => el.userRole === USER_TYPES.AM);
    const dms = commissions.filter((el) => el.userRole === USER_TYPES.DM);
    const owners = commissions.filter((el) => el.userRole === USER_TYPES.Owner);
    console.log('AddActivitiFormInfoDisplay', application.toJS());
    const statusIndex = applicationStatus.findIndex(
      (option) => option.value === application.get('status')
    );
    const submitToClientIndex = applicationStatus.findIndex(
      (option) => option.value === 'Submitted'
    );
    return (
      <>
        <div className="columns">
          {ams.map((am) => {
            return (
              <Typography variant="body1" key={am.userId + 'am'} gutterBottom>
                AM:{' '}
                <span style={{ color: '#717171' }}>
                  {am.userFullName +
                    (canEdit && statusIndex >= submitToClientIndex
                      ? `(${am.percentage}%)`
                      : '')}
                </span>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={this.handleSendEmailToAM}
                >
                  <Email fontSize="small" />
                </IconButton>
              </Typography>
            );
          })}
          {dms.map((dm) => {
            return (
              <Typography variant="body1" key={dm.userId + 'dm'} gutterBottom>
                DM:{' '}
                <span style={{ color: '#717171' }}>
                  {dm.userFullName +
                    (canEdit && statusIndex >= submitToClientIndex
                      ? `(${dm.percentage}%)`
                      : '')}
                </span>
              </Typography>
            );
          })}
          {recruiters.map((recruiter) => {
            return (
              <Typography
                variant="body1"
                key={recruiter.userId + 'recruiter'}
                gutterBottom
              >
                Recruiter:{' '}
                <span style={{ color: '#717171' }}>
                  {recruiter.userFullName +
                    (canEdit && statusIndex >= submitToClientIndex
                      ? `(${recruiter.percentage}%)`
                      : '')}
                </span>
              </Typography>
            );
          })}
          {sourcers.map((sourcer) => {
            return (
              <Typography
                variant="body1"
                key={sourcer.userId + 'sourcer'}
                gutterBottom
              >
                Sourcer:{' '}
                <span style={{ color: '#717171' }}>
                  {sourcer.userFullName +
                    (canEdit && statusIndex >= submitToClientIndex
                      ? `(${sourcer.percentage}%)`
                      : '')}
                </span>
              </Typography>
            );
          })}

          {owners.map((owner) => {
            return (
              <Typography
                variant="body1"
                key={owner.userId + owner.userRole}
                gutterBottom
              >
                Owner:{' '}
                <span style={{ color: '#717171' }}>
                  {owner.userFullName +
                    (canEdit ? `(${owner.percentage}%)` : '')}
                </span>
              </Typography>
            );
          })}

          {/* 编辑按钮 */}
          {canEdit && (
            <div>
              <PotentialButton
                disabled={this.props.edit}
                size="small"
                onClick={() => this.setState({ openEdit: true })}
              >
                {t('action:edit')}
              </PotentialButton>
            </div>
          )}
        </div>

        {/* 点击编辑按钮后弹出的模态框 */}
        <Dialog
          open={openEdit}
          fullWidth
          maxWidth="sm"
          PaperProps={{ style: { overflow: 'visible' } }}
        >
          {/* 1.submit to client 阶段显示的是UpdateApplicationUserRoles (修改更新用户)
              阶段之后显示的UpdateApplicationCommissions（修改更新用户 以及 分配比例） */}
          {statusIndex >= submitToClientIndex ? (
            <UpdateApplicationCommissions
              t={t}
              jobId={application.get('jobId')}
              applicationId={application.get('id')}
              onSuccess={this.handleCommissionsUpdate}
              onClose={() => this.setState({ openEdit: false })}
            />
          ) : (
            <UpdateApplicationUserRoles
              t={t}
              jobId={application.get('jobId')}
              applicationId={application.get('id')}
              onSuccess={this.handleCommissionsUpdate}
              onClose={() => this.setState({ openEdit: false })}
            />
          )}
        </Dialog>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStateToProps)(ApplicationCommission);
