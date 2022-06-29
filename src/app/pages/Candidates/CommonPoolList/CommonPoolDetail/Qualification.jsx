import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import Tooltip from '@material-ui/core/Tooltip';

import { formatMonthYear } from '../../../../../utils';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { getApplicationsByTalentId } from '../../../../actions/talentActions';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withTranslation } from 'react-i18next';

const styles = (theme) => ({
  rightIcon: {
    marginRight: -theme.spacing(1),
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    '&$expandOpen': {
      transform: 'rotate(180deg)',
    },
  },
  box: {
    padding: '15px 20px',
  },
  contacts: {
    wordBreak: 'break-word',
  },
  type: {
    width: 190,
    minWidth: 190,
    color: '#505050',
    fontSize: 14,
    marginBottom: 9,
    marginRight: 40,
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  font: {
    color: '#505050',
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 6,
  },
  fontTwo: {
    color: '#939393',
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 9,
  },
  skills: {
    border: '2px solid #669df6',
    borderRadius: '8px',
    margin: '4px',
    padding: '0 12px',
    fontSize: '14px',
    color: '#669df6',
    borderColor: 'rgba(102,157,246,0.15)',
    display: 'inline-block',
  },
});

const Experience = ({ experience, t }) => {
  const startDate = formatMonthYear(experience.get('startDate'));
  const endDate = experience.get('current')
    ? t('message:present')
    : formatMonthYear(experience.get('endDate'));
  const position = experience.get('company') + ' - ' + experience.get('title');
  return (
    <div className="row expanded">
      <div className="small-5 columns">{startDate + ' - ' + endDate}</div>
      <div className="small-7 columns">{position}</div>
    </div>
  );
};
const Education = ({ education }) => {
  const startDate = formatMonthYear(education.get('startDate'));
  const endDate = formatMonthYear(education.get('endDate'));
  const major =
    (education.get('collegeName') || '') +
    ' - ' +
    (education.get('majorName') || '');
  return (
    <div className="row expanded ">
      <div className="small-5 columns">{startDate + ' - ' + endDate}</div>
      <div className="small-7 columns">{major}</div>
    </div>
  );
};

class CandidateQualification extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSkill: false,
      showExperience: false,
      showEducation: false,
    };
  }

  handleEdit = (stepIndex) => {
    this.props.history.push(`/candidates/edit/${this.props.candidateId}`, {
      stepIndex,
    });
  };

  isCurrency = (value) => {
    let str = '$';
    if (value === 'USD') {
      str = '$';
    } else if (value === 'CNY') {
      str = '￥';
    } else if (value === 'CAD') {
      str = '$';
    } else if (value === 'EUR') {
      str = '€';
    } else if (value === 'GBP') {
      str = '£';
    }
    return str;
  };

  isDegree = (value) => {
    const { degreeList } = this.props;
    let str = '';
    degreeList &&
      degreeList.map((item) => {
        if (item.id === value * 1) {
          str = item.label;
        }
      });
    return str;
  };

  render() {
    const { classes, candidateDetail, commonPoolDetailData } = this.props;
    // console.log('commonPoolDetailData', commonPoolDetailData);
    console.log('candidateDetail', candidateDetail);
    return (
      <div>
        <div className={classes.box}>
          <Typography
            variant="h6"
            style={{ marginBottom: 20, marginTop: '30px' }}
          >
            {this.props.t('tab:Experience Information')}
          </Typography>
          {candidateDetail &&
            candidateDetail.experiences &&
            candidateDetail.experiences.map((item) => {
              let timeDescription;
              if (item.startDate && item.endDate) {
                timeDescription =
                  moment(item.startDate).format('L') +
                  ' - ' +
                  moment(item.endDate).format('L');
              } else if (item.startDate && !item.endDate) {
                timeDescription = moment(item.startDate).format('L') + ' - ';
              } else if (!item.startDate && item.endDate) {
                timeDescription = '' + ' - ' + moment(item.endDate).format('L');
              }
              // if (item.startDate && item.endDate) {
              //   timeDescription =
              //     moment(item.startDate).format('L') +
              //     ' - ' +
              //     moment(item.endDate).format('L');
              // } else if (!item.startDate && item.endDate) {
              //   timeDescription = ' - ' + moment(item.endDate).format('L');
              // } else if (!item.startDate && !item.endDate && item.current) {
              //   timeDescription = 'Current';
              // } else if (item.startDate && item.current) {
              //   timeDescription =
              //     moment(item.startDate).format('L') + ' - ' + 'Present';
              // }

              return (
                <div className="flex-container" key={item.id}>
                  <Tooltip title={item.company}>
                    <div className={classes.type}>{item.company}</div>
                  </Tooltip>
                  <div className="flex-child-auto ">
                    <div className={classes.font}>{item.title}</div>
                    <div className={classes.fontTwo}>
                      {timeDescription}
                      {item && item.current ? <span>Present</span> : null}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
        <div className={classes.box}>
          <Typography variant="h6" style={{ marginBottom: 20 }}>
            {this.props.t('tab:Skills')}
          </Typography>
          {candidateDetail &&
            candidateDetail.skills &&
            candidateDetail.skills.map((item) => {
              return (
                <div className={classes.skills} key={item.skillName}>
                  {item.skillName}
                </div>
              );
            })}
        </div>
        <Divider style={{ marginTop: 30, marginBottom: 30 }} />
        <div className={classes.box}>
          <Typography variant="h6" style={{ marginBottom: 20 }}>
            {this.props.t('tab:Education Information')}
          </Typography>
          {candidateDetail &&
            candidateDetail.educations &&
            candidateDetail.educations.map((item) => {
              let timeDescription;
              let EducationRight;
              if (item.startDate && item.endDate) {
                timeDescription =
                  moment(item.startDate).format('L') +
                  ' - ' +
                  moment(item.endDate).format('L');
              } else if (item.startDate && !item.endDate && item.current) {
                timeDescription =
                  moment(item.startDate).format('L') + ' - ' + 'Present';
              } else if (!item.startDate && !item.endDate && item.current) {
                timeDescription = 'Current';
              } else if (!item.startDate && item.endDate) {
                timeDescription = ' - ' + moment(item.endDate).format('L');
              }

              if (item.majorName) {
                EducationRight = item.majorName + ',';
              } else {
                EducationRight = '';
              }
              if (item.degreeLevel) {
                EducationRight += this.isDegree(item.degreeLevel);
              }

              return (
                <div className="flex-container" key={item.id}>
                  <Tooltip title={item.collegeName}>
                    <div className={classes.type}>{item.collegeName}</div>
                  </Tooltip>
                  <div className="flex-child-auto ">
                    <Tooltip title={EducationRight}>
                      <div className={classes.font}>
                        {EducationRight}
                        {/* {this.isDegree(item.degreeLevel)} */}
                      </div>
                    </Tooltip>

                    <div className={classes.fontTwo}>{timeDescription}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

CandidateQualification.propTypes = {
  candidateId: PropTypes.string,
};

function mapStoreStateToProps(state, { candidateId }) {
  return {
    candidateDetail: state.controller.newCandidateJob.toJS().commonPoolDetail,
    degreeList: state.controller.candidateSelect.toJS().degreeList,
    commonPoolDetailData:
      state.controller.newCandidateJob.toJS().commonPoolDetail,
  };
}

export default withTranslation('tab')(
  connect(mapStoreStateToProps)(withStyles(styles)(CandidateQualification))
);
