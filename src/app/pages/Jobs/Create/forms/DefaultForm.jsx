import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import {
  upsertJob,
  uploadJobDescription,
  getJobKeywordsByJD,
} from '../../../../actions/jobActions';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import JobBasicForm from '../../JobBasicForm';
import JobDescription from '../../JobDescriptionRich';
import JobLayout from '../../../../components/particial/JobLayout';
import AddUsersOnCreate from '../AddUsersOnCreate';
import Dialog from '@material-ui/core/Dialog';
import { showErrorMessage } from '../../../../actions';
import moment from 'moment-timezone';

class JobCreate extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errorMessage: Immutable.Map(),
      job: Immutable.Map(),
      visible: false,
      creating: false,
      parsing: false,
      uploading: false,
      isOriginal: true,
      publicDesc: '',

      openAddUser: false,
      jobId: null,
    };
    this.editor = React.createRef();
    this.jobForm = React.createRef();
    this.uploader = React.createRef();
  }

  handleCreateJob = (e) => {
    e.preventDefault();
    const createJobForm = e.target;
    const { dispatch, t, history } = this.props;

    let errorMessage = this._validateForm(createJobForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    let startDate = moment(createJobForm.startDate.value).valueOf();
    let endDate = moment(createJobForm.endDate.value).valueOf();
    if (startDate > endDate) {
      this.props.dispatch(
        showErrorMessage('The end time cannot be less than the start time')
      );
      return;
    }

    const job = {
      code: createJobForm.code.value,
      status: createJobForm.status.value,
      jobType: createJobForm.jobType.value,
      priority: createJobForm.priority && createJobForm.priority.value,
      visible: false,
      internal: createJobForm.internal.checked,

      title: createJobForm.title.value,
      company: createJobForm.company.value,
      companyId: createJobForm.companyId.value,
      department: createJobForm.department.value,
      divisionId: createJobForm.divisionId.value,

      addressLine: createJobForm.addressLine.value,

      city: createJobForm.city.value,
      province: createJobForm.province.value,
      country: createJobForm.country.value,
      zipcode: createJobForm.zipcode.value,

      billRateFrom: createJobForm.billRateFrom.value || 0,
      billRateTo: createJobForm.billRateTo.value || 0,
      billRateUnitType: createJobForm.billRateUnitType.value || 'HOURLY',

      payRateFrom: createJobForm.payRateFrom.value || 0,
      payRateTo: createJobForm.payRateTo.value || 0,
      payRateUnitType: createJobForm.payRateUnitType.value || 'HOURLY',

      postingTime: createJobForm.postingTime.value,
      startDate: createJobForm.startDate.value,
      endDate: createJobForm.endDate.value,
      maxSubmissions: createJobForm.maxSubmissions.value || 0,
      openings: createJobForm.openings.value || 1,

      expLevels: createJobForm.expLevels.value
        ? createJobForm.expLevels.value
            .split(',')
            .map((el) => el.trim())
            .filter((el) => el)
        : null,
      tags: Array.from(createJobForm.tags)
        .reduce((res, tag) => {
          if (tag.checked) {
            res.push(tag.value);
          }
          return res;
        }, [])
        .join(','),

      keywords: createJobForm.keywords.value,
      requiredKeywords: createJobForm.requiredKeywords.value,

      jdText: createJobForm.jdText.value,
      publicDesc: createJobForm.publicDesc.value,

      // parsedData
      skills: this.state.job.get('skills'),
      boolstr: this.state.job.get('boolstr'),
      minimumDegree: this.state.job.get('minimumDegree'),
      preferredDegrees: this.state.job.get('preferredDegrees'),
      leastExperienceYear: this.state.job.get('leastExperienceYear'),
      mostExperienceYear: this.state.job.get('mostExperienceYear'),
    };
    if (createJobForm.hiringManagerId) {
      job.hiringManagerId = createJobForm.hiringManagerId.value || null;
    }
    if (createJobForm.hrId) {
      job.hrId = createJobForm.hrId.value || null;
    }
    this.setState({ creating: true });

    dispatch(upsertJob(job))
      .then((jobId) =>
        this.setState({
          creating: false,
          openAddUser: true,
          jobId,
        })
      )
      .catch(() => this.setState({ creating: false }));
  };

  handleNavToJobDetail = () => {
    this.props.history.replace(`detail/${this.state.jobId}`);
  };

  handleUploadJobDescription = (e) => {
    const fileInput = e.target;
    const jdFile = fileInput.files[0];
    if (jdFile) {
      this.setState({ uploading: true });
      this.props.dispatch(uploadJobDescription(jdFile)).then(
        (newJob) => {
          if (newJob) {
            fileInput.value = '';
            const oldJob = this._getCurrentJob();
            const mergedJob = this._mergeJob(newJob, oldJob);
            console.log('handleUploadJobDescription', mergedJob);
            const job = Immutable.fromJS(mergedJob);

            this.setState({
              uploading: false,
              job,
              errorMessage: this.state.errorMessage.clear(),
            });
          } else {
            this.setState({
              uploading: false,
              errorMessage: this.state.errorMessage.clear(),
            });
          }
        },
        () => {
          fileInput.value = '';
          this.setState({ uploading: false });
        }
      );
    }
  };

  handleParseJD = (jd) => {
    // console.log(JSON.stringify(jd));
    const { jdText } = jd;
    if (jdText) {
      this.setState({ parsing: true });
      return this.props.dispatch(getJobKeywordsByJD(jdText)).then(
        (newJob) => {
          if (newJob) {
            const oldJob = this._getCurrentJob();
            const mergedJob = this._mergeJob(newJob, oldJob);
            mergedJob.jdText = jdText;
            mergedJob.publicDesc = jd.publicDesc;
            const job = Immutable.fromJS(mergedJob);
            this.setState({
              parsing: false,
              job,
              errorMessage: this.state.errorMessage.clear(),
            });
          } else {
            this.setState({
              parsing: false,
              errorMessage: this.state.errorMessage.clear(),
            });
          }
        },
        () => {
          this.setState({ parsing: false });
        }
      );
    }
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();

    if (!form.title.value) {
      errorMessage = errorMessage.set('title', t('message:titleIsRequired'));
    }

    if (!form.companyId.value) {
      errorMessage = errorMessage.set(
        'company',
        t('message:companyIsRequired')
      );
    }
    if (
      form.hiringManagerId &&
      form.hrId &&
      !form.hiringManagerId.value &&
      !form.hrId.value
    ) {
      errorMessage = errorMessage.set(
        'hiringManager',
        t('message:hiringManagerIsRequired')
      );
    }
    if (!form.country.value) {
      errorMessage = errorMessage.set(
        'country',
        t('message:countryIsRequired')
      );
    }

    if (!form.province.value) {
      errorMessage = errorMessage.set(
        'province',
        t('message:provinceIsRequired')
      );
    }

    if (!form.city.value) {
      errorMessage = errorMessage.set('city', t('message:cityIsRequired'));
    }

    if (form.addressLine.value && form.addressLine.value.length > 100) {
      errorMessage = errorMessage.set(
        'addressLine',
        t('message:addressIsTooLong')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _getCurrentJob = () => {
    const createJobForm = this.jobForm.current;
    if (createJobForm) {
      return {
        code: createJobForm.code.value,
        status: createJobForm.status.value,
        jobType: createJobForm.jobType.value,
        priority: createJobForm.priority && createJobForm.priority.value,
        visible: false,
        internal: createJobForm.internal.checked,

        title: createJobForm.title.value,
        company: createJobForm.company.value,
        companyId: createJobForm.companyId.value,
        divisionId: createJobForm.divisionId.value,
        department: createJobForm.department.value,

        addressLine: createJobForm.addressLine.value,

        city: createJobForm.city.value,
        province: createJobForm.province.value,
        country: createJobForm.country.value,
        zipcode: createJobForm.zipcode.value,

        billRateFrom: createJobForm.billRateFrom.value || 0,
        billRateTo: createJobForm.billRateTo.value || 0,
        billRateUnitType: createJobForm.billRateUnitType.value,

        payRateFrom: createJobForm.payRateFrom.value || 0,
        payRateTo: createJobForm.payRateTo.value || 0,
        payRateUnitType: createJobForm.payRateUnitType.value,

        postingTime: createJobForm.postingTime.value,
        startDate: createJobForm.startDate.value,
        endDate: createJobForm.endDate.value,
        maxSubmissions: createJobForm.maxSubmissions.value || 0,
        openings: createJobForm.openings.value || 1,

        expLevel: createJobForm.expLevel && createJobForm.expLevel.value,
        tags: Array.from(createJobForm.tags)
          .reduce((res, tag) => {
            if (tag.checked) {
              res.push(tag.value);
            }
            return res;
          }, [])
          .join(','),

        keywords: createJobForm.keywords.value,
        requiredKeywords: createJobForm.requiredKeywords.value,
      };
    }
  };

  _mergeJob = (newJob, oldJob) => {
    let job = {};
    Object.keys(newJob).forEach((key) => {
      if (newJob[key]) {
        job[key] = newJob[key];
      }
    });
    return Object.assign({}, oldJob, newJob);
  };

  render() {
    const { errorMessage, job, openAddUser } = this.state;
    const { t, i18n, ...props } = this.props;
    console.log('job create props', props);
    return (
      <>
        <form
          className="flex-child-auto flex-container flex-dir-column"
          onSubmit={this.handleCreateJob}
          ref={this.jobForm}
          style={{ overflow: 'auto', margin: -16, padding: 16 }}
        >
          <JobLayout>
            <Paper className=" flex-container flex-dir-column ">
              <div
                className="flex-child-auto container-padding"
                style={{ overflow: 'auto' }}
              >
                <JobBasicForm
                  job={job}
                  t={t}
                  errorMessage={errorMessage}
                  removeErrorMsgHandler={this.removeErrorMessage}
                />
              </div>

              <div>
                <Divider />
                <div className="container-padding">
                  <PrimaryButton
                    type="submit"
                    style={{ minWidth: 120 }}
                    processing={this.state.creating}
                  >
                    {t('action:createJob')}
                  </PrimaryButton>
                </div>
              </div>
            </Paper>

            <Paper
              className="flex-container flex-dir-column container-padding  vertical-layout"
              style={{ overflow: 'hidden' }}
            >
              <div className="horizontal-layout">
                <PrimaryButton
                  component="label"
                  style={{ width: 220 }}
                  processing={this.state.uploading}
                  onChange={this.handleUploadJobDescription}
                >
                  {t('action:uploadJobDescription')}
                  <input
                    ref={this.uploader}
                    id="jd"
                    type="file"
                    style={{ display: 'none' }}
                  />
                </PrimaryButton>

                {/*  <PrimaryButton*/}
                {/*    style={{ width: 220 }}*/}
                {/*    disabled={!isOriginal}*/}
                {/*    processing={this.state.parsing}*/}
                {/*    onClick={this.handleParseJD}*/}
                {/*  >*/}
                {/*    {t('action:parseJD')}*/}
                {/*  </PrimaryButton>*/}
              </div>
              <div
                className="flex-child-auto flex-container flex-dir-column"
                style={{ overflow: 'inherit' }}
              >
                <JobDescription
                  key={job.get('lastModifiedDate')}
                  job={job}
                  t={t}
                  onParseJD={this.handleParseJD}
                  lang={i18n.language}
                  parsing={this.state.parsing}
                />
              </div>
            </Paper>
          </JobLayout>
        </form>
        <Dialog open={openAddUser} fullWidth maxWidth="md">
          <AddUsersOnCreate
            t={t}
            jobId={this.state.jobId}
            handleClose={this.handleNavToJobDetail}
          />
        </Dialog>
      </>
    );
  }
}

JobCreate.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTranslation(['action', 'message', 'field'])(
  connect()(JobCreate)
);
