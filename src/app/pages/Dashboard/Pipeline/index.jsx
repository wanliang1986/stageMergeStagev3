import React from 'react';

import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import PipelineCurrentChart from './PipelineCurrentChart';
import PipelineHistoryChart from './PipelineHistoryChart';

class Pipeline extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 'current' // 'current' | 'history'
    };
  }

  handleTypeChange = e => {
    this.setState({ type: e.target.value });
  };

  render() {
    const { type } = this.state;

    const { t, isLimitUser } = this.props;

    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'auto' }}
      >
        <div className="flex-container container-padding">
          <Typography variant="subtitle1" className="flex-child-auto">
            {t('Pipeline Summary')}
          </Typography>
          <RadioGroup
            row
            aria-label="type"
            name="type"
            value={type}
            onChange={this.handleTypeChange}
            style={{ height: 30 }}
          >
            <FormControlLabel
              value="current"
              label="Current"
              control={<Radio color="primary" />}
            />
            <FormControlLabel
              value="history"
              label="History"
              control={<Radio color="primary" />}
            />
          </RadioGroup>
        </div>
        <PipelineCurrentChart
          hidden={type !== 'current'}
          isLimitUser={isLimitUser}
        />
        <PipelineHistoryChart
          hidden={type !== 'history'}
          isLimitUser={isLimitUser}
        />
      </div>
    );
  }
}

export default Pipeline;
