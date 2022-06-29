import React from 'react';
import { withTranslation } from 'react-i18next';
import moment from 'moment-timezone';
// import PrimaryButton from '../../particial/PrimaryButton';
import Select from 'react-select';
import FormInput from '../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../components/particial/FormTextArea';

import {
  getTimeZoneList,
  interviewStageList,
  interviewTypeList,
} from '../../../../constants/formOptions';

const InterviewReadonlyForm = (props) => {
  const { t, activity } = props;
  console.log('readonlyForm', activity);
  let activityData = {};
  if (activity.eventDate) {
    const eventRecordedDate = moment(activity.eventDate).tz(
      activity.eventTimeZone
    );
    activityData = {
      interviewDate: eventRecordedDate.format('MM/DD/YYYY'),
      interviewTime: eventRecordedDate.format('hh:mm'),
      eventTimeZone: getTimeZoneList(eventRecordedDate).find(
        (ele) => ele.value === activity.eventTimeZone
      ),
      eventStage: interviewStageList.find(
        (ele) => ele.value === activity.eventStage
      ),
      eventType: interviewTypeList.find(
        (ele) => ele.value === activity.eventType
      ),
      memo: activity.memo,
    };
  }
  // console.log('readonlyForm data', activityData);

  return (
    <div style={{ width: '500px' }}>
      <div className="row expanded">
        <div className="small-3 columns">
          <FormInput
            style={{ color: '#8E8E8E' }}
            label={t('field:interviewDate')}
            defaultValue={activityData.interviewDate}
            readOnly
          />
        </div>
        <div className="small-3 columns">
          <FormReactSelectContainer
            label="&nbsp;"
            // errorMessage={errorMessage ? errorMessage.get('timeZone') : null}
          >
            <Select
              value={{ label: activityData.interviewTime }}
              disabled={true}
            />
          </FormReactSelectContainer>
        </div>

        <div className="small-6 columns">
          <FormReactSelectContainer
            label={t('field:timeZone')}
            // errorMessage={errorMessage ? errorMessage.get('timeZone') : null}
          >
            <Select value={activityData.eventTimeZone} disabled={true} />
          </FormReactSelectContainer>
        </div>
      </div>

      <div className="row expanded">
        <div className="small-6 columns">
          <FormReactSelectContainer
            label={t('field:interviewStage')}
            // errorMessage={errorMessage ? errorMessage.get('interviewType') : null}
          >
            <Select value={activityData.eventStage} disabled={true} />
          </FormReactSelectContainer>
        </div>
        <div className="small-6 columns">
          <FormReactSelectContainer
            label={t('field:interviewType')}
            // errorMessage={errorMessage ? errorMessage.get('interviewType') : null}
          >
            <Select value={activityData.eventType} disabled={true} />
          </FormReactSelectContainer>
        </div>
      </div>

      {/*<div className="row expanded">
                <div className="small-12 columns">
                    <FormReactSelectContainer
                        label={t('field:resume')}
                    // errorMessage={errorMessage ? errorMessage.get('positionType') : null}
                    >
                        <Select
                            value={'ResumeFrame 4.pdf'}
                            disabled={true}
                        />
                    </FormReactSelectContainer>


                </div>

            </div>*/}
      <div className="row expanded">
        <div className="small-12 columns">
          <FormTextArea
            style={{ color: '#8E8E8E' }}
            label={t('field:note')}
            rows="3"
            defaultValue={activityData.memo}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default withTranslation(['action', 'message', 'field'])(
  InterviewReadonlyForm
);
