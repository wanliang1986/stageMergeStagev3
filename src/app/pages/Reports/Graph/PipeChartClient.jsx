import React from 'react';
import PipeChart from './PipeChart';


export default () => {
    return <PipeChart
        field={'submittedCount'}
        title={'User Activities - Submitted to Client'}
        type={'User'} />
};


