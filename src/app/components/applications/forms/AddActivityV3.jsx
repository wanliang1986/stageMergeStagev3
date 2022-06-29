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
import SubmitToClient from '../../newApplication/submitToClient';
import SubmitToInterview from '../../newApplication/submitToInterview';
import SubmitToOffer from '../../newApplication/submitToOffer';
import SubmitToPerformance from '../../newApplication/submitToPerformance';
import SubmitToOnBoard from '../../newApplication/submitToOnboard';
import Eliminate from '../../newApplication/form/eliminate';
import Loading from '../../particial/Loading';

//模态框组件
class AddActivityForm extends Component {
  constructor(props) {
    super(props);
  }

  changeActiveStep = (num) => {
    this.setState({
      activeStep: num,
    });
  };

  // 表单拆分
  renderForm = () => {
    const {
      onClose,
      application,
      formType,
      activityFromJob,
      activityFromTalent,
      t,
      ...props
    } = this.props;
    console.log('formType', application.toJS());
    switch (formType) {
      case 'SUBMIT_TO_CLIENT':
        return (
          // <SubmittedFrom
          //   cancelAddActivity={onClose}
          //   activityFromJob={activityFromJob}
          //   activityFromTalent={activityFromTalent}
          //   application={application}
          //   formType={formType}
          //   {...props}
          // />
          <SubmitToClient
            handleRequestClose={onClose}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        );
      case 'INTERVIEW':
        return (
          // <InterviewFrom
          //   cancelAddActivity={onClose}
          //   activityFromJob={activityFromJob}
          //   activityFromTalent={activityFromTalent}
          //   application={application}
          //   formType={formType}
          //   {...props}
          // />
          <SubmitToInterview
            handleRequestClose={onClose}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        );
      case 'OFFER':
        return (
          // <OfferAcceptedFrom
          //   cancelAddActivity={onClose}
          //   activityFromJob={activityFromJob}
          //   activityFromTalent={activityFromTalent}
          //   application={application}
          //   formType={formType}
          //   {...props}
          // />
          <SubmitToOffer
            handleRequestClose={onClose}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        );

      case 'OFFER_ACCEPT':
      case 'COMMISSION':
        return (
          // <UpdateApplicationUserRoles
          //   t={props.t}
          //   jobId={application.get('jobId')}
          //   applicationId={application.get('id')}
          //   onClose={onClose}
          // />
          <SubmitToPerformance
            handleRequestClose={onClose}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        );
      case 'ON_BOARD':
        return (
          // <UpdateApplicationCommissions
          //   t={props.t}
          //   jobId={application.get('jobId')}
          //   applicationId={application.get('id')}
          //   onClose={onClose}
          // />
          <SubmitToOnBoard
            handleRequestClose={onClose}
            changeActiveStep={this.changeActiveStep}
            application={application}
            t={t}
          />
        );
      case 'REJECTED_BY_CANDIDATE':
      case 'REJECTED_BY_CLIENT':
      case 'INTERNAL_REJECT':
        return (
          <Eliminate
            handleRequestClose={onClose}
            application={application}
            rejectedStatus={formType}
            t={t}
          />
        );
      // default:
      //   return (
      //     <AddActivityDefaultForm
      //       cancelAddActivity={onClose}
      //       activityFromJob={activityFromJob}
      //       activityFromTalent={activityFromTalent}
      //       application={application}
      //       formType={formType}
      //       {...props}
      //     />
      //   );
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
          style: { overflow: 'visible', maxWidth: '960px' },
        }}
      >
        {/* 模态框修改状态 主要的表单 */}
        {this.renderForm()}
      </Dialog>
    );
  }
}

export default AddActivityForm;
