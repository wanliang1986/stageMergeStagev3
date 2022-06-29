import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import { getEmailDetailByIdByStatus } from '../../../apn-sdk/email';

import { Doughnut } from 'react-chartjs-2';
import StatsDetailByStatus from './StatsDetailByStatus';
import { emailHistoryStatus } from '../../constants/formOptions';
import { showErrorMessage } from '../../actions';

const styles = {
  dataList: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e0e0e0',
    padding: '0px 20px',
  },
  percentAndNum: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    top: 16,
    left: 310,
    bottom: 16,
    justifyContent: 'space-between',
  },
};

const options = {
  legend: {
    display: true,
    position: 'right',
    labels: {
      padding: 20,
      boxWidth: 20,
    },
    onClick: newLegendClickHandler,
  },
  maintainAspectRatio: false,
  cutoutPercentage: 70,
  events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'], // this is needed, otherwise onHover is not fired
  onHover: (event, chartElement) => {
    event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
  },
};

const statusOptions = ['OPEN', 'CLICK', 'BOUNCE', 'DELIVERY'];

function newLegendClickHandler(e, legendItem) {
  return;
}

class StatsDetailDialog extends Component {
  constructor(props) {
    super(props);
    const history = props.sent.toJS();
    let opens = 0;
    let clicks = 0;
    let bounces = 0;
    let unOpens = 0;

    history.stats.forEach((ele, i) => {
      if (emailHistoryStatus.opens.indexOf(ele.status) !== -1) {
        opens += ele.count;
      }
      if (emailHistoryStatus.clicks.indexOf(ele.status) !== -1) {
        clicks += ele.count;
      }
      if (emailHistoryStatus.bounces.indexOf(ele.status) !== -1) {
        bounces += ele.count;
      }
      if (emailHistoryStatus.unopens.indexOf(ele.status) !== -1) {
        unOpens += ele.count;
      }
    });

    const sum = opens + clicks + bounces + unOpens;
    const opensPercent = sum ? Number((opens / sum) * 100).toFixed(0) : 0;
    const clicksPercent = sum ? Number((clicks / sum) * 100).toFixed(0) : 0;
    const bouncesPercent = sum ? Number((bounces / sum) * 100).toFixed(0) : 0;
    // const unOpensPercent = sum ? Number((unOpens / sum) * 100).toFixed(0) : 0;

    history.sum = sum;
    history.OPEN = opens;
    history.CLICK = clicks;
    history.BOUNCE = bounces;
    history.DELIVERY = unOpens;

    history.opensPercent = opensPercent;
    history.clicksPercent = clicksPercent;
    history.bouncesPercent = bouncesPercent;
    history.unOpensPercent =
      100 - opensPercent - clicksPercent - bouncesPercent;

    this.state = {
      blastId: history.id,
      dataShow: history,
      step: 1,
    };
    options.onClick = this.chartClickHandler;
  }

  prepareDonutChartData = () => {
    const { OPEN, CLICK, BOUNCE, DELIVERY } = this.state.dataShow;
    const sum = OPEN + CLICK + BOUNCE + DELIVERY;
    const opensPercent = sum ? Number((OPEN / sum) * 100).toFixed(0) : 0;
    const clicksPercent = sum ? Number((CLICK / sum) * 100).toFixed(0) : 0;
    const bouncesPercent = sum ? Number((BOUNCE / sum) * 100).toFixed(0) : 0;
    const unOpensPercent = sum ? Number((DELIVERY / sum) * 100).toFixed(0) : 0;

    const dataForGraph = {
      labels: [
        //   `Opens ${opensPercent}% / ${OPEN}`,
        //   `Clicks ${clicksPercent}% / ${CLICK}`,
        //   `Bounces ${bouncesPercent}% / ${BOUNCE}`,
        //   `Unopens ${unOpensPercent}% / ${DELIVERY}`,
        `Opens`,
        `Clicks`,
        `Bounces`,
        `Unopens`,
      ],
      datasets: [
        {
          data: [OPEN, CLICK, BOUNCE, DELIVERY],
          backgroundColor: ['#3398db', '#21b66e', '#f56d50', '#fdab29'],
          borderWidth: [0, 0, 0, 0],
        },
      ],
    };

    return dataForGraph;
  };

  chartClickHandler = (e, elements) => {
    if (elements[0]) {
      const { _index } = elements[0];
      console.log('selected', elements, _index);
      getEmailDetailByIdByStatus(this.state.blastId, statusOptions[_index])
        .then((res) => {
          console.log('hahhah dara', res.response);
          this.setState({
            selectedTableData: Immutable.fromJS(res.response),
            step: 2,
            selectedTableCount: this.state.dataShow[statusOptions[_index]],
            selectedLabel: statusOptions[_index],
            selectedLabelIndex: _index,
          });
        })
        .catch((err) => this.props.dispatch(showErrorMessage(err)));
    }
  };

  handleBack = () => this.setState({ step: 1 });

  render() {
    const {
      dataShow,
      step,
      selectedTableData,
      selectedTableCount,
      selectedLabel,
      selectedLabelIndex,
    } = this.state;
    const { sent, t, classes } = this.props;
    const {
      OPEN,
      CLICK,
      BOUNCE,
      DELIVERY,
      sum,
      opensPercent,
      clicksPercent,
      bouncesPercent,
      unOpensPercent,
    } = this.state.dataShow;

    return (
      <div>
        {step === 1 && (
          <div style={{ position: 'relative' }}>
            <div style={{ height: 150, width: 300 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 50,
                  left: 65,
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    color: '#505050',
                    fontWeight: 500,
                  }}
                >
                  {sum}
                </span>
                <span style={{ fontSize: '13px', color: '#505050' }}>
                  Emails Sent
                </span>
              </div>
              <Doughnut
                data={() => this.prepareDonutChartData()}
                options={options}
              />
              <div className={classes.percentAndNum}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#505050',
                  }}
                >
                  {' '}
                  {opensPercent}% / {OPEN.toLocaleString()}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#505050',
                  }}
                >
                  {' '}
                  {clicksPercent}% / {CLICK.toLocaleString()}{' '}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#505050',
                  }}
                >
                  {bouncesPercent}% / {BOUNCE.toLocaleString()}{' '}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#505050',
                  }}
                >
                  {unOpensPercent}% / {DELIVERY.toLocaleString()}{' '}
                </span>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <StatsDetailByStatus
            selectedTableData={selectedTableData}
            t={t}
            selectedTableCount={selectedTableCount}
            selectedLabel={selectedLabel}
            handleBack={this.handleBack}
            dataShow={dataShow}
            selectedLabelIndex={selectedLabelIndex}
          />
        )}
      </div>
    );
  }
}

export default connect()(withStyles(styles)(StatsDetailDialog));
