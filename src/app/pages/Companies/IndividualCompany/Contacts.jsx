import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getIndexList, sortList } from '../../../../utils/index';
import { getClientListByCompany } from '../../../selectors/clientSelector';

import { Redirect } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import FilterIcon from '@material-ui/icons/FilterList';

import ClientsTable from '../../../components/Tables/ClientsTable';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import Loading from '../../../components/particial/Loading';
import CandidateListInClient from '../../Candidates/List/CandidateListInClient';
import AddClientContactForm from './AddClientContactForm';
import AddAddRessForm from '../../../components/Dialog/DialogTemplates/AddAddRessForm';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import ErrorIcon from '@material-ui/icons/Error';
import Button from '@material-ui/core/Button';
import MyDialog from '../../../components/Dialog/myDialog';
import { postClientContactAddress } from '../../../actions/clientActions';
import AddEmailBlastButton3 from '../../Candidates/List/AddEmailBlastButton3';
import memoizeOne from 'memoize-one';
import { getClientContactList } from '../../../actions/clientActions';

const styles = {
  noContactMsg: {
    width: '660px',
    height: '85px',
    border: '1px solid #3398db',
    backgroundColor: 'rgba(51, 152, 219, 0.16);',
    borderRadius: '4px',
    color: '#157fc5',
  },
  icon: {
    width: '10%',
    height: '100%',
    lineHeight: '85px',
    float: 'left',
  },
  msg: {
    width: '90%',
    height: '100%',
    padding: '10px',
    float: 'left',
  },
};
let status = {};
const columns = [
  {
    colName: 'name',
    colWidth: 160,
    flexGrow: 2,
    col: 'name',
    // type: 'nameButton',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Contact Category',
    colWidth: 140,
    flexGrow: 2,
    col: 'contactCategory',
    // type: 'nameButton',
    fixed: true,
    sortable: true,
  },
  // {
  //   colName: 'title',
  //   colWidth: 200,
  //   flexGrow: 2,
  //   col: 'title',
  //   sortable: true,
  // },
  // {
  //   colName: 'submittedCandidates',
  //   colWidth: 110,
  //   flexGrow: 0,
  //   //col: 'title',
  //   col: 'submittedCount',
  //   type: 'candidates',
  // },

  {
    colName: 'email',
    colWidth: 160,
    flexGrow: 1,
    col: 'email',
  },
  {
    colName: 'phone',
    colWidth: 140,
    flexGrow: 1,
    col: 'phone',
  },
  {
    colName: 'Last Contacted Date',
    colWidth: 200,
    flexGrow: 1,
    col: 'lastContactDate',
    type: 'date',
  },
  // {
  //   colName: 'departmentTier1',
  //   colWidth: 120,
  //   flexGrow: 0,
  //   col: 'departmentTier1',
  // },
  // {
  //   colName: 'departmentTier2',
  //   colWidth: 120,
  //   flexGrow: 0,
  //   col: 'departmentTier2',
  // },
  // {
  //   colName: 'departmentTier3',
  //   colWidth: 120,
  //   flexGrow: 0,
  //   col: 'departmentTier3',
  // },
  {
    colName: 'status',
    colWidth: 120,
    flexGrow: 1,
    col: 'active',
    disableSearch: true,
    sortable: true,
    type: 'bool',
  },

  // {
  //   colName: 'wechat',
  //   colWidth: 140,
  //   flexGrow: 1,
  //   col: 'wechat',
  // },

  // {
  //   colName: 'relationshipRating',
  //   colWidth: 120,
  //   flexGrow: 1,
  //   col: 'relationshipRating',
  //   sortable: true,
  // },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class ClientContacts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      indexList: getIndexList(
        props.clientList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},
      clientIdShowTalents: null,

      openContactForm: false,
      selectedClient: null,
      type: '1',
      addAddressDialog: false,
      cityId: null,
      selected: Immutable.Set(),
      loading: true,
      warningOpen: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const indexList = getIndexList(
      props.clientList,
      state.filters,
      state.colSortDirs
    );
    if (!indexList.equals(state.indexList)) {
      return { indexList };
    }
    return null;
  }

  componentWillUnmount() {
    clearTimeout(this.fTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  componentDidMount() {
    this.props
      .dispatch(getClientContactList(this.props.companyId))
      .then((res) => {
        if (res) {
          this.setState({
            loading: false,
          });
        }
      });
  }

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      indexList: getIndexList(
        this.props.clientList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.props.clientList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.clientList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleOpenContactUpsert = (selectedClient) => {
    this.setState({
      openContactForm: true,
      selectedClient,
    });
  };

  handleCloseContactForm = () => {
    // this.setState({
    //   loading: true,
    // });
    // this.props
    //   .dispatch(getClientContactList(this.props.companyId))
    //   .then((res) => {
    //     if (res) {
    //       this.setState({
    //         loading: false,
    //       });
    //     }
    //   });
    this.setState({ openContactForm: false });
  };

  clickedCandidatesNumber = (id) => {
    this.setState({ clientIdShowTalents: id });
  };

  addAddress = () => {
    // this.setState({
    //   openContactForm: false,
    //   addAddressDialog: true,
    // });
    if (!this.state.selectedClient) {
      this.setState({
        warningOpen: true,
      });
    } else {
      this.setState({
        openContactForm: false,
        addAddressDialog: true,
      });
    }
  };

  getLocation = (data) => {
    this.setState({
      cityId: data.cityId,
    });
  };
  getAddress = (val) => {
    this.setState({
      address: val,
    });
  };

  saveAddress = () => {
    let obj = {
      address: this.state.address,
      companyId: this.props.companyId,
      geoInfoENDTO: {
        cityId: this.state.cityId,
      },
      companyAddressType: 'OTHER',
    };
    this.props.dispatch(postClientContactAddress(obj)).then((res) => {
      if (res) {
        this.setState({
          addAddressDialog: false,
          openContactForm: true,
        });
      }
    });
  };

  onSelect = (id) => {
    let selected = this.state.selected;
    if (selected.includes(id)) {
      selected = selected.delete(id);
    } else {
      selected = selected.add(id);
    }
    this.setState({ selected });
  };

  checkAllBoxOnCheckHandler = () => {
    const { selected } = this.state;
    const { clientList } = this.props;
    const clientIds = clientList.map((client) => client.get('id'));
    const filteredSelected = selected.intersect(clientIds);

    if (filteredSelected.size > 0) {
      this.setState({ selected: selected.subtract(filteredSelected) });
    } else {
      this.setState({ selected: selected.union(clientIds) });
    }
  };

  handleClose = () => {
    this.setState({
      warningOpen: false,
    });
  };

  handleConfirm = () => {
    this.setState({
      warningOpen: false,
      openContactForm: false,
      addAddressDialog: true,
    });
  };

  render() {
    const { clientList, onSelect, classes, ...props } = this.props;
    const {
      filterOpen,
      indexList,
      colSortDirs,
      addAddressDialog,
      selected,
      warningOpen,
    } = this.state;
    const filteredSelected = getFilteredSelected(selected, clientList);

    if (this.props.isLimitUser) {
      return <Redirect to={{ pathname: '/' }} />;
    }
    if (this.state.loading) {
      return <Loading />;
    }
    if (
      this.state.show &&
      this.state.loading === false &&
      clientList.size === 0
    ) {
      return (
        <div className="flex-child-auto flex-container flex-dir-column container-padding">
          {/* <Typography variant="h5">{props.t('message:noClients')}</Typography>
          <div>
            <PrimaryButton
              onClick={() => this.handleOpenContactUpsert()}
              style={{ minWidth: 120 }}
            >
              {props.t('action:create')}
            </PrimaryButton>
          </div> */}
          <Dialog open={this.state.openContactForm} fullWidth maxWidth="sm">
            <AddClientContactForm
              {...props}
              client={this.state.selectedClient}
              requiredType={this.state.type}
              addAddress={this.addAddress}
              handleRequestClose={this.handleCloseContactForm}
            />
          </Dialog>
          <MyDialog
            btnShow={true}
            show={addAddressDialog}
            modalTitle={`Add Additional Address`}
            SubmitBtnShow={true}
            SubmitBtnMsg={'Save'}
            SumbitBtnVariant={'contained'}
            CancelBtnShow={true}
            CancelBtnMsg={'Back'}
            CancelBtnVariant={'default'}
            primary={() => {
              this.saveAddress();
            }}
            handleClose={() => {
              this.setState({
                addAddressDialog: false,
                openContactForm: true,
              });
            }}
          >
            <AddAddRessForm
              t={props.t}
              getLocation={(location) => {
                this.getLocation(location);
              }}
              getAddress={(val) => {
                this.getAddress(val);
              }}
            />
          </MyDialog>
          <div className={classes.noContactMsg}>
            <div className={classes.icon}>
              <ErrorIcon
                style={{
                  width: '25px',
                  height: '25px',
                  color: '#3398db',
                  marginLeft: '25px',
                }}
              />
            </div>
            <div className={classes.msg}>
              <p>There is no client contact. </p>
              <p>
                You may want to{' '}
                <Link>
                  <span
                    style={{ fontWeight: '600', color: '#157fc5' }}
                    onClick={() => {
                      this.handleOpenContactUpsert();
                    }}
                  >
                    Create a Contact
                  </span>
                </Link>{' '}
                in order to create a new progress note or job.
              </p>
            </div>
          </div>
        </div>
      );
    }
    const filteredClientList = indexList.map((index) => clientList.get(index));

    let { clientIdShowTalents } = this.state;
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            <div>
              <PrimaryButton
                onClick={() => this.handleOpenContactUpsert()}
                style={{ minWidth: 120 }}
              >
                {props.t('action:create')}
              </PrimaryButton>
            </div>
            <IconButton
              onClick={() => this.setState({ filterOpen: !filterOpen })}
              color={filterOpen ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
            <AddEmailBlastButton3
              talentIds={filteredSelected}
              {...props}
              t={props.t}
            />
          </div>
          <Divider />
        </div>

        {this.state.show ? (
          <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
            <ClientsTable
              columns={columns}
              selected={selected}
              clientList={filteredClientList}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              filters={this.state.filters}
              onEdit={(index) =>
                this.handleOpenContactUpsert(filteredClientList.get(index))
              }
              onSelect={this.onSelect}
              onSelectAll={this.checkAllBoxOnCheckHandler}
              onCandidateClick={this.clickedCandidatesNumber}
            />
          </div>
        ) : (
          <Loading />
        )}
        <Dialog open={clientIdShowTalents !== null} fullWidth maxWidth="md">
          {clientIdShowTalents !== null && (
            <CandidateListInClient
              t={props.t}
              client={filteredClientList.find(
                (c) => c.get('id') === clientIdShowTalents
              )}
              onClose={() => this.setState({ clientIdShowTalents: null })}
            />
          )}
        </Dialog>
        {/* <Dialog open={this.state.openContactForm} fullWidth maxWidth="sm">
          <AddClientContactForm
            {...props}
            client={this.state.selectedClient}
            handleRequestClose={this.handleCloseContactForm}
          />
        </Dialog> */}
        <Dialog open={this.state.openContactForm} fullWidth maxWidth="sm">
          <AddClientContactForm
            client={this.state.selectedClient}
            requiredType={this.state.type}
            addAddress={this.addAddress}
            handleRequestClose={this.handleCloseContactForm}
            {...props}
          />
        </Dialog>
        <MyDialog
          btnShow={true}
          show={addAddressDialog}
          modalTitle={`Add Additional Address`}
          SubmitBtnShow={true}
          SubmitBtnMsg={'Save'}
          SumbitBtnVariant={'contained'}
          CancelBtnShow={true}
          CancelBtnMsg={'Back'}
          CancelBtnVariant={''}
          primary={() => {
            this.saveAddress();
          }}
          handleClose={() => {
            this.setState({
              addAddressDialog: false,
              openContactForm: true,
            });
          }}
        >
          <AddAddRessForm
            t={props.t}
            getLocation={(location) => {
              this.getLocation(location);
            }}
            getAddress={(val) => {
              this.getAddress(val);
            }}
          />
        </MyDialog>
        <Dialog
          open={warningOpen}
          disableBackdropClick
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Add Additional Address'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please note that all the information you just input from the
              previous page will not be saved once you add a new address here.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Back
            </Button>
            <Button onClick={this.handleConfirm} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ClientContacts.propTypes = {
  clientList: PropTypes.instanceOf(Immutable.List),
  userList: PropTypes.instanceOf(Immutable.List),
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { companyId }) => {
  return {
    company_Id: companyId,
    clientList: getClientListByCompany(state, companyId),
    userList: state.model.users.toList(),
    currentUser: state.controller.currentUser,
  };
};
export default connect(mapStateToProps)(withStyles(styles)(ClientContacts));

const getFilteredSelected = memoizeOne((selected, list) => {
  return selected.intersect(list.map((v) => v.get('id')));
});
