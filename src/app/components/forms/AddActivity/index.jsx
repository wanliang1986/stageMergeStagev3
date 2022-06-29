import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddActivityForm from './AddActivityForm';
import Dialog from '@material-ui/core/Dialog';

import InterviewFrom from './AddActivitiForInterview';
import OfferAcceptedFrom from '../../applications/forms/AddActivityOfferAcceptedForm';

//模态框组件
class AddActivityFormWithEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openForm: true,
      newApplication: null,
    };
  }

  // 表单拆分
  FromSplit = () => {
    /* 需要把 1.Submitted to Client 2.Interview 3.Offer Accepted 
       三种状态对应的表单 单独分出来做成独立的组件，
       其它状态默认使用原来AddActivityForm组件即可
    */
    const {
      closeAddActivityFormWithEmail,
      notificationSubList,
      activityFromJob,
      application,
      ...props
    } = this.props;
    console.log(this.props.status);
    switch (this.props.status) {
      case 'Interview':
        return (
          <InterviewFrom
            cancelAddActivity={this.closeForm}
            notificationSubList={notificationSubList}
            activityFromJob={activityFromJob}
            application={application.toJS()}
            {...props}
          />
        );
      case 'Offer_Accepted':
        return (
          <OfferAcceptedFrom
            cancelAddActivity={this.closeForm}
            activityFromTalent
            application={application}
            formType={'Offer_Accepted'}
            edit
            {...props}
          />
        );
      default:
        return (
          <AddActivityForm
            cancelAddActivity={this.closeForm}
            notificationSubList={notificationSubList}
            activityFromJob={activityFromJob}
            application={application.toJS()}
            {...props}
          />
        );
    }
  };

  closeForm = () => {
    this.props.closeAddActivityFormWithEmail();
  };

  render() {
    const { openForm } = this.state;

    return (
      <Dialog
        open={openForm}
        maxWidth="sm"
        fullWidth
        // disableEnforceFocus
        PaperProps={{
          style: { maxWidth: 700 },
        }}
      >
        {/* 模态框修改状态 主要的表单 */}
        {this.FromSplit()}
      </Dialog>
    );
  }
}

AddActivityFormWithEmail.propTypes = {
  closeAddActivityFormWithEmail: PropTypes.func.isRequired,
};

export default AddActivityFormWithEmail;
