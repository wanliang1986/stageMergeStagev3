import React, { Component } from 'react';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
// import Location from '../../../../../components/particial/Location';
import Location from '../Location';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import lodash from 'lodash';
import { withStyles } from '@material-ui/core/styles';

class WorkingInformationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location:
        this.props.workingLocation && this.props.workingLocation.location
          ? this.props.workingLocation.location
          : null,
      detailedAddress: this.props.workingLocation
        ? this.props.workingLocation.detailedAddress
        : null,
      zipCode: this.props.workingLocation
        ? this.props.workingLocation.zipCode
        : null,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.workingLocation) !==
      JSON.stringify(this.props.workingLocation)
    ) {
      this._setBillInfoState(nextProps.workingLocation);
    }
  }
  _setBillInfoState = (workingLocation) => {
    this.setState({
      location:
        workingLocation && workingLocation.location
          ? workingLocation.location
          : null,
      detailedAddress:
        workingLocation && workingLocation.detailedAddress
          ? workingLocation.detailedAddress
          : null,
      zipCode: workingLocation && workingLocation.zipCode,
    });
  };

  handleLocationChange = (location) => {
    // if (location.location === '') {
    this.setState({
      location,
    });
    // }
    this.props.removeErrorMsgHandler &&
      this.props.removeErrorMsgHandler('location');
  };

  render() {
    const { t, isClockIn, pageType, errorMessage, index, editType } =
      this.props;
    const { location, detailedAddress, zipCode } = this.state;
    return (
      <>
        <Grid container spacing={3} key={`location_${index}`}>
          <Grid item xs={12}>
            <FormInput
              name="WorkingAddress"
              label={t('field:Working Address')}
              toolTip={
                'Guidance about how to enter Timesheet info, and this portion will be displayed on Contractor Timesheet portal'
              }
              defaultValue={detailedAddress}
              disabled={
                isClockIn === true || pageType === 'history' || !editType
              }
              maxLength={100}
              icon={
                <InfoOutlinedIcon
                  style={{
                    verticalAlign: 'middle',
                    marginLeft: '4px',
                    color: '#a0a0a0',
                  }}
                />
              }
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={9}>
            <FormReactSelectContainer
              isRequired
              label={t('field:Working Location')}
              errorMessage={errorMessage && errorMessage.get('location')}
            >
              <Location
                value={location}
                disabled={
                  isClockIn === true || pageType === 'history' || !editType
                }
                handleChange={this.handleLocationChange}
                errorMessage={errorMessage}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              value={location ? JSON.stringify(location) : null}
              name="location"
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={3}>
            <FormInput
              name="ZipCode"
              defaultValue={zipCode}
              disabled={
                isClockIn === true || pageType === 'history' || !editType
              }
              label={t('field:Zip Code')}
              form="billinforForm"
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default WorkingInformationForm;
