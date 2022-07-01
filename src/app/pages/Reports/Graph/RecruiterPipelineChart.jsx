import React from 'react';
import { getPipelineReportByRecruiter } from '../../../../apn-sdk/index';

import ChartWithTable from './ChartWithTable';

const SourcerPipelineChart = () => {
  return (
    <ChartWithTable
      getPipelineData={getPipelineReportByRecruiter}
      title="message:User Activities"
    />
  );
};
export default SourcerPipelineChart;
