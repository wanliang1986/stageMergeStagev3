import React from 'react';
import moment from 'moment-timezone';
import { getStartupFeeByCompany } from '../../../../../apn-sdk/invoice';

import Select from 'react-select';
import DatePicker from 'react-datepicker';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Radio from '@material-ui/core/Radio';

import FormInput from '../../../../components/particial/FormInput';
import NumberFormat from 'react-number-format';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import PrimaryButton from '../../../../components/particial/PrimaryButton';

class StartupFeeOption extends React.Component {
  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  };
  handleMouseEnter = (event) => {
    this.props.onFocus(this.props.option, event);
  };
  handleMouseMove = (event) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  };

  render() {
    const { className, option, isSelected, isFocused } = this.props;
    return (
      <div
        className={className}
        style={{ width: 420, display: 'flex' }}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={option.title}
      >
        <div>
          <Radio checked={isSelected} color="primary" size="small" />
        </div>
        <div>
          <Typography variant="subtitle2">
            Invoice Number: {option.invoiceNo}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Invoice Amount: {option.currency === 'USD' ? '$' : '¥'}
            {(option.dueAmount || 0).toLocaleString()}&nbsp;&nbsp;&nbsp; Invoice
            Date: {option.invoiceDate}
          </Typography>
        </div>
      </div>
    );
  }
}

class StartupFeeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      paidStartupFee: false,
      openWarning: false,
    };
  }
  componentDidMount(): void {
    console.log(this.props);
    const companyId = this.props.invoice.companyId;
    if (companyId)
      getStartupFeeByCompany(this.props.invoice.companyId).then(
        ({ response }) => {
          if (response.elements && response.elements.length > 0)
            this.setState({ options: response.elements, selected: null });
        }
      );
  }

  handleSelect = (selected) => {
    if (selected) {
      console.log(this.props.invoice);
      if (Number(selected.dueAmount) > this.props.invoice.dueAmount) {
        return this.setState({ openWarning: true });
      }
      this.setState(
        {
          selected,
          date: moment(selected.dueDate),
          amount: Number(selected.dueAmount),
        },
        () => this.props.onSelect(selected)
      );
    }
  };

  handleToggle = (e) => {
    const paidStartupFee = e.target.checked;
    this.setState({ paidStartupFee }, () => {
      this.props.onSelect(this.state.paidStartupFee && this.state.selected);
    });
  };

  render() {
    const { options, selected, openWarning } = this.state;
    const { t, invoice } = this.props;
    return (
      <>
        <div className="row expanded">
          <div className="columns">
            <FormControlLabel
              control={
                <Switch
                  onChange={this.handleToggle}
                  value="paidStartupFee"
                  color="primary"
                  name="paidStartupFee"
                  checked={this.state.paidStartupFee}
                />
              }
              disabled={!options}
              label="Startup Fee Invoice"
              labelPlacement="start"
              style={{ marginLeft: 0 }}
            />
          </div>
        </div>

        {this.state.paidStartupFee && (
          <div className="row expanded">
            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:Invoice Number')}>
                <Select
                  value={selected}
                  onChange={this.handleSelect}
                  valueKey="id"
                  labelKey="invoiceNo"
                  options={options}
                  optionComponent={StartupFeeOption}
                  searchPromptText={'Type to search employee'}
                  autoBlur={true}
                  clearable={false}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="startupFeeInvoiceNo"
                value={(selected && selected.invoiceNo) || ''}
              />
            </div>

            <div className="small-4 columns">
              <DatePicker
                customInput={<FormInput label={t('field:dueDate')} />}
                selected={this.state.date}
                placeholderText="mm/dd/yyyy"
                disabled
              />
            </div>

            <div className="small-4 columns">
              <FormReactSelectContainer label={t('field:amount')}>
                <NumberFormat
                  decimalScale={0}
                  thousandSeparator
                  prefix={invoice.currency === 'USD' ? '$' : '¥'}
                  value={this.state.amount}
                  disabled
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="startupFeeAmount"
                value={this.state.amount || 0}
              />
            </div>
          </div>
        )}
        <Dialog
          open={openWarning}
          onClose={() => this.setState({ openWarning: false })}
          disableEnforceFocus
        >
          <DialogTitle>{t('Warning')}</DialogTitle>
          <DialogContent>
            <Typography>
              {t(
                'The Startup fee you selected exceeds current invoice amount. You may 1) select other available startup fee (equals to or less than current invoice amount) or 2) void this selected startup fee invoice, and create 2 new startup fee invoices.'
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <PrimaryButton
              onClick={(e) => {
                e.preventDefault();
                this.setState({ openWarning: false });
                return false;
              }}
            >
              {t('action:confirm')}
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default StartupFeeSelector;
