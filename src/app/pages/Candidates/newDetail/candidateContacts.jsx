import React from 'react';
import * as Colors from '../../../styles/Colors';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { externalUrl, formatUserName } from '../../../../utils';
import { changeSearchFlag } from '../../../actions/newCandidate';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import Person from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import Mail from '@material-ui/icons/Mail';
import Phone from '@material-ui/icons/Phone';
import Error from '@material-ui/icons/Error';
import JobIcon from '@material-ui/icons/Work';
import HotlistIcon from '@material-ui/icons/Whatshot';
import Message from '@material-ui/icons/Message';
import HomeIcon from '@material-ui/icons/Home';
import { WeChat, LinkedIn, Facebook } from '../../../components/Icons';

import SubmitPosition from '../../../components/newApplication/submitToPosition';
import AddHotList from '../List/AddHotList';
import PhoneCallScripts from '../Detail/PhoneCallScripts';
import DraggablePaperComponent from '../../../components/particial/DraggablePaperComponent';

const styles = {
  root: {
    padding: 12,
    position: 'relative',
  },
  avatar: {
    backgroundColor: Colors.SILVER,
    color: Colors.GRAY,
    width: 80,
    height: 80,
    marginRight: 16,
  },
  avatarIcon: {
    fontSize: 50,
  },

  largeIcon: {
    // width: 28, height: 28
  },
  iconButton: {
    padding: 6,
  },
  itemContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 4,
    '&:first-child': {
      marginTop: 4,
    },
    '& > *:first-child': {
      fontSize: 20,
      marginRight: 8,
    },
  },
  error: {
    color: 'red',
  },
  workStatus: {
    color: '#3398dc',
    backgroundColor: 'rgba(51, 152, 220,0.2)',
    padding: '2px 16px 2px 12px',
    fontSize: 12,
    borderRadius: '12px',
    lineHeight: '24px',
  },
};

