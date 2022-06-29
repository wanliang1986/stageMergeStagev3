import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClientContact } from '../../../../../actions/clientActions';
import Immutable from 'immutable';
import { JOB_TYPES, USER_TYPES } from '../../../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';

import FormInput from '../../../../../components/particial/FormInput';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import BasicInfo from './BasicInfo';
import FullTimeInfo from './FullTime';
import ContractInfo from './Contract';
import StartCommissions from './StartCommissions';
import FailedWarrantyForm from './FailedWarrantyForm';
import TerminationForm from './TerminationForm';

class StartForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: Immutable.Map(),
    };
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
      // console.log(errorMessage.toJS());
      return this.setState({ errorMessage });
    }

    this.setState({ errorMessage: Immutable.Map() });

    const positionType = startForm.positionType.value;
    const startAddress = startForm.startAddress.value
      ? JSON.parse(startForm.startAddress.value)
      : null;

    const newStart = {
      applicationId: startForm.applicationId && startForm.applicationId.value,
      startType: startForm.startType && startForm.startType.value,
      // timeZone: startForm.timeZone.value,
      talentId: Number(startForm.talentId.value),
      talentName: startForm.talentName.value,
      jobId: startForm.jobId.value,
      jobCode: startForm.jobCode.value,
      jobTitle: startForm.jobTitle.value,
      company: startForm.company.value,
      companyId: startForm.companyId.value,
      clientContactId: Number(startForm.clientContactId.value),
      positionType,
      startAddress,
      startDate: startForm.startDate.value,
      endDate: startForm.endDate && startForm.endDate.value,
      warrantyEndDate:
        startForm.warrantyEndDate && startForm.warrantyEndDate.value,
      note: startForm.note.value,
      startCommissions: JSON.parse(startForm.startCommissions.value),
    };
    if (
      positionType === JOB_TYPES.Contract ||
      positionType === JOB_TYPES.Payrolling
    ) {
      const startContractRates = [
        {
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
      newStart.startContractRates = startContractRates;
    } else if (positionType === JOB_TYPES.FullTime) {
      const startFteRate = {
        currency: startForm.currency.value,
        rateUnitType: startForm.rateUnitType.value,
        salary: Number(startForm.salary.value) || 0,
        signOnBonus: Number(startForm.signOnBonus.value) || 0,
        retentionBonus: Number(startForm.retentionBonus.value) || 0,
        annualBonus: Number(startForm.annualBonus.value) || 0,
        relocationPackage: Number(startForm.relocationPackage.value) || 0,
        extraFee: Number(startForm.extraFee.value) || 0,
        totalBillableAmount: startForm.totalBillableAmount.value || 0,
        feeType: startForm.feeType.value,
        feePercentage: startForm.feePercentage
          ? Number(startForm.feePercentage.value)
          : 0,
        totalBillAmount:
          Number(Number(startForm.totalBillAmount.value).toFixed(2)) || 0,
      };
      const startClientInfo = {
        clientName: startForm.clientName.value,
        clientDivision: startForm.clientDivision.value,
        clientAddress: startForm.clientAddress.value,
      };
      newStart.startFteRate = startFteRate;
      newStart.startClientInfo = startClientInfo;
    }
    console.log(newStart, positionType, oldStart);

    handleSubmit(newStart, oldStart.id);
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();
    const positionType = form.positionType.value;
    if (positionType === JOB_TYPES.FullTime) {
      errorMessage = this._validateFormFullTime(form, t, errorMessage);
    } else if (positionType === JOB_TYPES.Contract) {
      errorMessage = this._validateFormContract(form, t, errorMessage);
    } else if (positionType === JOB_TYPES.Payrolling) {
      errorMessage = this._validateFormContract(form, t, errorMessage);
    }

    // location
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

    const commissions = JSON.parse(form.startCommissions.value);
    if (positionType !== JOB_TYPES.Payrolling) {
      // const commissions = JSON.parse(form.startCommissions.value);
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

    if (form.note.value.length > 5000) {
      errorMessage = errorMessage.set('note', 'message:noteLengthError');
    }
    return errorMessage.size > 0 && errorMessage;
  }

  _validateFormFullTime(form, t, errorMessage) {
    if (!form.warrantyEndDate.value) {
      errorMessage = errorMessage.set(
        'warrantyEndDate',
        'message:Warranty End Date is required'
      );
    }
    if (
      form.warrantyEndDate.value &&
      form.startDate.value &&
      !moment(form.startDate.value).isBefore(moment(form.warrantyEndDate.value))
    ) {
      errorMessage = errorMessage.set(
        'warrantyEndDate',
        'message:Warranty End Date should be after Start Date'
      );
    }

    if (!Number(form.salary.value)) {
      errorMessage = errorMessage.set(
        'salary',
        'message:Billable Base Salary is required'
      );
    }
    if (!form.currency.value) {
      errorMessage = errorMessage.set(
        'currency',
        'message:Salary Currency is required'
      );
    }

    if (!form.rateUnitType.value) {
      errorMessage = errorMessage.set(
        'rateUnitType',
        'message:Salary Unit Type Is Required'
      );
    }

    if (!form.feeType.value) {
      errorMessage = errorMessage.set(
        'feeType',
        'message:Fee Type is required'
      );
    }

    if (!form.totalBillableAmount.value) {
      errorMessage = errorMessage.set(
        'totalBillableAmount',
        'message:Total Billable Amount is required'
      );
    }
    if (!form.clientName.value) {
      errorMessage = errorMessage.set(
        'clientName',
        'message:Client name is required'
      );
    }
    if (!form.clientAddress.value) {
      errorMessage = errorMessage.set(
        'clientAddress',
        'message:Client address is required'
      );
    }

    return errorMessage;
  }

  _validateFormContract(form, t, errorMessage) {
    // gm params
    if (!form.endDate.value) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date is required'
      );
    }
    if (
      form.endDate.value &&
      form.startDate.value &&
      moment(form.endDate.value).isBefore(moment(form.startDate.value))
    ) {
      errorMessage = errorMessage.set(
        'endDate',
        'message:End Date should not be before Start Date'
      );
    }
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
        'message:Tax Burden Rate is required'
      );
    }

    if (!form.mspRateCode.value) {
      errorMessage = errorMessage.set(
        'mspRate',
        'message:MSP Rate is required'
      );
    }

    if (!form.estimatedWorkingHourPerWeek.value) {
      errorMessage = errorMessage.set(
        'estimatedWorkingHourPerWeek',
        'message:Estimated Working Hour Per Week is required'
      );
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
    console.log('1', start);
    return (
      <form
        key={edit}
        onSubmit={this.handleSubmit}
        className="flex-child-auto item-padding"
        id="startForm"
        noValidate
        style={{ overflow: 'auto', position: 'relative', maxWidth: 1000 }}
      >
        {start.failedWarranty && (
          <FailedWarrantyForm
            key={start.failedWarranty.lastModifiedDate}
            t={t}
            failedWarranty={start.failedWarranty}
            currency={start.currency}
          />
        )}
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

        {/* FULL_TIME 表单 */}
        {start.positionType === JOB_TYPES.FullTime && (
          <FullTimeInfo
            t={t}
            start={start}
            startFteRate={start.startFteRate}
            edit={edit}
            errorMessage={errorMessage}
            removeErrorMsgHandler={this._removeErrorMsgHandler}
          />
        )}

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
              errorMessage={t(errorMessage.get('note'))}
              onChange={() => {
                this._removeErrorMsgHandler('note');
              }}
              rows={4}
              disabled={!edit}
            />
          </div>
        </div>

        {/* invoice info */}
        {start.positionType === JOB_TYPES.FullTime && (
          <>
            <div className="row expanded">
              <Typography
                variant="subtitle1"
                style={{ margin: '10px 0', flexGrow: 1, width: '500px' }}
              >
                <span style={{ fontWeight: 550 }}>{t('tab:Invoice Info')}</span>
                ({t('tab:invoiceTip')})
              </Typography>
              <div className="small-6 columns">
                <FormInput
                  disabled={!edit}
                  errorMessage={t(errorMessage.get('clientName'))}
                  defaultValue={
                    start.startClientInfo && start.startClientInfo.clientName
                  }
                  name="clientName"
                  label={t('field:Client Name')}
                  isRequired
                  onChange={() => this._removeErrorMsgHandler('clientName')}
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  disabled={!edit}
                  defaultValue={
                    start.startClientInfo &&
                    start.startClientInfo.clientDivision
                  }
                  name="clientDivision"
                  label={t('tab:Client Division')}
                />
              </div>
            </div>

            <div className="row expanded">
              <div className="small-12 columns">
                <FormInput
                  disabled={!edit}
                  errorMessage={t(errorMessage.get('clientAddress'))}
                  defaultValue={
                    start.startClientInfo && start.startClientInfo.clientAddress
                  }
                  name="clientAddress"
                  label={t('tab:Client Address')}
                  onChange={(e) => this._removeErrorMsgHandler('clientAddress')}
                  isRequired
                />
              </div>
            </div>
          </>
        )}
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
