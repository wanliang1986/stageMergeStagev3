import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import * as Colors from '../../../styles/Colors/index';
import { CONTACT_TYPES } from '../../../constants/formOptions';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

import Email from '@material-ui/icons/Email';
import Call from '@material-ui/icons/Call';
import Save from '@material-ui/icons/Save';
import FileCopy from '@material-ui/icons/FileCopy';
import Person from '@material-ui/icons/PermIdentity';

// import SocialIcons from '../../Candidates/Detail/SocialIcons';
import { LinkedIn } from '../../../components/Icons';
import Qualification from './Qualification';

import * as apnSDK from '../../../../apn-sdk/globalSearch';
import Loading from '../../../components/particial/Loading';

import ContactTooltip from './ContactTooltip';
import Clipboard from 'clipboard';

import { createCandidate } from '../../../actions/talentActions';
import BottomMessage from './BottomMessage';
import { showErrorMessage } from '../../../actions';

const styles = {
  nameCardBackground: {
    height: 50,
    padding: 8,
  },
  body: {
    fontSize: '14px',
    color: Colors.SUB_TEXT,
    textAlign: 'left',
    height: '85px',
  },
  contactIcon: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '6px',
    width: 140,
  },
  linkedInAnchor: {
    display: 'flex',
    alignItems: 'center',
  },
};

class CandidateDetails extends React.PureComponent {
  constructor() {
    super();

    this.state = {
      successCopy: false,
      hover: null,
    };
  }

  componentDidMount() {
    this.fetchCandidateDetails(this.props.esId);

    this.clipboardEmail = new Clipboard('#copyEmail', {
      target: () => document.getElementById('emailInfo'),
    });

    this.clipboardPhone = new Clipboard('#copyPhone', {
      target: () => document.getElementById('phoneInfo'),
    });

    this.clipboardEmail.on('success', () => {
      this.setState({ successCopy: true });
      this._emailid = setTimeout(() => {
        this.setState({ successCopy: false });
      }, 3000);
    });

    this.clipboardPhone.on('success', () => {
      this.setState({ successCopy: true });
      this._phoneid = setTimeout(() => {
        this.setState({ successCopy: false });
      }, 3000);
    });
  }

  componentWillUnmount() {
    this.clipboardEmail.destroy();
    this.clipboardPhone.destroy();
    clearTimeout(this._emailid);
    clearTimeout(this._phoneid);
  }

  fetchCandidateDetails = (esId) => {
    apnSDK
      .getGlobalCandidateDetails(this.props.esId)
      .then(({ response }) => {
        console.log('in detail', response);
        let linkedInContact = response.contacts.find(
          (c) => c.type === CONTACT_TYPES.LinkedIn
        );
        let linkedInUrl = linkedInContact && linkedInContact.details;
        if (response.esId && linkedInUrl) {
          linkedInUrl = `https://www.linkedin.com/in/${response.esId}`;
        }
        let emailContact = response.contacts.find(
          (c) => c.type === CONTACT_TYPES.Email
        );
        let phoneContact = response.contacts.find(
          (c) => c.type === CONTACT_TYPES.Phone
        );

        let qualificationLists = this.getQualificationLists(
          response.experiences || [],
          response.educations || [],
          response.skills || []
        );
        // console.log(Immutable.Set(response.skills.map(s=>s.skillName)).size);
        // console.log(Immutable.fromJS(response.contacts).groupBy(e=>e.get('type')).toJS())
        this.setState({
          details: {
            ...response,
            email: emailContact && emailContact.contact,
            phone: phoneContact && phoneContact.contact,
            linkedInUrl,
          },
          qualificationLists,
        });
      })
      .catch((error) => {
        this.props.dispatch(showErrorMessage(error));
        console.log(
          `##\n## Global Search Error (fetchCandidateDetails). ${error}\n##`
        );
      });
  };

  sortByFunction = (a, b) => {
    if (a < b) {
      return 1;
    }
    if (a > b) {
      return -1;
    }
    if (a === b) {
      return 0;
    }
  };

  getQualificationLists = (experiences, educations, skills) => {
    let expList = Immutable.fromJS(experiences)
      .sortBy(
        (experience) => experience.get('endDate') || '',
        this.sortByFunction
      )
      .sortBy(
        (experience) =>
          experience.get('startDate') || experience.get('endDate') || '',
        this.sortByFunction
      );
    let eduList = Immutable.fromJS(educations).sortBy(
      (edu) => edu.get('startDate') || edu.get('endDate') || '',
      this.sortByFunction
    );
    let skillsList = Immutable.fromJS(skills);

    return { expList, eduList, skillsList };
  };

