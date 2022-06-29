import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { externalUrl } from '../../../../utils';
import { CONTACT_TYPES } from '../../../constants/formOptions';
import {
  LinkedIn,
  GitHub,
  GooglePlus,
  Twitter,
  Facebook,
  WeChat,
  Weibo,
} from '../../../components/Icons';

const map = {
  LINKEDIN: {
    backgroundColor: '#0d77b7',
    Icon: LinkedIn,
  },
  GITHUB: {
    backgroundColor: 'black',
    Icon: GitHub,
  },

  GOOGLE_PLUS: {
    backgroundColor: '#F90101',
    Icon: GooglePlus,
  },
  TWITTER: {
    backgroundColor: '#429cd6',
    Icon: Twitter,
  },
  FACEBOOK: {
    backgroundColor: '#3a589e',
    Icon: Facebook,
  },
  WECHAT: {
    backgroundColor: '#4dc247',
    Icon: WeChat,
  },
  WEIBO: {
    backgroundColor: 'orange',
    Icon: Weibo,
  },
  MAIMAI: {
    backgroundColor: 'orange',
    Icon: Weibo,
  },
};

const styles = {
  link: {
    width: 25,
    height: 25,
    borderRadius: 3,
    marginRight: 8,
  },
};

class SocialIcons extends React.PureComponent {
  render() {
    const { classes, socialMedias } = this.props;
    return (
      <div className="flex-container">
        {socialMedias.map((contact, index) => {
          if (map[contact.get('type')] && contact.get('details')) {
            const Icon = map[contact.get('type')].Icon;
            try {
              if (
                contact.get('type') === CONTACT_TYPES.LinkedIn &&
                contact.get('info')
              ) {
                const publicIdentifier = JSON.parse(contact.get('info'))
                  .publicIdentifier;
                if (publicIdentifier) {
                  return (
                    <a
                      className={
                        'flex-container align-middle align-center ' +
                        classes.link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.linkedin.com/in/${publicIdentifier}`}
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(externalUrl(contact.get('details'), true));
                      }}
                    >
                      <Icon
                        htmlColor={map[contact.get('type')].backgroundColor}
                      />
                    </a>
                  );
                }
              }

              if (contact.get('type') === CONTACT_TYPES.Wechat) {
                const { searchParams } = new URL(contact.get('details'));
                const _ed = searchParams.get('_ed');
                if (_ed) {
                  const path = _ed.substr(0, 44);
                  return (
                    <a
                      className={
                        'flex-container align-middle align-center ' +
                        classes.link
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      href={externalUrl(contact.get('details'))}
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          `https://wechat-qrcode.s3-us-west-2.amazonaws.com/${path}`,
                          '',
                          'width=200,height=200'
                        );
                      }}
                    >
                      <Icon
                        htmlColor={map[contact.get('type')].backgroundColor}
                      />
                    </a>
                  );
                }
              }

              if (contact.get('type') === CONTACT_TYPES.Maimai) {
                return (
                  <a
                    className={
                      'flex-container align-middle align-center ' + classes.link
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    href={externalUrl(contact.get('details'), true)}
                    key={index}
                  >
                    <img src="/assets/maimai.png" />
                  </a>
                );
              }
            } catch (e) {}

            return (
              <a
                className={
                  'flex-container align-middle align-center ' + classes.link
                }
                target="_blank"
                rel="noopener noreferrer"
                href={externalUrl(contact.get('details'), true)}
                key={index}
              >
                <Icon htmlColor={map[contact.get('type')].backgroundColor} />
              </a>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

export default withStyles(styles)(SocialIcons);
