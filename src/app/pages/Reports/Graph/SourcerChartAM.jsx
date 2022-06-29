import React from 'react';
import PipeChart from './PipeChart';

export default () => {
  return (
    <PipeChart
      field={'appliedCount'}
      title={'Pipeline Analytics by Sourcer - Submitted to AM'}
      type={'Sourcer'}
    />
  );
};
