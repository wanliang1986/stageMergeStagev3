import React, { PureComponent } from 'react';
import Slider from '@material-ui/core/Slider';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

let styles_inside = {
  setBarSize: {
    position: 'absolute',
    right: '11px',
    top: '0px',
    width: '130px',
    textAlign: 'center',
  },
  SliderContainer: {
    border: '1px solid #aab1b8',
    padding: '3px 10px',
    borderRadius: '6px',
    marginBottom: '10px',
    boxShadow: '0 4px 0px rgba(0,0,0,0.1)',
  },
};
let timer = null;
class SetChartSize extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      setSizeFlag: false,
      initChartSize: 100,
    };
  }

  valueLabelFormat = (value) => {
    return value + '%';
  };

  setChartSize = (event, value) => {
    let chartContainer = document.querySelector('div.parent > div');
    this.setState({
      initChartSize: value,
    });
    // 防抖
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // chartContainer.style.width = 1 * value + '%';
      chartContainer.style.height = 500 * (value / 100) + 'px';
    }, 500);
  };

  handleClickAway = () => {
    this.setState({
      setSizeFlag: false,
    });
  };
  render() {
    const { setSizeFlag, initChartSize } = this.state;
    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <div style={styles_inside.setBarSize}>
          {setSizeFlag && (
            <div style={styles_inside.SliderContainer}>
              <Slider
                valueLabelDisplay="auto"
                step={10}
                min={50}
                max={150}
                value={initChartSize}
                valueLabelFormat={this.valueLabelFormat}
                onChange={this.setChartSize}
              />
            </div>
          )}

          <ZoomInIcon
            style={{
              color: setSizeFlag ? '#3498DB' : '#aab1b8',
              cursor: 'pointer',
            }}
            onClick={() => {
              this.setState({
                setSizeFlag: !this.state.setSizeFlag,
              });
            }}
          />
        </div>
      </ClickAwayListener>
    );
  }
}

export default SetChartSize;
