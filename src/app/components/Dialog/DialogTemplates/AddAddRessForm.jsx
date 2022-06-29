import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Location from '../../Location';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormInput from '../../particial/FormInput';
class AddAddRessForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
    };
  }
  render() {
    const { t } = this.props;
    return (
      <div>
        <Typography variant="caption" display="block" gutterBottom>
          Please note that the new address will be added under this company’s
          profile!
        </Typography>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormReactSelectContainer label={t('field:Additional Address')}>
              <FormInput
                name="Additional Address"
                value={this.state.address}
                onChange={(event) => {
                  this.setState({ address: event.target.value });
                  this.props.getAddress(event.target.value);
                }}
              />
            </FormReactSelectContainer>
          </div>
          <div className="small-12 columns">
            <label style={{ fontSize: '12px' }}>
              Additional Address - City/State/Country
            </label>
            <Location
              getLocation={(location) => {
                this.props.getLocation(location);
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AddAddRessForm;
