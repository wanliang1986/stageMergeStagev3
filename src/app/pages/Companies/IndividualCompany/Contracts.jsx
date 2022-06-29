import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Immutable from 'immutable';

import { getContractById } from '../../../../apn-sdk/client';
import { getContractsListByCompany } from '../../../selectors/contractSelector';
import {
  getContractsByCompany,
  deleteContractById,
} from '../../../actions/clientActions';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

import ContractStatus from './ContractStatus';
import Loading from '../../../components/particial/Loading';
import CreateMsg from '../../../components/createMsg';
import ContractTable from '../../../components/Tables/ContractTable';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import AddContractForm from './AddContractForm';
import ResumeFrame from '../../../components/particial/ContractFrame/LoadableContractFrame';

let status = {};
const columns = [
  {
    colName: 'Service Contract Name',
    colWidth: 200,
    flexGrow: 0,
    col: 'name',
    // type: 'nameButton',
    fixed: true,
  },
  {
    colName: 'startsFrom',
    colWidth: 150,
    flexGrow: 0,
    col: 'startDate',
    type: 'date',
  },
  {
    colName: 'endsOn',
    colWidth: 150,
    flexGrow: 0,
    col: 'endDate',
    type: 'date',
  },
  {
    colName: 'status',
    colWidth: 150,
    flexGrow: 0,
    col: 'status',
    type: 'date',
  },
  {
    colName: 'Fee Type and Note',
    colWidth: 300,
    flexGrow: 0,
    col: 'note',
  },
  {
    colName: 'Service Type',
    colWidth: 200,
    flexGrow: 0,
    col: 'contractType',
    type: 'contractType',
  },
  {
    colName: 'uploadedOn',
    colWidth: 150,
    flexGrow: 0,
    col: 'uploadDate',
  },
  {
    colName: 'fileName',
    colWidth: 280,
    flexGrow: 0,
    col: 'fileName',
    type: 'file',
  },
  // {
  //   colName: 'signee',
  //   colWidth: 180,
  //   flexGrow: 0,
  //   col: 'signees',
  //   type: 'signees',
  //   sortable: true,
  // },

  // {
  //   colName: 'contractType',
  //   colWidth: 180,
  //   flexGrow: 0,
  //   type: 'contractType',
  //   col: 'contractType',
  // },
  // {
  //   colName: 'note',
  //   colWidth: 250,
  //   flexGrow: 0,
  //   col: 'note',
  // },
];

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}
class ClientContacts extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      openContractDialog: false,
      selectedContractId: null,
      openDeleteContractDialog: false,
      selectedToDeleteContractId: null,
      fileToView: null,
      openStatus: false,
      loading: true,
      createMsg: false,
      contractLists: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.props
      .dispatch(getContractsByCompany(this.props.companyId))
      .then((res) => {
        if (res) {
          this.setState({
            loading: false,
            contractLists: Immutable.fromJS(res),
          });
        }
      });
  };

  openAddContract = (selectedContractId) => {
    this.setState({
      openContractDialog: true,
      selectedContractId: selectedContractId || null,
    });
  };

  handleStatusChange = (event, selectedData) => {
    event.preventDefault();
    this.setState({
      anchorEl: event.currentTarget,
      selectedData,
      openStatus: true,
    });
  };

  handleClosePop = () => {
    this.setState({ openStatus: false });
  };
  closeContract = () =>
    this.setState({ openContractDialog: false, selectedContractId: null });

  viewContract = (id) => {
    getContractById(id).then((res) => {
      console.log(res);
      // console.log('view', res.response);
      // var link = document.createElement('a');
      // link.href = res.response.s3url;
      // link.target = '_blank';
      // link.click();
      let file = res;
      file.name = 'pdf';
      file.s3url = res.message;
      let _file = Immutable.fromJS(file);

      this.setState({ fileToView: _file });
    });
  };

  openDeleteContract = (id) => {
    this.setState({
      openDeleteContractDialog: true,
      selectedToDeleteContractId: id,
    });
  };

  closeDeleteContract = () => {
    this.setState({
      openDeleteContractDialog: false,
      selectedToDeleteContractId: null,
    });
  };

  deleteContract = () => {
    this.props
      .dispatch(deleteContractById(this.state.selectedToDeleteContractId))
      .then(() => {
        this.closeDeleteContract();
      });
  };

  onCreateSuccess = () => {
    this.setState(
      {
        createMsg: true,
      },
      () => {
        setTimeout(() => {
          this.setState({ createMsg: false });
        }, 2000);
      }
    );
  };

  closedDeleteMsg = () => {
    this.setState({ createMsg: false });
  };

  render() {
    const { contractList, hasAuthorities, ...props } = this.props;
    const { contractLists } = this.state;
    console.log(contractList);
    console.log(contractLists);
    // console.log('ordered map',contractList);
    // console.log(
    //   'click',
    //   this.state.selectedContractId,
    //   this.state.openContractDialog,
    //   contractList.size
    // );
    const { openStatus, anchorEl, selectedData, loading, createMsg } =
      this.state;
    if (this.props.isLimitUser) {
      return <Redirect to={{ pathname: '/' }} />;
    }
    if (loading === true) {
      return <Loading />;
    }
    if (contractList.size === 0 && loading === false) {
      return (
        <div className="flex-child-auto flex-container flex-dir-column container-padding">
          <Typography variant="h5">{props.t('message:noContracts')}</Typography>
          {hasAuthorities && (
            <div>
              <PrimaryButton
                onClick={() => this.openAddContract()}
                style={{ minWidth: 120 }}
              >
                {props.t('action:Create/Renew Contract')}
              </PrimaryButton>
            </div>
          )}
          <AddContractForm
            open={this.state.openContractDialog}
            {...props}
            t={props.t}
            companyId={this.props.companyId}
            selectedContractId={this.state.selectedContractId}
            onCreateSuccess={() => {
              this.onCreateSuccess();
            }}
            handleRequestClose={this.closeContract}
          />
        </div>
      );
    }
    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            {hasAuthorities && (
              <div>
                <PrimaryButton
                  onClick={() => this.openAddContract()}
                  style={{ minWidth: 120 }}
                >
                  {props.t('action:Create/Renew Contract')}
                </PrimaryButton>
              </div>
            )}
          </div>
          <Divider />
        </div>

        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <ContractTable
            columns={columns}
            // contractList={Immutable.List(contractList)}
            contractList={contractLists}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            onStatusChange={this.handleStatusChange}
            onEdit={(id) => this.openAddContract(id)}
            onView={(id) => this.viewContract(id)}
            onDelete={(id) => this.openDeleteContract(id)}
          />
          <Popover
            open={openStatus}
            anchorEl={anchorEl}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            onClose={this.handleClosePop}
          >
            <ContractStatus
              {...props}
              selectData={selectedData}
              companyId={this.props.companyId}
              onClose={this.handleClosePop}
              fetchData={() => {
                this.fetchData();
              }}
            />
          </Popover>
        </div>

        {this.state.fileToView && (
          <Dialog
            maxWidth="md"
            fullWidth
            open={this.state.fileToView}
            onClose={() => this.setState({ fileToView: null })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div
              className="flex-child-auto flex-container flex-dir-column "
              style={{ overflow: 'hidden', height: 900 }}
            >
              <ResumeFrame resume={this.state.fileToView} />
              <div style={{ position: 'absolute', right: 0 }}>
                <IconButton onClick={() => this.setState({ fileToView: null })}>
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
          </Dialog>
        )}

        <AddContractForm
          open={this.state.openContractDialog}
          {...props}
          t={props.t}
          companyId={this.props.companyId}
          selectedContractId={this.state.selectedContractId}
          onCreateSuccess={() => {
            this.onCreateSuccess();
          }}
          handleRequestClose={this.closeContract}
          fetchData={this.fetchData}
        />
        <Dialog
          open={this.state.openDeleteContractDialog}
          onClose={this.closeDeleteContract}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {props.t('message:deleteContract')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.t('message:dcConfirm')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDeleteContract} color="primary">
              {props.t('action:cancel')}
            </Button>
            <Button
              onClick={this.deleteContract}
              color="primary"
              variant="contained"
              autoFocus
            >
              {props.t('action:delete')}
            </Button>
          </DialogActions>
        </Dialog>

        {createMsg ? (
          <CreateMsg
            onClose={this.closedDeleteMsg}
            companyName={this.props.company.get('name')}
          />
        ) : null}
      </div>
    );
  }
}

ClientContacts.propTypes = {
  contractList: PropTypes.instanceOf(Immutable.List),
  userList: PropTypes.instanceOf(Immutable.List),
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { companyId }) => {
  const currentUser = state.controller.currentUser;
  const currentUserId = currentUser.get('id');
  const salesLead = state.model.companies.getIn([companyId, 'salesLead']);
  const isAM =
    salesLead &&
    salesLead.find((s) => {
      const accountManager = s.get('accountManager');
      return (
        accountManager &&
        accountManager.find((am) => {
          // console.log(am.get('id'));
          return am.get('id') === currentUserId;
        })
      );
    });
  const hasAuthorities =
    (currentUser.get('authorities') &&
      currentUser
        .get('authorities')
        .includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }))) ||
    currentUser
      .get('authorities')
      .includes(Immutable.Map({ name: 'ROLE_ADMIN' })) ||
    isAM;
  return {
    contractList: getContractsListByCompany(state, companyId),
    userList: state.model.users.toList(),
    currentUser: state.controller.currentUser,
    hasAuthorities,
  };
};
export default connect(mapStateToProps)(ClientContacts);
