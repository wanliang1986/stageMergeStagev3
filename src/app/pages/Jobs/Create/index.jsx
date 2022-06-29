import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { JOB_TYPES } from '../../../constants/formOptions';

import FulltimeForm from './forms/FulltimeFormTwo';
import ContractForm from './forms/ContractFormTwo';
import PayrollingForm from './forms/PayrollingForm';
import DefaultForm from './forms/DefaultForm';

class JobCreate extends React.Component {
  render() {
    const { jobType, ...props } = this.props;
    if (jobType === JOB_TYPES.FullTime) {
      return <FulltimeForm {...props} />;
    }
    if (jobType === JOB_TYPES.Contract) {
      return <ContractForm {...props} />;
    }
    if (jobType === JOB_TYPES.Payrolling) {
      return <PayrollingForm {...props} />;
    }
    return <DefaultForm {...props} />;
  }
}

JobCreate.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const query = state.router.location.query;
  const jobType = query && query.type;
  const disableBack =
    (state.router && state.router.location.key) ===
    (state.controller.routerStatus &&
      state.controller.routerStatus.location.key);
  return {
    jobType,
    disableBack,
  };
};

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStateToProps)(JobCreate)
);
