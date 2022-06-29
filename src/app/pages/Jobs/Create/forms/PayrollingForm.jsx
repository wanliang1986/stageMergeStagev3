import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { upsertJob } from '../../../../actions/jobActions';
import { getJobTypeLabel } from '../../../../constants/formOptions';
import { JOB_TYPES } from '../../../../constants/formOptions';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { showErrorMessage } from '../../../../actions/';

import InfoIcon from '@material-ui/icons/Info';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import JobBasicForm from './JobBasicFormPayrolling';
import JobDescription from '../../JobDescriptionRich3';
import JobLayout from '../../../../components/particial/JobLayout2';
import MyTooltip from '../../../../components/MyTooltip/myTooltip';
import ToolInfor from '../../toolTip';

class JobCreate extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log(this.props.location);
    const job = this.props.location.state && this.props.location.state.job;
    this.state = {
      errorMessage: Immutable.Map(),
      job: Immutable.fromJS(job),
      visible: false,
      creating: false,
      parsing: false,
      uploading: false,
      isOriginal: true,
      publicDesc: '',

      openAddUser: false,
      jobId: null,
    };
    this.jobForm = React.createRef();
  }

  handleCreateJob = (e) => {
    // e.preventDefault();
    e.stopPropagation();
    const createJobForm = this.jobForm.current;
    // const createJobForm = e.target;
    const { dispatch, t, history } = this.props;

    let errorMessage = this._validateForm(createJobForm, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    if (
      createJobForm.jdText.value &&
      createJobForm.jdText.value.length * 1 > 16380
    ) {
      return this.props.dispatch(
        showErrorMessage(
          'Description exceeds the number of words in the text box'
        )
      );
    }

    const job = {
      company: {
        id: createJobForm.companyId.value, //ok
        name: createJobForm.company.value, //ok
        industry: createJobForm.companyIndustry.value,
      },
      department: createJobForm.department.value, //ok
      jobType: 'PAY_ROLL',
      title: createJobForm.title.value, //ok
      jdText: createJobForm.jdText.value,
      publicDesc:
        createJobForm.publicDesc.value ===
        '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>'
          ? null
          : createJobForm.publicDesc.value,
      jdUrl: '',
      clientContactCategory: createJobForm.clientcontact.value, //ok
      clientContactName: {
        id: createJobForm.clientcontactid.value, //ok,
        name: createJobForm.clientcontactname.value,
      },
      locations:
        createJobForm.location.value &&
        JSON.parse(createJobForm.location.value),
      uuid: this.state.job.toJS().uuid ? this.state.job.toJS().uuid : null,
      assignedUsers:
        createJobForm.assignedUsers.value &&
        JSON.parse(createJobForm.assignedUsers.value),
    };
    this.setState({ creating: true });

    this.props.history.replace(
      this.props.location.search,
      Object.assign({}, this.props.location.state, {
        job,
      })
    );

    dispatch(upsertJob(job))
      .then((jobId) => {
        this.setState({
          creating: false,
          openAddUser: true,
          jobId,
        });
        this.props.history.push('/jobs');
      })
      .catch(() => this.setState({ creating: false }));
  };

  handleNavToJobDetail = () => {
    this.props.history.replace(`detail/${this.state.jobId}`);
  };

  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();

    if (!form.title.value) {
      errorMessage = errorMessage.set(
        'title',
        t('message:Job title is required')
      );
    }
    if (form.title.value && form.title.value.length > 100) {
      errorMessage = errorMessage.set(
        'title',
        t('message:Job title length should be less than 100')
      );
    }
    if (form.department.value && form.department.value.length > 100) {
      errorMessage = errorMessage.set(
        'department',
        t('message:Department length should be less than 100')
      );
    }

    if (!form.companyId.value) {
      errorMessage = errorMessage.set(
        'company',
        t('message:companyIsRequired')
      );
    }

    if (!form.clientcontact.value) {
      errorMessage = errorMessage.set(
        'clientcontact',
        t('message:ClientContact is required')
      );
    }
    if (!form.clientcontactname.value) {
      errorMessage = errorMessage.set(
        'clientcontactname',
        t('message:ContactName is required')
      );
    }
    let locationFlag = false;
    if (form.location.value) {
      const location = JSON.parse(form.location.value);
      location &&
        location.map((item) => {
          if (!item.country && !item.location && !item.province && !item.city) {
            locationFlag = true;
          }
        });
    } else {
      errorMessage = errorMessage.set(
        'location',
        t('message:Location is required')
      );
    }
    if (locationFlag) {
      errorMessage = errorMessage.set(
        'location',
        t('message:Location is required')
      );
    }
    const assignedUsers = JSON.parse(form.assignedUsers.value);
    let assignedFlag = false;
    let assignedOwnerNum = 0; //判断Owner出现的次数,只能出现一次,不可没有或者多个
    assignedUsers.map((item) => {
      if (!item.permission || !item.userId) {
        assignedFlag = true;
      }
      if (item.permission === 'AM') {
        assignedOwnerNum++;
      }
    });
    if (assignedFlag) {
      errorMessage = errorMessage.set(
        'assignedUsers',
        t('message:AssignedUsers is required')
      );
    }
    if (assignedOwnerNum !== 1) {
      errorMessage = errorMessage.set(
        'assignedUsers',
        t('message:Account Manager is required one only')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  render() {
    const { errorMessage, job } = this.state;
    const { t, i18n, ...props } = this.props;
    console.log('job create props', props);
    return (
      <>
        <form
          className="flex-child-auto flex-container flex-dir-column"
          // onSubmit={this.handleCreateJob}
          ref={this.jobForm}
          style={{ overflow: 'auto', margin: -16, padding: 16 }}
        >
          <JobLayout>
            <Paper className=" flex-container flex-dir-column ">
              <div
                className="flex-child-auto container-padding"
                style={{ overflow: 'auto' }}
              >
                <div className="row expanded">
                  <div
                    style={{
                      marginBottom: 10,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <p
                      style={{
                        color: '#777777',
                        fontSize: 16,
                        marginRight: 10,
                      }}
                    >
                      {this.props.t('tab:Create Job')}:{' '}
                      {this.props.t(
                        `tab:${getJobTypeLabel(JOB_TYPES.Payrolling)}`
                      )}
                    </p>
                    <MyTooltip title={<ToolInfor />}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          borderLeft: '0.5px solid #dee0e3',
                          paddingLeft: 10,
                        }}
                      >
                        <InfoIcon color="disabled" fontSize="small" />
                        <span style={{ color: '#777777', fontSize: 13 }}>
                          {this.props.t('tab:AM Checklist')}
                        </span>
                      </div>
                    </MyTooltip>
                  </div>
                </div>

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
                    type="button"
                    style={{ minWidth: 120 }}
                    processing={this.state.creating}
                    onClick={this.handleCreateJob}
                  >
                    {t('action:create')}
                  </PrimaryButton>
                </div>
              </div>
            </Paper>

            <Paper
              className="flex-container flex-dir-column container-padding "
              style={{ overflow: 'hidden' }}
            >
              <Typography>{t('field:jobDescription')}</Typography>
              <div
                className="flex-child-auto flex-container flex-dir-column"
                style={{ overflow: 'inherit' }}
              >
                <JobDescription
                  key={job.get('lastModifiedDate')}
                  job={job}
                  t={t}
                  lang={i18n.language}
                />
              </div>
            </Paper>
          </JobLayout>
        </form>
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
