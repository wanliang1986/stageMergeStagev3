import React from 'react';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core';
import clsx from 'clsx';
import { connect } from 'react-redux';

import { exportJson } from '../../../utils/sheet';
import dateFns from 'date-fns';
import { withTranslation } from 'react-i18next';
import { getCompanyList as selectAllCompany } from '../../selectors/companySelector';
import { makeCancelable } from '../../../utils';
import { getCompanyList } from '../../actions/clientActions';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Loading from '../../components/particial/Loading';
import Prospect from '../Companies/List/Prospect';
import PotentialButton from '../../components/particial/PotentialButton';
import Divider from '@material-ui/core/Divider';

import { styles } from './params';
import FormReactSelectContainer from '../../components/particial/FormReactSelectContainer';
import { DateRangePicker } from 'rsuite';
import CustomToggleButton from '../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import Select from 'react-select';

const ranges = [
  {
    label: 'This Month',
    value: [dateFns.startOfMonth(new Date()), dateFns.endOfToday()],
  },
  {
    label: 'Last 3 Months',
    value: [
      dateFns.addMonths(dateFns.startOfToday(), -3),
      dateFns.endOfToday(),
    ],
  },
  {
    label: 'Year to Date',
    value: [dateFns.startOfYear(new Date()), dateFns.endOfToday()],
  },
];
const status = {};
class BDReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      range: status.range || [
        dateFns.startOfMonth(new Date()),
        dateFns.endOfToday(),
      ],
      selectedUser: '',
      userOptions: [{ id: '', fullName: 'All' }],
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchUserOptions();
  }

  fetchData = () => {
    this.setState({ loading: true });
    this.companyTask = makeCancelable(this.props.dispatch(getCompanyList(2)));
    this.companyTask.promise
      .then(() => {
        this.setState({ loading: false });
      })
      .catch((reason) => {
        if (reason.isCanceled) {
          console.log('isCanceled');
        } else {
          console.log(reason);
          this.setState({ loading: false });
        }
      });
  };

  fetchUserOptions = () => {
    const userOptions = this.props.briefUsers
      .filter((u) => u.activated)
      .map((u) => {
        u.fullName = getFullName(u);
        return u;
      })
      .sort((a, b) => {
        a = a.fullName.toLowerCase().trim();
        b = b.fullName.toLowerCase().trim();
        if (a > b) {
          return 1;
        }
        if (a < b) {
          return -1;
        }
        if (a === b) {
          return 0;
        }
      });
    this.setState({
      userOptions: [{ id: '', fullName: 'All' }].concat(userOptions),
      allUsers: userOptions,
    });
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range }, () => {
      status.range = this.state.range;
    });
  };

  handleUserChange = (selectedUser) => {
    this.setState({ selectedUser: selectedUser || '' });
  };

  exportCompanyList = () => {
    const { companyList } = this.props;
    const { range, selectedUser, allUsers } = this.state;
    const filteredCompanyList = getFilteredCompanyList(
      companyList,
      range,
      selectedUser
    );
    this.setState({ downloading: true });
    const types = {
      CLIENT_LVL_A: 'Level 1',
      CLIENT_LVL_B: 'Level 2',
      CLIENT_LVL_C: 'Level 3',
      POTENTIAL_CLIENT: 'Prospect',
    };
    const userMaps = allUsers.reduce((res, user) => {
      res[`${user.id},${user.tenantId}`] = user;
      return res;
    }, {});

    exportJson(
      filteredCompanyList
        .sortBy((c) => c.get('createdDate'))
        .reverse()
        .toJS()
        .map((item) => {
          return {
            Date: new Date(item.createdDate),
            Company: item.name,
            'Client Level': types[item.level],
            Owner: item.bdManager,
            AM: item.accountManager,
            CreatedBy: getFullName(userMaps[item.createdBy]) || item.createdBy,
          };
        }),
      {
        headers: [
          {
            name: 'Date',
            width: 24,
          },

          {
            name: 'Company',
            width: 40,
          },
          {
            name: 'Client Level',
            width: 18,
          },
          {
            name: 'AM',
            width: 24,
          },
          {
            name: 'Owner',
            width: 24,
          },
          {
            name: 'CreatedBy',
            width: 24,
          },
        ],
        fileName: `BD_Report`,
      }
    );
    this.setState({ downloading: false });
  };

  render() {
    const { loading, range, selectedUser, userOptions, allUsers, downloading } =
      this.state;
    if (loading) {
      return (
        <div className="flex-child-auto flex-container flex-dir-column">
          <Loading />
        </div>
      );
    }
    const { classes, t, companyList, i18n, ...props } = this.props;
    const isZH = i18n.language.match('zh');

    if (companyList.size === 0) {
      return (
        <div className="flex-child-auto container-padding">
          <Typography variant="h5">There is no record</Typography>
        </div>
      );
    }

    const filteredCompanyList = getFilteredCompanyList(
      companyList,
      range,
      selectedUser
    );

    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div className={classes.actionsContainer}>
            <Typography variant="h5">
              {t('message:Job Analytics by Company')}
            </Typography>
            <PotentialButton
              onClick={this.exportCompanyList}
              processing={downloading}
              disabled={!allUsers}
            >
              {t('common:download')}
            </PotentialButton>
          </div>
          <Divider />
          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div>
              <FormReactSelectContainer label={t('field:Created Date')}>
                <DateRangePicker
                  value={range}
                  ranges={ranges}
                  cleanable={false}
                  toggleComponentClass={CustomToggleButton}
                  size="md"
                  style={{ height: 32 }}
                  block
                  onChange={this.handleDateRangeChange}
                  placeholder={t('message:selectDateRange')}
                  locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
                />
              </FormReactSelectContainer>
            </div>
            <div>
              <div style={{ minWidth: 168, height: 53 }}>
                <FormReactSelectContainer label={t('field:Owner')}>
                  <Select
                    valueKey="id"
                    labelKey="fullName"
                    value={selectedUser}
                    options={userOptions}
                    onChange={this.handleUserChange}
                    autoBlur={true}
                    simpleValue
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <Prospect t={t} companyListFromStore={filteredCompanyList} {...props} />
      </Paper>
    );
  }
}

BDReport.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const authorities = state.controller.currentUser.get('authorities');
  const canDownload =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));

  return {
    authorities,
    canDownload,
    companyList: selectAllCompany(state),
    briefUsers: state.controller.newCandidateJob.toJS().dialogAllUser,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(BDReport))
);

function getFullName(user) {
  if (!user) {
    return '';
  }
  if (user.firstName && user.lastName) {
    return user.firstName.trim() + ' ' + user.lastName.trim();
  }
  return user.username || '';
}

const getFilteredCompanyList = memoizeOne((list, range, userId) => {
  console.log(list.toJS(), range, userId);
  return list.filter((el) => {
    const createdDate = el.get('createdDate');
    const saleLead = el.get('saleLead') && el.get('saleLead');
    const owners =
      saleLead &&
      saleLead.map((item, index) => {
        let _owners = item.get('saleLeadOwner');
        return _owners;
      });
    const ownerIds =
      owners &&
      owners.map((item, index) => {
        let arr = [];
        const ids = item.forEach((o, i) => {
          arr.push(o.get('id'));
        });
        return arr;
      });
    return (
      createdDate &&
      dateFns.isAfter(range[1], createdDate) &&
      dateFns.isBefore(range[0], createdDate) &&
      (!userId || (ownerIds && ownerIds.toJS()[0].includes(userId)))
    );
  });
});
