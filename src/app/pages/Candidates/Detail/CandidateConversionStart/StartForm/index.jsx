import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getClientContactByCompanyId } from '../../../../../actions/clientActions';
import Immutable from 'immutable';
import { JOB_TYPES } from '../../../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';

import FormInput from '../../../../../components/particial/FormInput';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import BasicInfo from './BasicInfo';
import FullTimeInfo from './FullTime';
import StartCommissions from './StartCommissions';

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
    dispatch(getClientContactByCompanyId(start.companyId));
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
    const startAddress = JSON.parse(startForm.startAddress.value);

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
      warrantyEndDate:
        startForm.warrantyEndDate && startForm.warrantyEndDate.value,
      note: startForm.note.value,
      startCommissions: JSON.parse(startForm.startCommissions.value),
    };

    const startFteRate = {
      currency: startForm.currency.value,
      rateUnitType: startForm.rateUnitType.value,
      salary: Number(startForm.salary.value) || 0,
      signOnBonus: Number(startForm.signOnBonus.value) || 0,
      retentionBonus: Number(startForm.retentionBonus.value) || 0,
      annualBonus: Number(startForm.annualBonus.value) || 0,
      relocationPackage: Number(startForm.relocationPackage.value) || 0,
      extraFee: Number(startForm.extraFee.value) || 0,
      totalBillableAmount: Number(startForm.totalBillableAmount.value) || 0,
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
    console.log(newStart);

    handleSubmit(newStart, oldStart.id);
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();
    const positionType = form.positionType.value;
    if (positionType === JOB_TYPES.FullTime) {
      errorMessage = this._validateFormFullTime(form, t, errorMessage);
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
        t('message:Location is required')
      );
    }

    if (!form.clientContactId.value) {
      errorMessage = errorMessage.set(
        'clientContact',
        t('message:Client Contact is required')
      );
    }
    if (!form.jobTitle.value) {
      errorMessage = errorMessage.set(
        'jobTitle',
        t('message:Title is required')
      );
    }

    if (!form.startDate.value) {
      errorMessage = errorMessage.set(
        'startDate',
        t('message:Start Date is required')
      );
      const anchor = window.document.querySelector('#startDate');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    if (!form.totalBillAmount.value) {
      errorMessage = errorMessage.set(
        'totalBillAmount',
        t('message:Total Bill Amount is required')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  }

  _validateFormFullTime(form, t, errorMessage) {
    if (!Number(form.salary.value)) {
      errorMessage = errorMessage.set(
        'salary',
        t('message:Billable Base Salary is required')
      );
    }
    if (!form.currency.value) {
      errorMessage = errorMessage.set(
        'currency',
        t('message:Salary Currency is required')
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
        t('message:Fee Type is required')
      );
    }

    if (!form.totalBillableAmount.value) {
      errorMessage = errorMessage.set(
        'totalBillableAmount',
        t('message:Total Billable Amount is required')
      );
    }
    if (!form.clientName.value) {
      errorMessage = errorMessage.set(
        'clientName',
        t('message:Client name is required')
      );
    }
    if (!form.clientAddress.value) {
      errorMessage = errorMessage.set(
        'clientAddress',
        t('message:Client address is required')
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

    return (
      <form
        key={edit}
        onSubmit={this.handleSubmit}
        className="flex-child-auto item-padding"
        id="startForm"
        noValidate
        style={{ overflow: 'auto', position: 'relative', maxWidth: 1000 }}
      >
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
                  errorMessage={errorMessage.get('clientName')}
                  defaultValue={
                    start.startClientInfo && start.startClientInfo.clientName
                  }
                  name="clientName"
                  label={t('tab:Client Name')}
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
                  errorMessage={errorMessage.get('clientAddress')}
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