  saveTalent = () => {
    const {
      addressLine,
      certificates,
      city,
      contacts,
      country,
      educations,
      expectedSalary,
      experiences,
      firstName,
      fullName,
      lastName,
      province,
      skills,
      zipcode,
    } = this.state.details;

    //2. post a new candidate
    const newCandidate = {
      addressLine,
      certificates,
      city,
      contacts,
      country,
      educations:
        educations && educations.filter((ele) => ele.collegeName !== null),
      expectedSalary,
      experiences:
        experiences && experiences.filter((ele) => ele.title !== null),
      firstName,
      fullName,
      lastName,
      province,
      skills,
      zipcode,
    };

    this.props
      .dispatch(createCandidate(newCandidate))
      .then(() => {
        clearTimeout(this._savedTimer);
        this.setState({ saved: true });
        this._savedTimer = setTimeout(() => {
          this.setState({ saved: false });
        }, 3000);
      })
      .catch((err) => {
        if (err.message) {
          try {
            const messageObject = JSON.parse(err.message);
            if (Array.isArray(messageObject)) {
              clearTimeout(this._saveTimer);
              this.setState({ duplication: true });
              this._saveTimer = setTimeout(() => {
                this.setState({ duplication: false });
              }, 3000);
              return messageObject;
            }
          } catch (e) {
            console.error(e.message || e);
          }
        }
      });
  };

  render() {
    if (!this.state.details) {
      return <Loading />;
    } else {
      const { classes, purchase } = this.props;
      const {
        photoUrl,
        fullName,
        title,
        company,
        email,
        phone,
        linkedInUrl,
        purchased,
        currentLocation,
        preferredLocations,
      } = this.state.details;
      const { city, province } =
        currentLocation || (preferredLocations && preferredLocations[0]) || {};

      return (
        <Fragment>
          <div
            style={{
              margin: '20px 0',
              display: 'flex',
              height: '85px',
              flex: 'none',
            }}
          >
            <Paper
              style={{ height: '85px', margin: '0 20px', borderRadius: '50%' }}
            >
              <Avatar
                src={photoUrl}
                style={{
                  backgroundColor: 'white',
                  color: Colors.GRAY,
                  width: 85,
                  height: 85,
                }}
              >
                <Person style={{ width: 55, height: 55 }} />
              </Avatar>
            </Paper>

            <div className={classes.body}>
              <Typography variant="h6">{fullName}</Typography>
              <div>
                {title}
                {company ? ` at ${company}` : null}
              </div>
              <div>
                {city} {province}
              </div>
              <div className={classes.contactIcon}>
                {!email ? (
                  <Email color={email ? 'primary' : 'disabled'} />
                ) : (
                  <ContactTooltip
                    icon={<Email color={email ? 'primary' : 'disabled'} />}
                    contactInfo={
                      <section
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <span
                          id="emailInfo"
                          onClick={purchase}
                          style={{ fontSize: '14px', margin: '4px 1px' }}
                        >
                          {email}
                        </span>
                        {purchased ? (
                          <FileCopy
                            style={{
                              width: '12px',
                              height: '12px',
                              marginLeft: '6px',
                            }}
                            id="copyEmail"
                            onClick={() => {
                              console.log('clicked');
                              this.setState({ hover: 'email' });
                            }}
                          />
                        ) : null}
                      </section>
                    }
                  />
                )}

                {!phone ? (
                  <Call color={phone ? 'primary' : 'disabled'} />
                ) : (
                  <ContactTooltip
                    icon={<Call color={phone ? 'primary' : 'disabled'} />}
                    contactInfo={
                      <section
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <span
                          id="phoneInfo"
                          onClick={purchase}
                          style={{ fontSize: '14px', margin: '4px 1px' }}
                        >
                          {phone}
                        </span>
                        {purchased ? (
                          <FileCopy
                            style={{
                              width: '12px',
                              height: '12px',
                              marginLeft: '6px',
                            }}
                            id="copyPhone"
                            onClick={() => {
                              console.log('clicked');
                              this.setState({ hover: 'phone' });
                            }}
                          />
                        ) : null}
                      </section>
                    }
                  />
                )}

                {linkedInUrl ? (
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.linkedInAnchor}
                  >
                    <LinkedIn style={{ fontSize: 19 }} color="primary" />
                  </a>
                ) : (
                  <LinkedIn style={{ fontSize: 19 }} color="disabled" />
                )}

                {purchased ? (
                  <Save color="primary" onClick={this.saveTalent} />
                ) : (
                  <Save color="disabled" />
                )}
              </div>
            </div>
          </div>

          <Divider />
          <div className="flex-child-auto" style={{ overflow: 'auto' }}>
            <Qualification lists={this.state.qualificationLists} />
          </div>

          {this.state.successCopy && (
            <BottomMessage
              content={`${
                this.state.hover === 'email' ? 'Email' : 'Phone number'
              } is copied to your clipboard`}
            />
          )}

          {this.state.duplication && (
            <BottomMessage content={'This talent is already saved'} />
          )}

          {this.state.saved && (
            <BottomMessage content={'Save talent to database'} />
          )}
        </Fragment>
      );
    }
  }
}

CandidateDetails.prototypes = {
  esId: PropTypes.string.isRequired,
};

export default connect()(withStyles(styles)(CandidateDetails));
