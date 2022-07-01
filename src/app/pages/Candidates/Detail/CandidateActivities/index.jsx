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
import ApllicationCard from '../../../../components/ApplicationNewCard';
import ApllicationItem from '../../../../components/ApplicationNewItem';
import ApllicationItemPayroll from '../../../../components/ApllicationItemPayroll';
import ApllicationCardPayroll from '../../../../components/ApllicationCardPayroll';

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
      flag: false, //测试UI用的
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
    const { selectedApplication, open, selectedApplication_ViewDetails, flag } =
      this.state;
    // console.log(applicationList.toJS());
    // if (applicationList.size === 0) {
    //   return (
    //     <div className="container-padding">{props.t('message:noActivity')}</div>
    //   );
    // }

    // 点击list进入的阶段详情
    if (selectedApplication) {
      return (
        <div className="container-padding">
          {/* 返回按钮 */}
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <IconButton
              onClick={() => this.setState({ selectedApplication: null })}
            >
              <BackIcon />
            </IconButton>
          </div>
          {selectedApplication.get('jobType') === 'PAY_ROLL' &&
          selectedApplication.get('talentRecruitmentProcessNodes').size ===
            2 ? (
            <ApllicationCardPayroll
              application={selectedApplication}
              {...props}
            />
          ) : (
            <ApllicationCard
              // openAddDialog={this.openAddDialog}
              // applicationId={selectedApplication.get('id')}
              application={selectedApplication}
              {...props}
            />
          )}

          {/* 模态框入口 */}
          {/* {open && (
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
          )} */}
        </div>
      );
    }

    // 点击之前的界面
    return (
      <div className="item-padding" key={applicationList.size}>
        <List>
          {/* {applicationList.map((application) => (
            <Application
              key={application.get('id')}
              application={application}
              {...props}
              onClick={() => {
                this.setState({ selectedApplication: application });
              }}
            />
          ))} */}
          {applicationList.map((application, index) => {
            if (
              application.get('jobType') === 'PAY_ROLL' &&
              application.get('talentRecruitmentProcessNodes').size === 2
            ) {
              return (
                <ApllicationItemPayroll
                  application={application}
                  key={index}
                  onClick={() => {
                    this.setState({ selectedApplication: application });
                  }}
                  {...props}
                />
              );
            } else {
              return (
                <ApllicationItem
                  // openAddDialog={this.openAddDialog}
                  // applicationId={selectedApplication.get('id')}
                  application={application}
                  key={index}
                  onClick={() => {
                    this.setState({ selectedApplication: application });
                  }}
                  {...props}
                />
              );
            }
          })}
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
