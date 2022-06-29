import React, { Component } from 'react';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
const styles_inside = {
  typeBlock1: {
    display: 'inline-block',
    margin: '10px 10px 10px 37px',
    minWidth: '120px',
  },
  typeBlock2: {
    display: 'inline-block',
    margin: '10px 10px 10px 20px',
    minWidth: '165px',
  },
};
class SaleTypeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periodOpt: [
        { value: 'Month', label: 'Month' },
        { value: 'Quarter', label: 'Quarter' },
        { value: 'Year', label: 'Year' },
      ],
      serviceTypeOpt: [
        { value: 'FULL_TIME', label: 'General Recruiting (FTE)' },
        { value: 'CONTRACT', label: 'General Staffing (Contract)' },
      ],
    };
  }

  changePerioType = (type) => {
    const { perioType, serviceType, history } = this.props;

    if (perioType === type) {
      return;
    }
    // FULL_TIME
    if (serviceType === 'FULL_TIME') {
      if (type === 'Month') {
        history.push('/reports/detail/52');
      }
      if (type === 'Quarter') {
        history.push('/reports/detail/53');
      }
      if (type === 'Year') {
        history.push('/reports/detail/54');
      }
    }
    // CONTRACT
    if (serviceType === 'CONTRACT') {
      if (type === 'Month') {
        history.push('/reports/detail/56');
      }
      if (type === 'Quarter') {
        history.push('/reports/detail/58');
      }
      if (type === 'Year') {
        history.push('/reports/detail/59');
      }
    }
  };

  changeServiceType = (type) => {
    const { perioType, serviceType, history } = this.props;

    if (serviceType === type) {
      return;
    }
    console.log(type);
    // FULL_TIME
    if (type === 'FULL_TIME') {
      if (perioType === 'Month') {
        history.push('/reports/detail/52');
      }
      if (perioType === 'Quarter') {
        history.push('/reports/detail/53');
      }
      if (perioType === 'Year') {
        history.push('/reports/detail/54');
      }
    }

    //CONTRACT
    if (type === 'CONTRACT') {
      if (perioType === 'Month') {
        history.push('/reports/detail/56');
      }
      if (perioType === 'Quarter') {
        history.push('/reports/detail/58');
      }
      if (perioType === 'Year') {
        history.push('/reports/detail/59');
      }
    }
  };

  render() {
    const { periodOpt, serviceTypeOpt } = this.state;
    const { perioType, serviceType, t } = this.props;
    // CONTRACT 暂时只有Month
    // if (serviceType === 'CONTRACT') {
    //   let newPeriodOpt = [{ value: 'Month', label: 'Month' }];
    //   this.setState({
    //     periodOpt: newPeriodOpt,
    //   });
    // }
    return (
      <div>
        <div style={styles_inside.typeBlock1}>
          <FormReactSelectContainer
            style={{ color: '#aab1b8' }}
            label={t('tab:View by')}
          >
            <Select
              value={perioType}
              options={periodOpt}
              autoBlur={true}
              simpleValue
              clearable={false}
              onChange={this.changePerioType}
            />
          </FormReactSelectContainer>
        </div>
        <div style={styles_inside.typeBlock2}>
          <FormReactSelectContainer
            style={{ color: '#aab1b8' }}
            label={t('tab:Service Type') + ':'}
          >
            <Select
              value={serviceType}
              options={serviceTypeOpt}
              autoBlur={true}
              simpleValue
              clearable={false}
              onChange={this.changeServiceType}
            />
          </FormReactSelectContainer>
        </div>
      </div>
    );
  }
}

export default withTranslation('tab')(withRouter(SaleTypeSelect));
