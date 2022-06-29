import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import * as candidateActions from '../../../actions/talentActions';
import { showErrorMessage } from '../../../actions';
import clsx from 'clsx';
import Immutable from 'immutable';
import talentResumeSelector from '../../../selectors/talentResumeSelector';
import { searchTalentByContacts } from '../../../../apn-sdk';
import { distSelect, distSelectZh } from '../../../../apn-sdk/newSearch';
import { getNewOptions } from '../../../actions/newCandidate';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import BasicInfoForm from '../newCreate/Basicform/BasicInfoForm3';
import Loading from '../../../components/particial/Loading';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import ResumeFrame from '../../../components/particial/ResumeFrame/LoadableResumeFrame';

import Ownerships from '../newCreate/Basicform/Ownerships';
import ExperienceInfor from '../newCreate/Basicform/experienceInfor';
import Skills from '../newCreate/Basicform/skills';
import CandidatePrefence from '../newCreate/Basicform/CandidatePreference';
import EducationInfor from '../newCreate/Basicform/educationInfor';
import ProjectDes from '../newCreate/Basicform/projectDes';
import { getApplicationsByTalentId } from '../../../actions/talentActions';
import DuplicatedTalentList from '../newCreate/duplicatedTalentList/TalentDuplications';
import { getStartByTalentId } from '../../../actions/startActions';
const styles = (theme) => ({
  container: {
    height: '100%',
    display: 'grid',
    gridGap: '16px',
    gridAutoColumns: 'minmax(444px, 700px)',
    gridAutoRows: '100%',
    alignContent: 'stretch',
    '& > div': {
      overflow: 'auto',
    },
    gridAutoFlow: 'row', //
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'column', //
    },
  },
  absolute: {
    position: 'absolute',
  },
  root: {
    position: 'relative',
    overflow: 'hidden',
  },
});

class CandidateEditForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      basicSubstatus: true,
      processing: false,
      duplication: null,
      checkingDuplication: false,
      candidate: props.candidate,
      errorMessage: Immutable.Map(),
      emaiStatus: false,
      bouncedStatu: false,
      inactiveStatus: false,
    };
    this.talentForm = React.createRef();
  }
  componentDidUpdate(
    prevProps: Readonly<P>,
    prevState: Readonly<S>,
    snapshot: SS
  ): void {
    if (
      this.props.candidate &&
      !this.props.candidate.equals(prevState.candidate)
    ) {
      this.setState({ candidate: this.props.candidate });
    }
  }

  componentDidMount() {
    console.timeEnd('talent edit');
    this.fetchData();
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
      distSelectZh(1),
      distSelectZh(117),
    ]).then((res) => {
      this.props.dispatch(getNewOptions(['jobFounctionList', res[0].response]));
      this.props.dispatch(getNewOptions(['languageList', res[1].response]));
      this.props.dispatch(getNewOptions(['degreeList', res[2].response]));
      this.props.dispatch(getNewOptions(['workAuthList', res[3].response]));
      this.props.dispatch(getNewOptions(['industryList', res[4].response]));
      this.props.dispatch(
        getNewOptions(['jobFounctionListZh', res[5].response])
      );
      this.props.dispatch(getNewOptions(['industryListZh', res[6].response]));
    });
  };

  fetchData() {
    const { candidateId, dispatch } = this.props;
    dispatch(candidateActions.getTalent(candidateId));
    dispatch(candidateActions.getResumesByTalentId(candidateId));
    // 候选人详情页手动刷新网页的时候，会丢失application，所以这里重新调用一下
    dispatch(getApplicationsByTalentId(candidateId)).finally(() =>
      this.setState({ loadingApplications: false })
    );
    // 候选人详情页手动刷新网页的时候，会丢失applicationID，所以这里重新调用一下
    dispatch(getStartByTalentId(candidateId));
  }

  handleCancel = () => {
    const { disableBack, history, candidateId } = this.props;
    this.setState({
      checkingDuplication: false,
    });
    if (disableBack) {
      history.replace(`/candidates/detail/${candidateId}`);
    } else {
      this.props.history.goBack();
    }
  };
  conChange = () => {
    this.setState({
      emaiStatus: false,
    });
  };
  getSubStatus = () => {
    this.setState(
      {
        basicSubstatus: false,
      },
      () => {
        this.handleSubmit();
      }
    );
  };
  getEmailBouncedStatu = (data) => {
    this.setState({
      bouncedStatu: data,
    });
  };
  getEmaiInactiveStatu = (data) => {
    this.setState({
      inactiveStatus: data,
    });
  };
  handleSubmit = () => {
    let { candidate } = this.state;
    const { candidateId, dispatch, t } = this.props;
    const basicForm = this.talentForm.current;
    console.log(basicForm);
    let errorMessage = BasicInfoForm.validateForm(basicForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    candidate = Immutable.Map(BasicInfoForm.getTalentBasicFromForm(basicForm));
    let conAlist = candidate.toJS();
    let conBlist = this.props.contactsList;
    let arrA = [];
    let arrB = [];
    conAlist?.contacts.forEach((item) => {
      if (item.type === 'EMAIL') {
        arrA.push(item);
      }
    });
    conBlist?.contacts.forEach((item) => {
      if (item.type === 'EMAIL') {
        arrB.push(item);
      }
    });
    console.log(this.state);
    console.log(this.props);
    if (
      arrA[0]?.contact !== arrB[0]?.contact &&
      // this.props.contactsList.isAM &&
      this.state.basicSubstatus &&
      this.state.bouncedStatu &&
      !this.state.inactiveStatus
    ) {
      this.setState({
        emaiStatus: true,
      });
      return;
    }
    this.setState({
      processing: true,
      checkingDuplication: true,
    });
    let contactArr = candidate.toJS().contacts;
    console.log(contactArr);

    // 先判断该候选人在talent库中是否存在，存在提示，不存在创建
    searchTalentByContacts(contactArr)
      .then(({ response }) => {
        if (response.length === 0) {
          this.props
            .dispatch(
              candidateActions.newUpdateCandidate(candidate, candidateId)
            )
            .then(this.handleCancel)
            .catch((err) => {
              this.setState({
                processing: false,
                checkingDuplication: false,
              });
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
        this.setState({
          processing: false,
          checkingDuplication: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleCloseDuplicatedTalentList = () => {
    this.setState({
      duplication: null,
    });
  };

  render() {
    const { processing, errorMessage, checkingDuplication, emaiStatus } =
      this.state;
    const { t, candidate, classes, resume, candidateId } = this.props;
    console.log(candidate && candidate.toJS());
    if (!candidate || !candidate.get('id')) {
      return <Loading />;
    }

    return (
      <div className={classes.container}>
        <Paper className={clsx('flex-container flex-dir-column', classes.root)}>
          <div
            className="flex-child-auto container-padding vertical-layout"
            style={{ overflow: 'auto' }}
          >
            <div className="vertical-layout columns">
              <div className="flex-container align-justify align-middle">
                <Typography variant="h6">{t('common:basicInfo')}</Typography>
                {candidate.get('lastModifiedDate')}
              </div>

              <BasicInfoForm
                getEmaiInactiveStatu={this.getEmaiInactiveStatu}
                getEmailBouncedStatu={this.getEmailBouncedStatu}
                getSubStatus={this.getSubStatus}
                conChange={this.conChange}
                emaiStatus={emaiStatus}
                basicInfo={candidate}
                talentFormRef={this.talentForm}
                errorMessage={errorMessage}
                removeErrorMessage={this.removeErrorMessage}
                t={t}
                protalStatu={true}
                candidateId={candidateId}
              />
              <Ownerships t={t} basicInfo={candidate} />
              <ExperienceInfor
                t={t}
                basicInfo={candidate}
                errorMessage={errorMessage}
                removeErrorMessage={this.removeErrorMessage}
              />
              <Skills t={t} basicInfo={candidate} />
              <CandidatePrefence
                t={t}
                basicInfo={candidate}
                errorMessage={errorMessage}
                removeErrorMessage={this.removeErrorMessage}
              />
              <EducationInfor
                t={t}
                basicInfo={candidate}
                errorMessage={errorMessage}
                removeErrorMessage={this.removeErrorMessage}
              />
              <ProjectDes
                t={t}
                basicInfo={candidate}
                errorMessage={errorMessage}
                removeErrorMessage={this.removeErrorMessage}
              />
            </div>
          </div>
          <Divider />
          <div className="container-padding">
            <div className="horizontal-layout columns">
              <SecondaryButton onClick={this.handleCancel}>
                {t('action:cancel')}
              </SecondaryButton>
              <PrimaryButton
                onClick={this.handleSubmit}
                processing={processing}
              >
                {t('action:submit')}
              </PrimaryButton>
            </div>
          </div>
        </Paper>

        {resume && (
          <Paper className="flex-child-auto">
            <ResumeFrame resume={resume} />
          </Paper>
        )}
        <Dialog open={checkingDuplication}>
          <DialogContent>
            <Loading />
            <Typography>{t('action:Checking Duplication')}</Typography>
          </DialogContent>
        </Dialog>
        <DuplicatedTalentList
          open={Boolean(this.state.duplication)}
          onClose={this.handleCloseDuplicatedTalentList}
          talentList={this.state.duplication}
          t={t}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const candidateId = match.params.candidateId;
  const candidate = state.model.talents.get(candidateId);
  const disableBack =
    (state.router && state.router.location.key) ===
    (state.controller.routerStatus &&
      state.controller.routerStatus.location.key);
  const contactsList = state.controller.newCandidateJob.get(
    'basicInformationDetail'
  );
  return {
    candidateId,
    candidate,
    resume: talentResumeSelector(state, candidateId).get(0),
    disableBack,
    contactsList,
  };
}

export default withTranslation('action')(
  connect(mapStoreStateToProps)(withStyles(styles)(CandidateEditForm))
);
