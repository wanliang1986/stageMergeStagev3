import React from 'react';
import { connect } from 'react-redux';
import { formatUserName } from '../../../../utils';
import { Link, Prompt } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';

class ApplicationInfo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { candidate, job, t, style, split } = this.props;
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
    console.log(job.toJS());
    console.log(job.get('company'));
    if (split) {
      return (
        <>
          <Prompt
            message={(location) => t('message:prompt') + location.pathname}
          />
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
              </Typography>
            </Typography>
            <Typography variant="body1">
              {t('field:phone')}:{' '}
              <Typography component="span" color="textSecondary">
                {phoneArr.length > 0 ? phoneArr[0] : ''}
              </Typography>
            </Typography>
          </div>
          <div className="columns">
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
                      : null
                  }
                >
                  {job.get('company')
                    ? job.get('company').get('name')
                    : job.get('companyName')}
                </Link>
              </Typography>
            </Typography>
          </div>
        </>
      );
    }
    return (
      <div className="columns" style={style}>
        <Prompt
          message={(location) => t('message:prompt') + location.pathname}
        />
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
            <Link to={`/jobs/detail/${job.get('id')}`}>{job.get('title')}</Link>
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
    );
  }
}

const mapStateToProps = (state, { application }) => {
  return {
    candidate: state.model.talents.get(String(application.get('talentId'))),
    job: state.model.jobs.get(String(application.get('jobId'))),
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStateToProps)(ApplicationInfo);
