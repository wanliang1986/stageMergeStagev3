import React, { useEffect, useState } from 'react';
// import { changeStatus } from '../../../../actions/newSearchJobs';
import { ADD_SEND_EMAIL_REQUEST } from '../../../../constants/actionTypes';

import {
  jobStatus,
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

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import FavorJobButton from '../../FavorJobButton';
import MyTooltip from '../../../../components/MyTooltip/myTooltip';
import ToolInfor from '../../toolTip';
import { changeStatus } from '../../../../../apn-sdk/newSearch';
const SectionHeader = ({
  clickHandler,
  section,
  job,
  t,
  dispatch,
  disabled,
  userRelationList,
}) => {
  const [openJobStatus, setOpenJobStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [status, setStatus] = useState(job.get('status'));

  const handleStatusChange = (event) => {
    setOpenJobStatus(true);
    setAnchorEl(event.currentTarget);
  };
  useEffect(() => {
    setStatus(job.get('status'));
    console.log(job.toJS());
  }, [job]);
  const handleClosePop = () => {
    setOpenJobStatus(false);
  };
  const handleSelect = (value) => {
    handleClosePop();
    changeStatus(job.get('id'), value)
      .then((res) => {
        setStatus(value);
        dispatch(getJob(job.get('id')));
      })
      .catch((err) => {
        dispatch({
          type: 'add_message',
          message: {
            message: err.message,
            type: 'error',
          },
        });
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
      style={{ height: 24 }}
    >
      {section === 'editBasic' && (
        <>
          <Tooltip
            title={
              <span style={{ whiteSpace: 'pre-line' }}>{job.get('title')}</span>
            }
            arrow
          >
            <div
              style={{
                marginRight: 6,
                width: 100,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {job.get('title')}
            </div>
          </Tooltip>
          <div className={'horizontal-layout align-middle'}>
            <p style={{ color: '#939393', fontSize: 13 }}>
              {getJobTypeLabel(job.get('jobType'))}&nbsp;#{job.get('id')}
            </p>
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

                <FavorJobButton t={t} jobId={job.get('id')} />
                <Tooltip
                  title={
                    <span style={{ whiteSpace: 'pre-line' }}>
                      Email to assigned users
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
                        AM&nbsp;Checklist
                      </span>
                    </div>
                  </MyTooltip>
                </div>
              </>
            ) : null}
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
              Download
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
    </div>
  );
};
export default SectionHeader;
