import React from 'react';
import Immutable from 'immutable';
import { getIndexList } from '../../../utils';
import {
  getEmailBlastRecipients,
  getMyEmailBlastList,
  deleteEmailBlastRecipient,
} from '../../actions/emailAction';
import { getRecipientList } from '../../selectors/emailBlastSelector';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { ADD_SEND_EMAIL_REQUEST } from '../../constants/actionTypes';
import { SEND_EMAIL_TYPES } from '../../constants/formOptions';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';

import RecipientTable from '../../components/Tables/RecipientTable';
import Loading from '../../components/particial/Loading';
import PrimaryButton from '../../components/particial/PrimaryButton';
import PotentialButton from '../../components/particial/PotentialButton';
import AlertDialog from '../../components/particial/AlertDialog';
import AddRecipientForm from './AddRecipientForm';
import ImportRecipientsButton from './ImportRecipientsButton';

const columns = [
  {
    colName: 'name',
    colWidth: 160,
    flexGrow: 2,
    col: 'name',
    sortable: true,
  },
  {
    colName: 'email',
    colWidth: 200,
    flexGrow: 2,
    col: 'email',
    sortable: true,
  },
  {
    colName: 'source',
    colWidth: 160,
    flexGrow: 1,
    col: 'source',
    sortable: true,
  },
];
const styles = {
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    border: '3px dashed #d0d0cb',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,.9)',
    zIndex: 100,
  },
};
let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}
class Details extends React.Component {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      selected: Immutable.Set(),
      dialogOpen: false,
      openEmail: false,
      indexList: getIndexList(
        props.recipientList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},

      handleDeleteRecipient: null,

      openAddForm: false,
    };
  }

  componentDidMount() {
    const { dispatch, emailBlastId, emailBlast } = this.props;
    // dispatch(getHotList(hotListId));
    dispatch(getEmailBlastRecipients(emailBlastId));
    if (!emailBlast) {
      dispatch(getMyEmailBlastList());
    }
  }

  componentWillUnmount() {
    if (this.fTimer) {
      clearTimeout(this.fTimer);
    }
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps', state.filters.toJS());
    const newIndexList = getIndexList(
      props.recipientList,
      state.filters,
      state.colSortDirs
    );
    // console.log(newIndexList.toJS());
    if (!newIndexList.equals(state.indexList)) {
      return {
        indexList: newIndexList,
      };
    }
    return null;
  }

  onFilter = (input) => {
    let filters = this.state.filters;

    const col = input.name;
    const query = input.value;
    if ((filters.get(col) || '') === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }
    console.log('onFilter');
    this.setState({ filters });
  };

  onSortChange = (columnKey, sortDir) => {
    this.setState({
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleSendEmailBlast = () => {
    const { t, dispatch, emailBlastId } = this.props;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailBlast,
        data: {
          emailListIds: emailBlastId,
          t,
        },
      },
    });
  };

  render() {
    const {
      emailBlastId,
      emailBlast,
      recipientList,
      t,
      classes,
      ...props
    } = this.props;

    console.log('props', this.props);

    if (!emailBlast) {
      return <Loading />;
    }

    const {
      indexList,
      filters,
      colSortDirs,

      handleDeleteRecipient,
      openAddForm,
    } = this.state;

    const filteredRecipientList = indexList.map((index) =>
      recipientList.get(index)
    );
    console.log(filteredRecipientList);

    return (
      <div className="flex-child-auto flex-container flex-dir-column vertical-layout">
        <div className="horizontal-layout item-padding align-middle">
          <Typography variant="h6">{emailBlast.get('name')} </Typography>
          <Typography variant="subtitle1">
            {recipientList.size.toLocaleString()} {t('common:recipients')}
          </Typography>
          <div className="flex-child-auto" />
          <PrimaryButton onClick={this.handleSendEmailBlast}>
            {t('action:sendEmail')}
          </PrimaryButton>
        </div>
        <Paper
          className="flex-child-auto flex-container flex-dir-column"
          style={{ position: 'relative', zIndex: 2 }}
          // key={emailBlastId}
        >
          <div
            className="horizontal-layout align-middle"
            style={{ padding: 12 }}
          >
            <Typography variant="h6">{t('common:recipients')} </Typography>
            <div className="flex-child-auto" />
            <div className="horizontal-layout">
              <ImportRecipientsButton
                emailBlastId={emailBlastId}
                {...props}
                t={t}
              />
              <PotentialButton onClick={this.handleAdd} size="small">
                {t('action:add')}
              </PotentialButton>
              {/*<PotentialButton onClick={this.handleImport} size="small">*/}
              {/*  {t('action:import')}*/}
              {/*</PotentialButton>*/}
            </div>
          </div>
          <Divider />
          {this.state.show ? (
            <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
              <RecipientTable
                dataList={filteredRecipientList}
                onFilter={this.onFilter}
                filterOpen={true}
                colSortDirs={colSortDirs}
                onSortChange={this.onSortChange}
                filters={filters}
                columns={columns}
                onScrollEnd={onScrollEnd}
                scrollLeft={status.scrollLeft}
                scrollTop={status.scrollTop}
                onDelete={this.handleDeleteRecipient}
              />
            </div>
          ) : (
            <Loading />
          )}
        </Paper>

        <AlertDialog
          onOK={handleDeleteRecipient}
          onCancel={this.handleCancelDeleteRecipient}
          title={t('message:deleteRecipient')}
          content={t('message:confirmDeleteRecipient')}
          okLabel={t('action:delete')}
          cancelLabel={t('action:cancel')}
        />

        <Dialog open={openAddForm} maxWidth="sm" fullWidth>
          <AddRecipientForm
            emailBlastId={emailBlastId}
            {...props}
            t={t}
            onClose={() => this.setState({ openAddForm: false })}
          />
        </Dialog>
      </div>
    );
  }

  handleAdd = () => {
    console.log('handleAdd');
    this.setState({ openAddForm: true });
  };
  handleImport = () => {
    console.log('handleImport');
  };

  handleDeleteRecipient = (recipientId) => {
    console.log('handleDeleteRecipient', recipientId);
    const { dispatch, emailBlastId } = this.props;

    this.setState({
      handleDeleteRecipient: () =>
        dispatch(deleteEmailBlastRecipient(emailBlastId, recipientId)).then(
          this.handleCancelDeleteRecipient
        ),
    });
  };

  handleCancelDeleteRecipient = () => {
    this.setState({ handleDeleteRecipient: null });
  };
}

function mapStoreStateToProps(state, { match }) {
  const emailBlastId = match.params.emailBlastId;
  const emailBlast = state.relationModel.emailBlasts.get(emailBlastId);
  return {
    emailBlastId,
    emailBlast,
    recipientList: getRecipientList(state, emailBlastId),
  };
}

export default withTranslation(['action', 'message', 'field'])(
  connect(mapStoreStateToProps)(withStyles(styles)(Details))
);
