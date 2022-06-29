import React, { Component } from 'react';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import lodash from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import {
  timeSheetType,
  weekEnding,
  frequency,
} from '../../../../../constants/formOptions';

const styles = {
  approvers: {
    '& .Select-control': {
      height: '2rem',
    },
    '& .Select-input': {
      height: '30px',
    },
    '& .Select-placeholder': {
      lineHeight: '30px',
    },
  },
};

class TimeSheetForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      approvers:
        this.props.timeSheet &&
        this.props.timeSheet.approvers &&
        this.props.timeSheet.approvers.length > 0
          ? this.props.timeSheet.approvers
          : [{ id: null, name: null }],
      timesheetsChecked: this.props.timeSheet
        ? this.props.timeSheet.allowSubmitTimeSheet
        : false,
      ExpensesChecked: this.props.timeSheet
        ? this.props.timeSheet.allowSubmitExpense
        : false,
      approver: null,
      timeSheetType: this.props.timeSheet
        ? this.props.timeSheet.timeSheetType
        : 'WEEK_AM_PM',
      frequency: this.props.timeSheet
        ? this.props.timeSheet.frequency
        : 'WEEKLY',
      weekEnding: this.props.timeSheet
        ? this.props.timeSheet.weekEnding
        : 'SUNDAY',
      instructions: this.props.timeSheet
        ? this.props.timeSheet.instructions
        : null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      JSON.stringify(nextProps.timeSheet) !==
      JSON.stringify(this.props.timeSheet)
    ) {
      this._setBillInfoState(nextProps.timeSheet);
    }
  }
  _setBillInfoState = (timeSheet) => {
    this.setState({
      approvers:
        timeSheet && timeSheet.approvers && timeSheet.approvers.length > 0
          ? timeSheet.approvers
          : [{ id: null, name: null }],
      timesheetsChecked: timeSheet && timeSheet.allowSubmitTimeSheet,
      ExpensesChecked: timeSheet && timeSheet.allowSubmitExpense,
      timeSheetType: timeSheet && timeSheet.timeSheetType,
      frequency: timeSheet && timeSheet.frequency,
      weekEnding: timeSheet && timeSheet.weekEnding,
      instructions: timeSheet && timeSheet.instructions,
    });
  };

  TimesheetsProtalChecked = (e) => {
    this.setState({
      timesheetsChecked: e.target.checked,
    });
  };
  ExpensesProtalChecked = (e) => {
    this.setState({
      ExpensesChecked: e.target.checked,
    });
  };
  addApprovers = () => {
    const { approvers } = this.state;
    let obj = { id: null, name: null };
    let _approvers = lodash.cloneDeep(approvers);
    _approvers.push(obj);
    this.setState({
      approvers: _approvers,
    });
  };
  deleteApprovers = (index) => {
    const { approvers } = this.state;
    let _approvers = lodash.cloneDeep(approvers);
    _approvers.splice(index, 1);
    this.setState({
      approvers: _approvers,
    });
  };
  changeApprover = (obj, index) => {
    const { approvers } = this.state;
    let _approvers = lodash.cloneDeep(approvers);
    if (obj) {
      let _index = _approvers.indexOf(obj.id);
      if (_index === -1) {
        _approvers.splice(index, 1, obj.id);
        this.setState({
          approvers: _approvers,
        });
      }
    } else {
      _approvers.splice(index, 1, [{ id: null, name: null }]);
      this.setState({
        approvers: _approvers,
      });
    }
  };
  setPrimary = (index) => {
    const { approvers } = this.state;
    let _approvers = lodash.cloneDeep(approvers);
    let id = _approvers[index];
    if (typeof id === 'number' || (typeof id === 'object' && id.id)) {
      _approvers.splice(index, 1);
      _approvers.unshift(id);
      this.setState({
        approvers: _approvers,
      });
    }
  };
  getAppropvers = (approvers) => {
    let arr = [];
    approvers.forEach((item, index) => {
      if (item && item.id && item.id !== null) {
        arr.push(item.id);
      } else if (typeof item === 'number') {
        arr.push(item);
      }
    });
    return JSON.stringify(arr);
  };
  render() {
    const { approvers, timesheetsChecked, ExpensesChecked } = this.state;
    const {
      t,
      classes,
      isClockIn,
      pageType,
      clientList,
      index,
      editType,
      isSubmitExpenses,
      ...props
    } = this.props;
    console.log(this.props);
    return (
      <>
        <Grid container spacing={3} key={`timeSheet_${index}`}>
          <Grid item xs={12} className={classes.approvers}>
            <FormReactSelectContainer
              label={t('field:Approvers')}
            ></FormReactSelectContainer>
            {approvers.map((item, index) => {
              return (
                <>
                  <Grid container spacing={1} key={index}>
                    <Grid item xs={5}>
                      <Select
                        key={index}
                        searchable
                        value={item}
                        labelKey={'name'}
                        valueKey={'id'}
                        options={clientList}
                        clearable={true}
                        onChange={(value) => {
                          this.changeApprover(value, index);
                        }}
                        disabled={pageType === 'history' || !editType}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <Button
                        disabled={pageType === 'history' || !editType}
                        variant="text"
                        color="primary"
                        onClick={() => {
                          this.addApprovers();
                        }}
                      >
                        add
                      </Button>
                    </Grid>
                    <Grid item xs={1}>
                      {approvers.length > 1 ? (
                        <Button
                          variant="text"
                          color="secondary"
                          disabled={pageType === 'history' || !editType}
                          onClick={() => {
                            this.deleteApprovers(index);
                          }}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </Grid>
                    <Grid item xs={2} style={{ paddingLeft: '15px' }}>
                      {index !== 0 ? (
                        <Button
                          variant="text"
                          color="primary"
                          disabled={pageType === 'history' || !editType}
                          onClick={() => {
                            this.setPrimary(index);
                          }}
                        >
                          Set as Primary
                        </Button>
                      ) : approvers.length > 1 ? (
                        <Button disabled>Primary</Button>
                      ) : null}
                    </Grid>
                  </Grid>
                </>
              );
            })}
            <input
              type="hidden"
              name="approvers"
              value={this.getAppropvers(approvers)}
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={4}>
            <FormReactSelectContainer label={t('field:Timesheet Entry Format')}>
              <Select
                searchable
                labelKey={'label'}
                valueKey={'value'}
                value={this.state.timeSheetType}
                disabled={
                  isClockIn === true || pageType === 'history' || !editType
                }
                options={timeSheetType}
                clearable={false}
                autoBlur={true}
                onChange={(option) => {
                  this.setState({
                    timeSheetType: option.value,
                  });
                }}
              />
            </FormReactSelectContainer>
            <input
              name="TimesheetEntryFormat"
              value={this.state.timeSheetType}
              type="hidden"
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={4}>
            <FormReactSelectContainer
              label={t('field:Frequency')}
              isRequired={true}
            >
              <Select
                searchable
                valueKey={'value'}
                labelKey={'label'}
                options={frequency}
                value={this.state.frequency}
                disabled={
                  isClockIn === true || pageType === 'history' || !editType
                }
                clearable={false}
                autoBlur={true}
              />
            </FormReactSelectContainer>
            <input
              name="Frequency"
              value={this.state.frequency}
              type="hidden"
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={4}>
            <FormReactSelectContainer
              label={t('field:Week Ending')}
              isRequired={true}
            >
              <Select
                searchable
                valueKey={'value'}
                labelKey={'label'}
                value={this.state.weekEnding}
                disabled={
                  isClockIn === true ||
                  pageType === 'history' ||
                  !editType ||
                  isSubmitExpenses
                }
                options={weekEnding}
                clearable={false}
                autoBlur={true}
                onChange={(option) => {
                  this.setState({
                    weekEnding: option.value,
                  });
                }}
              />
            </FormReactSelectContainer>
            <input
              name="WeekEnding"
              value={this.state.weekEnding}
              type="hidden"
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={timesheetsChecked}
                  onChange={this.TimesheetsProtalChecked}
                  color="primary"
                  disabled={pageType === 'history' || !editType || isClockIn}
                />
              }
              label="Allow to Submit Timesheets on the Portal "
            />
            <input
              type="hidden"
              name="TimesheetsProtal"
              value={timesheetsChecked}
              form="billinforForm"
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={ExpensesChecked}
                  onChange={this.ExpensesProtalChecked}
                  color="primary"
                  form="billinforForm"
                  disabled={
                    pageType === 'history' || !editType || isSubmitExpenses
                  }
                />
              }
              label="Allow to Submit Expenses on the Portal"
            />
            <input
              type="hidden"
              name="ExpensesProtal"
              value={ExpensesChecked}
              form="billinforForm"
            />
          </Grid>
          {timesheetsChecked === true ? (
            <Grid item xs={12}>
              <FormTextArea
                name="note"
                isIcon
                value={this.state.instructions}
                tooltip={'Just write remote if employee is working remotely'}
                icon={
                  <InfoOutlinedIcon
                    style={{
                      verticalAlign: 'middle',
                      marginLeft: '4px',
                      color: '#a0a0a0',
                    }}
                  />
                }
                label={t('field:Comments (1000 chars max)')}
                onChange={(e) => {
                  this.setState({
                    instructions: e.target.value,
                  });
                }}
                rows="3"
                form="billinforForm"
                disabled={pageType === 'history' || !editType || isClockIn}
                maxLength={1000}
              />
            </Grid>
          ) : null}
        </Grid>
      </>
    );
  }
}

export default withStyles(styles)(TimeSheetForm);
