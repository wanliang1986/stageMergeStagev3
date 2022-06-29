import React, { PureComponent } from 'react';

import ReactEcharts from 'echarts-for-react';
import Loading from '../components/particial/Loading';
import { styles } from '../pages/Reports/params';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import SetChartSize from './SetChartSize';
let styles_inside = {
  identiContent: {
    position: 'absolute',
    right: '13%',
    bottom: '-10px',
    left: '30%',
  },
  identIcon1: {
    color: '#fdb88e',
    fontWeight: 'bold',
  },
  identIcon2: {
    color: '#a0a3fa',
    fontWeight: 'bold',
  },
  identiItem: {
    margin: '10px',
    display: 'inline-block',
  },
};

class BarChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      averageLineColor: '#fdb88e',
      targetLineColor: '#a0a3fa',
      averageLineFlg: true,
      targetLineFlag: true,
    };
  }
  onEvents = {
    click: this.onChartClick.bind(this),
  };

  onChartClick(e) {
    this.props.onChartClick(e);
  }

  setColor = (stateKey, color) => {
    this.props.setChartLineColor(stateKey, color);
    // this.props;
    // this.setState({
    //   targetLineColor: 'white',
    // });
  };

  render() {
    const { Load, classes } = this.props;
    const { averageLineFlg, targetLineFlag } = this.state;
    return (
      <div className="examples" style={{ position: 'relative' }}>
        <div className="parent">
          <ReactEcharts
            ref="myCharts"
            option={this.props.getOption}
            style={{ height: '400px', width: '100%' }}
            className="react_for_echarts"
            onEvents={this.onEvents}
          />
        </div>
        {/* 标识 */}
        <div style={styles_inside.identiContent}>
          <div
            style={styles_inside.identiItem}
            onClick={() => {
              this.setState(
                {
                  averageLineFlg: !this.state.averageLineFlg,
                },
                () => {
                  if (averageLineFlg) {
                    this.setColor('averageLineColor', 'rgba(0,0,0,0)');
                  } else {
                    this.setColor('averageLineColor', '#fdb88e');
                  }
                }
              );
            }}
          >
            <span
              style={{
                fontWeight: 'bold',
                color: averageLineFlg ? '#fdb88e' : '#556371',
              }}
            >
              - - -
            </span>
            &nbsp; Average
          </div>
          <div style={styles_inside.identiItem}>
            <span
              style={{
                fontWeight: 'bold',
                color: '#556371',
                // color: targetLineFlag ? '#a0a3fa' : '#556371',
              }}
              // onClick={() => {
              //   this.setState(
              //     {
              //       targetLineFlag: !this.state.targetLineFlag,
              //     },
              //     () => {
              //       if (targetLineFlag) {
              //         this.setColor('targetLineColor', 'rgba(0,0,0,0)');
              //       } else {
              //         this.setColor('targetLineColor', '#a0a3fa');
              //       }
              //     }
              //   );
              // }}
            >
              - - -
            </span>
            &nbsp; Target
          </div>
        </div>

        <SetChartSize {...this.props} />
        {!Load && (
          <div
            className={clsx(
              'flex-container flex-dir-column',
              classes.contentMask
            )}
          >
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(BarChart);
