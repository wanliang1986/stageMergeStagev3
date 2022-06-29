import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClientContact } from '../../../../../actions/clientActions';
import Immutable from 'immutable';

import FormTextArea from '../../../../../components/particial/FormTextArea';
import BasicInfo from './BasicInfo';
import ContractInfo from './Contract';
import StartCommissions from './StartCommissions';
import TerminationForm from '../../CandidateStart/StartForm/TerminationForm';

import { JOB_TYPES, USER_TYPES } from '../../../../../constants/formOptions';
import moment from 'moment-timezone';

class StartForm extends React.Component {
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

  handleSubmit = (e) => {
    e.preventDefault();
    const startForm = e.target;
    const { start: oldStart, t, handleSubmit } = this.props;

    let errorMessage = this._validateForm(startForm, t);

    if (errorMessage) {
      console.log(errorMessage.toJS());
      return this.setState({ errorMessage });
    }

    this.setState({ errorMessage: Immutable.Map() });

    const positionType = startForm.positionType.value;
    const startAddress = JSON.parse(startForm.startAddress.value);

    const startContractRates = [
      {
        startDate: startForm.startDate.value,
        endDate: startForm.endDate.value,
        currency: startForm.currency.value,
        rateUnitType: startForm.rateUnitType.value,

        finalBillRate: startForm.finalBillRate.value,
        finalPayRate: startForm.finalPayRate.value,

        taxBurdenRateCode: startForm.taxBurdenRateCode.value,
        mspRateCode: startForm.mspRateCode.value,
        immigrationCostCode: startForm.immigrationCostCode.value,
        extraCost: Number(startForm.extraCost.value) || 0,
        estimatedWorkingHourPerWeek:
          Number(startForm.estimatedWorkingHourPerWeek.value) || 0,
        totalBillAmount:
          Number(Number(startForm.totalBillAmount.value).toFixed(2)) || 0,
      },
    ];

    const newStart = {
      startId: oldStart.startId,
      startType: startForm.startType && startForm.startType.value,
      applicationId: startForm.applicationId && startForm.applicationId.value,
      talentId: Number(startForm.talentId.value),
      talentName: startForm.talentName.value,
      jobId: startForm.jobId.value,
      jobCode: startForm.jobCode.value,
      jobTitle: startForm.jobTitle.value,
      company: startForm.company.value,
      companyId: startForm.companyId.value,
      clientContactId: Number(startForm.clientContactId.value),
      positionType,
      startDate: startForm.startDate.value,
      endDate: startForm.endDate.value,
      startAddress,
      startContractRates,
      note: startForm.note.value,
      startCommissions: JSON.parse(startForm.startCommissions.value),
    };
    console.log(newStart);
    handleSubmit(newStart, oldStart.id);
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();
    const positionType = form.positionType.value;
    if (positionType === JOB_TYPES.Contract) {
      errorMessage = this._validateFormContract(form, t, errorMessage);
    } else if (positionType === JOB_TYPES.Payrolling) {
      errorMessage = this._validateFormContract(form, t, errorMessage);
    }

    if (!form.startDate.value) {
      errorMessage = errorMessage.set(
        'startDate',
        'message:Start Date is required'
      );
      const anchor = window.document.querySelector('#startDate');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    if (form.totalBillAmount.value && Number(form.totalBillAmount.value) < 0) {
      errorMessage = errorMessage.set(
        'totalBillAmount',
        'message:Negative value is not allowed'
      );
    }
    if (!form.totalBillAmount.value) {
      errorMessage = errorMessage.set(
        'totalBillAmount',
        'message:Total Bill Amount is required'
      );
    }

    //todo: add payRolling commission validation
    const commissions = JSON.parse(form.startCommissions.value);
    if (positionType !== JOB_TYPES.Payrolling) {
      const ownerCommission = commissions.find(
        (c) => c.userRole === USER_TYPES.Owner
      );
      const sum = commissions
        .filter((c) => c.userId && c.userRole !== USER_TYPES.Owner)
        .reduce((s, c) => {
          return s + (Number(c.percentage) || 0);
        }, 0);

      if (sum + !!ownerCommission * 10 !== 100) {
        errorMessage = errorMessage.set(
          'commissions',
          'message:Commissions are incorrect'
        );
        if (!errorMessage.get('startDate')) {
          const anchor = window.document.querySelector('#commissions');
          if (anchor) {
            anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }
    if (commissions.find((c) => !c.percentage || Number(c.percentage) <= 0)) {
      errorMessage = errorMessage.set(
        'commissionPct',
        'message:Each commission should be greater than 0%'
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  _validateFormContract(form, t, errorMessage) {
    const startAddress =
      form.startAddress.value && JSON.parse(form.startAddress.value);
    if (
      !startAddress ||
      (!startAddress.city &&
        !startAddress.country &&
        !startAddress.province &&
        !startAddress.location)
    ) {
      errorMessage = errorMessage.set(
        'startAddress',
        'message:Location is required'
      );
    }

    // gm params
    if (!form.finalBillRate.value) {
      errorMessage = errorMessage.set(
        'finalBillRate',
        'message:Final Bill Rate is required'
      );
    }
    if (!form.finalPayRate.value) {
      errorMessage = errorMessage.set(
        'finalPayRate',
        'message:Final Pay Rate is required'
      );
    }
    if (!form.endDate.value) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date is required'
      );
    }
    if (
      form.endDate.value &&
      form.startDate.value &&
      !moment(form.startDate.value).isBefore(moment(form.endDate.value))
    ) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date should be after Start Date'
      );
    }

    if (!form.rateUnitType.value) {
      errorMessage = errorMessage.set(
        'rateUnitType',
        'message:Rate Unit Type Is Required'
      );
    }
    if (!form.currency.value) {
      errorMessage = errorMessage.set(
        'currency',
        'message:Currency is required'
      );
    }

    if (!form.immigrationCostCode.value) {
      errorMessage = errorMessage.set(
        'immigrationCost',
        'message:Immigration Cost is required'
      );
    }

    if (!form.taxBurdenRateCode.value) {
      errorMessage = errorMessage.set(
        'taxBurdenRate',
        t('message:Tax Burden Rate is required')
      );
    }

    if (!form.mspRateCode.value) {
      errorMessage = errorMessage.set(
        'mspRate',
        t('message:MSP Rate is required')
      );
    }

    if (!form.estimatedWorkingHourPerWeek.value) {
      errorMessage = errorMessage.set(
        'estimatedWorkingHourPerWeek',
        t('message:Estimated Working Hour Per Week is required')
      );
    }

    if (form.note.value.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage;
  }

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  render() {
    const { t, start, edit } = this.props;
    const { errorMessage } = this.state;

    return (
      <form
        key={edit}
        onSubmit={this.handleSubmit}
        className="flex-child-auto item-padding"
        id="startForm"
        noValidate
        ref={this.form}
        style={{ overflow: 'auto', position: 'relative', maxWidth: 1000 }}
      >
        {start.termination && (
          <TerminationForm
            key={start.termination.lastModifiedDate}
            t={t}
            termination={start.termination}
          />
        )}

        <BasicInfo
          t={t}
          start={start}
          edit={edit}
          errorMessage={errorMessage}
          removeErrorMsgHandler={this._removeErrorMsgHandler}
        />
        <div id="startDate" />

        {/* CONTRACT 表单 */}
        {start.positionType === JOB_TYPES.Contract && (
          <ContractInfo
            t={t}
            start={start}
            startContractRate={start.startContractRates[0]}
            edit={edit}
            errorMessage={errorMessage}
            removeErrorMsgHandler={this._removeErrorMsgHandler}
          />
        )}
        {/* PAY_ROLL */}
        {start.positionType === JOB_TYPES.Payrolling && (
          <ContractInfo
            t={t}
            start={start}
            startContractRate={start.startContractRates[0]}
            edit={edit}
            errorMessage={errorMessage}
            removeErrorMsgHandler={this._removeErrorMsgHandler}
          />
        )}

        <div id="commissions" />
        <StartCommissions
          t={t}
          edit={edit}
          jobId={start.jobId}
          positionType={start.positionType}
          startCommissions={start.startCommissions}
          errorMessage={errorMessage}
          removeErrorMsgHandler={this._removeErrorMsgHandler}
        />

        {/* 备忘 */}
        <div
          className="row expanded"
          style={{ borderBottom: '1px solid #e3e0e0' }}
        >
          <div className="small-12 columns">
            <FormTextArea
              label={t('field:note')}
              name="note"
              defaultValue={start.note || ''}
              errorMessage={errorMessage.get('note')}
              onChange={() => {
                this._removeErrorMsgHandler('note');
              }}
              rows={4}
              disabled={!edit}
            />
          </div>
        </div>
      </form>
    );
  }
}

StartForm.propTypes = {
  start: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default connect()(StartForm);
