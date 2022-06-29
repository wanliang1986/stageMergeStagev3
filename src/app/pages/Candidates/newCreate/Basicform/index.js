import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import Immutable from 'immutable';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { searchTalentByContacts } from '../../../../../apn-sdk';
import { Redirect } from 'react-router-dom';
import { showErrorMessage } from '../../../../actions';
import { createCandidate } from '../../../../actions/talentActions';
import BasicInfoForm from './BasicInfoForm3';

import SecondaryButton from '../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import ScrollContainer from '../../../../components/particial/ScrollContainer';
import Loading from '../../../../components/particial/Loading';
import DuplicatedTalentList from '../duplicatedTalentList/TalentDuplications';
import Ownerships from './Ownerships';
import ExperienceInfor from './experienceInfor';
import Skills from './skills';
import CandidatePrefence from './CandidatePreference';
import EducationInfor from './educationInfor';
import ProjectDes from './projectDes';
import { distSelect } from '../../../../../apn-sdk/newSearch';
import { getNewOptions } from '../../../../actions/newCandidate';

const styles = {
  scrollContainer: {
    overflowY: 'overlay',
    overflowX: 'hidden',
    paddingRight: 8,
    flex: 1,
  },
  shadowTop: {
    position: 'absolute',
    top: 0,
    left: 1,
    right: 1,
    height: 8,
    background: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)`,
    opacity: 0,
  },
  shadowBottom: {
    position: 'absolute',
    zIndex: 111,
    bottom: 0,
    left: 1,
    right: 1,
    background: `linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0) 100%)`,
    height: 8,
    opacity: 0,
  },
};

const basicInfo = [
  'firstname',
  'lastname',
  'sourceType',
  'location',
  'languages',
  'contacts',
  'salaryRange',
  'socialNetwork',
];
const experienceInfor = ['experienceInfor', 'experienceInforArr'];
const educations = ['educations', 'educationsArr'];
const projects = ['projects', 'projectsArr'];
class CandidateReviewForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stepIndex: (props.location.state && props.location.state.stepIndex) || 0,
      finished: false,
      processing: false,
      candidate: props.candidate,
      //duplicated talent list
      duplication: null,
      duplication2: null,

      errorMessage: Immutable.Map(),
      checkingDuplication: false,
      preLocation: props.location,
    };

    this.talentForm = React.createRef();
  }

  componentDidMount() {
    this.getSelectOptions();
  }

  getSelectOptions = () => {
    const { dispatch, isLimitUser } = this.props;
    Promise.all([
      distSelect(1),
      distSelect(38),
      distSelect(65),
      distSelect(92),
      distSelect(117),
    ]).then((res) => {
      this.props.dispatch(getNewOptions(['jobFounctionList', res[0].response]));
      this.props.dispatch(getNewOptions(['languageList', res[1].response]));
      this.props.dispatch(getNewOptions(['degreeList', res[2].response]));
      this.props.dispatch(getNewOptions(['workAuthList', res[3].response]));
      this.props.dispatch(getNewOptions(['industryList', res[4].response]));
    });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.location !== state.preLocation) {
      return {
        preLocation: props.location,
        stepIndex:
          (props.location.state && props.location.state.stepIndex) || 0,
        candidate: props.candidate,
      };
    }
    return null;
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  getStepContent() {
    const { candidate, stepIndex } = this.state;
    const { hasResume, t } = this.props;

    switch (stepIndex) {
      case 0:
        return (
          <div className="vertical-layout columns">
            <div id="basicInfo"></div>
            <Typography variant="h6">{'Basic Information'}</Typography>
            <BasicInfoForm
              basicInfo={candidate}
              talentFormRef={this.talentForm}
              errorMessage={this.state.errorMessage}
              removeErrorMessage={this.removeErrorMessage}
              t={t}
            />
            <Ownerships t={t} basicInfo={candidate} />
            <ExperienceInfor
              t={t}
              basicInfo={candidate}
              errorMessage={this.state.errorMessage}
              removeErrorMessage={this.removeErrorMessage}
            />
            <Skills t={t} basicInfo={candidate} />
            <CandidatePrefence
              t={t}
              basicInfo={candidate}
              errorMessage={this.state.errorMessage}
              removeErrorMessage={this.removeErrorMessage}
            />
            <EducationInfor
              t={t}
              basicInfo={candidate}
              errorMessage={this.state.errorMessage}
              removeErrorMessage={this.removeErrorMessage}
            />
            <ProjectDes
              t={t}
              basicInfo={candidate}
              errorMessage={this.state.errorMessage}
              removeErrorMessage={this.removeErrorMessage}
            />
          </div>
        );
      default:
        return 'Something wrong, please refresh your browser!';
    }
  }

  //滚动条滚动
  scrollToAnchor = (errorMessage) => {
    if (errorMessage.size > 0) {
      let keys = Object.keys(errorMessage.toJS());
      let basicInfostatus = this.arrayAlignment(keys, basicInfo);
      let experienceInforStatus = this.arrayAlignment(keys, experienceInfor);
      let educationsStatus = this.arrayAlignment(keys, educations);
      let projectsStatus = this.arrayAlignment(keys, projects);
      if (basicInfostatus) {
        let anchorElement = document.getElementById('basicInfo');
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      } else if (!basicInfostatus && experienceInforStatus) {
        let anchorElement = document.getElementById(
          `experienceInfor_${errorMessage.get('experienceInforArr')[0]}`
        );
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      } else if (
        !basicInfostatus &&
        !experienceInforStatus &&
        educationsStatus
      ) {
        let anchorElement = document.getElementById(
          `educations_${errorMessage.get('educationsArr')[0]}`
        );
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      } else if (
        !basicInfostatus &&
        !experienceInforStatus &&
        !educationsStatus &&
        projectsStatus
      ) {
        let anchorElement = document.getElementById(
          `projects_${errorMessage.get('projectsArr')[0]}`
        );
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    }
  };

  arrayAlignment = (arr1, arr2) => {
    for (var i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) > 0) return true;
    }
  };

  handleSubmit = () => {
    const isLinkedin =
      /(?:https?:\/\/)?(?:(?:www|[a-z]{2})\.)?linkedin\.com\/(?:in|talent\/profile|public-profile\/in|chatin\/wnc\/in|mwlite\/in)\/([^^/ :?？=—*&!！`$)(）（<>©|}{@#]{3,900})/i;
    const isFaceBook =
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(\w[a-zA-Z0-9._-]*)/i;
    let { candidate } = this.state;
    const basicForm = this.talentForm.current;
    let errorMessage = BasicInfoForm.validateForm(basicForm, this.props.t);
    this.scrollToAnchor(errorMessage);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    candidate = Immutable.Map(BasicInfoForm.getTalentBasicFromForm(basicForm));
    this.setState({
      processing: true,
      checkingDuplication: true,
    });

    let newCandidate = candidate.toJS();
    let contactArr = newCandidate.contacts;

    contactArr.map((item) => {
      if (item.type === 'LINKEDIN') {
        if (!item.details && item.contact) {
          let linkedInValue = item.contact.match(isLinkedin);
          if (linkedInValue) {
            item.details = item.contact;
            item.contact = linkedInValue[1];
          }
        } else if (item.details && !item.contact) {
          let linkedInValue = item.details.match(isLinkedin);
          if (linkedInValue) {
            item.contact = linkedInValue[1];
          }
        }
      }
      if (item.type === 'FACEBOOK') {
        if (!item.details && item.contact) {
          let linkedInValue = item.contact.match(isFaceBook);
          if (linkedInValue) {
            item.details = item.contact;
            item.contact = linkedInValue[1];
          }
        } else if (item.details && !item.contact) {
          let facebookValue = item.details.match(isFaceBook);
          if (facebookValue) {
            item.contact = facebookValue[1];
          }
        }
      }
    });

    // 先判断该候选人在talent库中是否存在，存在提示，不存在创建
    let newContactObj = { contacts: contactArr };
    searchTalentByContacts(newContactObj)
      .then(({ response }) => {
        if (response.length === 0) {
          this.props
            .dispatch(createCandidate(newCandidate))
            .then((talentId) => {
              console.log(talentId);
              this.setState({
                processing: false,
                talentId,
                finished: true,
                checkingDuplication: false,
              });
            })
            .catch((err) => {
              this.setState({ processing: false, checkingDuplication: false });
              this.props.dispatch(showErrorMessage(err));
            });
        } else {
          this.setState({
            checkingDuplication: false,
            processing: false,
            duplication: response,
          });
        }
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
      });
  };

  handleCloseDuplicatedTalentList = () => {
    this.setState({
      duplication: null,
    });
  };

  handleGoBack = () => {
    this.props.history.goBack();
  };

  renderContent() {
    const { processing, finished, stepIndex, talentId } = this.state;
    const { t, recordId, classes } = this.props;

    if (finished) {
      return <Redirect to={`/candidates/detail/${talentId}`} />;
    }

    return (
      <>
        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{ overflow: 'auto', position: 'relative' }}
        >
          <ScrollContainer
            className="container-padding vertical-layout"
            classes={classes}
          >
            {this.getStepContent()}
          </ScrollContainer>
        </div>
        <div className="container-padding">
          <div className="horizontal-layout columns">
            <SecondaryButton onClick={this.handleGoBack}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton onClick={this.handleSubmit} processing={processing}>
              {t('action:create')}
            </PrimaryButton>
          </div>
        </div>
      </>
    );
  }

  render() {
    const { stepIndex, checkingDuplication } = this.state;
    const { t, tReady, reportNS, defaultNS, i18nOptions, classes, ...props } =
      this.props;
    return (
      <>
        {this.renderContent()}
        <Dialog open={checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{'Checking Duplication'}</Typography>
          </DialogContent>
        </Dialog>
        <DuplicatedTalentList
          open={Boolean(this.state.duplication)}
          onClose={this.handleCloseDuplicatedTalentList}
          talentList={this.state.duplication}
          t={t}
          dispatch={props.dispatch}
        />
      </>
    );
  }
}

CandidateReviewForm.propTypes = {
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  candidate: PropTypes.instanceOf(Immutable.Map).isRequired,
};
CandidateReviewForm.defaultProps = {
  candidate: Immutable.fromJS({
    resumes: [],
    certificates: [],
  }),
};

export default withTranslation(['action', 'message', 'field'])(
  connect()(withStyles(styles)(CandidateReviewForm))
);
