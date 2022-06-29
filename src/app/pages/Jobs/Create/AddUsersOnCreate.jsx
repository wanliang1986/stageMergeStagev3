import React from 'react';
import { connect } from 'react-redux';
import { getProgramTeamListByCompany } from '../../../../apn-sdk/';
import Immutable from 'immutable';

import Loading from './../../../components/particial/Loading';
import AssignUsers from './AssignUsers';

class AddUsersOnCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRelationList: null,
    };
  }
  componentDidMount() {
    const { companyId, jobId } = this.props;
    getProgramTeamListByCompany(companyId)
      .then(({ response }) => {
        // console.log('program teamList', response);
        if (response.length > 0) {
          this.setState({
            userRelationList: Immutable.fromJS(
              response[0].users.map((u) => {
                u.jobId = jobId;
                delete u.id;
                return u;
              })
            ),
          });
        } else {
          this.setState({
            userRelationList: Immutable.List(),
          });
        }
      })
      .catch((err) =>
        this.setState({
          userRelationList: Immutable.List(),
        })
      );
  }

  render() {
    const { userRelationList } = this.state;
    const { t, jobId, handleClose, companyId } = this.props;
    if (!userRelationList) {
      return <Loading />;
    }
    return (
      <AssignUsers
        t={t}
        jobId={String(jobId)}
        companyId={companyId}
        userRelationList={userRelationList}
        handleClose={handleClose}
        isOwner={true}
      />
    );
  }
}

function mapStoreStateToProps(state, { jobId }) {
  const job = state.model.jobs.get(String(jobId));
  return {
    companyId: job.get('companyId'),
  };
}

export default connect(mapStoreStateToProps)(AddUsersOnCreate);
