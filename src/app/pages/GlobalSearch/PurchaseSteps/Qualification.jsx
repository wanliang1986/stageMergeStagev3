import React from 'react';
import { withTranslation } from 'react-i18next';
import { formatMonthYear } from '../../../../utils/index';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Down from '@material-ui/icons/KeyboardArrowDown';

import SecondaryButton from '../../../components/particial/SecondaryButton';
import * as Colors from '../../../styles/Colors/index';

const styles = (theme) => ({
  skill: {
    border: '2px solid gray',
    borderRadius: '28px',
    margin: '4px',
    padding: '0 12px',
    fontSize: '14px',
    color: Colors.SUB_TEXT,
    borderColor: Colors.GRAY_2,
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    marginRight: -theme.spacing(1),
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    '&$expandOpen': {
      transform: 'rotate(180deg)',
    },
  },
  expandOpen: {},
  rewriteBoxShadow: {
    boxShadow: 'none',
  },
});

const Experience = ({ experience }) => {
  const startDate = formatMonthYear(experience.get('startDate'));
  const endDate = experience.get('current')
    ? 'Present'
    : formatMonthYear(experience.get('endDate'));
  const position = experience.get('company') + ' - ' + experience.get('title');
  return (
    <div className="row expanded">
      <div className="small-5">{startDate + ' - ' + endDate}</div>
      <div className="small-7">{position}</div>
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
    <div className="row expanded">
      <div className="small-5">{startDate + ' - ' + endDate}</div>
      <div className="small-7">{major}</div>
    </div>
  );
};

class Qualification extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showSkill: false,
      showExperience: false,
      showEducation: false,
    };
  }

  render() {
    const { classes, t } = this.props;
    const { showSkill, showExperience, showEducation } = this.state;

    const experienceList = this.props.lists.expList;
    const educationList = this.props.lists.eduList;
    const candidateSkillList = this.props.lists.skillsList;

    return (
      <div>
        <Card className={classes.rewriteBoxShadow}>
          <CardHeader title={t('common:experience')} />

          <CardContent style={{ paddingTop: 0, paddingBottom: 8 }}>
            <Typography className="vertical-layout" component="div">
              {experienceList
                .slice(0, showExperience ? experienceList.size : 3)
                .map((experience, index) => (
                  <Experience key={index} experience={experience} />
                ))}
            </Typography>
          </CardContent>

          {experienceList.size > 3 && (
            <CardActions className="align-center" style={{ paddingTop: 0 }}>
              <SecondaryButton
                onClick={() =>
                  this.setState({
                    showExperience: !showExperience,
                    showSkill: false,
                    showEducation: false,
                  })
                }
              >
                {showExperience ? t('action:less') : t('action:more')}
                <Down
                  className={clsx(classes.rightIcon, {
                    [classes.expandOpen]: showExperience,
                  })}
                />
              </SecondaryButton>
            </CardActions>
          )}
        </Card>

        <Divider />

        <Card className={classes.rewriteBoxShadow}>
          <CardHeader title={t('common:skills')} />
          <CardContent style={{ paddingTop: 0, paddingBottom: 8 }}>
            <div className="flex-container" style={{ flexWrap: 'wrap' }}>
              {candidateSkillList
                .slice(0, showSkill ? candidateSkillList.size : 10)
                .map((candidateSkill, index) => {
                  return (
                    <div className={classes.skill} key={index}>
                      {candidateSkill.get('skillName')}
                    </div>
                  );
                })}
            </div>
          </CardContent>

          {candidateSkillList.size > 10 && (
            <CardActions className="align-center" style={{ paddingTop: 0 }}>
              <SecondaryButton
                onClick={() =>
                  this.setState({
                    showSkill: !showSkill,
                    showExperience: false,
                    showEducation: false,
                  })
                }
              >
                {showSkill ? t('action:less') : t('action:more')}
                <Down
                  className={clsx(classes.rightIcon, {
                    [classes.expandOpen]: showSkill,
                  })}
                />
              </SecondaryButton>
            </CardActions>
          )}
        </Card>

        <Divider />

        <Card className={classes.rewriteBoxShadow}>
          <CardHeader title={t('common:education')} />

          <CardContent style={{ paddingTop: 0, paddingBottom: 8 }}>
            <Typography className="vertical-layout" component="div">
              {educationList
                .slice(0, showEducation ? educationList.size : 3)
                .map((education, index) => (
                  <Education key={index} education={education} />
                ))}
            </Typography>
          </CardContent>

          {educationList.size > 3 && (
            <CardActions className="align-center" style={{ paddingTop: 0 }}>
              <SecondaryButton
                onClick={() =>
                  this.setState({
                    showEducation: !showEducation,
                    showSkill: false,
                    showExperience: false,
                  })
                }
              >
                {showEducation ? t('action:less') : t('action:more')}
                <Down
                  className={clsx(classes.rightIcon, {
                    [classes.expandOpen]: showEducation,
                  })}
                />
              </SecondaryButton>
            </CardActions>
          )}
        </Card>
      </div>
    );
  }
}

export default withTranslation(['action'])(withStyles(styles)(Qualification));
