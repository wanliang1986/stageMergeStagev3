import React from 'react';
import { connect } from 'react-redux';
import * as FormOptions from '../../../../../constants/formOptions';
import memoizeOne from 'memoize-one';

import Select from 'react-select';

import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import Location from '../../../../../components/particial/Location';

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applicationId: props.start.applicationId,
      talentId: props.start.talentId,
      talentName: props.start.talentName,
      jobId: props.start.jobId,
      jobTitle: props.start.jobTitle,
      positionType: props.start.positionType || '',
      clientContactId: props.start.clientContactId,
      timeZone: props.start.timeZone || '',
      startAddress: props.start.startAddress,
    };
  }

  handleStartAddressChange = (startAddress) => {
    this.props.removeErrorMsgHandler('startAddress');
    this.setState({
      startAddress,
    });
  };

  render() {
    const { clientContactId, positionType, startAddress } = this.state;
    const { t, start, edit, clientList, errorMessage } = this.props;
    console.log('startAddress', start.startAddress);
    return (
      <>
        <input type="hidden" value={start.talentId || ''} name="talentId" />
        <input type="hidden" value={start.talentName || ''} name="talentName" />
        <input type="hidden" value={start.jobCode || ''} name="jobCode" />
        <input type="hidden" value={start.companyId || ''} name="companyId" />
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
            <FormReactSelectContainer label={t('field:Client Contact')}>
              <Select
                labelKey={'name'}
                valueKey={'id'}
                options={clientList}
                value={clientContactId}
                disabled
                simpleValue
                autoBlur
                clearable={false}
                openOnFocus
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
              errorMessage={t(errorMessage.get('startAddress'))}
              label={t('field:Location')}
            >
              <Location
                value={startAddress}
                handleChange={this.handleStartAddressChange}
                disabled={!edit}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="startAddress"
              value={startAddress ? JSON.stringify(startAddress) : ''}
            />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, { start }) => {
  return {
    clientList: getClientList(state.model.clients, start.clientContactId),
  };
};
export default connect(mapStateToProps)(BasicInfo);

const getClientList = memoizeOne((clients, clientContactId) => {
  return clients
    .filter((c) => c.get('id') === clientContactId)
    .toList()
    .toJS();
});
