import React, { useEffect, useState } from 'react';
import CountDetailDialog from './CountDetailDialog';
import Immutable from 'immutable';

import { Bar } from 'react-chartjs-2';
const options = {
  legend: {
    display: false,
    position: 'right',
    labels: {
      padding: 20,
    },
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
        },
        scaleLabel: {
          display: false,
        },
        afterFit: function (scale) {
          scale.height = 80;
        },
        ticks: {
          autoSkip: false,
          step: 1,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          drawBorder: false,
        },
        scaleLabel: {
          display: false,
        },
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          },
        },
      },
    ],
  },
  // events: ['click'],
  maintainAspectRatio: false,
};

export const applicationStatus = new Map([
  ['Watching', 'Watching'],
  ['Applied', 'Submitted to AM'],
  ['Called_Candidate', 'Called Candidate'],
  ['Meet_Candidate_In_Person', 'Meet Candidate In Person'],
  ['Internal_Rejected', 'Rejected by AM'],
  ['Qualified', 'Qualified by AM'],
  ['Submitted', 'Submitted to Client'],
  ['Client_Rejected', 'Rejected by Client'],
  ['Shortlisted_By_Client', 'Shortlisted by Client'],
  ['Interview', 'Interview'],
  ['Offered', 'Offered by Client'],
  ['Offer_Rejected', 'Offer Declined'],
  ['Offer_Accepted', 'Offer Accepted'],
  ['Started', 'On Boarded'],
  ['START_EXTENSION', 'Extension'],
  ['Candidate_Quit', 'Candidate Rejected Job'],
]);

const labels = [
  'Submitted to AM',
  'Submitted to Client',
  'Interview',
  'Offered by Client',
  'On Boarded',
];

export default function ApplicationGraph(props) {
  const [candidateCountData, setCandidateCountData] = useState({});
  const [selectedStatus, setStatus] = useState(null);
  const [selectedData, setSelectedData] = useState(Immutable.List());

  const chartClickHandler = (e, elements) => {
    // console.log('selected', e, elements);
    if (elements[0]) {
      const { _index } = elements[0];
      // console.log('selected2', _index);
      setStatus(labels[_index]);
      setSelectedData(
        Immutable.fromJS(
          props.data.toJS().filter((ele) => {
            if (labels[_index] !== 'On Boarded') {
              return applicationStatus.get(ele.status) === labels[_index];
            } else {
              return (
                applicationStatus.get(ele.status) === labels[_index] ||
                applicationStatus.get(ele.status) === 'Extension'
              );
            }
          })
        )
      );
    } else {
      // this.setState({
      //   selectedData: Immutable.List()
      // });
    }
  };

  options.onClick = chartClickHandler;

  const prepareGraphData = (data) => {
    console.log(data.toJS());
    data = data.toJS().map((ele) => applicationStatus.get(ele.status));
    console.log(data);
    let statusCount = data.reduce((acc, ele) => {
      acc[ele] = acc[ele] ? acc[ele] + 1 : 1;
      return acc;
    }, {});
    console.log(statusCount);
    const bgColors = ['#3398db', '#21b66e', '#fdab29', '#f56d50', '#dd265f'];
    const dataForGraph = {
      labels: [
        props.t('tab:Applied'),
        props.t('tab:Submitted'),
        props.t('tab:Interview'),
        props.t('tab:Offered'),
        props.t('tab:Started'),
      ],
      datasets: [
        {
          data: labels.map((label) => {
            if (label !== 'On Boarded') {
              return statusCount[label];
            } else {
              if (statusCount['Extension'] && !statusCount['On Boarded']) {
                return statusCount['Extension'];
              } else if (
                statusCount['Extension'] &&
                statusCount['On Boarded']
              ) {
                return statusCount['Extension'] + statusCount[label];
              } else {
                return statusCount[label];
              }
            }
          }),
          backgroundColor: bgColors,
          barPercentage: 0.8,
        },
      ],
    };

    // console.log(dataForGraph);
    setCandidateCountData(dataForGraph);
    return dataForGraph;
  };

  useEffect(() => {
    console.log(props.data);
    prepareGraphData(props.data);
  }, [props.data]);

  const closeCountDetailDialog = () => {
    setStatus(null);
    setSelectedData(Immutable.List());
  };

  let showCountDetailDialog = selectedData.size !== 0;
  // console.log('selectedData', selectedData);
  return (
    <>
      <Bar data={candidateCountData} options={options} />
      {showCountDetailDialog && (
        <CountDetailDialog
          t={props.t}
          onClose={closeCountDetailDialog}
          chosenStatus={selectedStatus}
          detailData={selectedData}
        />
      )}
    </>
  );
}
