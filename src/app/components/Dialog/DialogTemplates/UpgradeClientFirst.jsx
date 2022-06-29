import React, { Component } from 'react';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class UpgradeClientFirst extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '2',
    };
  }
  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
    this.props.selectdType(event.target.value);
  };
  render() {
    const { value } = this.state;
    const { t } = this.props;
    return (
      <div style={{ width: '475px' }}>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={this.handleChange}
        >
          <FormControlLabel
            value="1"
            control={<Radio color="primary" />}
            label={t('tab:Upgrade with contract')}
          />
          <FormControlLabel
            value="2"
            control={<Radio color="primary" />}
            label={t('tab:Upgrade without contract')}
          />
        </RadioGroup>
      </div>
    );
  }
}

export default UpgradeClientFirst;
