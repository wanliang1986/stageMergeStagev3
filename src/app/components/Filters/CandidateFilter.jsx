import React from 'react';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import clsx from 'clsx';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import PotentialButton from '../particial/PotentialButton';
import PrimaryButton from '../particial/PrimaryButton';
import SecondaryButton from '../particial/SecondaryButton';
import FormInput from '../particial/FormInput';
import FormTextArea from '../particial/FormTextArea';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DateRangePicker from 'react-dates/esm/components/DateRangePicker';
import { validateDate } from '../../../utils';
import moment from 'moment-timezone';

const keys = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'title',
  'company',
  'currentLocation.country',
  'currentLocation.province',
  'currentLocation.city',
  'skills.skillName',
  'range',
];

class CandidateFilter extends React.PureComponent {
  constructor(props) {
    super(props);
    const { range } = this.getStateFromProps(props);

    this.state = {
      open: false,
      range,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  handleFilter = (e) => {
    e.preventDefault();
    const candidateFilterForm = e.target;
    const filters = keys.reduce((filters, key) => {
      let value;
      if (key === 'range') {
        value = (this.state.range.from || this.state.range.to) && {};
        if (this.state.range.from) {
          value.from = this.state.range.from.toISOString();
        }
        if (this.state.range.to) {
          value.to = this.state.range.to.toISOString();
        }
      } else {
        value = candidateFilterForm[key] && candidateFilterForm[key].value;
      }
      if (value) {
        filters[key] = value;
      }
      return filters;
    }, {});
    if (candidateFilterForm.chinese.checked) {
      filters.chinese = true;
    }
    this.props.onFilter(Immutable.Map(filters));
    this.handleClose();
  };

  handleFocusChange = (focusedInput) => this.setState({ focusedInput });
  handleDateRangeChange = ({ startDate: from, endDate: to }) => {
    this.setState({ range: { from, to } });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  handleOpen = () => {
    this.setState({ open: true });
  };

  getStateFromProps = (props) => {
    const range = {};
    if (props.filters.getIn(['range', 'from'])) {
      range.from = moment(props.filters.getIn(['range', 'from']));
    }
    if (props.filters.getIn(['range', 'to'])) {
      range.to = moment(props.filters.getIn(['range', 'to']));
    }
    return {
      range,
    };
  };

  render() {
    const { open, range } = this.state;
    const { t, filters } = this.props;
    return (
      <div style={{ height: 36 }}>
        <PotentialButton onClick={this.handleOpen}>
          {t('common:advancedSearch')}
        </PotentialButton>
        <Dialog open={open} fullWidth maxWidth="md">
          <DialogTitle>{t('common:advancedSearch')}</DialogTitle>
          <DialogContent>
            <form
              onSubmit={this.handleFilter}
              className="vertical-layout"
              id="candidateFilterForm"
            >
              <div className="row expanded ">
                <div
                  className={clsx('small-4 columns', {
                    focused: this.state.focusedInput,
                  })}
                >
                  <DateRangePicker
                    startDate={range.from} // momentPropTypes.momentObj or null,
                    startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                    endDate={range.to} // momentPropTypes.momentObj or null,
                    endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                    onDatesChange={this.handleDateRangeChange} // PropTypes.func.isRequired,
                    focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                    onFocusChange={this.handleFocusChange} // PropTypes.func.isRequired,
                    small
                    isOutsideRange={validateDate}
                    displayFormat="MM/DD/YYYY"
                  />
                </div>
              </div>

              <div className="row expanded ">
                <div className="small-4 columns">
                  <FormInput
                    placeholder={t('field:firstName')}
                    name="firstName"
                    defaultValue={filters.get('firstName') || ''}
                  />
                </div>
                <div className="small-4 columns">
                  <FormInput
                    placeholder={t('field:lastName')}
                    name="lastName"
                    defaultValue={filters.get('lastName') || ''}
                  />
                </div>
                <div className="small-4 columns">
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={filters.get('chinese') || false}
                        color="primary"
                        inputProps={{ name: 'chinese' }}
                      />
                    }
                    label={t('field:Mandarin Speaking')}
                  />
                </div>
                <div className="small-4 columns">
                  <FormInput
                    placeholder={t('field:country')}
                    name="currentLocation.country"
                    defaultValue={filters.get('currentLocation.country') || ''}
                  />
                </div>
                <div className="small-4 columns">
                  <FormInput
                    placeholder={t('field:province')}
                    name="currentLocation.province"
                    defaultValue={filters.get('currentLocation.province') || ''}
                  />
                </div>
                <div className="small-4 columns">
                  <FormInput
                    placeholder={t('field:city')}
                    name="currentLocation.city"
                    defaultValue={filters.get('currentLocation.city') || ''}
                  />
                </div>

                <div className="small-6 columns">
                  <FormInput
                    placeholder={t('field:jobTitle')}
                    name="title"
                    defaultValue={filters.get('title') || ''}
                  />
                </div>

                <div className="small-6 columns">
                  {/*<FormReactSelectContainer>*/}
                  {/*<Select.Creatable*/}
                  {/*placeholder={t('field:company')}*/}
                  {/*multi={true}*/}
                  {/*value={this.state.company}*/}
                  {/*onChange={(company) => {*/}
                  {/*this.setState({company})*/}
                  {/*}}*/}

                  {/*options={this.state.companyOptions}*/}
                  {/*autoBlur={true}*/}
                  {/*promptText="Add"*/}
                  {/*/>*/}
                  {/*</FormReactSelectContainer>*/}
                  <FormInput
                    placeholder={t('field:company')}
                    name="company"
                    defaultValue={filters.get('company') || ''}
                  />
                </div>

                {/*<div className="small-3 columns">*/}
                {/*<FormInput placeholder="Min Expected Salary"*/}
                {/*name="expectedSalaryFrom"*/}
                {/*type="number"*/}
                {/*defaultValue={(filters.get('expectedSalary') && filters.get('expectedSalary').min) || ''}*/}

                {/*/>*/}
                {/*</div>*/}
                {/*<div className="small-3 columns">*/}
                {/*<FormInput placeholder="Max Expected Salary"*/}
                {/*name="expectedSalaryTo"*/}
                {/*type="number"*/}
                {/*defaultValue={(filters.get('expectedSalary') && filters.get('expectedSalary').max) || ''}*/}

                {/*/>*/}
                {/*</div>*/}
                {/*<div className="small-3 columns">*/}
                {/*<FormInput placeholder="Back Days"*/}
                {/*name="backDays"*/}
                {/*type="number"*/}
                {/*defaultValue={filters.get('backDays') || ''}*/}

                {/*/>*/}
                {/*</div>*/}
                {/*<div className="small-3 columns">*/}
                {/*<FormInput placeholder="Date To"*/}
                {/*name="dateTo"*/}
                {/*type="date"*/}
                {/*defaultValue={filters.getIn(['date2', 'max']) || ''}*/}

                {/*/>*/}
                {/*</div>*/}
                <div className="small-12 columns">
                  <FormTextArea
                    placeholder={t('field:skills')}
                    name="skills.skillName"
                    rows={3}
                    defaultValue={filters.get('skills.skillName')}
                  />
                </div>
              </div>
            </form>
          </DialogContent>

          <DialogActions className="horizontal-layout">
            <SecondaryButton onClick={this.handleClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton form="candidateFilterForm" type="submit">
              {t('action:search')}
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation(['action', 'field'])(CandidateFilter);
