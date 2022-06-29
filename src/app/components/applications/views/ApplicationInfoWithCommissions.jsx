import React from 'react';
import { connect } from 'react-redux';
import ApplicationInfo from './ApplicationInfo';
import ApplicationCommission from './ApplicationCommission';

class ApplicationInfoWithCommissions extends React.Component {
  render() {
    const { application, t, onCommissionsUpdate } = this.props;
    if (!application) {
      return null;
    }
    return (
      <section
        style={{
          marginBottom: '1rem',
          display: 'flex',
        }}
      >
        <ApplicationInfo application={application} t={t} />
        <ApplicationCommission
          application={application}
          t={t}
          onCommissionsUpdate={onCommissionsUpdate}
        />
      </section>
    );
  }
}

const mapStateToProps = (state, { applicationId }) => {
  return {
    application: state.relationModel.applications.get(String(applicationId)),
  };
};

export default connect(mapStateToProps)(ApplicationInfoWithCommissions);
