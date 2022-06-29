import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
// import * as ActionTypes from '../../../constants/actionTypes';
import {
  makeCancelable,
  sortList,
  getIndexList,
  validateDate,
  isUrl,
  getRanges,
} from '../../../../utils';
import { exportJson, handleFile } from '../../../../utils/sheet';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getWeekReport,
  getAllBriefUserList,
  getAllDivisionListByTenantId,
} from '../../../../apn-sdk';
// import data from './LinkedinMapping-backup.xlsx';

import { DateRangePicker } from 'rsuite';
import Select from 'react-select';
import dateFns from 'date-fns';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import PotentialButton from '../../../components/particial/PotentialButton';
import ReportTableSummary from '../../../components/Tables/ReportTableSummary2';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Loading from '../../../components/particial/Loading';

import { styles } from '../params';
import CustomToggleButton from '../../../components/particial/CustomToggleButton';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';

const status = {};

class WeekReport extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      dataList: Immutable.List(),
      range: status.range || [
        dateFns.startOfWeek(new Date()),
        dateFns.endOfToday(),
      ],

      loading: true,
      division: 'all',
      divisionOptions: [{ value: 'all', label: 'All' }],

      filteredIndex: Immutable.List(),
      colSortDirs: {},
    };

    this.filteredList = Immutable.List();
  }

  componentDidMount() {
    this.fetchData();
    getAllDivisionListByTenantId().then(({ response }) => {
      // console.log("division list", response);
      this.setState({
        divisionOptions: this.state.divisionOptions.concat(
          response.map((d) => ({
            value: d.id,
            label: d.name,
          }))
        ),
      });
    });
  }

  handleChangeDivision = (division) => {
    division = division || this.state.division;
    this.setState({
      division,
      filteredIndex: getIndexList(
        this.state.dataList,
        Immutable.Map({ divisionId: division === 'all' ? '' : division }),
        this.state.colSortDirs
      ),
    });
  };

  fetchData = () => {
    const { range } = this.state;
    const from_date = range[0].toISOString();
    const to_date = range[1].toISOString();

    this.candidateTask = makeCancelable(
      Promise.all([
        getAllBriefUserList().then(({ response }) =>
          response.filter((u) => u.activated)
        ),
        getWeekReport({ from_date, to_date, selectedType: 'LINKEDIN' }),
        getViews(from_date, to_date),
        recruiterUsage(from_date, to_date),
        this._blockTimer(),
      ])
    );
    this.candidateTask.promise
      .then(processData)
      .then((data) => {
        const { colSortDirs } = this.state;
        const dataList = Immutable.fromJS(data);
        let filteredIndex = getIndexList(dataList);
        const columnKey = Object.keys(colSortDirs)[0];
        if (columnKey) {
          const preIndex = filteredIndex.pop();
          let sortDir = colSortDirs[columnKey];
          filteredIndex = sortList(preIndex, dataList, columnKey, sortDir).push(
            preIndex.size
          );
        }
        this.setState({ loading: false, dataList, filteredIndex });
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

  downloadData = () => {
    const { range } = this.state;
    if (range && range[0]) {
      exportJson(
        this.state.dataList.toJS().map((item) => {
          const division =
            item.divisionId &&
            this.state.divisionOptions.find((o) => o.value === item.divisionId);
          return {
            'User Name': item.fullName,
            Division: division && division.label,
            'Total Views': item.totalProfiles,
            'RPS Views': item.fromRecruiterProfiles,
            // from linkedin
            'Profiles Viewed': item.numProfilesViewed,
            'InMails Sent': item.numMessagesSent,
            'InMails Accepted': item.numMessagesAccepted,
            'InMails Declined': item.numMessagesDeclined,
            'InMails Response Rate%': item.messagesResponseRate,
          };
        }),
        {
          headers: [
            {
              name: 'User Name',
              width: 18,
            },

            {
              name: 'Division',
              width: 40,
            },
            {
              name: 'Total Views',
              width: 18,
            },
            {
              name: 'RPS Views',
              width: 18,
            },
            {
              name: 'Profiles Viewed',
              width: 18,
            },
            {
              name: 'InMails Sent',
              width: 18,
            },
            {
              name: 'InMails Accepted',
              width: 18,
            },
            {
              name: 'InMails Declined',
              width: 18,
            },
            {
              name: 'InMails Response Rate%',
              width: 25,
            },
          ],
          fileName: `Linkedin_Usage_Report_${dateFns.format(
            range[0],
            'YYYY-MM-DD'
          )}
         _${dateFns.format(range[1], 'YYYY-MM-DD')}`,
        }
      );
    }
  };

  handleDateRangeChange = (range) => {
    range[1] = dateFns.endOfDay(range[1]);
    this.setState({ range }, () => {
      status.range = this.state.range;
      this.fetchData();
    });
  };

  _blockTimer = (time = 400) => {
    clearTimeout(this.bTimer);
    this.setState({ loading: true });
    return new Promise((resolve) => {
      this.bTimer = setTimeout(resolve, time);
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    let indexList;
    indexList = sortDir
      ? sortList(filteredIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleFocusChange = (focusedInput) => this.setState({ focusedInput });

  render() {
    const { t, classes, i18n } = this.props;
    const isZH = i18n.language.match('zh');

    const {
      dataList,
      range,
      loading,
      filteredIndex,
      colSortDirs,
      division,
      divisionOptions,
    } = this.state;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }

    return (
      <Paper
        className={clsx(
          'flex-child-auto flex-container flex-dir-column',
          classes.root
        )}
      >
        <div>
          <Typography variant="h5" className="item-padding">
            {t('tab:LinkedIn Usage')}
          </Typography>

          <div
            className={clsx('horizontal-layout align-bottom', classes.actions)}
          >
            <div>
              <FormReactSelectContainer label={t('tab:Date Range')}>
                <DateRangePicker
                  value={range}
                  ranges={getRanges(t)}
                  cleanable={false}
                  toggleComponentClass={CustomToggleButton}
                  size="md"
                  style={{ height: 32 }}
                  block
                  onChange={this.handleDateRangeChange}
                  placeholder={t('tab:Date Range')}
                  locale={isZH ? zhCN.DateRangePicker : enUS.DateRangePicker}
                />
              </FormReactSelectContainer>
            </div>

            <div>
              <div style={{ minWidth: 228, height: 53 }}>
                <FormReactSelectContainer label={t('field:division')}>
                  <Select
                    value={division}
                    options={divisionOptions}
                    simpleValue
                    onChange={this.handleChangeDivision}
                    autoBlur
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            </div>

            <div className="flex-child-auto" />

            <PotentialButton
              onClick={this.downloadData}
              processing={this.state.generating}
            >
              {t('common:download')}
            </PotentialButton>
          </div>
        </div>

        <Divider />
        <div className={clsx('flex-child-auto', classes.contentContainer)}>
          {loading && (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          )}
          {
            <ReportTableSummary
              dataList={this.filteredList}
              onClickJob={this.handleClickJobCount}
              onClickActivity={this.handleClickActivityCount}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
            />
          }
        </div>
      </Paper>
    );
  }
}

WeekReport.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect()(withStyles(styles)(WeekReport))
);

function processData([users, usage, views, recruiterUsage]) {
  // console.log(recruiterUsage);
  const usageMap = usage.reduce((res, item) => {
    res[item.username] = item.totalCnt;
    return res;
  }, {});
  const userMap = users.reduce((res, item) => {
    const fullName =
      item.firstName && item.lastName
        ? `${item.firstName} ${item.lastName}`
        : item.username;
    res[item.id] = {
      id: item.id,
      userId: item.id,
      fullName,
      totalCnt: usageMap[fullName] || 0,
      divisionId: item.divisionId,
      fromRecruiterProfiles: 0,
      totalProfiles: 0,

      // from linkedin
      numProfilesViewed: 0,
      numMessagesSent: 0,
      numMessagesAccepted: 0,
      numMessagesDeclined: 0,
      messagesResponseRate: 0,
    };

    return res;
  }, {});
  views.data.forEach((v) => {
    Object.assign(userMap[v._id] || {}, {
      fromRecruiterProfiles: v.fromRecruiterProfiles,
      totalProfiles: v.totalProfiles,
    });
  });

  recruiterUsage &&
    recruiterUsage.data.elements &&
    recruiterUsage.data.elements.forEach((rs) => {
      // console.log(rs);
      const identifier =
        rs.pivot.value[
          'com.linkedin.talent.reporting.wrapper.SeatUrnWrapper'
        ].seatResolutionResult.profile.split('profile:')[1];
      const data = userMap[tsp2userId[identifier]];
      if (data) {
        // console.log(rs.recruiterUsageStats);
        Object.assign(data, {
          numMessagesSent: rs.recruiterUsageStats.numMessagesSent,
          messagesResponseRate: rs.recruiterUsageStats.messagesResponseRate,
          numProfilesViewed: rs.recruiterUsageStats.numProfilesViewed,
          numMessagesAccepted: rs.recruiterUsageStats.numMessagesAccepted,
          numMessagesDeclined: rs.recruiterUsageStats.numMessagesDeclined,
        });
      }
    });

  // console.log(userMap);
  return Object.values(userMap);
}

const url = 'https://api-staging.hitalentech.com/proSearch3/api';

function getViews(from, to, lastModified) {
  return fetch(url + '/apnpro/usageReport', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'views',
      from,
      to,
      lastModified,
    }),
  }).then((response) => response.json());
}

function recruiterUsage(from, to) {
  return fetch(url + '/linkedin/recruiterReport', {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
    }),
  }).then((response) => {
    return response.ok && response.json();
  });
}

