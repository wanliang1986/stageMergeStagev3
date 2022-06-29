import React, { useEffect, useState } from 'react';
// import { changeStatus } from '../../../../actions/newSearchJobs';
import { ADD_SEND_EMAIL_REQUEST } from '../../../../constants/actionTypes';
import { sendEmailToJobUsers } from '../../../../actions/emailAction';
import {
  jobStatus,
  ipgJobStatusObj,
  SEND_EMAIL_TYPES,
  getJobTypeLabel,
  JOB_TYPES,
} from '../../../../constants/formOptions';
import { export2Doc } from '../../../../../utils';
import { getJob } from '../../../../actions/jobActions';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import EditIcon from '@material-ui/icons/Edit';
import MailIcon from '@material-ui/icons/Mail';
import InfoIcon from '@material-ui/icons/Info';
import * as apnSDK from '../../../../../apn-sdk';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import FavorJobButton from '../../FavorJobButton';
import MyTooltip from '../../../../components/MyTooltip/myTooltip';
import ToolInfor from '../../toolTip';
import { changeStatus } from '../../../../../apn-sdk/newSearch';
import MyDialog from '../../../../components/Dialog/myDialog';
import { connect } from 'react-redux';
const SectionHeader = ({
  clickHandler,
  section,
  job,
  t,
  dispatch,
  disabled,
  userRelationList,

  currentUser,
}) => {
  const [openJobStatus, setOpenJobStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState(job.get('status'));
  const [showIpgJobConfirm, setshowIpgJobConfirm] = useState(false);
  const [checkedStatus, setCheckedStatus] = useState(null);

  const handleStatusChange = (event) => {
    setOpenJobStatus(true);
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    setStatus(job.get('status'));
  }, [job]);
  const handleClosePop = () => {
    setOpenJobStatus(false);
  };
  const handleSelect = (value) => {
    handleClosePop();
    jobChangeCommon(value);
  };

  const jobChangeCommon = (jobStatus) => {
    let nowIpgJobStatus = job.get('ipgJobStatus');
    let newIpgJobStatus = ipgJobStatusObj[jobStatus];

    // 只有关闭ipg job close的时候 才会去触发confirm
    // 触发条件有三个
    // 1.当前的ipgjob 跟操作的ipg状态类型不同(OPEN,CLOSE)
    // 2.当前的ipgJob为open状态
    // 3.当前操作的ipgjob状态为close
    if (
      nowIpgJobStatus !== newIpgJobStatus &&
      newIpgJobStatus === 'CLOSE' &&
      nowIpgJobStatus === 'OPEN'
    ) {
      // 需要confirm
      setCheckedStatus(jobStatus);
      setshowIpgJobConfirm(true);
    } else {
      // 不需要confirm 直接改变job status
      changeJobStatus(jobStatus, 'change_job_status');
    }
  };
  const ipgJobConfirm = () => {
    console.log('confirm ok =>  1. change job status 2.curl close ipgjob');
    changeJobStatus(checkedStatus, 'change_ipg_job_status');
  };

  const changeJobStatus = (jobStatus, type) => {
    const jobId = job.get('id');
    changeStatus(jobId, jobStatus)
      .then((res) => {
        setStatus(jobStatus);
      })
      .then(() => {
        if (type === 'change_ipg_job_status') {
          // close ipg job 状态
          changeIpgJobStatus(jobStatus);
        } else {
          dispatch(getJob(jobId));
        }
      })
      .catch((err) => {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
      })
      .then(() => {
        setshowIpgJobConfirm(false);
      });
  };
  // 新增需求：在变更job状态时 如果job关联了ipg且ipgjob状态为OPEN 进行confirm（状态互逆时出现 now:CLOSE - new:OPEN）
  const changeIpgJobStatus = () => {
    const jobId = job.get('id');
    apnSDK
      .closeJob_Ipg(jobId)
      .then((res) => {
        dispatch(getJob(jobId));
        // 关闭ipg job 成功后 需要去给AM发邮箱
        ipgJobSendEmailToAm();
      })
      .catch((err) => {
        dispatch(showErrorMessage(err));
        throw err;
      });
  };

  const ipgJobSendEmailToAm = () => {
    const from = currentUser.get('email');
    const AM_Index = job
      .get('assignedUsers')
      .toJS()
      .findIndex((user) => user.permission === 'AM');
    const AM = job.get('assignedUsers').toJS()?.[AM_Index];

    const to = AM?.email;
    const content = `
        <p>Hi ${AM?.firstName} ${AM?.lastName},</p>
        <p>${job.get('title')}(${job.get(
      'id'
    )}) has been taken down from IPG website job posting page because its status in APN has changed to CLOSE. If you wish to re-post this job, please go to job detail page in APN and change job status back to OPEN or REOPEN.</p>
        <p>Thank you,<br />APN Development Team</p>
    `;

    // console.log('from::::', from);
    // console.log('AM::::', AM);
    // console.log('to::::', to);
    // console.log('content:::', content);

    apnSDK.sendEmail(from, to, null, null, null, content, null).catch((err) => {
      dispatch(showErrorMessage(err));
    });
  };

  const handleSendEmailToUsers = () => {
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToAssignedUsers,
        data: {
          userRelationList,
          t,
          job,
        },
      },
    });
  };

  const jobStatusLabel = (value) => {
    let status = null;
    jobStatus.map((item) => {
      if (item.value === value) {
        status = item.label;
      }
    });
    return status;
  };
  const getColor = () => {
    let status = job.get('status');
    switch (status) {
      case 'OPEN':
        return '#3398DC';
        break;
      case 'REOPENED':
        return '#21B66E';
        break;
      case 'FILLED':
        return '#F56D50';
        break;
      case 'CLOSED':
      case 'CANCELLED':
        return '#BDBDBD';
        break;
      case 'ONHOLD':
        return '#FDAB29';
        break;
      default:
        return '#3398DC';
        break;
    }
  };

  return (
    <div
      className="horizontal-layout align-justify align-middle columns"
      style={{ height: 48 }}
    >
      {section === 'editBasic' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', marginBottom: 5 }}>
              <Tooltip
                title={
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {job.get('title')}
                  </span>
                }
                arrow
              >
                <div
                  style={{
                    marginRight: 6,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {job.get('title')}
                </div>
              </Tooltip>

              <div>
                <p style={{ color: '#939393', fontSize: 13 }}>
                  {t(`tab:${getJobTypeLabel(job.get('jobType'))}`)}&nbsp;#
                  {job.get('id')}
                </p>
              </div>
            </div>

            {/* job 状态变更 */}
            <div className={'horizontal-layout align-middle'}>
              {disabled ? (
                <>
                  {(job.get('jobType') === JOB_TYPES.FullTime ||
                    job.get('jobType') === JOB_TYPES.Contract) && (
                    <div
                      onClick={handleStatusChange}
                      style={{
                        padding: '1px 8px',
                        borderRadius: '10.5px',
                        color: '#fff',
                        backgroundColor: getColor(),
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        // marginRight: 6,
                      }}
                    >
                      <p style={{ marginRight: 4 }}>{jobStatusLabel(status)}</p>
                      <EditIcon style={{ fontSize: 15 }} />
                    </div>
                  )}

                  {job.get('ipgJobStatus') === 'OPEN' && (
                    <div
                      style={{
                        padding: '1px 8px',
                        borderRadius: '10.5px',
                        color: '#fff',
                        backgroundColor: getColor(),
                        display: 'flex',
                        alignItems: 'center',
                        // marginRight: 6,
                      }}
                    >
                      <p> {t('tab:Posted on IPG Website')}</p>
                    </div>
                  )}

                  <FavorJobButton t={t} jobId={job.get('id')} />
                  <Tooltip
                    title={
                      <span style={{ whiteSpace: 'pre-line' }}>
                        {t('tab:Email to assigned users')}
                      </span>
                    }
                    arrow
                  >
                    <IconButton onClick={handleSendEmailToUsers} size="small">
                      <MailIcon />
                    </IconButton>
                  </Tooltip>

                  <div>
                    <MyTooltip title={<ToolInfor />}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: '0.5px solid #dee0e3',
                          paddingLeft: 12,
                        }}
                      >
                        <InfoIcon color="disabled" fontSize="small" />
                        &nbsp;
                        <span style={{ color: '#777777', fontSize: 13 }}>
                          {t('tab:AM Checklist')}
                        </span>
                      </div>
                    </MyTooltip>
                  </div>
                </>
              ) : null}
            </div>
          </div>

          <div className="flex-child-auto" />
        </>
      )}

      {section === 'editDescription' && (
        <>
          <div>{t('field:jobDescription')}</div>
          <div className="flex-child-auto" />

          {disabled && (
            <PrimaryButton
              onClick={() => {
                console.log('download', job.get('publicDesc'));
                export2Doc(job.get('publicDesc'), job.get('title'));
              }}
              disabled={job.get('publicDesc') === '<p></p>' ? true : false}
            >
              {t('tab:Download')}
            </PrimaryButton>
          )}
        </>
      )}

      {Boolean(clickHandler) ? (
        <SecondaryButton onClick={() => clickHandler(section)}>
          {t('action:edit')}
        </SecondaryButton>
      ) : (
        <div style={{ width: 64 }} />
      )}

      <Popover
        open={openJobStatus}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        onClose={handleClosePop}
      >
        <MenuList dense>
          {jobStatus
            .filter((status) => !status.disabled)
            .map((status) => {
              return (
                <MenuItem
                  dense
                  key={status.value}
                  onClick={() => handleSelect(status.value)}
                >
                  {status.label}
                </MenuItem>
              );
            })}
        </MenuList>
      </Popover>

      {/* change ipg job status dialog */}
      <MyDialog
        show={showIpgJobConfirm}
        modalTitle={'Job Status'}
        CancelBtnMsg={t('tab:Cancel')}
        SubmitBtnMsg={t('tab:Confirm')}
        CancelBtnShow={true}
        SubmitBtnShow={true}
        handleClose={() => setshowIpgJobConfirm(false)}
        primary={ipgJobConfirm}
      >
        <p style={{ width: 500 }}>
          This job is currently posted on IPG website. We will take down this
          job from IPG website once you change the job status.
        </p>
      </MyDialog>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.controller.currentUser,
  };
};
export default connect(mapStateToProps)(SectionHeader);
