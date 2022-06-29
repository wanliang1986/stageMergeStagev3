import React from 'react';
import { connect } from 'react-redux';
// import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import { getActiveClientList } from '../../selectors/clientSelector';
import { getClientCompanyOptionsArray } from '../../selectors/companySelector';
import memoizeOne from 'memoize-one';

import DatePicker from 'react-datepicker';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import FormInput from '../../components/particial/FormInput';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';

import * as FormOptions from '../../constants/formOptions';
import Select from 'react-select';
import Immutable from 'immutable';

const jobStatusOptions = FormOptions.jobStatus.filter(
  (status) => !status.disabled
);

const styles = {
  fullWidth: {
    width: '100%',
    '&>div': {
      width: '100%',
    },
  },
  checkboxLabel: {
    marginLeft: -8,
    whiteSpace: 'nowrap',
  },
};
class JobBasicForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = this._getStateFromProps(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.job !== this.props.job ||
      nextProps.disabled !== this.props.disabled
    ) {
      this.setState(this._getStateFromProps(nextProps, this.state));
    }
  }

  _getStateFromProps = (props, state = {}) => {
    return {
      postingTime:
        state.postingTime ||
        (props.job.get('postingTime')
          ? moment(props.job.get('postingTime'))
          : props.job.get('id')
          ? null
          : moment()),
      startDate:
        state.startDate ||
        (props.job.get('startDate') && moment(props.job.get('startDate'))),
      endDate:
        state.endDate ||
        (props.job.get('endDate') && moment(props.job.get('endDate'))),
      internal: state.internal || !!props.job.get('internal'),
      status: state.status || props.job.get('status') || 'OPEN',
      jobType: state.jobType || props.job.get('jobType') || 'FULL_TIME',
      priority: state.priority || props.job.get('priority'),
      expLevels:
        state.expLevels ||
        (props.job.get('expLevels')
          ? props.job.get('expLevels').toSet().join(',')
          : ''),
      billRateUnitType:
        state.billRateUnitType || props.job.get('billRateUnitType') || 'HOURLY',
      payRateUnitType:
        state.payRateUnitType || props.job.get('payRateUnitType') || 'HOURLY',
      company: state.company || props.job.get('company') || null,
      companyId: state.companyId || props.job.get('companyId'),
      hiringManagerId:
        state.hiringManagerId || props.job.get('hiringManagerId'),
      hrId: state.hrId || props.job.get('hrId'),
      divisionId: state.divisionId || props.job.get('divisionId'),
      country: state.country || props.job.get('country'),
    };
  };

  componentDidMount() {
    console.timeEnd('job form');
  }

  componentDidUpdate() {
    console.timeEnd('job form');
  }

  handleCompanyChange = (companyId) => {
    if (companyId !== this.state.companyId) {
      this.setState({ companyId, hiringManagerId: null, hrId: null });
    }
  };

  handleHiringManagerChange = (hiringManagerId) => {
    const { clientList } = this.props;
    const { country } = this.state;
    if (hiringManagerId) {
      const client = clientList.find(
        (client) => client.get('id') === hiringManagerId
      );
      this.setState({
        hiringManagerId,
        company: client && client.get('company'),
        companyId: client && client.get('companyEntityId'),
        country: country || (client ? client.get('country') : ''),
      });
    } else {
      this.setState({
        hiringManagerId,
      });
    }
  };

  handleHRChange = (hrId) => {
    const { clientList } = this.props;
    const { country } = this.state;
    if (hrId) {
      const client = clientList.find((client) => client.get('id') === hrId);
      this.setState({
        hrId,
        company: client && client.get('company'),
        companyId: client && client.get('companyEntityId'),
        country: country || (client ? client.get('country') : ''),
      });
    } else {
      this.setState({
        hrId,
      });
    }
  };

  handleStartDateChange = (startDate) => {
    this.setState({ startDate });
  };

  handleEndDateChange = (endDate) => {
    this.setState({ endDate });
  };

  render() {
    console.time('job form');
    const {
      t,
      classes,
      disabled,
      job,
      errorMessage,
      clientList,
      isLimitUser,
      removeErrorMsgHandler,
    } = this.props;
    const { companyId } = this.state;
    const { companyMap } = getCompanyOptions(clientList);
    const clientOptions = companyMap[companyId] || [];
    // console.log(companyOptions,companyOptions.find(e=>e.value===1186),this.props.companyOptions)
    let client = clientOptions.find(
      (x) => x.id === (this.state.hiringManagerId || this.state.hrId)
    );
    let { addressLine, city, country, zipcode, province } = client || {};

    return (
      <div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              name="title"
              label={t('field:title')}
              defaultValue={job.get('title')}
              disabled={disabled}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('title') : null}
              onBlur={() => {
                if (removeErrorMsgHandler) removeErrorMsgHandler('title');
              }}
            />
          </div>
          <div className="small-3 columns">
            <FormReactSelectContainer label={t('field:type')}>
              <Select
                value={this.state.jobType}
                onChange={(jobType) =>
                  this.setState({ jobType: jobType || this.state.jobType })
                }
                simpleValue
                options={FormOptions.jobType}
                disabled={disabled}
                autoBlur={true}
                searchable={false}
                clearable={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="jobType"
              value={this.state.jobType || ''}
            />
          </div>
          <div className="small-3 columns">
            <FormReactSelectContainer label="Private Flag">
              <div className={'row align-middle'} style={{ height: 32 }}>
                <Checkbox
                  name="internal"
                  checked={this.state.internal}
                  onChange={(e, internal) => this.setState({ internal })}
                  color="primary"
                  disabled={disabled}
                />
              </div>
            </FormReactSelectContainer>
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              name="code"
              label={t('field:code')}
              defaultValue={job.get('code')}
              disabled={disabled}
            />
          </div>
          <div className="small-3 columns">
            <FormReactSelectContainer label={t('field:status')}>
              <Select
                value={this.state.status}
                onChange={(status) =>
                  this.setState({ status: status || this.state.status })
                }
                simpleValue
                options={jobStatusOptions}
                disabled={disabled || !job.get('id')}
                autoBlur={true}
                searchable={false}
                clearable={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="status"
              value={this.state.status || ''}
            />
          </div>
          <div className="small-3 columns">
            <FormReactSelectContainer label={t('field:priority')}>
              <Select
                name="priority"
                value={this.state.priority}
                onChange={(priority) =>
                  this.setState({ priority: priority || this.state.priority })
                }
                simpleValue
                options={FormOptions.jobPriority}
                disabled={disabled}
                autoBlur={true}
                searchable={false}
                clearable={false}
              />
            </FormReactSelectContainer>
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:company')}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('company') : null}
            >
              <Select
                options={this.props.companyOptions}
                value={this.state.companyId}
                disabled={disabled}
                onChange={this.handleCompanyChange}
                onBlur={() => {
                  if (removeErrorMsgHandler) removeErrorMsgHandler('company');
                }}
                simpleValue
                noResultsText={''}
                autoBlur={true}
                clearable={false}
                openOnFocus={true}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="company"
              value={this.state.company || ''}
            />
            <input
              type="hidden"
              name="companyId"
              value={this.state.companyId || ''}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              name="department"
              label={t('field:division')}
              defaultValue={job.get('department') || ''}
              disabled={disabled}
            />
          </div>
          <input type="hidden" name="divisionId" />
        </div>
        {!isLimitUser && (
          <div className="row expanded">
            <div className="small-6 columns">
              <FormReactSelectContainer
                label={t('field:hiringManager')}
                errorMessage={
                  errorMessage ? errorMessage.get('hiringManager') : null
                }
              >
                <Select
                  labelKey={'name'}
                  valueKey={'id'}
                  options={clientOptions}
                  value={this.state.hiringManagerId}
                  disabled={disabled}
                  onChange={this.handleHiringManagerChange}
                  onBlur={() => {
                    if (removeErrorMsgHandler)
                      removeErrorMsgHandler('hiringManager');
                  }}
                  simpleValue
                  noResultsText={''}
                  autoBlur={true}
                  // clearable={false}
                  openOnFocus={true}
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="hiringManagerId"
                value={this.state.hiringManagerId || ''}
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:HR Coordinator')}>
                <Select
                  labelKey={'name'}
                  valueKey={'id'}
                  options={clientOptions}
                  value={this.state.hrId}
                  disabled={disabled}
                  onChange={this.handleHRChange}
                  simpleValue
                  noResultsText={''}
                  autoBlur={true}
                  // clearable={false}
                  openOnFocus={true}
                />
              </FormReactSelectContainer>
              <input type="hidden" name="hrId" value={this.state.hrId || ''} />
            </div>
          </div>
        )}

        <div className="row expanded">
          <div className="small-6 columns">
            <FormReactSelectContainer
              label={t('field:country')}
              isRequired
              errorMessage={errorMessage.get('country')}
            >
              <Select
                value={this.state.country}
                onChange={(country) => this.setState({ country })}
                simpleValue
                options={FormOptions.countryList}
                disabled={disabled}
                autoBlur
                searchable
                clearable={false}
                onBlur={() => {
                  if (removeErrorMsgHandler) {
                    removeErrorMsgHandler('country');
                  }
                }}
                inputProps={{ autoComplete: 'nope' }}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="country"
              value={this.state.country || ''}
            />
          </div>

          <div className="small-6 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              name="zipcode"
              label={t('field:zipcode')}
              defaultValue={job.get('zipcode') || zipcode || ''}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-6 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              label={t('field:province')}
              name={'province'}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('province') : null}
              defaultValue={job.get('province') || province || ''}
              disabled={disabled}
              onBlur={() => {
                if (removeErrorMsgHandler) {
                  removeErrorMsgHandler('province');
                }
              }}
            />
          </div>
          <div className="small-6 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              label={t('field:city')}
              name={'city'}
              isRequired={true}
              errorMessage={errorMessage ? errorMessage.get('city') : null}
              defaultValue={job.get('city') || city || ''}
              disabled={disabled}
              onBlur={() => {
                if (removeErrorMsgHandler) {
                  removeErrorMsgHandler('city');
                }
              }}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-12 columns">
            <FormInput
              // key={job.get('lastModifiedDate')}
              name="addressLine"
              label={t('field:street')}
              defaultValue={job.get('addressLine') || addressLine || ''}
              disabled={disabled}
              errorMessage={
                errorMessage ? errorMessage.get('addressLine') : null
              }
              onBlur={() => {
                if (removeErrorMsgHandler) {
                  removeErrorMsgHandler('addressLine');
                }
              }}
            />
          </div>
        </div>
        <div className="row expanded small-collapse">
          <div className="small-6 columns">
            <div className="row expanded">
              <div className=" columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('billRateFrom')}
                  label={t('field:billRate')}
                  name="billRateFrom"
                  type="number"
                  step={'.01'}
                  defaultValue={job.get('billRateFrom')}
                  disabled={disabled}
                />
              </div>
              <div>
                <div style={{ paddingTop: 21, lineHeight: '32px' }}>-</div>
              </div>
              <div className=" columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('billRateTo')}
                  label="&nbsp;"
                  name="billRateTo"
                  type="number"
                  step={'.01'}
                  defaultValue={job.get('billRateTo')}
                  disabled={disabled}
                />
              </div>
              <div>
                <div style={{ paddingTop: 21, lineHeight: '32px' }}>/</div>
              </div>
              <div className="small-3 columns">
                <FormReactSelectContainer label="&nbsp;">
                  <Select
                    value={this.state.billRateUnitType}
                    onChange={(billRateUnitType) =>
                      this.setState({ billRateUnitType })
                    }
                    simpleValue
                    options={FormOptions.payRateUnitTypes}
                    disabled={disabled}
                    autoBlur={true}
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="billRateUnitType"
                  value={this.state.billRateUnitType}
                />
              </div>
            </div>
          </div>
          <div className="small-6 columns">
            <div className="row expanded">
              <div className="columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('payRateFrom')}
                  label={t('field:payRate')}
                  name="payRateFrom"
                  type="number"
                  step={'.01'}
                  defaultValue={job.get('payRateFrom')}
                  disabled={disabled}
                />
              </div>
              <div>
                <div style={{ paddingTop: 21, lineHeight: '32px' }}>-</div>
              </div>
              <div className="columns">
                <FormInput
                  // key={job.get('lastModifiedDate') + job.get('payRateTo')}
                  label="&nbsp;"
                  name="payRateTo"
                  type="number"
                  step={'.01'}
                  defaultValue={job.get('payRateTo')}
                  disabled={disabled}
                />
              </div>
              <div>
                <div style={{ paddingTop: 21, lineHeight: '32px' }}>/</div>
              </div>
              <div className="small-3 columns">
                <FormReactSelectContainer label="&nbsp;">
                  <Select
                    value={this.state.payRateUnitType}
                    onChange={(payRateUnitType) =>
                      this.setState({ payRateUnitType })
                    }
                    simpleValue
                    options={FormOptions.payRateUnitTypes}
                    disabled={disabled}
                    autoBlur={true}
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
                <input
                  type="hidden"
                  name="payRateUnitType"
                  value={this.state.payRateUnitType}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="row expanded">
          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:postingTime')} name="postingTime" />
              }
              className={classes.fullWidth}
              selected={this.state.postingTime}
              onChange={(postingTime) => {
                this.setState({ postingTime });
              }}
              disabled={disabled}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="postingTime"
              type="hidden"
              value={
                this.state.postingTime
                  ? this.state.postingTime.toISOString().split('.')[0] + 'Z'
                  : ''
              }
              disabled={disabled}
            />
          </div>

          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:startDate')} name="startDate" />
              }
              // minDate={moment()}
              // maxDate={this.state.endDate || moment().add(1, "years")}
              className={classes.fullWidth}
              selected={this.state.startDate}
              onChange={this.handleStartDateChange}
              disabled={disabled}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="startDate"
              type="hidden"
              value={
                this.state.startDate
                  ? this.state.startDate.format('YYYY-MM-DD')
                  : ''
              }
              disabled={disabled}
            />
          </div>

          <div className="small-4 columns">
            <DatePicker
              customInput={
                <FormInput label={t('field:endDate')} name="endDate" />
              }
              // minDate={this.state.startDate || moment()}
              // maxDate={moment().add(1, "years")}
              className={classes.fullWidth}
              selected={this.state.endDate}
              onChange={this.handleEndDateChange}
              disabled={disabled}
              placeholderText="mm/dd/yyyy"
            />
            <input
              name="endDate"
              type="hidden"
              value={
                this.state.endDate
                  ? this.state.endDate.format('YYYY-MM-DD')
                  : ''
              }
              disabled={disabled}
            />
          </div>
        </div>
        <div className="row expanded">
          <div className="small-4 columns">
            <FormInput
              name="maxSubmissions"
              // key={job.get('lastModifiedDate')}
              label={t('field:maxSubmissions')}
              type="number"
              defaultValue={job.get('maxSubmissions')}
              disabled={disabled}
            />
          </div>
          <div className="small-4 columns">
            <FormInput
              name="openings"
              // key={job.get('lastModifiedDate')}
              label={t('field:openings')}
              type="number"
              defaultValue={job.get('openings')}
              disabled={disabled}
            />
          </div>
          <div className="small-12 columns">
            <FormReactSelectContainer label={t('field:expLevel')}>
              <Select
                value={this.state.expLevels}
                onChange={(expLevels) => {
                  console.log(expLevels);
                  this.setState({ expLevels });
                }}
                options={FormOptions.expLevel}
                simpleValue
                multi
                disabled={disabled}
                autoBlur={true}
                searchable={false}
                clearable={false}
              />
            </FormReactSelectContainer>
            <input
              type="hidden"
              name="expLevels"
              value={this.state.expLevels || ''}
            />
          </div>
        </div>

        <div className="small-12 columns">
          <div className="foundation">
            <label>{t('field:requirements')}</label>
          </div>

          <div className="horizontal-layout">
            {FormOptions.tag.map((tag, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      value={tag.value}
                      name="tags"
                      color="primary"
                      defaultChecked={
                        !!job.get('tags') &&
                        job.get('tags').indexOf(tag.value) !== -1
                      }
                      disabled={disabled}
                    />
                  }
                  label={<Typography variant="body2">{tag.label}</Typography>}
                  classes={{
                    label: classes.checkboxLabel,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, { job }) => {
  const authorities = state.controller.currentUser.get('authorities');

  return {
    companyOptions: getClientCompanyOptionsArray(state, job.get('id')),
    clientList: getActiveClientList(
      state,
      job.get('hiringManagerId') || job.get('hrId')
    ),
    isLimitUser:
      !authorities ||
      authorities.includes(Immutable.Map({ name: 'ROLE_LIMIT_USER' })),
  };
};
export default connect(mapStateToProps)(withStyles(styles)(JobBasicForm));

//todo: refine client options
const getCompanyOptions = memoizeOne((clientList) => {
  const companyMap = clientList.groupBy((c) => c.get('companyEntityId')).toJS();
  const companyOptions = Object.keys(companyMap).map((v) => ({
    value: parseInt(v, 10),
    label: companyMap[v][0].company,
  }));
  companyMap[null] = clientList.toJS();

  return {
    companyMap,
    companyOptions,
  };
});
