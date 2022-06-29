import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { makeCancelable, getMemoFromApplication } from '../../../../utils';
import {
  getResumesByTalentId,
  addResume,
  uploadResumeOnly,
} from '../../../actions/talentActions';
import talentResumeSelector from '../../../selectors/talentResumeSelector';
import {
  reactiveApplication,
  updateDashboardApplStatus,
} from '../../../actions/applicationActions';

import { showErrorMessage } from '../../../actions';
import {
  getApplicationStatusLabel,
  canUpdateResume,
  currency as currencyOptions,
} from '../../../constants/formOptions';

import Select from 'react-select';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ViewResume from '@material-ui/icons/RemoveRedEye';

import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import PotentialButton from '../../particial/PotentialButton';
import FormTextArea from '../../particial/FormTextArea';
import ApplicationInfoWithCommissions from '../views/ApplicationInfoWithCommissions';
import ViewResumeInAddActivity from '../../forms/AddActivity/ViewResumeInAddActivity';
import Loading from '../../particial/Loading';

class AddActivityReactiveForm extends Component {
  constructor(props) {
    super(props);

    const { application, resumes } = props;
    this.state = {
      errorMessage: Immutable.Map(),
      selectedResume: resumes.find(
        (value) => value.id === application.get('resumeId')
      ),
      note: '',
      uploading: false,
      showedResume: false,

      processing: false,
      fetching: true,
    };
    this.fTimer = setTimeout(() => this.setState({ fetching: false }), 500);
  }

  componentWillUnmount() {
    if (this.resumetask) {
      this.resumetask.cancel();
    }
  }

  componentDidMount() {
    const { dispatch, activityFromTalent, application } = this.props;

    if (!activityFromTalent) {
      // load talent resume
      this.resumetask = makeCancelable(
        dispatch(getResumesByTalentId(application.get('talentId')))
      );
      this.resumetask.promise.then(() => {
        this.setState({
          selectedResume: this.props.resumes.find(
            (value) => value.id === application.get('resumeId')
          ),
        });
      });
    }
  }

  handleCommissionsUpdate = (commissions) => {
    this.setState({ commissions });
  };

  inputChangeHandler = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleResumeUpload = (e) => {
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    const {
      dispatch,
      application: { talentId },
    } = this.props;
    if (resumeFile) {
      fileInput.value = '';
      this.setState({ uploading: true });
      dispatch(uploadResumeOnly(resumeFile))
        .then((response) => {
          response.talentId = this.props.application.toJS().talentId;
          return dispatch(addResume(response));
        })
        .then(() => {
          this.setState({
            selectedResume: this.props.resumes[0],
          });
        })
        .catch((err) => dispatch(showErrorMessage(err)))
        .finally(() => {
          this.setState({ uploading: false });
        });
    }
  };

  showResume = () => {
    this.setState({ showResume: true });
  };

  closeViewResume = () => {
    this.setState({ showResume: false });
  };

