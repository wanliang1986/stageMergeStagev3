import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { currency as currencyOptions } from '../../../../../constants/formOptions';
import moment from 'moment-timezone';
import { getApplicationOfferLetterParam } from '../../../../../../apn-sdk';
import { showErrorMessage } from '../../../../../actions';
import { mapOfferLetterParams } from '../../../../../../utils';

import DatePicker from 'react-datepicker';
import NumberFormat from 'react-number-format';
import Select from 'react-select';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import RateEdit from '../DialogForm/Rate';
import RateChange from '../DialogForm/RateChange';
import FormTextArea from '../../../../../components/particial/FormTextArea';

const rateUnitTypeOptions = [
  { label: 'Yearly', value: 'YEARLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Hourly', value: 'HOURLY' },
];
const currencyLabels = currencyOptions.reduce((res, v) => {
  res[v.value] = v.label;
  return res;
}, {});

const state = {};
const styles = {
  root: {
    border: `solid 1px #e5e5e5`,
    borderRadius: 2,
  },
  actionContainer: {
    backgroundColor: `#fafafb`,
    minHeight: 40,
  },
  content: {
    padding: 12,
  },
};
class Contract extends React.Component {
  constructor(props) {
    super(props);
    const startContractRate =
      props.start.startContractRates[props.start.startContractRates.length - 1];
    this.state = {
      open: false,
      openAdd: false,

      selectedStartContractRateId: startContractRate.id,
      // options
      taxBurdenRateOpts: [],
      mspRateOpts: [],
      immigrationCostOpts: [],
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Readonly<P>, nextContext: any) {
    const startContractRate = nextProps.start.startContractRates.find(
      (cr) => cr.id === this.state.selectedStartContractRateId
    );
    if (!startContractRate) {
      this.setState({
        selectedStartContractRateId:
          nextProps.start.startContractRates[
            nextProps.start.startContractRates.length - 1
          ].id,
      });
    }
  }

  componentDidMount() {
    // this.getParams();
  }

  getParams = () => {
    const { dispatch } = this.props;
    if (state.offerLetterParam) {
      this.setState(state.offerLetterParam);
    } else {
      getApplicationOfferLetterParam()
        .then(({ response }) => {
          state.offerLetterParam = mapOfferLetterParams(response);
          this.setState(state.offerLetterParam);
        })
        .catch((err) => dispatch(showErrorMessage(err)));
    }
  };

  handleStartContractRate = (selectedStartContractRateId) => {
    if (selectedStartContractRateId) {
      this.setState({ selectedStartContractRateId });
    }
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleRateChange = () => {
    this.setState({ openAdd: true });
  };
  handleClose = (selectedStartContractRateId) => {
    console.log(selectedStartContractRateId);
    this.setState({
      open: false,
      openAdd: false,
      selectedStartContractRateId:
        selectedStartContractRateId || this.state.selectedStartContractRateId,
    });
  };

  render() {
    const {
      open,
      openAdd,
      selectedStartContractRateId,
      taxBurdenRateOpts,
      mspRateOpts,
      immigrationCostOpts,
    } = this.state;
    const { classes, t, edit, start, isAm } = this.props;

    const startContractRate = start.startContractRates.find(
      (el) => el.id === selectedStartContractRateId
    );
    const canEdit =
      startContractRate.id &&
      startContractRate.id ===
        start.startContractRates[start.startContractRates.length - 1].id;

    return (
      <div className={classes.root}>
        <div
          className={clsx(
            'flex-container align-middle align-justify item-padding',
            classes.actionContainer
          )}
        >
          <Typography variant="subtitle2">{t('common:Rate')}</Typography>
          <div className={'flex-child-auto'} />
          {start.status === 'ACTIVE' && isAm && (
            <SecondaryButton onClick={this.handleRateChange} size="small">
              {t('action:Rate Change')}
            </SecondaryButton>
          )}
          {start.status === 'ACTIVE' && canEdit && isAm && (
            <SecondaryButton onClick={this.handleOpen} size="small">
              {t('action:edit')}
            </SecondaryButton>
          )}
        </div>
        <div className={classes.content}>
          {start.startContractRates.length > 1 && (
            <div className=" flex-container align-middle">
              <div className="columns">
                <TextField
                  select
                  value={selectedStartContractRateId}
                  onChange={(e) => this.handleStartContractRate(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  SelectProps={{
                    MenuProps: {
                      MenuListProps: {
                        dense: true,
                        disablePadding: true,
                      },
                    },
                  }}
                >
                  {start.startContractRates
                    .slice()
                    .reverse()
                    .map((rc, index) => (
                      <MenuItem key={rc.id} value={rc.id}>
                        <Typography noWrap>
                          {`Rate Change ${moment(rc.startDate).format('L')}`}
                        </Typography>
                      </MenuItem>
                    ))}
                </TextField>
              </div>
              <Typography>
                {t('field:Total GM')}
                {': '}
                {currencyLabels[startContractRate.currency || 'USD']}{' '}
                {start.startContractRates
                  .reduce((gm, rc) => {
                    gm += rc.totalBillAmount;
                    return gm;
                  }, 0)
                  .toLocaleString()}
              </Typography>
            </div>
          )}
          <div className="row expanded">
            <div className="small-6 columns">
              <DatePicker
                dropdownMode={'scroll'}
                customInput={
                  <FormInput label={t('field:startDate')} isRequired />
                }
                selected={
                  startContractRate.startDate
                    ? moment(startContractRate.startDate)
                    : null
                }
                placeholderText="mm/dd/yyyy"
                disabled={!edit}
              />
            </div>

            <div className="small-6 columns">
              <DatePicker
                dropdownMode={'scroll'}
                customInput={
                  <FormInput isRequired label={t('field:endDate')} />
                }
                selected={
                  startContractRate.endDate
                    ? moment(startContractRate.endDate)
                    : null
                }
                onChange={this.handleEndDateChange}
                placeholderText="mm/dd/yyyy"
                disabled={!edit}
              />
            </div>
          </div>

          <div className="row expanded">
            {/* finalBillRate */}
            <div className="small-3 columns">
              <FormReactSelectContainer
                label={t('field:Final Bill Rate')}
                isRequired
              >
                <NumberFormat
                  disabled={!edit}
                  thousandSeparator
                  prefix={currencyLabels[startContractRate.currency || 'USD']}
                  value={startContractRate.finalBillRate}
                  decimalScale={2}
                />
              </FormReactSelectContainer>
            </div>
            {/* finalPayRate */}
            <div className="small-3 columns">
              <FormReactSelectContainer
                label={t('field:Final Pay Rate')}
                isRequired
              >
                <NumberFormat
                  disabled={!edit}
                  thousandSeparator
                  prefix={currencyLabels[startContractRate.currency || 'USD']}
                  value={startContractRate.finalPayRate}
                  decimalScale={2}
                />
              </FormReactSelectContainer>
            </div>

            {/* 货币单位 */}
            <div className="small-3 columns">
              <FormReactSelectContainer
                label={t('field:Rate Currency')}
                isRequired
              >
                <Select
                  labelKey={'label2'}
                  clearable={false}
                  disabled={!edit}
                  value={startContractRate.currency || 'USD'}
                  options={currencyOptions}
                  simpleValue
                />
              </FormReactSelectContainer>
            </div>

            {/* 周期 */}
            <div className="small-3 columns">
              <FormReactSelectContainer
                label={t('field:Rate Unit Type')}
                isRequired
              >
                <Select
                  clearable={false}
                  disabled={!edit}
                  value={startContractRate.rateUnitType}
                  simpleValue
                  options={rateUnitTypeOptions}
                />
              </FormReactSelectContainer>
            </div>
          </div>

          {/* 4 row */}
          <div className="row expanded">
            <div className="small-6 columns">
              <FormReactSelectContainer label="Tax Burden Rate" isRequired>
                <Select
                  valueKey={'code'}
                  labelKey={'description'}
                  clearable={false}
                  disabled={!edit}
                  options={taxBurdenRateOpts}
                  value={startContractRate.taxBurdenRate}
                />
              </FormReactSelectContainer>
            </div>

            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:MSP Rate')} isRequired>
                <Select
                  valueKey={'code'}
                  labelKey={'description'}
                  clearable={false}
                  disabled={!edit}
                  options={mspRateOpts}
                  value={startContractRate.mspRate}
                />
              </FormReactSelectContainer>
            </div>
          </div>

          {/* 5 row */}
          <div className="row expanded">
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={t('field:Immigration Cost')}
                isRequired
              >
                <Select
                  valueKey={'code'}
                  labelKey={'description'}
                  clearable={false}
                  disabled={!edit}
                  options={immigrationCostOpts}
                  value={startContractRate.immigrationCost}
                />
              </FormReactSelectContainer>
            </div>

            <div className="small-6 columns">
              <FormReactSelectContainer label={'Extra Cost'}>
                <NumberFormat
                  disabled={!edit}
                  thousandSeparator
                  prefix={currencyLabels[startContractRate.currency || 'USD']}
                  value={startContractRate.extraCost}
                  decimalScale={2}
                />
              </FormReactSelectContainer>
            </div>
          </div>

          {/* 6 row */}
          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                isRequired
                disabled={!edit}
                value={startContractRate.estimatedWorkingHourPerWeek || ''}
                label={'Estimated Working Hour Per Week'}
                name="estimatedWorkingHourPerWeek"
                type="number"
                min={1}
                max={56}
              />
            </div>

            <div className="small-6 columns">
              <FormInput
                label={'GM'}
                isRequired
                disabled
                value={
                  startContractRate.totalBillAmount
                    ? `${
                        currencyLabels[startContractRate.currency || 'USD']
                      }${startContractRate.totalBillAmount.toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}`
                    : ''
                }
              />
            </div>
          </div>

          {/* 备忘 */}
          <div className="row expanded">
            <div className="small-12 columns">
              <FormTextArea
                key={startContractRate.id}
                disabled
                label={t('field:Rate Note')}
                name="note"
                defaultValue={startContractRate.note || ''}
                rows={4}
              />
            </div>
          </div>
        </div>

        <Dialog open={open}>
          <RateEdit
            start={start}
            t={t}
            onClose={this.handleClose}
            oldContractRate={start.startContractRates.at(-2)}
            startContractRate={startContractRate}
          />
        </Dialog>

        <Dialog open={openAdd}>
          <RateChange
            start={start}
            t={t}
            onClose={this.handleClose}
            startContractRate={
              start.startContractRates[start.startContractRates.length - 1]
            }
          />
        </Dialog>
      </div>
    );
  }
}

export default connect()(withStyles(styles)(Contract));