const tsp2userId = {
  'AEMAABgoH3YB0oDlEdhh3-xab8cWZkhRc5J0SbI': '',
  AEMAABUngf0BJUdMh57E8TqhPab0clBkCVPWOZ8: '',
  AEMAAA4DyqgBvj42SvzZZHTDGbukyMJ2a5weyyY: '',
  AEMAAB8qi3cBSKWhGURQ9scnORvmensS7TjGoqE: '',
  'AEMAAAkuplcBOPv-BauwvJnyn9_YDEmu7hvhn2U': '',
  'AEMAACTElXUBF-ZaGeryIhUlYm6OlzNcXs01tT0': '',
  'AEMAACq5560BR-YdFOHDlj57vX0KcW7483unpaw': '',
  AEMAACPu1zcBBEhYXLFhK3eyeYoyxnjid3ZM_rw: '',
  'AEMAADHjiWMBV5w6MRGSgy-m0qndgZOtUExgHKA': '',
  AEMAAB2SI6EBx_32FppFy4ImRR0EWbLWJMadRGo: '',
  'AEMAACE838EBftOTEj3nDPRX5O6sn3ZKo3NSy-M': '',
  'AEMAACdE-kUBb9qGTJNPFDBraA4EikulSTLERwE': '',
  AEMAADUfHKgBpTEtvLnZJh7pCw280b7ZqajEhEE: '',
  AEMAADQ5KcoBGAOVVAqQl0WpCXOHj48qIxiVJOk: '',
  AEMAACWkPxQBCpFVb90TNzZveope3ye3qkrBjRA: '',
  AEMAABFOF6EBOV2ioLGwCcQ99JSfiXBILz52HrU: '',
  AEMAACmKJdYBRjjS9Pej5QCsFJo7cVWOi2jvrM8: '',
  'AEMAACbYV1MBtSt6OFwN91h-n_SfTwECsQjKnXs': '',
  'AEMAAAZzBFEBApB2zBP7JbuUhXfYd-Jqe16JjVA': '',
  AEMAABGyaVcBRmLUAM2b2FQfuBfjcNNvsBxsd2o: '',
  AEMAACo3mg0BfbsUPmmTJQjA63MDnQj65tWrIlQ: '',
  AEMAACWoFmoB0ECeXPS5Ju4hkucW5sDOck1bClw: '',
  AEMAAAl8geIBu4UrnWfxhL06PF42j3zbEakvOfc: '',
  AEMAAB8H7CIBUB_Z3r5waZ1VpWXpZp8SnWynhK8: '',
  'AEMAACfrH-MBucGCmPqN0qeneuLIiObOCJX-7po': '',
  AEMAADADBDsBxtS88WMfpAygFfhl_kJtGsAZH24: '',
  AEMAABz9K_sBhhqHQcsdq4RefbT1iX7fGdS4T1Y: '',
  AEMAABYGfgIB0uZCoSaRL16oLti35FLvH4Lp2Yo: '',
  AEMAAByhiUcBmcZ_r2amk1kVVTljKamTG7IPioM: '',
  AEMAAA4JYhABMsfTCS4tU6mZgNaQzTlyii8J65A: '',
  AEMAABgrqCIBt6TQbVG0KdxMf9vJfwwwaiLXDOs: '',
  'AEMAABTWUEEBHNZU-sXUG7hunY_TiBid9kXg1c8': '',
  AEMAABpVbakBmGrMUuc0AxkRrCEcVNOYBzhDwQA: '',
  AEMAACCjVzkB1CkeLiHLqHAn3sU__yYMNuCP2F4: '',
  'AEMAAB-kt9sBgMpjJVPvpmjKUopDYtUsrPZbbPg': '',
  AEMAAAw58BQBPE6Rq3kBsHdU7PxmGfvcDNceOVU: '',
  'AEMAAC0XZA8BxpY3l0Y-KncPznX-B2Hd7ff6j-o': '',
  AEMAAB5ZSCsBaeaiIqgZ2XEpWsDImW0dIYkaYxA: '',
  AEMAACA9oNoBOcn1MOZqgEj4C0j1N5gwkCI8Ljw: '',
  AEMAABWN8PkBlUn65kjhUY8YsTm0iJVEosj89rA: '',
  AEMAAACtLI0BG1uIIvb2xABPaecbb511W31DXbQ: '',
  AEMAACX_ztcB8nVRkIkeChcG9_B05qKSib8FtaU: '',
  AEMAACLFkW8BgiKlOIjffVK3uGdZ_uzVsk0Kat0: '',
  'AEMAABatN_QBI53XZh_IT-cU3b3B6SfuzEzzzOU': '',
  AEMAABdzG5MBJ2x7fmhhc9styIL18mQ5kY85B4s: '',
  AEMAACbYGzoBkSo9dXfhO6zlLyK5JGIIxQoCKj8: '',
  AEMAACV8OFgB6ezOiouzJv6XGHgZYlANSy7DX5k: '',
  AEMAABnxHeMBeWRnXKNNwhLb4bTXO84hQy3ie64: 668,
  AEMAAAMSYN4BxiJ2DRw9vXk4_S5HlUiRSZO7Bbw: 658,
  AEMAACxiN1IB4OyX1I6KRMWwFAfRinsJXR1Ispc: 654,
  AEMAAAM4O6EB8cjMRwg6jRVs9_KCEKWwR1h0GK8: 647,
  'AEMAADS-LbMByzSgjcpwGquwYdVkKKWB5afLc-o': 643,
  AEMAAAcnjdQBGnMUq1kJFP3EMrq2YQRWJB8KOO8: 640,
  'AEMAAAO11B0BU02li5kuCg-pEsZaTf0wq2cZtb0': 612,
  'AEMAAAIgupoB7RsF4zlFAHF2w0X-6_eRK2vm-ZM': 611,
  'AEMAADHZsFcBXPjvQy39Yh9wC411Njc0-eKZFCE': 594,
  AEMAACrQqiYBL9YbIwabBC4Le504vtCxsL96aCk: 588,
  AEMAAB3FQ_cBqjkPOHED1mzLLGpEGC5aIlSzUPE: 555,
  'AEMAADKG9D8BH4hHGHFD-JbfwVLlT-_dCSzKzkI': 549,
  'AEMAACM-spEBd07HZU9RL1mIrZIlqWEfa3i19Ac': 545,
  'AEMAAB_3bhEBqbbJ1k8evmhlJaSH11-OTrfftKQ': 526,
  AEMAACOPXpsBYMaY_zNrg1deqKOJQaDPXzQgdrY: 524,
  'AEMAACuxTyoB_Wtb7PFkcuc8A-YqpKyDP-0hFgY': 520,
  AEMAADF6zdwByjpXWAKoft4k1eJtF5CSECCJw4c: 514,
  AEMAADFKhrABlhYJxMISPdSDkW0Lq2qubCCDjwA: 501,
  AEMAABm2va4B4GoWw8oS4lXvWejTF1W42pxBXpY: 493,
  AEMAADDgKtkBMd9ISQU7qH3JmUsJ95xa0GpU3W0: 476,
  'AEMAABlizxgB9O-JQf2asoZY8mtvJb7tCyDr1dw': 475,
  'AEMAABYbYXYBtsrn3GAKEVRL06fxEBgv-yMM-So': 474,
  AEMAABm0sWsBesofvzEuvpnwA1SZHtQCio_V9hw: 468,
  AEMAAB2xeYIBzfoAnjMMVUSNP9saVgriiVa3AbU: 466,
  AEMAAA_fj58BLQTjaNuZbJPEX38glfltlBRCmyg: 465,
  AEMAACCamt0BnlICLAma86_XcGsVmlXjUrCAsZ8: 463,
  AEMAAAgDfmwBx40sAEXRKv3PbDe6WPbHirM2IzQ: 457,
  'AEMAACGC8bcBC1ECN3ZcGypfSa-ti_E2I7u_IXo': 451,
  AEMAABsR2ZoBwiWSMwJrCCu83rsvzLyPLsl4Nak: 446,
  'AEMAABBWIkgBlmOaKkcsSZuF4hpGNN_56fi-iQ0': 443,
  AEMAABRQg7gBHiro1lTEvrRi5HT3kHdcZktMA0A: 437,
  'AEMAACyTFJcBEoo8R-zSLWqPIdzuhz-D-lBLEUY': 433,
  'AEMAAAdcEOUB6vM56NjI-6M5UMMSe8kVStnMeZY': 432,
  'AEMAAC55nqEB67kG8v1VzU8y3KstJ-vQdKPVEyg': 430,
  AEMAABdtRZoB8fBfYAHBleTCpcm0AO3vrZiwPIE: 429,
  'AEMAABRmORgBxGAwHsqPqySj5E79tdS-uvBYPTQ': 421,
  'AEMAAAADWdoBCG-uQMMVXfLvV_o57m3uwRB5rXY': 392,
  AEMAACx9U_EBdZdJnkto0u00hWZdfJF2tWW7ibY: 391,
  AEMAACSYCwYBUeCX1KoN5PMrYfYQqlF2BC22H2I: 388,
  AEMAACjNUZQBpyDAie6P0TNnPbX13MgJbOd0yt8: 387,
  AEMAAC3bMrsBumz358eUzGINNqdvWdCdq0fJGFc: 380,
  AEMAAC3bTAIB32jShQwxSmoRYGLyT5LX4dXt4y0: 380,
  AEMAABgX_t4B9k6FRQCAtperDt5qUnJe8_MTKxo: 379,
  AEMAABp2n3gBxQ5yvDE5VnptI01kBdkdYXZ8OFA: 378,
  AEMAACFjysoB8bxRRrFO37RBoXf4bkSDljk3YPo: 377,
  AEMAACz5NoIBvTJCWRGq3iYV83COeW3wOroIFc4: 373,
  'AEMAACFzcz0BJAbK8ALV4aYxNVzpFPuA-AUqjrs': 370,
  AEMAACPTEs4BuAV008Ttvp0eR8uUE3WODRAHwvM: 369,
  'AEMAACOhnwgBDYL5gSShOvEWM-1pKFZBIc5EBCo': 367,
  'AEMAACyZ0pYBwKs9mw4-df5PwYWexZE_Wn_pdgQ': 363,
  AEMAACx9sfwBOk1VAaWZKn523GdQCaj9AUjgH8A: 362,
  AEMAAAaxfKAB1KUIm94LnvETC4om3pKDx8bI8zs: 361,
  'AEMAACxkEBkBa_Yp6w2E4N7z8d-T0MhGffuoKn4': 359,
  'AEMAACxc-3UB3nJeb9G735A3qQRNuoVIAGorc5Q': 357,
  'AEMAACxTHuABGOwnsb-Y3w2BZfXmiPfJkyQeXdE': 356,
  AEMAACwGRBkBa_EYRXMphDG6StXMnMcqbPrmRBE: 355,
  AEMAACvcwa4B8mPLcGIFoEnIZ6IGEAyPasZJ4Q0: 352,
  AEMAAB7pTIMBqcJmlf3AK2l0tjUcwlNhgt2UxCM: 349,
  AEMAACuIUHwBYnQIGdiz4aTYHTDUXh6p6NslDyk: 348,
  AEMAACtnaGYB0imigrdOFEBvAhrI39ReLeNHrXQ: 342,
  AEMAACtnbgMBFnkMRS21gHNzG6erGgk3cOZLiTo: 341,
  AEMAACtJBqEBvVCsvO9160_XVdpqti4ZVO7AfeM: 337,
  AEMAACs66ecBtHfvWVwNWiR6M4kK62A9TRsbeHU: 334,
  AEMAACsMWDYB3ijKq5gegP0OvzZ684CQqyJaBNE: 332,
  'AEMAACTL5xcBiz9cof-njy2IQJJ81O1-PrJ3JT4': 329,
  AEMAAAn_ZakBbXm3fjRqeDbQQ1jUUbUaMmt1hco: 322,
  AEMAACrHrCkBzfEjGf28fWYucIXN40OHoVr10CQ: 319,
  AEMAACf4LR0B21mDpDttW84VV6A8Q57Cf_xbP9I: 318,
  'AEMAABH8E0EBaDeaKnvznqHCwZzqJf-9K6zDkA0': 312,
  'AEMAACm-0O0BzirlE5f_HinySvn5On-VCFevzWw': 298,
  'AEMAACnHKz8Bom-O1CL9oRDpq4FA7oyckYIfRTM': 296,
  'AEMAACfQ3ikBjoGK8sWLr-w-WCJ4Bts0syRmMCA': 288,
  'AEMAACmTgn8Brhkc7wg-xFhl48E9gZB3W-hLsTU': 285,
  AEMAACmTfyoBvv4b3SXneLzXuoKETYULiutnEtY: 284,
  AEMAABT9E5EBhNQ3AboEH4s7T0UJONFKoynzV9o: 283,
  AEMAACRZeR4BEqjTGnl9nh_g15qVTqM0sA67vpU: 282,
  'AEMAACee3T8B1-kkUEA78ysCr7b9dP0aMs0jpIU': 279,
  AEMAABWRBUAB56h5EA5uiFi2UFAR_bMIWkaSCA0: 273,
  'AEMAACkioHsBtpEJmaqWVOU3sB-RbhaABSKbR44': 268,
  AEMAABW1rz0BswxZiWhPgilE760SP2Vqz4UcH6I: 265,
  'AEMAACgerkYBJdCGRjBf6IapzTusgSg71vs0Z-s': 261,
  'AEMAADS4zNUBMRRb-0Ht0rM1UZX_rKWzPw2Vpks': 260,
  'AEMAACmpbOsB-noZFRCxG_iEwzUdVCtLRz3-ORo': 257,
  AEMAAChOba4BVwXXtK_5rChdOldYiG39GMVY0c0: 252,
  'AEMAACCjpW8BlbB4tNXM_vLEwAs6ygWRdqi-hC0': 245,
  AEMAACfhkq8B_9uCdyTTrpy2lQ8JysuJ1kHqkcI: 241,
  AEMAACbYUt8BxmLygQUEUyFFj0KuXsDiMjQ40lI: 237,
  AEMAAAXnBVkBk5vpuDQtGsGMEjmMu21bCnEd1SY: 235,
  'AEMAACf-xHYBgqe8qRJhVyYoFpN7pcRdkOhO2Ac': 234,
  AEMAACf03cYB55kvGSeGEsLbBtIJf8PP04c4fVw: 233,
  AEMAACA9mOQB6TgPGaP7wKvkSLz0UxdYeoMIMh0: 229,
  AEMAABijSzkBgZKplYEQEOeIK75lDTZ59C2WU7w: 226,
  AEMAABvuzPEB8MZq8vYrP3fak5rf2vxm4d4v_GM: 225,
  AEMAAB8jGskB9zM9LtsctCp2nNamMh29aLskHmY: 220,
  AEMAAA2ZfR8BmlH9KSu9_hk5qHJjfybSoFCtC_I: 218,
  AEMAABXKol0BHLkw4XyysmEU7iBqLhpTrrTB1Kg: 217,
  AEMAACbbcIYBurz02wtBAiSowOtXoaLiO9D9jq8: 216,
  AEMAADAQ30gBB1vA0PdtTolr9CiPF0KaZMjOghw: 210,
  'AEMAABIJHuUBSY-Qd_LkXcfxLctkJMtjlJBeTZg': 207,
  AEMAACb9KXABz1v6W9n686Ujf24Aek9fsyNn0dQ: 206,
  'AEMAACbib7oB3WrDpAvHo_PzK-OZcRRSA6OWZZ4': 202,
  AEMAACbihqUBj4khmIsIcaUFpaXHEopXZdIN5Gw: 201,
  'AEMAACbHFDIBaiNxxVazUABI-YzEGk2lIMKhb6c': 193,
  'AEMAACa-H0YBN1DPBU_O7V9XGp9TJTy4VkpmHx0': 192,
  'AEMAAAi647cBx5m35_WeSKu-7GlBNRYXETQe6-A': 187,
  AEMAACZEVHkBvfWliuILNkD83XV2l02ENGFufKE: 184,
  AEMAACabMlEB3bT7dP2oShbjWsb1wdMespKCv2c: 182,
  'AEMAADT9XqoBfBj1ZN82d70bH-Sg8o0rEo6h-Aw': 181,
  'AEMAACabKpoB1QKGCaxam9299b-jQ2AJeNRRbxA': 181,
  AEMAAAMUrbABEX6qOBiDomQlEUuXinKhLMJdZXA: 168,
  AEMAAB1fe6UBh77jeSPyuxENYA16qYPZxE5xhLM: 161,
  AEMAABtrV7YBRZ5Qlc5JYHyTcvPqGaNx1p0hv0M: 156,
  AEMAACWwBMcBZnipa_fueSrZwbkOQN5GPMirPsg: 154,
  'AEMAABtFvFMBWklCF-uBxoE7VU_KYcCXaqXeHH4': 151,
  AEMAAAW73pYBRsdJ8KVw1edtPi1D87Hwb5dEi4k: 150,
  'AEMAAA3nYSIB24zOW-BdQ3pOPV1mbHnP-iPT2ag': 147,
  'AEMAABbL07YB0U71-10S7MLW5Wg0tol6cWNQ9I0': 143,
  AEMAAAiToj8BF9x_SgTcK3Gh0Oj5dBVbel9L5qE: 133,
  'AEMAAAM-hEsBJv3onUl5CUIjwJ_VkW7GEiRGb1c': 132,
  'AEMAACPMogsBgdAv9bVd58-JCm7CLPdkqKbhupE': 130,
  AEMAABLu7YMB5GHxSaLtLnFE2D9X2FbDdiDjyeU: 129,
  AEMAABbninkB5zWjI4KmdZ4RcKbpuhRSN8smnzw: 128,
  AEMAAA2XeJEB1Fkw6UyWQTTaMhtbESnO5CQtMjQ: 127,
  AEMAAB234tkB7yNwX_wYHswHWBlCgRvegKOPD9c: 75,
  AEMAAAQlk9YB9ZFELl3Z4S4rm9lpuk9OXqcOvoE: 74,
  'AEMAAA-JGy4BdmDNIrHAnHX5lzxl6R3PC3q9J9U': 71,
  AEMAAARxTpQB_8K45k3yS681N74WUVv_e1y8YAk: 54,
  AEMAABZnRt0Bi3dsL4ztBC483kl66uqJnAmoI7I: 51,
  AEMAAB7NQ2EB7uyNpTII3J6Hj3_muVxRW3yL7qI: 50,
  AEMAAB_ThUcBmh_rXHABkRr16wzY7yBYFxPNUgo: 42,
  'AEMAAAef6oUB1-ozpZNsOqVX_Ul3nuvCpHbzrnQ': 41,
  AEMAAA2dJCwBH4XfEMZRwW8Ohjuv9gWY4TdJi9E: 39,
  AEMAAARWznwBu7dl2Fw7U7kmTmpvxllsOKihC_o: 38,
  AEMAAA3F7NABkK4gDCZmwp7Qf40RGRqg5pwULR0: 37,
  AEMAABq46TsBw_Obl4qVJcYxC3UCivPaZjY5_ug: 36,
  AEMAABSLMesBNpBudM4pBHhlhpP0RL4e_IsMQJc: 35,
  'AEMAABdSXvgBLE60eIafCj9gEh2hUU6_-RSLrpA': 32,
  'AEMAAAmef0UBT3A-mIPrAvd3NqgEbUmGD_qFPj0': 31,
  AEMAAAGKrHMBJrsHBgW7AJ184EJwb4d_Jb6_3Jo: 25,
  AEMAAA_bHiYBdUnDN437EtJ14XIAw0S6PIXgyGw: 24,
  AEMAABtpm9kBLn8n3RX0gXm9dLfvBZ3z7KViorA: 24,
  'AEMAACG7b1UBAa4zlvvGFlfrVJDfc-Zr2-JXTZg': 23,
  AEMAAAQqzFwBMohzWOXxyEIlxoB4vFxkMiW3MlM: 23,
  'AEMAAAhpTJ0B-XAIOJz6wNtD6hQByieZyloXNnQ': 22,
  AEMAAAmNZyMBSEpbnrLXMhEXecZfZdF3V01DR4Q: 21,
  AEMAAApOuYkB69UuIwSigz4nxXLuckgCrkbU2Z0: 17,
};
//
// fetch(data)
//   .then((r) => r.blob())
//   .then(handleFile)
//   .then(({ data }) => {
//     if (!isUrl(data[0][5])) {
//       data = data.slice(1);
//     }
//     const maps = data.reduce((map, row) => {
//       const ts = row[5].split('profile:')[1];
//       const apnId = row[3];
//       map[ts] = apnId;
//       return map;
//     }, {});
//     console.log(JSON.stringify(maps));
//     // 0: "（Jim Chen）"
//     // 1: "陈俊蒙"
//     // 2: ""
//     // 3: ""
//     // 4: "https://cn.linkedin.com/in/%EF%BC%88jim-chen%EF%BC%89-%E9%99%88%E4%BF%8A%E8%92%99-70688ab3"
//     // 5: "urn:li:ts_profile:AEMAABgoH3YB0oDlEdhh3-xab8cWZkhRc5J0SbI"
//     // 6: "BIGO HR- Global Hiring"
//     // 7: "urn:li:ts_seat:118617311"
//   });
