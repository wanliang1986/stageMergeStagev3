import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';

import CalenderIcon from '@material-ui/icons/Event';
import LeftIcon from '@material-ui/icons/ChevronLeft';
import RightIcon from '@material-ui/icons/ChevronRight';

import PotentialButton from './PotentialButton';
import PrimaryButton from './PrimaryButton';

const styles = {
  root: {
    width: 320,
    padding: '4px 8px',
  },
  monthButton: {
    width: '100%',
    height: 40,
    minWidth: 0,
    marginTop: 4,
    marginBottom: 8,
    display: 'block',
  },
};

class MonthSelector extends React.Component {
  constructor(props) {
    super();

    this.onNextYear = this.onNextYear.bind(this);
    this.onPrevYear = this.onPrevYear.bind(this);
    this.onResetYear = this.onResetYear.bind(this);

    this.state = {
      year: props.year,
    };
  }

  onPrevYear() {
    this.setState({ year: this.state.year - 1 });
  }

  onNextYear() {
    this.setState({ year: this.state.year + 1 });
  }

  onSelect(month) {
    this.props.onSelect({
      month,
      year: this.state.year,
    });
  }

  onResetYear() {
    this.setState({ year: this.props.year });
  }

  renderMonth(month) {
    const selected =
      this.props.month === month && this.props.year === this.state.year;
    const disabled = moment([this.state.year, month]).isAfter(moment());
    return (
      <div className={'columns small-3'} key={month}>
        {selected ? (
          <PrimaryButton
            onClick={() => this.onSelect(month)}
            style={styles.monthButton}
            disabled={disabled}
          >
            {moment().month(month).format('MMM')}
          </PrimaryButton>
        ) : (
          <PotentialButton
            onClick={() => this.onSelect(month)}
            style={styles.monthButton}
            disabled={disabled}
          >
            {moment().month(month).format('MMM')}
          </PotentialButton>
        )}
      </div>
    );
  }

  render() {
    const months = [];
    for (var i = 0; i < 12; i++) {
      months.push(this.renderMonth(i));
    }

    return (
      <div style={styles.root}>
        <div className="flex-container align-middle">
          <IconButton onClick={this.onPrevYear}>
            <LeftIcon />
          </IconButton>
          <div className="flex-child-auto">
            <Button variant="flat" onClick={this.onResetYear} fullWidth>
              {this.state.year}
            </Button>
          </div>

          <IconButton onClick={this.onNextYear}>
            <RightIcon />
          </IconButton>
        </div>
        <div className="row">{months}</div>
      </div>
    );
  }
}

MonthSelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  month: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

class MonthSelectorButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      open: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleClick = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({ open: true });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  onSelect = ({ month, year }) => {
    const value = moment([year, month]).format('YYYY-MM');
    if (value !== this.props.value) {
      this.props.onChange(value);
    }
    this.setState({ value, open: false });
  };
  onBlur = (e) => {
    if (e.target.value !== this.props.value) {
      this.props.onChange(e.target.value);
    }
  };
  onSubmit = (e) => {
    e.preventDefault();
    // e.target.month.blur();
    if (e.target.month.value !== this.props.value) {
      this.props.onChange(e.target.month.value);
    }
  };

  render() {
    const { onChange, ...props } = this.props;
    const { value } = this.state;
    return (
      <div ref={(root) => (this.root = root)}>
        <div className="flex-container align-middle foundation">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              style={{ height: 32, width: 100, margin: 0 }}
              name="month"
              placeholder="yyyy-mm"
              value={value}
              onChange={(e) => this.setState({ value: e.target.value })}
              onBlur={this.onBlur}
            />
          </form>
          <IconButton
            onClick={this.handleClick}
            style={{ width: 32, height: 32 }}
          >
            <CalenderIcon />
          </IconButton>
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.root}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          onClose={this.handleRequestClose}
        >
          <MonthSelector
            {...props}
            month={
              isNaN(moment(value).month())
                ? moment().month()
                : moment(value).month()
            }
            year={moment(value).year() || moment().year()}
            onSelect={this.onSelect}
          />
        </Popover>
      </div>
    );
  }
}

export default MonthSelectorButton;
