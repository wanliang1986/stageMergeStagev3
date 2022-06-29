import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import FormTextArea from '../../particial/FormTextArea';

class AmUpdateTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  changeValue = (e) => {
    this.setState({ value: e.target.value });
    this.props.getValue(e.target.value);
  };
  render() {
    const { note, ...props } = this.props;
    const { value } = this.state;
    return (
      <div style={{ width: '560px', height: '150px' }}>
        <Typography variant="body1">AM Updates</Typography>
        <FormTextArea
          defaultValue={value}
          rows="4"
          onChange={(e) => {
            this.changeValue(e);
          }}
        />
      </div>
    );
  }
}

export default AmUpdateTemplate;
