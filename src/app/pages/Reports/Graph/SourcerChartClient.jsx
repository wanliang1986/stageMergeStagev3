import React from 'react';
import PipeChart from './PipeChart';

export default () => {
  return (
    <PipeChart
      field={'submittedCount'}
      title={'Pipeline Analytics by Sourcer - Submitted to Client'}
      type={'Sourcer'}
    />
  );
};