  submitAddCandidateActivity = (e) => {
    e.preventDefault();
    const { selectedResume, note, currency, rateUnitType, agreedPayRate } =
      this.state;
    const {
      dispatch,
      t,
      formType,
      application: oldApplication,
      cancelAddActivity,
    } = this.props;
    const status =
      formType === 'updateResume' ||
      formType === 'addNote' ||
      formType === 'preStatus'
        ? oldApplication.get('status')
        : formType;
    const activity = {
      id: oldApplication.get('id'),
      status: oldApplication.get('status'),
      memo: note,
    };
    let errorMessage = this._validateForm(activity, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true });
    dispatch(reactiveApplication(activity, oldApplication.get('id')))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        cancelAddActivity();
        dispatch(
          updateDashboardApplStatus(newApplication.id, newApplication.status)
        );
        dispatch({ type: 'UPDATE_DB_DATA' });
      })
      .catch((err) => {
        this.setState({ processing: false });
        dispatch(showErrorMessage(err));
      });
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject, t) => {
    let errorMessage = Immutable.Map();
    if (!activityObject.status) {
      errorMessage = errorMessage.set('status', t('message:statusIsRequired'));
    }
    if (!activityObject.memo) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (activityObject.memo.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage.size > 0 && errorMessage;
  };

  handleResumeChange = (newValue) => {
    this.setState(({ selectedResume }) => ({
      selectedResume: newValue || selectedResume,
    }));
  };

  render() {
    const { t, cancelAddActivity, resumes, application, formType } = this.props;

    const {
      showResume,
      uploading,
      selectedResume,
      note,
      errorMessage,
      fetching,
      processing,
    } = this.state;

    if (fetching) {
      return <Loading />;
    }

    if (showResume) {
      return (
        <ViewResumeInAddActivity
          resume={Immutable.fromJS(selectedResume)}
          t={t}
          close={this.closeViewResume}
        />
      );
    }

    return (
      <Fragment>
        {/* 标题 */}
        <DialogTitle>
          Pre Status: {getApplicationStatusLabel(application.get('status'))}
        </DialogTitle>

        {/* 表单内容 */}
        <DialogContent>
          <form onSubmit={this.submitAddCandidateActivity} id="activityForm">
            <ApplicationInfoWithCommissions
              applicationId={application.get('id')}
              onCommissionsUpdate={this.handleCommissionsUpdate}
              t={t}
            />
            <section>
              <Divider style={{ margin: '20px -24px 15px' }} />
              {/*
              <div className="row expanded">
                <div className="columns">
                  <FormReactSelectContainer
                    label={t('field:resume')}
                    errorMessage={errorMessage.get('resumeId')}
                    icon={
                      selectedResume ? (
                        <ViewResume onClick={this.showResume} />
                      ) : null
                    }
                  >
                    <Select
                      disabled={!canUpdateResume(application.get('status'))}
                      name="resumeSelect"
                      valueKey={'id'}
                      labelKey={'name'}
                      value={selectedResume}
                      onChange={this.handleResumeChange}
                      options={resumes}
                      searchable={false}
                      autoBlur={true}
                      clearable={false}
                      onFocus={() => this._removeErrorMsgHandler('resumeId')}
                    />
                  </FormReactSelectContainer>
                  <input
                    type="hidden"
                    name="resumeId"
                    value={selectedResume ? selectedResume.id : ''}
                  />
                </div>

                <div style={{ width: 160 }}>
                  <div className="columns">
                    {canUpdateResume(application.get('status')) ? (
                      <PotentialButton
                        component="label"
                        size="small"
                        style={{
                          marginTop: 23,
                        }}
                        fullWidth
                        processing={uploading}
                        onChange={this.handleResumeUpload}
                      >
                        {t('action:uploadResume')}
                        <input
                          key="resume"
                          type="file"
                          style={{ display: 'none' }}
                        />
                      </PotentialButton>
                    ) : (
                      <PotentialButton
                        size="small"
                        style={{
                          marginTop: 23,
                        }}
                        fullWidth
                        onClick={this.showResume}
                      >
                        {t('action:view')}
                      </PotentialButton>
                    )}
                  </div>
                </div>
              </div>
              */}

              <div className="row expanded">
                <div className="small-12 columns">
                  <FormTextArea
                    errorMessage={errorMessage.get('note')}
                    name="note"
                    label={t('field:note')}
                    rows="5"
                    placeholder={getMemoFromApplication(application)}
                    value={note}
                    onChange={this.inputChangeHandler}
                    onFocus={() => this._removeErrorMsgHandler('note')}
                  />
                </div>
              </div>
            </section>
          </form>
        </DialogContent>
        <Divider />

        {/* 修改状态的按钮 （取消 提交） */}
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={cancelAddActivity}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="activityForm"
              processing={processing}
            >
              {t('action:submit')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </Fragment>
    );
  }
}

AddActivityReactiveForm.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state, { application }) => {
  return {
    resumes: talentResumeSelector(state, application.get('talentId')).toJS(),
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStoreStateToProps)(AddActivityReactiveForm);
