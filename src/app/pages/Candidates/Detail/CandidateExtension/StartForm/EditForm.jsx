import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClientContact } from '../../../../../actions/clientActions';
import Immutable from 'immutable';

import BasicInfo from './BasicInfo2';
import ContractInfo from './Contract2';
import StartCommissions from './StartCommissions2';
import TerminationForm from '../../CandidateStart/StartForm/TerminationForm';

import { JOB_TYPES, USER_TYPES } from '../../../../../constants/formOptions';

class StartContractForm extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.start);

    this.state = {
      errorMessage: Immutable.Map(),
    };
    this.form = React.createRef();
  }

  componentDidMount() {
    this.getClientContact();
  }

  getClientContact = () => {
    const { dispatch, start } = this.props;
    dispatch(getClientContact(start.clientContactId));
  };

  render() {
    const { t, start, edit, isAm } = this.props;

    return (
      <div
        className="flex-child-auto item-padding vertical-layout"
        style={{ overflow: 'auto', position: 'relative', maxWidth: 1000 }}
      >
        {start.termination && (
          <TerminationForm
            key={'termination' + start.termination.lastModifiedDate}
            t={t}
            termination={start.termination}
          />
        )}

        <BasicInfo t={t} start={start} isAm={isAm} />
        {/* CONTRACT 表单 */}
        {start.positionType === JOB_TYPES.Contract && (
          <ContractInfo
            t={t}
            start={start}
            startContractRate={
              start.startContractRates && start.startContractRates[0]
            }
            edit={edit}
            isAm={isAm}
          />
        )}
        {/* PAY_ROLL */}
        {start.positionType === JOB_TYPES.Payrolling && (
          <ContractInfo
            t={t}
            start={start}
            startContractRate={
              start.startContractRates && start.startContractRates[0]
            }
            edit={edit}
            isAm={isAm}
          />
        )}

        <StartCommissions
          t={t}
          edit={edit}
          isAm={isAm}
          jobId={start.jobId}
          positionType={start.positionType}
          startCommissions={start.startCommissions}
          start={start}
        />
        <div />
      </div>
    );
  }
}

StartContractForm.propTypes = {
  start: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect()(StartContractForm);
