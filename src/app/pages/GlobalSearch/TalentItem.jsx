import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { _getIdentifier } from '../../../utils';
import checkLinkedinUrl from '../../../utils/checkLinkedinUrl';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import LinkButton from '../../components/particial/LinkButton';
import { LinkedIn } from '../../components/Icons';
import * as apnSDK from '../../../apn-sdk';
import { CONTACT_TYPES } from '../../constants/formOptions';

const styles = {
  detailWrapper: {
    width: '100%',
  },
  resultItems: {
    //border: '1px solid red',
    padding: '14px 0',
    '&:not(:last-child)': {
      borderBottom: '1px solid rgba(0,0,0,.12)',
    },
  },
  nameText: {
    fontWeight: 500,
    fontSize: 18,
    //border: '1px solid red',
    marginBottom: 5,
  },
  linkedInIcon: {
    fontSize: 14,
    verticalAlign: -1,
  },
  iconAnchor: {
    marginLeft: 20,
  },
  positionLine: {
    marginBottom: 3,
    color: '#606060',
    maxWidth: '100%',
  },
  skillsLine: {
    color: '#606060',
    marginBottom: 3,
  },
  contactLine: {
    color: '#606060',
    marginBottom: 3,
  },
  outsideClick: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
};

function TalentItem({ classes, item, onSelect }) {
  return (
    <ListItem className={classes.resultItems}>
      <div className={classes.detailWrapper}>
        <Typography variant="h5" className={classes.nameText} color="primary">
          <LinkButton
            onClick={() => {
              onSelect(item.esId);
              checkLinkedinUrl(item.esId).catch((e) => e);
            }}
            style={{ textTransform: 'capitalize' }}
          >
            {item.fullName}
          </LinkButton>
          {item.linkedInUrl && (
            <a
              className={classes.iconAnchor}
              rel="noopener noreferrer"
              href={item.linkedInUrl}
              target="_blank"
              onClick={() => {
                const identifier = _getIdentifier(item.linkedInUrl);
                if (identifier) {
                  checkLinkedinUrl(identifier).catch((e) => e);
                }
              }}
            >
              <LinkedIn className={classes.linkedInIcon} />
            </a>
          )}
        </Typography>
        <Typography className={classes.positionLine}>
          <strong>{item.title}</strong>
          {item.company ? ` at ${item.company}` : ''}
        </Typography>
        <Typography className={classes.skillsLine} noWrap>
          {item.skills}
        </Typography>
        <Typography className={classes.contactLine}>
          <span
            className={classes.outsideClick}
            onClick={() => onSelect(item.esId, item.purchased)}
          >
            {item.email}
          </span>
          <span
            className={classes.outsideClick}
            onClick={() => onSelect(item.esId, item.purchased)}
            style={{ marginLeft: item.email ? 30 : '' }}
          >
            {item.phone}
          </span>
        </Typography>
      </div>
    </ListItem>
  );
}

export default withStyles(styles)(TalentItem);
