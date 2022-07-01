import React from 'react';
import { connect } from 'react-redux';
import FormInput from '../../particial/FormInput';
import { formatUserName } from '../../../../utils';
import FormTitle from './formTitle';

class BasicInforSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t, job, candidate } = this.props;
    console.log('jobsd', candidate.toJS());
    return (
      <>
        <FormTitle title={'基本信息'} />
        <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormInput
              name="offerTime"
              label={'公司名称'}
              value={
                job.getIn(['company', 'id']) && job.getIn(['company', 'name'])
                  ? '#' +
                    job.getIn(['company', 'id']) +
                    ' ' +
                    job.getIn(['company', 'name'])
                  : ''
              }
              disabled
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="offerTime"
              label={'职位名称'}
              value={'#' + job.get('id') + ' ' + job.get('title')}
              disabled
            />
          </div>
        </div>
        <div className="row expanded small-12">
          <div className="small-6 columns">
            <FormInput
              name="offerTime"
              label={'候选人'}
              value={
                '#' +
                candidate.get('id') +
                ' ' +
                (formatUserName(candidate) || candidate.get('fullName'))
              }
              disabled
            />
          </div>
        </div>
      </>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {};
}

export default connect(mapStoreStateToProps)(BasicInforSection);
