import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';

import AddActivityDefaultForm from './AddActivityDefaultForm';
import AddActivityReactiveForm from './AddActivityReactiveForm';
import AddActivityRejectForm from './AddActivityRejectForm';
import SubmittedFrom from './AddActivitiSubmitForm';
import InterviewFrom from './AddActivitiForInterview';
import OfferAcceptedFrom from './AddActivityOfferAcceptedForm';
import UpdateApplicationUserRoles from './UpdateApplicationUserRoles';
import UpdateApplicationCommissions from './UpdateApplicationCommissions';

//模态框组件
class AddActivityForm extends Component {
  constructor(props) {
    super(props);
  }

  // 表单拆分
  renderForm = () => {
    const {
      onClose,
      application,
      formType,
      activityFromJob,
      activityFromTalent,
      ...props
    } = this.props;
    console.log('formType', formType);
    switch (formType) {
      case 'Submitted':
        return (
          <SubmittedFrom
            cancelAddActivity={onClose}
            activityFromJob={activityFromJob}
            activityFromTalent={activityFromTalent}
            application={application}
            formType={formType}
            {...props}
          />
        );
      case 'Interview':
        return (
          <InterviewFrom
            cancelAddActivity={onClose}
            activityFromJob={activityFromJob}
            activityFromTalent={activityFromTalent}
            application={application}
            formType={formType}
            {...props}
          />
        );
      case 'Offer_Accepted':
        return (
          <OfferAcceptedFrom
            cancelAddActivity={onClose}
            activityFromJob={activityFromJob}
            activityFromTalent={activityFromTalent}
            application={application}
            formType={formType}
            {...props}
          />
        );

      case 'updateUserRoles':
        return (
          <UpdateApplicationUserRoles
            t={props.t}
            jobId={application.get('jobId')}
            applicationId={application.get('id')}
            onClose={onClose}
          />
        );
      case 'updateCommissions':
        return (
          <UpdateApplicationCommissions
            t={props.t}
            jobId={application.get('jobId')}
            applicationId={application.get('id')}
            onClose={onClose}
          />
        );
      case 'Offer_Rejected':
      case 'Candidate_Quit':
      case 'Client_Rejected':
      case 'Internal_Rejected':
        return (
          <AddActivityRejectForm
            cancelAddActivity={onClose}
            activityFromJob={activityFromJob}
            activityFromTalent={activityFromTalent}
            application={application}
            formType={formType}
            {...props}
          />
        );
      case 'preStatus':
        return (
          <AddActivityReactiveForm
            cancelAddActivity={onClose}
            activityFromJob={activityFromJob}
            activityFromTalent={activityFromTalent}
            application={application}
            formType={formType}
            {...props}
          />
        );
      default:
        return (
          <AddActivityDefaultForm
            cancelAddActivity={onClose}
            activityFromJob={activityFromJob}
            activityFromTalent={activityFromTalent}
            application={application}
            formType={formType}
            {...props}
          />
        );
    }
  };

  render() {
    const { open } = this.props;

    return (
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        // disableEnforceFocus
        PaperProps={{
          style: { maxWidth: 700, overflow: 'visible' },
        }}
      >
        {/* 模态框修改状态 主要的表单 */}
        {this.renderForm()}
      </Dialog>
    );
  }
}

export default AddActivityForm;