class CandidateContacts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      jobOpen: false,
      hotlistOpen: false,
      loadError: false,
      openJobList: false,
      phoneCallOpen: false,
    };
  }

  handleOpen = (key) => () => {
    this.setState({ [key]: true });
  };

  handleClose = (key) => () => {
    this.setState({ [key]: false });
    this.props.dispatch(changeSearchFlag(false));
  };

  render() {
    const {
      classes,
      t,
      contactList,
      candidate,
      wechat,
      canEdit,
      handleEdit,
      activeStartList,
      isLimitUser,
      shares,
      owners,
      canNotApply,
      workAuthList,
      jobs,
    } = this.props;

    let phoneArr = [];
    let emailArr = [];
    let wechatArr = [];
    let linkedArr = [];
    let websiteArr = [];
    let facebookArr = [];
    // let emailArrTo = [];
    // let phoneArrTo = [];
    candidate &&
      candidate.toJS().contacts &&
      candidate.toJS().contacts.map((item) => {
        if (item.type === 'PHONE') {
          phoneArr.push(item);
          // if (phoneArr.length > 1) {
          //   phoneArrTo = phoneArr.slice(1);
          // }
        }
        if (item.type === 'EMAIL') {
          emailArr.push(item);
          // if (emailArr.length > 1) {
          //   emailArrTo = emailArr.slice(1);
          // }
        }
        if (item.type === 'WECHAT') {
          wechatArr.push(item);
        }
        if (item.type === 'LINKEDIN') {
          linkedArr.push(item);
        }
        if (item.type === 'PERSONAL_WEBSITE') {
          websiteArr.push(item);
        }
        if (item.type === 'FACEBOOK') {
          facebookArr.push(item);
        }
      });

    let emailText = emailArr.map((item) => {
      return item.contact;
    });
    let phoneText = phoneArr.map((item) => {
      return item.contact;
    });
    let wechatText = wechatArr.map((item) => {
      return item.contact;
    });

    return (
      <Paper className={classes.root}>
        <div className="flex-container">
          <div className="">
            <Avatar className={classes.avatar} src={candidate.get('photoUrl')}>
              <Person className={classes.avatarIcon} />
            </Avatar>
          </div>
          <div
            className="flex-child-auto flex-dir-column"
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                display: 'flex',

                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                style={{ textTransform: 'capitalize', marginRight: '16px' }}
              >
                {candidate.get('fullName')}
              </Typography>
              <Typography
                style={{
                  color: '#aab1b8',
                  fontSize: 14,
                  marginRight: '96px',
                }}
              >
                {'#' + candidate.get('id')}
              </Typography>
              {candidate.get('label') ? (
                <div className={classes.workStatus}>
                  {candidate.get('label')}
                </div>
              ) : null}
            </div>

            <Typography variant="caption">
              {`Created by ${formatUserName(
                candidate.get('createdUser')
              )} on ${moment(candidate.get('createdDate')).format('l')}`}
            </Typography>
            {shares.size > 0 && (
              <Typography variant="caption" component="p">
                {'Shares: '}
                {shares.map((s) => formatUserName(s.get('user'))).join(', ')}
              </Typography>
            )}
            {owners.size > 0 && (
              <Typography variant="caption" component="p">
                {`Owner${owners.size > 1 ? 's' : ''}: `}
                {owners.map((s) => (
                  <span key={s.get('id')}>
                    {`${formatUserName(
                      s.get('user')
                    )} (Ownership expires on ${moment(
                      s.get('expireTime')
                    ).format('l')})`}
                    <br />
                  </span>
                ))}
              </Typography>
            )}
            {canNotApply && (
              <div className={clsx(classes.itemContainer, classes.error)}>
                <Error />
                <Typography color="inherit">
                  {`This candidate's submission access has been locked until ${moment(
                    candidate.get('createdDate')
                  )
                    .add(3, 'days')
                    .format('ll')}`}
                </Typography>
              </div>
            )}
            {activeStartList &&
              activeStartList.map((activeStart) => {
                const applicationBaseInfo = activeStart.getIn([
                  'onboard',
                  'ipgOfferBaseInfo',
                ]);
                console.log(activeStart);
                //versionsFlag = true 为通用版本
                const versionsFlag = activeStart
                  .get('talentRecruitmentProcessNodes')
                  .toJS()
                  .some((x) => {
                    return x.nodeType === 'COMMISSION';
                  });
                const job = jobs.get(String(activeStart.get('jobId')));
                return (
                  <div
                    key={activeStart.get('id')}
                    className={clsx(classes.itemContainer, classes.error)}
                  >
                    <Error />
                    {versionsFlag ? (
                      <Typography color="inherit">
                        {`Currently working at ${
                          job ? job.getIn(['company', 'name']) : 'N/A'
                        } from ${moment(
                          activeStart.getIn(['onboard', 'startDate'])
                        ).format('ll')}
                      `}
                        {activeStart.getIn(['job', 'jobType']) !==
                          'FULL_TIME' &&
                          `. Unavailable until ${moment(
                            activeStart.getIn(['onboard', 'startDate']) ||
                              moment(
                                activeStart.getIn(['onboard', 'startDate'])
                              ).add(3, 'months')
                          ).format('ll')}`}
                      </Typography>
                    ) : (
                      <Typography color="inherit">
                        {`Currently working at ${
                          job ? job.getIn(['company', 'name']) : 'N/A'
                        } from ${moment(
                          applicationBaseInfo.get('onboardDate')
                        ).format('ll')}
                      `}
                        {activeStart.getIn(['job', 'jobType']) !==
                          'FULL_TIME' &&
                          `. Unavailable until ${moment(
                            applicationBaseInfo.get('warrantyEndDate') ||
                              moment(
                                applicationBaseInfo.get('onboardDate')
                              ).add(3, 'months')
                          ).format('ll')}`}
                      </Typography>
                    )}
                  </div>
                );
              })}

            <div className={classes.itemContainer} style={{ width: '85%' }}>
              <Mail />
              <Tooltip title={emailText.join(' , ')}>
                <Typography
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {emailText.join('  ,  ')}
                </Typography>
              </Tooltip>
              &nbsp;&nbsp;
            </div>

            <div className={classes.itemContainer} style={{ width: '85%' }}>
              <Phone />
              <Tooltip title={phoneText.join(' , ')}>
                <Typography
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {phoneText.join('  ,  ')}
                </Typography>
              </Tooltip>
              &nbsp;&nbsp;
              {phoneArr.length > 0 && (
                <Tooltip
                  title={t('action:Click to view candidate phone call scripts')}
                  disableFocusListener
                >
                  <ButtonBase onClick={this.handleOpen('phoneCallOpen')}>
                    <Message fontSize="small" />
                  </ButtonBase>
                </Tooltip>
              )}
            </div>
            {wechatArr &&
              wechatArr.map((item) => {
                if (item.contact === 'None') {
                  return (
                    <div className={classes.itemContainer}>
                      <WeChat />
                      <Typography>
                        <a
                          href={
                            externalUrl(item.details, true) ||
                            externalUrl(item.contact, true)
                          }
                          target="_blank"
                        >
                          {item.details}
                        </a>
                      </Typography>
                    </div>
                  );
                } else if (item.contact.includes('http')) {
                  return (
                    <div className={classes.itemContainer}>
                      <WeChat />
                      <Typography>
                        <a
                          href={externalUrl(item.contact, true)}
                          target="_blank"
                        >
                          {item.contact}
                        </a>
                      </Typography>
                    </div>
                  );
                } else {
                  return (
                    <div className={classes.itemContainer}>
                      <WeChat />
                      <Typography>{item.contact}</Typography>
                    </div>
                  );
                }
              })}
            {linkedArr &&
              linkedArr.map((item) => {
                return (
                  <div className={classes.itemContainer}>
                    <LinkedIn htmlColor={'#0d77b7'} />
                    <Typography>
                      <a
                        href={
                          externalUrl(item.details, true) ||
                          externalUrl(item.contact, true)
                        }
                        target="_blank"
                      >
                        {item.details || item.contact}
                      </a>
                    </Typography>
                  </div>
                );
              })}
            {facebookArr &&
              facebookArr.map((item) => {
                return (
                  <div className={classes.itemContainer}>
                    <Facebook htmlColor={'#0d77b7'} />
                    <Typography>
                      <a
                        href={
                          externalUrl(item.details, true) ||
                          externalUrl(item.contact, true)
                        }
                        target="_blank"
                      >
                        {item.details || item.contact}
                      </a>
                    </Typography>
                  </div>
                );
              })}
            {websiteArr &&
              websiteArr.map((item) => {
                return (
                  <div className={classes.itemContainer}>
                    <HomeIcon />
                    <Typography>
                      <a href={externalUrl(item.contact, true)} target="_blank">
                        {item.contact}
                      </a>
                    </Typography>
                  </div>
                );
              })}
            <Typography>
              {candidate.get('expectedSalary')
                ? t('field:expectedSalary') +
                  ': ' +
                  (candidate.get('expectedSalary') / 2000).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  ) +
                  ' / Hour'
                : ''}
            </Typography>
            {/*<div style={{ marginTop: 8 }}>*/}
            {/*  <SocialIcons socialMedias={contactList} />*/}
            {/*</div>*/}
          </div>
        </div>
        {canEdit && (
          <div style={{ position: 'absolute', right: 4, top: 6 }}>
            <Tooltip title={t('action:edit')} disableFocusListener>
              <span>
                <IconButton
                  onClick={handleEdit}
                  className={classes.iconButton}
                  color="primary"
                >
                  <EditIcon className={classes.largeIcon} />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title={t('action:Add to a job')} disableFocusListener>
              <span>
                <IconButton
                  className={classes.iconButton}
                  color="primary"
                  onClick={this.handleOpen('jobOpen')}
                  disabled={canNotApply}
                >
                  <JobIcon className={classes.largeIcon} />
                </IconButton>
              </span>
            </Tooltip>

            {!isLimitUser && (
              <Tooltip
                title={t('action:Add to a hotlist')}
                disableFocusListener
              >
                <span>
                  <IconButton
                    className={classes.iconButton}
                    color="primary"
                    onClick={this.handleOpen('hotlistOpen')}
                  >
                    <HotlistIcon className={classes.largeIcon} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </div>
        )}

        <Dialog open={this.state.jobOpen} fullWidth maxWidth="md">
          <SubmitPosition
            talentId={candidate.get('id')}
            handleRequestClose={this.handleClose('jobOpen')}
            candidate={candidate}
            isTalentDetail
          />
        </Dialog>

        <Dialog open={this.state.hotlistOpen} fullWidth maxWidth="md">
          <AddHotList
            talentId={candidate.get('id')}
            handleRequestClose={this.handleClose('hotlistOpen')}
          />
        </Dialog>

        <Dialog open={this.state.phoneCallOpen} maxWidth="md">
          <PhoneCallScripts t={t} onClose={this.handleClose('phoneCallOpen')} />
        </Dialog>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    workAuthList: state.controller.candidateSelect.toJS().workAuthList,
    jobs: state.model.jobs,
  };
};

export default connect(mapStateToProps)(withStyles(styles)(CandidateContacts));
