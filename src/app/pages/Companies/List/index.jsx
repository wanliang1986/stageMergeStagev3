import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { makeCancelable } from '../../../../utils';
import {
  getCompanyList,
  companySearch,
  getNoContracts,
} from '../../../actions/clientActions';
import { showErrorMessage } from '../../../actions/index';
import { getCompanyList as selectAllCompany } from '../../../selectors/companySelector';

import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';

import PrimaryButton from '../../../components/particial/PrimaryButton';

// 客户 列表
import Clients from './Clients';

// 潜在客户 列表
import Prospect from './Prospect';

// import SwipeableViews from "../../../components/particial/SwipeableViews";
import IconInput from '../../../components/particial/IconInput';
import NoContractClient from '../NoContractClient';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Search from '@material-ui/icons/Search';

import Immutable from 'immutable';
import { withStyles } from '@material-ui/core';

import MyDialog from '../../../components/Dialog/myDialog';
import SearchCompanies from '../../../components/Dialog/DialogTemplates/SearchCompanies';

const tabs = ['?tab=client', '?tab=prospect'];
const styles = {
  btnColor: {
    borderColor: '#3498DB',
    backgroundColor: 'rgba(52, 152, 219, 0.4)',
  },
  searchBox: {
    width: '100%',
    textAlign: 'right',
  },
  search: {
    width: '400px',
    float: 'right',
  },
};

class AllClientsTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab:
        tabs.indexOf(props.location.search) === -1
          ? 0
          : tabs.indexOf(props.location.search),
      firstLoad: true,
      loading: true,
      downloading: false,
      clientsFilter: 0,
      ProspectsFilter: 2,
      searchVal: '',
      openDialog: false,
      searchCompanies: null,
      searchCompaniesLength: 0,
      clientType: 0,
      requestType: false,
    };
  }

  componentDidMount() {
    this.setState({
      clientType: 0,
    });
    this._handleActive(0);
    this.fetchData(this.state.clientsFilter);
    this.props.dispatch(getNoContracts());
  }

  componentWillUnmount() {
    this.companyTask.cancel();
  }

  fetchData = (type) => {
    this.setState({
      clientType: type,
      requestType: true,
    });
    this.companyTask = makeCancelable(
      this.props.dispatch(getCompanyList(type)).then((res) => {
        console.log('res', res);
        if (res) {
          this.setState({
            requestType: false,
          });
        }
      })
    );
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

  static getDerivedStateFromProps(props, state) {
    const newValue =
      tabs.indexOf(props.location.search) === -1
        ? 0
        : tabs.indexOf(props.location.search);
    if (newValue !== state.selectedTab) {
      return {
        selectedTab: newValue,
      };
    }
    return null;
  }

  tabsClickHandler = (e, selectedTab) => {
    if (selectedTab === 0) {
      this.fetchData(0);
    } else {
      this.fetchData(2);
    }

    this._handleActive(selectedTab);
  };

  _handleActive = (tabIndex) => {
    this.props.history.replace(tabs[tabIndex], this.props.location.state || {});
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  //////
  clickClientsType = (num) => {
    this.setState({
      clientsFilter: num,
    });
    this.fetchData(num);
  };

  clickProspectsType = (num) => {
    this.setState({
      ProspectsFilter: num,
    });
    this.fetchData(num);
  };

  onFilterValueChanged = (e) => {
    if (e.keyCode === 13) {
      let str = e.target.value;
      if (!str) {
        return;
      }
      this.setState({
        searchVal: str,
      });
      this.props.dispatch(companySearch(str)).then((response) => {
        if (response) {
          let res = response.response;
          if (res.length > 0) {
            this.setState({
              searchCompanies: res,
              searchCompaniesLength: res.length,
              openDialog: true,
            });
          } else {
            this.props.dispatch(
              showErrorMessage('No qualified customers were found')
            );
          }
        }
      });
    }
  };

  ////

  render() {
    const {
      classes,
      t,
      // clientListFromStore,
      // prospectListFromStore,
      companyList,
      count,
      canDownload,
      noContractClient,
      noContractClientCount,
      ...props
    } = this.props;
    const {
      selectedTab,
      loading,
      downloading,
      clientsFilter,
      ProspectsFilter,
      searchVal,
      openDialog,
      searchCompanies,
      searchCompaniesLength,
      clientType,
      requestType,
    } = this.state;

    // if (loading && count === 0) {
    //   return (
    //     <div className="flex-child-auto flex-container flex-dir-column">
    //       <Loading />
    //     </div>
    //   );
    // }
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div
          className="flex-container align-middle item-padding"
          style={{ height: 56 }}
        >
          <div className="item-padding">
            <Link to={`/companies/create`}>
              <PrimaryButton style={{ minWidth: 120 }}>
                {t('action:create')}
              </PrimaryButton>
            </Link>
          </div>
          {/* 搜索框 */}
          <div className={classes.searchBox}>
            <div className={classes.search}>
              <IconInput
                name="q"
                style={{ paddingLeft: '2em' }}
                placeholder={'Search client, prospect, or contact person'}
                Icon={Search}
                onKeyDown={this.onFilterValueChanged}
                form="searchForm"
              />
            </div>
          </div>
          {/*  */}
          <div className="flex-child-auto" />
        </div>
        <Divider component="div" />
        <div
          className="flex-container align-justify align-middle"
          style={{ boxShadow: 'inset 0 -1px #e8e8e8' }}
        >
          <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
            <Tabs
              value={selectedTab}
              onChange={this.tabsClickHandler}
              variant="scrollable"
              scrollButtons="off"
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab disabled={requestType} label={t('clients')} />
              <Tab disabled={requestType} label={t('prospect')} />
            </Tabs>
          </div>

          {/*按钮组过滤(初版，待封装优化) */}
          {selectedTab === 0 && (
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
            >
              <Button
                className={clientType === 0 ? classes.btnColor : ''}
                disabled={requestType}
                onClick={() => {
                  this.clickClientsType(0);
                }}
              >
                All Clients
              </Button>
              <Button
                className={clientType === 1 ? classes.btnColor : ''}
                onClick={() => {
                  this.clickClientsType(1);
                }}
                disabled={requestType}
              >
                My Clients
              </Button>
            </ButtonGroup>
          )}
          {selectedTab === 1 && (
            <ButtonGroup
              color="primary"
              aria-label="outlined primary button group"
              style={{ marginRight: '10px' }}
            >
              <Button
                className={clientType === 2 ? classes.btnColor : ''}
                disabled={requestType}
                onClick={() => {
                  this.clickProspectsType(2);
                }}
              >
                All Prospects
              </Button>
              <Button
                className={clientType === 3 ? classes.btnColor : ''}
                disabled={requestType}
                onClick={() => {
                  this.clickProspectsType(3);
                }}
              >
                My Prospects
              </Button>
            </ButtonGroup>
          )}

          {/* 无合同列表 */}
          {noContractClientCount !== 0 &&
          (clientType === 0 || clientType === 1) ? (
            <NoContractClient
              noContractClientCount={noContractClientCount}
              t={t}
            />
          ) : (
            ''
          )}
        </div>
        {selectedTab === 0 && (
          <Clients
            t={t}
            companyListFromStore={companyList}
            clientType={clientType}
            requestType={requestType}
            {...props}
          />
        )}
        {selectedTab === 1 && (
          <Prospect
            t={t}
            companyListFromStore={companyList}
            requestType={requestType}
            {...props}
          />
        )}
        <MyDialog
          btnShow={true}
          show={openDialog}
          modalTitle={`Search Result for "${searchVal}" (${searchCompaniesLength} result) `}
          CancelBtnShow={false}
          SubmitBtnShow={true}
          SubmitBtnMsg={'Close'}
          CancelBtnMsg={'Close'}
          CancelBtnVariant={'contained'}
          handleClose={() => {
            this.handleClose();
          }}
          primary={() => {
            this.setState({
              creating: false,
            });
            this.handleClose();
          }}
        >
          <SearchCompanies searchCompanies={searchCompanies} />
        </MyDialog>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => {
  const authorities = state.controller.currentUser.get('authorities');
  const canDownload =
    !!authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
  return {
    authorities,
    canDownload,
    // clientListFromStore: getAllCompanyList(state),
    // prospectListFromStore: getProspect(state),
    companyList: selectAllCompany(state),
    count: state.model.companies.size,
    noContractClientCount: state.model.noContractClient.size,
    noContractClient: state.model.noContractClient,
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(AllClientsTabs))
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
