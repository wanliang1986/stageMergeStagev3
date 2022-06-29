import React from 'react';
import { connect } from 'react-redux';
import { formatUserName, makeCancelable } from '../../../../utils';
import { getApplicationCommissions } from '../../../../apn-sdk';
import {
  applicationStatus,
  SEND_EMAIL_TYPES,
} from '../../../constants/formOptions';
import { ADD_SEND_EMAIL_REQUEST } from '../../../constants/actionTypes';
import { Link, Prompt } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Email from '@material-ui/icons/Email';

class AddActivitiFormInfoDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEmail: false,
      commissions: [],
      canEdit: false,
    };
  }
  componentDidMount(): void {
    const { application, currentUserId } = this.props;
    this.commissionTask = makeCancelable(
      getApplicationCommissions(application.id)
    );
    this.commissionTask.promise.then(({ response }) => {
      this.props.onCommissionsUpdate(response);
      this.setState({
        commissions: response,
        canEdit: !!response.find((c) => c.userId === currentUserId),
      });
    });
  }

  handleSendEmailToAM = () => {
    const { dispatch, application } = this.props;
    const { commissions } = this.state;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToAM,
        data: {
          application: Object.assign({}, application, {
            applicationCommissions: commissions,
          }),
        },
      },
    });
  };

  handleSendEmailToCandidate = () => {
    const { dispatch, application } = this.props;
    const { commissions } = this.state;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToCandidate,
        data: {
          application: Object.assign({}, application, {
            applicationCommissions: commissions,
          }),
        },
      },
    });
  };

  render() {
    const { commissions, canEdit } = this.state;
    const { t, candidate, job, application } = this.props;

    const sourcers = commissions.filter((el) => el.userRole === 'SOURCER');
    const recruiters = commissions.filter((el) => el.userRole === 'RECRUITER');
    const ams = commissions.filter((el) => el.userRole === 'AM');
    const owners = commissions.filter((el) => el.userRole === 'OWNER');
    console.log('AddActivitiFormInfoDisplay', application);
    const statusIndex = applicationStatus.findIndex(
      (option) => option.value === application.status
    );
    const submitToClientIndex = applicationStatus.findIndex(
      (option) => option.value === 'Submitted'
    );

    let emailArr = [];
    let phoneArr = [];
    candidate &&
      candidate.toJS().contacts &&
      candidate.toJS().contacts.map((item) => {
        if (item.type === 'PHONE') {
          phoneArr.push(item.contact);
        }
        if (item.type === 'EMAIL') {
          emailArr.push(item.contact);
        }
      });
    return (
      <section
        style={{
          marginBottom: '1rem',
          display: 'flex',
        }}
      >
        <Prompt
          message={(location) => t('message:prompt') + location.pathname}
        />
        {/* 1.候选人信息 */}
        <div className="columns">
          <Typography variant="body1">
            {t('field:name')}:{' '}
            <Typography component="span" color="textSecondary">
              <Link to={`/candidates/detail/${candidate.get('id')}`}>
                {formatUserName(candidate) || candidate.get('fullName')}
              </Link>
            </Typography>
          </Typography>
          <Typography variant="body1">
            {t('field:email')}:{' '}
            <Typography component="span" color="textSecondary">
              {emailArr.length > 0 ? emailArr[0] : ''}
              <IconButton
                size="small"
                color="primary"
                onClick={this.handleSendEmailToCandidate}
              >
                {emailArr.length > 0 ? <Email fontSize="small" /> : null}
              </IconButton>
            </Typography>
          </Typography>
          <Typography variant="body1">
            {t('field:phone')}:{' '}
            <Typography component="span" color="textSecondary">
              {phoneArr.length > 0 ? phoneArr[0] : ''}
            </Typography>
          </Typography>
          <Typography variant="body1">
            {t('field:job')}:{' '}
            <Typography component="span" color="textSecondary">
              <Link to={`/jobs/detail/${job.get('id')}`}>
                {job.get('title')}
              </Link>
            </Typography>
          </Typography>
          <Typography variant="body1">
            {t('field:company')}:{' '}
            <Typography component="span" color="textSecondary">
              <Link
                to={
                  job.get('company')
                    ? `/companies/detail/${job.get('company').get('id')}/0`
                    : `/companies/detail/${job.get('companyId')}/0`
                }
              >
                {job.get('company')
                  ? job.get('company').get('name')
                  : job.get('companyName')}
              </Link>
            </Typography>
          </Typography>
        </div>

        {/* 2.相对于的AM/Recruiter/Sourcer/owners 以及分成比例的编辑按钮 */}
        <div className="columns">
          {ams.map((am) => {
            return (
              <Typography variant="body1" key={am.userId + 'am'} gutterBottom>
                AM:{' '}
                <span style={{ color: '#717171' }}>
                  {am.userFullName +
                    (canEdit && statusIndex > submitToClientIndex
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
                    (canEdit && statusIndex > submitToClientIndex
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
                    (canEdit && statusIndex > submitToClientIndex
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
        </div>
      </section>
    );
  }
}

const mapStateToProps = (state, { application }) => {
  return {
    candidate: state.model.talents.get(String(application.talentId)),
    job: state.model.jobs.get(String(application.jobId)),
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStateToProps)(AddActivitiFormInfoDisplay);
