import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dataList: {
    display: 'flex',
    flexDirection: 'column',
    borderLeft: '1px solid #e0e0e0',
    padding: '0px 10px',
  },
  percentList: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: 36,
    left: 320,
    bottom: 36,
    justifyContent: 'space-between',
  },
}));

const options = {
  legend: {
    display: false,
  },
  events: [], // this is needed, otherwise onHover is not fired
  maintainAspectRatio: false,
  cutoutPercentage: 90,
};

export default function ReportsChart(props) {
  const {
    sum,
    dataShow,
    color,
    label,
    period,
    marginRight,
    fromDialog,
    height,
  } = props;
  const classes = useStyles();
  console.log('sum', sum);

  function prepareDonutChartData(index) {
    let dataForGraph;

    const { dataShow, sum } = props;

    dataForGraph = {
      // labels: labels[index],
      datasets: [
        {
          data: [dataShow, sum - dataShow],
          backgroundColor: [color, '#edeeef'],
          borderWidth: [0, 0],
        },
      ],
    };

    return dataForGraph;
  }

  return (
    <div
      style={{
        height: height || 150,
        width: height || 150,
        marginRight: marginRight || 60,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 100,
        }}
      >
        <Typography
          variant="subtitle1"
          style={{ fontSize: '23px', color, fontWeight: 500, marginBottom: 4 }}
        >
          {Math.ceil((dataShow / sum) * 100)}%
        </Typography>
        <Typography
          style={{ fontSize: '13px', color: '#505050', fontWeight: 500 }}
        >
          {label}
        </Typography>
        <Typography style={{ fontSize: '13px', color: '#505050' }}>
          ({dataShow.toLocaleString()})
        </Typography>
      </div>
      <Doughnut data={() => prepareDonutChartData()} options={options} />
    </div>
  );
}
