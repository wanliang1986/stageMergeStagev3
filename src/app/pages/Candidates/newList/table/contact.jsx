import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Tooltip from '@material-ui/core/Tooltip';

const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
class ContactsCell extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, data, colDef } = this.props;
    let html = '';
    let phoneTooltips = '';
    data.phones &&
      data.phones.map((item, index) => {
        if (index == 0) html = item;
        if (index == data.phones.length - 1) {
          phoneTooltips += `${item} \n `;
        } else {
          phoneTooltips += `${item}  ,  \n `;
        }
      });

    let emailhtml = '';
    let emailTooltips = '';
    data.emails &&
      data.emails.map((item, index) => {
        if (index == 0) emailhtml = item;
        if (index == data.emails.length - 1) {
          emailTooltips += `${item} \n `;
        } else {
          emailTooltips += `${item}  ,  \n `;
        }
      });

    let industrihtml = '';
    let industriTooltips = '';
    data.industries &&
      data.industries.map((item, index) => {
        if (index == 0) industrihtml = item;
        if (index == data.industries.length - 1) {
          industriTooltips += `${item} \n `;
        } else {
          industriTooltips += `${item}  ,  \n `;
        }
      });

    let jobfunhtml = '';
    let jobfunTooltips = '';
    data.jobFunctions &&
      data.jobFunctions.map((item, index) => {
        if (index == 0) jobfunhtml = item;
        if (index == data.jobFunctions.length - 1) {
          jobfunTooltips += `${item} \n `;
        } else {
          jobfunTooltips += `${item}  ,  \n `;
        }
      });

    let languagehtml = '';
    let languageTooltips = '';
    data.languages &&
      data.languages.map((item, index) => {
        if (index == 0) languagehtml = item;
        if (index == data.languages.length - 1) {
          languageTooltips += `${item} \n `;
        } else {
          languageTooltips += `${item}  ,  \n `;
        }
      });

    let skillhtml = '';
    let skillTooltips = '';
    data.skills &&
      data.skills.map((item, index) => {
        if (index == 0) {
          skillhtml = item.skillName;
        } else {
          skillhtml = skillhtml + ',' + item.skillName;
        }

        if (index == data.skills.length - 1) {
          skillTooltips += `${item.skillName} \n `;
        } else {
          skillTooltips += `${item.skillName}  ,  \n `;
        }
      });

    let workAuthorizationhtml = '';
    let workAuthorizationTooltips = '';
    workAuthorizationhtml = data.workAuthorization;

    if (colDef.headerName == 'Phone') {
      return (
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {phoneTooltips ? phoneTooltips : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span className={classes.title}>
            {html ? html : 'N/A'}
            {data.phones && data.phones.length > 1 ? '...' : null}
          </span>
          {}
        </Tooltip>
      );
    }
    if (colDef.headerName == 'Industries') {
      return (
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {industriTooltips ? industriTooltips : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span className={classes.title}>
            {industriTooltips ? industriTooltips : 'N/A'}
          </span>
        </Tooltip>
      );
    }
    if (colDef.headerName == 'Job Functions') {
      return (
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {jobfunTooltips ? jobfunTooltips : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span className={classes.title}>
            {jobfunTooltips ? jobfunTooltips : 'N/A'}
          </span>
        </Tooltip>
      );
    }
    if (colDef.headerName == 'Languages') {
      return (
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {languageTooltips ? languageTooltips : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span className={classes.title}>
            {languageTooltips ? languageTooltips : 'N/A'}
          </span>
        </Tooltip>
      );
    }
    if (colDef.headerName == 'Skills') {
      return (
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {skillTooltips ? skillTooltips : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span className={classes.title}>{skillhtml ? skillhtml : 'N/A'}</span>
        </Tooltip>
      );
    }
    if (colDef.headerName == 'Work Authorization') {
      return (
        <Tooltip
          title={
            <span style={{ whiteSpace: 'pre-line' }}>
              {workAuthorizationhtml ? workAuthorizationhtml : 'N/A'}
            </span>
          }
          arrow
          placement="top"
        >
          <span className={classes.title}>
            {workAuthorizationhtml ? workAuthorizationhtml : 'N/A'}
          </span>
        </Tooltip>
      );
    }
    return (
      <Tooltip
        title={
          <span style={{ whiteSpace: 'pre-line' }}>
            {emailTooltips ? emailTooltips : 'N/A'}
          </span>
        }
        arrow
        placement="top"
      >
        <span className={classes.title}>{emailhtml ? emailhtml : 'N/A'}</span>
      </Tooltip>
    );
  }
}

export default withStyles(style)(ContactsCell);
