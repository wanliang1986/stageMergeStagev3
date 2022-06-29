/**
 * Created by chenghui on 6/16/17.
 */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import withStyles from '@material-ui/core/styles/withStyles';
import clsx from 'clsx';
import { Parser as HtmlToReactParser } from 'html-to-react';

import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

import JobBasicForm from '../../DetailPayRolling';
import Loading from '../../../../components/particial/Loading';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import JobDescription from '../../JobDescriptionRich3';
import SectionHeader from './SectionHeader';

const styles = {
  root: {
    overflow: 'auto',
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
    backgroundColor: '#F2F2F2',
    color: '#4e4e4e',
  },
};
const htmlToReactParser = new HtmlToReactParser();

class JobInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      edit: '', // editBasic,editDescription,editUser
      errorMessage: Immutable.Map(),
      visible: props.job.get('visible') || false,
      processing: false,
      openEmail: false,
      favorite: null,
    };
    this.jobForm = React.createRef();
    this.publicDesc = props.job.get('publicDesc') || '';
    this.scrollPosition = 0;
  }

  handleOpenEmail = () => this.setState({ openEmail: true });
  handleCloseEmail = () => this.setState({ openEmail: false });

  handleUpdateUser = (userRelations) => {
    this.setState({ userRelations });
  };

  changeFavorite = (item) => {};

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
    let job,
      basicJob = {};
    if (this.state.edit === 'editBasic') {
      let errorMessage = this._validateForm(createJobForm, this.props.t);
      if (errorMessage) {
        return this.setState({ errorMessage });
      }
      job = {
        id: this.props.job.get('id'),
        title: createJobForm.title.value,
        company: {
          id: createJobForm.companyId.value, //ok
          name: createJobForm.company.value, //ok
          industry:
            createJobForm.companyIndustry.value === '' ||
            createJobForm.companyIndustry.value === null
              ? 'NODATA'
              : createJobForm.companyIndustry.value,
        },
        department: createJobForm.department.value,
        clientContactCategory: createJobForm.clientcontact.value, //ok
        clientContactName: {
          id: createJobForm.clientcontactid.value, //ok,
          name: createJobForm.clientcontactname.value,
        },
        locations:
          createJobForm.location.value &&
          JSON.parse(createJobForm.location.value),
        assignedUsers:
          createJobForm.assignedUsers.value &&
          JSON.parse(createJobForm.assignedUsers.value),
        jdText: createJobForm.jdText.value,
        publicDesc:
          createJobForm.publicDesc.value ===
          '<!DOCTYPE html>\n<html>\n<head>\n</head>\n<body>\n\n</body>\n</html>'
            ? null
            : createJobForm.publicDesc.value,
      };
    }

    console.log(job);
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
    const assignedUsers = JSON.parse(form.assignedUsers.value);
    let assignedFlag = false;
    let assignedOwnerNum = 0;
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
    const { edit, errorMessage, processing, openEmail } = this.state;

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
                  dispatch={props.dispatch}
                  changeFavorite={this.changeFavorite}
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
                  clickHandler={false}
                  job={job}
                  t={t}
                />

                <div className={clsx('columns', classes.descriptionContainer)}>
                  <div className={classes.htmlContainer}>
                    {htmlToReactParser.parse(job.get('publicDesc') || '')}
                  </div>
                </div>
                <div style={{ height: 12 }} />
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
