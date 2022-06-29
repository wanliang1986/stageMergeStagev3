import React, { Component } from 'react';
import DashbaordChangeStatus from '../../../../components/applications/Buttons/DashbaordChangeStatus';
import { withTranslation } from 'react-i18next';
class StatusCell extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { t } = this.props;
    console.log(this.props);
    return (
      <DashbaordChangeStatus
        t={t}
        props={this.props}
        applicationId={this.props.data.id || this.props.data.applicationId}
        status={this.props.data.status}
      />
    );
  }
}

export default withTranslation(['message', 'action', 'tab', 'field'])(
  StatusCell
);
