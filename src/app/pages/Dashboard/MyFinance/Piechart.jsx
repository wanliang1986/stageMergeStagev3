import React from 'react';

import { Doughnut } from 'react-chartjs-2';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PieChartIcon from '@material-ui/icons/PieChart';

import { currency as currencyOptions } from '../../../constants/formOptions';

import { useTranslation } from 'react-i18next';
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const useStyles = makeStyles((theme) => ({
  origin: {
    display: 'flex',
    cursor: 'pointer',
  },

  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const options = {
  legend: {
    display: true,
    position: 'right',
    labels: {
      padding: 20,
    },
  },
};
export default function Piechart({ pieChartData, currency }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    // console.log('leave');
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const [t] = useTranslation();
  const data = {
    labels: [
      `${t('tab:Paid')}  -- ${currencyLabels[currency] || ''} ${
        pieChartData.paid && pieChartData.paid.toLocaleString()
      }`,
      `${t('tab:Unpaid')} -- ${currencyLabels[currency] || ''} ${
        pieChartData.unpaid && pieChartData.unpaid.toLocaleString()
      }`,
      `${t('tab:Overdue')} -- ${currencyLabels[currency] || ''} ${
        pieChartData.overdue && pieChartData.overdue.toLocaleString()
      }`,
    ],
    datasets: [
      {
        data: [pieChartData.paid, pieChartData.unpaid, pieChartData.overdue],
        backgroundColor: ['#21b66e', '#fdab29', '#f56d50'],
        hoverBackgroundColor: ['#21b66e', '#fdab29', '#f56d50'],
      },
    ],
  };

  // useEffect(() => {
  //   prepareGraphData(props.data);
  // }, [props.data]);

  return (
    <div style={{ marginRight: '20px' }}>
      <div
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={classes.origin}
      >
        <PieChartIcon color="primary" style={{ marginRight: '4px' }} />
        <Typography color="primary">{t(`tab:${currency} Chart`)}</Typography>
      </div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Doughnut data={data} options={options} />
      </Popover>
    </div>
  );
}
