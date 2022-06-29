import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import Immutable from 'immutable';
import dateFns from 'date-fns';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';

import { DateRangePicker } from 'rsuite';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import PotentialButton from '../particial/PotentialButton';
import PrimaryButton from '../particial/PrimaryButton';
import SecondaryButton from '../particial/SecondaryButton';
import FormInput from '../particial/FormInput';
import FormTextArea from '../particial/FormTextArea';
import CustomToggleButton from '../particial/CustomToggleButton2';

const styles = (theme) => ({
  root: {
    '& $dateCalendarMenu': {
      zIndex: theme.zIndex.tooltip,
    },
  },
  dateCalendarMenu: {
    zIndex: `${theme.zIndex.tooltip} !important`,
  },
});
const keys = [
  'id',
  'code',
  'title',
  /*'expLevel',*/
  'company',
  'skills.skillName',
  'billRate',
  'backDays',
  'range',
];

class JobFilter extends React.PureComponent {
  constructor(props) {
    super();
    const { type, priority, expLevel, range } = this.getStateFromProps(props);

    this.state = {
      open: false,
      type,
      priority,
      expLevel,
      range,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(this.getStateFromProps(nextProps));
  }

  handleFilter = (e) => {
    e.preventDefault();
    const jobFilterForm = e.target;
    const filters = keys.reduce((filters, key) => {
      let value;
      if (key === 'type' || key === 'priority' || key === 'expLevel') {
        value = this.state[key].length > 0 && this.state[key];
      } else if (key === 'range') {
        if (this.state.range.length) {
          value = {
            from: this.state.range[0].toISOString(),
            to: this.state.range[1].toISOString(),
          };
        }
      } else {
        value = jobFilterForm[key] && jobFilterForm[key].value;
      }
      if (value) {
        filters[key] = value;
      }
      return filters;
    }, {});

    this.props.onFilter(Immutable.Map(filters));
    this.setState({ open: false });
  };

  handleClose = () => {
    const { type, priority, expLevel, range } = this.getStateFromProps(
      this.props
    );
    this.setState({
      open: false,
      type,
      priority,
      expLevel,
      range,
    });
  };

  getStateFromProps = (props) => {
    let range = [];
    if (
      props.filters.getIn(['range', 'from']) &&
      props.filters.getIn(['range', 'to'])
    ) {
      range = [
        new Date(props.filters.getIn(['range', 'from'])),
        new Date(props.filters.getIn(['range', 'to'])),
      ];
    }

    return {
      type: props.filters.get('type') || [],
      priority: props.filters.get('priority') || [],
      expLevel: props.filters.get('expLevel') || [],
      range,
    };
  };

  render() {
    const { open, range } = this.state;
    const { t, i18n, classes, filters } = this.props;
    const isZH = i18n.language.match('zh');
    console.log(zhCN, enUS);
    return (
      <div className={classes.root} style={{ height: 36 }}>
        <PotentialButton onClick={() => this.setState({ open: true })}>
          {t('common:advancedSearch')}
        </PotentialButton>
        <Dialog open={open} maxWidth="md">
          <DialogTitle>{t('common:advancedSearch')}</DialogTitle>

          <DialogContent>
            <form
              onSubmit={this.handleFilter}
              id="jobFilterForm"
              className="vertical-layout"
              style={{ width: 560 }}
            >
              <div className="row expanded ">
                <div className="small-6 columns" style={{ fontSize: '.75rem' }}>
                  <DateRangePicker
                    value={range}
                    toggleComponentClass={CustomToggleButton}
                    disabledDate={(date) => dateFns.isAfter(date, new Date())}
                    menuClassName={classes.dateCalendarMenu}
                    block
                    onChange={(range) => {
                      console.log('onChange', range);
                      range[1] = dateFns.endOfDay(range[1]);
                      this.setState({ range });
                    }}
                    placeholder={t('message:selectDateRange')}
                    locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
                  />
                </div>
              </div>
              <div className="row expanded ">
                <div className="small-6 columns">
                  <FormInput
                    placeholder={t('field:jobID')}
                    name="id"
                    defaultValue={filters.get('id') || ''}
                  />
                </div>
                <div className="small-6 columns">
                  <FormInput
                    placeholder={t('field:code')}
                    name="code"
                    defaultValue={filters.get('code') || ''}
                  />
                </div>
                <div className="small-6 columns">
                  <FormInput
                    placeholder={t('field:title')}
                    name="title"
                    defaultValue={filters.get('title') || ''}
                  />
                </div>

                <div className="small-6 columns">
                  <FormInput
                    placeholder={t('field:company')}
                    name="company"
                    defaultValue={filters.get('company') || ''}
                  />
                </div>

                <div className="small-6 columns">
                  <FormInput
                    placeholder="Bill Rate"
                    name="billRate"
                    type="number"
                    step={'.01'}
                    defaultValue={filters.get('billRate') || ''}
                  />
                </div>

                {/*<div className="small-3 columns">*/}
                {/*  <FormInput placeholder="Back Days"*/}
                {/*             name="backDays"*/}
                {/*             type="number"*/}
                {/*             defaultValue={filters.get("backDays") || ""}*/}

                {/*  />*/}
                {/*</div>*/}
                <div className="small-12 columns">
                  <FormTextArea
                    placeholder={t('field:skills')}
                    name="skills.skillName"
                    rows={5}
                    defaultValue={filters.get('skills.skillName') || ''}
                  />
                </div>
              </div>
            </form>
          </DialogContent>

          <DialogActions className="horizontal-layout">
            <SecondaryButton onClick={this.handleClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton form="jobFilterForm" type="submit">
              {t('action:search')}
            </PrimaryButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withTranslation(['action', 'field'])(
  withStyles(styles)(JobFilter)
);
