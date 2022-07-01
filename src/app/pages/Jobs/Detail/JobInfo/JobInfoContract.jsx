/**
 * Created by Devin on 03/19/21.
 */
import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import { Parser as HtmlToReactParser } from 'html-to-react';
import { connect } from 'react-redux';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import Loading from '../../../../components/particial/Loading';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import JobDescription from '../../JobDescriptionRich3';
import JobBasicForm from '../../DeatilContactForm';
import SectionHeader from './SectionHeader';

const styles = {
  root: {
    overflowY: 'scroll',
  },
  descriptionContainer: {
    height: 'calc(100% - 20px)',
  },
  htmlContainer: {
    overflow: 'auto',
    height: '100%',
    marginBottom: 12,
    padding: 8,
    border: '1px solid #cacaca',
  },
};

const htmlToReactParser = new HtmlToReactParser();

class JobInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      edit: '',
      errorMessage: Immutable.Map(),

      visible: props.job.get('visible') || false,
      processing: false,
    };
    this.jobForm = React.createRef();
    this.publicDesc = props.job.get('publicDesc') || '';
    this.scrollPosition = 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.job !== this.props.job) {
      this.publicDesc = nextProps.job.get('publicDesc') || '';
      this.setState({
        visible: nextProps.job.get('visible') || false,
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const createJobForm = this.jobForm.current;
    // const createJobForm = e.target;

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

    let job,
      basicJob = {};
    if (this.state.edit === 'editBasic') {
      let errorMessage = this._validateForm(createJobForm, this.props.t);
      if (errorMessage) {
        return this.setState({ errorMessage });
      }
      job = {
        id: this.props.job.get('id'),
        code: createJobForm.jobCode.value,
        title: createJobForm.title.value,

        company: {
          id: createJobForm.companyId.value,
          name: createJobForm.company.value,
          industry:
            createJobForm.companyIndustry.value === '' ||
            createJobForm.companyIndustry.value === null
              ? 'NODATA'
              : createJobForm.companyIndustry.value,
        },
        department: createJobForm.department.value,
        clientContactCategory: createJobForm.clientcontact.value,
        clientContactName: {
          id: createJobForm.clientcontactid.value,
          name: createJobForm.clientcontactname.value,
        },
        locations:
          createJobForm.location.value &&
          JSON.parse(createJobForm.location.value),

        maxSubmissions: createJobForm.maxSubmissions.value || 0,
        openings: createJobForm.openings.value || 1,
        startDate:
          createJobForm.startDate.value &&
          createJobForm.startDate.value + 'T00:00:00Z',
        endDate:
          createJobForm.endDate.value &&
          createJobForm.endDate.value + 'T00:00:00Z',
        currency: createJobForm.ratecurrency.value,
        billRange: null,
        salaryRange: null,
        payType: createJobForm.billRateUnitType.value,

        jobFunctions:
          createJobForm.jobfunction.value &&
          JSON.parse(createJobForm.jobfunction.value),

        requiredSkills: JSON.parse(createJobForm.requiredskills.value),

        assignedUsers:
          createJobForm.assignedUsers.value &&
          JSON.parse(createJobForm.assignedUsers.value),
        minimumDegreeLevel: createJobForm.degreeValue.value
          ? [createJobForm.degreeValue.value * 1]
          : null,
        experienceYearRange: {
          gte: leastYear,
          lte: mostYear,
        },
        // leastExperienceYear: leastYear,
        // mostExperienceYear: mostYear,
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
        jdText: createJobForm.jdText.value,
        publicDesc:
          createJobForm.publicDesc.value ===
          '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>'
            ? null
            : createJobForm.publicDesc.value,
        visible:
          createJobForm.visible.value &&
          JSON.parse(createJobForm.visible.value),
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
    }

    this.setState({ processing: true });
    this.props
      .handleUpdateJob(Object.assign(basicJob, job))
      .then(this.handleCancel)
      .catch(() => this.setState({ processing: false }));
  };

  handleCancel = () => {
    this.setState({
      edit: '',
      errorMessage: this.state.errorMessage.clear(),
      processing: false,
    });

    this._scrollTo();
  };

  _scrollTo = () => {
    setTimeout(() => {
      if (this.container) {
        this.container.scrollTop = this.scrollPosition;
      }
      this.scrollPosition = 0;
    }, 0);
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();
    // Pay Rate最大值最小值判断
    if (form.payRateTo.value && form.payRateFrom.value) {
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

    // if (!form.payRateTo.value || !form.payRateFrom.value) {
    //   errorMessage = errorMessage.set(
    //     'payRate',
    //     t('message:PayRate is required')
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
    //     t('message:BillRate is required')
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

    if (!form.billRateUnitType.value) {
      errorMessage = errorMessage.set(
        'billRateUnitType',
        t('message:Unit Type is required')
      );
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
    if (!form.openings.value) {
      errorMessage = errorMessage.set(
        'openings',
        t('message:Job Openings is required')
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

    if (!form.company.value) {
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
    if (!form.clientcontactid.value) {
      errorMessage = errorMessage.set(
        'clientcontactname',
        t('message:ContactName is required')
      );
    }
    const location = JSON.parse(form.location.value);
    let locationFlag = false;
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
  }

  removeErrorMessage = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleEdit = (edit) => {
    if (this.container) {
      this.scrollPosition = this.container.scrollTop;
    }
    this.setState({ edit });
  };

  render() {
    console.log('job info');
    const { t, i18n, job, canEdit, classes, jobId, ...props } = this.props;
    const { edit, errorMessage, processing } = this.state;

    if (!job || !job.get('id')) {
      return (
        <Paper className="flex-child-auto flex-container">
          <Loading />
        </Paper>
      );
    }

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div
          className={clsx(
            'flex-child-auto flex-container flex-dir-column',
            classes.root
          )}
          ref={(el) => (this.container = el)}
        >
          {!edit && (
            <div>
              <div
                className="container-padding vertical-layout"
                ref={(el) => (this.basicContentContainer = el)}
              >
                <SectionHeader
                  section="editBasic"
                  clickHandler={!edit && canEdit && this.handleEdit}
                  job={job}
                  t={t}
                  disabled
                  {...props}
                />

                <JobBasicForm
                  job={job}
                  t={t}
                  disabled
                  errorMessage={errorMessage}
                />
              </div>

              <Divider />

              <div
                className="container-padding vertical-layout"
                style={{ height: 500 }}
              >
                <SectionHeader
                  section="editDescription"
                  disabled
                  job={job}
                  t={t}
                />

                <div className={clsx('columns', classes.descriptionContainer)}>
                  <div className={classes.htmlContainer}>
                    {htmlToReactParser.parse(job.get('publicDesc') || '')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {edit && (
            <>
              <form
                ref={this.jobForm}
                id="jobForm"
                className="flex-child-auto flex-container flex-dir-column container-padding vertical-layout"
                // onSubmit={this.handleSubmit}
              >
                <div>
                  <SectionHeader section={edit} job={job} t={t} {...props} />
                </div>

                {edit === 'editBasic' && (
                  <div
                    className="flex-child-auto"
                    style={{
                      overflow: 'auto',
                      margin: '0 -15.5px -15.5px',
                      padding: '0 15.5px 160px',
                    }}
                  >
                    <JobBasicForm
                      job={job}
                      t={t}
                      errorMessage={errorMessage}
                      removeErrorMsgHandler={this.removeErrorMessage}
                    />
                  </div>
                )}

                {edit === 'editBasic' && (
                  <div className="flex-container flex-dir-column columns vertical-layout">
                    <Divider />

                    <SectionHeader
                      section="editDescription"
                      clickHandler={false}
                      job={job}
                      t={t}
                    />

                    <JobDescription job={job} t={t} lang={i18n.language} />
                  </div>
                )}
              </form>
            </>
          )}
        </div>

        {edit && (
          <div>
            <Divider />
            <div className="container-padding">
              <div className="horizontal-layout columns">
                <SecondaryButton onClick={this.handleCancel}>
                  {t('action:cancel')}
                </SecondaryButton>
                <PrimaryButton
                  type="button"
                  form="jobForm"
                  processing={processing}
                  onClick={this.handleSubmit}
                >
                  {t('action:save')}
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </Paper>
    );
  }
}

JobInfo.propTypes = {
  job: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
  handleUpdateJob: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect()(withStyles(styles)(JobInfo));
