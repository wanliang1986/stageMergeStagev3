import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getApplicationListByTalent } from '../../../../selectors/applicationSelector';

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';

import BackIcon from '@material-ui/icons/ArrowBack';

import ActivityCard from './ActivityCard';
import AddActivityFormWithEmail from '../../../../components/forms/AddActivity/Loadable';
import NextSteps from '../../../../components/applications/Buttons/NextSteps';
import PreSteps from '../../../../components/applications/Buttons/PreSteps';
import RejectSteps from '../../../../components/applications/Buttons/RejectSteps';
import Application from './Application';

class CandidateActivities extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedApplication: null,
      selectedApplication_ViewDetails: null,
      handleRollBack: null,
      processing: false,
      open: false,
      status: null,
      from: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.applicationList.equals(state.preApplicationList)) {
      return {
        preApplicationList: props.applicationList,
        selectedApplication:
          state.selectedApplication &&
          props.applicationList.find(
            (a) => a.get('id') === state.selectedApplication.get('id')
          ),
      };
    }
    return null;
  }

  // 接受put后新的applications
  receiveUpDatedApplication = (newApplications) => {
    this.setState({
      selectedApplication: newApplications,
    });
  };

  handleCloseAddActivity = () => {
    this.setState({ open: false });
  };

  handleCancelStatusRollBack = () => {
    this.setState({ handleRollBack: null });
  };

  openAddDialog = (status, from, selectedApplication_ViewDetails) => {
    this.setState({
      status,
      open: true,
      from,
      selectedApplication_ViewDetails,
    });
  };

  render() {
    const { applicationList, ...props } = this.props;
    const { selectedApplication, open, selectedApplication_ViewDetails } =
      this.state;
    // console.log(applicationList.toJS());
    if (applicationList.size === 0) {
      return (
        <div className="container-padding">{props.t('message:noActivity')}</div>
      );
    }

    // 点击list进入的阶段详情
    if (selectedApplication) {
      console.log(selectedApplication.toJS());
      return (
        <div className="container-padding vertical-layout">
          {/* update by Bill in 2020/12/23 */}

          <div className="flex-container align-middle">
            {/* 返回按钮 */}
            <IconButton
              onClick={() => this.setState({ selectedApplication: null })}
            >
              <BackIcon />
            </IconButton>
            <div className="flex-child-auto" />
            <div className="horizontal-layout">
              {/* 下一步操作按钮组件 */}
              <NextSteps {...props} application={selectedApplication} />
              {/* 拒绝操作按钮 */}
              <RejectSteps {...props} application={selectedApplication} />
              <PreSteps {...props} application={selectedApplication} />
            </div>
          </div>

          <ActivityCard
            openAddDialog={this.openAddDialog}
            applicationId={selectedApplication.get('id')}
            {...props}
          />

          {/* 模态框入口 */}
          {open && (
            <AddActivityFormWithEmail
              closeAddActivityFormWithEmail={this.handleCloseAddActivity}
              application={selectedApplication}
              status={this.state.status}
              notDashboard={true}
              from={this.state.from}
              receiveUpDatedApplication={this.receiveUpDatedApplication}
              application_ViewDetails={selectedApplication_ViewDetails}
              {...props}
            />
          )}
        </div>
      );
    }

    // 点击之前的界面
    return (
      <div className="item-padding">
        <List>
          {applicationList.map((application) => (
            <Application
              key={application.get('id')}
              application={application}
              {...props}
              onClick={() => {
                this.setState({ selectedApplication: application });
              }}
            />
          ))}
        </List>
      </div>
    );
  }
}

CandidateActivities.prototypes = {
  candidateId: PropTypes.string.isRequired,
  applicationList: PropTypes.instanceOf(Immutable.List).isRequired,
  t: PropTypes.func.isRequired,
};

const mapStoreStateToProps = (state, { candidateId }) => {
  const authorities = state.controller.currentUser.get('authorities');
  return {
    applicationList: getApplicationListByTalent(state, candidateId),
    isAdmin:
      authorities &&
      authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })),
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStoreStateToProps)(CandidateActivities);
