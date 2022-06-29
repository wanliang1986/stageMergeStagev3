import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import FormTextArea from '../../particial/FormTextArea';

class ExperienceTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.experienceText || '',
    };
  }
  changeValue = (e) => {
    this.setState({ value: e.target.value });
    this.props.getValue(e.target.value);
  };
  render() {
    const { experienceText, ...props } = this.props;
    const { value } = this.state;
    return (
      <div style={{ width: '560px', height: '150px' }}>
        <Typography variant="body1">Highlighted Experience</Typography>
        <FormTextArea
          name="highlightedExperience"
          defaultValue={value}
          placeholder={'e.g. Google L6, Harward PHD'}
          rows="4"
          onChange={(e) => {
            this.changeValue(e);
          }}
          maxLength={50}
        />
        <div style={{ width: '100%', textAlign: 'right' }}>
          {value.length}/50
        </div>
      </div>
    );
  }
}

export default ExperienceTemplate;
