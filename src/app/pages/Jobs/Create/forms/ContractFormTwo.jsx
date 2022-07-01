import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { upsertJob } from '../../../../actions/jobActions';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { showErrorMessage } from '../../../../actions/';

import PrimaryButton from '../../../../components/particial/PrimaryButton';
import JobBasicForm from '../../CreatContractForm';
import JobDescription from '../../JobDescriptionRich3';
import JobLayout from '../../../../components/particial/JobLayout';

class JobCreate extends React.Component {
  constructor(props, context) {
    super(props, context);
    const job = this.props.location.state && this.props.location.state.job;
    this.state = {
      errorMessage: Immutable.Map(),
      job: Immutable.Map(job),
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
  // 表单提交
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

    let switchFlagTwo = JSON.parse(createJobForm.switchFlagTwo.value);
    let leastYear = null;
    let mostYear = null;
    if (switchFlagTwo) {
      mostYear = 0;
    } else {
      leastYear = createJobForm.minYears.value
        ? createJobForm.minYears.value
        : null;
      mostYear = createJobForm.maxYears.value
        ? createJobForm.maxYears.value
        : null;
    }

    const job = {
      company: {
        id: createJobForm.companyId.value,
        name: createJobForm.company.value,
        industry: createJobForm.companyIndustry.value,
      },
      department: createJobForm.department.value,
      jobType: 'CONTRACT',
      title: createJobForm.title.value,
      startDate:
        createJobForm.startDate.value &&
        createJobForm.startDate.value + 'T00:00:00Z',
      endDate:
        createJobForm.endDate.value &&
        createJobForm.endDate.value + 'T00:00:00Z',
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
      // 0.edit
      // locatioins: [createJobForm.location.value],
      locations:
        createJobForm.location.value &&
        JSON.parse(createJobForm.location.value),
      //1.edit
      // jobFunctions: ['id', createJobForm.jobfunction.value],
      jobFunctions:
        createJobForm.jobfunction.value &&
        JSON.parse(createJobForm.jobfunction.value),
      //2.edit
      // requiredSkills: [
      //   { skillname: '', score: '' },
      //   { skillname: '', score: '' },
      // ], //ok
      requiredSkills: JSON.parse(createJobForm.requiredskills.value),
      //3.edit
      // assignedUsers: [
      //   {
      //     teamId: '',
      //     permission: '职能',
      //     userId: '',
      //     username: '',
      //     firstName: '',
      //     lastName: '',
      //   },
      // ], //ok
      assignedUsers:
        createJobForm.assignedUsers.value &&
        JSON.parse(createJobForm.assignedUsers.value),
      // 4.edit
      // requiredLanguages: ['id', createJobForm.jobfunction.value],
      requiredLanguages:
        createJobForm.requiredLanguages.value === '[]'
          ? null
          : JSON.parse(createJobForm.requiredLanguages.value),

      //5.edit
      // preferredLanguages: ['id', createJobForm.jobfunction.value],
      preferredLanguages:
        createJobForm.preferredLanguages.value === '[]'
          ? null
          : JSON.parse(createJobForm.preferredLanguages.value),

      //6 edit
      // preferredSkills: [
      //   { skillname: '', score: '' },
      //   { skillname: '', score: '' },
      // ], //ok,
      preferredSkills:
        (createJobForm.preferredSkills.value &&
          JSON.parse(createJobForm.preferredSkills.value)) ||
        null,

      salaryRange: null,
      billRange: null,

      payType: createJobForm.billRateUnitType.value,
      visible:
        createJobForm.visible.value && JSON.parse(createJobForm.visible.value),
      currency: createJobForm.ratecurrency.value,
      openings: createJobForm.openings.value || 1,
      minimumDegreeLevel: createJobForm.degreeValue.value
        ? [createJobForm.degreeValue.value * 1]
        : null,
      experienceYearRange: {
        gte: leastYear,
        lte: mostYear,
      },
      // leastExperienceYear: leastYear,
      // mostExperienceYear: mostYear,

      code: createJobForm.jobCode.value,
      uuid: this.state.job.toJS().uuid ? this.state.job.toJS().uuid : null,
      maxSubmissions: createJobForm.maxSubmissions.value || 0,
    };
    if (createJobForm.payRateFrom.value || createJobForm.payRateTo.value) {
      job.salaryRange = {
        gte: createJobForm.payRateFrom.value
          ? createJobForm.payRateFrom.value
          : null,
        lte: createJobForm.payRateTo.value
          ? createJobForm.payRateTo.value
          : null,
      };
    }
    if (createJobForm.billRateFrom.value || createJobForm.billRateTo.value) {
      job.billRange = {
        gte: createJobForm.billRateFrom.value
          ? createJobForm.billRateFrom.value
          : null,
        lte: createJobForm.billRateTo.value
          ? createJobForm.billRateTo.value
          : null,
      };
    }

    this.setState({ creating: true });
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

  // 表单校验方法
  _validateForm = (form, t) => {
    let errorMessage = Immutable.Map();
    // Pay Rate最大值最小值判断
    if (form.payRateFrom.value && form.payRateTo.value) {
      if (
        Number(form.payRateTo.value) < 0 ||
        Number(form.payRateFrom.value) < 0
      ) {
        errorMessage = errorMessage.set('payRate', t('message:Max must > Min'));
      } else {
        if (Number(form.payRateTo.value) <= Number(form.payRateFrom.value)) {
          errorMessage = errorMessage.set(
            'payRate',
            t('message:Max must > Min')
          );
        }
        if (Number(form.payRateTo.value) === 0) {
          errorMessage = errorMessage.set('payRate', t('message:Max must > 0'));
        }
      }
    }
    if (form.payRateTo.value) {
      if (Number(form.payRateTo.value) === 0) {
        errorMessage = errorMessage.set('payRate', t('message:Max must > 0'));
      }
    }
    // if (
    //   Number(form.payRateTo.value) < 0 ||
    //   Number(form.payRateFrom.value) < 0
    // ) {
    //   errorMessage = errorMessage.set('payRate', t('message:Max must > Min'));
    // } else {
    //   if (Number(form.payRateTo.value) < Number(form.payRateFrom.value)) {
    //     errorMessage = errorMessage.set('payRate', t('message:Max must > Min'));
    //   }
    //   if (Number(form.payRateTo.value) === 0) {
    //     errorMessage = errorMessage.set('payRate', t('message:Max must > 0'));
    //   }
    // }
    // if (!form.payRateTo.value || !form.payRateFrom.value) {
    //   errorMessage = errorMessage.set(
    //     'payRate',
    //     t('message:Pay Rate is required')
    //   );
    // }
    // Bill Rate最大值最小值判断
    if (form.billRateTo.value && form.billRateFrom.value) {
      if (
        Number(form.billRateTo.value) < 0 ||
        Number(form.billRateFrom.value) < 0
      ) {
        errorMessage = errorMessage.set(
          'billRate',
          t('message:Max must > Min')
        );
      } else {
        if (Number(form.billRateTo.value) <= Number(form.billRateFrom.value)) {
          errorMessage = errorMessage.set(
            'billRate',
            t('message:Max must > Min')
          );
        }
        if (Number(form.billRateTo.value) === 0) {
          errorMessage = errorMessage.set(
            'billRate',
            t('message:Max must > 0')
          );
        }
      }
    }
    if (form.billRateTo.value) {
      if (Number(form.billRateTo.value) === 0) {
        errorMessage = errorMessage.set('billRate', t('message:Max must > 0'));
      }
    }

    // if (!form.billRateTo.value || !form.billRateFrom.value) {
    //   errorMessage = errorMessage.set(
    //     'billRate',
    //     t('message:Bill Rate is required')
    //   );
    // }
    // Years of Experience最大值最小值判断
    if (Number(form.maxYears.value) < 0 || Number(form.minYears.value) < 0) {
      errorMessage = errorMessage.set(
        'Years of Experience',
        t('message:Year must > 0')
      );
    } else {
      if (
        form.maxYears.value &&
        form.minYears.value &&
        Number(form.maxYears.value) < Number(form.minYears.value)
      ) {
        errorMessage = errorMessage.set(
          'Years of Experience',
          t('message:Max must > Min')
        );
      }
    }
    if (!form.title.value.trim()) {
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
    if (form.jobCode.value && form.jobCode.value.length > 100) {
      errorMessage = errorMessage.set(
        'jobCode',
        t('message:JobCode length should be less than 100')
      );
    }
    if (!form.openings.value) {
      errorMessage = errorMessage.set(
        'openings',
        t('message:Job Openings is required')
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
    const location = JSON.parse(form.location.value);
    let locationFlag = false;
    location &&
      location.map((item) => {
        if (!item.country && !item.location && !item.province && !item.city) {
          locationFlag = true;
        }
      });
    if (locationFlag) {
      errorMessage = errorMessage.set(
        'location',
        t('message:Location is required')
      );
    }
    const jobfunction = JSON.parse(form.jobfunction.value);
    if (jobfunction.length === 0) {
      errorMessage = errorMessage.set(
        'jobfunction',
        t('message:JobFunction is required')
      );
    }
    if (!form.requiredskills.value) {
      errorMessage = errorMessage.set(
        'mustSkills',
        t('message:Required Skills is required')
      );
    }
    // 判断requiredskill和preferedskill是否有重复
    if (form.preferredSkills.value && form.requiredskills.value) {
      const requiredSkillArr = JSON.parse(form.requiredskills.value);
      const preferredSkillArr = JSON.parse(form.preferredSkills.value);
      let skillRepeat = false;
      requiredSkillArr &&
        requiredSkillArr.map((item) => {
          preferredSkillArr &&
            preferredSkillArr.map((ele) => {
              if (item.skillName === ele.skillName) {
                skillRepeat = true;
              }
            });
        });
      if (skillRepeat) {
        errorMessage = errorMessage.set(
          'mustSkills',
          t('message:Required Skills and Preferred Skill is repeated')
        );
        errorMessage = errorMessage.set(
          'preferredSkills',
          t('message:Required Skills and Preferred Skill is repeated')
        );
      }
    }

    if (!form.companyId.value) {
      errorMessage = errorMessage.set(
        'company',
        t('message:companyIsRequired')
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
    const { t, i18n } = this.props;
    console.log('job create props', job.toJS());
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
              className="flex-container flex-dir-column container-padding  vertical-layout"
              style={{ overflow: 'hidden' }}
            >
              <p
                style={{
                  color: '#777777',
                  fontSize: 16,
                  marginBottom: 1,
                  marginTop: 27,
                }}
              >
                Job Description
              </p>
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
