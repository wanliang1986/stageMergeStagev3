import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import * as FormOptions from '../../../../../constants/formOptions';
import {
  selectStartToOpen,
  updateStartBasicInfo,
  updateStartAddress,
} from '../../../../../actions/startActions';
import { getClientContactByCompanyId } from '../../../../../actions/clientActions';
import { getClientContactArrayByCompany } from '../../../../../selectors/clientSelector';

import Select from 'react-select';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../../../components/particial/PrimaryButton';
import Location from '../../../../../components/particial/Location';

import { showErrorMessage } from '../../../../../actions';

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      applicationId: props.start.applicationId,
      talentId: props.start.talentId,
      talentName: props.start.talentName,
      jobId: props.start.jobId,
      jobTitle: props.start.jobTitle,
      positionType: props.start.positionType || '',
      clientContactId: props.start.clientContactId,
      timeZone: props.start.timeZone || '',
      errorMessage: Immutable.Map(),
      startAddress: props.start.startAddress,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    const { dispatch, start } = this.props;
    dispatch(getClientContactByCompanyId(start.companyId));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startForm = e.target;
    const { start: oldStart, t, onClose, dispatch } = this.props;
    let errorMessage = this._validateForm(startForm, t);

    if (errorMessage) {
      console.log(errorMessage.toJS());
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true, errorMessage: Immutable.Map() });
    const startAddress = JSON.parse(startForm.startAddress.value);
    const newStart = {
      clientContactId: Number(startForm.clientContactId.value),
      startAddress,
      note: startForm.note.value,
    };
    console.log(newStart);

    Promise.all([
      dispatch(updateStartBasicInfo(newStart, oldStart.id)),
      dispatch(updateStartAddress(startAddress, oldStart.id)),
    ])
      .then(() => {
        dispatch(
          selectStartToOpen(
            Immutable.fromJS(this.props.start).merge(Immutable.fromJS(newStart))
          )
        );
      })
      .then(this.handleCancel)
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  _validateForm(form, t) {
    let errorMessage = Immutable.Map();
    // location
    const startAddress =
      form.startAddress.value && JSON.parse(form.startAddress.value);
    if (
      !startAddress ||
      (!startAddress.country &&
        !startAddress.city &&
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
        t('message:Client Contact is Required')
      );
    }

    if (form.note.value.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage.size > 0 && errorMessage;
  }

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  handleCancel = () => {
    this.props.onClose();
  };

  handleAddressChange = (startAddress) => {
    if (startAddress) {
      this.setState({ startAddress });
    }
  };

  render() {
    const {
      clientContactId,
      positionType,
      startAddress,
      errorMessage,
      processing,
    } = this.state;
    const { t, start, clientList } = this.props;
    return (
      <>
        <DialogTitle>{t('common:Edit Basic Information')}</DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id={'startBasicInfo'}>
            <input type="hidden" value={start.talentId || ''} name="talentId" />
            <input
              type="hidden"
              value={start.talentName || ''}
              name="talentName"
            />
            <input type="hidden" value={start.jobCode || ''} name="jobCode" />
            <input
              type="hidden"
              value={start.companyId || ''}
              name="companyId"
            />
            <input
              type="hidden"
              value={start.applicationId || ''}
              name="applicationId"
            />
            <div className="row expanded">
              <div className="small-6 columns">
                <FormInput
                  name="jobId"
                  label={t('field:Job Number')}
                  defaultValue={start.jobId}
                  disabled
                />
              </div>
              <div className="small-6 columns">
                <FormInput
                  name="jobTitle"
                  label={t('field:title')}
                  defaultValue={start.jobTitle}
                  disabled
                />
              </div>

              <div className="small-6 columns">
                <FormInput
                  name="company"
                  label={t('field:company')}
                  defaultValue={start.company}
                  disabled
                />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  label={t('field:Client Contact')}
                  isRequired
                  errorMessage={errorMessage.get('clientContact')}
                >
                  <Select
                    labelKey={'name'}
                    valueKey={'id'}
                    options={clientList}
                    value={clientContactId}
                    simpleValue
                    autoBlur
                    clearable={false}
                    openOnFocus
                    onChange={(clientContactId) => {
                      this.setState({ clientContactId });
                      this._removeErrorMsgHandler('clientContact');
                    }}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="clientContactId"
                  value={clientContactId || ''}
                />
              </div>

              <div className="small-6 columns">
                <FormReactSelectContainer label={t('field:Position Type')}>
                  <Select
                    value={positionType}
                    simpleValue
                    options={FormOptions.jobType}
                    disabled
                    autoBlur
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
                <input type="hidden" name="positionType" value={positionType} />
              </div>
              <div className="small-6 columns">
                <FormReactSelectContainer
                  isRequired
                  errorMessage={errorMessage.get('startAddress')}
                  label={t('field:Location')}
                />
                <Location
                  value={startAddress}
                  handleChange={this.handleAddressChange}
                  // disabled
                />
                <input
                  type="hidden"
                  name={'startAddress'}
                  value={startAddress ? JSON.stringify(startAddress) : ''}
                />
              </div>
            </div>
            {/* 备忘 */}
            <div className="row expanded">
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
                />
              </div>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <SecondaryButton onClick={this.handleCancel}>
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type={'submit'}
            form={'startBasicInfo'}
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

const mapStateToProps = (state, { start }) => {
  return {
    clientList: getClientContactArrayByCompany(state, start.companyId),
  };
};
export default connect(mapStateToProps)(BasicInfo);
