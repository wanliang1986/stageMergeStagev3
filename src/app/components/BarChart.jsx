import React, { PureComponent } from 'react';

import ReactEcharts from 'echarts-for-react';
import Loading from '../components/particial/Loading';
import { styles } from '../pages/Reports/params';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import SetChartSize from './SetChartSize';
import { withTranslation } from 'react-i18next';
let styles_inside = {
  identiContent: {
    position: 'absolute',
    right: '13%',
    top: '-51px',
  },
  identIcon1: {
    border: '2px solid #aab1b8',
    display: 'inline-block',
    width: '19px',
    height: '11px',
  },
  identIcon2: {
    border: '2px solid #aab1b8',
    display: 'inline-block',
    width: '19px',
    height: '11px',
    background: '#aab1b8',
  },
  identiItem: {
    marginBottom: '10px',
  },
};

class BarChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initChartSize: 100,
    };
  }
  onEvents = {
    click: this.onChartClick.bind(this),
  };

  onChartClick(e) {
    this.props.onChartClick(e);
  }

  render() {
    const { Load, classes, t } = this.props;
    return (
      <div className="examples" style={{ position: 'relative' }}>
        <div className="parent">
          <ReactEcharts
            id="myCharts"
            ref="myCharts"
            option={this.props.getOption()}
            style={{ height: '500px', width: '100%' }}
            className="react_for_echarts"
            onEvents={this.onEvents}
          />
        </div>
        {/* 标识 */}
        <div style={styles_inside.identiContent}>
          <div style={styles_inside.identiItem}>
            <span style={styles_inside.identIcon1}> </span>{' '}
            {t('tab:offer accepted')}
          </div>
          <div style={styles_inside.identiItem}>
            <span style={styles_inside.identIcon2}> </span> {t('tab:on board')}
          </div>
        </div>

        {/* 为了不触发Chart组件的render事件，把SetSize独立封装一个子组件（拥有了独立的生命周期，即可不影响Chart） */}
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

export default withTranslation('tab')(withStyles(styles)(BarChart));
