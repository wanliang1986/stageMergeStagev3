import React, { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';
import Info from '@material-ui/icons/Info';
import Select from 'react-select';
class TooltipSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { label, tip, children } = this.props;
    return (
      <div>
        <label style={{ fontSize: '12px' }}>
          {label}
          <Tooltip title={tip} placement="top" arrow>
            <Info
              style={{
                fontSize: '1.5em',
                verticalAlign: 'middle',
                color: 'darkgray',
                marginLeft: '10px',
              }}
            />
          </Tooltip>
        </label>
        {children}
      </div>
    );
  }
}

export default TooltipSelect;
