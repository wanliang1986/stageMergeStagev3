import React from 'react';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import Immutable from 'immutable';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import {
  CandidateContact,
  CandidateNetWork,
} from '../../../../constants/formOptions';
import { formatFullName } from '../../../../../utils';

const styles = {
  root: {
    borderRadius: 3,
    border: 'solid 1px #f3f3f2',
  },
  title: {
    padding: '12px 20px',
    backgroundColor: '#fafafb',
    borderBottom: 'solid 1px #f3f3f2',
  },
  contacts: {
    padding: '12px 20px',
    wordBreak: 'break-word',
    borderBottom: 'solid 1px #f3f3f2',
  },
  type: {
    minWidth: 100,
    textTransform: 'capitalize',
    color: '#505050',
    fontWeight: 'bold',
    marginBottom: 9,
  },
  font: {
    minWidth: 135,
    textTransform: 'capitalize',
  },
  isDuplicate: {
    color: '#f56d50',
  },
};

class TalentInfoCard extends React.Component {
  isContact = (value) => {
    let str = '';
    CandidateContact.map((item) => {
      if (value === item.value) {
        str = item.label;
      }
    });
    return str;
  };

  isNetWork = (value) => {
    let str = '';
    CandidateNetWork.map((item) => {
      if (value === item.value) {
        str = item.label;
      }
    });
    return str;
  };
  render() {
    const {
      classes,
      talent: {
        firstName,
        lastName,
        fullName,
        id,
        contacts,
        experiences,
        // company,
        // title,
      },
    } = this.props;
    let socilaNetworkListTwo = [];
    let contactListTwo = [];
    contacts &&
      contacts.map((item) => {
        if (
          item.type === 'LINKEDIN' ||
          item.type === 'FACEBOOK' ||
          item.type === 'PERSONAL_WEBSITE' ||
          item.type === 'WECHAT'
        ) {
          socilaNetworkListTwo.push(item);
        } else {
          contactListTwo.push(item);
        }
      });
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography>
            <Link
              href={`/candidates/detail/${id}`}
              target="_blank"
              style={{ color: '#e85919' }}
            >
              {firstName && lastName
                ? formatFullName(firstName, lastName)
                : fullName}
            </Link>
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {experiences && experiences.length > 0 && experiences[0].company}
          </Typography>
        </div>
        <div className={classes.contacts}>
          <div className={classes.type}>{'Contacts'}</div>
          {contactListTwo &&
            contactListTwo.map((item) => {
              return (
                <div className="flex-container" key={item.id}>
                  <div className={classes.font}>
                    {this.isContact(item.type)}
                  </div>
                  <div className="flex-child-auto ">
                    <Typography variant="body2" color="textSecondary">
                      {item.contact}
                    </Typography>
                  </div>
                </div>
              );
            })}
        </div>
        <div className={classes.contacts}>
          <div className={classes.type}>{'Social Networks'}</div>
          {socilaNetworkListTwo &&
            socilaNetworkListTwo.map((item) => {
              return (
                <div className="flex-container" key={item.id}>
                  <div className={classes.font}>
                    {this.isNetWork(item.type)}
                  </div>
                  <div className="flex-child-auto ">
                    <Typography variant="body2" color="textSecondary">
                      {item.details || item.contact}
                    </Typography>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(TalentInfoCard);

const getLinkedinLink = (linkedin) => {
  if (linkedin.info) {
    try {
      const { publicIdentifier } = JSON.parse(linkedin.info);
      if (publicIdentifier) {
        return `https://www.linkedin.com/in/${publicIdentifier}`;
      }
    } catch (e) {
      console.error(e);
    }
  }
  return linkedin.details;
};
