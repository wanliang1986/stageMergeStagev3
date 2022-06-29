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
import { distSelect } from '../../../../apn-sdk/newSearch';
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

import DuplicatedTalentList from '../newCreate/duplicatedTalentList/TalentDuplications';

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
      processing: false,
      duplication: null,
      checkingDuplication: false,
      candidate: props.candidate,
      errorMessage: Immutable.Map(),
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
    ]).then((res) => {
      this.props.dispatch(getNewOptions(['jobFounctionList', res[0].response]));
      this.props.dispatch(getNewOptions(['languageList', res[1].response]));
      this.props.dispatch(getNewOptions(['degreeList', res[2].response]));
      this.props.dispatch(getNewOptions(['workAuthList', res[3].response]));
      this.props.dispatch(getNewOptions(['industryList', res[4].response]));
    });
  };

  fetchData() {
    const { candidateId, dispatch } = this.props;
    dispatch(candidateActions.getTalent(candidateId));
    dispatch(candidateActions.getResumesByTalentId(candidateId));
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

  handleSubmit = () => {
    let { candidate } = this.state;
    const { candidateId, dispatch, t } = this.props;
    const basicForm = this.talentForm.current;
    let errorMessage = BasicInfoForm.validateForm(basicForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    candidate = Immutable.Map(BasicInfoForm.getTalentBasicFromForm(basicForm));
    console.log('handleSubmit', candidate.toJS());
    this.setState({
      processing: true,
      checkingDuplication: true,
    });
    let contactArr = candidate.toJS().contacts;
    console.log(contactArr);
    // 先判断该候选人在talent库中是否存在，存在提示，不存在创建
    let newContactObj = { contacts: contactArr, ignoreTalentId: candidateId };
    searchTalentByContacts(newContactObj)
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
    console.time('talent edit');
    const { processing, errorMessage, checkingDuplication } = this.state;

    const { t, candidate, classes, resume } = this.props;
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
                basicInfo={candidate}
                talentFormRef={this.talentForm}
                errorMessage={errorMessage}
                removeErrorMessage={this.removeErrorMessage}
                t={t}
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
            <Typography>{'Checking Duplication'}</Typography>
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
  return {
    candidateId,
    candidate,
    resume: talentResumeSelector(state, candidateId).get(0),
    disableBack,
  };
}

export default withTranslation('action')(
  connect(mapStoreStateToProps)(withStyles(styles)(CandidateEditForm))
);
